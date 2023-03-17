import moment from "moment";
import { getBrowserInstance } from "../helpers/browserInstance.cjs";
import getHotelsComFilters from "./getHotelsComFilters.js";

let multiplier = 1;

const scrollPage = async (page, resultsLimit) => {
  const getFullHeight = async () => await page.evaluate(`document.body.scrollHeight`);
  const getCurrentHeight = async () => (await page.evaluate(`window.scrollY`)) + (await page.evaluate(`window.innerHeight`));
  const getResultsLength = async () => Array.from(await page.$$('[data-stid="section-results"] [data-stid="lodging-card-responsive"]')).length;
  let resultsLength = await getResultsLength();
  while (resultsLimit >= resultsLength) {
    let fullHeight = await getFullHeight();
    let currentHeight = await getCurrentHeight();
    while (fullHeight !== currentHeight) {
      await page.waitForTimeout(500 * multiplier);
      await page.keyboard.press("PageDown");
      fullHeight = await getFullHeight();
      currentHeight = await getCurrentHeight();
    }
    await page.waitForTimeout(5000 * multiplier);
    resultsLength = await getResultsLength();
    if (resultsLimit <= resultsLength) break;
    const isNextPage = await page.$('[data-stid="show-more-results"]');
    if (!isNextPage) break;
    await isNextPage.click();
    await page.waitForTimeout(2000 * multiplier);
    let isLoader = await page.$(".uitk-loader.is-visible");
    while (isLoader) {
      await page.waitForTimeout(2000 * multiplier);
      isLoader = await page.$(".uitk-loader.is-visible");
    }
    const newResultsLength = await getResultsLength();
    if (newResultsLength === resultsLength) break;
  }
};

const getHotelsInfo = async (page) => {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-stid="section-results"] [data-stid="lodging-card-responsive"]')).map((el) => {
      const priceBlock = el.querySelector(".uitk-layout-grid-item .uitk-layout-grid-item.uitk-layout-flex > .uitk-layout-flex");
      const rawLink = el.querySelector('[data-stid="open-hotel-information"]').getAttribute("href").slice(1);
      const link = `${window.location.href.slice(0, window.location.href.indexOf("Hotel-Search"))}${rawLink.slice(0, rawLink.indexOf("?"))}`;
      return {
        title: el.querySelector("h4").textContent.trim(),
        isAd: Boolean(el.querySelector(".uitk-badge-promoted")),
        location: el.querySelector("h4+div").textContent.trim(),
        snippet: {
          title: el
            .querySelectorAll(
              ".uitk-layout-grid-item .uitk-layout-grid-item > .uitk-layout-flex > .uitk-layout-flex-item > .uitk-text:not(.uitk-type-300)"
            )[0]
            ?.textContent.trim(),
          text: el
            .querySelectorAll(
              ".uitk-layout-grid-item .uitk-layout-grid-item > .uitk-layout-flex > .uitk-layout-flex-item > .uitk-text:not(.uitk-type-300)"
            )[1]
            ?.textContent.trim(),
        },
        paymentOptions: Array.from(
          el.querySelectorAll(
            ".uitk-layout-grid-item .uitk-layout-grid-item > .uitk-layout-flex > .uitk-layout-flex-item > div:not(.uitk-text) > .uitk-text"
          )
        ).map((el) => el.textContent.trim()),
        highlightedAmenities: Array.from(el.querySelectorAll("h4+div+div.uitk-layout-flex > div")).map((el) => el.textContent.trim()),
        price: priceBlock
          ? {
              currency: priceBlock
                .querySelector("div:first-child > div > span")
                ?.textContent.trim()
                .replace(/[\d|,|.]+/gm, "")
                .replace(/\s/gm, ""),
              value: parseFloat(
                priceBlock
                  .querySelector("div:first-child > div > span")
                  ?.textContent.trim()
                  .match(/[\d|,|.]+/gm)?.[0]
                  .replace(",", "")
              ),
              withTaxesAndCharges: parseFloat(
                priceBlock
                  .querySelector("div.uitk-layout-flex:nth-child(2)")
                  ?.textContent.trim()
                  .match(/[\d|,|.]+/gm)?.[0]
                  .replace(",", "")
              ),
            }
          : "Sold out",
        rating: {
          score:
            parseFloat(el.querySelector(".uitk-layout-grid-item .uitk-layout-grid-item .uitk-layout-flex > span:nth-child(1)")?.textContent.trim()) ||
            "No rating",
          reviews:
            parseInt(
              el
                .querySelector(".uitk-layout-grid-item .uitk-layout-grid-item .uitk-layout-flex > span:last-child")
                ?.textContent.trim()
                .match(/[\d|,|.]+/gm)?.[0]
                .replace(",", "")
            ) || "No rating",
        },
        link,
      };
    });
  });
};

