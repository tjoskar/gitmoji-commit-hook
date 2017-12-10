#!/usr/bin/env node
'use strict';

const { gitmojiCommitHook } = require('./lib');

gitmojiCommitHook(`${process.env.PWD}/.git/hooks`, process.argv[2]);
