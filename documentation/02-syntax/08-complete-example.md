# Complete example

This document uses most of the `.htdc` syntax described in this section.

```text
/filename sample-report
/title The Evolution of Destroyers
/subtitle From torpedo boats to multi-role escorts

/* This source is an illustration; paths are relative to the .htdc file. */

/h1 The Early Years
Early destroyers were designed to counter torpedo boats. Over time they became
larger, faster, and more versatile. Use *italics* for occasional emphasis.

/h2 Design Priorities
/list.ul
- High speed and good seakeeping
- Heavy torpedo batteries
- Dual-purpose artillery
- Enough range for fleet operations

/img ./img/zumwalt_dd.png {
  width: 50%
  title: "A modern destroyer"
}

/h1 The Later Years
/list.ol
- Radar picket duty
- Guided missiles
- Vertical launch systems
- Integrated combat systems

/h4 A Note on Sources
This section is intentionally numbered differently from the others because h4
headings do not receive automatic numbers.
```

Compile it with `htdc2pdf`, passing the source file's directory as `baseDir`:

```ts
import path from "node:path";
import { readFile } from "node:fs/promises";
import { htdc2pdf } from "./src/compiler.ts";

const srcPath = path.resolve("sample-report.htdc");
const src = await readFile(srcPath, "utf-8");

await htdc2pdf(src, { baseDir: path.dirname(srcPath) });
```

For a runnable version, see [`examples/basic`](../../examples/basic).
