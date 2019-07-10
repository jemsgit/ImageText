const puppeteer = require('puppeteer');
const path = require('path')

const defaultBrowserProps = ['--lang=en-US,en', '--no-sandbox', '--disable-setuid-sandbox'];
const imagesCount = 34;

async function app() {
    let title = process.argv[2] || '';
    let subTitle = process.argv[3] || '';
    let browser = await getBrowser();
    let page = await browser.newPage();
    await page.goto(`file://${path.join(process.cwd(), 'index.html')}`, {waitUntil: 'networkidle2'});
    page.setViewport({width: 1500, height: 900, deviceScaleFactor: 1});
    await setTitles(page, title, subTitle);
	let image = getRandomImage(imagesCount);
	await setBackgroungImage(page, image);
	let titleFontSize = getFontSizeFromLength({min:8, max: 25}, {min: 95, max: 200}, title.length);
	console.log(titleFontSize);
	await setTitleFontSize(page, titleFontSize);
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

function getRandomImage(max){
	let number = Math.round(Math.random() * (max - 1) + 1);
	return `./img/back${number}.jpg`;
}

async function setTitleFontSize(page, size) {
    await page.evaluate((a) => {
        document.querySelector('#title').style.fontSize = `${a}px`;
    }, size);
}

async function setBackgroungImage (page, image) {
    await page.evaluate((a) => {
        document.querySelector('#target').style.backgroundImage = `url('${a}')`;
    }, image);
}


async function screenshotDOMElement(page, selector, padding = 0) {
    const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      const {x, y, width, height} = element.getBoundingClientRect();
      return {left: x, top: y, width, height, id: element.id};
    }, selector);
  
    return await page.screenshot({
      path: 'image.jpg',
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
  
function getFontSizeFromLength(lengthParams, fontParams, stringLength){
	if(stringLength >= lengthParams.max) {
		return fontParams.min;
	}
	if(stringLength <= lengthParams.min) {
		return fontParams.max;
	}
	let scaleFactor = (fontParams.max - fontParams.min)/(lengthParams.max - lengthParams.min);
	return Math.round(fontParams.max - ((stringLength-lengthParams.min)*scaleFactor));
}

app();