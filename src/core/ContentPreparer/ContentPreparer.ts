import { Config, Content, PluralContent, PluralFn, Variables } from '../types';
import { InvalidTranslate } from '../errors';
import { defaultPluralFn, setCount, setVariable } from './helpers';
import { getContent, parsePath } from '../Trans/helpers';

export type ContentPreparerOptions<Locale extends string> = {
  pluralFn?: PluralFn;
  locale: Locale;
  path?: string | TemplateStringsArray;
};

export class ContentPreparer<Locale extends string> {
  private locale: Locale;

  private _content: Content | string;

  private pluralFn: ContentPreparerOptions<Locale>['pluralFn'];

  set(content: Content | string, options: ContentPreparerOptions<Locale>): this {
    const { pluralFn = defaultPluralFn, locale, path = '' } = options;
    const parsedPath = parsePath(path);
    this._content = getContent(content, parsedPath);
    this.locale = locale;
    this.pluralFn = pluralFn;
    return this;
  }

  setVariables(variables: Variables): this {
    if (!variables || typeof variables !== 'object') return this;
    if (typeof this._content !== 'string') {
      throw new InvalidTranslate(`invalid content: "${this._content}"; as a json: ${JSON.stringify(this._content)}`);
    }
    let result = this._content;
    const keys = Object.keys(variables);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      result = setVariable(result, { key, value: variables[key] });
    }
    this._content = result;
    return this;
  }

  setCount(count: number): this {
    if (!count && count !== 0) return this;
    this._content = setVariable(
      setCount({
        count,
        content: this._content as PluralContent,
        pluralFn: this.pluralFn,
        locale: this.locale,
      }),
      { key: Config.count, value: count.toString() }
    );
    return this;
  }

  get content(): string | Content {
    return this._content;
  }
}
