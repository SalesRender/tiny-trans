/* eslint-disable no-template-curly-in-string, @typescript-eslint/explicit-function-return-type */
import { ContentPreparer } from './ContentPreparer';

describe('ContentPreparer', () => {
  describe('the right behavior', () => {
    describe('simple', () => {
      it('basis', () => {
        expect(new ContentPreparer().set('test', { locale: 'ru' }).content).toBe('test');
      });

      it('setCount', () => {
        expect(new ContentPreparer().set({ many: 'test' }, { locale: 'ru' }).setCount(0).content).toBe('test');
      });

      it('invalid setVariables', () => {
        expect(new ContentPreparer().set('test', { locale: 'ru' }).setVariables({ test: 'wow' }).content).toBe('test');
      });

      it('right setVariables 1', () => {
        expect(new ContentPreparer().set('test ${test}', { locale: 'ru' }).setVariables({ test: 'wow' }).content).toBe(
          'test wow'
        );
      });

      it('right setVariables 2', () => {
        expect(
          new ContentPreparer()
            .set('test ${test} ${test2}', { locale: 'ru' })
            .setVariables({ test: 'wow', test2: 'mow' }).content
        ).toBe('test wow mow');
      });

      it('right complex invalid setVariables', () => {
        expect(
          new ContentPreparer().set({ many: 'test' }, { locale: 'ru' }).setCount(0).setVariables({ test: 'wow' })
            .content
        ).toBe('test');
      });

      it('right complex right setVariables', () => {
        expect(
          new ContentPreparer()
            .set({ many: 'test ${test}' }, { locale: 'ru' })
            .setCount(0)
            .setVariables({ test: 'wow' }).content
        ).toBe('test wow');
      });

      it('broken complex 1', () => {
        expect(
          () =>
            new ContentPreparer().set({ one: 'test' }, { locale: 'ru' }).setCount(0).setVariables({ test: 'wow' })
              .content
        ).toThrowErrorMatchingInlineSnapshot('"invalid translate. Translated result: undefined; as a json: undefined"');
      });

      it('broken complex 2', () => {
        expect(
          () => new ContentPreparer().set('test', { locale: 'ru' }).setCount(0).setVariables({ test: 'wow' }).content
        ).toThrowErrorMatchingInlineSnapshot('"content is not plural. content: \\"test\\"; as a json: \\"test\\""');
      });
    });
  });

  describe('errors', () => {
    it('basis', () => {
      expect(
        () => new ContentPreparer().set('test', { locale: 'ru' }).setCount(0).content
      ).toThrowErrorMatchingInlineSnapshot('"content is not plural. content: \\"test\\"; as a json: \\"test\\""');
    });
  });

  describe('pluralFn', () => {
    it('simple', () => {
      expect(
        new ContentPreparer().set({ many: 'test' }, { locale: 'ru', pluralFn: () => 'many' }).setCount(0).content
      ).toBe('test');
    });

    it('handle count', () => {
      expect(
        new ContentPreparer().set({ many0: 'test' }, { locale: 'ru', pluralFn: (count) => `many${count}` }).setCount(0)
          .content
      ).toBe('test');
    });

    it('broken', () => {
      expect(
        () => new ContentPreparer().set({ many: 'test' }, { locale: 'ru', pluralFn: () => `one` }).setCount(0).content
      ).toThrowErrorMatchingInlineSnapshot('"invalid translate. Translated result: undefined; as a json: undefined"');
    });
  });
});
