const playwright = require("playwright");
//Discussion: Hey guys Im assuming all these functions should take a "page"

//Action types
const NAVIGATE = 'navigate', ATTACK = 'jsInject';

var pageDidCrash = false, dialogDidShow = false;


//object from playwright

async function login(page){
  let login = require('../login_info_Fedex.json')
  let username = login.username
  //console.log(username)
  let password = login.password
  //console.log(password)

 await page.goto("https://app.triblio-qa.com/app#/home");
 await page.type('[name=email]', username);
 await page.type('[name=password]', password);
 await page.keyboard.press('Enter')
 console.log('just before wait in login')
  await page.waitForNavigation();
  console.log('just after wait in login')
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
    let buttons = await page.$$('button');
    let aTags = await page.$$('a');
    let inputs = await page.$$('input');

    return {buttons: buttons, atags: aTags, inputs: inputs};
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

  let coinFlip = _rng(0,1);

  let ret = {action: choices[coinFlip]};

  //pick the elment we want to click
  if(ret.action === NAVIGATE && 
    (currentPageElements.atags.length > 0 || currentPageElements.buttons.length > 0)){
    let clickableElements = currentPageElements.atags.concat(currentPageElements.buttons);
    let totalElements = clickableElements.length;
    let elementIdx = _rng(0, totalElements-1);
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

//swiped from https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function _rng(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 
 * @param {Object} page playwright page context
 * @param {Object} action  action element tuple {action: "", element: <>}
 */
async function runAction(page, action){
  if(action === NAVIGATE){
    let flip = _rng(0,1);

    if(flip){
      console.log("clicking on ", element);
      await action.element.click();
    }
    else{
      console.log("double clicking on ", element);
      await action.element.dblClick();
    }

    
  }
  else if(action === ATTACK){
    console.log("attacking! ", element);
    action.element.fill(action.attackString);
  }

  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });
}


/**
 *  
 * @param {Object} browser playwright browser object (assuming we need it?)
 * @param {Object} context playwright context object (assumcing we need it)
 * @param {Object} page playwricht page object
 * * @returns null if false or true if there is an error
 */
function checkForErrors(browser, context, page){
  if(pageDidCrash || dialogDidShow){
    return true;
  }
  else return false;


}


/**
 * prints the log and exits the program
 * @param {Object} browser puppeteer browser object
 * @param {Array} actionLog list of actions take by automation
 */
async function printActionLogAndExit(browser, actionLog){
  console.log("Found an Error!");
  console.dir(actionLog);
  await browser.close();
  process.exit(0);
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
console.log('In run loop');
  let elements = await findAllRelaventElements(page);
  console.log('elements \n', elements);

  let randomAction = chooseARandomAction(elements);

  actionLog.push(page.url());

  actionLog.push(randomAction);

  await runAction(page, randomAction);

  let errors = checkForErrors(browser, context, page);

  if(!errors){
    //Recursive call!
    await runLoop(browser, context, page, actionLog)
  }
  else{
    await printActionLogAndExit(browser, actionLog);
  }
}



async function main(){
  const browser = await playwright["chromium"].launch({
    headless: false,
    slowMo: 0
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('crash', function(){
    pageDidCrash = true;
    console.log("page Crashed!");
  });

  page.on('dialog', function(){
    dialogDidShow = true;
    //TODO: check that the message in the dialog matches what we set in injection attack
    console.log("dialog did show!");
  });


  await login(page);

  await runLoop(browser, context, page, []);
}


//Run the program
 main();