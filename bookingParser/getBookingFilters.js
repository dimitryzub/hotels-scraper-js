import currencies from "../bookingParser/currencies.js";
import filters from "../bookingParser/filters.js";

const getBookingFilters = () => {
  return { currencies, filters };
};

export default getBookingFilters;
