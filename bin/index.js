#!/usr/bin/env node
'use strict';

const { gitmojiCommitHook } = require('./lib');

gitmojiCommitHook(process.argv[2])
