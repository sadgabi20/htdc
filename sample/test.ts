import path from "node:path";
import * as fs from "node:fs/promises";
import { parse } from "../src/parser/index.ts";

const srcPath = path.resolve('./sample2.htdc');
const src = await fs.readFile(srcPath, { encoding: 'utf-8' });

console.log(parse(src));
