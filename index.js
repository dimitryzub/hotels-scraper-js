import getAirbnbFilters from "./airbnbParser/getAirbnbFilters.js";
import getAirbnbHotels from "./airbnbParser/getAirbnbHotels.js";
import getAirbnbHotelInfo from "./airbnbParser/getHotelInfo.js";
import save from "./helpers/fileSaver.js";

export const airbnb = {
  timeMultiplier: 1,

  getHotels: (category, currency, resultsLimit) => getAirbnbHotels(airbnb.timeMultiplier, category, currency, resultsLimit),

  getHotelInfo: (link, currency, reviewsLimit) => getAirbnbHotelInfo(airbnb.timeMultiplier, link, currency, reviewsLimit),

  getFilters: getAirbnbFilters,
};

export const saveToJSON = (data, path, filename) => {
  save(data, path, filename);
};
