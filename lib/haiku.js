const syllable = require('syllable');

const { getNextVerse } = require('./verse');

const { MIN_SYLLABLES, LINE_SYLLABLES } = require('./constants');

function constructText (verse) {
  let text = verse.text;

  if (syllable(text) < MIN_SYLLABLES) {
    const nextVerse = getNextVerse(verse);

    if (!nextVerse) {
      throw new Error('Text cannot be constructed with required minimum syllables.');
    }

    const nextText = nextVerse.text;
    const startsWithEmDash = nextText.startsWith('\u2014');
    const spacing = startsWithEmDash ? null : ' ';

    text += `${spacing}${nextText}`;
  }

  return text;
}

function deconstructText (text) {
  const linesOfWords = [];

  let textWords = text.split(' ');
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

function shiftVerseText (verse) {
  const text = verse.text.split(' ').slice(1).join(' ');
  if (!text) return getNextVerse(verse);
  return { ...verse, text };
}

async function getLines (verse, options = {}) {
  const text = constructText(verse);
  const linesOfWords = deconstructText(text);
  const hasInvalidPattern = linesOfWords.length < LINE_SYLLABLES.length;

  if (hasInvalidPattern) {
    const shiftedVerse = shiftVerseText(verse);

    if (!shiftedVerse) {
      throw new Error('Text contains invalid pattern of syllables.');
    }

    return getLines(shiftedVerse, options);
  }

  return linesOfWords.map(words => words.join(' '));
}

function getMetadata (verse) {
  const { metadata } = verse;
  delete verse.metadata;
  metadata.verse = verse;

  return metadata;
}

async function generateHaiku (verse) {
  const lines = await getLines(verse);
  const haiku = { id: verse.id, lines };

  return {
    ...haiku,
    metadata: getMetadata(verse)
  };
}

module.exports = {
  generateHaiku
};
