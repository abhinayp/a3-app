const readline = require('readline');
const yargs = require('yargs');

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
      projectName = await askQuestion(rl, 'Enter project name: ');
      rl.close();
  }

  return projectName;
};


const isEventBased = async () => {
  let _isEventBased = !!yargs.argv.eventBased;

  if (yargs.argv.eventBased === undefined) {
      const rl = createInterface();
      const answer = await askQuestion(rl, 'Is this project event-based? (y/n): ');
      rl.close();
      _isEventBased = answer === 'y';
  }

  return _isEventBased;
};

const isWebsocketsRequired = async () => {
  let _isWebsocketsRequired = !!yargs.argv.websockets;

  if (yargs.argv.websockets === undefined) {
    const rl = createInterface();
    const answer = await askQuestion(rl, 'Is websockets required? (y/n): ');
    rl.close();
    _isWebsocketsRequired = answer === 'y';
  }

  return _isWebsocketsRequired;
};


const getAppType = async () => {
  const rl = createInterface();
  const appType = await askQuestion(rl, 'Enter Application Type (backend, frontend): ');
  rl.close();
  return appType;
};

module.exports = {
  getProjectName,
  isEventBased,
  isWebsocketsRequired,
  getAppType
};
