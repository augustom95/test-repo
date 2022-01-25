const { readCoverageFromFile } = require('./index.js');

console.log('STARTING SCRIPT');

const masterCodecov = readCoverageFromFile('master/coverage-summary.json');
console.log('MASTER CODECOV', masterCodecov);

const actualCodecov = readCoverageFromFile('coverage/coverage-summary.json');
console.log('ACTUAL CODECOV', actualCodecov);

if (actualCodecov < masterCodecov) {
  console.error(`Code coverage has dropped by ${masterCodecov - actualCodecov}%`);
  process.exit(1);
}

if (actualCodecov > masterCodecov) {
  console.log(`Code coverage increased by ${actualCodecov - masterCodecov}%`);
}

if (actualCodecov === masterCodecov) {
  console.log(`Code coverage stayed the same (${masterCodecov}%)`);
}