const playwright = require("playwright");

(async () => {
  const browser = await playwright["chromium"].launch({
    headless: false,
    // slowMo: 40
  });

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.setViewportSize({
    width: 1440,
    height: 9000
})

  //await page.goto("https://app.triblio-qa.com/");
  await page.goto("https://example.com");



//   await page.type('[name=email]', 'andrew.peace@triblio.com');
//   await page.type('[name=password]', 'password');
//   await page.keyboard.press('Enter')
//   await page.waitForNavigation({
//     waitUntil: 'networkidle0',
//   });  

  const text = await page.$$eval('p', element=>element.length)
  console.log(text)

  await page.screenshot({path: `ea-${Date.now}.png`});

  await browser.close();
}) ();
