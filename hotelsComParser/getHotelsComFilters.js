import locales from "./locales.js";
import filters from "./filters.js";

const getHotelsComFilters = (isFull) => {
  if (!isFull) locales.forEach((el) => delete el.code);
  return { locales, filters };
};

export default getHotelsComFilters;
