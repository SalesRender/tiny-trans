export type Handler = ((...args: unknown[]) => void) | (() => void);
export type LoadStartEvent = 'loadstart';
export type LoadEndEvent = 'loadend';
export type ChangeLocaleEvent = 'change-locale';
export type InitEvent = 'init';

export type Event = LoadEndEvent | LoadStartEvent | ChangeLocaleEvent | InitEvent;

export class EventsManager {
  handlersMap: Map<Event, Handler[]>;

  constructor() {
    this.handlersMap = new Map<Event, Handler[]>();
  }

  private _getHandlers(event: Event, handler: Handler): Handler[] {
    return this.handlersMap.get(event).filter((h) => h !== handler);
  }

  addEventListener(event: LoadEndEvent, handler: () => void): void;

  addEventListener(event: LoadStartEvent, handler: () => void): void;

  addEventListener(event: ChangeLocaleEvent, handler: (locale: string) => void): void;

  addEventListener(event: InitEvent, handler: (locale: string) => void): void;

  addEventListener(event: Event, handler: Handler): void {
    if (this.handlersMap.has(event)) {
      const handlers = this._getHandlers(event, handler);
      handlers.push(handler);
      this.handlersMap.set(event, handlers);
      return;
    }
    this.handlersMap.set(event, [handler]);
  }

  removeEventListener(event: Event, handler: Handler): void {
    if (this.handlersMap.has(event)) {
      const handlers = this._getHandlers(event, handler);
      this.handlersMap.set(event, handlers);
    }
  }

  protected emit(event: ChangeLocaleEvent, locale: string): void;

  protected emit(event: InitEvent, locale: string): void;

  protected emit(event: LoadEndEvent): void;

  protected emit(event: LoadStartEvent): void;

  protected emit(event: Event, ...args: unknown[]): void {
    if (this.handlersMap.has(event)) {
      const handlers = this.handlersMap.get(event);
      handlers.forEach((handler) => handler(...args), this);
    }
  }
}
