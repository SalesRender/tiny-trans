import { Trans } from '../dist/main';
import ru from './lang_ru.json';
import en from './lang_en.json';

const test = new Trans({ translations: { ru, en }, locale: 'ru' });
test.init().then(() => {
  console.log({ test });
})
