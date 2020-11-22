const path = require('path');

const { readFile } = require('../utils/file');

// TODO: Add parseBookKey()
function getBookIndex (key, books) {
  const bookKey = (book) => book.abbreviation.replace(' ', '').toLowerCase();
  return books.findIndex(book => bookKey(book) === key);
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

function queryVerse (data, options = {}) {
  const { bookKey, chapterKey, verseKey } = options;

  const { books } = data;
  const book = books[getBookIndex(bookKey, books)];

  const { chapters } = book;
  const chapterIndex = chapterKey
    ? getKeyIndex(chapterKey)
    : getRandomIndex(chapters.length);
  const chapter = chapters[chapterIndex];

  const { verses } = chapter;
  const verseIndex = verseKey
    ? getKeyIndex(verseKey)
    : getRandomIndex(verses.length);
  const verse = verses[verseIndex];

  return {
    ...verse,
    metadata: getMetadata(book, chapter, verses)
  };
}

function canQueryVerse (options) {
  return !!options.bookKey;
}

function canRandomizeVerse (options) {
  return !options.verseKey;
}

async function getVerse (options = {}) {
  const dataPath = path.resolve(__dirname, '../data/nrsv.json');
  const data = JSON.parse(await readFile(dataPath));

  return canQueryVerse(options)
    ? queryVerse(data, options)
    : getRandomVerse(data);
}

module.exports = {
  canQueryVerse,
  canRandomizeVerse,
  getVerse
};
