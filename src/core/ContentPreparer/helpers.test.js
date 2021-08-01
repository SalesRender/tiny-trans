import { defaultPluralFn, setCount, setVariable } from './helpers';

describe('Content Preparer helpers', () => {
  describe('setCountOrigin', () => {
    it('zero', () => {
      expect(
        setCount({
          count: 0,
          content: { zero: 'zero', one: 'one', two: 'two', few: 'few', many: 'many', other: 'other' },
          pluralFn: defaultPluralFn,
          locale: 'ru',
        })
      ).toBe('many');
    });

    it('one', () => {
      expect(
        setCount({
          count: 1,
          content: { zero: 'zero', one: 'one', two: 'two', few: 'few', many: 'many', other: 'other' },
          pluralFn: defaultPluralFn,
          locale: 'ru',
        })
      ).toBe('one');
    });

    it('two', () => {
      expect(
        setCount({
          count: 2,
          content: { zero: 'zero', one: 'one', two: 'two', few: 'few', many: 'many', other: 'other' },
          pluralFn: defaultPluralFn,
          locale: 'ru',
        })
      ).toBe('few');
    });

    it('few', () => {
      expect(
        setCount({
          count: 3,
          content: { zero: 'zero', one: 'one', two: 'two', few: 'few', many: 'many', other: 'other' },
          pluralFn: defaultPluralFn,
          locale: 'ru',
        })
      ).toBe('few');
    });

    it('few 2', () => {
      expect(
        setCount({
          count: 5,
          content: { zero: 'zero', one: 'one', two: 'two', few: 'few', many: 'many', other: 'other' },
          pluralFn: defaultPluralFn,
          locale: 'ru',
        })
      ).toBe('many');
    });

    it('many 1', () => {
      expect(
        setCount({
          count: 15,
          content: { zero: 'zero', one: 'one', two: 'two', few: 'few', many: 'many', other: 'other' },
          pluralFn: defaultPluralFn,
          locale: 'ru',
        })
      ).toBe('many');
    });

    it('many 2', () => {
      expect(
        setCount({
          count: 25,
          content: { zero: 'zero', one: 'one', two: 'two', few: 'few', many: 'many', other: 'other' },
          pluralFn: defaultPluralFn,
          locale: 'ru',
        })
      ).toBe('many');
    });

    it('other 1', () => {
      expect(
        setCount({
          count: 25.2,
          content: { zero: 'zero', one: 'one', two: 'two', few: 'few', many: 'many', other: 'other' },
          pluralFn: defaultPluralFn,
          locale: 'ru',
        })
      ).toBe('other');
    });

    it('other 2', () => {
      expect(
        setCount({
          count: 0.2,
          content: { zero: 'zero', one: 'one', two: 'two', few: 'few', many: 'many', other: 'other' },
          pluralFn: defaultPluralFn,
          locale: 'ru',
        })
      ).toBe('other');
    });
  });

  describe('setVariable', () => {
    /* eslint-disable no-template-curly-in-string */
    it('basis', () => {
      expect(setVariable('test ${COUNT} test', { key: 'COUNT', value: '2' })).toBe('test 2 test');
    });

    it('few', () => {
      expect(setVariable('test ${COUNT} test ${COUNT} ${COUNT}', { key: 'COUNT', value: '2' })).toBe('test 2 test 2 2');
    });
    /* eslint-enable no-template-curly-in-string */
  });
});
