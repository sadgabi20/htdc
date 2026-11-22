import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const DEFAULT_STYLES_PATH = path.resolve(import.meta.dirname, "./default.css");

const FONT_MIME_TYPES: Record<string, string> = {
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".eot": "application/vnd.ms-fontobject",
};

const URL_PATTERN = /url\(\s*(?:(['"])([\s\S]*?)\1|([^'")]+))\s*\)/gi;

const styleCache = new Map<string, Promise<string>>();

function decodeUrlToken(value: string): string {
    return value.replace(/\\([\\"'\s(),])/g, "$1");
}

function toDataUri(match: RegExpMatchArray, baseDir: string): Promise<string> | string {
    const rawUrl = (match[2] ?? match[3] ?? "").trim();

    if (/^(?:data:|blob:|https?:|\/\/)/i.test(rawUrl)) return match[0];

    const extension = path.extname(rawUrl.split(/[?#]/)[0]).toLowerCase();
    const mimeType = FONT_MIME_TYPES[extension];
    if (!mimeType) return match[0];

    const fontPath = decodeUrlToken(rawUrl);
    const resolvedPath = /^file:/i.test(fontPath)
        ? fileURLToPath(fontPath)
        : path.resolve(baseDir, fontPath);

    return readFile(resolvedPath).then(font => {
        return `url("data:${mimeType};base64,${font.toString("base64")}")`;
    });
}

/**
 * Replace local font `url(...)` references with embedded data URIs.
 *
 * CSS injected with `page.addStyleTag({ content })` has no base URL, so
 * relative font paths cannot be resolved by the browser. Embedding the font
 * bytes makes the stylesheet portable across machines and installations.
 */
export async function inlineFonts(css: string, baseDir: string): Promise<string> {
    const matches = [...css.matchAll(URL_PATTERN)];
    if (matches.length === 0) return css;

    const replacements = await Promise.all(
        matches.map(match => toDataUri(match, baseDir))
    );

    let result = css;
    for (let i = matches.length - 1; i >= 0; i--) {
        const start = matches[i].index;
        if (start === undefined) continue;
        result = result.slice(0, start) + replacements[i] + result.slice(start + matches[i][0].length);
    }

    return result;
}

/** Read a stylesheet and embed any local fonts referenced by it. Results are cached. */
export function loadStyles(stylesPath: string = DEFAULT_STYLES_PATH): Promise<string> {
    const resolvedPath = path.resolve(stylesPath);

    let pending = styleCache.get(resolvedPath);
    if (!pending) {
        pending = readFile(resolvedPath, "utf-8").then(css => {
            return inlineFonts(css, path.dirname(resolvedPath));
        });
        styleCache.set(resolvedPath, pending);
        pending.catch(() => styleCache.delete(resolvedPath));
    }

    return pending;
}
