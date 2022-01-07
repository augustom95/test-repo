import path from 'path';
import fs from 'fs';

/**
 * Reads coverage JSON file produced with NYC reporter "json-summary"
 * and returns total statements percentage.
 * @param {string} filename File to read, by default "coverage/coverage-summary.json"
 * @returns {number} Percentage from 0 to 100
 */
export function readCoverage() {
  const filename = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
  console.log('reading coverage summary from: %s', filename);
  const coverage = JSON.parse(fs.readFileSync(filename, 'utf-8'));
  return coverage.total.statements.pct;
}

export function toPercentage(x) {
  if (typeof x !== 'number') {
    throw new Error(`Expected ${x} to be a number, not ${typeof x}`);
  }
  if (x < 0) {
    return 0;
  }
  if (x > 100) {
    return 100;
  }
  return x;
}

const availableColors = ['red', 'yellow', 'green', 'brightgreen'];

const availableColorsReStr = `(:?${availableColors.join('|')})`;

function getCoverageRe() {
  // note, Shields.io escaped '-' with '--'
  // should match the expression in getCoverageFromText
  const coverageRe = new RegExp(`https://img\\.shields\\.io/badge/code--coverage-\\d+(\\.?\\d+)?%25-${availableColorsReStr}`);
  return coverageRe;
}

function getColor(coveredPercentage) {
  if (coveredPercentage < 60) {
    return 'red';
  }
  if (coveredPercentage < 80) {
    return 'yellow';
  }
  if (coveredPercentage < 90) {
    return 'green';
  }
  return 'brightgreen';
}

function getCoverageBadge(pct) {
  const color = getColor(pct) || 'lightgrey';
  console.log('for coverage %d% badge color "%s"', pct, color);

  const coverageBadge = `https://img.shields.io/badge/code--coverage-${pct}%25-${color}`;
  return coverageBadge;
}

function getCoverageFromReadme() {
  const readmeFilename = path.join(process.cwd(), 'README.md');
  console.log('reading the README from %s', readmeFilename);
  const readmeText = fs.readFileSync(readmeFilename, 'utf8');
  // eslint-disable-next-line no-use-before-define
  return getCoverageFromText(readmeText);
}

/**
 * Given Markdown text, finds the code coverage badge and
 * extracts the percentage number.
 * @returns {number|undefined} Returns converted percentage if found
 */
function getCoverageFromText(text) {
  // should match the expression in "getCoverageRe" function
  const coverageRe = new RegExp(`https://img\\.shields\\.io/badge/code--coverage-(\\d+(\\.?\\d+)?)%25-${availableColorsReStr}`);
  const matches = coverageRe.exec(text);

  if (!matches) {
    console.log('Could not find coverage badge in the given text');
    console.log(`text\n---\n${text}\n---`);
    return;
  }
  console.log('coverage badge "%s" percentage "%s"', matches[0], matches[1]);
  const pct = toPercentage(parseFloat(matches[1]));
  console.log('parsed percentage: %d', pct);
  // eslint-disable-next-line consistent-return
  return pct;
}

export const badge = {
  availableColors,
  availableColorsReStr,
  getCoverageFromReadme,
  getCoverageFromText,
  getCoverageRe,
  getCoverageBadge,
};
