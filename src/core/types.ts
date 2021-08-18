// eslint-disable-next-line max-classes-per-file
import { TransError } from './errors';

export type Content = Record<string, unknown>;
export type DynamicContent = () => Promise<{ default: Content }>;
export type Variables = Record<string, string>;
export type ErrorsMode = 'ignore' | 'throw' | ((error: TransError) => string);
export type PluralContent = Partial<Record<Intl.LDMLPluralRule, string>>;
export type PluralFn = (count: number, locale: string) => Intl.LDMLPluralRule;
export type Handler = () => void;
export type LoadStartEvent = 'loadstart';
export type LoadEndEvent = 'loadend';
export type ChangeLocaleEvent = 'change-locale';
export type InitEvent = 'init';

export type Event = LoadEndEvent | LoadStartEvent | ChangeLocaleEvent | InitEvent;

export declare class EventsManager {
  handlersMap: Map<Event, Handler[]>;

  private _getHandlers(event: Event, handler: Handler): Handler[];

  addEventListener(event: Event, handler: Handler): void;

  removeEventListener(event: Event, handler: Handler): void;

  protected emit(event: Event): void;
}

export enum Config {
  count = 'COUNT',
}

export type TranslateOptions<T extends Variables = Variables> = {
  /**
   * ignore the error, handle error or throw error (by default)
   * */
  errorsMode?: ErrorsMode;
  /**
   * it uses for the plural if it exists
   * */
  count?: number;
  /**
   * for replaced the variable patters: ${variable}
   * */
  variables?: T;
};

export type Translate<T extends Variables = Variables> = (
  path: string | TemplateStringsArray,
  options?: TranslateOptions<T>
) => string;

export declare class Trans<Locale extends string = string> extends EventsManager {
  locale: Locale;

  content: Content;

  init(params: {
    translations: Record<Locale, Content> | Record<Locale, DynamicContent>;
    locale: Locale;
    pluralRecord?: Record<Locale, PluralFn>;
  }): Promise<void>;

  changeLocale(locale: Locale): Promise<void>;

  createTranslate<T extends Variables = Variables>(module: string | TemplateStringsArray): Translate<T>;
}
