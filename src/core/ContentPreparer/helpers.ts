import { PluralContent } from '../types';
import { ContentNotPlural, InvalidTranslate, PluralNotSupport } from '../errors';
import { ContentPreparerOptions } from './ContentPreparer';

export const defaultPluralFn = (count: number, locale: string): Intl.LDMLPluralRule => {
  try {
    return new Intl.PluralRules(locale).select(count);
  } catch (e) {
    if (e.message === 'Intl is not defined') {
      throw new PluralNotSupport(
        `plural by default is not supported. Try to add a polyfill for Intl: https://formatjs.io/docs/polyfills/intl-pluralrules/ or you should to pass a pluralRecord with own functions for plural`
      );
    }
    throw e;
  }
};

export const setCount = <Locale extends string>({
  count,
  content,
  pluralFn,
  locale,
}: {
  count: number;
  locale: Locale;
  content: PluralContent;
  pluralFn: ContentPreparerOptions<Locale>['pluralFn'];
}): string | never => {
  if (!content || typeof content !== 'object') {
    throw new ContentNotPlural(`content is not plural. content: "${content}"; as a json: ${JSON.stringify(content)}`);
  }
  const key = pluralFn(count, locale);
  const result = content[key];
  if (typeof result !== 'string')
    throw new InvalidTranslate(`invalid translate. Translated result: ${result}; as a json: ${JSON.stringify(result)}`);
  return result;
};

export const setVariable = (content: string, variable: { key: string; value: string }): string => {
  const regExp = new RegExp(`\\\${${variable.key}}`, 'g');
  return content.replace(regExp, variable.value);
};
