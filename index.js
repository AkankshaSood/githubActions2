const axios = require('axios');
const core = require('@actions/core');
const { getPullRequests, getOpenPullRequests, getPullRequestsWithoutLabel, groupPullRequestsByDay } = require('./githubUtils');
const { sendNotification, createMessage2 } = require('./messengerUtils');
const { stringToObject } = require('./utils');

(async () => {
    try {
        //const gitSlackUsername = core.getInput('git-slack-username');
        const gitSlackUsername = core.getInput('git-slack-username');
        const labelsToIgnore = core.getInput('git-ignore-label');
        core.info('Getting open pull requests...');

        const pullRequests = await getPullRequests();
        const openPullRequests = getOpenPullRequests(pullRequests.data);
        const pullRequestsWithoutLabel = getPullRequestsWithoutLabel(openPullRequests, labelsToIgnore);
        if (pullRequestsWithoutLabel.length) {
            console.log(groupPullRequestsByDay(pullRequestsWithoutLabel))
            const userGithubMap = "AkankshaSood:U06TJQ47ANM,ammankapoor:U06TJQ5KD7B"
            console.log(stringToObject(userGithubMap))
            const msge = createMessage2(groupPullRequestsByDay(pullRequestsWithoutLabel), stringToObject(userGithubMap))
            sendNotification(msge)

        } else {
            //sendNotification('🎉 No Pull Request is Pending! 🎉')
        }
    } catch (err) {
        core.setFailed(err);
    }
})();
