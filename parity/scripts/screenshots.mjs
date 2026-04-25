import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUT = '/opt/cursor/artifacts/screenshots';
fs.mkdirSync(OUT, { recursive: true });

const ROUTES = ['/home', '/menu', '/dishdetail/0', '/about', '/contactus'];
const STACKS = [
  { name: 'angular', baseURL: 'http://localhost:4200' },
  { name: 'react', baseURL: 'http://localhost:5173' },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
for (const stack of STACKS) {
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    try {
      await page.goto(`${stack.baseURL}${route}`, { waitUntil: 'networkidle', timeout: 30_000 });
      await page.waitForTimeout(1500);
    } catch (e) {
      console.error(`navigation failed for ${stack.name}${route}`, e.message);
    }
    const safe = route.replace(/^\//, '').replace(/\//g, '_') || 'home';
    const file = path.join(OUT, `${stack.name}-${safe}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log('saved', file);
    await page.close();
  }
}
await browser.close();
