## Lib for localisation
Simple translate manager with supporting of dynamic imports, variables and plural.

## Examples

##### jsons for examples
**lang_ru.json**
```
{
  "screens": {
    "Home": {
      "title": "Заголовок",
      "description": "Описание ${desc} ${name}",
      "plural": {
        "zero": "ноль бананов",
        "one": "один банан",
        "two": "два банана",
        "few": "${COUNT} банана",
        "many": "${COUNT} бананов",
        "other": "${COUNT} бананов"
      }
    }
  }
}
```
**lang_en.json**
```
{
  "screens": {
    "Home": {
      "title": "Title",
      "description": "Description ${desc} ${name}",
      "plural": {
        "zero": "zero bananas",
        "one": "one banane",
        "two": "two bananas",
        "few": "${COUNT} bananas",
        "many": "${COUNT} bananas",
        "other": "${COUNT} bananas"
      }
    }
  }
}
```

### Creating

```
import ru from './lang_ru.json';
import en from './lang_en.json';

enum Locale {
  ru = 'ru',
  en = 'en',
}

const trans = new Trans<Locale>();
await trans.init({
  translations: { ru, en },
  locale: Locale.en,
});
```

### Creating with dynamic imports

```
enum Locale {
  ru = 'ru',
  en = 'en',
}

const trans = new Trans<Locale>();
await trans.init({
  translations: { ru: () => import('./lang_ru.json'), en: () => import('./lang_en.json') },
  locale: Locale.en,
});
```

> **Note**: under hood lig uses `Intl.PluralRules(locale).select(count) `, but it does not support in IE. You can pass in the init method own plural functions object:

```
await trans.init({
  translations: { ru, en },
  locale: Locale.en,
  pluralRecord: { ru: (count: number, locale: string) => Intl.LDMLPluralRule, en: (count: number, locale: string) => Intl.LDMLPluralRule }
});
```

### Translate
```
  const translate = trans.createTranslate`screens`;
  console.log(translate`Home.title`); // en -> Title; ru -> Заголовок  
```
```
  const translate = trans.createTranslate`screens.Home`;
  console.log(translate`title`); // en -> Title; ru -> Заголовок  
```

### Translate with variables
```
  const translate = trans.createTranslate`screens.Home`;
  console.log(translate('description', { variables: { desc: "Any", name: "Name" } })); // en -> Description Any Name; ru -> Описание Any Name  
```

### Translate with plural
```
  const translate = trans.createTranslate`screens.Home`;
  console.log(translate('plural', { count: 3 })); // en -> 3 bananas; ru -> 3 банана 
```
> **Note:** _COUNT_ is reserved name. Don't name your variables so.
```
translate('description', { variables: { COUNT: "you data" } }) // bad
```

### Error handing
Sometimes we mistake in translate files, and we need see it
```
  const translate = trans.createTranslate`screens.Home`;
  translate`plural`
  // throw "invalid translate! result: "[object Object]"; result as a json: {"zero":"zero bananas","one":"one banane","two":"two bananas","few":"${COUNT} bananas","many":"${COUNT} bananas","other":"${COUNT} bananas"}; rootResult: "undefined"; rootResult as a json: undefined. full path: "screens.Home.plural"; translate path: "plural";"
```
Also you can ignore error:
```
  const translate = trans.createTranslate`screens.Home`;
  translate(`plural`, { errorsMode: 'ignore' }) // returns ''
```
Or you can handle error:
```
  const translate = trans.createTranslate`screens.Home`;
  translate(`plural`, { errorsMode: (error: TransError) => 'handle error' }) // returns 'handle error'
```

## Methods
### init

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

### changeLocale

```
changeLocale(locale: Locale): Promise<void>
```

### createTranslate

```
createTranslate<T extends Variables = Variables>(module: string | TemplateStringsArray): Translate<T>
```
### translate

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
   * for replaced the variable patters - ${variable}
   * */
  variables?: T;
};

export type Translate<T extends Variables = Variables> = (
  path: string | TemplateStringsArray,
  options?: TranslateOptions<T>
) => string;
```
