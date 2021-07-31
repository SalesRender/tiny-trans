/* eslint-disable */
import { Trans } from './Trans';
// import ru from './lang_ru.json';
// import en from './lang_en.json';

enum Locale {
  ru = 'ru',
  en = 'en',
}

const trans = new Trans<Locale>();

(async () => {
  // await trans.init({ translations: { ru, en }, locale: Locale.en });
  await trans.init({
    translations: { ru: () => import('./lang_ru.json'), en: () => import('./lang_en.json') },
    locale: Locale.en,
  });
  console.log(trans, { ...trans.content });
  setTimeout(async () => {
    await trans.changeLocale(Locale.ru);
    console.log(trans, { ...trans.content });
  }, 5000);
})();
