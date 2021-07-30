const playwright = require("playwright");
//Discussion: Hey guys Im assuming all these functions should take a "page"
//object from playwright

async function login(page){
  //TODO: MF:  Will get a QA login here...
}


/**
 * @returns {
    "atags": [],
    "inputs": [],
    "buttons": []
 * }
 */
async function findAllRelaventElements(page){
  //TODO:CP to implement...
}


/**
 *  
 * @param {object} currentPageElements the object that the "findAllRelaventElements" function
 * "returns"
 * @returns {action: "", element: <element>} tuple
 */
function chooseARandomAction(currentPageElements){
  //TODO: MB to implement
}

/**
 * 
 * @param {Object} page playwright page context
 * @param {Object} action  action element tuple {action: "", element: <>}
 */
async function runAction(page, action){
  //TODO: MB to implement
  
}




async function main(){
  const browser = await playwright["chromium"].launch({
    headless: false,
    slowMo: 40
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  //TODO: Build the main loop

}


//Run the program
await main();