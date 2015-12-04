# Emoji-commit-hook

> Add emoji to your commits

Start your commit message with an nice emoji

## Install

```
$ npm install -g emoji-commit-hook
```


## Usage

Add the following script in your `prepare-commit-msg` for your favorite git repo:

```
#!/bin/bash

exec < /dev/tty
emoji-commit $1
```

TODO: Create a `emoji-commit --init` script. It should be fairly easy.

Magic:

![Demo](/demo.gif)

## License

WTFPL
