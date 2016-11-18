#!/usr/bin/env node
'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const axios = require('axios');
const gitmojis = 'https://raw.githubusercontent.com/carloscuesta/gitmoji/master/src/data/gitmojis.json';

let questions = []

axios.get(gitmojis)
  .then(res => {
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

    const writeCommitMessage = (answers) => {
      let commitMsg = fs.readFileSync(process.argv[2]);
      commitMsg = `${answers.emoji}  ${commitMsg}`;
      fs.writeFileSync(process.argv[2], commitMsg);

      process.exit(0);
    };

    if(/COMMIT_EDITMSG/g.test(process.argv[2])) {
      inquirer.prompt(questions).then(writeCommitMessage);
    }
  })
  .catch(err => {
    console.log(err);
  });
