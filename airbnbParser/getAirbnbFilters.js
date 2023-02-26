import currencies from "./currencies.js";
import categories from "./categories.js";

const getAirbnbFilters = () => {
  return { currencies, categories };
};

export default getAirbnbFilters;
