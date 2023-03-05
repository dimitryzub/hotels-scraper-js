import { airbnb, booking } from "./index.js";

booking
  .getHotels()
  // booking
  //   .getHotelInfo(
  //     "https://www.booking.com/hotel/us/the-renwick.html?aid=304142&label=gen173nr-1FCAQoggJCD3NlYXJjaF9uZXcgeW9ya0gxWARo6QGIAQGYATG4ARfIAQzYAQHoAQH4AQOIAgGoAgO4AsDdkqAGwAIB0gIkZWZjNzg1ZjQtOTQ4OS00MTk2LWFhNTctZDBhNjY0ODNlMjBk2AIF4AIB&sid=8a3276de1a926aa7e34f278dfb7fc6a2&age=0&age=0&all_sr_blocks=5602126_351661370_4_0_0%2C5602123_351661370_2_0_0&checkin=2023-07-30&checkout=2023-08-12&dist=0&group_adults=4&group_children=2&hapos=100&highlighted_blocks=5602126_351661370_4_0_0%2C5602123_351661370_2_0_0&hpos=25&matching_block_id=5602126_351661370_4_0_0&no_rooms=2&req_adults=4&req_age=0&req_age=0&req_children=2&room1=A%2CA%2C0&room2=A%2CA%2C0&sb_price_type=total&sr_order=popularity&sr_pri_blocks=5602126_351661370_4_0_0__418795%2C5602123_351661370_2_0_0__338895&srepoch=1678028492&srpvid=526669a055bb0322&type=total&ucfs=1&activeTab=main#tab-main"
  //   )
  .then((result) => console.dir(result, { depth: null }));
// booking.getFilters();
