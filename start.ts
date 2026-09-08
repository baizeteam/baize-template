import inquirer from 'inquirer';
import { exec } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

function readFileSafely(filePath) {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch {
    // 如果发生异常，返回 null
    return null;
  }
}

const cliTemplatePath = '.cli-template.json';
const lastEnvInfo = readFileSafely(cliTemplatePath);

const envOptions = [
  {
    type: 'list',
    name: 'choice',
    message: '请选择server环境:',
    choices: [
      {
        name: 'test',
        value: {
          START_ENV: 'dev',
          CONFIG_ENV: 'test',
        },
      },
      {
        name: 'test1',
        value: {
          START_ENV: 'dev',
          CONFIG_ENV: 'test1',
        },
      },
      {
        name: 'test2',
        value: {
          START_ENV: 'dev',
          CONFIG_ENV: 'test2',
        },
      },
    ],
  },
];
if (lastEnvInfo) {
  const lastEnvInfoObj = JSON.parse(lastEnvInfo);
  envOptions[0].choices.unshift({
    name: `上次选择: ${lastEnvInfoObj.CONFIG_ENV}`,
    value: lastEnvInfoObj,
  });
}

const envInfoObj = await inquirer.prompt(envOptions as any);
const envInfo = envInfoObj.choice;

const clientCommand = `cd client && npm run dev`;
const serverCommand = `cd server && cross-env JSON_ENV=${envInfo.JSON_ENV} START_ENV=${envInfo.START_ENV} CONFIG_ENV=${envInfo.CONFIG_ENV} npm run server`;

function runCommand(command) {
  writeFileSync(cliTemplatePath, JSON.stringify(envInfo), 'utf-8');
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

Promise.all([runCommand(clientCommand), runCommand(serverCommand)])
  .then((results) => {
    console.log('done!-------', results);
  })
  .catch((err) => {
    console.log('failed!------', err);
  });
