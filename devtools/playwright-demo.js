/**
 * Playwright demo script
 * - Creates a test user (signup -> verify OTP -> login)
 * - Launches Chromium, sets localStorage token/user
 * - Navigates to /ai-demo and captures a screenshot
 *
 * Usage: node devtools/playwright-demo.js
 * Requires: `npm i playwright axios` in frontend folder
 */

const { chromium } = require('playwright');
const axios = require('axios');

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function createAndLogin() {
  const email = `playwright+${Date.now()}@example.com`;
  const password = 'Pass123!';

  // 1) signup
  const signupRes = await axios.post(BASE + '/api/auth/signup', {
    name: 'Playwright Demo',
    email,
    password
  }).catch(e => ({ data: e.response?.data }));

  const otp = signupRes.data?.otp || signupRes.data?.otpCode || null;

  if (!otp) {
    console.log('Signup response did not include OTP; attempting to login directly');
  } else {
    // 2) verify
    await axios.post(BASE + '/api/auth/verify-otp', { email, otp }).catch(() => {});
  }

  // 3) login
  const loginRes = await axios.post(BASE + '/api/auth/login', { email, password });
  const token = loginRes.data.token;
  const user = loginRes.data.user || { email };
  return { token, user };
}

async function run() {
  console.log('Creating user and obtaining token...');
  const { token, user } = await createAndLogin();
  console.log('Token:', token ? token.slice(0, 20) + '...' : 'none');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Set localStorage before navigation
  await page.goto('about:blank');
  await page.evaluate(({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }, { token, user });

  const demoUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/ai-demo';
  console.log('Opening demo at', demoUrl);
  await page.goto(demoUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'playwright-ai-demo.png', fullPage: true });
  console.log('Screenshot saved: playwright-ai-demo.png');

  // keep browser open for manual inspection
  console.log('Demo running. Close browser to finish script.');
}

run().catch(err => {
  console.error('Error in Playwright demo:', err);
  process.exit(1);
});
