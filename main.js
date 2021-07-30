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


/**
 *  
 * @param {Object} browser playwright browser object (assuming we need it?)
 * @param {Object} context playwright context object (assumcing we need it)
 * @param {Object} page playwricht page object
 * * @returns null if false or true if there is an error
 */
async function checkForErrors(browser, context, page){
  //TODO: Implement
}

/**
 * returns if the strings are different
 * obviously this implementation is overly simplified.
 * We might need to make it more complex
 * 
 * @param {String} previousPage previous url
 * @param {String} currentPage current url
 */
function didPageChange(previousPage, currentPage){
  return previousPage !== currentPage;
}


/**
 * prints the log and exits the program
 * @param {Array} actionLog list of actions take by automation
 */
function printActionLogAndExit(actionLog){
  //TODO: Implement
}


/**
 * 
 * this represents an intial idea of how this might work
 * we can change this as we develop more
 * 
 * 
 * @param {Object} browser playwright browser object
 * @param {Object} context playwright context object
 * @param {Object} page playwright page object
 * @param {Array} actionLog history of actions
 */
async function runLoop(browser, context, page, actionLog){

  let elements = await findAllRelaventElements(page);

  let randomAction = chooseARandomAction(elements);

  actionLog.push(randomAction);

  await runAction(page, randomAction);

  let errors = await checkForErrors(browser, context, page);

  if(!errors){
    //Recursive call!
    await runLoop(browser, context, page, actionLog)
  }
  else{
    printActionLogAndExit(actionLog);
  }
}



async function main(){
  const browser = await playwright["chromium"].launch({
    headless: false,
    slowMo: 40
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await login(page);

  //TODO: Build the main loop
  await runLoop(browser, context, page, []);
}


//Run the program
await main();