const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadImage(url, directory) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    const fileName = path.basename(url);
    const filePath = path.join(directory, fileName);
    fs.writeFileSync(filePath, imageBuffer);
    console.log(`Image downloaded: ${filePath}`);
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
  }
}

function createTodayDirectory() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '-');
  const directoryPath = `${today}`;

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  return directoryPath;
}

async function downloadImages(imageUrls, directory) {
  for (const imageUrl of imageUrls) {
    await downloadImage(imageUrl, directory);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://vrg-tierlist.misakanet.page/', { timeout: 5000 });
    await sleep(5000);
    const html = await page.content();
    const $ = cheerio.load(html);
    const imageUrls = [];
    $('.user-icon-container').each((index, element) => {
      const imageUrl = $(element).css('background-image').replace(/url\(['"]?(.*?)['"]?\)/, '$1');
      if (imageUrl) {
        imageUrls.push(imageUrl);
      }
    });

    console.log('Image URLs:');
    imageUrls.forEach((imageUrl, index) => {
      console.log(`${index + 1}. ${imageUrl}`);
    });
    const downloadDirectory = createTodayDirectory();

    downloadImages(imageUrls, downloadDirectory);
    await browser.close();
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.error('Navigation timeout exceeded');
    } else {
      console.error('An error occurred:', error);
    }
  }
})();
