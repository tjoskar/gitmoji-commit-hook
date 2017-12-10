const { spy } = require('simple-spy');
const {
  rejectIf,
  rejectIfNot,
  prependMessage,
  mapGitmojiItemToOption,
  createInquirerQuestion,
  seperateChoices
} = require('./bin/lib');

describe('rejectIf', () => {
  test('reject', () => {
    const result = rejectIf('my error message')(true);

    return result.catch(error => {
      expect(error).toBeDefined();
    });
  });

  test('do not reject', () => {
    const result = rejectIf('my error message')(false);

    expect(result).toBe(false);
  });
});

describe('rejectIfNot', () => {
  test('do not reject', () => {
    const result = rejectIfNot('my error message')(true);

    expect(result).toBe(true);
  });

  test('reject', () => {
    const result = rejectIfNot('my error message')(false);

    return result.catch(error => {
      expect(error).toBeDefined();
    });
  });
});

test('Prepend a message', () => {
  const getMessage = spy(() => Promise.resolve('World'));
  const putMessage = spy(() => Promise.resolve());
  const fileName = 'myfile.txt';
  const message = 'Hello';

  return prependMessage(getMessage, putMessage)(fileName)(message)
    .then(() => {
      expect(getMessage.args[0][0]).toBe(fileName);
      expect(putMessage.args[0][0]).toBe(fileName);
      expect(putMessage.args[0][1]).toBe('Hello  World');
    });
});

test('Map gitmoji item to an option', () => {
  const gitmoji = {
    emoji: 'a',
    description: 'Something awesome'
  };

  const result = mapGitmojiItemToOption(gitmoji);

  expect(result.value).toEqual('a');
  expect(result.name).toEqual('a  Something awesome');
});

test('Create Inquirer question', () => {
  const choices = [{
    name: 'Something',
    value: 's'
  }];
  const result = createInquirerQuestion(choices);

  expect(result[0].choices).toBe(choices);
});

test('Seperate choices', () => {
  const choices = [{
    type: ':cat:'
  }, {
    type: ':dog:'
  }];
  const blacklist = [':dog:'];

  const result = seperateChoices(choices)(blacklist);

  expect(result[0]).toEqual({ 'type': ':cat:' });
  expect(result[1].type).toEqual('separator');
  expect(result[2]).toEqual({ 'type': ':dog:' });
});

test('Return same list if no blacklist', () => {
  const choices = [{
    type: ':cat:'
  }, {
    type: ':dog:'
  }];
  const blacklist = [];

  const result = seperateChoices(choices)(blacklist);

  expect(result).toBe(choices);
});
