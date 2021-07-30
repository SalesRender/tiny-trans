export type Content = Record<string, unknown>;

export class Trans<Locale extends string> {
  locale: Locale;

  translations: Record<Locale, Content>;

  content: Content;

  private async setContent<T extends Record<string, unknown>>(content: T | Promise<{ default: T }>): Promise<void> {
    if (content instanceof Promise) {
      this.content = (await content).default;
      return;
    }
    this.content = content;
  }

  init<T extends Record<string, unknown>>(params: { translations: Record<Locale, T>; locale: Locale }): Promise<void>;

  init<T extends Record<string, unknown>>(params: {
    translations: Record<Locale, Promise<{ default: T }>>;
    locale: Locale;
  }): Promise<void>;

  async init<T extends Record<string, unknown> | Record<string, Promise<{ default: T }>>>(params: {
    translations: Record<Locale, T>;
    locale: Locale;
  }): Promise<void> {
    const { translations, locale } = params;
    const { [locale]: content } = translations;
    this.translations = translations;
    this.locale = locale;
    await this.setContent(content);
  }

  async changeLocale(locale: Locale): Promise<void> {
    const { [locale]: content } = this.translations;
    this.locale = locale;
    await this.setContent(content);
  }
}
