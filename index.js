import getAirbnbFilters from "./airbnbParser/getAirbnbFilters.js";
import getAirbnbHotels from "./airbnbParser/getAirbnbHotels.js";
import getAirbnbHotelInfo from "./airbnbParser/getHotelInfo.js";
import getBookingFilters from "./bookingParser/getBookingFilters.js";
import getBookingHotelInfo from "./bookingParser/getBookingHotelInfo.js";
import getBookingHotels from "./bookingParser/getBookingHotels.js";
import save from "./helpers/fileSaver.js";
import getHotelsComFilters from "./hotelsComParser/getHotelsComFilters.js";
import getHotelsComHotelInfo from "./hotelsComParser/getHotelsComHotelInfo.js";
import getHotelsComHotels from "./hotelsComParser/getHotelsComHotels.js";

export const airbnb = {
  timeMultiplier: 1,

  /**
   * Get hotels list from Airbnb
   * @async
   * @param {String} category - Category code. You can use both "name" or "value" from `getFilters().categories`;
   * @param {String} currency - Currency code. You can use both "name" or "value" from `getFilters().currencies`;
   * @param {Number} resultsLimit - parameter defines the results amount you want to get. Must be a number or `Infinity`. Default - 20;
   * @param {String} location - parameter defines the location of hotels to search;
   * @param {String} checkIn - parameter defines the check-in date. Format - "12/31/2023";
   * @param {String} checkOut - parameter defines the check-out date. Format - "12/31/2023";
   * @param {Number} adults - parameter defines the number of adult guests;
   * @param {Number} children - parameter defines the number of child guests;
   * @return {Array.<object>} An array with hotels results.
   */
  getHotels: async (category, currency, resultsLimit, location, checkIn, checkOut, adults, children) =>
    getAirbnbHotels(airbnb.timeMultiplier, category, currency, resultsLimit, location, checkIn, checkOut, adults, children),

  /**
   * Get hotel info from Airbnb
   * @async
   * @param {String} link - Link to the hotel page;
   * @param {String} currency - Currency code. You can use both "name" or "value" from `getFilters().currencies`;
   * @param {Number} reviewsLimit - parameter defines the reviews amount you want to get. Must be a number or `Infinity`. Default - 10;
   * @return {Object} An object with hotel information.
   */
  getHotelInfo: async (link, currency, reviewsLimit) => getAirbnbHotelInfo(airbnb.timeMultiplier, link, currency, reviewsLimit),

  /**
   * Get available Airbnb categories and currencies
   * @return {Object} An object with categories and currencies.
   */
  getFilters: () => getAirbnbFilters(),
};

export const booking = {
  timeMultiplier: 1,

  /**
   * Get hotels list from Booking
   * @async
   * @param {Array} filters - an array with filter codes. You can get all available filters with their codes from `getFilters().filters` method. E.g. `["class=5", "pri=5"]`;
   * @param {String} currency - currency code. You can get all available currencies with their codes from `getFilters().currencies` method. Default - "USD";
   * @param {String} resultsLimit - parameter defines the results amount you want to get. Must be a number or `Infinity`. Default - 35;
   * @param {String} location - location of hotels to search. Default - "Paris";
   * @param {String} checkIn - check-in date. Format - "12/31/2023", Default - today;
   * @param {String} checkOut - check-in date. Format - "12/31/2023", Default - tomorrow;
   * @param {String} adults - number of adult guests. Default - 2;
   * @param {String} children - number of child guests. Default - 0;
   * @param {String} rooms - number of rooms needed. Default - 1;
   * @param {String} travelPurpose - travel purpouse. Available "leisure" or "business". Default - "leisure";
   * @return {Array.<Object>} An array with hotels results.
   */
  getHotels: async (filters, currency, resultsLimit, location, checkIn, checkOut, adults, children, rooms, travelPurpose) =>
    getBookingHotels(booking.timeMultiplier, filters, currency, resultsLimit, location, checkIn, checkOut, adults, children, rooms, travelPurpose),

  /**
   * Get hotel info from Booking
   * @async
   * @param {String} link - Link to the hotel page;
   * @param {Number} reviewsLimit - parameter defines the reviews amount you want to get. Must be a number or `Infinity`. Default - 10;
   * @return {Object} An object with hotel information.
   */
  getHotelInfo: async (link, reviewsLimit) => getBookingHotelInfo(booking.timeMultiplier, link, reviewsLimit),

  /**
   * Get available Booking filters and currencies
   * @return {Object} An object with filters and currencies.
   */
  getFilters: () => getBookingFilters(),
};

export const hotelsCom = {
  timeMultiplier: 1,

  /**
   * Get hotels list from Hotels.com
   * @async
   * @param {Array} filters - an array with filter codes. You can get all available filters with their codes from `getFilters().filters` method. E.g. `["guestRating-35", "2 star"]`;
   * @param {String} priceFrom - min price filter. On Hotels.com available 10 price steps. `priceFrom` value will be round to the nearest lower step value;
   * @param {String} priceTo - max price filter. On Hotels.com available 10 price steps. `priceTo` value will be round to the nearest higher step value;
   * @param {String} country - country name. You can get all available countries with their currencies and languages (if provided) from `getFilters().locales` method;
   * @param {String} language - interface language. You can change language only if the selected `country` has several languages;
   * @param {String} resultsLimit - parameter defines the results amount you want to get. Must be a number or `Infinity`. Default - 20;
   * @param {String} location - location of hotels to search. Default - "Paris";
   * @param {String} checkIn - check-in date. Format - "12/31/2023", Default - today;
   * @param {String} checkOut - check-in date. Format - "12/31/2023", Default - tomorrow;
   * @param {String} adults - number of adult guests. Default - 2;
   * @param {String} children - number of child guests. Default - 0;
   * @return {Array.<Object>} An array with hotels results.
   */
  getHotels: async (filters, priceFrom, priceTo, country, language, resultsLimit, location, checkIn, checkOut, adults, children) =>
    getHotelsComHotels(
      hotelsCom.timeMultiplier,
      filters,
      priceFrom,
      priceTo,
      country,
      language,
      resultsLimit,
      location,
      checkIn,
      checkOut,
      adults,
      children
    ),

  /**
   * Get hotel info from Hotels.com
   * @async
   * @param {String} link - Link to the hotel page;
   * @param {Number} reviewsLimit - parameter defines the reviews amount you want to get. Must be a number or `Infinity`. Default - 10;
   * @return {Object} An object with hotel information.
   */
  getHotelInfo: async (link, reviewsLimit) => getHotelsComHotelInfo(hotelsCom.timeMultiplier, link, reviewsLimit),

  /**
   * Get available Hotels.com filters and locales
   * @return {Object} An object with filters and currencies.
   */
  getFilters: () => getHotelsComFilters(),
};

/**
 * Save data to `.json` file
 * @param {Array | Object} data - Parsed darta;
 * @param {String} filename - Name of the `.json` file with results. Default - "parsed_results";
 */
export const saveToJSON = (data, filename) => {
  save(data, filename);
};
