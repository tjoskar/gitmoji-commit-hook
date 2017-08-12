# Gitmoji-commit-hook

[![Build Status](https://travis-ci.org/tjoskar/gitmoji-commit-hook.svg?branch=master)](https://travis-ci.org/tjoskar/gitmoji-commit-hook)

> Prepend the right emoji to your commit message from [Gitmoji](https://github.com/carloscuesta/gitmoji)

## Install

- Install gitmoji-commit-hook package

```
$ npm install -g gitmoji-commit-hook
```

- Install the hook

```
$ cd any-git-initialized-directory
$ gitmoji-commit-hook --init
```

## Usage

![Demo](https://github.com/tjoskar/gitmoji-commit-hook/blob/master/demo.gif?raw=true)

## Emoji List

* 🎨 : Improving structure / format of the code.
* ⚡️ : Improving performance.
* 🔥 : Removing code or files.
* 🐛 : Fixing a bug.
* 🚑 : Critical hotfix.
* ✨ : Introducing new features.
* 📝 : Writing docs.
* 🚀 : Deploying stuff.
* 💄 : Updating the UI and style files.
* 🎉 : Initial commit.
* ✅ : Adding tests.
* 🔒 : Fixing security issues.
* 🍎 : Fixing something on macOS.
* 🐧 : Fixing something on Linux.
* 🏁 : Fixing something on Windows.
* 🔖 : Releasing / Version tags.
* 🚨 : Removing linter warnings.
* 🚧 : Work in progress.
* 💚 : Fixing CI Build.
* ⬇️ : Downgrading dependencies.
* ⬆️ : Upgrading dependencies.
* 👷 : Adding CI build system.
* 📈 : Adding analytics or tracking code.
* 🔨 : Refactoring code.
* ➖ : Removing a dependency.
* 🐳 : Work about Docker.
* ➕ : Adding a dependency.
* 🔧 : Changing configuration files.
* 🌐 : Internationalization and localization.
* ✏️ : Fixing typos.
* 💩 : Writing bad code that needs to be improved.
* ⏪ : Reverting changes.
* 🔀 : Merging branches.
* 📦 : Updating compiled files or packages.
* 👽 : Updating code due to external API changes.
* 🚚 : Moving or renaming files.
* 📄 : Adding or updating license.
* 💥 : Introducing breaking changes.
* 🍱 : Adding or updating assets.
* 👌 : Updating code due to code review changes.
* ♿️ : Improving accessibility.
* 💡 : Documenting source code.
* 🍻 : Writing code drunkenly.
* 💬 : Updating text and literals.
* 🗃 : Performing database related changes

## KISS principle

This package follow KISS principle, the only thing it does is to allow you
to add an emoji from gitmojis list to your commit.

If you're looking for some other cool feature like search in gitmojis list,
please consider [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli)

## License

The code is available under the [MIT](https://github.com/tjoskar/gitmoji-commit-hook/blob/master/LICENSE) license.
