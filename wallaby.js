module.exports = function (wallaby) {
  return {
    files: [
      'bin/*.js'
    ],

    tests: [
      'test.js'
    ],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest'
  };
};