const url = () => {
  return 'http://localhost:8080';
};
  
/**
   * Specify how memlab should perform action that you want
   * to test whether the action is causing memory leak.
   *
   * @param page - Puppeteer's page object:
   * https://pptr.dev/api/puppeteer.page/
   */
const action = async() => {
  
};
  
/**
   * Specify how memlab should perform action that would
   * reset the action you performed above.
   *
   * @param page - Puppeteer's page object:
   * https://pptr.dev/api/puppeteer.page/
   */
back = async (page) => {
  await page.locator.close.click();
};
  
module.exports = {action, back, url};