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
  await page.goto(url);
  await page.screenshot({ path: path.resolve(__dirname, '../screenshots/gq1-login-page.png') });
  await page.getByRole('textbox', { name: 'User Name' }).click();
  await page.getByRole('textbox', { name: 'User Name' }).fill('testdsprofile');
  await page.getByRole('textbox', { name: 'User Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Trimble@123');
  await page.getByRole('button', { name: 'SIGN IN >' }).click();
  await expect(page).toHaveURL(/eu_index\.html/);
  await page.screenshot({ path: path.resolve(__dirname, '../screenshots/gq1-login-success.png') });
  await page.getByText('Logout').click();
  await expect(page).toHaveURL(/login\.html/);
  await page.screenshot({ path: path.resolve(__dirname, '../screenshots/gq1-logout-success.png') });
});

test('Staging Login and Logout', async ({ page }) => {
  const url = sanitizeUrl('https://eu-staging.road.com/application/signon/secured/login.html');
  await page.goto(url);
  await page.screenshot({ path: path.resolve(__dirname, '../screenshots/staging-login-page.png') });
  await page.getByRole('textbox', { name: 'User Name' }).click();
  await page.getByRole('textbox', { name: 'User Name' }).fill('testvijay');
  await page.getByRole('textbox', { name: 'User Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Trimble@123');
  await page.getByRole('button', { name: 'SIGN IN >' }).click();
  await expect(page).toHaveURL(/eu_index\.html/);
  await page.screenshot({ path: path.resolve(__dirname, '../screenshots/staging-login-success.png') });
  await page.getByText('Logout').click();
  await expect(page).toHaveURL(/login\.html/);
  await page.screenshot({ path: path.resolve(__dirname, '../screenshots/staging-logout-success.png') });
});

test('PROD Login and Logout', async ({ page }) => {
  const url = sanitizeUrl('https://eugm.road.com/application/signon/secured/login.html');
  await page.goto(url);
  await page.screenshot({ path: path.resolve(__dirname, '../screenshots/prod-login-page.png') });
  await page.getByRole('textbox', { name: 'User Name' }).click();
  await page.getByRole('textbox', { name: 'User Name' }).fill('testvijay');
  await page.getByRole('textbox', { name: 'User Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Trimble@123');
  await page.getByRole('button', { name: 'SIGN IN >' }).click();
  await expect(page).toHaveURL(/eu_index\.html/);
  await page.screenshot({ path: path.resolve(__dirname, '../screenshots/prod-login-success.png') });
  await page.getByText('Logout').click();
  await expect(page).toHaveURL(/login\.html/);
  await page.screenshot({ path: path.resolve(__dirname, '../screenshots/prod-logout-success.png') });
});
