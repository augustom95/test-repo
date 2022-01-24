const { readCoverageFromFile } = require('./index.js');

console.log('STARTING SCRIPT');

const masterCodecov = readCoverageFromFile('master/coverage-summary.json');
console.log('MASTER CODECOV', masterCodecov);

const actualCodecov = readCoverageFromFile('coverage/coverage-summary.json');
console.log('ACTUAL CODECOV', actualCodecov);

if (actualCodecov < masterCodecov) {
  console.error(`Actual code coverage has dropped ${masterCodecov - actualCodecov}%`);
  process.exit(1);
}

if (actualCodecov > masterCodecov) {
  console.log(`Actual code coverage increased ${actualCodecov - masterCodecov}%`);
}

if (actualCodecov = masterCodecov) {
  console.log(`Actual code coverage stayed the same`);
}