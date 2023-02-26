const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const { executablePath } = require("puppeteer");

puppeteer.use(StealthPlugin());

const getBrowserInstance = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1600,900"],
    executablePath: executablePath(),
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 720,
  });
  page.setDefaultNavigationTimeout(60000);

  const closeBrowser = async () => await browser.close();

  return { page, closeBrowser };
};

module.exports = { getBrowserInstance };
