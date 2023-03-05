import { getBrowserInstance } from "../helpers/browserInstance.cjs";

let multiplier = 1;

const getHotelInfo = async (page) => {
  return await page.evaluate(() => {
    return {
      title: document.querySelector("#hp_hotel_name h2")?.textContent.trim(),
      type: document.querySelector('[data-testid="property-type-badge"]')?.textContent.trim(),
      stars: Array.from(document.querySelectorAll('[data-testid="rating-stars"] > span')).length,
      preferredBadge: Boolean(document.querySelector(".-iconset-thumbs_up_square")),
      subwayAccess: Boolean(document.querySelector(".metro-no-wrap")),
      sustainability: document.querySelector(".sustainability-badge-mfe-wrapper")?.textContent.trim(),
      address: document.querySelector(".hp_address_subtitle")?.textContent.trim(),
      highlights: Array.from(document.querySelectorAll('[data-testid="property-highlights"] > div > div')).map((el) => el.textContent.trim()),
      shortDescription: document.querySelector(".hp-hotel-description-header")?.textContent.trim(),
      description: document.querySelector("#property_description_content")?.textContent.trim(),
      descriptionHighlight: document.querySelector(".hp-desc-review-highlight")?.textContent.trim(),
      descriptionSummary: document.querySelector(".summary")?.textContent.trim(),
      facilities: Array.from(document.querySelectorAll('[data-testid="facility-list-most-popular-facilities"] > div')).map((el) =>
        el.textContent.trim()
      ),
      areaInfo: Array.from(document.querySelectorAll(".d31796cb42")).map((el) => ({
        [`${el.querySelector(".ac78a73c96").textContent.trim()}`]: Array.from(el.querySelectorAll("li")).map((el) => ({
          place: el.querySelector(".b1e6dd8416").textContent.trim(),
          distance: el.querySelector(".db29ecfbe2").textContent.trim(),
        })),
      })),
    };
  });
};

const getHotelReviews = async (page) => {
  return await page.evaluate(() => {
    return {
      score: parseFloat(document.querySelector("#review_list_score_container .d10a6220b4")?.textContent.trim()),
      scoreDescription: document.querySelector("#review_list_score_container .f0d4d6a2f5")?.getAttribute("aria-label"),
      totalReviews: parseInt(document.querySelector("#review_list_score_container .d8eab2cf7f")?.textContent.trim()),
      categoriesRating: Array.from(document.querySelectorAll('#review_list_score_container .ccff2b4c43 > [data-testid="review-subscore"]')).map(
        (el) => ({
          [`${el.querySelector(".d6d4671780")?.textContent.trim()}`]: parseFloat(
            el.querySelector("[aria-valuetext]")?.getAttribute("aria-valuetext")
          ),
        })
      ),
      reviews: Array.from(document.querySelectorAll("#review_list_score_container .review_list_new_item_block")).map((el) => ({
        name: el.querySelector(".bui-avatar-block__title")?.textContent.trim(),
        avatar: el.querySelector(".bui-avatar__image")?.getAttribute("src"),
        country: el.querySelector(".bui-avatar-block__subtitle")?.textContent.trim(),
        date: el.querySelector(".c-review-block__right .c-review-block__date")?.textContent.trim(),
        reting: el.querySelector(".bui-review-score__badge")?.textContent.trim(),
        review: Array.from(el.querySelectorAll(".c-review__inner")).map((el) => ({
          [`${el.querySelector(".-iconset-review_poor") ? "didNotLike" : "liked"}`]: el.querySelector(".c-review__body")?.textContent.trim(),
        })),
        hotelResponse: (
          el.querySelector(".c-review-block__response__body.bui-u-hidden") || el.querySelector(".c-review-block__response__body")
        )?.textContent.trim(),
      })),
    };
  });
};

const getBookingHotelInfo = async (multiplierArgument, link, reviewsLimit = 10) => {
  multiplier = multiplierArgument;

  const { page, closeBrowser } = await getBrowserInstance();

  await page.goto(link);
  await page.waitForSelector(".d31796cb42");
  await page.waitForTimeout(1000 * multiplier);

  //main info
  const hotelInfo = await getHotelInfo(page);
  hotelInfo.link = link;

  //place photos
  await page.click(".bh-photo-grid-thumb-more");
  await page.waitForTimeout(2000 * multiplier);
  await page.focus(".bh-photo-modal img");
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(500 * multiplier);
  }
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("PageDown");
    await page.waitForTimeout(500 * multiplier);
  }
  await page.waitForTimeout(5000 * multiplier);
  hotelInfo.photos = await page.evaluate(() => Array.from(document.querySelectorAll(".bh-photo-modal img")).map((el) => el.getAttribute("src")));
  await page.click(".bh-photo-modal-close");
  await page.waitForTimeout(2000 * multiplier);

  //place reviews
  const isReviews = await page.$("#guest-featured_reviews__horizontal-block");
  if (isReviews) {
    await page.click('[data-testid="fr-read-all-reviews"]');
    await page.waitForTimeout(3000 * multiplier);

    hotelInfo.reviewsInfo = await getHotelReviews(page);
    while (reviewsLimit > hotelInfo.reviewsInfo.reviews.length) {
      const isNextPage = await page.$("#review_list_score_container .bui-pagination__next-arrow:not(.bui-pagination__item--disabled)");
      if (!isNextPage) break;
      await isNextPage.click();
      await page.waitForTimeout(500 * multiplier);
      while (await page.$(".review_list_loader:not(.hideme)")) {
        await page.waitForTimeout(2000 * multiplier);
      }
      await page.waitForTimeout(2000 * multiplier);
      hotelInfo.reviewsInfo.reviews.push(...(await getHotelReviews(page)).reviews);
    }
    hotelInfo.reviewsInfo.reviews = hotelInfo.reviewsInfo.reviews.filter((el, i) => i < reviewsLimit);
  }

  await closeBrowser();

  return hotelInfo;
};

export default getBookingHotelInfo;
