import { getBrowserInstance } from "../helpers/browserInstance.cjs";
import getAirbnbFilters from "./getAirbnbFilters.js";

let multiplier = 1;

const scrollPage = async (page, reviewsLimit) => {
  const getHeight = async () =>
    await page.evaluate(
      `document.querySelector('[data-testid="modal-container"] ${reviewsLimit ? "._17itzz4" : "section [role] > div:last-child"}').scrollHeight`
    );
  const getResultsLength = async () => Array.from(await page.$$('[data-testid="modal-container"] .r1are2x1'))?.length;
  let lastHeight = await getHeight();
  let resultsLength = await getResultsLength();
  const clickCount = reviewsLimit ? 5 : 15;
  for (let i = 0; i < 3; i++) {
    await page.waitForTimeout(500 * multiplier);
    await page.keyboard.press("Tab");
  }
  while (reviewsLimit ? resultsLength < reviewsLimit + 10 : true) {
    for (let i = 0; i < clickCount; i++) {
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

const getHotelInfo = async (page) => {
  return await page.evaluate(() => {
    const priceSelector =
      document.querySelector('[data-section-id="BOOK_IT_SIDEBAR"] ._tyxjp1') ||
      document.querySelector('[data-section-id="BOOK_IT_SIDEBAR"] ._1y74zjx');
    const priceString = priceSelector?.textContent.trim();
    const currency = priceString?.replace(/[\d|,|.]+/gm, "").replace(/\s/gm, "");
    return {
      name: document.querySelector("h1")?.textContent.trim(),
      shortDescription: document.querySelector("h2")?.textContent.trim(),
      shortOverview: Array.from(document.querySelectorAll('[data-section-id="OVERVIEW_DEFAULT"] .l7n4lsf > span:not([class])')).map((el) =>
        el.textContent.trim()
      ),
      highlights: Array.from(document.querySelectorAll('[data-section-id="HIGHLIGHTS_DEFAULT"] ._1mqc21n')).map((el) => ({
        title: el.querySelector("div:first-child")?.textContent.trim(),
        subtitle: el.querySelector("div:last-child")?.textContent.trim(),
      })),
      price: {
        currency,
        amount: parseFloat(priceString?.match(/[\d|,|.]+/gm)[0].replace(",", "")),
        period: priceSelector?.parentElement.querySelector("span:nth-child(2)")
          ? priceSelector?.parentElement.querySelector("span:nth-child(2)")?.textContent.trim()
          : document.querySelector('[data-section-id="BOOK_IT_SIDEBAR"] div > button').getAttribute("aria-label").split(";")[1].trim() +
            document.querySelector('[data-section-id="BOOK_IT_SIDEBAR"] div > button').getAttribute("aria-label").split(";")[2],
      },
      description: document.querySelector('[data-section-id="DESCRIPTION_DEFAULT"] .ll4r2nl')?.textContent.trim(),
      sleepOptions: Array.from(document.querySelectorAll('[data-section-id="SLEEPING_ARRANGEMENT_DEFAULT"] ._c991cpe')).map((el) => ({
        room: el.querySelector("._1auxwog")?.textContent.trim(),
        bed: el.querySelector("._1a5glfg")?.textContent.trim(),
      })),
      location: document.querySelector('[data-section-id="LOCATION_DEFAULT"] ._152qbzi')?.textContent.trim(),
      host: {
        name: document.querySelector('[data-section-id="HOST_PROFILE_DEFAULT"] h2')?.textContent.trim().replace("Hosted by ", ""),
        joined: document.querySelector('[data-section-id="HOST_PROFILE_DEFAULT"] .l7n4lsf')?.textContent.trim(),
        overview: Array.from(document.querySelectorAll('[data-section-id="HOST_PROFILE_DEFAULT"] .tpa8qb9 > div > span:last-child')).map((el) =>
          el.textContent.trim()
        ),
        additionalInfo: Array.from(document.querySelectorAll('[data-section-id="HOST_PROFILE_DEFAULT"] .f19phm7j')).map((el) =>
          el.textContent.trim()
        ),
      },
    };
  });
};

const getAirbnbHotelInfo = async (multiplierArgument, link, currency, reviewsLimit = 10) => {
  multiplier = multiplierArgument;
  const { currencies } = getAirbnbFilters();
  const parsedCurrency = currency
    ? currencies.find((el) => el.value.toLowerCase() === currency.toLowerCase() || el.name.toLowerCase() === currency.toLowerCase())
    : true;
  if (!parsedCurrency) {
    throw new Error(`Provided currency "${currency}" is not valid. Use "getFilters" method to get available filters.`);
  }

  const { page, closeBrowser } = await getBrowserInstance();

  await page.goto(link);
  await page.waitForSelector("#site-content");
  await page.waitForTimeout(5000 * multiplier);
  const isModal = await page.$('[aria-label="Translation on"]');
  if (isModal) {
    await page.click('[data-testid="modal-container"] [aria-label="Close"]');
    await page.waitForTimeout(2000 * multiplier);
  }
  const priceString =
    (await page.$('[data-section-id="BOOK_IT_SIDEBAR"] ._tyxjp1')) || (await page.$('[data-section-id="BOOK_IT_SIDEBAR"] ._1y74zjx'));
  if (!priceString) {
    try {
      await page.click('[data-section-id="BOOK_IT_SIDEBAR"] button');
      await page.waitForTimeout(3000 * multiplier);
      await page.click('[data-testid="bookit-sidebar-availability-calendar"] td[aria-disabled="false"]');
      await page.waitForTimeout(1000 * multiplier);
      await page.click('[data-testid="bookit-sidebar-availability-calendar"] td[aria-disabled="false"]');
      await page.waitForTimeout(2000 * multiplier);
    } catch (e) {
      console.log(e);
    }
  }
  if (currency && parsedCurrency) {
    const languageButton = await page.$("._ar9stc > div:last-child > div > span:last-child");
    if (languageButton) {
      await languageButton.click();
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
  }
  await page.waitForTimeout(3000 * multiplier);

  //main info
  const hotelInfo = await getHotelInfo(page);
  hotelInfo.link = link;

  //place offers
  await page.click('[data-section-id="AMENITIES_DEFAULT"] button');
  await page.waitForTimeout(3000 * multiplier);
  hotelInfo.placeOffers = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="modal-container"] .dir-ltr[id]'))
      .map((el) => (el.id.includes("row-title") ? el.textContent.trim() : null))
      .filter((el) => el)
  );
  await page.click('[data-testid="modal-container"] [aria-label="Close"]');
  await page.waitForTimeout(1000 * multiplier);

  const thingsToKnowButtons = Array.from(await page.$$('[data-section-id="POLICIES_DEFAULT"] button'));

  //house rules
  await thingsToKnowButtons[0].click();
  await page.waitForTimeout(3000 * multiplier);
  hotelInfo.houseRules = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="modal-container"] .t1rc5p4c')).map((el) => el.textContent.trim())
  );
  await page.click('[data-testid="modal-container"] [aria-label="Close"]');
  await page.waitForTimeout(1000 * multiplier);

  //safety & property
  await thingsToKnowButtons[1].click();
  await page.waitForTimeout(3000 * multiplier);
  hotelInfo.safetyAndProperty = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="modal-container"] .t1rc5p4c')).map((el) => el.textContent.trim())
  );
  await page.click('[data-testid="modal-container"] [aria-label="Close"]');
  await page.waitForTimeout(1000 * multiplier);

  //place photos
  await page.click('[data-section-id="HERO_DEFAULT"] button');
  await page.waitForTimeout(5000 * multiplier);
  await scrollPage(page);
  hotelInfo.photos = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="modal-container"] img')).map((el) => el.getAttribute("data-original-uri"))
  );
  await page.click('[data-testid="modal-container"] [aria-label="Close"]');
  await page.waitForTimeout(1000 * multiplier);

  //place reviews
  const isReviews = await page.$('[data-section-id="REVIEWS_DEFAULT"] button');
  if (isReviews) {
    await page.click('[data-section-id="REVIEWS_DEFAULT"] button');
    await page.waitForTimeout(3000 * multiplier);
    await scrollPage(page, reviewsLimit);
    hotelInfo.reviewsInfo = await page.evaluate(() => {
      const ratingArray = document.querySelector('[data-testid="modal-container"] h2').textContent.trim().split(/\s/);
      return {
        totalReviews: parseInt(ratingArray[2]),
        rating: {
          total: parseFloat(ratingArray[0]),
          cleanliness: parseFloat(Array.from(document.querySelectorAll('[data-testid="modal-container"] ._yorrb7h ._4oybiu'))[0]?.textContent.trim()),
          accuracy: parseFloat(Array.from(document.querySelectorAll('[data-testid="modal-container"] ._yorrb7h ._4oybiu'))[1]?.textContent.trim()),
          communication: parseFloat(
            Array.from(document.querySelectorAll('[data-testid="modal-container"] ._yorrb7h ._4oybiu'))[2]?.textContent.trim()
          ),
          location: parseFloat(Array.from(document.querySelectorAll('[data-testid="modal-container"] ._yorrb7h ._4oybiu'))[3]?.textContent.trim()),
          checkIn: parseFloat(Array.from(document.querySelectorAll('[data-testid="modal-container"] ._yorrb7h ._4oybiu'))[4]?.textContent.trim()),
          value: parseFloat(Array.from(document.querySelectorAll('[data-testid="modal-container"] ._yorrb7h ._4oybiu'))[5]?.textContent.trim()),
        },
        reviews: Array.from(document.querySelectorAll('[data-testid="modal-container"] .r1are2x1')).map((el) => ({
          name: el.querySelector("h3").textContent.trim(),
          avatar: el.querySelector("a img")?.getAttribute("data-original-uri"),
          userPage: `https://www.airbnb.com${el.querySelector("a")?.getAttribute("href")}`,
          date: el.querySelector("li").textContent.trim(),
          review: el.querySelector("span").textContent.trim(),
        })),
      };
    });
    hotelInfo.reviewsInfo.reviews = hotelInfo.reviewsInfo.reviews.filter((el, i) => i < reviewsLimit);
    await page.click('[data-testid="modal-container"] [aria-label="Close"]');
    await page.waitForTimeout(1000 * multiplier);
  }

  await closeBrowser();

  return hotelInfo;
};

export default getAirbnbHotelInfo;
