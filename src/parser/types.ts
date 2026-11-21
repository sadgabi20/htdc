export interface Token {
    type: 'IDENT' | 'SYMBOL' | 'SPACE' | 'UNKNOWN' ;
    value: string;
    line: number;
    char: number;
}

export type RuleTypesAST = 'filename' | 'comment' | 'title' | 'subtitle' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'list' | 'item' | undefined ;
export type ListsTypes = 'ul' | 'ol' | 'dl' ;

export interface RulesetAST {
    type: RuleTypesAST,
    txt: string,
}
