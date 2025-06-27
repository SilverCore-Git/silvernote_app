const puppeteer = require('puppeteer');
const path = require('path');

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 800
  });
  
  await page.goto('http://localhost:5173');
  await page.screenshot({ path: path.join(__dirname, 'screen/home.png'), fullPage: true });

  await browser.close();

})();
