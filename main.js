const playwright = require("playwright");
//Discussion: Hey guys Im assuming all these functions should take a "page"

//Action types
const NAVIGATE = 'navigate', ATTACK = 'jsInject';



//object from playwright

async function login(page){
  //TODO: MF:  Will get a QA login here...

  let login = require('../login_info_Fedex.json')
  let username = login.username
  console.log(username)
  let password = login.password
  console.log(password)

 await page.goto("https://app.triblio-qa.com/app#/home");
 await page.type('[name=email]', username);
 await page.type('[name=password]', password);
 await page.keyboard.press('Enter')
 await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });  
await browser.close();

}


/**
 * @returns {
    "atags": [<String>"Selector"],
    "inputs": [<String>"Selector"],
    "buttons": [<String>"Selector"]
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
  //Will choose between naviage and injection attack
  let choices = [NAVIGATE, ATTACK];

  let coinFlip = Math.random() < 0.5 ? 0 : 1;

  let ret = {action: choices[coinFlip]};

  //pick the elment we want to click
  if(ret.action === NAVIGATE && 
    (currentPageElements.atags.length > 0 || currentPageElements.buttons.length > 0)){
    let clickableElements = currentPageElements.atags.concat(currentPageElements.buttons);
    let totalElements = clickableElements.length;
    let elementIdx = Math.floor(Math.random() * totalElements);
    let randomElement = clickableElements[elementIdx];
    ret.element = randomElement;
  }
  //pick the action we want to take
  else if(currentPageElements.inputs.length > 0){
    let injectionStrings = [
      '<script>alert("P0WNED!");</script>', 
      '<H1> Vulnerability test </H1> <META HTTP-EQUIV="refresh" CONTENT="1;url=http://www.test.com">',
      `<BR SIZE="&{alert('Injected')}"> 
      <DIV STYLE="background-image: url(javascript:alert('Injected'))">
      `
    ];

    ret.element = currentPageElements.inputs[ Math.floor(Math.random() * currentPageElements.inputs.length)]

    ret.attackString = injectionStrings[Math.floor(Math.random() * injectionStrings.length)];
  }
  else{
    //whoops! not sure we should do this?
    //maybe go back instead?
    return chooseARandomAction(currentPageElements);
  }

}

/**
 * 
 * @param {Object} page playwright page context
 * @param {Object} action  action element tuple {action: "", element: <>}
 */
async function runAction(page, action){
  if(action === NAVIGATE){
    await page.click(action.element);
  }
  else if(action === INPUT){
    page.fill(action.element, action.attackString);
  }
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
 main();