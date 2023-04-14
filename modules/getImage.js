import cliProgress from 'cli-progress';
import commandLineInterface from 'prompt-sync';
const prompt = commandLineInterface();

import scrollToBottom from './scrollToBottom.js';


/**
 * Fetch All Image
 * @param {string[]} hrefLinks Array of href links to fetch images from
 * @param {string} page Instance from puppeteer
 * @param {int} pageNumber Instance from puppeteer
 */
export default async function getImage(hrefLinks, page, pageNumber) {
  // Ask user for the output image name
  const outputImageName = prompt('Nama Output File image (nama.webp) : ');

  for (const hrefLink of hrefLinks) {
    console.log(`\nCrawling: ${hrefLink}`);

    try {
      // Navigate to the URL
      await page.goto(hrefLink);

      // Scroll To Bottom
      await scrollToBottom(page);

      // Select all image Content
      await page.waitForSelector('.mh_comicpic');

      // Screenshot each Image
      const imageElements = await page.$$('.mh_comicpic');
      const progressBar = new cliProgress.SingleBar(
          {},
          cliProgress.Presets.shades_classic,
      );
      progressBar.start(imageElements.length, 0);

      const screenshotPromises = [];
      for (const [index, imageElement] of imageElements.entries()) {
        const screenshotPromise = imageElement.screenshot({
          path: `img/${outputImageName}-${pageNumber}-${index + 1}.webp`,
        });
        screenshotPromises.push(screenshotPromise);
        progressBar.increment();
      }

      await Promise.all(screenshotPromises);
      pageNumber += 1;
      progressBar.stop();
    } catch (error) {
      console.error(
          `Error occurred while fetching images from ${hrefLink}: ${error}`,
      );
    }
  }

  console.log('Done..');
}
