import path from 'path';
import fs from 'fs';
import arg from 'arg';

import { readCoverage, toPercentage, badge } from './index.js';

function updateBadge(args) {
  let pct = 0;
  if (args['--set']) {
    // make sure we can handle "--set 70" and "--set 70%"
    pct = parseFloat(args['--set']);
    console.log(`using coverage number: ${pct}`);
  } else {
    pct = readCoverage();
  }
  pct = toPercentage(pct);
  console.log(`clamped coverage: ${pct}`);

  const readmeFilename = path.join(process.cwd(), 'README.md');
  const readmeText = fs.readFileSync(readmeFilename, 'utf8');

  function replaceShield() {
    const coverageRe = badge.getCoverageRe();
    console.log(`coverage regex: "${coverageRe}"`);

    const coverageBadge = badge.getCoverageBadge(pct);
    console.log(`new coverage badge: "${coverageBadge}"`);
    if (!coverageBadge) {
      console.error(`cannot form new badge for ${pct}%`);
      return readmeText;
    }

    let found;
    const updatedReadmeText = readmeText.replace(
      coverageRe,
      (match) => {
        found = true;
        console.log(`match: ${match}`);
        return coverageBadge;
      },
    );

    if (!found) {
      console.log(`Could not find code coverage badge in file ${readmeFilename}`);
      console.log('Insert new badge on the first line');
    }
    return updatedReadmeText;
  }

  const maybeChangedText = replaceShield();
  if (maybeChangedText !== readmeText) {
    console.log(`saving updated readme with coverage ${pct}%`);
    fs.writeFileSync(readmeFilename, maybeChangedText, 'utf8');
  } else {
    console.log('no code coverage badge change');
  }
}

const args = arg({
  '--set': String,
});
console.log(`args: ${JSON.stringify(args)}`);

updateBadge(args);
