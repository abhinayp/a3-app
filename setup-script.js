#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const appTemplates = require('./app-templates.json');
const fs = require('fs');
const { isDockerRunning } = require('./helpers/docker.helper');
const { getProjectName, isEventBased, isWebsocketsRequired } = require('./helpers/args.helper');

const execCommand = (command, options = {}) => {
  try {
      execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
      console.error(`Error executing command: ${command}`);
      process.exit(1);
  }
};

const cloneBackend = async ({projectName, isEventBased, isWebsocketsRequired}) => {
    const templateRepoUrl = appTemplates["backend"]
    let branch = "basic"

    if (isEventBased && isWebsocketsRequired) {
      branch = "event-websocket-support"
    } else if (isEventBased) {
      branch = "event-support"
    } else if (isWebsocketsRequired) {
      branch = "websockets-support"
    }

    execCommand(`git clone --depth=1 --branch ${branch} ${templateRepoUrl} ${projectName}`);
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

const setupProject = async ({projectName, appType, isEventBased, isWebsocketsRequired}) => {
    const { setup } = await cloneBackend({projectName, isEventBased, isWebsocketsRequired});
    await setup();
}


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
  const _isEventBased = await isEventBased()
  const _isWebsocketsRequired = await isWebsocketsRequired()
  await setupProject({
    projectName,
    appType: "backend",
    isEventBased: _isEventBased,
    isWebsocketsRequired: _isWebsocketsRequired
  })
};

main().catch(console.error);
