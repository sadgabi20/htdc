# Compiling a document

## The usual route: `htdc2pdf`

Most users compile a source string with `htdc2pdf`:

```ts
import path from "node:path";
import { readFile } from "node:fs/promises";
import { htdc2pdf } from "./src/compiler.ts";

const srcPath = path.resolve("paper.htdc");
const src = await readFile(srcPath, "utf-8");

await htdc2pdf(src, { baseDir: path.dirname(srcPath) });
```

- `src` is the document text, not a file path.
- `baseDir` tells HTDC where relative paths (mainly images) are rooted.
- The output is `<filename>.pdf`, written to the current working directory.

If you omit `baseDir`, relative image paths are resolved against the process working directory.

## Output location

The `/filename` directive controls the name only. The PDF is always written relative to where you run the compile command:

```text
/filename paper        ->  paper.pdf
```

Do not include the `.pdf` extension in `/filename`; HTDC adds it.

## HTML without a PDF

If you only want the generated HTML, use `htdc2html`. This is advanced usage; see the [programmatic API](../03-advanced/00-programmatic-api.md).

## Common compile errors

| Error | Cause |
| --- | --- |
| `An HTDC document must have a file name` | No `/filename` directive in the source. |
| `Could not read image "…"` | The image path does not exist relative to `baseDir`. |
| `Unsupported image type "…"` | Use a supported format such as PNG, JPEG, WebP, SVG, or GIF. |
| `Unclosed config object (missing "}")` | A `{ ... }` config was started but not closed. |
| `Config continuation lines must be indented` | A multi-line config has an unindented entry. |

More answers are in the [FAQ](../04-faq/00-faq.md).
