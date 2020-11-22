const path = require('path');

const { readFile } = require('../utils/file');

// TODO: Add parseBookKey()
function getBookIndex (key, books) {
  const bookKey = (book) => book.abbreviation.replace(' ', '').toLowerCase();
  const index = books.findIndex(book => bookKey(book) === key);

  if (index < 0) throw new Error('Book not found.');

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

function queryVerse (data, options = {}) {
  const { bookKey, chapterKey, verseKey } = options;
  const errorNotFound = new Error('Verse not found.');

  const { books } = data;
  const book = books[getBookIndex(bookKey, books)];

  const { chapters } = book;
  const chapterIndex = chapterKey
    ? getKeyIndex(chapterKey)
    : getRandomIndex(chapters.length);
  const chapter = chapters[chapterIndex];

  if (!chapter) throw errorNotFound;

  const { verses } = chapter;
  const verseIndex = verseKey
    ? getKeyIndex(verseKey)
    : getRandomIndex(verses.length);
  const verse = verses[verseIndex];

  if (!verse) throw errorNotFound;

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
  const rootPath = path.join(__dirname, '..');
  const filePath = path.resolve(rootPath, options.dataPath);
  const data = JSON.parse(await readFile(filePath));

  return canQueryVerse(options)
    ? queryVerse(data, options)
    : getRandomVerse(data);
}

module.exports = {
  canQueryVerse,
  canRandomizeVerse,
  getVerse
};
