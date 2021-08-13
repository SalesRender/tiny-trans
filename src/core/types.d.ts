import { TransError } from './errors';
export declare type Content = Record<string, unknown>;
export declare type DynamicContent<T extends Content> = () => Promise<{
    default: T;
}>;
export declare type Variables = Record<string, string>;
export declare type ErrorsMode = 'ignore' | 'throw' | ((error: TransError) => string);
export declare type PluralContent = Partial<Record<Intl.LDMLPluralRule, string>>;
export declare type PluralFn = (count: number, locale: string) => Intl.LDMLPluralRule;
export declare enum Config {
    count = "COUNT"
}
export declare type TranslateOptions<T extends Variables = Variables> = {
    /**
     * ignore the error, handle error or throw error (by default)
     * */
    errorsMode?: ErrorsMode;
    /**
     * it uses for the plural if it exists
     * */
    count?: number;
    /**
     * for replaced the variable patters - ${variable}
     * */
    variables?: T;
};
export declare type Translate<T extends Variables = Variables> = (path: string | TemplateStringsArray, options?: TranslateOptions<T>) => string;
export declare class Trans<Locale extends string = string> {
    locale: Locale;
    content: Content;
    init<T extends Content>(params: {
        translations: Record<Locale, T>;
        locale: Locale;
        pluralRecord?: Record<Locale, PluralFn>;
    }): Promise<void>;
    init<T extends Content>(params: {
        translations: Record<Locale, DynamicContent<T>>;
        locale: Locale;
        pluralRecord?: Record<Locale, PluralFn>;
    }): Promise<void>;
    changeLocale(locale: Locale): Promise<void>;
    createTranslate<T extends Variables = Variables>(module: string | TemplateStringsArray): Translate<T>;
}
