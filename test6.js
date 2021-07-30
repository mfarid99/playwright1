const playwright = require('playwright');
    async function main() {
        const browser = await playwright.chromium.launch({
            headless: false // set this to true
        });
        
        const page = await browser.newPage();

        await page.goto("https://app.triblio-qa.com/app#/audience");



        await page.fill('[name=email]', 'andrew.peace@triblio.com');
        await page.fill('[name=password]', 'password');
        await page.keyboard.press('Enter')

        await page.waitForNavigation({
            waitUntil: 'networkidle0',
          });  
          await page.waitForSelector('button[ng-click="newAudience(itemsLength)"]');
          let something = await page.$$('.container')
          console.log(something)
        const market = await page.$eval('button', x => {
            const data = [];
            const listElms = x.getElementsByTagName('div');
            listElms.forEach(elm => {
                data.push(elm.innerText.split('\n'));
            });
            return data;
        });
        
        console.log('Market Composites--->>>>', market);
        await page.waitFor(5000); // wait
        await browser.close();
    }
    
    main();