import { Content, AsyncContent, ErrorsMode, PluralFn, Translate, TranslateOptions, Variables } from '../types';
import { getContent, parsePath, validate } from './helpers';
import { InvalidTranslate } from '../errors';
import { ContentPreparer } from '../ContentPreparer';
import { EventsManager } from './EventsManager';

export class Trans<Locale extends string = string> extends EventsManager {
  locale: Locale;

  errorsMode: ErrorsMode;

  private translations: Record<Locale, Content | AsyncContent>;

  private pluralRecord: Record<Locale, PluralFn>;

  private contentPreparer: ContentPreparer<Locale>;

  private initial: boolean;

  content: Content;

  constructor(params: {
    translations: Record<Locale, Content> | Record<Locale, AsyncContent>;
    locale: Locale;
    pluralRecord?: Record<Locale, PluralFn>;
    errorsMode?: ErrorsMode;
  }) {
    super();
    this.initial = false;
    this.changeLocale = this.changeLocale.bind(this);
    this._setContent = this._setContent.bind(this);
    this.init = this.init.bind(this);
    this.createTranslate = this.createTranslate.bind(this);
    const { translations, locale, pluralRecord, errorsMode = 'console' } = params;
    this.errorsMode = errorsMode;
    this.translations = translations;
    this.pluralRecord = pluralRecord;
    this.locale = locale;
    this.contentPreparer = new ContentPreparer<Locale>();
  }

  private async _setContent<T extends Content>(content: T | (() => Promise<T>)): Promise<void> {
    if (typeof content === 'function') {
      this.emit('loadstart');
      this.content = await content();
      this.emit('loadend');
    } else {
      this.content = content;
    }
  }

  async init(): Promise<void> {
    const { [this.locale]: content } = this.translations;
    await this._setContent(content);
    this.initial = true;
    this.emit('init', this.locale);
  }

  async changeLocale(locale: Locale): Promise<void> {
    if (!this.initial || !this.translations?.[locale]) return;
    const { [locale]: content } = this.translations;
    this.locale = locale;
    await this._setContent(content);
    this.emit('change-locale', locale);
  }

  createTranslate<T extends Variables = Variables>(module?: string | TemplateStringsArray): Translate<T> {
    const parsedPath = parsePath(module);
    let _content = getContent(this.content, parsedPath);

    return (path: string | TemplateStringsArray, options: TranslateOptions<T> = {}): string => {
      // for loading case
      if (!this.initial) return '';

      const content = _content || (_content = getContent(this.content, parsedPath));

      const { errorsMode, count: _count, variables } = options;
      const count = 'count' in options ? _count || 0 : _count;
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

          throw new InvalidTranslate(
            `invalid translate! result: "${result}"; result as a json: ${JSON.stringify(
              result
            )}; rootResult: "${rootResult}"; rootResult as a json: ${JSON.stringify(rootResult)}`
          );
        },
        errorsMode || this.errorsMode,
        `full path: "${[module, path].filter(Boolean).join('.')}"; translate path: "${path}";`
      );
    };
  }
}
