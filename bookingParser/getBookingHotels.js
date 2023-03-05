import chalk from "chalk";
import { getBrowserInstance } from "../helpers/browserInstance.cjs";
import getBookingFilters from "./getBookingFilters.js";

let multiplier = 1;

const getHotelsInfo = async (page) => {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-testid="property-card"]')).map((el) => {
      const priceString = el.querySelector('[data-testid="price-and-discounted-price"]').textContent.trim();
      const taxesString = el
        .querySelector('[data-testid="taxes-and-charges"]')
        ?.textContent.trim()
        .replace(/[^0-9|+|-]/gm, "");
      return {
        thumbnail: el.querySelector("a img").getAttribute("src"),
        title: el.querySelector("h3").textContent.trim(),
        stars: parseInt(el.querySelector(".e4755bbd60")?.getAttribute("aria-label")),
        preferredBadge: Boolean(el.querySelector('[data-testid="preferred-badge"]')),
        promotedBadge: Boolean(el.querySelector(".e2f34d59b1")),
        location: el.querySelector('[data-testid="address"]').textContent.trim(),
        subwayAccess: Boolean(el.querySelector(".f4bd0794db .cb5ebe3ffb > span:not([data-testid])")),
        sustainability: el.querySelector(".ff07fc41e3")?.textContent.trim(),
        distanceFromCenter: parseFloat(el.querySelector('[data-testid="distance"]')?.textContent.trim()),
        highlights: Array.from(el.querySelectorAll(".d22a7c133b > div > [class]")).map((el) => el.textContent.trim()),
        price: {
          currency: priceString.replace(/[\d|,|.]+/gm, "").replace(/\s/gm, ""),
          value: parseFloat(priceString.match(/[\d|,|.]+/gm)[0].replace(",", "")),
          taxesAndCharges: parseFloat(taxesString),
        },
        rating: {
          score: parseFloat(el.querySelector('[data-testid="review-score"] > div:first-child')?.textContent.trim()) || "No rating",
          scoreDescription:
            el.querySelector('[data-testid="review-score"] > div:last-child > div:first-child')?.getAttribute("aria-label") || "No rating",
          reviews: parseInt(el.querySelector('[data-testid="review-score"] > div:last-child > div:last-child')?.textContent.trim()) || "No rating",
        },
        link: el.querySelector("a").getAttribute("href"),
      };
    });
  });
};

const getBookingHotels = async (multiplierArgument, searchParams = {}) => {
  const { filters: appliedFilters, currency, resultsLimit, location, checkIn, checkOut, adults, children, rooms, travelPurpose } = searchParams;
  multiplier = multiplierArgument;
  const { currencies, filters } = getBookingFilters();
  let parsedFilters;
  const badFilters = [];
  if (appliedFilters) {
    if (!Array.isArray(appliedFilters)) {
      throw new Error(`"filters" value is not valid. It must be an array with available filters. Use "getFilters" method to get available filters.`);
    }
    parsedFilters = [];
    appliedFilters.forEach((el) => {
      let parsedFilter;
      for (const filtersArray in filters) {
        if (parsedFilter) break;
        parsedFilter = filters[filtersArray].find((filter) => filter.value === el.toLowerCase() || filter.name.toLowerCase() === el.toLowerCase());
      }
      if (parsedFilter) parsedFilters.push(parsedFilter.value);
      else badFilters.push(el);
    });
  }
  const parsedCurrency = currency
    ? currencies.find((el) => el.value.toLowerCase() === currency.toLowerCase() || el.name.toLowerCase() === currency.toLowerCase())
    : true;
  if (appliedFilters && badFilters.length && !parsedCurrency) {
    throw new Error(`Provided filters "${badFilters}" and currency "${currency}" are not valid. Use "getFilters" method to get available filters.`);
  }
  if (appliedFilters && badFilters.length) {
    throw new Error(`Provided filters "${badFilters}" is not valid. Use "getFilters" method to get available filters.`);
  }
  if (!parsedCurrency) {
    throw new Error(`Provided currency "${currency}" is not valid. Use "getFilters" method to get available filters.`);
  }
  if (parsedCurrency.value === "RUB") {
    throw new Error(chalk.bgRed(`Рубль - валюта терористов! путин - хуйло! Правда о войне в Украине - https://mywar.mkip.gov.ua/`));
  }
  const url = `https://www.booking.com/searchresults.en-us.html?ss=${encodeURI(
    location
  )}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}&no_rooms=${rooms}&group_children=${children}&sb_travel_purpose=${travelPurpose}&selected_currency=${
    parsedCurrency.value
  }${parsedFilters?.length ? `&nflt=${encodeURIComponent(parsedFilters.join(";"))}` : ""}`;

  const { page, closeBrowser } = await getBrowserInstance();

  await page.goto(url);
  await page.waitForSelector('[data-testid="property-card"]');

  const results = [...(await getHotelsInfo(page))];

  while (resultsLimit > results.length) {
    const isNextPage = await page.$('[aria-label="Next page"]:not([disabled])');
    if (!isNextPage) break;
    await isNextPage.click();
    await page.waitForTimeout(500 * multiplier);
    while (await page.$('[data-testid="overlay-card"]')) {
      await page.waitForTimeout(2000 * multiplier);
    }
    await page.waitForTimeout(2000 * multiplier);
    results.push(...(await getHotelsInfo(page)));
  }

  await closeBrowser();

  return results.filter((el, i) => i < resultsLimit);
};

export default getBookingHotels;
