'use strict';

const fs = require('fs');
const { promisify } = require('es6-promisify');
const inquirer = require('inquirer');
const axios = require('axios');
const chalk = require('chalk');
const pathExists = require('path-exists');
const fileExists = require('file-exists');
const { map, path, test, join } = require('ramda');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const chmod = promisify(fs.chmod);

const gitmojiUrl = 'https://raw.githubusercontent.com/carloscuesta/gitmoji/master/src/data/gitmojis.json';
const prepareCommitMsgFileName = 'prepare-commit-msg';

const gitmojiCommitHookComand = `#!/bin/sh
exec < /dev/tty
gitmoji-commit-hook $1
`;

const errorMessage = {
  notGit: 'The directory is not a git repository.',
  commitHookExist: `A prepare-commit hook already exists, please remove the hook (rm .git/hooks/${prepareCommitMsgFileName}) or install gitmoji-commit-hook manually by adding the following content info .git/hooks/\n\n${prepareCommitMsgFileName}:${gitmojiCommitHookComand}`,
  gitmojiParse: 'Could not find gitmojis at url'
};

function errorHandler(error) {
  console.error(chalk.red(`🚨  ERROR: ${error}`));
  process.exit(1);
}

function rejectIf(errorMsg) {
  return val => val ? Promise.reject(new Error(errorMsg)) : val;
}

function rejectIfNot(errorMsg) {
  return val => val ? val : Promise.reject(new Error(errorMsg));
}

function getGitmojiList() {
  return axios.get(gitmojiUrl)
    .then(path(['data', 'gitmojis']))
    .then(rejectIfNot(errorMessage.gitmojiParse));
}

function assertGitRepository() {
  return pathExists('.git')
    .then(rejectIfNot(errorMessage.notGit));
}

function assertNoPrepareCommitHook(gitHookPath) {
  return () => fileExists(`${gitHookPath}/${prepareCommitMsgFileName}`)
    .then(rejectIf(errorMessage.commitHookExist));
}

function initProject(gitHookPath) {
  return assertGitRepository()
    .then(assertNoPrepareCommitHook(gitHookPath))
    .then(() => writeFile(`${gitHookPath}/${prepareCommitMsgFileName}`, gitmojiCommitHookComand))
    .then(() => chmod(`${gitHookPath}/${prepareCommitMsgFileName}`, '755'));
}

function prependMessage(getMessage, putMessage) {
  return filepath => message => getMessage(filepath)
    .then(fileContent => `${message}  ${fileContent}`)
    .then(fileContent => putMessage(filepath, fileContent));
}

const prependMessageToFile = prependMessage(readFile, writeFile);

function getGitmojiBlacklist() {
  return fileExists(`${process.env.PWD}/package.json`)
    .then(exist => exist ? require(`${process.env.PWD}/package.json`) : {})
    .then(packageJson => packageJson.gitmoji || {})
    .then(gitmoji => gitmoji.blacklist || []);
}

function seperateChoices(choices) {
  return blacklist => {
    if (blacklist.length === 0) {
      return choices;
    }
    return [
      ...choices.filter(choice => !blacklist.includes(choice.type)),
      new inquirer.Separator(),
      ...choices.filter(choice => blacklist.includes(choice.type)),
      new inquirer.Separator()
    ];
  };
}

function seperateBlacklistEmojis(choices) {
  return getGitmojiBlacklist()
    .then(seperateChoices(choices));
}

function printInitSuccess() {
  console.log(`${chalk.green('🎉  SUCCESS 🎉')}  gitmoji-commit-hook initialized with success.`);
}

function mapGitmojiItemToOption(gitmoji) {
  return {
    name: gitmoji.emoji + '  ' + gitmoji.description,
    value: gitmoji.emoji,
    type: gitmoji.name
  };
}

function createInquirerQuestion(emojis) {
  return [{
    type: 'checkbox',
    name: 'emoji',
    message: 'Select emoji(s) for your commit',
    choices: emojis
  }];
}

const isCommitEditMsgFile = test(/COMMIT_EDITMSG/g);

function gitmojiCommitHook(gitHookPath, commitFile) {
  if (commitFile === '--init') {
    initProject(gitHookPath)
      .then(printInitSuccess)
      .catch(errorHandler);
  } else if (isCommitEditMsgFile(commitFile)) {
    getGitmojiList()
      .then(map(mapGitmojiItemToOption))
      .then(seperateBlacklistEmojis)
      .then(createInquirerQuestion)
      .then(inquirer.prompt)
      .then(answers => answers.emoji)
      .then(join(' '))
      .then(prependMessageToFile(commitFile))
      .catch(errorHandler);
  }
}

module.exports = {
  rejectIf,
  rejectIfNot,
  gitmojiCommitHook,
  prependMessage,
  mapGitmojiItemToOption,
  createInquirerQuestion,
  seperateChoices
};
