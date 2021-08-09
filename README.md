## Lib for localisation
Simple translate manager with supporting of dynamic imports, variables and plural.

#### Creating

```
import ru from './lang_ru.json';
import en from './lang_en.json';

enum Locale {
  ru = 'ru',
  en = 'en',
}

const trans = new Trans<Locale>();
(async () => {
  await trans.init({
    translations: { ru, en },
    locale: Locale.en,
  });
  const translate = trans.createTranslate`screens`;
  console.log(translate`Home`);
})();
```

#### Creating with dynamic imports

```
enum Locale {
  ru = 'ru',
  en = 'en',
}

const trans = new Trans<Locale>();
(async () => {
  await trans.init({
    translations: { ru: () => import('./lang_ru.json'), en: () => import('./lang_en.json') },
    locale: Locale.en,
  });
  const translate = trans.createTranslate`screens`;
  console.log(translate`Home`);
})();
```

### Methods
#### init

```
export type PluralFn = (count: number, locale: string) => "zero" | "one" | "two" | "few" | "many" | "other";
init(params: {
    /**
    * for example: { ru: { test: 'тест' }, en: { test: 'test' } } 
    */
    translations: Record<Locale, unknown>;
    /**
    * string
    */
    locale: Locale;
    /**
    * If you want you can to pass custom plural hanlders
    */
    pluralRecord?: Record<Locale, PluralFn>;
  }): Promise<void> 
```

#### changeLocale

```
changeLocale(locale: Locale): Promise<void>
```

#### createTranslate

```
createTranslate<T extends Variables = Variables>(module: string | TemplateStringsArray): Translate<T>
```
#### translate

```
export type Variables = Record<string, string>;
export type ErrorsMode = 'ignore' | 'throw' | ((error: TransError) => string);

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
   * for replaced the variable patters - {#variable}
   * */
  variables?: T;
};

export type Translate<T extends Variables = Variables> = (
  path: string | TemplateStringsArray,
  options?: TranslateOptions<T>
) => string;
```
