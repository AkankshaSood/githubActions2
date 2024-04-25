const axios = require('axios');

const jsonData = {
    '4/21/2024': [
      {
        url: 'https://api.github.com/repos/AkankshaSood/GithubActions/pulls/3',
        id: 1833364099,
        node_id: 'PR_kwDOLq3vHc5tRuqD',
        html_url: 'https://github.com/AkankshaSood/GithubActions/pull/3',
        // Other properties omitted for brevity
      },
      {
        url: 'https://api.github.com/repos/AkankshaSood/GithubActions/pulls/2',
        id: 1833357551,
        node_id: 'PR_kwDOLq3vHc5tRtDv',
        html_url: 'https://github.com/AkankshaSood/GithubActions/pull/2',
        // Other properties omitted for brevity
      }
    ],
    '4/7/2024': [
      {
        url: 'https://api.github.com/repos/AkankshaSood/GithubActions/pulls/1',
        id: 1810915470,
        node_id: 'PR_kwDOLq3vHc5r8GCO',
        html_url: 'https://github.com/AkankshaSood/GithubActions/pull/1',
        // Other properties omitted for brevity
      }
    ]
  };

  function createMessage2(jsonData, gitSlackUsername) {
    const blocks = [];

    blocks.push({
        type: 'section',
        text: {
             type: 'mrkdwn',
             text: `:red_circle: *AGING PRs* :red_circle:`
        }
     })
  
    // Loop through each date in the JSON data
    for (const date in jsonData) {
        const createdAt = new Date(date);
        const today = new Date();
        const daysPending = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24));
         // Add a divider after each date
        blocks.push({ type: 'divider' });

        blocks.push({
            type: 'section',
            text: {
                 type: 'mrkdwn',
                    text: `*Open since ${daysPending} days*`
            }
         });
  
        // Loop through each pull request for the current date
        jsonData[date].forEach(pr => {
            blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*<${pr.html_url}|${pr.title}>*\n*Author*: <@${gitSlackUsername[pr.user.login]}>\n*Reviewers*: ${getTaggedReviewersString(pr.requested_reviewers, gitSlackUsername)}`
                }
            });
            blocks.push({
                type: 'context',
                 elements: [{
                    type: 'plain_text',
                    emoji: true,
                    text: 'File Change: 2 Files\n'
                }]
            });
        });
    }
  // Create the final JSON object
    const finalJson = { blocks };
    console.log(JSON.stringify(blocks));
    return blocks
  }

  function createMessageObject(prData, gitSlackUsername) {
    let message = ':red_circle: Aging PRs: :red_circle:\n\n';
    //console.log(prData['4/7/2024'][0].requested_reviewers)
    for (const date in prData) {
        const createdAt = new Date(date);
        const today = new Date();
        const daysPending = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24));
        message += `*PR pending since ${daysPending} days:*\n`;
        prData[date].forEach(pr => {
            message += `   - Title: <${pr.html_url}|${pr.title}>\n`;
            message += `   - Reviewers: ${getTaggedReviewersString(pr.requested_reviewers, gitSlackUsername)}\n`;
            message += `   - Author: <@${gitSlackUsername[pr.user.login]}>\n\n`;
        });
    }

    return message;
}
  
  
  


function sendNotification(message) {
    console.log("sendinggggggggggg")
    return axios({
        method: 'POST',
        url: 'https://hooks.slack.com/services/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',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            channel: '#actions',
            username: 'Pull Request reviews reminder',
            blocks: message
        }
    });
}

function getTaggedReviewersString(requested_reviewers, gitSlackUsername) {
    let taggedReviewerString = ""
    //console.log(requested_reviewers)
    for (const reviewer of requested_reviewers) {
        //console.log(reviewer)
        taggedReviewerString += `<@${gitSlackUsername[reviewer.login]}> `
    }
    console.log(taggedReviewerString)
    return taggedReviewerString || "No Reviewers have been added"
}


module.exports = {
    sendNotification, createMessageObject, createMessage2
};