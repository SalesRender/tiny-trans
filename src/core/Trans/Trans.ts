import { Content, DynamicContent, PluralFn, Translate, TranslateOptions, Variables } from '../types';
import { getContent, getResult, parsePath } from './helpers';
import { InvalidTranslate } from '../errors';
import { validate } from '../validate';

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
      return validate(
        errorsMode,
        () => {
          const { locale, pluralRecord } = this;
          const params = { path: $path, count, variables, errorsMode, locale, pluralRecord };

          const result = getResult({ ...params, content });
          if (typeof result === 'string') return result;

          const $result = getResult({ ...params, content: this.content });
          if (typeof $result === 'string') return $result;

          throw new InvalidTranslate(`invalid translate: "${$result}"; as a json: ${JSON.stringify($result)}`);
        },
        `path1: "${[path, $path].filter(Boolean).join('.')}"; path2: "${$path}";`
      );
    };
  }
}
