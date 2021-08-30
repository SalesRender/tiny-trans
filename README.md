# tiny-trans - lib for localisation
Simple translate manager with supporting of dynamic imports, variables and plural.
You can use a lib for react applications [react-tiny-trans](https://www.npmjs.com/package/react-tiny-trans)

## Install
```
npm i tiny-trans
// or
yarn add tiny-trans 
```

## Usage

You can use different files for translates. Below I use follow example files

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
  "extrapoint": {
    "anything": "Что-нибудь"
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
  "extrapoint": {
    "anything": "Anything"
  }
}
```

### Creating
You should pass the translations and the starting locale to the init method. You can also explicitly specify possible locales by passing Locale type when creating a Trans instance 
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
Files of translates will dynamic download. See [webpack code-splitting](https://webpack.js.org/guides/code-splitting/)
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

### Creating with custom pluralization
You can pass the custom plural functions. 
> **Note**: under hood it uses `Intl.PluralRules(locale).select(count) `, but it does not support in IE. You can pass in the init method own plural functions object.
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
  pluralRecord: { ru: (count: number, locale: string) => "zero" | "one" | "two" | "few" | "many" | "other", en: (count: number, locale: string) => "zero" | "one" | "two" | "few" | "many" | "other" }
});
```

### Translate
You can write in different ways:
```
// case 1
const translate = trans.createTranslate`screens`;
translate`Home.title`; // en -> Title; ru -> Заголовок  

// case 2
const translate = trans.createTranslate`screens.Home`;
translate`title`; // en -> Title; ru -> Заголовок  

// case 3
const translate = trans.createTranslate`screens.Home.title`;
translate``; // en -> Title; ru -> Заголовок  

// case 4
const translate = trans.createTranslate``;
translate`screens.Home.title`; // en -> Title; ru -> Заголовок  
```

> **Note:** createTranslate and translate take a TemplateStringsArray or a string as first param.
```
createTranslate`some` // it works
createTranslate('some') // it works too
createTranslate'some' // it does not work!

translate`some` // it works
translate('some') // it works too
translate'some' // it does not work!
```


### Translate with variables
```
const translate = trans.createTranslate`screens.Home`;
translate('description', { variables: { desc: "Any", name: "Name" } }); // en -> Description Any Name; ru -> Описание Any Name  
```

### Translate with plural
```
const translate = trans.createTranslate`screens.Home`;
translate('plural', { count: 3 }); // en -> 3 bananas; ru -> 3 банана 
```
> **Note:** _COUNT_ is reserved name. Don't name your variables so.
```
translate('description', { variables: { COUNT: "you data" } }) // bad
```

### Translate with few points
In any translation function, you can write the full path, and this works even if a different root path is passed to `createTranslate`
```
const translate = trans.createTranslate`screens`;
translate`Home.title` // en -> Title; ru -> Заголовок  
translate`extrapoint.anything` // en -> Anything; ru -> Что-нибудь  
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

## API
### Methods
#### init

```
type PluralFn = (count: number, locale: string) => "zero" | "one" | "two" | "few" | "many" | "other";
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
  * If you want you can pass custom plural hanlders
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
type Variables = Record<string, string>;
type ErrorsMode = 'ignore' | 'throw' | ((error: TransError) => string);

type TranslateOptions<T extends Variables = Variables> = {
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

type Translate<T extends Variables = Variables> = (
  path: string | TemplateStringsArray,
  options?: TranslateOptions<T>
) => string;
```

### Events

You can listen trans events. They will be helpful for creating a lib for any frameworks
* `loadstart` Triggered before only dynamic importing
* `loadend` Triggered after only dynamic importing
* `change-locale` Triggered every time by `changeLocale` method but after `loadend`. It takes a `locale` as a first argument
* `init` Triggered single time in the end by `init` method. It takes a `locale` as a first argument

```
// To add
trans.addEventListener('init', (locale: string) => void)

// To remove
trans.removeEventListener('init', (locale: string) => void)
```

