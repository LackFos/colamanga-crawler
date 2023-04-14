/**
 * Scroll To Bottom Of The Page
 * (For Overcome Lazy Loading Image)
 * @param {string} page instance from puppeteer
 */
export default async function scrollToBottom(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 1000;
      const delay = 800;
      // Increase this value to wait longer before taking screenshot
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, delay);
    });
  });
}
