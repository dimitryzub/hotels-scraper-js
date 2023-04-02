import moment from "moment";
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

const getHotelsInfo = async (page, checkIn, checkOut, isLocation) => {
  return await page.evaluate(
    (checkIn, checkOut, isLocation) => {
      return Array.from(document.querySelectorAll('#site-content [itemprop="itemListElement"]')).map((el) => {
        const priceString = isLocation
          ? el
              .querySelector('[data-testid="listing-card-subtitle"]+div+div+div span > span:not([class="_1ks8cgb"])')
              .textContent.trim()
              .split(", ")[0]
          : el.querySelector('[data-testid="listing-card-subtitle"]+div+div span > span:not([class="_1ks8cgb"])').textContent.trim().split(", ")[0];
        const rawLink = el.querySelector("a").getAttribute("href");
        const link = `https://www.airbnb.com${rawLink.slice(0, rawLink.indexOf("?"))}`;
        return {
          thumbnail: el.querySelector("picture img").getAttribute("data-original-uri"),
          title: el.querySelector('[data-testid="listing-card-title"]').textContent.trim(),
          subtitles: Array.from(el.querySelectorAll('[data-testid="listing-card-subtitle"] > span')).map((el) =>
            el.textContent.replace(",&nbsp;", "").replace("·", "").trim()
          ),
          dates: checkIn ? `${checkIn} - ${checkOut}` : undefined,
          price: {
            currency: priceString
              .replace(" total before taxes", "")
              .replace(" per night", "")
              .replace(" per month", "")
              .replace(" month", "")
              .replace(/[\d|,|.]+/gm, "")
              .replace(/\s/gm, ""),
            value: parseFloat(priceString.match(/[\d|,|.]+/gm)[0].replace(",", "")),
            period: priceString.includes("night") ? "night" : priceString.includes("total") ? "selected dates" : "month",
          },
          rating: parseFloat(el.querySelector("span[aria-label]")?.getAttribute("aria-label")) || "No rating",
          link,
        };
      });
    },
    checkIn,
    checkOut,
    isLocation
  );
};

const getAirbnbHotels = async (multiplierArgument, category, currency, limit, location, checkIn, checkOut, adults, children) => {
  multiplier = multiplierArgument;
  const resultsLimit = limit || 20;
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
  if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
    throw new Error(`If you want to define dates, it must be both check-in and check-out dates.`);
  }
  if (checkIn && checkOut) {
    const checkInDateArray = checkIn.replace(/(\d+)\/(\d+)\/(\d+)/, "$3,$1,$2").split(",");
    const checkOutDateArray = checkOut.replace(/(\d+)\/(\d+)\/(\d+)/, "$3,$1,$2").split(",");
    checkInDateArray[1] = checkInDateArray[1] - 1;
    checkOutDateArray[1] = checkOutDateArray[1] - 1;
    if (moment(checkInDateArray).diff(moment(), "days") < 0) {
      throw new Error(`Check-in date can't be in past.`);
    }
    if (moment(checkOutDateArray).diff(moment(checkInDateArray), "days") < 1) {
      throw new Error(`Check-out date must be greater than check-in date.`);
    }
  }
  if (category && location) {
    throw new Error(`You can't use a category with a location for now. We're working on this feature. Please choose one of these options.`);
  }
  const url = `https://www.airbnb.com/${category ? `?category_tag=Tag:${parsedCategory.value}` : ""}`;

  const { page, closeBrowser } = await getBrowserInstance();

  await page.goto(url);
  await page.waitForSelector("#site-content");
  if (currency && parsedCurrency) {
    await page.click('[data-testid="expandable-footer"] span:last-child button');
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

  if (checkIn || location || adults || children) {
    await page.click('[data-testid="little-search"] > button:first-of-type');
    await page.waitForTimeout(1000 * multiplier);
    if (location) {
      await page.click('[data-testid="structured-search-input-field-query"]');
      await page.waitForTimeout(1000 * multiplier);
      await page.keyboard.type(location);
      await page.waitForTimeout(1000 * multiplier);
    }
    if (checkIn) {
      await page.click('[data-testid="structured-search-input-field-split-dates-0"]');
      await page.waitForTimeout(1000 * multiplier);
      let isCheckInDatePresent = await page.$(`[data-testid="calendar-day-${checkIn}"]`);
      while (!isCheckInDatePresent) {
        await page.click('[aria-label="Move forward to switch to the next month."]');
        await page.waitForTimeout(1000 * multiplier);
        isCheckInDatePresent = await page.$(`[data-testid="calendar-day-${checkIn}"]`);
      }
      await page.evaluate((checkIn) => document.querySelector(`[data-testid="calendar-day-${checkIn}"]`).click(), checkIn);
      await page.waitForTimeout(1000 * multiplier);
      let isCheckOutDatePresent = await page.$(`[data-testid="calendar-day-${checkOut}"]`);
      while (!isCheckOutDatePresent) {
        await page.click('[aria-label="Move forward to switch to the next month."]');
        await page.waitForTimeout(1000 * multiplier);
        isCheckOutDatePresent = await page.$(`[data-testid="calendar-day-${checkOut}"]`);
      }
      await page.evaluate((checkOut) => document.querySelector(`[data-testid="calendar-day-${checkOut}"]`).click(), checkOut);
      await page.waitForTimeout(1000 * multiplier);
    }
    if (adults || children) {
      await page.click('[data-testid="structured-search-input-field-guests-button"]');
      await page.waitForTimeout(1000 * multiplier);
      if (adults) {
        for (let i = 0; i < adults; i++) {
          await page.keyboard.press("Enter");
          await page.waitForTimeout(500 * multiplier);
        }
      }
      if (children) {
        await page.keyboard.press("Tab");
        await page.waitForTimeout(1000 * multiplier);
        for (let i = 0; i < children; i++) {
          await page.keyboard.press("Enter");
          await page.waitForTimeout(500 * multiplier);
        }
      }
    }
    await page.click('[data-testid="structured-search-input-search-button"]');
    await page.waitForSelector("#site-content");
    await page.waitForTimeout(5000 * multiplier);
  }

  const results = [];

  if (location) {
    while (true) {
      results.push(...(await getHotelsInfo(page, checkIn, checkOut, Boolean(location))));
      const nextPageButton = await page.$('[aria-label="Next"]:not([disabled])');
      if (!nextPageButton || results.length >= resultsLimit) break;
      await nextPageButton.click();
      await page.waitForTimeout(1000 * multiplier);
      await page.waitForSelector("#site-content");
      await page.waitForTimeout(5000 * multiplier);
    }
  } else {
    await scrollPage(page, resultsLimit);

    results.push(...(await getHotelsInfo(page, checkIn, checkOut, Boolean(location))));
  }

  await closeBrowser();

  return results.filter((el, i) => i < resultsLimit);
};

export default getAirbnbHotels;
