import type { DirectiveConfig } from "../types.ts";

export type { ConfigPrimitive, DirectiveConfig } from "../types.ts";

export interface Token {
    type: 'IDENT' | 'SYMBOL' | 'SPACE' | 'UNKNOWN' ;
    value: string;
    line: number;
    char: number;
}

export type RuleTypesAST = 'filename' | 'comment' | 'title' | 'subtitle' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'list' | 'item' | 'img' | undefined ;
export type ListsTypes = 'ul' | 'ol' | 'dl' ;

export interface RulesetAST {
    type: RuleTypesAST,
    txt: string,
    /** The optional `.type` suffix of a directive, e.g. `ul` in `/list.ul`. */
    variant?: string,
    /** Key-value pairs extracted from a trailing `{ ... }` config object. */
    config?: DirectiveConfig,
    /** Image width from the legacy positional form (or a config `width`). */
    width?: number,
}
