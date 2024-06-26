import { test, expect } from '../fixtures.js';
import { openPage } from '../utils.js';

const firstName = 'fname';
const lastName = 'lname';
test.describe('Form with Submit Button', () => {
  const testURL = '/drafts/tests/x-walk/customefuncitons';

  test('Clicking the button should submit the form', async ({ page }) => {
    await openPage(page, testURL);
    const firstNameLocator = await page.getByLabel('First Name');
    await firstNameLocator.fill(firstName);
    const lastNameLocator = await page.getByLabel('Last Name');
    await lastNameLocator.fill(lastName);
    await lastNameLocator.press('Tab');
    const fullNameLocator = await page.getByLabel('Full Name').inputValue();
    expect(fullNameLocator).toBe(`${firstName} ${lastName}`);
  });
});
