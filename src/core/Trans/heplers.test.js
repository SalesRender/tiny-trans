import { getContent } from './helpers';

describe('Trans helpers', () => {
  describe('getContent', () => {
    it('null', () => {
      expect(getContent(null, 'test')).toBeNull();
    });

    it('basis', () => {
      expect(getContent({ test: 'test' }, 'test')).toBe('test');
    });

    it('2 levels', () => {
      expect(getContent({ test: { test1: 'test' } }, 'test.test1')).toBe('test');
    });

    it('3 levels', () => {
      expect(getContent({ test: { test1: { test2: 'test' } } }, 'test.test1.test2')).toBe('test');
    });

    it('empty path', () => {
      expect(getContent({ test: 'test' }, '')).toEqual({ test: 'test' });
    });

    it('content of 2 level', () => {
      expect(getContent({ test: { test1: 'test' } }, 'test')).toEqual({ test1: 'test' });
    });

    it('string properties', () => {
      expect(getContent({ 'test 1': { 'test 2': 'test' } }, 'test 1.test 2')).toBe('test');
    });
  });
});
