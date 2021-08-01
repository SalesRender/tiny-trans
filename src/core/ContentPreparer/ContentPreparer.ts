import { Config, Content, ErrorsMode, PluralContent, PluralFn, Variables } from '../types';
import { InvalidErrorMode, InvalidTranslate } from '../errors';
import { defaultPluralFn, setCount, setVariable } from './helpers';

export type ContentPreparerOptions<Locale extends string> = {
  errorsMode?: ErrorsMode;
  pluralFn?: PluralFn;
  locale?: Locale;
};

export class ContentPreparer<Locale extends string> {
  private readonly errorsMode: ErrorsMode;

  private readonly locale: Locale;

  private readonly pluralFn: ContentPreparerOptions<Locale>['pluralFn'];

  constructor(private _content: Content | string, options: ContentPreparerOptions<Locale> = {}) {
    const { errorsMode = 'throw', pluralFn = defaultPluralFn, locale } = options;
    this.locale = locale;
    this.errorsMode = errorsMode;
    this.pluralFn = pluralFn;
  }

  setVariables(variables: Variables): this {
    if (!variables || typeof variables !== 'object') return this;
    this._content = this.validate(
      () => {
        if (typeof this._content !== 'string') {
          throw new InvalidTranslate(
            `invalid content: "${this._content}"; as a json: ${JSON.stringify(this._content)}`
          );
        }
        let result: string;
        const keys = Object.keys(variables);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          result = setVariable(this._content, { key, value: variables[key] });
        }
        return result;
      },
      () => ''
    );
    return this;
  }

  private validate(callback: () => string, errorCallback: () => string): string | never {
    try {
      return callback();
    } catch (e) {
      if (this.errorsMode === 'ignore') return errorCallback();
      if (this.errorsMode === 'throw') throw e;
      if (typeof this.errorsMode === 'function') return this.errorsMode(e);
      throw new InvalidErrorMode(`errorsMode: "${this.errorsMode}"; as a json: ${JSON.stringify(this.errorsMode)}`);
    }
  }

  setCount(count: number): this {
    if (!count && count !== 0) return this;
    this._content = this.validate(
      () =>
        setVariable(
          setCount({
            count,
            content: this._content as PluralContent,
            pluralFn: this.pluralFn,
            locale: this.locale,
          }),
          { key: Config.count, value: count.toString() }
        ),
      () => ''
    );
    return this;
  }

  get content(): string | Content {
    return this._content;
  }
}
