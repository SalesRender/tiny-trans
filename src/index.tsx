/* eslint-disable */
import { Trans } from './core';
// import ru from './lang_ru.json';
// import en from './lang_en.json';

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
  console.log(translate(`Home`));
})();
