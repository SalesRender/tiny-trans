export type Content = Record<string, unknown>;
export type DynamicContent<T extends Content> = () => Promise<{ default: T }>;

export class Trans<Locale extends string> {
  locale: Locale;

  translations: Record<Locale, Content>;

  content: Content;

  private async _setContent<T extends Content>(content: T | (() => Promise<{ default: T }>)): Promise<void> {
    if (typeof content === 'function') {
      this.content = (await content()).default;
      return;
    }
    this.content = content;
  }

  init<T extends Content>(params: { translations: Record<Locale, T>; locale: Locale }): Promise<void>;

  init<T extends Content>(params: { translations: Record<Locale, DynamicContent<T>>; locale: Locale }): Promise<void>;

  async init<T extends Content | Record<string, DynamicContent<T>>>(params: {
    translations: Record<Locale, T>;
    locale: Locale;
  }): Promise<void> {
    const { translations, locale } = params;
    const { [locale]: content } = translations;
    this.translations = translations;
    this.locale = locale;
    await this._setContent(content);
  }

  async changeLocale(locale: Locale): Promise<void> {
    const { [locale]: content } = this.translations;
    this.locale = locale;
    await this._setContent(content);
  }
}
