# FAQ

## General

### Is HTDC a Markdown processor?

No. It uses slash-prefixed directives such as `/h1` and `/list.ul`. Some ideas are similar, but the syntax and parsing rules are HTDC-specific. Start with [directive anatomy](../02-syntax/00-directive-anatomy.md).

### Why use HTDC instead of LaTeX?

HTDC aims to be simpler for text-centric documents: no preamble, no build-tool configuration, and readable source. It is not a full LaTeX replacement; math, tables, floats, and bibliographies are not implemented yet.

### Is it stable?

No. HTDC is pre-1.0 (`0.0.1`). Syntax and APIs may change. See the [roadmap](../../ROADMAP.md).

## Writing documents

### Do I need a `/filename` directive?

Yes. It is required and determines the output PDF name. See [document metadata](../02-syntax/02-document-metadata.md).

### Why are my heading numbers missing?

`/h1`, `/h2`, and `/h3` are numbered automatically. `/h4` is not numbered. Do not type numbers into heading text yourself. See [headings](../02-syntax/03-headings.md).

### Why doesn't `**bold**` work?

Only `*italic*` is supported today. There is no bold, inline code, or link syntax yet. See [text and paragraphs](../02-syntax/01-text-and-paragraphs.md).

### Why aren't italics working in my title?

Inline italics are parsed only in paragraphs and list items, not in `/title`, `/subtitle`, or headings.

### How do I end a list?

Insert a blank line or start another directive. There is no explicit end-list directive in `.htdc`. See [lists](../02-syntax/04-lists.md).

### Can I nest lists or config objects?

No. Lists are flat, and config objects are flat. The parser uses the last flat `{ ... }` pair as the config. See [config objects](../02-syntax/06-config-objects.md).

### Can I use braces in normal text?

Yes. A brace pair is treated as config only if it is the last pair on the directive and contains `:`. For example, `Using {braces} here` stays text. See [config objects](../02-syntax/06-config-objects.md).

### Why is my multi-line config being read as text?

Config entries must be indented. A bare closing `}` may be flush left, but lines such as `width: 0.25` need leading whitespace. See [config objects](../02-syntax/06-config-objects.md).

## Images and paths

### Why is my image missing from the PDF?

Check that:

1. The path is relative to the `.htdc` file (or the `baseDir` you pass).
2. You passed `baseDir` when compiling from a string.
3. The file exists and uses a [supported format](../02-syntax/05-images.md#supported-formats).
4. The console did not report `Could not read image` or `Unsupported image type`.

### Why does a relative path work in one script but not another?

Paths are resolved against `baseDir`, which defaults to the process working directory. If you run from a different folder, the same relative path can point somewhere else. Pass `path.dirname(srcPath)` explicitly.

### Why is my image very small or very large?

The default width is 25% of the content width. Set `width` in a config object:

```text
/img ./img/photo.png { width: 0.75 }
```

Percentages such as `75%` are also accepted. See [images](../02-syntax/05-images.md).

### Can I use remote images?

Yes, `https://` and `//…` URLs are passed to the browser. The render machine needs network access, and the image must finish loading before the PDF is written. Local images are preferred for reproducible output.

## Output and customization

### Where is the PDF written?

To the current working directory, named `<filename>.pdf`. The location of the `.htdc` file does not change this. See [compiling](../01-getting-started/02-compiling.md).

### Can I change the page size or fonts?

Yes, but it is advanced usage. Pass custom CSS to `html2pdf` via `loadStyles`. See [custom styles](../03-advanced/01-custom-styles.md).

### Does HTDC support tables, a table of contents, references, or page breaks?

Not yet. Those are on the [roadmap](../../ROADMAP.md).

### Should I use the npm package?

The published npm package is currently a placeholder. Install from the repository for now. See [installation](../01-getting-started/00-installation.md).

### Where can I see real documents?

See the runnable [`examples`](../../examples/) directory:

- [`examples/basic`](../../examples/basic) — `.htdc` markup compiled with `htdc2pdf`
- [`examples/api`](../../examples/api) — programmatic API usage
