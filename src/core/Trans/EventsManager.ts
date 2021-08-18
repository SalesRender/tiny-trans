export type Handler = () => void;
export type LoadStartEvent = 'loadstart';
export type LoadEndEvent = 'loadend';
export type ChangeLocaleEvent = 'change-locale';

export type Event = LoadEndEvent | LoadStartEvent | ChangeLocaleEvent;

export class EventsManager {
  handlersMap: Map<Event, Handler[]>;

  constructor() {
    this.handlersMap = new Map<Event, Handler[]>();
  }

  private _getHandlers(event: Event, handler: Handler): Handler[] {
    return this.handlersMap.get(event).filter((h) => h !== handler);
  }

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

  emit(event: Event): void {
    if (this.handlersMap.has(event)) {
      const handlers = this.handlersMap.get(event);
      handlers.forEach((handler) => handler(), this);
    }
  }
}
