const axios = require('axios');

const { GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_API_URL } = process.env;

// const PULLS_ENDPOINT = `${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}/pulls`;

const PULLS_ENDPOINT = 'https://api.github.com/repos/AkankshaSood/GithubActions/pulls';

async function getPullRequests() {
  console.log(PULLS_ENDPOINT);
  return axios({
    method: 'GET',
    url: PULLS_ENDPOINT,
    headers: AUTH_HEADER,
  });
}

function getOpenPullRequests(pullRequests) {
  return pullRequests.filter((pullRequest) => {
    return pullRequest.state === 'open'
  })
}

function getPullRequestsWithoutLabel(pullRequests, ignoreLabels) {
  const ignoreLabelsArray = ignoreLabels.replace(/\s*,\s*/g, ',').split(',');
  const ignoreLabelsSet = new Set(ignoreLabelsArray);
  return pullRequests.filter((pr) => !((pr.labels || []).some((label) => ignoreLabelsSet.has(label.name))));
}

function groupPullRequestsByDay(pullRequests) {
  const groupedPullRequests = {};
  pullRequests.forEach(pullRequest => {
      const createDate = new Date(pullRequest.created_at).toLocaleDateString();
      if (!groupedPullRequests[createDate]) {
          groupedPullRequests[createDate] = [];
      }
      groupedPullRequests[createDate].push(pullRequest);
  });
  return groupedPullRequests;
}

module.exports = {
  getPullRequests,
  getOpenPullRequests,
  getPullRequestsWithoutLabel,
  groupPullRequestsByDay
};
