const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { invoke } = require('./scripts/invoke');

const { argv } = yargs(hideBin(process.argv));

const defaultOptions = {
  dataPath: 'data/nrsv.json'
};

// TODO: Add option aliases and errors
const options = {
  bookKey: argv.book,
  chapterKey: argv.chapter,
  verseKey: argv.verse,
  dataPath: argv.dataPath || defaultOptions.dataPath
};

invoke(options);
