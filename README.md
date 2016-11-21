# Gitmoji-commit-hook

> Add emoji to your commits

Start your commit message with a right emoji from [Gitmoji](https://github.com/carloscuesta/gitmoji)

// GIF

## Install

```
$ npm install -g gitmoji-commit-hook
```

## Usage

Add the following script in your `prepare-commit-msg` for your favorite git repo:

```
#!/bin/bash

exec < /dev/tty
gitmoji-commit $1
```

## License

WTFPL
