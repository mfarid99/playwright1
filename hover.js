const playwright = require("playwright");

(async () => {
  const browser = await playwright["chromium"].launch({
    headless: false,
    slowMo: 10
  });

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.setViewportSize({
      width: 1440,
      height: 9000
  })

  await page.goto("http://executeautomation.com/demosite/Login.html");

  const username = ['one', 'two', 'three']
  const password = ['password1', 'password2', 'password3']
  var randomUserName = username[Math.floor(Math.random()*username.length)];
  var randomPassword = password[Math.floor(Math.random()*password.length)];

  await page.type('[name=UserName]', randomUserName)
  await page.type('[name=Password]', randomPassword);

 


  

//   await page.type('[name=UserName]', 'executeautomation');
//   await page.type('[name=Password]', 'admin');
  await page.keyboard.press('Enter', {delay: 2000});

  await page.waitForSelector("input[id=Initial]");

  await page.hover("[id='Automation Tools']");

  await page.screenshot({path: `ea-${Date.now}.png`});

//   await browser.close();
}) ();
