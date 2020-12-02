const { parsePassage } = require('../verse');

jest.mock('../errors', () => ({
  PASSAGE_BOOK_ERROR: 'Passage book error.'
}));

describe('parsePassage()', () => {
  describe('when passed invalid data', () => {
    const invalidData = [
      { type: 'null', data: null },
      { type: 'undefined', data: undefined },
      { type: 'empty string', data: '' },
      { type: 'non-word string', data: '14:4' }
    ];

    invalidData.forEach(({ type, data }) => {
      it(`throws passage book error with ${type} arg`, () => {
        const parsePassageFunc = () => parsePassage(data);
        expect(parsePassageFunc).toThrow('Passage book error.');
      });
    });
  });

  describe('when passed valid data', () => {
    it('returns object with key from passage with book name', () => {
      const result = parsePassage('Revelation');

      expect(result).toEqual(expect.objectContaining({
        bookKey: 'revelation'
      }));
    });

    it('returns object with key from passage with book name and number', () => {
      const result = parsePassage('1 Timothy');

      expect(result).toEqual(expect.objectContaining({
        bookKey: '1timothy'
      }));
    });

    it('returns object with keys from passage with book and chapter', () => {
      const result = parsePassage('Romans 14');

      expect(result).toEqual(expect.objectContaining({
        bookKey: 'romans',
        chapterKey: '14'
      }));
    });

    it('returns object with keys from passage with book, chapter, and verse', () => {
      const result = parsePassage('Romans 14:4');

      expect(result).toEqual(expect.objectContaining({
        bookKey: 'romans',
        chapterKey: '14',
        verseKey: '4'
      }));
    });
  });
});
