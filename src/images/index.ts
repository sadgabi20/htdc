import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const MIME_TYPES: Readonly<Record<string, string>> = {
    ".apng": "image/apng",
    ".avif": "image/avif",
    ".bmp": "image/bmp",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
};

const IMG_SRC_PATTERN = /(<img\b[^>]*?\ssrc\s*=\s*)(["'])([\s\S]*?)\2/gi;

function decodeUrlToken(value: string): string {
    return value.replace(/\\([\\"'\s(),])/g, "$1");
}

async function toDataUri(rawSrc: string, baseDir: string): Promise<string> {
    const src = decodeUrlToken(rawSrc.trim());

    // Let the browser handle data/blob URLs and remote images itself.
    if (/^(?:data:|blob:|https?:|\/\/)/i.test(src)) return src;

    const filePath = src.split(/[?#]/)[0];
    const extension = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[extension];

    if (!mimeType) {
        const supported = Object.keys(MIME_TYPES).join(", ");
        throw new Error(
            `Unsupported image type "${extension || "(none)"}" for "${src}". ` +
            `Supported types: ${supported}.`
        );
    }

    const resolvedPath = /^file:/i.test(filePath)
        ? fileURLToPath(filePath)
        : path.resolve(baseDir, filePath);

    let bytes: Buffer;
    try {
        bytes = await readFile(resolvedPath);
    } catch (cause) {
        throw new Error(
            `Could not read image "${src}" (resolved to "${resolvedPath}"). ` +
            `Relative paths are resolved against the document directory; pass ` +
            `baseDir to htdc2pdf() or HTMLDoc when compiling from a string.`,
            { cause }
        );
    }

    return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

/**
 * Replace local `<img src="...">` references with embedded data URIs.
 *
 * PDFs are rendered from HTML injected into an `about:blank` page, which has
 * no base URL. Without this, relative image paths silently resolve to nothing.
 */
export async function inlineImages(html: string, baseDir: string = process.cwd()): Promise<string> {
    const matches = [...html.matchAll(IMG_SRC_PATTERN)];
    if (matches.length === 0) return html;

    const replacements = await Promise.all(
        matches.map(match => toDataUri(match[3], baseDir))
    );

    let result = html;
    for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i];
        const start = match.index;
        if (start === undefined) continue;

        // Replace only the attribute value, preserving the tag, prefix and quotes.
        const valueStart = start + match[1].length + match[2].length;
        result = result.slice(0, valueStart)
            + replacements[i]
            + result.slice(valueStart + match[3].length);
    }

    return result;
}