const getHotelsComHotels = async (
  multiplierArgument,
  appliedFilters,
  priceFrom,
  priceTo,
  country,
  language,
  limit,
  selectedLocation,
  selectedCheckIn,
  selectedCheckOut,
  selectedAdults,
  selectedChildren
) => {
  const resultsLimit = limit || 20;
  const location = selectedLocation || "paris";
  const checkInDateArray = selectedCheckIn?.replace(/(\d+)\/(\d+)\/(\d+)/, "$3,$1,$2").split(",");
  const checkOutDateArray = selectedCheckOut?.replace(/(\d+)\/(\d+)\/(\d+)/, "$3,$1,$2").split(",");
  const adults = selectedAdults || 2;
  const children = selectedChildren || 0;
  multiplier = multiplierArgument;
  const { locales, filters } = getHotelsComFilters(true);
  let parsedFilters = [];
  const badFilters = [];
  if (appliedFilters) {
    if (!Array.isArray(appliedFilters)) {
      throw new Error(`"filters" value is not valid. It must be an array with available filters. Use "getFilters" method to get available filters.`);
    }
    appliedFilters.forEach((el) => {
      let parsedFilter;
      for (const filtersArray in filters) {
        if (parsedFilter) break;
        parsedFilter = filters[filtersArray].find(
          (filter) => filter.value.toLowerCase() === el.toLowerCase() || filter.name.toLowerCase() === el.toLowerCase()
        );
      }
      if (parsedFilter) parsedFilters.push(parsedFilter.value);
      else badFilters.push(el);
    });
  }
  const parsedLocale = country ? locales.find((el) => el.country.toLowerCase() === country.toLowerCase()) : true;
  const parsedlanguage = language
    ? parsedLocale.languages?.find((el) => el.name.toLowerCase() === language.toLowerCase() || el.value.toLowerCase() === language.toLowerCase())
    : true;
  if (appliedFilters && badFilters.length && !parsedLocale && !parsedlanguage) {
    throw new Error(
      `Provided filters "${badFilters}", country "${country}" and language "${language}" are not valid. Use "getFilters" method to get available filters.`
    );
  }
  if (!parsedLocale && !parsedlanguage) {
    throw new Error(`Provided country "${country}" and language "${language}" are not valid. Use "getFilters" method to get available filters.`);
  }
  if (appliedFilters && badFilters.length && !parsedLocale) {
    throw new Error(`Provided filters "${badFilters}" and country "${country}" are not valid. Use "getFilters" method to get available filters.`);
  }
  if (appliedFilters && badFilters.length && !parsedlanguage) {
    throw new Error(`Provided filters "${badFilters}" and language "${language}" are not valid. Use "getFilters" method to get available filters.`);
  }
  if (appliedFilters && badFilters.length) {
    throw new Error(`Provided filters "${badFilters}" is not valid. Use "getFilters" method to get available filters.`);
  }
  if (!parsedLocale) {
    throw new Error(`Provided country "${country}" is not valid. Use "getFilters" method to get available filters.`);
  }
  if (!parsedlanguage) {
    throw new Error(`Provided language "${language}" is not valid for this country "${country}". Use "getFilters" method to get available filters.`);
  }
  if ((checkInDateArray && !checkOutDateArray) || (!checkInDateArray && checkOutDateArray)) {
    throw new Error(`If you want to define dates, it must be both check-in and check-out dates.`);
  }
  let checkInMonthAfterNow;
  let checkOutMonthAfterNow;
  if (checkInDateArray && checkOutDateArray) {
    checkInDateArray[1] = checkInDateArray[1] - 1;
    checkOutDateArray[1] = checkOutDateArray[1] - 1;
    const momentCheckInDate = moment(checkInDateArray);
    const momentCheckOutDate = moment(checkOutDateArray);
    if (momentCheckInDate.toString() === "Invalid date" || momentCheckOutDate.toString() === "Invalid date") {
      throw new Error(`Invalid date format. Correct format is "12/31/2023"`);
    }
    if (momentCheckInDate.diff(moment(), "days") < 0) {
      throw new Error(`Check-in date can't be in past.`);
    }
    if (momentCheckOutDate.diff(momentCheckInDate, "days") < 1) {
      throw new Error(`Check-out date must be greater than check-in date.`);
    }
    if (momentCheckOutDate.diff(momentCheckInDate, "days") >= 29) {
      throw new Error(`Check-out date must be within 29 days of check-in date.`);
    }
    const currentMonth = parseInt(moment().format("M")) + parseInt(moment().format("YYYY")) * 12;
    const checkInMonth = parseInt(momentCheckInDate.format("M")) + parseInt(momentCheckInDate.format("YYYY")) * 12;
    const checkOutMonth = parseInt(momentCheckOutDate.format("M")) + parseInt(momentCheckOutDate.format("YYYY")) * 12;
    checkInMonthAfterNow = checkInMonth - currentMonth;
    checkOutMonthAfterNow = checkOutMonth - currentMonth;
  }
  if (priceFrom || priceFrom) {
    if ((priceFrom && typeof priceFrom !== "number") || (priceTo && typeof priceTo !== "number") || (priceFrom && priceFrom < 0)) {
      throw new Error(`Provided price is not valid. Price must be a number greater than 0.`);
    }
    if (priceFrom && priceFrom) {
      if (priceFrom > priceTo) {
        throw new Error(`Provided prices are not valid. "Price to" value must be greater than "price from" value.`);
      }
    }
  }

  const url = `https://hotels.com/`;

  const { page, closeBrowser } = await getBrowserInstance();

  await page.goto(url);
  await page.waitForSelector('[data-stid="destination_form_field-menu-trigger"]');

  if (country) {
    await page.click('[data-stid="button-type-picker-trigger"]');
    await page.waitForTimeout(2000 * multiplier);
    const regionSelect = await page.$("#site-selector");
    await regionSelect.select(parsedLocale.code);
    await page.waitForTimeout(1000 * multiplier);
    if (language) {
      const languageSelect = await page.$("#language-selector");
      await languageSelect.select(parsedlanguage.value);
      await page.waitForTimeout(1000 * multiplier);
    }
    await page.click(`#app-layer-disp-settings-picker button.uitk-button`);
    await page.waitForTimeout(5000 * multiplier);
  }

  await page.waitForSelector('[data-stid="destination_form_field-menu-trigger"]');

  await page.click('[data-stid="destination_form_field-menu-trigger"]');
  await page.waitForTimeout(1000 * multiplier);
  await page.keyboard.type(location);
  await page.waitForTimeout(5000 * multiplier);
  await page.click('[data-stid="destination_form_field-result-item-button"]');
  await page.waitForTimeout(1000 * multiplier);

  if (selectedCheckIn && selectedCheckOut) {
    await page.click("#date_form_field-btn");
    await page.waitForTimeout(1000 * multiplier);
    for (let i = 0; i < checkInMonthAfterNow; i++) {
      await page.click('[data-stid="date-picker-paging"]:last-child');
      await page.waitForTimeout(1000 * multiplier);
    }
    await page.click(`[data-stid="date-picker-month"] [data-day="${checkInDateArray[2]}"]`);
    await page.waitForTimeout(1000 * multiplier);
    for (let i = 0; i < checkOutMonthAfterNow; i++) {
      await page.click('[data-stid="date-picker-paging"]:last-child');
      await page.waitForTimeout(1000 * multiplier);
    }
    await page.click(`[data-stid="date-picker-month"] [data-day="${checkOutDateArray[2]}"]`);
    await page.waitForTimeout(1000 * multiplier);
    await page.click('[data-stid="apply-date-picker"]');
    await page.waitForTimeout(1000 * multiplier);
  }

  if (adults !== 2 && children !== 0) {
    await page.click('[data-stid="open-room-picker"]');
    await page.waitForTimeout(1000 * multiplier);
    if (adults === 1) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(500 * multiplier);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500 * multiplier);
      await page.keyboard.press("Tab");
      await page.waitForTimeout(500 * multiplier);
    } else if (adults !== 2) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(500 * multiplier);
      await page.keyboard.press("Tab");
      await page.waitForTimeout(500 * multiplier);
      for (let i = 0; i < adults - 2; i++) {
        await page.keyboard.press("Enter");
        await page.waitForTimeout(500 * multiplier);
      }
    }
    await page.keyboard.press("Tab");
    await page.waitForTimeout(500 * multiplier);
    for (let i = 0; i < children; i++) {
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500 * multiplier);
    }
    for (let i = 0; i < children; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(500 * multiplier);
      await page.keyboard.type("10");
      await page.waitForTimeout(500 * multiplier);
    }
    await page.click("#traveler_selector_done_button");
    await page.waitForTimeout(1000 * multiplier);
  }
  await page.click("#search_button");

  await page.waitForSelector('[data-stid="section-results"] [data-stid="lodging-card-responsive"]');
  await page.waitForTimeout(1000 * multiplier);

  if (parsedFilters.length) {
    for (const filter of parsedFilters) {
      if (filter.includes("guestRating")) {
        await page.evaluate(
          (filter) =>
            Array.from(document.querySelectorAll("label")).forEach((el) => {
              if (el.getAttribute("for")?.includes(filter)) el.click();
            }),
          filter
        );
        await page.waitForTimeout(2000 * multiplier);
      } else {
        await page.click(`[for="${filter}"]`);
        await page.waitForTimeout(2000 * multiplier);
      }
    }
  }

  if (priceFrom) {
    await page.focus('[for="price-primary"]');
    await page.waitForTimeout(2000 * multiplier);
    const step = await page.evaluate(() => parseInt(document.querySelector("#price-primary")?.getAttribute("step")));
    const fromClickTimes = Math.floor(priceFrom / step);
    for (let i = 0; i < fromClickTimes; i++) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(3000 * multiplier);
      await page.keyboard.press("Tab");
      await page.waitForTimeout(500 * multiplier);
    }
    if (priceTo) {
      const max = await page.evaluate(() => parseInt(document.querySelector("#price-primary")?.getAttribute("max")));
      const toClickTimes = Math.floor((max - priceTo) / step);
      for (let i = 0; i < toClickTimes; i++) {
        await page.keyboard.press("Tab");
        await page.waitForTimeout(500 * multiplier);
        await page.keyboard.press("ArrowLeft");
        await page.waitForTimeout(3000 * multiplier);
        await page.keyboard.press("Tab");
        await page.waitForTimeout(500 * multiplier);
      }
    }
  }

  await page.waitForTimeout(1000 * multiplier);
  await page.focus("header a");
  await page.waitForTimeout(3000 * multiplier);

  await page.waitForSelector('[data-stid="section-results"] [data-stid="lodging-card-responsive"]');
  await page.waitForTimeout(1000 * multiplier);

  await scrollPage(page, resultsLimit);

  const results = await getHotelsInfo(page);

  await closeBrowser();

  return results.filter((el, i) => i < resultsLimit);
};

export default getHotelsComHotels;
