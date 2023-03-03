import { getBrowserInstance } from "../helpers/browserInstance.cjs";
import getAirbnbFilters from "./getAirbnbFilters.js";

let multiplier = 1;

const scrollPage = async (page, resultsLimit) => {
  const getHeight = async () => await page.evaluate(`document.body.scrollHeight`);
  const getResultsLength = async () => Array.from(await page.$$('#site-content [itemprop="itemListElement"]')).length;
  let lastHeight = await getHeight();
  let resultsLength = await getResultsLength();
  while (resultsLength < resultsLimit) {
    for (let i = 0; i < 6; i++) {
      await page.waitForTimeout(500 * multiplier);
      await page.keyboard.press("PageDown");
    }
    await page.waitForTimeout(5000 * multiplier);
    let newHeight = await getHeight();
    if (newHeight === lastHeight) {
      break;
    }
    lastHeight = newHeight;
    resultsLength = await getResultsLength();
  }
};

const getHotelsInfo = async (page) => {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#site-content [itemprop="itemListElement"]')).map((el) => {
      const priceString = el.querySelector('[data-testid="listing-card-subtitle"]+div+div span > span').textContent.trim().replace(" per night", "");
      return {
        thumbnail: el.querySelector("picture img").getAttribute("data-original-uri"),
        title: el.querySelector('[data-testid="listing-card-title"]').textContent.trim(),
        distance: Array.from(el.querySelectorAll('[data-testid="listing-card-subtitle"]'))[0].textContent.trim(),
        dates: Array.from(el.querySelectorAll('[data-testid="listing-card-subtitle"]'))[1].textContent.trim(),
        price: {
          currency: priceString.replace(/[\d|,|.]+/gm, "").replace(/\s/gm, ""),
          value: parseFloat(priceString.match(/[\d|,|.]+/gm)[0].replace(",", "")),
        },
        rating: parseFloat(el.querySelector("span[aria-label]")?.getAttribute("aria-label")) || "No rating",
        link: `https://www.airbnb.com${el.querySelector("a").getAttribute("href")}`,
      };
    });
  });
};

const getAirbnbHotels = async (multiplierArgument, category, currency, resultsLimit = 20) => {
  multiplier = multiplierArgument;
  const { currencies, categories } = getAirbnbFilters();
  const parsedCategory = category ? categories.find((el) => el.value === category || el.name.toLowerCase() === category.toLowerCase()) : true;
  const parsedCurrency = currency
    ? currencies.find((el) => el.value.toLowerCase() === currency.toLowerCase() || el.name.toLowerCase() === currency.toLowerCase())
    : true;
  if (!parsedCategory && !parsedCurrency) {
    throw new Error(`Provided category "${category}" and currency "${currency}" are not valid. Use "getFilters" method to get available filters.`);
  }
  if (!parsedCategory) {
    throw new Error(`Provided category "${category}" is not valid. Use "getFilters" method to get available filters.`);
  }
  if (!parsedCurrency) {
    throw new Error(`Provided currency "${currency}" is not valid. Use "getFilters" method to get available filters.`);
  }
  const url = `https://www.airbnb.com/${category ? `?category_tag=Tag:${parsedCategory.value}` : ""}`;

  const { page, closeBrowser } = await getBrowserInstance();

  await page.goto(url);
  await page.waitForSelector("#site-content");
  if (currency && parsedCurrency) {
    await page.click("._19c5bku:nth-child(2)");
    await page.waitForTimeout(2000 * multiplier);
    await page.waitForSelector("._obr3yz");
    const selectedCurrencyIndex = await page.evaluate((currency) => {
      const allCurrencies = Array.from(document.querySelectorAll("._obr3yz"));
      return allCurrencies.findIndex((el) => el.querySelector("div:last-child").textContent.toLowerCase().includes(currency.toLowerCase()));
    }, parsedCurrency.value);
    await page.click(`._obr3yz:nth-child(${selectedCurrencyIndex + 1})`);
    await page.waitForTimeout(3000 * multiplier);
    await page.waitForSelector("#site-content");
  }
  await page.waitForTimeout(3000 * multiplier);

  await scrollPage(page, resultsLimit);

  const results = [...(await getHotelsInfo(page))].filter((el, i) => i < resultsLimit);

  await closeBrowser();

  return results;
};

export default getAirbnbHotels;
