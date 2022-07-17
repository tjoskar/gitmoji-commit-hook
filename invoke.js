import process from 'node:process';
import {gitmojiCommitHook} from './bin/lib.js';

gitmojiCommitHook(`${process.env.PWD}/mock_hooks`, process.argv[2]);
