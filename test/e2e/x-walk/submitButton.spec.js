import { test } from '@playwright/test';
import { setSubmitBaseUrl } from '../../../blocks/form/constant.js';
import { fillField, getCurrentBranch } from '../utils.js';

const partialUrl = '/L2NvbnRlbnQvZm9ybXMvYWYveHdhbGstdGVzdC1jb2xsYXRlcmFsL3N1Ym1pdHZhbGlkYXRpb24=';
const textInput = 'adobe';
const emailInput = 'test@adobe.com';
const numberInput = '123';
const dropDown = 'Orange';
const FilePath = './test/e2e/upload/empty.pdf';
const dataInput = '2022-12-23';
test.describe('Form with Submit Button', async () => {
  let page;
  const components = ['Text Input', 'Check Box Group', 'Number Input', 'Radio Button', 'Telephone Input', 'Email Input', 'File Attachment', 'Dropdown', 'Date Input'];
  // eslint-disable-next-line no-shadow,new-cap
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    setSubmitBaseUrl('https://publish-p133911-e1313554.adobeaemcloud.com/');
    // eslint-disable-next-line new-cap
    await page.goto(`https://${getCurrentBranch()}--aem-boilerplate-forms--adobe-rnd.hlx.live/drafts/tests/x-walk/submitvalidation`, { waitUntil: 'networkidle' });
  });

  test.only('Clicking the button should submit the form', async () => {
    // eslint-disable-next-line no-restricted-syntax,no-unused-vars
    for (const name of components) {
      // eslint-disable-next-line no-await-in-loop,max-len
      await fillField(page, name, textInput, emailInput, numberInput, dropDown, FilePath, dataInput);
    }
    // eslint-disable-next-line max-len
    const responsePromise = page.waitForResponse((response) => response.url().includes(partialUrl) && response.status() === 200);
    await page.getByRole('button', { name: 'Submit' }).click();
    // await expect(page.getByText('Thank you for submitting the form.')).toBeVisible();
    await responsePromise;
  });
});
