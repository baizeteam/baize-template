import { exec } from 'child_process';

const isDev = process.env.NODE_TYPE === 'development';

const mainBuildCommand = `vite build --config vite.main.config.ts${
  isDev ? ' --watch' : ''
}`;
const contentScriptBuildCommand = `vite build --config vite.contentScript.config.ts${
  isDev ? ' --watch' : ''
}`;

function runCommand(command) {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
    childProcess.stdout?.pipe(process.stdout);
    childProcess.stderr?.pipe(process.stderr);
  });
}

Promise.all([
  runCommand(mainBuildCommand),
  runCommand(contentScriptBuildCommand),
])
  .then((results) => {
    console.log('------ done! ------');
  })
  .catch((err) => {
    console.log('----- failed! ------');
  });
