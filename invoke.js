
const { gitmojiCommitHook } = require('./bin/lib')

gitmojiCommitHook(`${process.env.PWD}/mock_hooks`, process.argv[2])
