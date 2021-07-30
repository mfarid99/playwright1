const playwright = require('playwright');
    async function main() {
        const browser = await playwright.chromium.launch({
            headless: false // set this to true
        });
        
        const page = await browser.newPage();
        await page.goto('https://finance.yahoo.com/world-indices');
        const market = await page.$eval('#YDC-Lead-Stack-Composite', headerElm => {
            const data = [];
            const listElms = headerElm.getElementsByTagName('li');
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