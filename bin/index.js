#!/usr/bin/env node
'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const axios = require('axios');
const chalk = require('chalk');
const pathExists = require('path-exists');

const gitmojis = 'https://raw.githubusercontent.com/carloscuesta/gitmoji/master/src/data/gitmojis.json';

let questions = []

if (process.argv[2] === '--init') {
  if (pathExists.sync('.git')) {
    const path = `${process.env.PWD}/.git/hooks`;

    fs.writeFile(`${path}/prepare-commit-message`, `#!/bin/sh\nexec < /dev/tty\ngitmoji-commit-hook $1`, {mode: 755}, (err) => {
      if (err) {
        console.error(chalk.red(`🚨  ERROR: ${err}`));
      } else {
        console.log(`${chalk.green('🎉  SUCCESS 🎉')}  gitmoji-commit-hook initialized with success.`);
      }
    });
  } else {
    console.error(chalk.red('🚨  ERROR: The directory is not a git repository.'));
  }
} else {
  axios.get(gitmojis).then(res => {
    questions.push({
      type: 'checkbox',
      name: 'emoji',
      message: 'Select emoji(s) for your commit',
      choices: res.data.gitmojis.map(gitmoji => {
        return {
          name: gitmoji.emoji + '  ' + gitmoji.description,
          value: gitmoji.emoji
        };
      })
    });

    if(/COMMIT_EDITMSG/g.test(process.argv[2])) {
      inquirer.prompt(questions).then((answers) => {
        let commitMsg = fs.readFileSync(process.argv[2]);
        commitMsg = `${answers.emoji}  ${commitMsg}`;
        fs.writeFileSync(process.argv[2], commitMsg);

        process.exit(0);
      });
    }
  }).catch(err => {
    console.log(err);
  });
}
