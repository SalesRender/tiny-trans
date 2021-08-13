import { Content, DynamicContent, PluralFn, Translate, Variables, Trans as ITrans } from '../types';
export declare class Trans<Locale extends string = string> implements ITrans<Locale> {
    locale: Locale;
    private translations;
    private pluralRecord;
    private contentPreparer;
    content: Content;
    private _setContent;
    init<T extends Content | Record<string, DynamicContent<T>>>(params: {
        translations: Record<Locale, T>;
        locale: Locale;
        pluralRecord?: Record<Locale, PluralFn>;
    }): Promise<void>;
    changeLocale(locale: Locale): Promise<void>;
    createTranslate<T extends Variables = Variables>(module: string | TemplateStringsArray): Translate<T>;
}
