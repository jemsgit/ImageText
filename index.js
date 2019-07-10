const puppeteer = require('puppeteer');
const path = require('path')

const defaultBrowserProps = ['--lang=en-US,en', '--no-sandbox', '--disable-setuid-sandbox'];

async function app() {
    let title = process.argv[2] || '';
    let subTitle = process.argv[3] || '';
    let browser = await getBrowser();
    let page = await browser.newPage();
    await page.goto(`file://${path.join(process.cwd(), 'index.html')}`, {waitUntil: 'networkidle2'});
    page.setViewport({width: 1500, height: 900, deviceScaleFactor: 1});
    await setTitles(page, title, subTitle);
    await screenshotDOMElement(page, '#target');
    page.close();
    console.log('Картинка готова');
    process.exit();
}

async function getBrowser() {
    return await puppeteer.launch({
        headless: true,
        args: defaultBrowserProps
    });
}

async function setTitles(page, title, subtitle) {
    await page.evaluate((a, b) => {
        document.querySelector('#title').innerText = a.toUpperCase();
        document.querySelector('#subtitle').innerText = b.toUpperCase();
      }, title, subtitle);
}

async function screenshotDOMElement(page, selector, padding = 0) {
    const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      const {x, y, width, height} = element.getBoundingClientRect();
      return {left: x, top: y, width, height, id: element.id};
    }, selector);
  
    return await page.screenshot({
      path: 'element.jpg',
      quality: 100,
      type:'jpeg',
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      }
    });
  }

app();