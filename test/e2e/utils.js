import { execSync } from 'node:child_process';

function executeGitCommand(command) {
  return execSync(command)
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '');
}

// eslint-disable-next-line max-len
export async function fillField(page, coreComponent, textInput, emailInput, numberInput, dropDown, FilePath, dataInput) {
  switch (coreComponent) {
    case 'Text Input':
      await page.getByLabel(coreComponent).fill(textInput);
      break;
    case 'Email Input':
      await page.getByLabel(coreComponent).fill(emailInput);
      break;
    case 'Telephone Input':
    case 'Number Input':
      await page.getByLabel(coreComponent).fill(numberInput);
      break;
    case 'Check Box Group':
      await page.getByRole('checkbox', { name: 'Item 1' }).click();
      break;
    case 'Radio Button':
      await page.getByRole('radio', { name: 'Item 2' }).click();
      break;
    case 'Dropdown':
      await page.getByLabel(coreComponent).selectOption(dropDown);
      break;
    case 'File Attachment':
      await page.getByLabel(coreComponent).setInputFiles(FilePath);
      break;
    case 'Date Input':
      await page.getByLabel(coreComponent).focus();
      await page.getByLabel(coreComponent).fill(dataInput);
      break;
    default:
      break;
  }
}
const getCurrentBranch = () => executeGitCommand('git rev-parse --abbrev-ref HEAD');
const openPage = async (page, relativeURL) => {
  const url = `https://${getCurrentBranch()}--aem-boilerplate-forms--adobe-rnd.hlx.live${relativeURL}`;
  await page.goto(url, { waitUntil: 'networkidle' });
};

export { openPage, getCurrentBranch };
