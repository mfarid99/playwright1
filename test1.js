const playwright = require("playwright");

(async () => {
  const browser = await playwright["chromium"].launch({
    headless: false,
    slowMo: 40
  });

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto("http://example.com");
  const text = await page.$$eval('p', element=>element[0].innerHTML)
  console.log(text)

  await page.screenshot({path: `ea-${Date.now}.png`});

  await browser.close();
}) ();
