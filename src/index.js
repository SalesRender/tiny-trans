import { Trans } from '../dist/main';
import ru from './lang_ru.json';
import en from './lang_en.json';

const test = new Trans();
test.init({ translations: { ru, en }, locale: 'ru' }).then(() => {
  console.log({ test });
})
