const { readCoverageFromFile } = require('./index.js');

const masterCodecov = readCoverageFromFile('master/coverage-summary.json');
console.log(`MASTER CODECOV -> ${masterCodecov}%`);

const actualCodecov = readCoverageFromFile('coverage/coverage-summary.json');
console.log(`ACTUAL CODECOV -> ${actualCodecov}%`);

function compareCodecov(actualCodecov, masterCodecov) {
  if (actualCodecov < masterCodecov) {
    console.log(`Code coverage has dropped by ${masterCodecov - actualCodecov}%`);
    
    process.exit(1);
  }
  
  if (actualCodecov > masterCodecov) {
    console.log(`Code coverage increased by ${actualCodecov - masterCodecov}%`);
  }
  
  if (actualCodecov === masterCodecov) {
    console.log(`Code coverage stayed the same (${masterCodecov}%)`);
  }
}

compareCodecov(actualCodecov, masterCodecov);
