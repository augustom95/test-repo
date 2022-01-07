import axios from 'axios';
import arg from 'arg';

import { readCoverage, toPercentage, badge } from './index.js';

const args = arg({
  '--check-against-readme': Boolean,
});
console.log(`args: ${JSON.stringify(args)}`);

async function setGitHubCommitStatus(options, envOptions) {
  const pct = toPercentage(readCoverage());
  console.log(`setting commit coverage: ${pct}`);
  console.log(`with options ${JSON.stringify({ repository: envOptions.repository, sha: envOptions.sha })}`);

  // REST call to GitHub API
  const url = `https://api.github.com/repos/${envOptions.repository}/statuses/${envOptions.sha}`;
  const res = await axios({
    method: 'POST',
    url,
    headers: {
      authorization: `Bearer ${envOptions.token}`,
    },
    data: {
      context: 'code-coverage',
      state: 'success',
      description: `${pct}% of statements`,
    },
  });
  console.log(`response status: ${res.status} ${res.statusText}`);

  if (options.checkAgainstReadme) {
    const readmePercentage = badge.getCoverageFromReadme();
    console.log('readmePercentage', readmePercentage);
    if (typeof readmePercentage !== 'number') {
      console.error('Could not get code coverage percentage from README');
      console.error('readmePercentage is', readmePercentage);
      process.exit(1);
    }

    if (pct > readmePercentage) {
      console.log(`coverage went up 📈 from ${readmePercentage}% to ${pct}%`);
      await axios({
        method: 'POST',
        url,
        headers: {
          authorization: `Bearer ${envOptions.token}`,
        },
        data: {
          context: 'code-coverage Δ',
          state: 'success',
          description: `went up from ${readmePercentage}% to ${pct}%`,
        },
      });
    } else if (Math.abs(pct - readmePercentage) < 1) {
      console.log(`coverage stayed the same ${readmePercentage}% ~ ${pct}%`);
      await axios({
        method: 'POST',
        url,
        headers: {
          authorization: `Bearer ${envOptions.token}`,
        },
        data: {
          context: 'code-coverage Δ',
          state: 'success',
          description: `stayed the same at ${pct}%`,
        },
      });
    } else {
      console.log(`coverage decreased 📉 from ${readmePercentage}% to ${pct}%`);
      await axios({
        method: 'POST',
        url,
        headers: {
          authorization: `Bearer ${envOptions.token}`,
        },
        data: {
          context: 'code-coverage Δ',
          state: 'failure',
          description: `decreased from ${readmePercentage}% to ${pct}%`,
        },
      });
    }
  }
}

function checkEnvVariables(env) {
  if (!env.GITHUB_TOKEN) {
    console.error('Cannot find environment variable GITHUB_TOKEN');
    process.exit(1);
  }

  if (!env.GITHUB_REPOSITORY) {
    console.error('Cannot find environment variable GITHUB_REPOSITORY');
    process.exit(1);
  }

  if (!env.GITHUB_SHA) {
    console.error('Cannot find environment variable GITHUB_SHA');
    process.exit(1);
  }
}
checkEnvVariables(process.env);

const options = {
  checkAgainstReadme: args['--check-against-readme'],
};

const envOptions = {
  token: process.env.GITHUB_TOKEN,
  repository: process.env.GITHUB_REPOSITORY,
  // allow overriding the commit SHA, useful in pull requests
  // where we want a merged commit SHA from GH event
  sha: process.env.GH_SHA || process.env.GITHUB_SHA,
};

setGitHubCommitStatus(options, envOptions).catch((e) => {
  console.error(e);
  process.exit(1);
});
