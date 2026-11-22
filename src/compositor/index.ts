import { parse } from "../parser/index.ts";
import { HTDC } from "../api.ts";
import type { ListsTypes, RulesetAST } from "../parser/types.ts";
import type { ComposeOptions, ImgConfig, ParagraphConfig } from "../types.ts";

function toImgConfig(el: RulesetAST): ImgConfig {
    const config = el.config ?? {};
    const width = el.width ?? (typeof config.width === 'number' ? config.width : undefined);

    return {
        ...(typeof config.title === 'string' ? { title: config.title } : {}),
        ...(width === undefined ? {} : { width }),
    };
}

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
            case 'title': doc.title(el.txt, el.config ?? {}); break;
            case 'subtitle': doc.subtitle(el.txt, el.config ?? {}); break;
            case 'h1': doc.h1(el.txt, el.config ?? {}); break;
            case 'h2': doc.h2(el.txt, el.config ?? {}); break;
            case 'h3': doc.h3(el.txt, el.config ?? {}); break;
            case 'h4': doc.h4(el.txt, el.config ?? {}); break;
            case 'p': doc.p(el.txt, el.config as unknown as Partial<ParagraphConfig> | undefined); break;
            case 'item': doc.item(el.txt, el.config ?? {}); break;
            case 'img': doc.img(el.txt, toImgConfig(el)); break;
            case 'list':
                currentList = el.txt as ListsTypes;
                doc.beginList(currentList, el.config ?? {});
                break;
        }
    }

    if (currentList) {
        doc.endList(currentList);
    }

    const html = doc.toHTML(options.baseDir);

    return html;
}
