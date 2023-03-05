import moment from "moment/moment.js";
import getAirbnbFilters from "./airbnbParser/getAirbnbFilters.js";
import getAirbnbHotels from "./airbnbParser/getAirbnbHotels.js";
import getAirbnbHotelInfo from "./airbnbParser/getHotelInfo.js";
import getBookingFilters from "./bookingParser/getBookingFilters.js";
import getBookingHotelInfo from "./bookingParser/getBookingHotelInfo.js";
import getBookingHotels from "./bookingParser/getBookingHotels.js";
import save from "./helpers/fileSaver.js";

export const airbnb = {
  timeMultiplier: 1,

  /**
   * Get hotels list from Airbnb
   * @async
   * @param {String} category - Category code. You can use both "name" or "value" from `getFilters().categories`;
   * @param {String} currency - Currency code. You can use both "name" or "value" from `getFilters().currencies`;
   * @param {Number} resultsLimit - parameter defines the results amount you want to get. Must be a number or `Infinity`. Default - 20;
   * @return {Array.<object>} An array with hotels results.
   */
  getHotels: async (category, currency, resultsLimit) => getAirbnbHotels(airbnb.timeMultiplier, category, currency, resultsLimit),

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

  _defaultSearchParams: {
    currency: "USD",
    resultsLimit: 35,
    location: "paris",
    checkIn: moment().format("YYYY-MM-DD"),
    checkOut: moment().add(1, "d").format("YYYY-MM-DD"),
    adults: 2,
    children: 0,
    rooms: 1,
    travelPurpose: "leisure",
  },

  /**
   * Get hotels list from Booking
   * @async
   * @param {{
   * filters: Array<String>
   * currency: String,
   * resultsLimit: Number,
   * location: String,
   * checkIn: String,
   * checkOut: String,
   * adults: Number,
   * children: Number,
   * rooms: Number,
   * travelPurpose: String,
   * }} searchParams - search parameters;
   * @return {Array.<Object>} An array with hotels results.
   */
  getHotels: async (searchParams) => getBookingHotels(booking.timeMultiplier, { ...booking._defaultSearchParams, ...searchParams }),

  /**
   * Get hotel info from Booking
   * @async
   * @param {String} link - Link to the hotel page;
   * @param {Number} reviewsLimit - parameter defines the reviews amount you want to get. Must be a number or `Infinity`. Default - 10;
   * @return {Object} An object with hotel information.
   */
  getHotelInfo: async (link, reviewsLimit) => getBookingHotelInfo(airbnb.timeMultiplier, link, reviewsLimit),

  /**
   * Get available Booking filters and currencies
   * @return {Object} An object with filters and currencies.
   */
  getFilters: () => getBookingFilters(),
};

/**
 * Save data to `.json` file
 * @param {Array | Object} data - Parsed darta;
 * @param {String} filename - Name of the `.json` file with results. Default - "Airbnb results";
 */
export const saveToJSON = (data, filename) => {
  save(data, filename);
};
