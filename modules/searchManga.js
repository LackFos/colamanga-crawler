import commandLineInterface from 'prompt-sync';
import getImage from './getImage.js';

const prompt = commandLineInterface();

/**
 * Query for Manga
 * @param {page} page Puppeteer Page instance
 */
export default async function searchManga(page) {
  // Ask for manga title
  const search = prompt('Masukkan Judul: ');

  console.log('Trying Fetch all manga...');
  try {
    // Go to page
    await page.goto(
        `https://www.colamanhua.com/search?type=1&searchString=${search}`,
        {waitUntil: 'networkidle0'},
    );
  } catch (error) {
    console.log('Failed Fetch all manga :', error);
  }

  // Select all titles
  const titleElements = await page.$$('h1 a');

  // Loop and print all titles
  for (let i = 0; i < titleElements.length; i++) {
    const title = await titleElements[i].evaluate((el) => el.textContent);

    // Check if the user is blocked
    if (title === 'https://www.cocomanga.com/dynamic/getaccessip') {
      console.log('Kamu diblock. gunakanlah VPN.');
      return;
    }

    console.log(`${i}. ${title}`);
  }

  // Ask user to select manga
  const selectedTitle = prompt('Masukkan Nomor: ');
  await titleElements[selectedTitle].click();
  await page.waitForNavigation({waitUntil: 'networkidle0'});

  console.clear();

  // Count total chapter available
  const chapterElements = await page.$$('.all_data_list ul li a');
  console.log(`Total Chapter: ${chapterElements.length - 1}`);

  // Reverse Chapter to ASC
  chapterElements.reverse();

  // Ask user to select single or multiple chapter
  const chapterRange = prompt('Masukkan Nomor Chapter (misalnya 0-4 atau 5): ');

  // Selected Chapters
  const hrefLinks = [];

  if (chapterRange.includes('-')) {
    // Multiple chapters
    const [start, end] = chapterRange.split('-').map((n) => parseInt(n));
    const selectedChapterElements = chapterElements.slice(start, end + 1);

    // Loop over selected chapters and output the href value for each one
    for (const chapterElement of selectedChapterElements) {
      const href = await chapterElement.evaluate((el) => el.href);
      hrefLinks.push(href);
    }
  } else {
    // Single chapter
    const chapterNumber = parseInt(chapterRange);
    const targetElement = chapterElements[chapterNumber];
    const targetUrl = await page.evaluate((el) => el.href, targetElement);
    hrefLinks.push(targetUrl);
  }

  const startPageNumber = parseInt(chapterRange.split('-')[0]) + 1;

  // Fetch images
  await getImage(hrefLinks, page, startPageNumber);
}
