export type NumberingPosition = 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br';
export type PaginationFormat = '123' | 'abc' | 'roman';
export type TextContainer = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'title' | 'subtitle';
export type IndentationType = 'normal' | 'first-line' | 'french';
export type TextAlignment = 'left' | 'center' | 'right' | 'justified';

export interface DocumentConfig {
    countImages?: boolean,
    countTables?: boolean,
}

export interface ParagraphConfig {
    alignment?: TextAlignment,
    indentation?: {
        symmetric?: boolean
        /** **type**: `[type, [left/up, right/down, in]]` */
        type?: [IndentationType, [number, number, number]],
    },
    /** **lineSpacing**: `[before, after, in, skipSameStyleParagraphs]` */
    lineSpacing?: [number, number, number, 0 | 1 | undefined]
}

export interface PaginationConfig {
    position?: NumberingPosition,
    format?: PaginationFormat,
    style: TextContainer
}

export interface SectionConfig {
    paragraph?: ParagraphConfig,
    pagination?: PaginationConfig,
}