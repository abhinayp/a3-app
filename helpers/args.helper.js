const readline = require('readline');
const yargs = require('yargs');
const { Chalk } = require('chalk');

const chalk = new Chalk();

const createInterface = () => {
  return readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });
};


const askQuestion = (rl, question) => {
  return new Promise((resolve) => {
      rl.question(question, (answer) => {
          resolve(answer);
      });
  });
};

const getProjectName = async () => {
  let projectName = yargs.argv.name;

  if (!projectName) {
      const rl = createInterface();
      projectName = await askQuestion(rl, chalk.blue('Enter project name: '));
      rl.close();
  }

  if (!projectName) {
    console.log(chalk.red('Project name is required'));
    projectName = await getProjectName();
  }

  return projectName;
};


const isEventBased = async () => {
  let _isEventBased = !!yargs.argv.eventBased;

  if (yargs.argv.eventBased === undefined) {
      const rl = createInterface();
      const answer = await askQuestion(rl, chalk.blue('Is this project event-based? (y/n) [default: n]: '));
      rl.close();
      _isEventBased = answer === 'y';
  }

  return _isEventBased;
};

const isWebsocketsRequired = async () => {
  let _isWebsocketsRequired = !!yargs.argv.websockets;

  if (yargs.argv.websockets === undefined) {
    const rl = createInterface();
    const answer = await askQuestion(rl, chalk.blue('Is websockets required? (y/n) [default: n]: '));
    rl.close();
    _isWebsocketsRequired = answer === 'y';
  }

  return _isWebsocketsRequired;
};


const getAppType = async () => {
  const rl = createInterface();
  const appType = await askQuestion(rl, chalk.blue('Enter Application Type (backend, frontend): '));
  rl.close();
  return appType;
};

module.exports = {
  getProjectName,
  isEventBased,
  isWebsocketsRequired,
  getAppType
};
