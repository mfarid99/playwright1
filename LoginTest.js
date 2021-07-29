const playwright = require("playwright");

(async () => {
  const browser = await playwright["chromium"].launch({
    headless: false,
    slowMo: 40
  });

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto("http://executeautomation.com/demosite/Login.html");

  await page.screenshot({path: `ea-${Date.now}.png`});

  await browser.close();
}) ();
