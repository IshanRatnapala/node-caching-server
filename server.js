'use strict';

const express = require('express');
const request = require('superagent');
const PORT = process.env.PORT || 3000;

const app = express();

function respond (org, numberOfRepos) {
    return `org ${org} has ${numberOfRepos} public reps`;
}

function getNumberOfRepos (req, res, next) {
    const org = req.query.org;
    request.get(`https://api.github.com/orgs/${org}/repos`, function (err, response) {
        if (err) throw err;

        let repoNumber = response.body.length;
        res.send(respond(org, repoNumber));
    });
}

app.get('/repos', getNumberOfRepos);

console.log(PORT);
app.listen(PORT, function () {
    console.log('Server started on port'. PORT);
});
