const { readCoverageFromFile } = require('./index.js');

const masterCodecov = readCoverageFromFile('master/coverage-summary.json');
console.log('MASTER CODECOV', masterCodecov);

const actualCodecov = readCoverageFromFile('coverage/coverage-summary.json');
console.log('ACTUAL CODECOV', actualCodecov);
