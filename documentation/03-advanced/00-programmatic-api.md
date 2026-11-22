# Programmatic API (advanced)

Most users should write a `.htdc` file and compile it with `htdc2pdf`. The programmatic API is for generating documents dynamically, integrating HTDC into a build step, or customizing HTML/CSS before printing.

For a runnable example, see [`examples/api`](../../examples/api).

## Building a document

```ts
import { html2pdf, HTDC } from "../../src/index.ts";

const doc = new HTDC();
doc.fileName = "paper"; // required

doc.title("A Short Paper");
doc.h1("Getting Started");
doc.p("Write paragraphs with *italics*.");

doc.beginList("ul");
doc.item("First item");
doc.item("Second item");
doc.endList("ul");

doc.img("./img/photo.png", { width: 0.5, title: "Photo" });

await html2pdf(doc.toHTML(process.cwd()));
```

`HTDC` is chainable: methods such as `title`, `h1`, `p`, and `item` return `this`.

## Entry points

| Function | Purpose |
| --- | --- |
| `htdc2pdf(src, options?)` | Parse `.htdc` text and write the PDF. Pass `{ baseDir }` for relative paths. |
| `htdc2html(src, options?)` | Parse `.htdc` text into `{ fileName, html, baseDir }` without rendering. |
| `html2pdf(htmlDoc, css?)` | Render an `HTMLDoc`; optionally supply custom CSS. |
| `inlineImages(html, baseDir?)` | Replace local `<img src="…">` references with data URIs. |
| `loadStyles(path?)` / `inlineFonts(css, baseDir)` | Load a stylesheet and embed its local font files. |

## `HTMLDoc`

```ts
interface HTMLDoc {
  fileName: string;
  html: string;
  baseDir?: string;
}
```

`baseDir` is used to resolve local images when `html2pdf` renders the document. `doc.toHTML(baseDir?)` sets it for you.

## Config objects from source vs. method arguments

In `.htdc` source, options are written as config objects:

```text
/img ./img/photo.png { width: 0.5; title: "Photo" }
```

When using the API directly, pass the equivalent object as a method argument:

```ts
doc.img("./img/photo.png", { width: 0.5, title: "Photo" });
```

Parsed config values are plain strings, numbers, booleans, or `null`. See [config objects](../02-syntax/06-config-objects.md) for the parsing rules.

## When to use which route

| Goal | Use |
| --- | --- |
| Write a normal document | `.htdc` + `htdc2pdf` |
| Generate content from data | `HTDC` class + `html2pdf` |
| Inspect or transform HTML | `htdc2html` |
| Custom fonts or page setup | `html2pdf` with custom CSS |

See [custom styles](01-custom-styles.md) for stylesheet details.
