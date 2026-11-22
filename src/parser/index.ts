import type { ConfigPrimitive, DirectiveConfig, RulesetAST, RuleTypesAST, Token } from "./types.ts";

const HTDC_SYMBOLS = {
    dir: '/',
    twoChar: {
        commentBegin: '/*',
        commentEnd: '*/',
        br: '\n',
    }
};
const TEXT_DIRECTIVES: ReadonlySet<string> = new Set(['filename', 'title', 'subtitle', 'h1', 'h2', 'h3', 'h4']);
const LIST_TYPES: ReadonlySet<string> = new Set(['ul', 'ol', 'dl']);
const IMG_DIRECTIVE = 'img';

function logError(msg: string, options?: { pos?: { line: number, char: number } }) {
    const loc = options?.pos ? `${options.pos.line}:${options.pos.char} — ` : '';
    console.error(`\x1b[31m\x1b[1mERROR\x1b[0m  ${loc}${msg}`);
    return
}

interface ConfigBounds {
    start: number,
    end: number,
}

/** Config objects are flat, so the last `{ ... }` pair in the text is the config. */
function findConfigBounds(text: string): ConfigBounds | undefined {
    const end = text.lastIndexOf('}');
    if (end <= 0) return undefined;

    const start = text.lastIndexOf('{', end - 1);
    if (start < 0) return undefined;

    // A bare brace pair in the text (e.g. `{braces}`) is not a config object.
    const body = text.slice(start + 1, end).trim();
    if (body !== '' && !body.includes(':')) return undefined;

    return { start, end };
}

/** Split config entries on `;`, `,` or a newline, ignoring separators in quotes. */
function splitConfigPairs(source: string): string[] {
    const pairs: string[] = [];
    let current = '';
    let quote: '"' | "'" | undefined;
    let escaped = false;

    for (const char of source) {
        if (escaped) {
            current += char;
            escaped = false;
            continue;
        }

        if (char === '\\' && quote) {
            current += char;
            escaped = true;
            continue;
        }

        if (quote) {
            current += char;
            if (char === quote) quote = undefined;
            continue;
        }

        if (char === '"' || char === "'") {
            quote = char;
            current += char;
            continue;
        }

        if (char === ';' || char === ',' || char === '\n') {
            pairs.push(current);
            current = '';
            continue;
        }

        current += char;
    }

    if (current.trim()) pairs.push(current);
    return pairs;
}

