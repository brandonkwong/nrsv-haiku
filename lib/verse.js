const path = require('path');

const { readFile } = require('../utils/file');

const {
  BOOK_PASSAGE_REGEX,
  CHAPTER_PASSAGE_REGEX,
  VERSE_PASSAGE_REGEX
} = require('./constants');

const {
  PASSAGE_BOOK_ERROR,
  BOOK_NOT_FOUND_ERROR,
  CHAPTER_NOT_FOUND_ERROR,
  VERSE_NOT_FOUND_ERROR
} = require('./errors');

function squashString (string) {
  return string.replace(' ', '').toLowerCase();
}

function parsePassage (passage) {
  const query = passage ? squashString(passage) : '';
  const book = query.match(BOOK_PASSAGE_REGEX);

  if (!passage || !book) throw new Error(PASSAGE_BOOK_ERROR);

  const [bookKey] = book;

  let chapterKey = null;
  let verseKey = null;

  if (query.indexOf(':') > 0) {
    chapterKey = query.match(CHAPTER_PASSAGE_REGEX)[0];
    verseKey = query.match(VERSE_PASSAGE_REGEX)[0];
  } else if (query.length > bookKey.length) {
    chapterKey = query.slice(bookKey.length).trim();
  }

  return { bookKey, chapterKey, verseKey };
}

function getBookIndex (key, books) {
  const index = books.findIndex(({ name, abbreviation }) => (
    key === squashString(abbreviation) ||
    key === squashString(name)
  ));

  if (index < 0) throw new Error(BOOK_NOT_FOUND_ERROR);

  return index;
}

function getKeyIndex (key) {
  return Number(key) - 1;
}

function getRandomIndex (length) {
  return Math.floor(Math.random() * length);
}

function getMetadata (book, chapter, verses) {
  delete book.chapters;
  delete chapter.verses;

  return {
    book,
    chapter,
    verses
  };
}

function getRandomVerse (data) {
  const { books } = data;
  const book = books[getRandomIndex(books.length)];

  const { chapters } = book;
  const chapter = chapters[getRandomIndex(chapters.length)];

  const { verses } = chapter;
  const verse = verses[getRandomIndex(verses.length)];

  return {
    ...verse,
    metadata: getMetadata(book, chapter, verses)
  };
}

function queryVerse (data, passage) {
  console.log(passage);
  const { bookKey, chapterKey, verseKey } = passage;

  const { books } = data;
  const book = books[getBookIndex(bookKey, books)];

  const { chapters } = book;
  const chapterIndex = chapterKey
    ? getKeyIndex(chapterKey)
    : getRandomIndex(chapters.length);
  const chapter = chapters[chapterIndex];

  if (!chapter) throw new Error(CHAPTER_NOT_FOUND_ERROR);

  const { verses } = chapter;
  const verseIndex = verseKey
    ? getKeyIndex(verseKey)
    : getRandomIndex(verses.length);
  const verse = verses[verseIndex];

  if (!verse) throw new Error(VERSE_NOT_FOUND_ERROR);

  return {
    ...verse,
    metadata: getMetadata(book, chapter, verses)
  };
}

function canQueryVerse (options) {
  return !!options.passage;
}

function getNextVerse (verse) {
  const { metadata } = verse;
  const nextVerse = metadata.verses[verse.number];

  if (!nextVerse) return null;

  return { ...nextVerse, metadata };
}

async function getVerse (options = {}) {
  const dataPath = path.join(__dirname, '../data');
  const filePath = path.resolve(dataPath, options.data);
  const data = JSON.parse(await readFile(filePath));

  if (canQueryVerse(options)) {
    return queryVerse(data, parsePassage(options.passage));
  }

  return getRandomVerse(data);
}

module.exports = {
  getVerse,
  getNextVerse,
  parsePassage
};
