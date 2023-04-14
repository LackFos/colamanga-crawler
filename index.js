// Puppeteer
import puppeteer from 'puppeteer-extra';
import hidden from 'puppeteer-extra-plugin-stealth';
import {executablePath} from 'puppeteer';

// Modules
import searchManga from './modules/searchManga.js';

/**
 * Anonymous Function run
 */
(async () => {
  // Launch sequence
  puppeteer.use(hidden());
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: false,
    ignoreHTTPSErrors: true,
    executablePath: executablePath(),
  });

  // Launch Browser
  const page = await browser.newPage();
  await page.setViewport({
    width: 900,
    height: 1200,
  });

  // Query Manga
  searchManga(page);
})();

