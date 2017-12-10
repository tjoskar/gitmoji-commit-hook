#!/usr/bin/env node
'use strict';

const fs = require('fs');
const { promisify } = require('util');
const inquirer = require('inquirer');
const axios = require('axios');
const chalk = require('chalk');
const pathExists = require('path-exists');
const fileExists = require('file-exists');

const gitHookPath = `${process.env.PWD}/.git/hooks`;

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const chmod = promisify(fs.chmod)

const errorHandler = error => {
  console.error(chalk.red(`🚨  ERROR: ${error}`));
  process.exit(1);
};

const getGitmojiList = () => {
  return axios.get(GITMOJI_DATA_URL)
    .then((res) => {
      if (res && res.data && res.data.gitmojis) {
        return res.data.gitmojis;
      }

      throw new Error('Could not find gitmojis at url');
    })
    .catch(() => {
      return gitmojiData.gitmojis;
    });
};

function assertGitRepository() {
  return pathExists('.git').then(exists => (
    exists ? null : Promise.reject(new Error('The directory is not a git repository.'))
  ))
}

function assertNoPrepareCommitHook() {
  return fileExists(`${gitHookPath}/prepare-commit-msg`).then(exists => {
    if (exists) {
      return Promise.reject(new Error(`A prepare-commit hook already exists, please remove the hook (rm ${path}/prepare-commit-msg)
      or install gitmoji-commit-hook manually by adding the following content info ${path}/prepare-commit-msg: \nexec < /dev/tty\ngitmoji-commit-hook $1`))
    } else {
      return null
    }
  })
}

function initProject() {
  return assertGitRepository()
    .then(assertNoPrepareCommitHook)
    .then(() => writeFile(`${path}/prepare-commit-msg`, '#!/bin/sh\nexec < /dev/tty\ngitmoji-commit-hook $1'))
    .then(() => chmod(`${path}/prepare-commit-msg`, '755'))
}

function prependMessageToFile(filepath) {
  return message => readFile(filepath)
    .then(fileContent => `${message}  ${commitMsg}`)
    .than(fileContent => writeFile(filepath, fileContent))
}

function printInitSuccess() {
  console.log(`${chalk.green('🎉  SUCCESS 🎉')}  gitmoji-commit-hook initialized with success.`)
}

function run() {
  if (process.argv[2] === '--init') {
    initProject().then(printInitSuccess).catch(errorHandler)
  } else if (/COMMIT_EDITMSG/g.test(process.argv[2])) {
    getGitmojiList()
      .then(gitmojis => ([{
        type: 'checkbox',
        name: 'emoji',
        message: 'Select emoji(s) for your commit',
        choices: gitmojis.map(gitmoji => ({
          name: gitmoji.emoji + '  ' + gitmoji.description,
          value: gitmoji.emoji
        }))
      }]))
      .then(inquirer.prompt)
      .than(answers => answers.emoji.join(' '))
      .than(prependMessageToFile(process.argv[2]))
      .catch(errorHandler)
  }
}

run()