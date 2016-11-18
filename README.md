# Gitmoji-commit-hook

> Add emoji to your commits

Start your commit message with a right emoji from [Gitmoji](https://github.com/carloscuesta/gitmoji)

// GIF

## Install

```
$ npm install -g gitmoji-commit-hook
```

## Usage

In your git repo, add the following script in your `prepare-commit-msg` file

```
#!/bin/bash

exec < /dev/tty
gitmoji-commit $1
```

Make it executable with `$ chmod +x ./.git/hooks/prepare-commit-msg`.

## License

WTFPL
