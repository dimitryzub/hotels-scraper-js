import { getBrowserInstance } from "../helpers/browserInstance.cjs";

let multiplier = 1;

const getHotelInfo = async (page) => {
  return await page.evaluate(() => {
    return {
      title: document.querySelector('[data-stid="content-hotel-title"] h1')?.textContent.trim(),
      stars: parseFloat(document.querySelector('[data-stid="content-hotel-title"] .is-visually-hidden')?.textContent.trim()),
      shortDescription: document.querySelector('[data-stid="content-hotel-title"] .uitk-text')?.textContent.trim(),
      address: document.querySelector('[data-stid="map-image-link"] .uitk-text')?.textContent.trim(),

      description: document.querySelector('#AboutThisProperty [itemprop="description"] .uitk-text')?.textContent.trim(),
      languages: document.querySelectorAll('#AboutThisProperty [data-stid="content-item"]')[1]?.querySelector(".uitk-text")?.textContent.trim(),
      roomOptions: Array.from(document.querySelectorAll("#Offers .uitk-card-content-section h2")).map((el) => el.textContent.trim()),
      areaInfo: Array.from(document.querySelectorAll("#Location .uitk-layout-columns-item")).map((el) => ({
        [`${el.querySelector("h4").textContent.trim()}`]: Array.from(el.querySelectorAll("li")).map((el) => ({
          place: el.textContent.trim().split(" - ")[0],
          distance: el.textContent.trim().split(" - ")[1],
        })),
      })),
      CleaningAndSafety: Array.from(document.querySelectorAll('#cleaningAndSafetyPractices [data-stid="content-item"]'))
        .map((el) => {
          if (el.querySelector("h3"))
            return {
              [`${el.querySelector("h3").textContent.trim()}`]: Array.from(el.querySelectorAll(".uitk-layout-grid-item > .uitk-text")).map((el) =>
                el.textContent.trim()
              ),
            };
          else return null;
        })
        .filter((el) => el),
      atAGlance: Array.from(
        document.querySelectorAll("#Amenities .uitk-card-content-section")[0]?.querySelectorAll(".uitk-layout-columns > .uitk-spacing") || []
      )?.map((el) => ({
        [`${el.querySelector("h3").textContent.trim()}`]: Array.from(el.querySelectorAll("li")).map((el) => el.textContent.trim()),
      })),
      propertyAmenities: Array.from(
        document.querySelectorAll("#Amenities .uitk-card-content-section")[1]?.querySelectorAll(".uitk-layout-columns > .uitk-spacing") || []
      )?.map((el) => ({
        [`${el.querySelector("h3").textContent.trim()}`]: Array.from(el.querySelectorAll("li")).map((el) => el.textContent.trim()),
      })),
      roomAmenities: Array.from(
        document.querySelectorAll("#Amenities .uitk-card-content-section")[2]?.querySelectorAll(".uitk-layout-columns > .uitk-spacing") || []
      )?.map((el) => ({
        [`${el.querySelector("h3").textContent.trim()}`]: Array.from(el.querySelectorAll("li")).map((el) => el.textContent.trim()),
      })),
      specialFeatures: Array.from(document.querySelectorAll('#Amenities + div [data-stid="content-item"]')).map((el) => ({
        [`${el.querySelector("h3").textContent.trim()}`]: Array.from(el.querySelectorAll('[data-stid="content-markup"]')).map((el) =>
          el.textContent.trim()
        ),
      })),
      feesAndPolicies: Array.from(document.querySelectorAll('#Policies [data-stid="content-item"]')).map((el) => ({
        [`${el.querySelector("h3").textContent.trim()}`]: Array.from(
          el.querySelectorAll(".uitk-text span:last-child").length
            ? el.querySelectorAll(".uitk-text span:last-child")
            : el.querySelectorAll(".uitk-text")
        ).map((el) => el.textContent.trim()),
      })),
    };
  });
};

