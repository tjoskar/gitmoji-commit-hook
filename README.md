# Gitmoji-commit-hook

[![Build Status](https://travis-ci.org/welcoMattic/gitmoji-commit-hook.svg?branch=master)](https://travis-ci.org/welcoMattic/gitmoji-commit-hook)

> Prepend the right emoji to your commit message from [Gitmoji](https://github.com/carloscuesta/gitmoji)

![Demo](https://github.com/welcoMattic/gitmoji-commit-hook/blob/master/demo.gif?raw=true)

## KISS principle

This package follow KISS principle, the only thing it does is to allow you 
to add an emoji from gitmojis list to your commit.

If you're looking for some other cool feature like search in gitmojis list,
please consider [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli)

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
