const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const { invoke } = require('./scripts/invoke');

const { argv } = yargs(hideBin(process.argv));

const defaultOptions = {
  data: 'nrsv.json'
};

const options = {
  passage: argv.passage,
  data: argv.data || defaultOptions.data
};

invoke(options);
