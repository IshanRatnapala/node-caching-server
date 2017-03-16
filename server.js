'use strict';

const express = require('express');
const request = require('superagent');
const PORT = process.env.PORT || 3000;

const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const app = express();
const client = redis.createClient(REDIS_PORT);

function respond (org, numberOfRepos) {
    return `org ${org} has ${numberOfRepos} public reps`;
}

function getNumberOfRepos (req, res, next) {
    const org = req.query.org;
    request.get(`https://api.github.com/orgs/${org}/repos`, function (err, response) {
        if (err) throw err;

        let repoNumber = response.body.length;

        client.setex(org, 10, repoNumber);
        res.send(respond(org, repoNumber));
    });
}

function cache (req, res, next) {
    const org = req.query.org;
    client.get(org, function (err, data) {
        if (err) throw err;

        if (data != null) {
            res.send(respond(org, data));
        } else {
            next();
        }
    })
}

app.get('/repos', cache, getNumberOfRepos);

app.listen(PORT, function () {
    console.log('Server started on port', PORT);
});
