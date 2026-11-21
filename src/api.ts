import type { DocumentConfig, HTMLDoc, ImgConfig, PaginationConfig, ParagraphConfig, SectionConfig } from "./types.ts";

const PARAGRAPH_DEFAULT_CONFIG: ParagraphConfig = {
    alignment: 'justified',
    indentation: {
        symmetric: false,
        type: ['normal', [0, 0, 0]]
    },
    lineSpacing: [0, 0, 0, 0]
}

const PAGINATION_DEFAULT_CONFIG: PaginationConfig = {
    position: 'bl',
    format: '123',
    style: 'p',
}

const SECTION_DEFAULT_CONFIG: SectionConfig = {
    paragraph: PARAGRAPH_DEFAULT_CONFIG,
    pagination: PAGINATION_DEFAULT_CONFIG,
}

export class HTDC {
    public fileName: string | undefined;

    private documentConfig: DocumentConfig;
    private nodes: Array<any> = [];
    private h1Count = 0;
    private h2Count = 0;
    private h3Count = 0;

    constructor(documentConfig?: Partial<DocumentConfig>) {
        this.documentConfig = { countImages: true, countTables: true, ...documentConfig } as DocumentConfig;
    }

    #addTitle(level: 1 | 2 | 3 | 4) {
        let finalCount = "";

        if (!level) throw Error("a");

        if (level === 1) {
            this.h1Count++;
            this.h2Count = 0;
            this.h3Count = 0;
            finalCount = this.h1Count.toString();
        }
        if (level === 2) {
            this.h2Count++;
            this.h3Count = 0;

            finalCount = [
                this.h1Count.toString(),
                this.h2Count.toString()
            ].join('.');
        }
        if (level === 3) {
            this.h3Count++;

            finalCount = [
                this.h1Count.toString(),
                this.h2Count.toString(),
                this.h3Count.toString()
            ].join('.');
        }

        return finalCount;
    }

    #parseTxt(txt: string) {
        let i = 0;

        return txt.split('').map(c => {
            if (c != '*') return c;

            if (i === 0) {
                i = 1;
                return '<i>';
            }
            if (i === 1) {
                i = 0;
                return '</i>';
            }
        }).join('');
    }

    section(name: string, config: SectionConfig = SECTION_DEFAULT_CONFIG) {
        this.nodes.push({ type: 'section', name, config });
        return this;
    }

    title(txt: string) {
        this.nodes.push({ type: 'title', txt });
        return this;
    }

    subtitle(txt: string) {
        this.nodes.push({ type: 'subtitle', txt });
        return this;
    }

    h1(txt: string) {
        this.nodes.push({ type: 'h1', txt, num: this.#addTitle(1) });
        return this;
    }

    h2(txt: string) {
        this.nodes.push({ type: 'h2', txt, num: this.#addTitle(2) });
        return this;
    }

    h3(txt: string) {
        this.nodes.push({ type: 'h3', txt, num: this.#addTitle(3) });
        return this;
    }

    h4(txt: string) {
        this.nodes.push({ type: 'h4', txt, num: this.#addTitle(4) });
        return this;
    }

    p(txt: string, config?: Partial<ParagraphConfig>) {
        txt = this.#parseTxt(txt);
        const finalConfig = { ...PARAGRAPH_DEFAULT_CONFIG, ...config };
        this.nodes.push({ type: 'paragraph', txt, config: finalConfig });
        return this;
    }

    beginList(listType: 'ul' | 'ol' | 'dl') {
        this.nodes.push({ type: 'beginList', listType })
        return this;
    }

    endList(listType: 'ul' | 'ol' | 'dl') {
        this.nodes.push({ type: 'endList', listType })
        return this;
    }

    item(txt: string) {
        txt = this.#parseTxt(txt);
        this.nodes.push({ type: 'item', txt });
        return this;
    }

    img(src: string, config: ImgConfig) {
        this.nodes.push({ type: 'image', src, config });
        return this;
    }

    br(count: number = 1) {
        this.nodes.push({ type: 'break', count });
        return this;
    }

    toHTML(): HTMLDoc {
        if (this.fileName === undefined) {
            throw Error('An HTDC document must have a file name');
        }

        const docBody = this.nodes.map(node => {
            switch (node.type) {
                case 'title': return `<div class="doc-title">${node.txt}</div>`;
                case 'subtitle': return `<div class="doc-subtitle">${node.txt}</div>`;
                case 'h1': return `<h1 id="title">${node.num}&#160;&#160;${node.txt}</h1>`;
                case 'h2': return `<h2>${node.num}&#160;&#160;${node.txt}</h2>`;
                case 'h3': return `<h3>${node.num}&#160;&#160;${node.txt}</h3>`;
                case 'h4': return `<h4>${node.num}&#160;&#160;${node.txt}</h4>`;
                case 'paragraph': return `<p style="..."> ${node.txt} </p>`;
                case 'beginList': return `<${node.listType}>`;
                case 'endList': return `</${node.listType}>`;
                case 'item': return `<li>${node.txt}</li>`;
                case 'image': return `<img src="${node.src}" width="${node.config.width * 100}%" />`;
                case 'break': return '<br>'.repeat(node.count);
                default: return '';
            }
        }).join('\n');

        const html = `<html>
<body>${docBody}
</body>
</html>`;

        return { fileName: this.fileName, html };
    }
}