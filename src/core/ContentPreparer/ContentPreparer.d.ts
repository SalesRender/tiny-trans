import { Content, PluralFn, Variables } from '../types';
export declare type ContentPreparerOptions<Locale extends string> = {
    pluralFn?: PluralFn;
    locale: Locale;
    path?: string | TemplateStringsArray;
};
export declare class ContentPreparer<Locale extends string> {
    private locale;
    private _content;
    private pluralFn;
    set(content: Content | string, options: ContentPreparerOptions<Locale>): this;
    setVariables(variables: Variables): this;
    setCount(count: number): this;
    get content(): string | Content;
}
