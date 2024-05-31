import { test, expect } from '@playwright/test';
import { fillField, getCurrentBranch } from '../utils.js';

const wizardCount = ".repeat-wrapper fieldset[class='panel-wrapper field-wrapper wizard']";
const wizardPanelCount = 'ul.wizard-menu-items li.wizard-menu-item';
const dropDownSelector = 'div.drop-down-wrapper select';
const fileName = 'empty.pdf';
const textInput = 'adobe';
const emailInput = 'test@adobe.com';
const numberInput = '123';
const dropDown = 'Orange';
const FilePath = './test/e2e/upload/empty.pdf';
const dataInput = '2022-12-23';
test.describe('resetButton validation test', () => {
  let page;
  const components = ['Text Input', 'Check Box Group', 'Number Input', 'Radio Button', 'Telephone Input', 'Email Input', 'File Attachment', 'Dropdown', 'Date Input'];
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(`https://${getCurrentBranch()}--aem-boilerplate-forms--adobe-rnd.hlx.live/drafts/tests/x-walk/wizardvalidation`, { waitUntil: 'networkidle' });
  });

  test('resetButton validation on wizard panels', async () => {
    for (let i = 0; i < 4; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await page.getByText('Button').click();
    }
    await page.getByRole('button', { name: 'Reset' }).click();
    const Count = await page.locator(wizardCount).count();
    expect(Count).toEqual(1);
  });

  test('resetButton validation on repeatable wizard', async () => {
    const count = await page.locator(wizardPanelCount).count();

    for (let i = 0; i < count - 1; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await page.getByRole('button', { name: 'Next' }).click({ force: true });
    }
    await page.getByRole('button', { name: 'Reset' }).click();
    await Promise.all(
      [
        expect(page.getByText('Next')).toBeVisible(),
        !expect(page.getByText('Back')).not.toBeVisible(),
      ],
    );
  });

  test('Check for reset functionality', async () => {
    // eslint-disable-next-line no-restricted-syntax,no-unused-vars
    for (const name of components) {
      // eslint-disable-next-line no-await-in-loop,max-len
      await fillField(page, name, textInput, emailInput, numberInput, dropDown, FilePath, dataInput);
    }
    await page.getByRole('button', { name: 'Reset' }).click();
    // eslint-disable-next-line no-restricted-syntax
    for (const name of components) {
      // eslint-disable-next-line no-await-in-loop,no-use-before-define
      await checkIfReset(name);
    }
  });
  const checkIfReset = async (coreComponent) => {
    switch (coreComponent) {
      case 'Text Input':
      case 'Email Input':
      case 'Telephone Input':
      case 'Date Input':
      case 'Number Input':
        expect(await page.getByLabel(coreComponent).inputValue()).toBe('');
        break;
      case 'Check Box Group':
        expect(await page.getByRole('checkbox', { name: 'Item 1' }).isChecked()).toBe(false);
        break;
      case 'Radio Button':
        expect(await page.getByRole('radio', { name: 'Item 2' }).isChecked()).toBe(false);
        break;
      case 'Dropdown':
        // eslint-disable-next-line no-case-declarations
        await expect(page.locator(dropDownSelector)).toHaveValue('');
        break;
      case 'File Attachment':
        expect(await page.getByLabel(fileName).isVisible()).toBe(false);
        break;
      default:
        break;
    }
  };
});
