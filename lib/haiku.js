const syllable = require('syllable');

const { canRandomizeVerse, getVerse } = require('./verse');

const {
  MIN_SYLLABLES,
  LINE_SYLLABLES,
  REGEX_WORD_CHARACTER,
  REGEX_END_PUNCTUATION
} = require('./constants');

function constructText (verse) {
  let text = verse.text;

  if (syllable(text) < MIN_SYLLABLES) {
    const nextVerse = verse.metadata.verses[verse.number];
    const nextText = nextVerse.text;
    const startsWithEmDash = nextText.startsWith('\u2014');
    const spacing = startsWithEmDash ? null : ' ';

    text += `${spacing}${nextText}`;
  }

  return text;
}

function deconstructText (text) {
  const linesOfWords = [];

  let textWords = text.match(REGEX_WORD_CHARACTER);
  let lineWords = [];

  function resetWords (index) {
    textWords = textWords.slice(index + 1);
    lineWords = [];
  }

  for (let i = 0; i < LINE_SYLLABLES.length; ++i) {
    for (let j = 0; j < textWords.length; ++j) {
      lineWords.push(textWords[j]);

      if (syllable(lineWords.join(' ')) === LINE_SYLLABLES[i]) {
        linesOfWords.push(lineWords);
        resetWords(j);
        break;
      }
    }
  }

  return linesOfWords;
}

function reconstructText (text, linesOfWords) {
  const lines = [];

  let textRef = text;

  function constructLine (words) {
    const lineText = words.join(' ');
    const lineTextIndexStart = textRef.indexOf(lineText);

    if (lineTextIndexStart >= 0) {
      let lineTextIndexEnd = lineText.length;
      if (lineTextIndexStart > 0) lineTextIndexEnd += lineTextIndexStart;

      const nextChar = textRef[lineTextIndexEnd];
      const nextOuterChar = textRef[lineTextIndexEnd + 1];

      if (nextChar && nextChar.match(REGEX_END_PUNCTUATION)) {
        if (nextOuterChar && nextOuterChar.match(REGEX_END_PUNCTUATION)) lineTextIndexEnd++;
        lineTextIndexEnd++;
      }

      const line = textRef.substring(0, lineTextIndexEnd);
      textRef = textRef.slice(line.length).trim();

      return line.trim();
    }

    return constructLine(words.slice(1));
  }

  for (let i = 0; i < linesOfWords.length; ++i) {
    lines.push(constructLine(linesOfWords[i]));
  }

  return lines;
}

async function getLines (verse, options = {}) {
  const text = constructText(verse);
  const linesOfWords = deconstructText(text);
  const isInvalid = linesOfWords.length < LINE_SYLLABLES.length;

  if (isInvalid) {
    if (canRandomizeVerse(options)) return getLines(await getVerse());
    throw new Error('Text contains invalid pattern of syllables.');
  }

  return reconstructText(text, linesOfWords);
}

function getMetadata (verse) {
  const { metadata } = verse;
  delete verse.metadata;
  metadata.verse = verse;

  return metadata;
}

async function generateHaiku (verse, options = {}) {
  const lines = await getLines(verse, options);
  const haiku = { id: verse.id, lines };

  return {
    ...haiku,
    metadata: getMetadata(verse)
  };
}

module.exports = {
  generateHaiku
};
