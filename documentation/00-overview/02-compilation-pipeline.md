# How compilation works

Understanding the pipeline helps explain paths, errors, and where output goes.

## 1. Source text

Your `.htdc` file is read as a UTF-8 string. CRLF and LF line endings are both accepted; CRLF is normalized to LF before parsing.

## 2. Parsing

The parser walks the source line by line and produces a flat list of nodes:

- Directives such as `/h1` or `/img`
- Paragraphs from plain text lines
- List items from `- ...` lines
- Comments, which are discarded

Paragraphs and list items are accumulated until a blank line or a new directive flushes them. See [directive anatomy](../02-syntax/00-directive-anatomy.md).

## 3. Composition

The compositor converts parsed nodes into an `HTMLDoc`:

```text
{ fileName, html, baseDir }
```

`fileName` comes from `/filename`. `baseDir` records where relative paths should be resolved from; when compiling from a string it is supplied by the caller.

## 4. Rendering to PDF

The compiler:

1. Loads the default stylesheet (or a custom one), embedding local font files as data URIs.
2. Embeds local `<img src="...">` references as data URIs.
3. Injects the HTML into a Chromium page using Playwright.
4. Switches to print media, waits for fonts and images, and writes `<fileName>.pdf`.

The PDF is written to the **current working directory**, not next to the source file.

## Why `baseDir` matters

`page.setContent()` renders HTML on an `about:blank` page, which has no base URL. A path like `./img/photo.png` therefore cannot resolve on its own. HTDC solves this by embedding local images as data URIs, but it still needs to know which directory the path is relative to.

When you compile from a file, pass its directory:

```ts
await htdc2pdf(src, { baseDir: path.dirname(srcPath) });
```

Without `baseDir`, relative paths are resolved against the process working directory. See [images](../02-syntax/05-images.md) and the [FAQ](../04-faq/00-faq.md).
