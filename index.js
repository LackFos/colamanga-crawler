import {createRequire} from 'module';
const require = createRequire(import.meta.url);

const puppeteer = require('puppeteer-extra');
const hidden = require('puppeteer-extra-plugin-stealth');

// require executablePath from puppeteer
const {executablePath} = require('puppeteer');

run();

/**
 * Anonymous Function
 */
async function run() {
  // Launch sequence
  puppeteer.use(hidden());
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    // headless: true,
    headless: false,
    ignoreHTTPSErrors: true,

    // add this
    executablePath: executablePath(),
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 900,
    height: 1280,
  });

  // Go to page
  await page.goto('https://www.colamanhua.com/manga-th78040/1/2.html', {
    waitUntil: 'networkidle0',
  });

  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  // Get Screenshot of each Image
  const elements = await page.$$('.mh_comicpic');
  elements.forEach(async (e, index) => {
    await e.screenshot({path: `img/yuan_zun-1x${index}.webp`});
  });
}

