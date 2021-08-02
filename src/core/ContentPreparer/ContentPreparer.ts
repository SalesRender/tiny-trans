import { Config, Content, ErrorsMode, PluralContent, PluralFn, Variables } from '../types';
import { InvalidTranslate } from '../errors';
import { defaultPluralFn, setCount, setVariable } from './helpers';
import { validate } from '../validate';

export type ContentPreparerOptions<Locale extends string> = {
  errorsMode?: ErrorsMode;
  pluralFn?: PluralFn;
  locale: Locale;
};

export class ContentPreparer<Locale extends string> {
  private readonly errorsMode: ErrorsMode;

  private readonly locale: Locale;

  private _content: Content | string;

  private readonly pluralFn: ContentPreparerOptions<Locale>['pluralFn'];

  constructor(content: Content | string, options: ContentPreparerOptions<Locale>) {
    this._content = content;
    const { errorsMode = 'throw', pluralFn = defaultPluralFn, locale } = options;
    this.locale = locale;
    this.errorsMode = errorsMode;
    this.pluralFn = pluralFn;
  }

  setVariables(variables: Variables): this {
    if (!variables || typeof variables !== 'object') return this;
    this._content = validate(() => {
      if (typeof this._content !== 'string') {
        throw new InvalidTranslate(`invalid content: "${this._content}"; as a json: ${JSON.stringify(this._content)}`);
      }
      let result = this._content;
      const keys = Object.keys(variables);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        result = setVariable(result, { key, value: variables[key] });
      }
      return result;
    }, this.errorsMode);
    return this;
  }

  setCount(count: number): this {
    if (!count && count !== 0) return this;
    this._content = validate(
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
      this.errorsMode
    );
    return this;
  }

  get content(): string | Content {
    return this._content;
  }
}
