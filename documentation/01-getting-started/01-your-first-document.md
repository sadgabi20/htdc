# Your first document

Create `paper.htdc` with the following content:

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
```

Two rules are worth noticing immediately:

1. `/filename` is **required**; it becomes the PDF file name.
2. Plain text lines form paragraphs; blank lines separate them.

## Compile it

From the repository root, create `compile.ts`:

```ts
import path from "node:path";
import { readFile } from "node:fs/promises";
import { htdc2pdf } from "./src/compiler.ts";

const srcPath = path.resolve("paper.htdc");
const src = await readFile(srcPath, "utf-8");

await htdc2pdf(src, { baseDir: path.dirname(srcPath) });
```

Then run:

```sh
pnpm dlx tsx compile.ts
```

This produces `paper.pdf` in the current working directory.

For the full markup reference, continue with [directive anatomy](../02-syntax/00-directive-anatomy.md).
