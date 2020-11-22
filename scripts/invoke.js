const { getVerse } = require('../lib/verse');
const { generateHaiku } = require('../lib/haiku');

async function invoke (options = {}) {
  try {
    const verse = await getVerse(options);
    const haiku = await generateHaiku(verse, options);

    console.log(haiku);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  invoke
};
