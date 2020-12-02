const { parsePassage, queryVerse } = require('../verse');

jest.mock('../errors', () => ({
  PASSAGE_BOOK_ERROR: 'Passage book error',
  BOOK_NOT_FOUND_ERROR: 'Book not found error',
  CHAPTER_NOT_FOUND_ERROR: 'Chapter not found error',
  VERSE_NOT_FOUND_ERROR: 'Verse not found error'
}));

describe('parsePassage()', () => {
  describe('when passing invalid args', () => {
    const invalidArgs = [
      { type: 'null', arg: null },
      { type: 'undefined', arg: undefined },
      { type: 'empty string', arg: '' },
      { type: 'non-word string', arg: '14:4' }
    ];

    let passage;
    let func;

    beforeEach(() => {
      func = () => parsePassage(passage);
    });

    invalidArgs.forEach(({ type, arg }) => {
      describe(type, () => {
        beforeAll(() => {
          passage = arg;
        });

        test('throws passage book error', () => {
          expect(func).toThrow('Passage book error');
        });
      });
    });
  });

  describe('when passing valid args', () => {
    let passage;
    let result;

    beforeEach(() => {
      result = parsePassage(passage);
    });

    describe('book', () => {
      beforeAll(() => {
        passage = 'Revelation';
      });

      test('returns object with book key', () => {
        expect(result).toEqual(expect.objectContaining({
          bookKey: 'revelation'
        }));
      });
    });

    describe('numbered book', () => {
      beforeAll(() => {
        passage = '1 Timothy';
      });

      test('returns object with book key', () => {
        expect(result).toEqual(expect.objectContaining({
          bookKey: '1timothy'
        }));
      });
    });

    describe('book and chapter', () => {
      beforeAll(() => {
        passage = 'Romans 14';
      });

      test('returns object with book and chapter keys', () => {
        expect(result).toEqual(expect.objectContaining({
          bookKey: 'romans',
          chapterKey: '14'
        }));
      });
    });

    describe('book, chapter, and verse', () => {
      beforeAll(() => {
        passage = 'Romans 14:4';
      });

      test('returns object with book, chapter, and verse keys', () => {
        expect(result).toEqual(expect.objectContaining({
          bookKey: 'romans',
          chapterKey: '14',
          verseKey: '4'
        }));
      });
    });
  });
});

describe('queryVerse()', () => {
  describe('when passing invalid args', () => {
    let data;
    let passage;
    let func;

    beforeEach(() => {
      func = () => queryVerse(data, passage);
    });

    describe('invalid book key', () => {
      beforeAll(() => {
        data = { books: [] };
        passage = { bookKey: 'revelation' };
      });

      test('throws book not found error', () => {
        expect(func).toThrow('Book not found error');
      });
    });

    describe('invalid chapter key', () => {
      beforeAll(() => {
        data = { books: [{ name: 'Revelation', chapters: [] }] };
        passage = { bookKey: 'revelation', chapterKey: '1' };
      });

      test('throws chapter not found error', () => {
        expect(func).toThrow('Chapter not found error');
      });
    });

    describe('invalid verse key', () => {
      beforeAll(() => {
        data = { books: [{ name: 'Revelation', chapters: [{ verses: [] }] }] };
        passage = { bookKey: 'revelation', chapterKey: '1', verseKey: '1' };
      });

      test('throws verse not found error', () => {
        expect(func).toThrow('Verse not found error');
      });
    });
  });

  describe('when passing valid args', () => {
    const validArgs = [
      { type: 'book key with name', arg: { bookKey: 'book_key_name' } },
      { type: 'book key with abbreviation', arg: { bookKey: 'book_key_abbreivation' } },
      { type: 'book and chapter keys', arg: { bookKey: 'book_key_name', chapterKey: '1' } },
      { type: 'book, chapter, and verse keys', arg: { bookKey: 'book_key_name', chapterKey: '1', verseKey: '1' } }
    ];

    const data = {
      books: [{
        id: '1',
        name: 'book_key_name',
        abbreviation: 'book_key_abbreivation',
        chapters: [{
          id: '1',
          name: 'chapter name',
          number: 1,
          verses: [{
            id: '1',
            name: 'verse name',
            number: 1,
            text: 'verse text'
          }]
        }]
      }]
    };

    let passage;
    let result;

    beforeEach(() => {
      result = queryVerse(data, passage);
    });

    validArgs.forEach(({ type, arg }) => {
      describe(type, () => {
        beforeAll(() => {
          passage = arg;
        });

        test('returns object with verse properties', () => {
          expect(result).toEqual(expect.objectContaining({
            id: '1',
            name: 'verse name',
            number: 1,
            text: 'verse text'
          }));
        });
      });
    });
  });
});
