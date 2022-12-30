import {writeFile, readFile, chmod} from 'node:fs/promises';
import process from 'node:process';
import inquirer from 'inquirer';
import fetch from 'node-fetch';
import chalk from 'chalk';
import {pathExists} from 'path-exists';
import fileExists from 'file-exists';

const gitmojiUrl
  = 'https://raw.githubusercontent.com/carloscuesta/gitmoji/master/packages/gitmojis/src/gitmojis.json';
const prepareCommitMessageFileName = 'prepare-commit-msg';

const gitmojiCommitHookComand = `#!/bin/sh
exec < /dev/tty
gitmoji-commit-hook $1
`;

const errorMessage = {
	notGit: 'The directory is not a git repository.',
	commitHookExist: `A prepare-commit hook already exists, please remove the hook (rm .git/hooks/${prepareCommitMessageFileName}) or install gitmoji-commit-hook manually by adding the following content info .git/hooks/\n\n${prepareCommitMessageFileName}:${gitmojiCommitHookComand}`,
	gitmojiParse: `Could not find gitmojis at ${gitmojiUrl}.`,
};

function errorHandler(error) {
	console.error(chalk.red(`🚨  ERROR: ${error}`));
	process.exit(1);
}

function rejectIf(errorMessage_) {
	return value => (value ? Promise.reject(new Error(errorMessage_)) : value);
}

function rejectIfNot(errorMessage_) {
	return value => (value ? value : Promise.reject(new Error(errorMessage_)));
}

async function getGitmojiList() {
	try {
		const {gitmojis} = await fetch(gitmojiUrl).then(r => r.json());
		if (!gitmojis) {
			throw new Error(errorMessage.gitmojiParse);
		}

		return gitmojis;
	} catch (error) {
		throw new Error(errorMessage.gitmojiParse + ` ${error.message}`);
	}
}

function assertGitRepository() {
	return pathExists('.git').then(rejectIfNot(errorMessage.notGit));
}

function assertNoPrepareCommitHook(gitHookPath) {
	return () =>
		fileExists(`${gitHookPath}/${prepareCommitMessageFileName}`).then(
			rejectIf(errorMessage.commitHookExist),
		);
}

function initProject(gitHookPath) {
	return assertGitRepository()
		.then(assertNoPrepareCommitHook(gitHookPath))
		.then(() =>
			writeFile(
				`${gitHookPath}/${prepareCommitMessageFileName}`,
				gitmojiCommitHookComand,
			),
		)
		.then(() => chmod(`${gitHookPath}/${prepareCommitMessageFileName}`, '755'));
}

function prependMessage(getMessage, putMessage) {
	return filepath => message =>
		getMessage(filepath)
			.then(fileContent => `${message} ${fileContent}`)
			.then(fileContent => putMessage(filepath, fileContent));
}

const prependMessageToFile = prependMessage(readFile, writeFile);

async function readJson(path) {
	return JSON.parse(await readFile(path));
}

function getGitmojiExclude() {
	return fileExists(`${process.env.PWD}/package.json`)
		.then(exist => (exist ? readJson(`${process.env.PWD}/package.json`) : {}))
		.then(packageJson => packageJson.gitmoji || {})
		.then(gitmoji => gitmoji.blacklist || []);
}

function seperateChoices(choices) {
	return exclude => {
		if (exclude.length === 0) {
			return choices;
		}

		return [
			...choices.filter(choice => !exclude.includes(choice.type)),
			new inquirer.Separator(),
			...choices.filter(choice => exclude.includes(choice.type)),
			new inquirer.Separator(),
		];
	};
}

function seperateExcludeEmojis(choices) {
	return getGitmojiExclude().then(seperateChoices(choices));
}

function printInitSuccess() {
	console.log(
		`${chalk.green(
			'🎉  SUCCESS 🎉',
		)}  gitmoji-commit-hook initialized with success.`,
	);
}

function mapGitmojiItemToOption(gitmoji) {
	return {
		name: gitmoji.emoji + '  ' + gitmoji.description,
		value: gitmoji.emoji,
		type: gitmoji.name,
	};
}

function createInquirerQuestion(emojis) {
	return [
		{
			type: 'checkbox',
			name: 'emoji',
			message: 'Select emoji(s) for your commit',
			choices: emojis,
		},
	];
}

const isCommitEditMessageFile = stringToTest =>
	/COMMIT_EDITMSG/g.test(stringToTest);

function gitmojiCommitHook(gitHookPath, commitFile) {
	if (commitFile === '--init') {
		initProject(gitHookPath).then(printInitSuccess).catch(errorHandler);
	} else if (isCommitEditMessageFile(commitFile)) {
		getGitmojiList()
			.then(emojis => emojis.map(emoji => mapGitmojiItemToOption(emoji)))
			.then(seperateExcludeEmojis)
			.then(createInquirerQuestion)
			.then(inquirer.prompt)
			.then(answers => answers.emoji)
			.then(answers => answers.join(' '))
			.then(prependMessageToFile(commitFile))
			.catch(errorHandler);
	}
}

export {
	rejectIf,
	rejectIfNot,
	gitmojiCommitHook,
	prependMessage,
	mapGitmojiItemToOption,
	createInquirerQuestion,
	seperateChoices,
};
