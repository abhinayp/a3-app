#!/usr/bin/env node
const yargs = require('yargs');
const readline = require('readline');
const { execSync } = require('child_process');
const path = require('path');
const appTemplates = require('./app-templates.json');
const fs = require('fs');
const { isDockerRunning } = require('./helpers/docker.helper');

const getProjectName = async () => {
    let projectName = yargs.argv.name;

    if (!projectName) {
        const rl = createInterface();
        projectName = await askQuestion(rl, 'Enter project name: ');
        rl.close();
    }

    return projectName;
};

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

const execCommand = (command, options = {}) => {
  try {
      execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
      console.error(`Error executing command: ${command}`);
      process.exit(1);
  }
};

const cloneBackend = async (projectName) => {
    const templateRepoUrl = appTemplates["backend"]
    execCommand(`git clone --depth=1 ${templateRepoUrl} ${projectName}`);
    const appPath = path.join(process.cwd(), projectName);


    const setup = async () => {
      await customizeApp(appPath, projectName);

      if (!isDockerRunning()) {
        console.error('Docker is not installed. Setup will not be completed.');
        return
      }

      fs.rmSync(path.join(appPath, '.git'), { recursive: true, force: true });
      execCommand('make install', { cwd: appPath });
    }

    return {
      setup,
      appPath
    }
};

const setupProject = async (projectName, appType) => {
    const { setup } = await cloneBackend(projectName, appType);
    await setup();
}

const getAppType = async () => {
  const rl = createInterface();
  const appType = await askQuestion(rl, 'Enter Application Type (backend, frontend): ');
  rl.close();
  return appType;
};


const updateFile = (filePath, searchValue, replaceValue) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(new RegExp(searchValue, 'g'), replaceValue);
  fs.writeFileSync(filePath, updatedContent, 'utf8');
};

const customizeApp = async (appPath, projectName) => {
  const projectNameKey = 'PROJECTNAME'
  updateFile(path.join(appPath, 'package.json'), projectNameKey, projectName);
  updateFile(path.join(appPath, 'docker-compose.yml'), projectNameKey, projectName);
  updateFile(path.join(appPath, 'Dockerfile'), projectNameKey, projectName);
};

const main = async () => {
  const projectName = await getProjectName()
  // const appType = await getAppType()
  await setupProject(projectName, "backend")
};

main().catch(console.error);