function parseConfigValue(raw: string): ConfigPrimitive {
    const value = raw.trim();
    const quoted = /^(['"])([\s\S]*)\1$/.exec(value);
    if (quoted) return quoted[2].replace(/\\([\\"'])/g, '$1');

    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;

    // CSS-style percentages are normalized to fractions of 1 (e.g. 50% -> 0.5).
    if (/^-?(?:\d+\.?\d*|\.\d+)%$/.test(value)) return Number(value.slice(0, -1)) / 100;
    if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)) return Number(value);

    return value;
}

function parseConfig(source: string, line: number): DirectiveConfig {
    const config: DirectiveConfig = {};

    for (const raw of splitConfigPairs(source)) {
        const entry = raw.trim();
        if (!entry) continue;

        const colon = entry.indexOf(':');
        if (colon < 0 || !entry.slice(0, colon).trim()) {
            logError(`Invalid config entry "${entry}" (expected key: value)`, { pos: { line, char: 1 } });
            continue;
        }

        config[entry.slice(0, colon).trim()] = parseConfigValue(entry.slice(colon + 1));
    }

    return config;
}

interface ParsedDirective {
    name: string,
    variant?: string,
    txt: string,
    config?: DirectiveConfig,
}

/** Parse `/name.type? txt? {configObject}?` into its parts. */
function parseDirectiveStatement(statement: string, line: number): ParsedDirective | undefined {
    const match = /^\/([a-zA-Z0-9_-]+)(?:\.([a-zA-Z0-9_.-]+))?(?:\s+([\s\S]*))?$/.exec(statement);
    if (!match) return undefined;

    let txt = (match[3] ?? '').trim();
    let config: DirectiveConfig | undefined;
    const bounds = findConfigBounds(txt);

    if (bounds) {
        config = parseConfig(txt.slice(bounds.start + 1, bounds.end), line);
        txt = (txt.slice(0, bounds.start) + txt.slice(bounds.end + 1)).trim();
    }

    return { name: match[1], variant: match[2], txt, config };
}

/** True when the statement ends with an opening `{` that has no closing `}` yet. */
function hasUnclosedBrace(text: string): boolean {
    const open = text.lastIndexOf('{');
    return open >= 0 && text.indexOf('}', open) < 0;
}

/** Consume indented continuation lines of a multi-line config object. */
function collectDirective(lines: string[], start: number) {
    let statement = lines[start];
    let end = start;

    // The opening brace may start the directive or begin the next indented line.
    const nextLine = lines[start + 1];
    const openingBraceNextLine = nextLine !== undefined && /^[ \t]*\{/.test(nextLine);
    if (!hasUnclosedBrace(statement) && !openingBraceNextLine) return { statement, end };

    while (end + 1 < lines.length) {
        const next = lines[end + 1];
        if (next.trim() === '') break;

        // A bare closing brace is conventionally flush with the directive.
        // Every other continuation line must be indented.
        const bareCloser = next.trim() === '}' && hasUnclosedBrace(statement);
        const nextIsDirective = next.startsWith(HTDC_SYMBOLS.dir);
        if (!bareCloser && !/^[ \t]/.test(next)) {
            if (!nextIsDirective) {
                logError('Config continuation lines must be indented', { pos: { line: end + 2, char: 1 } });
            }
            break;
        }

        end++;
        statement += '\n' + next;
        if (findConfigBounds(statement)) break;
    }

    return { statement, end };
}

function configWidth(config: DirectiveConfig | undefined): number | undefined {
    const value = config?.width;
    return typeof value === 'number' && Number.isFinite(value) && value >= 0
        ? value
        : undefined;
}

/** Split `/img <path> [width]` into its path and optional width fraction. */
function parseImageArgs(txt: string): { path: string, width?: number } {
    const parts = txt.trim().split(/\s+/).filter(Boolean);
    const last = parts[parts.length - 1];
    const widthMatch = last && /^(\d*\.?\d+)(%)?$/.exec(last);

    if (widthMatch && parts.length > 1) {
        const value = Number(widthMatch[1]);
        if (Number.isFinite(value) && value >= 0) {
            parts.pop();
            return {
                path: parts.join(' '),
                width: widthMatch[2] ? value / 100 : value,
            };
        }
    }

    return { path: parts.join(' ') };
}

export function tokenize(src: string): Token[] {
    const tokens: Token[] = [];
    const twoCharValues = new Set(Object.values(HTDC_SYMBOLS.twoChar ?? {}));
    const singleCharValues = new Set(
        Object.entries(HTDC_SYMBOLS)
            .filter(([key]) => key !== 'twoChar')
            .map(([, val]) => val)
    );

    let line = 1;
    let char = 1;
    let i = 0;

    while (i < src.length) {
        const c = src[i];

        if (c === '\r') {
            i++;
            continue;
        }

        if (c === '\n') {
            tokens.push({ type: 'SYMBOL', value: c, line, char });
            line++;
            char = 1;
            i++;
            continue;
        }

        if (/\s/.test(c)) {
            tokens.push({ type: 'SPACE', value: c, line, char });
            char++;
            i++;
            continue;
        }

        if (i + 1 < src.length) {
            const twoChar = src.slice(i, i + 2);
            if (twoCharValues.has(twoChar)) {
                tokens.push({ type: 'SYMBOL', value: twoChar, line, char });
                i += 2;
                char += 2;
                continue;
            }
        }

        if (singleCharValues.has(c)) {
            tokens.push({ type: 'SYMBOL', value: c, line, char });
            i++;
            char++;
            continue;
        }

        if (/[a-zA-Z0-9_-]/.test(c)) {
            const startChar = char;
            let value = '';

            while (i < src.length && /[a-zA-Z0-9_-]/.test(src[i])) {
                value += src[i];
                i++;
                char++;
            }

            tokens.push({ type: 'IDENT', value, line, char: startChar });
            continue;
        }

        // Advance past unexpected characters so the loop cannot hang
        tokens.push({ type: 'UNKNOWN', value: c, line, char });
        i++;
        char++;
    }

    return tokens;
}

export function parse(src: string) {
    const lines = src.replace(/\r\n?/g, '\n').split('\n');
    const ast: RulesetAST[] = [];

    let paragraph: string[] = [];
    let listType: string | undefined;
    let listItem: string[] | undefined;

    function flushParagraph() {
        if (paragraph.length === 0) return;
        ast.push({ type: 'p', txt: paragraph.join(' ') });
        paragraph = [];
    }

    function flushItem() {
        if (!listItem) return;
        ast.push({ type: 'item', txt: listItem.join(' ') });
        listItem = undefined;
    }

    function endList() {
        flushItem();
        listType = undefined;
    }

    function flushAll() {
        flushParagraph();
        endList();
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.trim() === '') {
            flushAll();
            continue;
        }

        if (line.startsWith(HTDC_SYMBOLS.twoChar.commentBegin)) {
            flushAll();

            let body = line.slice(HTDC_SYMBOLS.twoChar.commentBegin.length);
            let end = body.indexOf(HTDC_SYMBOLS.twoChar.commentEnd);

            if (end >= 0) {
                ast.push({ type: 'comment', txt: body.slice(0, end) });
                continue;
            }

            while (i + 1 < lines.length) {
                i++;
                const nextLine = lines[i];
                end = nextLine.indexOf(HTDC_SYMBOLS.twoChar.commentEnd);

                if (end >= 0) {
                    body += '\n' + nextLine.slice(0, end);
                    break;
                }

                body += '\n' + nextLine;
            }

            ast.push({ type: 'comment', txt: body });
            continue;
        }

        if (line.startsWith(HTDC_SYMBOLS.dir)) {
            const startLine = i + 1;
            const collected = collectDirective(lines, i);
            i = collected.end;

            if (hasUnclosedBrace(collected.statement)) {
                logError('Unclosed config object (missing "}")', { pos: { line: startLine, char: 1 } });
            }

            const parsed = parseDirectiveStatement(collected.statement, startLine);
            if (!parsed) {
                logError(`Invalid directive "${collected.statement.split('\n')[0]}"`, { pos: { line: startLine, char: 1 } });
                continue;
            }

            const { name, variant, txt, config } = parsed;

            if (name === 'list') {
                const listKind = variant ?? txt;
                if (!LIST_TYPES.has(listKind)) {
                    logError(`Unknown list type "${listKind}" (expected ul, ol or dl)`, { pos: { line: startLine, char: 1 } });
                    continue;
                }

                flushAll();
                listType = listKind;
                ast.push({ type: 'list', txt: listKind, variant, config });
                continue;
            }

            if (TEXT_DIRECTIVES.has(name)) {
                flushAll();
                ast.push({ type: name as RuleTypesAST, txt, variant, config });
                continue;
            }

            if (name === IMG_DIRECTIVE) {
                flushAll();
                const image = parseImageArgs(txt);

                if (!image.path) {
                    logError('/img requires an image path', { pos: { line: startLine, char: 1 } });
                    continue;
                }

                const width = configWidth(config) ?? image.width;
                ast.push({
                    type: 'img',
                    txt: image.path,
                    variant,
                    config: width === undefined ? config : { ...config, width },
                    width,
                });
                continue;
            }

            logError(`Unknown directive "/${name}"`, { pos: { line: startLine, char: 1 } });
        }

        if (listType) {
            const item = /^[ \t]*-[ \t]+([\s\S]*)$/.exec(line);

            if (item) {
                flushItem();
                listItem = [item[1].trim()];
            } else if (listItem) {
                listItem.push(line.trim());
            } else {
                listItem = [line.trim()];
            }

            continue;
        }

        paragraph.push(line.trim());
    }

    flushAll();

    return ast;
}
