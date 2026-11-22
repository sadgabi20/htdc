import path from "node:path";
import * as fs from "node:fs/promises";
import { htdc2pdf } from "../../src/compiler.ts";

const srcPath = path.resolve('./examples/basic/basic.htdc');
const src = await fs.readFile(srcPath, { encoding: 'utf-8' });

await htdc2pdf(src, { baseDir: path.dirname(srcPath) });
