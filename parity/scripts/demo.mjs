import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUT = '/opt/cursor/artifacts/videos';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: OUT, size: { width: 1280, height: 720 } },
});
const page = await ctx.newPage();
page.setDefaultTimeout(15_000);

async function pause(ms) {
  await page.waitForTimeout(ms);
}

await page.goto('http://localhost:5173/home', { waitUntil: 'networkidle' });
await pause(1500);

await page.click('a[href="/menu"]');
await page.waitForURL('**/menu');
await pause(2000);

await page.click('a[href="/dishdetail/0"]');
await page.waitForURL('**/dishdetail/0');
// Wait for the dish card to appear before interacting with the form below it.
await page.waitForSelector('[data-testid="dish-card"]', { timeout: 15_000 });
await pause(1000);

// Submit a comment.
await page.locator('input[aria-label="author"]').fill('Demo User');
await page.locator('textarea[aria-label="comment"]').fill('A demo review during the cloud agent walkthrough.');
await page.getByRole('button', { name: /Submit Review/i }).click();
await pause(1500);

await page.click('a[href="/about"]');
await page.waitForURL('**/about');
await pause(2000);

await page.click('a[href="/contactus"]');
await page.waitForURL('**/contactus');
await pause(1500);

// Fill the feedback form
await page.locator('input[aria-label="firstname"]').fill('Ada');
await page.locator('input[aria-label="lastname"]').fill('Lovelace');
await page.locator('input[aria-label="telnum"]').fill('12345');
await page.locator('input[aria-label="email"]').fill('ada@example.com');
await page.getByRole('button', { name: /Send Feedback/i }).click();
await pause(2500);

await page.close();
await ctx.close();
await browser.close();

// Find the video file produced by playwright
const files = fs.readdirSync(OUT).filter((f) => f.endsWith('.webm'));
const newest = files
  .map((f) => ({ f, mtime: fs.statSync(path.join(OUT, f)).mtimeMs }))
  .sort((a, b) => b.mtime - a.mtime)[0];
if (newest) {
  const dest = path.join(OUT, 'react-demo.webm');
  fs.renameSync(path.join(OUT, newest.f), dest);
  console.log('Saved', dest);
}
