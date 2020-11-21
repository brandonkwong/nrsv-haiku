const syllable = require('syllable');

const { MIN_SYLLABLES, LINE_SYLLABLES } = require('./constants');

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

function getLines (verse) {
  const regexWordCharacter = /(\w+)/g;
  const text = constructText(verse);
  const lines = [];

  let textWords = text.match(regexWordCharacter);
  let lineWords = [];

  function resetWords (index) {
    textWords = textWords.slice(index + 1);
    lineWords = [];
  }

  for (let i = 0; i < LINE_SYLLABLES.length; ++i) {
    for (let j = 0; j < textWords.length; ++j) {
      lineWords.push(textWords[j]);

      if (syllable(lineWords.join(' ')) === LINE_SYLLABLES[i]) {
        lines.push(lineWords);
        resetWords(j);
        break;
      }
    }
  }

  if (lines.length < LINE_SYLLABLES.length) {
    throw new Error('Text contains invalid pattern of syllables.');
  }

  return lines;
}

function getMetadata (verse) {
  const { metadata } = verse;
  delete verse.metadata;
  metadata.verse = verse;

  return metadata;
}

function generateHaiku (verse) {
  const lines = getLines(verse);
  const haiku = { id: verse.id, lines };

  return {
    ...haiku,
    metadata: getMetadata(verse)
  };
}

module.exports = {
  generateHaiku
};
