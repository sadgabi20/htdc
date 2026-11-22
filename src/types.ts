import type { PathLike } from 'node:fs';

export type ConfigPrimitive = string | number | boolean | null;
export type DirectiveConfig = Record<string, ConfigPrimitive>;

export type NumberingPosition = 'tl' | 'tc' | 'tr' | 'bl' | 'bc' | 'br';
export type PaginationFormat = '123' | 'abc' | 'roman';
export type TextContainer = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'title' | 'subtitle';
export type IndentationType = 'normal' | 'first-line' | 'french';
export type TextAlignment = 'left' | 'center' | 'right' | 'justified';

export interface HTMLDoc {
    fileName: string,
    html: string,
    /** Directory used to resolve local image paths when rendering to PDF. */
    baseDir?: string
}

export interface ComposeOptions {
    /** Directory that relative paths in a source document are resolved against. */
    baseDir?: string
}

export interface DocumentConfig {
    mainStyle: PathLike,
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

export interface ImgConfig {
    title?: string,
    width?: number,
}