#!/usr/bin/env node
'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const axios = require('axios');
const chalk = require('chalk');
const pathExists = require('path-exists');
const fileExists = require('file-exists');

const gitemojisDataFile = require('../gitmojis.json');

const GITEMOJIS_URL = 'https://raw.githubusercontent.com/carloscuesta/gitmoji/master/src/data/gitmojis.json';

const errorHandler = error => {
  console.error(chalk.red(`🚨  ERROR: ${error}`));
  process.exit(1);
};

let questions = []

const getGitmojiList = () => {
  return axios.get(GITEMOJIS_URL)
    .then((res) => {
      if (res && res.data && res.data.gitmojis) {
        return res.data.gitmojis;
      }

      throw new Error('Could not find gitmojis as url');
    })
    .catch(() => {
      return gitemojisDataFile.gitmojis;
    });
};

if (process.argv[2] === '--init') {
  const path = `${process.env.PWD}/.git/hooks`;

  if (!pathExists.sync('.git')) {
    errorHandler('The directory is not a git repository.')
  }

  if (fileExists.sync(`${path}/prepare-commit-msg`)) {
    errorHandler(`A prepare-commit hook already exists, please remove the hook (rm ${path}/prepare-commit-msg)
    or install gitmoji-commit-hook manually by adding the following content info ${path}/prepare-commit-msg: \nexec < /dev/tty\ngitmoji-commit-hook $1`);
  }

  fs.writeFile(`${path}/prepare-commit-msg`, '#!/bin/sh\nexec < /dev/tty\ngitmoji-commit-hook $1', writeError => {
    if (writeError) {
      errorHandler(writeError);
    } else {
      fs.chmod(`${path}/prepare-commit-msg`, '755', chmodError => {
        if (chmodError) {
          errorHandler(chmodError);
        } else {
          console.log(`${chalk.green('🎉  SUCCESS 🎉')}  gitmoji-commit-hook initialized with success.`);
        }
      });
    }
  });
} else {
  getGitmojiList()
    .then((gitmojis) => {
      questions.push({
        type: 'checkbox',
        name: 'emoji',
        message: 'Select emoji(s) for your commit',
        choices: gitmojis.map(gitmoji => {
          return {
            name: gitmoji.emoji + '  ' + gitmoji.description,
            value: gitmoji.emoji
          };
        })
      });

      if(/COMMIT_EDITMSG/g.test(process.argv[2])) {
        return inquirer.prompt(questions).then((answers) => {
          let commitMsg = fs.readFileSync(process.argv[2]);
          commitMsg = `${answers.emoji.join(' ')}  ${commitMsg}`;
          fs.writeFileSync(process.argv[2], commitMsg);

          process.exit(0);
        });
      }
    })
    .catch(err => {
      errorHandler(err);
    });
}
