import path from "node:path";
import * as fs from "node:fs/promises";
import { htdc2pdf } from "../src/index.ts";

const srcPath = path.resolve('./sample2.htdc');
const src = await fs.readFile(srcPath, { encoding: 'utf-8' });

htdc2pdf(src);
