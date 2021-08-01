import { Content, DynamicContent, PluralFn, Translate, TranslateOptions, Variables } from '../types';
import { getContent, parsePath } from './helpers';
import { ContentPreparer } from '../ContentPreparer';

export class Trans<Locale extends string> {
  locale: Locale;

  private translations: Record<Locale, Content>;

  private pluralRecord: Record<Locale, PluralFn>;

  content: Content;

  private async _setContent<T extends Content>(content: T | (() => Promise<{ default: T }>)): Promise<void> {
    if (typeof content === 'function') {
      this.content = (await content()).default;
      return;
    }
    this.content = content;
  }

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

  async init<T extends Content | Record<string, DynamicContent<T>>>(params: {
    translations: Record<Locale, T>;
    locale: Locale;
    pluralRecord?: Record<Locale, PluralFn>;
  }): Promise<void> {
    const { translations, locale, pluralRecord } = params;
    const { [locale]: content } = translations;
    this.translations = translations;
    this.pluralRecord = pluralRecord;
    this.locale = locale;
    await this._setContent(content);
  }

  async changeLocale(locale: Locale): Promise<void> {
    const { [locale]: content } = this.translations;
    this.locale = locale;
    await this._setContent(content);
  }

  createTranslate<T extends Variables = Variables>(path: string | TemplateStringsArray): Translate<T> {
    const parsedPath = parsePath(path);
    const content = getContent(this.content, parsedPath);
    return ($path: string | TemplateStringsArray, options: TranslateOptions<T> = {}): string => {
      const { errorsMode, count, variables } = options;
      const $parsedPath = parsePath($path);
      const result = getContent(content as Content, $parsedPath);
      return new ContentPreparer(result, {
        errorsMode,
        locale: this.locale,
        pluralFn: (this.pluralRecord || ({} as Record<Locale, PluralFn>))[this.locale],
      })
        .setCount(count)
        .setVariables(variables).content as string;
    };
  }
}
