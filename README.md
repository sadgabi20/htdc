<p align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="assets/htdc_logo.svg">
        <img src="assets/htdc_logo_light.svg" alt="HyperText Document Compositor" />
    </picture>
</p>

# HTDC

**HyperText Document Compositor** — a small, Node-based text compositor that turns plain-text markup into print-ready PDFs. It is intended as a simpler alternative to LaTeX for documents that need good typography without a heavy toolchain.

> **Status:** early work in progress (`0.0.1`). Syntax and APIs may still change.

## Features

- Write documents in a readable `.htdc` file, or build them programmatically in JavaScript/TypeScript.
- Automatically numbered headings, justified paragraphs, ordered/unordered lists, and embedded images.
- HTML + CSS as an intermediate format, rendered to PDF with Playwright and Chromium.
- Bundled print stylesheet with embedded Source Serif 4 and Fraunces fonts, so PDFs look the same everywhere.
- ESM package written in TypeScript, with helpers for custom stylesheets.

## Requirements

- Node.js with ESM support
- [pnpm](https://pnpm.io/) 12.21.0 (pinned by the repository's `packageManager` field)
- Chromium for Playwright:

  ```sh
  pnpm exec playwright install chromium
  ```

## Getting started

HTDC is under active development, so the recommended way to use it is from source:

```sh
git clone https://github.com/sadgabi20/htdc.git
cd htdc
pnpm install
pnpm exec playwright install chromium
```

Create a document called `paper.htdc`:

```text
/filename paper
/title A Short Paper
/subtitle Written with HTDC

/h1 Getting Started
Write paragraphs as plain lines of text. Consecutive lines are joined into one
paragraph, and a blank line starts a new one.

Use *asterisks* for italics.

/h2 A List
/list.ul
- First item
- Second item

/* This is a comment and will not appear in the PDF. */
```

Then compile it from a script in the repository:

```ts
import path from "node:path";
import { readFile } from "node:fs/promises";
import { htdc2pdf } from "./src/compiler.ts";

const srcPath = path.resolve("paper.htdc");
const src = await readFile(srcPath, "utf-8");
await htdc2pdf(src, { baseDir: path.dirname(srcPath) });
```

`baseDir` tells HTDC where relative paths (such as image paths) are rooted. Without it they are resolved against the current working directory.

Run it with a TypeScript-capable runner, for example:

```sh
pnpm dlx tsx script.ts
```

This writes `paper.pdf` to the current working directory.

## Document syntax

HTDC syntax is command-driven, each command following a shared common syntax:

```text
/name.type? txt? {configObject}?
```

where:
- `name`: the name of the command
- `type`: an optional type if `name` supports it
- `txt`: in-line text as the main argument where supported, processed as a text string until a line break
- `configObject|`: optional configuration arguments

#### Commands and markup:

| Syntax | Meaning |
| --- | --- |
| `/filename txt` | Base name of the output file (`name.pdf`). Required. |
| `/title txt`, `/subtitle txt` | Document title and subtitle. |
| `/h1 txt` … `/h4 txt` | Numbered headings (for example `1`, `1.1`, `1.1.1`). |
| Plain text | Paragraph text; consecutive lines are joined, blank lines separate paragraphs. |
| `/list` | Start an unordered (`.ul`), ordered (`.ol`), or definition list (`.dl`). Type is required. |
| `- text` | An item in the current list. |
| `*text*` | Italic text. |
| `/img path [config]` | Insert an image. `path` is relative to the `.htdc` file; config supports `width` (a fraction or percentage) and `title`. |
| `/* text */` | Comment; may span multiple lines. |

### Config objects

A directive may end with a flat, CSS-rule-like `{ ... }` object. Entries are `key: value` pairs separated by `;`, `,`, or a newline. Numbers, `true`/`false`, `null`, quoted strings, and percentages are converted to values; percentages become fractions (`50%` → `0.5`).

```text
/img ./img/my-img.png { width: 0.25; title: "Diagram" }

/img ./img/my-img.png {
  width: 50%
  title: "Diagram"
}
```

Multi-line configs must be indented; a bare closing `}` may be flush with the directive. Because config objects cannot be nested, the **last** `{ ... }` pair in the directive is treated as the config, so braces in the text portion are safe.

Local images are embedded into the PDF as data URIs, so the output does not depend on the image files remaining in place. Remote URLs (`https://…`) and existing `data:` URIs are passed through to the browser.

## Programmatic API

```ts
import { html2pdf, HTDC } from "./src/index.ts";

const doc = new HTDC();
doc.fileName = "paper"; // required before rendering

doc.title("A Short Paper");
doc.h1("Getting Started");
doc.p("Write paragraphs with *italics* and let HTDC handle the layout.");

doc.beginList("ul");
doc.item("First item");
doc.item("Second item");
doc.endList("ul");

doc.img("./img/diagram.png", { width: 0.5, title: "Diagram" });

await html2pdf(doc.toHTML(process.cwd()));
```

`doc.toHTML(baseDir?)` records the directory used to resolve local image paths. You can also set `baseDir` directly on the `HTMLDoc` passed to `html2pdf`.

Other entry points:

- `htdc2pdf(src, options?)` — parse a `.htdc` source string and write the PDF directly; pass `{ baseDir }` for relative image paths.
- `htdc2html(src, options?)` — parse source into `{ fileName, html, baseDir }` without rendering a PDF.
- `html2pdf(htmlDoc, css?)` — render an `HTMLDoc`, optionally with custom CSS.
- `inlineImages(html, baseDir?)` — embed local `<img src="…">` references as data URIs.
- `loadStyles(path?)` / `inlineFonts(css, baseDir)` — load a stylesheet and embed its local font files. The default stylesheet lives at `src/styles/default.css`.

## Documentation

**Work in progress.** The full documentation (complete syntax reference, styling and configuration guide) has not been written yet. In the meantime, the runnable [examples](examples/) are the best reference:

- [`examples/basic`](examples/basic) — a `.htdc` markup document (including an `/img` directive) compiled with `htdc2pdf`.
- [`examples/api`](examples/api) — the same kind of document built with the `HTDC` class and rendered with `html2pdf`.

From the repository root, run one with:

```sh
pnpm dlx tsx examples/basic/index.ts
pnpm dlx tsx examples/api/index.ts
```

## License

[MIT](LICENSE) © 2026 sadgabi20
