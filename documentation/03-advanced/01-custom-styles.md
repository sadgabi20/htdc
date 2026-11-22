# Custom styles

HTDC renders PDFs with CSS. The default stylesheet is `src/styles/default.css`; it defines the page size, margins, fonts, and basic typography.

This is advanced usage. Ordinary documents do not need to touch CSS.

## Loading styles

`loadStyles()` reads a stylesheet and embeds local font files as data URIs:

```ts
import { html2pdf, loadStyles } from "../../src/index.ts";

const css = await loadStyles("./my-styles.css");
await html2pdf(doc.toHTML(process.cwd()), css);
```

Relative font `url(...)` references are resolved against the stylesheet's directory, so you can keep fonts next to the CSS file.

## Passing CSS directly

`html2pdf` accepts a CSS string as its second argument:

```ts
await html2pdf(htmlDoc, `
  @page { size: A4; margin: 2cm; }
  body { font-family: Georgia, serif; }
`);
```

## Default page settings

The bundled stylesheet uses:

- Letter paper size
- 1.91 cm horizontal margins
- 2.54 cm vertical margins
- Libre Caslon Text for body text
- Fraunces for titles
- Justified body text

These are exposed as CSS custom properties in `default.css`, so a custom stylesheet can override them.

## Fonts

Local fonts referenced in CSS are embedded into the PDF. Supported font extensions are `.ttf`, `.otf`, `.woff`, `.woff2`, and `.eot`. Remote font URLs are left untouched and require network access during rendering.

## Status

A user-facing config file for styling (`default.config.css`) is planned but not implemented yet. See the [roadmap](../../ROADMAP.md).
