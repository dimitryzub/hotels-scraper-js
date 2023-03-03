import getAirbnbFilters from "./airbnbParser/getAirbnbFilters.js";
import getAirbnbHotels from "./airbnbParser/getAirbnbHotels.js";
import getAirbnbHotelInfo from "./airbnbParser/getHotelInfo.js";
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

/**
 * Save data to `.json` file
 * @param {Array | Object} data - Parsed darta;
 * @param {String} filename - Name of the `.json` file with results. Default - "Airbnb results";
 */
export const saveToJSON = (data, filename) => {
  save(data, filename);
};