const getHotelReviews = async (page) => {
  return await page.evaluate(() => {
    return {
      score: parseFloat(
        document
          .querySelector('#app-layer-summary-reviews-property-summary-1 [data-stid="property-reviews-summary"] h3 span:last-child')
          ?.textContent.trim()
      ),
      scoreDescription: document
        .querySelector('#app-layer-summary-reviews-property-summary-1 [data-stid="property-reviews-summary"] h3 span:last-child')
        ?.textContent.trim()
        .split(" ")[1],
      totalReviews: parseInt(
        document
          .querySelector(['#app-layer-summary-reviews-property-summary-1 [data-stid="property-reviews-summary"] > .is-visually-hidden'])
          ?.textContent.trim()
      ),
      categoriesRating: Array.from(
        document.querySelectorAll(
          '#app-layer-summary-reviews-property-summary-1 [data-stid="property-reviews-summary"] > .uitk-layout-flex > .uitk-spacing'
        )
      ).map((el) => ({
        [`${el.querySelector(".uitk-progress-bar-label")?.textContent.trim()}`]: parseFloat(
          el.querySelector(".uitk-progress-bar-value")?.textContent.trim()
        ),
      })),
      reviews: Array.from(document.querySelectorAll("#app-layer-summary-reviews-property-summary-1 .uitk-card-content-section")).map((el) => ({
        date: el.querySelector('[itemprop = "datePublished"]')?.textContent.trim(),
        reting: parseFloat(el.querySelector('[itemprop="reviewRating"]')?.textContent.trim()),
        reviewTitle: el.querySelector('[data-stid="review_section_title"]')?.textContent.trim(),
        review: el.querySelector('[itemprop="description"]')?.textContent.trim(),
        hotelResponse: el.querySelector("article:not([itemprop]) .uitk-spacing")?.textContent.trim(),
      })),
    };
  });
};

const getHotelsComHotelInfo = async (multiplierArgument, link, reviewsLimit = 10) => {
  multiplier = multiplierArgument;

  const { page, closeBrowser } = await getBrowserInstance();

  await page.goto(link);
  await page.waitForSelector('[data-stid="content-hotel-title"]');
  await page.waitForTimeout(5000 * multiplier);

  const isDatePicker = await page.$('[data-stid="apply-date-picker"]');
  if (isDatePicker) {
    await isDatePicker.click();
    await page.waitForTimeout(1000 * multiplier);
  }

  //main info
  const hotelInfo = await getHotelInfo(page);
  hotelInfo.link = link;

  //place photos
  await page.click("#Overview button");
  await page.waitForTimeout(2000 * multiplier);
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(500 * multiplier);
  }
  const getFullHeight = async () => await page.evaluate(`document.querySelector(".uitk-sheet-content").scrollHeight`);
  const getCurrentHeight = async () =>
    (await page.evaluate(`document.querySelector(".uitk-sheet-content").scrollTop`)) +
    (await page.evaluate(`document.querySelector(".uitk-sheet-content").offsetHeight`));
  let fullHeight = await getFullHeight();
  let currentHeight = await getCurrentHeight();
  while (fullHeight !== currentHeight) {
    await page.waitForTimeout(500 * multiplier);
    await page.keyboard.press("PageDown");
    fullHeight = await getFullHeight();
    currentHeight = await getCurrentHeight();
  }
  await page.waitForTimeout(5000 * multiplier);
  hotelInfo.photos = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#app-layer-thumbnail-gallery #all img")).map((el) => el.getAttribute("src"))
  );
  await page.click("#app-layer-thumbnail-gallery button");
  await page.waitForTimeout(2000 * multiplier);

  //place reviews
  const isReviews = await page.$('[data-stid="reviews-link"]');
  if (isReviews) {
    await isReviews.click();
    await page.waitForTimeout(3000 * multiplier);

    let reviews = await page.$$('[itemprop="review"]');
    while (reviewsLimit > reviews.length) {
      const isNextPage = await page.$("#app-layer-summary-reviews-property-summary-1 .uitk-button-has-text");
      if (!isNextPage) break;
      await isNextPage.click();
      await page.waitForTimeout(3000 * multiplier);
      reviews = await page.$$('[itemprop="review"]');
    }
    hotelInfo.reviewsInfo = await getHotelReviews(page);
    hotelInfo.reviewsInfo.reviews = hotelInfo.reviewsInfo.reviews.filter((el, i) => i < reviewsLimit);
  }

  await closeBrowser();

  return hotelInfo;
};

export default getHotelsComHotelInfo;
