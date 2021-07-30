export type Content = Record<string, unknown>;

export class Trans<Locale extends string> {
  locale: Locale;

  translations: Record<Locale, Content>;

  content: Content;

  async init<T extends Record<string, unknown> | Record<string, Promise<{ default: T }>>>(params: {
    translations: Record<Locale, T>;
    locale: Locale;
  }): Promise<void> {
    const { translations, locale } = params;
    const { [locale]: content } = translations;
    this.locale = locale;
    this.translations = translations;
    if (content instanceof Promise) {
      this.content = await content;
    } else {
      this.content = content;
    }
  }
}
