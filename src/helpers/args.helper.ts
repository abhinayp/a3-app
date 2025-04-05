import readline from 'readline';
import yargs from 'yargs';
import { Chalk } from 'chalk';

const chalk = new Chalk();

const argv = yargs(process.argv.slice(2))
  .option('name', { type: 'string', demandOption: false })
  .option('eventBased', { type: 'boolean', demandOption: false })
  .option('websockets', { type: 'boolean', demandOption: false })
  .parseSync() as { name?: string; eventBased?: boolean; websockets?: boolean };

const createInterface = () => {
  return readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });
};


const askQuestion = (rl: readline.Interface, question: string): Promise<string> => {
  return new Promise((resolve) => {
      rl.question(question, (answer: string) => {
          resolve(answer);
      });
  });
};

const getProjectName = async (): Promise<string> => {
  let projectName = argv.name as string | undefined;

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
  let _isEventBased = !!argv.eventBased;

  if (argv.eventBased === undefined) {
      const rl = createInterface();
      const answer = await askQuestion(rl, chalk.blue('Is this project event-based? (y/n) [default: n]: '));
      rl.close();
      _isEventBased = answer === 'y';
  }

  return _isEventBased;
};

const isWebsocketsRequired = async () => {
  let _isWebsocketsRequired = !!argv.websockets;

  if (argv.websockets === undefined) {
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

export {
  getProjectName,
  isEventBased,
  isWebsocketsRequired,
  getAppType
};
