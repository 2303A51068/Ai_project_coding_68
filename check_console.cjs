const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('CONSOLE', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGEERROR', err.toString()));
  page.on('requestfailed', req => console.log('REQFAILED', req.url(), req.failure()?.errorText));
  await page.goto('https://shoeshub-five.vercel.app/', { waitUntil: 'networkidle' });
  console.log('URL', page.url());
  const html = await page.content();
  console.log('CONTENT_START');
  console.log(html.slice(0, 1000));
  console.log('CONTENT_END');
  await browser.close();
})();