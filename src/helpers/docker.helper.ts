import { execSync } from 'child_process';

const isDockerInstalled = () => {
  try {
    execSync('docker -v', { stdio: 'inherit' });
    return true;
  } catch (error) {
    return false;
  }
}

const isDockerComposeInstalled = () => {
  try {
    execSync('docker-compose -v', { stdio: 'inherit' });
    return true;
  } catch (error) {
    return false;
  }
}

const isDockerRunning = () => {
  try {
    execSync('docker ps', { stdio: 'inherit' });
    return true;
  } catch (error) {
    return false;
  }
}

export {
  isDockerInstalled,
  isDockerComposeInstalled,
  isDockerRunning
}
