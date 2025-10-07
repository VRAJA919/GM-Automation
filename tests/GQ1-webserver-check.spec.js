const { test, expect } = require('@playwright/test');
const path = require('path');

const sanitizeUrl = url => {
  // Only allow URLs starting with https:// and ending with .html
  if (!/^https:\/\/.+\.html$/.test(url)) {
    throw new Error('Invalid URL format');
  }
  return url;
};

test('Login and Logout on GQ1', async ({ page }) => {
  const url = sanitizeUrl('https://gq1.road.com/application/signon/secured/login.html');
  try {
    await page.goto(url);
    await page.getByRole('textbox', { name: 'User Name' }).click();
    await page.getByRole('textbox', { name: 'User Name' }).fill('testdsprofile');
    await page.getByRole('textbox', { name: 'User Name' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('Trimble@123');
    await page.getByRole('button', { name: 'SIGN IN >' }).click();
    await expect(page).toHaveURL(/eu_index\.html/);
    await page.getByText('Logout').click();
    await expect(page).toHaveURL(/login\.html/);
  } catch (error) {
    await page.screenshot({ path: path.resolve(__dirname, '../screenshots/gq1-login-failure.png') });
    throw error;
  }
});

test('Staging Login and Logout', async ({ page }) => {
  const url = sanitizeUrl('https://eu-staging.road.com/application/signon/secured/login.html');
  try {
    await page.goto(url);
    await page.getByRole('textbox', { name: 'User Name' }).click();
    await page.getByRole('textbox', { name: 'User Name' }).fill('testvijay');
    await page.getByRole('textbox', { name: 'User Name' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('Trimble@123');
    await page.getByRole('button', { name: 'SIGN IN >' }).click();
    await expect(page).toHaveURL(/eu_index\.html/);
    await page.getByText('Logout').click();
    await expect(page).toHaveURL(/login\.html/);
  } catch (error) {
    await page.screenshot({ path: path.resolve(__dirname, '../screenshots/staging-login-failure.png') });
    throw error;
  }
});

test('PROD Login and Logout', async ({ page }) => {
  const url = sanitizeUrl('https://eugm.road.com/application/signon/secured/login.html');
  try {
    await page.goto(url);
    await page.getByRole('textbox', { name: 'User Name' }).click();
    await page.getByRole('textbox', { name: 'User Name' }).fill('testvijay');
    await page.getByRole('textbox', { name: 'User Name' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('Trimble@123');
    await page.getByRole('button', { name: 'SIGN IN >' }).click();
    await expect(page).toHaveURL(/eu_index\.html/);
    await page.getByText('Logout').click();
    await expect(page).toHaveURL(/login\.html/);
  } catch (error) {
    await page.screenshot({ path: path.resolve(__dirname, '../screenshots/prod-login-failure.png') });
    throw error;
  }
});
