module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "plugins": ["node"],
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2019
    },
    "rules": {
    }
};