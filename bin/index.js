#!/usr/bin/env node
'use strict';

const fs = require('fs');
const inquirer = require('inquirer');

const questions = [
    {
        type: 'list',
        name: 'type',
        message: 'Select the type of change that you\'re committing:',
        choices: [{
            name: '🐛     Fixing a bug',
            value: ':bug:'
        }, {
            name: '✅     Adding tests',
            value: ':white_check_mark:'
        }, {
            name: '🎨     Improving the format/structure of the code',
            value: ':art:'
        }, {
            name: '📝     Writing docs',
            value: ':memo:'
        }, {
            name: '🏇     Improving performance',
            value: ':racehorse:'
        }, {
            name: '🚱     Plugging memory leaks',
            value: ':non-potable_water:'
        }, {
            name: '🔥     When removing code or files',
            value: ':fire:'
        }, {
            name: '💚     Fixing the CI build',
            value: ':green_heart:'
        }, {
            name: '🔒     Dealing with security',
            value: ':lock:'
        }, {
            name: '⬆️     Upgrading dependencies',
            value: ':arrow_up:'
        }, {
            name: '⬇️     Downgrading dependencies',
            value: ':arrow_down:'
        }, {
            name: '👕     Removing linter warnings',
            value: ':shirt:'
        }, {
            name: '🐧     Fixing something on Linux',
            value: ':penguin:'
        }, {
            name: '🍎     Fixing something on Mac OS',
            value: ':apple:'
        }, {
            name: '🏁     Fixing something on Windows',
            value: ':checkered_flag:'
        }, {
            name: '🐥     Add or update config files like .gitignore',
            value: ':hatched_chick:'
        }, {
            name: '⚡     Add a new feature',
            value: ':zap:'
        }, {
            name: `🌵     I don't like emojis`,
            value: ''
        }]
    }, {
        type: 'input',
        name: 'issue',
        message: 'Issue number'
    }
];

const writeCommitMessage = answers => {

    let commitMsg = fs.readFileSync(process.argv[2]);

    const emoji = answers.type;
    const issue = answers.issue ? `#${answers.issue} ` : '';
    commitMsg = `${emoji} ${issue}\n${commitMsg}`;

    fs.writeFileSync(process.argv[2], commitMsg);

    process.exit(0);
};

if(/COMMIT_EDITMSG/g.test(process.argv[2])) {
    inquirer.prompt(questions, writeCommitMessage);
}
