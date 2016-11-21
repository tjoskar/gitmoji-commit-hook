#!/usr/bin/env node
'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const gitmojis = require('../node_modules/gitmoji/src/data/gitmojis.json').gitmojis;

const questions = [
    {
        type: 'checkbox',
        name: 'emoji',
        message: 'Select emoji(s) for your commit',
        choices: gitmojis.map(gitmoji => {
            return {
                name: gitmoji.emoji + '  ' + gitmoji.description,
                value: gitmoji.code
            };
        })
    }
];

const writeCommitMessage = (answers) => {
    let commitMsg = fs.readFileSync(process.argv[2]);
    commitMsg = `${answers.emoji} ${commitMsg}`;

    fs.writeFileSync(process.argv[2], commitMsg);

    process.exit(0);
};

if(/COMMIT_EDITMSG/g.test(process.argv[2])) {
    inquirer.prompt(questions).then(writeCommitMessage);
}
