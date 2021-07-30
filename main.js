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
    let buttons = (await page.$$('button'));
    let aTags = (await page.$$('a'));
    let inputs = (await page.$$('input'));
    // debugger;
    return {buttons: await _filter(buttons), atags: await _filter(aTags), inputs: await _filter(inputs)};
}

async function _filter(elements) {
  let newList = [];

  for(let ii = 0; ii< elements.length; ii++){
    let element = elements[ii];
    try{
      let isVisible = await element.isVisible();
      //console.log(isVisible);
      let isEnabled = await element.isEnabled();
      //console.log(isEnabled);
      if(isVisible && isEnabled) newList.push(element);
    } catch(e){

      console.log("error wasn't on page");
    }
    
  }
  return  newList;
}

async function closePages(context){
  let pages = context.pages();
  let numPages = pages.length;
  while(numPages > 1){
    let p = pages.pop();
    await p.close()
    pages = context.pages();
    numPages = pages.length;
  }
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

  // console.log('chosen action', ret);

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
      `<BR SIZE="&{alert('P0WNED!)}"> 
      <DIV STYLE="background-image: url(javascript:alert('P0WNED!))">
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

  return ret;

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
let counter = 0;
async function runAction(page, actionTuple){
  let startingURL = page.url();
  counter++;
  if(actionTuple.action === NAVIGATE){
    let flip = _rng(0,1);

    console.log("clicking on ");
    try{
      await actionTuple.element.click();
    }catch(e){
      console.log("element was not clickable");
    }
    
  }
  else if(actionTuple.action === ATTACK){
    console.log("attacking! ");
    actionTuple.element.fill(actionTuple.attackString);
  }

  if(startingURL !== page.url()){
    console.log('waiting for navigation')
    await page.waitForLoadState("networkidle", {});
    console.log('finished waiiting for navigation');
    counter = 0;
  }
  if(counter > 10){
    console.log('went back to home page');
    await page.goto("https://app.triblio-qa.com/app#/home");
    await page.waitForLoadState("networkidle", {}); 
  }
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

async function checkForModels(page) {
  console.log('at models');
  let models = await page.$$('div.modal');
  console.log(models);
  try{
    if(models.length > 0){
      console.log('got to where there is a modal');
      // page.$("button:contains(Cancel)");
      await page.click("text=Cancel");
    }
  }
  catch{
    await page.click("text=Close")
  }
  
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

  console.log('got all elements on page');
  let randomAction = chooseARandomAction(elements);

  // console.log('random action selected ', randomAction);

  actionLog.push(page.url());

  actionLog.push(randomAction);

  await runAction(page, randomAction);

  await checkForModels(page);

  await closePages(context);

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