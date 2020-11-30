module.exports = {
  MIN_SYLLABLES: 17,
  LINE_SYLLABLES: [5, 7, 5],
  BOOK_PASSAGE_REGEX: /^([0-9][^\d\W]+|[^\d\W]+)/g,
  CHAPTER_PASSAGE_REGEX: /[0-9]+(?=:)/g,
  VERSE_PASSAGE_REGEX: /(?<=:)[0-9]+/g
};
