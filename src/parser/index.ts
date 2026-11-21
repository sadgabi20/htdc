import type { RulesetAST, RuleTypesAST, Token } from "./types.ts";

const HTDC_SYMBOLS = {
    dir: '/',
    twoChar: {
        commentBegin: '/*',
        commentEnd: '*/',
        br: '\n',
    }
};
const TEXT_DIRECTIVES: ReadonlySet<string> = new Set(['filename', 'title', 'subtitle', 'h1', 'h2', 'h3', 'h4']);
const LIST_DIRECTIVE = /^list\.(ul|ol|dl)$/;

function logError(msg: string, options?: { pos?: { line: number, char: number } }) {
    const loc = options?.pos ? `${options.pos.line}:${options.pos.char} — ` : '';
    console.error(`\x1b[31m\x1b[1mERROR\x1b[0m  ${loc}${msg}`);
    return
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
            // Ignore CR so CRLF documents are tokenized the same as LF documents
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
            const directive = /^\/([a-zA-Z0-9_.-]+)(?:[ \t]+([\s\S]*))?$/.exec(line);

            if (directive) {
                const name = directive[1];
                const txt = (directive[2] ?? '').trim();
                const list = LIST_DIRECTIVE.exec(name);

                if (list) {
                    flushAll();
                    listType = list[1];
                    ast.push({ type: 'list', txt: listType });
                    continue;
                }

                if (TEXT_DIRECTIVES.has(name)) {
                    flushAll();
                    ast.push({ type: name as RuleTypesAST, txt });
                    continue;
                }
            }
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
