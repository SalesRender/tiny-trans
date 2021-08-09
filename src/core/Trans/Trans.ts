import { Content, DynamicContent, PluralFn, Translate, TranslateOptions, Variables } from '../types';
import { getContent, parsePath, validate } from './helpers';
import { InvalidTranslate } from '../errors';
import { ContentPreparer } from '../ContentPreparer';

export class Trans<Locale extends string = string> {
  locale: Locale;

  private translations: Record<Locale, Content>;

  private pluralRecord: Record<Locale, PluralFn>;

  private contentPreparer: ContentPreparer<Locale>;

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
    this.contentPreparer = new ContentPreparer<Locale>();
    await this._setContent(content);
  }

  async changeLocale(locale: Locale): Promise<void> {
    const { [locale]: content } = this.translations;
    this.locale = locale;
    await this._setContent(content);
  }

  createTranslate<T extends Variables = Variables>(module: string | TemplateStringsArray): Translate<T> {
    const parsedPath = parsePath(module);
    const content = getContent(this.content, parsedPath);

    return (path: string | TemplateStringsArray, options: TranslateOptions<T> = {}): string => {
      const { errorsMode, count, variables } = options;
      return validate(
        () => {
          const { locale, pluralRecord } = this;

          // find in the current content
          const result = this.contentPreparer
            .set(content, { path, locale, pluralFn: pluralRecord?.[locale] })
            .setCount(count)
            .setVariables(variables).content;
          if (typeof result === 'string') return result;

          // find in the root
          const rootResult = this.contentPreparer
            .set(this.content, { path, locale, pluralFn: pluralRecord?.[locale] })
            .setCount(count)
            .setVariables(variables).content;
          if (typeof rootResult === 'string') return rootResult;

          throw new InvalidTranslate(`invalid translate: "${result}"; as a json: ${JSON.stringify(result)}`);
        },
        errorsMode,
        `full path: "${[module, path].filter(Boolean).join('.')}"; translate path: "${path}";`
      );
    };
  }
}
