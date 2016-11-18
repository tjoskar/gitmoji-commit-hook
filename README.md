# Gitmoji-commit-hook

[![Build Status](https://travis-ci.org/welcoMattic/gitmoji-commit-hook.svg?branch=master)](https://travis-ci.org/welcoMattic/gitmoji-commit-hook)

> Add emojis to your commits

Start your commit message with a right emoji from [Gitmoji](https://github.com/carloscuesta/gitmoji)

// Todo: add a GIF

## Install

```
$ npm install -g gitmoji-commit-hook
```

## Usage

In your git repo, add the following script in your `prepare-commit-msg` file

```
#!/bin/bash

exec < /dev/tty
gitmoji-commit-hook $1
```

Make it executable with `$ chmod +x ./.git/hooks/prepare-commit-msg`.

## License

The code is available under the [MIT](https://github.com/welcoMattic/gitmoji-commit-hook/blob/master/LICENSE) license.
