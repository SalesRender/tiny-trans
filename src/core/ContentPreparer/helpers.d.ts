import { PluralContent } from '../types';
import { ContentPreparerOptions } from './ContentPreparer';
export declare const defaultPluralFn: (count: number, locale: string) => Intl.LDMLPluralRule;
export declare const setCount: <Locale extends string>({ count, content, pluralFn, locale, }: {
    count: number;
    locale: Locale;
    content: PluralContent;
    pluralFn: import("../types").PluralFn;
}) => string | never;
export declare const setVariable: (content: string, variable: {
    key: string;
    value: string;
}) => string;
