#!/usr/bin/env node

import process from 'node:process';
import {gitmojiCommitHook} from './lib.js';

gitmojiCommitHook(`${process.env.PWD}/.git/hooks`, process.argv[2]);
