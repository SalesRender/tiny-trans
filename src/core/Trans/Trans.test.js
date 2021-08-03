/* eslint-disable no-template-curly-in-string */
import { Trans } from './Trans';

const translations = {
  ru: {
    screens: {
      Home: {
        title: 'Заголовок',
        description: 'Описание ${desc} ${name}',
        plural: {
          zero: 'ноль',
          one: 'один',
          two: 'два',
          few: 'несколько',
          many: 'много',
          other: 'другое ${test} ${test1}',
        },
      },
    },
    errors: {
      error1: 'ошибка 1',
      error2: 'ошибка 2',
    },
  },
  en: {
    screens: {
      Home: {
        title: 'Title',
        description: 'Description ${desc} ${name}',
        plural: {
          zero: 'zero',
          one: 'one',
          two: 'two',
          few: 'few',
          many: 'many',
          other: 'other ${test} ${test1}',
        },
      },
    },
    errors: {
      error1: 'error 1',
      error2: 'error 2',
    },
  },
};

describe('Trans', () => {
  describe('basis', () => {
    const trans = new Trans();
    trans.init({ translations, locale: 'ru' });

    it('init', () => {
      expect(trans.locale).toBe('ru');
      expect(trans.content).toEqual(translations.ru);
    });

    it('change translate', () => {
      trans.changeLocale('en');
      expect(trans.locale).toBe('en');
      expect(trans.content).toEqual(translations.en);
    });
  });

  describe('main', () => {
    const trans = new Trans();
    trans.init({ translations, locale: 'en' });

    describe('create translate', () => {
      it('case 1', () => {
        const translate = trans.createTranslate`screens`;
        expect(translate`Home.title`).toBe('Title');
      });

      it('case 2', () => {
        const translate = trans.createTranslate`screens.Home`;
        expect(translate`title`).toBe('Title');
      });

      it('case 3', () => {
        const translate = trans.createTranslate`screens.Home.title`;
        expect(translate``).toBe('Title');
      });

      it('case 4', () => {
        const translate = trans.createTranslate``;
        expect(translate`screens.Home.title`).toBe('Title');
      });

      it('case 5', () => {
        const translate = trans.createTranslate`screens.Home`;
        expect(translate`errors.error1`).toBe('error 1');
      });

      it('case 6 - variable', () => {
        const translate = trans.createTranslate`screens.Home`;
        expect(translate`description`).toBe('Description ${desc} ${name}');
      });

      it('case 7 - variable', () => {
        const translate = trans.createTranslate`screens.Home`;
        expect(translate(`description`, { variables: { desc: 'desc' } })).toBe('Description desc ${name}');
      });

      it('case 8 - variable', () => {
        const translate = trans.createTranslate`screens.Home`;
        expect(translate(`description`, { variables: { desc: 'desc', name: 'name' } })).toBe('Description desc name');
      });

      it('case 9 - plural', () => {
        const translate = trans.createTranslate`screens.Home`;
        expect(translate(`plural`, { count: 1 })).toBe('one');
      });

      it('case 10 - plural & variables', () => {
        const translate = trans.createTranslate`screens.Home`;
        expect(translate(`plural`, { count: 0, variables: { test: 'test', test1: 'test1' } })).toBe('other test test1');
      });
    });

    describe('error handing', () => {
      describe('throw', () => {
        it('plural', () => {
          const translate = trans.createTranslate`screens.Home`;
          expect(() => translate`plural`).toThrowErrorMatchingInlineSnapshot(
            '"invalid translate: \\"[object Object]\\"; as a json: {\\"zero\\":\\"zero\\",\\"one\\":\\"one\\",\\"two\\":\\"two\\",\\"few\\":\\"few\\",\\"many\\":\\"many\\",\\"other\\":\\"other ${test} ${test1}\\"}. full path: \\"screens.Home.plural\\"; translate path: \\"plural\\";"'
          );
        });

        it('broken path', () => {
          const translate = trans.createTranslate`screens`;
          expect(() => translate`Home`).toThrowErrorMatchingInlineSnapshot(
            '"invalid translate: \\"[object Object]\\"; as a json: {\\"title\\":\\"Title\\",\\"description\\":\\"Description ${desc} ${name}\\",\\"plural\\":{\\"zero\\":\\"zero\\",\\"one\\":\\"one\\",\\"two\\":\\"two\\",\\"few\\":\\"few\\",\\"many\\":\\"many\\",\\"other\\":\\"other ${test} ${test1}\\"}}. full path: \\"screens.Home\\"; translate path: \\"Home\\";"'
          );
        });

        it('broken path 2', () => {
          const translate = trans.createTranslate`screens.Home.broken`;
          expect(() => translate`Home`).toThrowErrorMatchingInlineSnapshot(
            '"invalid translate: \\"undefined\\"; as a json: undefined. full path: \\"screens.Home.broken.Home\\"; translate path: \\"Home\\";"'
          );
        });
      });

      describe('ignore', () => {
        it('plural', () => {
          const translate = trans.createTranslate`screens.Home`;
          expect(translate(`plural`, { errorsMode: 'ignore' })).toBe('');
        });

        it('broken path', () => {
          const translate = trans.createTranslate`screens`;
          expect(translate(`Home`, { errorsMode: 'ignore' })).toBe('');
        });

        it('broken path 2', () => {
          const translate = trans.createTranslate`screens.Home.broken`;
          expect(translate(`Home`, { errorsMode: 'ignore' })).toBe('');
        });
      });

      describe('handle', () => {
        it('plural', () => {
          const translate = trans.createTranslate`screens.Home`;
          expect(translate(`plural`, { errorsMode: (e) => `${e.name}. test` })).toBe('Error. test');
        });

        it('broken path', () => {
          const translate = trans.createTranslate`screens`;
          expect(translate(`Home`, { errorsMode: (e) => `${e.name}. test` })).toBe('Error. test');
        });

        it('broken path 2', () => {
          const translate = trans.createTranslate`screens.Home.broken`;
          expect(translate(`Home`, { errorsMode: (e) => `${e.name}. test` })).toBe('Error. test');
        });
      });
    });
  });
});
