<p align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="assets/htdc_logo.svg">
        <img src="assets/htdc_logo_light.svg" alt="HyperText Document Compositor" />
    </picture>
</p>

# HTDC

**HyperText Document Compositor** — a small, Node-based text compositor that turns plain-text markup into print-ready PDFs. It is intended as a simpler alternative to LaTeX for documents that need good typography without a heavy toolchain.

> **Status:** early work in progress (`0.0.1`). Syntax and APIs may still change.

```htdc
/filename my_paper

/title My Paper
/subtitle Made with HTDC

/img ./htdc-logo.png { width: 0.25 }

/h1 Why HTDC?
/h2 The accronym

HTDC stands for HyperText Document Compositor

/h2 The meaning

The name comes from the fact HTDC create an hypertext document (like HTML) and composes it to a print-ready PDF.
```

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

## Documentation

Full documentation is in [`documentation/`](documentation/00-overview/00-documentation.md). Start with:

- [Directive anatomy](documentation/02-syntax/00-directive-anatomy.md) — the `/name.type? txt? {configObject}?` grammar
- [Text and paragraphs](documentation/02-syntax/01-text-and-paragraphs.md), [Headings](documentation/02-syntax/03-headings.md), [Lists](documentation/02-syntax/04-lists.md), [Images](documentation/02-syntax/05-images.md)
- [Config objects](documentation/02-syntax/06-config-objects.md) — CSS-rule-like options on any directive
- [FAQ](documentation/04-faq/00-faq.md)

Runnable [examples](examples/) are also available:

- [`examples/basic`](examples/basic) — a `.htdc` markup document compiled with `htdc2pdf`
- [`examples/api`](examples/api) — advanced programmatic API usage

From the repository root, run one with:

```sh
pnpm dlx tsx examples/basic/index.ts
pnpm dlx tsx examples/api/index.ts
```

## License

[MIT](LICENSE) © 2026 sadgabi20
