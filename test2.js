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

let something = require('../login_info_Fedex.json')
// console.log(something.username)
let username = something.username
console.log(username)
let password = something.password
console.log(password)



  //await page.goto("https://app.triblio-qa.com/");
 await page.goto("https://app.triblio-qa.com/app#/audience");


//   var data = '../../login_info_Fedex.js';          
//   await page.type('[name=email]', 'andrew.peace@triblio.com');
await page.type('[name=email]', username);

//   await page.type('[name=password]', 'password');
await page.type('[name=password]', password);

  await page.keyboard.press('Enter')
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });  
//   await page.waitForSelector('button[ng-click="newAudience(itemsLength)"]');

//   const buttonCount = await page.$$eval('button', x=>x.length)
//   console.log(`${buttonCount} count is `)
//   const ngCount = await page.$$eval('ng', y=>y.match(/ng/g))
//   console.log(`${ngCount} count is `)



 await page.screenshot({path: `ea-${Date.now}.png`});

//   await browser.close();
}) ();
