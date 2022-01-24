const { readCoverageFromFile } = require('./index.js');

console.log('STARTING SCRIPT');

const masterCodecov = readCoverageFromFile('master/coverage-summary.json');
console.log('MASTER CODECOV', masterCodecov);

const actualCodecov = readCoverageFromFile('coverage/coverage-summary.json');
console.log('ACTUAL CODECOV', actualCodecov);
