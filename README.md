# 🏨Hotels Scraper

Parser for [Airbnb](https://www.airbnb.com/), [Booking](https://www.booking.com/) (soon), [Hotels.com](https://hotels.com/)(soon) in JavaScript. Sponsored by SerpApi. [SerpApi](https://serpapi.com/).

Currently supports:

- Airbnb;
- other engines soon.

## Install

Add `hotels-scraper-js` to your project dependency:

```bash
npm i hotels-scraper-js
```

## In code usage

Import `airbnb` to your file:

```javascript
import { airbnb } from "hotels-scraper-js";

airbnb.getHotels().then(console.log);
```

`airbnb` available methods:

```javascript
getHotels([category[, currency[, resultsLimit]]])
getHotelInfo(link[, currency[, reviewsLimit]])
getFilters()
```

- `category` - category code. You can get all available categories with their codes from `getFilters()` method;
- `currency` - currency code. You can get all available currencies with their codes from `getFilters()` method;
- `resultsLimit` - parameter defines the results amount you want to get. Must be a number or `Infinity` (use it if you want to get all results in the selected category);
- `reviewsLimit` - parameter defines the reviews amount you want to get. Must be a number or `Infinity` (use it if you want to get all reviews).

## Save results to JSON

Import `airbnb`, `saveToJSON` to your file:

```javascript
import { airbnb, saveToJSON } from "hotels-scraper-js";

airbnb.getHotels().then((hotels) => saveToJSON(hotels, "path-to-save", "filename"));
```

`saveToJSON` arguments:

```javascript
saveToJSON(data, path, filename);
```

- `data` - scraped results;
- `path` - absolute path to save results (📌Note: directory for save must be exist);
- `filename` - name of saving file.

## Results example

Hotels results:

```json
[
  {
    "thumbnail": "https://a0.muscache.com/im/pictures/10833886/1edf8559_original.jpg?im_w=720",
    "title": "Hvar, Croatia",
    "distance": "Sea and harbor views",
    "dates": "Jul 23 – 30",
    "price": { "currency": "$", "value": 304 },
    "rating": 4.82,
    "link": "https://www.airbnb.com/rooms/735683?adults=1&category_tag=Tag%3A8536&children=0&infants=0&pets=0&search_mode=flex_destinations_search&check_in=2023-07-23&check_out=2023-07-30&previous_page_section_name=1000&federated_search_id=2998a5b1-9934-4d5d-a721-4a1065c45ca6"
  },
  ... and other hotels
]
```

Hotel info result:

```json
{
  "name": "The Black A-Frame",
  "shortDescription": "Entire cabin hosted by Liga",
  "shortOverview": ["3 guests", "1 bedroom", "2 beds", "1 bath"],
  "highlights": [
    { "title": "Self check-in", "subtitle": "Check yourself in with the lockbox." },
    ... and other highlights
  ],
  "price": { "currency": "$", "perNight": 136, "cleaningFee": 32, "airbnbFee": 121 },
  "description": "Amazing and stylish A-frame house at the edge of the forest and at the bend of Peterupe river. Located 40km from Riga and 8km from Saulkrasti. Perfect place for your city escape.The spaceThe Black A-frame is located 10 min drive from the seaside and 10 min walk from Pabaži Lake. This place is quiet and very comfortable. Outside there is a terrace where you can enjoy magical forest view and bird songs. There is a small river next to house. House can accommodate up to three guests as we have one double bed in Loft and in living room we have sofa bed, so there is extra place to sleep if you have children with you. We are dog friendly, so bring your dog along with you on your visit. Pet fee 10 eur.We have hot tub near house and if you want, you can rent it for extra charge 60 eur.In our house there is only wood stove heating, you will be able to feel the countryside authenticity. Especially when the sun is down in the breezy nighttime the wood stove will warm you and your hearts. If you have no experience in wood stove heating, you’ll find instructions in our lovely cabin! Don’t forget to fire up wood stove first thing in the morning, because if cold outside, in the morning it might be chilly inside.If you desire - give us notice, at what time we should expect your arrival, so we can pre-heat house before you get here and after you have arrived you can continue heating the house yourself!If you have small children, please note that there is a porch with no railings and a river close to house. Please don't leave your kids without supervision and be responsible parents.",
  "sleepOptions": [
    { "room": "Bedroom", "bed": "1 double bed" },
    { "room": "Living room", "bed": "1 sofa bed" }
  ],
  "location": "Sēja, Latvia",
  "host": {
    "name": "Liga",
    "joined": "Joined in September 2018",
    "overview": ["604 Reviews", "Identity verified", "Superhost"],
    "responseInfo": { "responseRate": "100%", "responseTime": "within an hour" }
  },
  "link": "https://www.airbnb.com/rooms/43105686?adults=1&category_tag=Tag%3A8148&children=0&infants=0&pets=0&search_mode=flex_destinations_search&check_in=2023-04-16&check_out=2023-04-21&federated_search_id=c9f831f8-d4e6-43c1-b8eb-07e918081d52&source_impression_id=p3_1677412473_UOkZOXx5wDjAXVhD",
  "placeOffers": [
    "River view",
    "Hair dryer",
    "Shampoo",
    ... and other place offers
  ],
  "houseRules": [
    "3 guests maximum",
    "Pets allowed",
    "Check-in after 3:00 PM",
    ... and other house rules
  ],
  "safetyAndProperty": [
    "Pool/hot tub without a gate or lock",
    "Heights without rails or protection",
    ... and other safety & property
  ],
  "photos": [
    "https://a0.muscache.com/im/pictures/8dec2f7c-1c3e-402e-baea-4fd72af59621.jpg?aki_policy=large",
    "https://a0.muscache.com/im/pictures/1c1c4008-d617-4e9f-b5e3-aa38bc8c5c9a.jpg?aki_policy=large",
    ... and other photos
  ],
  "reviewsInfo": {
    "rating": 4.97,
    "totalReviews": 433,
    "reviews": [
      {
        "name": "Yana",
        "avatar": "https://a0.muscache.com/im/pictures/user/d9e91b91-c2fb-42d2-929d-02676dbc2b5a.jpg?im_w=240",
        "userPage": "https://www.airbnb.com/users/show/501742751",
        "date": "February 2023",
        "review": "This is a super cosy place. The view from the cabin on the river is breathtaking! We really liked the location. The host is very friendly and helpful. There was a power outage in the area, but the host immediately contacted the power crew to fix it, so we were able to spend the rest of our time enjoying all the house features. The wood stove is something amazing! The cabin is not big, but very stylish, cosy and comfortable.  I will definitely recommend this place!"
      },
    ... and other reviews
    ]
  }
}

```
