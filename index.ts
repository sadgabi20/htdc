import type { DocumentConfig, PaginationConfig, ParagraphConfig, SectionConfig } from "./types.ts";

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
    private documentConfig: DocumentConfig;
    private nodes: Array<any> = [];

    constructor(documentConfig?: Partial<DocumentConfig>) {
        this.documentConfig = { countImages: true, countTables: true, ...documentConfig };
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
        this.nodes.push({ type: 'h1', txt });
        return this;
    }

    h2(txt: string) {
        this.nodes.push({ type: 'h2', txt });
        return this;
    }

    p(txt: string, config?: Partial<ParagraphConfig>) {
        const finalConfig = { ...PARAGRAPH_DEFAULT_CONFIG, ...config };
        this.nodes.push({ type: 'paragraph', txt, config: finalConfig });
        return this;
    }

    img(src: string, config = { width: 0.5 }) {
        this.nodes.push({ type: 'image', src, config });
        return this;
    }

    br(count: number = 1) {
        this.nodes.push({ type: 'break', count });
        return this;
    }

    toHTML(): string {
        const docBody = this.nodes.map(node => {
            switch (node.type) {
                case 'title': return `<div class="doc-title">${node.txt}</div>`;
                case 'subtitle': return `<div class="doc-subtitle">${node.txt}</div>`;
                case 'h1': return `<h1>${node.txt}</h1>`;
                case 'h2': return `<h2>${node.txt}</h2>`;
                case 'paragraph': return `<p style="..."> ${node.txt} </p>`;
                case 'image': return `<img src="${node.src}" width="${node.config.width * 100}%" />`;
                case 'break': return '<br>'.repeat(node.count);
                default: return '';
            }
        }).join('\n');

        const htmlDoc = `<html>
<body>${docBody}
</body>
</html>`;

        return htmlDoc;
    }
}