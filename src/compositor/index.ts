import { parse } from "../parser/index.ts";
import { HTDC } from "../api.ts";
import type { ListsTypes } from "../parser/types.ts";
import type { ComposeOptions } from "../types.ts";

export async function htdc2html(src: string, options: ComposeOptions = {}) {
    const doc = new HTDC();
    let currentList: ListsTypes | undefined;

    for (const el of parse(src)) {
        if (el.type !== 'item' && currentList) {
            doc.endList(currentList);
            currentList = undefined;
        }

        switch (el.type) {
            case 'comment': break;
            case 'filename': doc.fileName = el.txt; break;
            case 'title': doc.title(el.txt); break;
            case 'subtitle': doc.subtitle(el.txt); break;
            case 'h1': doc.h1(el.txt); break;
            case 'h2': doc.h2(el.txt); break;
            case 'h3': doc.h3(el.txt); break;
            case 'h4': doc.h4(el.txt); break;
            case 'p': doc.p(el.txt); break;
            case 'item': doc.item(el.txt); break;
            case 'img': doc.img(el.txt, el.width === undefined ? {} : { width: el.width }); break;
            case 'list':
                currentList = el.txt as ListsTypes;
                doc.beginList(currentList);
                break;
        }
    }

    if (currentList) {
        doc.endList(currentList);
    }

    const html = doc.toHTML(options.baseDir);

    return html;
}
