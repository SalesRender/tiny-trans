// eslint-disable-next-line max-classes-per-file
import { TransError } from './errors';

export type Content = {
  [key: string]: string | Content;
};
export type AsyncContent = () => Promise<Content>;
export type Variables = Record<string, string>;
export type ErrorsMode = 'ignore' | 'throw' | 'console' | ((error: TransError) => string);
export type PluralContent = Partial<Record<Intl.LDMLPluralRule, string>>;
export type PluralFn = (count: number, locale: string) => Intl.LDMLPluralRule;
export type Handler = ((...args: unknown[]) => void) | (() => void);
export type LoadStartEvent = 'loadstart';
export type LoadEndEvent = 'loadend';
export type ChangeLocaleEvent = 'change-locale';
export type InitEvent = 'init';

export type Event = LoadEndEvent | LoadStartEvent | ChangeLocaleEvent | InitEvent;

export declare class EventsManager {
  handlersMap: Map<Event, Handler[]>;

  private _getHandlers(event: Event, handler: Handler): Handler[];

  addEventListener(event: LoadEndEvent, handler: () => void): void;

  addEventListener(event: LoadStartEvent, handler: () => void): void;

  addEventListener(event: ChangeLocaleEvent, handler: (locale: string) => void): void;

  addEventListener(event: InitEvent, handler: (locale: string) => void): void;

  removeEventListener(event: Event, handler: Handler): void;

  protected emit(event: ChangeLocaleEvent, locale: string): void;

  protected emit(event: InitEvent, locale: string): void;

  protected emit(event: LoadEndEvent): void;

  protected emit(event: LoadStartEvent): void;
}

export enum Config {
  count = 'COUNT',
}

export type TranslateOptions<T extends Variables = Variables> = {
  /**
   * ignore the error, handle error, show in the console or throw error (by default)
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

  errorsMode: ErrorsMode;

  content: Content;

  constructor(params: {
    translations: Record<Locale, Content> | Record<Locale, AsyncContent>;
    locale: Locale;
    pluralRecord?: Record<Locale, PluralFn>;
    errorsMode?: ErrorsMode;
  });

  init(): Promise<void>;

  changeLocale(locale: Locale): Promise<void>;

  createTranslate<T extends Variables = Variables>(module?: string | TemplateStringsArray): Translate<T>;
}
