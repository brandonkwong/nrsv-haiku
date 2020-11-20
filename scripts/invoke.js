const { getVerse } = require('../lib/verse');

async function invoke (options = {}) {
  try {
    const verse = await getVerse(options);
    console.log(verse);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  invoke
};
