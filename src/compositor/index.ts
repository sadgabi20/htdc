import { parse } from "../parser/index.ts";
import { HTDC } from "../api.ts";
import type { ListsTypes } from "../parser/types.ts";
import { createPDF } from "../compiler.ts";
import path from "node:path";
import * as fs from "node:fs/promises";
import { html2pdf } from "../index.ts";

const CSS_PATH = path.resolve(import.meta.dirname, '../styles/default.css');
const CSS = await fs.readFile(CSS_PATH, { encoding: 'utf-8' });

export async function composite(src: string) {
    const doc = new HTDC();
    let currentList: ListsTypes | undefined;

    for (const el of parse(src)) {
        if (el.type !== 'item' && currentList) {
            doc.endList(currentList);
            currentList = undefined;
        }

        switch (el.type) {
            case 'comment': break;
            case 'title': doc.title(el.txt); break;
            case 'subtitle': doc.subtitle(el.txt); break;
            case 'h1': doc.h1(el.txt); break;
            case 'h2': doc.h2(el.txt); break;
            case 'h3': doc.h3(el.txt); break;
            case 'h4': doc.h4(el.txt); break;
            case 'p': doc.p(el.txt); break;
            case 'item': doc.item(el.txt); break;
            case 'list':
                currentList = el.txt as ListsTypes;
                doc.beginList(currentList);
                break;
        }
    }

    if (currentList) {
        doc.endList(currentList);
    }

    await createPDF(doc.toHTML(), CSS);
    const html = doc.toHTML();
    const pdf = html2pdf(html, CSS);
}
