import path from 'path';
import fs from 'fs-extra';

const cwd = process.cwd();
const match = cwd.match(/\/node_modules\//);

console.log(`Current working directory: ${cwd}`);

const projectRoot = cwd.substring(0, match.index);
console.log(`Project root: ${projectRoot}`);

const from = 'node_modules/@aemforms/form-block/src';
const to = 'blocks/form';

async function copyFormBlock() {
  console.log(`Copying ${from} to ${to}`);
  const fromPath = path.resolve(projectRoot, from);
  const toPath = path.resolve(projectRoot, to);
  fs.ensureDirSync(toPath);
  fs.copySync(fromPath, toPath, { recursive: true });
}

async function postinstall() {
  await copyFormBlock();
}

postinstall();
