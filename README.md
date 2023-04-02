<div align="center">
<p>Special thanks to sponsor:</p>
<div>
   <img src="https://sindresorhus.com/assets/thanks/serpapi-logo-light.svg" width="140" alt="SerpApi">
</div>
<a href="https://serpapi.com">
	<b>API to get search engine results with ease.</b>
</a>
</div>

# 🏨Hotels Scraper

Parser for website hotels, all from the single package, in JavaScript. Sponsored by [SerpApi](https://serpapi.com/).

Currently supports:

- [Airbnb](https://www.airbnb.com/)
- [Booking](https://www.booking.com/)
- [Hotels.com](https://hotels.com/)

## Install

Add `hotels-scraper-js` to your project dependency:

```bash
npm i hotels-scraper-js
```

## In code usage

📌Note: Only [ES modules](https://nodejs.org/api/esm.html) `import` statement is available.

Import `airbnb`, and/or `booking`, and/or `hotelsCom` to your file:

```javascript
import { airbnb, booking, hotelsCom } from "hotels-scraper-js";

airbnb.getHotels().then(console.log);
booking.getHotels().then(console.log);
hotelsCom.getHotels().then(console.log);
```

`airbnb` available methods:

```javascript
getHotels([category[, currency[, resultsLimit[, location[, checkIn[, checkOut[, adults[, children]]]]]]]])
getHotelInfo(link[, currency[, reviewsLimit]])
getFilters()
```

<details>
<summary>Full parameters list</summary>

- `category` - category code. You can get all available categories with their codes from `getFilters()` method. You can use both "name" or "value";
- `currency` - currency code. You can get all available currencies with their codes from `getFilters()` method. You can use both "name" or "value" ;
- `resultsLimit` - parameter defines the results amount you want to get. Must be a number or `Infinity` (use it if you want to get all results in the selected category). Default - 20;
- `location` - parameter defines the location of hotels to search;
- `checkIn` - parameter defines the check-in date. Format - "12/31/2023";
- `checkOut` - parameter defines the check-out date. Format - "12/31/2023";
- `adults` - parameter defines the number of adult guests;
- `children` - parameter defines the number of child guests;
- `reviewsLimit` - parameter defines the reviews amount you want to get. Must be a number or `Infinity` (use it if you want to get all reviews). Default - 10.

</details>

`booking` available methods:

```javascript
getHotels([filters[, currency[, resultsLimit[, location[, checkIn[, checkOut[, adults[, children[, [rooms]]]]]]]]]])
getHotelInfo(link[, reviewsLimit])
getFilters()
```

<details>
<summary>Full parameters list</summary>

- `filters` - an array with filter codes. You can get all available filters with their codes from `getFilters()` method. You can use both "name" or "value";
- `currency` - currency code. You can get all available currencies with their codes from `getFilters()` method. You can use both "name" or "value". Default - "USD";
- `resultsLimit` - parameter defines the results amount you want to get. Must be a number or `Infinity` (use it if you want to get all results in the selected category). Default - 35;
- `location` - location of hotels to search. Default - "Paris";
- `checkIn` - check-in date. Format - "12/31/2023", Default - today;
- `checkOut` - check-in date. Format - "12/31/2023", Default - tomorrow;
- `adults` - number of adult guests. Default - 2;
- `children` - number of child guests. Default - 0;
- `rooms` - number of rooms needed. Default - 1;
- `travelPurpose` - travel purpouse. Available "leisure" or "business". Default - "leisure";
- `reviewsLimit` - parameter defines the reviews amount you want to get. Must be a number or `Infinity` (use it if you want to get all reviews). Default - 10.

</details>

`hotelsCom` available methods:

```javascript
getHotels([filters[, currency[, resultsLimit[, location[, checkIn[, checkOut[, adults[, children[, [rooms]]]]]]]]]])
getHotelInfo(link[, reviewsLimit])
getFilters()
```

<details>
<summary>Full parameters list</summary>

- `filters` - an array with filter codes. You can get all available filters with their codes from `getFilters()` method. You can use both "name" or "value";
- `priceFrom` - min price filter. On Hotels.com available 10 price steps. `priceFrom` value will be round to the nearest lower step value;
- `priceTo` - max price filter. On Hotels.com available 10 price steps. `priceTo` value will be round to the nearest higher step value;
- `country` - country name. You can get all available countries with their currencies and languages (if provided) from `getFilters().locales` method;
- `language` - interface language. You can change language only if the selected `country` has several languages;
- `resultsLimit` - parameter defines the results amount you want to get. Must be a number or `Infinity` (use it if you want to get all results in the selected category). Default - 35;
- `location` - location of hotels to search. Default - "Paris";
- `checkIn` - check-in date. Format - "12/31/2023", Default - today;
- `checkOut` - check-in date. Format - "12/31/2023", Default - tomorrow;
- `adults` - number of adult guests. Default - 2;
- `children` - number of child guests. Default - 0;
- `reviewsLimit` - parameter defines the reviews amount you want to get. Must be a number or `Infinity` (use it if you want to get all reviews). Default - 10.

</details>

## Save results to JSON

Import `saveToJSON` to your file:

```javascript
import { airbnb, saveToJSON } from "hotels-scraper-js";

airbnb.getHotels().then(saveToJSON);
```

`saveToJSON` arguments:

```javascript
saveToJSON(data, filename);
```

- `data` - scraped results;
- `filename` - name of the saving file. Use only a filename, because an extension is always `.json`. Default - "parsed_results".

## If you have a slow Internet connection

You can multiplicate waiting time for loading information by set `timeMultiplier` before starting the parser:

```javascript
import { airbnb, booking, hotelsCom } from "hotels-scraper-js";

airbnb.timeMultiplier = 2; // double Airbnb load times
booking.timeMultiplier = 2; // double Booking load times
hotelsCom.timeMultiplier = 2; // double Hotels.com load times

airbnb.getHotels().then(console.log);
booking.getHotels().then(console.log);
hotelsCom.getHotels().then(console.log);
```

## Results example

<details>
<summary>Hotels results</summary>

**Airbnb results**

```json
[
  {
    "thumbnail":"https://a0.muscache.com/im/pictures/9ca40aba-5b1a-4a90-9de6-a51a75d74e8d.jpg?im_w=720",
    "title":"Private room in Courbevoie",
    "subtitles":[
        "Courbevoie—Verdun room near La Défense",
        "1 double bed"
    ],
    "dates":"03/10/2023 - 03/13/2023",
    "price":{
        "currency":"$",
        "value":46,
        "period":"night"
    },
    "rating":4.8,
    "link":"https://www.airbnb.com/rooms/28935929"
  },
  ... and other hotels
]
```

**Booking results**

```json
[
  {
    "thumbnail":"https://cf.bstatic.com/xdata/images/hotel/square200/76073434.webp?k=bb74dd88f738df22dc8f756b92f92477da8ed945300449c8c14bc31ca1d56bd2&o=&s=1",
    "title":"Apollon MontparnasseOpens in new window",
    "stars":3,
    "preferredBadge":true,
    "promotedBadge":false,
    "location":"14th arr., Paris",
    "subwayAccess":true,
    "sustainability":"Travel Sustainable property",
    "distanceFromCenter":3.5,
    "highlights":[
        "Standard Double Room",
        "1 full bed",
        "Only 5 rooms left at this price on our site"
    ],
    "price":{
        "currency":"US$",
        "value":70,
        "taxesAndCharges":4
    },
    "rating":{
        "score":8,
        "scoreDescription":"Very Good",
        "reviews":1
    },
    "link":"https://www.booking.com/hotel/fr/apollon-montparnasse.html?aid=304142&label=gen173nr-1FCAQoggJCDHNlYXJjaF9wYXJpc0gxWARo6QGIAQGYATG4ARfIAQzYAQHoAQH4AQOIAgGoAgO4Aq3Kk6AGwAIB0gIkOWJlN2NmYTUtNjU0MS00ODhjLWJlYmMtMTE0NjRjNmE4Mzdh2AIF4AIB&ucfs=1&arphpl=1&checkin=2023-03-05&checkout=2023-03-06&group_adults=2&req_adults=2&no_rooms=1&group_children=0&req_children=0&hpos=15&hapos=15&sr_order=popularity&srpvid=39e084d62f6804da&srepoch=1678042414&all_sr_blocks=189619302_92687463_0_2_0&highlighted_blocks=189619302_92687463_0_2_0&matching_block_id=189619302_92687463_0_2_0&sr_pri_blocks=189619302_92687463_0_2_0__6600&from_sustainable_property_sr=1&from=searchresults#hotelTmpl"
  },
  ... and other hotels
]
```

**Hotels.com results**

```json
[
   {
      "title":"Hotel 10 Opera",
      "isAd":true,
      "location":"Paris",
      "snippet":{
         "title":"3* hotel located near the Opera",
         "text":"In the heart of the 9th district: customized offers according to the length of stay, flexibility & reinforced sanitary measures."
      },
      "paymentOptions":[
         "Fully refundable",
         "Reserve now, pay later"
      ],
      "highlightedAmenities":[
          "Hot tub"
      ],
      "price":{
         "currency":"$",
         "value":193,
         "withTaxesAndCharges":216
      },
      "rating":{
         "score":8.8,
         "reviews":35
      },
      "link":"https://www.hotels.com/ho282954/hotel-10-opera-paris-france/"
   },
  ... and other hotels
]
```

</details>

<details>
<summary>Hotel info result</summary>

**Airbnb results**

```json
{
  "name": "The Black A-Frame",
  "shortDescription": "Entire cabin hosted by Liga",
  "shortOverview": ["3 guests", "1 bedroom", "2 beds", "1 bath"],
  "highlights": [
    { "title": "Self check-in", "subtitle": "Check yourself in with the lockbox." },
    ... and other highlights
  ],
  "price": { "currency": "$", "perNight": 136 },
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

**Booking results**

```json
{
   "title":"The Renwick",
   "type":"Hotel",
   "stars":4,
   "preferredBadge":true,
   "subwayAccess":true,
   "sustainability":"Travel Sustainable property",
   "address":"118 East 40th Street, Murray Hill, New York, NY 10016, United States of America",
   "highlights":[
      "Pet friendly",
      "Free WiFi",
      "Air conditioning",
      ... and other highlights
   ],
   "shortDescription":"Stay in the heart of New York\n\n–\n\nExcellent location – show map",
   "description":"You're eligible for a Genius discount at The Renwick! To save at this property, all you have to do is sign in.\n""+""Featuring free WiFi, The Renwick offers luxury residential-style accommodations in Midtown Manhattan, 400 m from Bryant Park.\n""+""Every art-inspired room at this historic hotel includes a flat-screen TV. Each room has a private bathroom with free toiletries and a hairdryer.\n""+""There is a 24-hour front desk, fitness center and business center at The Renwick.\n""+""Grand Central Terminal is 271 m from The Renwick, while Empire State Building is 901 m away. The nearest airport is La Guardia Airport, 5.6 mi from the property.",
   "descriptionHighlight":"Families in particular like the location – they rated it 9.5 for a stay with kids.",
   "descriptionSummary":"The Renwick has been welcoming Booking.com guests since Jun 25, 2006\n""+""\n""+""Hotel chain/brand:\n""+""Rebel Hotel Company",
   "facilities":[
      "Non-smoking rooms",
      "Fitness center",
      "Facilities for disabled guests",
      ... and other facilities
   ],
   "areaInfo":[
      {
         "What's nearby":[
            {
               "place":"Chrysler Building",
               "distance":"200 m"
            },
            {
               "place":"Morgan Library & Museum",
               "distance":"400 m"
            },
          ... and other "What's nearby" results
         ]
      },
      ... and other aria info
   ],
   "link":"https://www.booking.com/hotel/us/the-renwick.html?aid=304142&label=gen173nr-1FCAQoggJCD3NlYXJjaF9uZXcgeW9ya0gxWARo6QGIAQGYATG4ARfIAQzYAQHoAQH4AQOIAgGoAgO4AsDdkqAGwAIB0gIkZWZjNzg1ZjQtOTQ4OS00MTk2LWFhNTctZDBhNjY0ODNlMjBk2AIF4AIB&sid=8a3276de1a926aa7e34f278dfb7fc6a2&age=0&age=0&all_sr_blocks=5602126_351661370_4_0_0%2C5602123_351661370_2_0_0&checkin=2023-07-30&checkout=2023-08-12&dist=0&group_adults=4&group_children=2&hapos=100&highlighted_blocks=5602126_351661370_4_0_0%2C5602123_351661370_2_0_0&hpos=25&matching_block_id=5602126_351661370_4_0_0&no_rooms=2&req_adults=4&req_age=0&req_age=0&req_children=2&room1=A%2CA%2C0&room2=A%2CA%2C0&sb_price_type=total&sr_order=popularity&sr_pri_blocks=5602126_351661370_4_0_0__418795%2C5602123_351661370_2_0_0__338895&srepoch=1678028492&srpvid=526669a055bb0322&type=total&ucfs=1&activeTab=main#tab-main",
   "photos":[
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/62412250.jpg?k=7389247a6dbefb943abdb9c9e9e4bc29f4dbd0e38b07e4bf0e3483632c14ec58&o=&hp=1",
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/62412277.jpg?k=efff09d78f321bf902267f8d939921ec4fbb3bb81c78167dd6e3c5696181df4f&o=&hp=1",
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/53916939.jpg?k=a05597263a68862bbe161d19611ba40ab54c27dbbb887d1747a503f0c04a6e12&o=&hp=1",
    ... and other photos
   ],
   "reviewsInfo":{
      "score":8.2,
      "scoreDescription":"Rated very good",
      "totalReviews":1,
      "categoriesRating":[
         {
            "Staff":8.8
         },
         {
            "Facilities":7.9
         },
        ... and other categories
      ],
      "reviews":[
         {
            "name":"Jack",
            "avatar":"https://cf.bstatic.com/static/img/review/avatars/ava-j/f69a0f45af414641ac0371c1f139c49637969c6c.png",
            "country":"United Kingdom",
            "date":"Reviewed: October 9, 2022",
            "reting":"10",
            "review":[
               {
                  "liked":"We spent so much time reviewing hotels for our first trip to New York and were so pleased with choosing The Renwick. Upon arrival, the lady at reception was so friendly, bubbly and welcoming. In general, the staff were great and were super knowledgeable and always willing to support and ensure we were okay and comfortable. Additionally, the housekeeping were brilliant and ensured our room was sparkling clean everyday and with fresh towels. As for the room, we were on the 17th floor, it was nicely decorated, spacious,
great shower/pressure and the bed super comfortable. The Wi-Fi was also excellent. We always looked forward to returning after a long day exploring the streets of amazing New York City!\n""+""If I had to pick one little negative, we were checked out by a different lady at reception and she wasn't so friendly. Oh well, no biggie.\n""+""When we return to New York we will be returning to this hotel."
               }
            ],
            "hotelResponse":"Thank you for sharing this wonderful review, Jack!\n""+""We are very pleased to hear that you had an enjoyable experience at The Renwick Hotel and loved our spacious, clean accommodations and housekeeping services! We appreciate your praise for our team; they work very hard to ensure every guest feels right at home. We are delighted you felt welcomed and valued during your time with us!\n""+""We'd love to share another positive experience with you in the future!"
         },
        ... and other reviews
      ]
   }
}
```

**Hotels.com results**

```json
{
   "title":"Four Seasons Resort Oahu at Ko Olina",
   "stars":5,
   "shortDescription":"Kapolei beachfront resort with 4 restaurants and spa",
   "address":"92-1001 Olani Street, Kapolei, HI, 96707",
   "description":"At Four Seasons Resort Oahu at Ko Olina, you can hit the beach to retreat to a cabana or enjoy the shade from a beach umbrella, plus activities like scuba diving and snorkeling are nearby. 4 outdoor pools provide fun for everyone, while guests in the mood for pampering can visit the spa to indulge in massages, body wraps, and mani/pedis. Dining choices include 4 restaurants and the bar/lounge is a great place to grab a cold drink. A free kid's club, a poolside bar, and a health club are other highlights at this luxurious resort. Fellow travelers say good things about the pool and helpful staff.",
   "languages":"Chinese (Mandarin), English, Japanese, Korean, Spanish",
   "roomOptions":[
      "Room, 2 Double Beds, Partial Ocean View",
      "Room, Accessible, Partial Ocean View",
      "Suite, 1 Bedroom, Ocean View",
      ... and other room options
   ],
   "areaInfo":[
      {
         "What's nearby":[
            {
               "place":"Pearl Harbor",
               "distance":"22 min drive"
            },
           ... and other nearby places
         ]
      },
      {
         "Getting around":[
            {
               "place":"Kapolei, HI (JRF-Kalaeloa)",
               "distance":"15 min drive"
            },
          ... and other around places
         ]
      },
      {
         "Restaurants":[
            {
               "place":"Island Country Markets at Ko Olina",
               "distance":"4 min walk"
            },
          ... and other restaurants
         ]
      }
   ],
   "CleaningAndSafety":[
      {
         "Enhanced cleanliness measures":[
            "Disinfectant is used to clean the property",
            "High-touch surfaces are cleaned and disinfected",
            "Sheets and towels are washed at 60°C/140°F or hotter",
            "Follows standard cleaning and disinfection practices of Lead with Care (Four Seasons)"
         ]
      },
    ... and other cleaning and safety features
   ],
   "atAGlance":[
      {
         "Hotel size":[
            "370 units",
            "Arranged over 16 floors"
         ]
      },
      ... and other amenities
   ],
   "propertyAmenities":[
      {
         "Food and drink":[
            "Buffet breakfast (surcharge) each morning 6:00 AM–11:00 AM",
            "4 restaurants",
            "Bar/lounge",
            "Poolside bar",
            "Coffee shop",
            "Coffee/tea in a common area",
            "24-hour room service",
            "Snack bar/deli"
         ]
      },
       ... and other property amenities
   ],
   "roomAmenities":[
      {
         "Be entertained":[
            "DVD player",
            "65-inch flat-screen TV",
            "Cable TV channels",
            "Pay movies"
         ]
      },
    ... and other room amenities
   ],
   "specialFeatures":[
      {
         "Spa":[
            "Guests can indulge in a pampering treatment at the resort's full-service spa. Services include facials, body wraps, body scrubs, and body treatments. The spa is open daily."
         ]
      }
   ],
   "feesAndPolicies":[
      {
         "Optional extras":[
            "Wired Internet access is available in public areas for USD 22 per stay (rates may vary)",
            "Buffet breakfast is offered for an extra charge of approximately USD 15–75 for adults, and USD 15–75 for children",
            "Airport shuttle service is offered for an extra charge of USD 340.00 per vehicle (one-way)",
            "Late check-out can be arranged for an extra charge (subject to availability)"
         ]
      },
      ... and other fees and policies
   ],
   "link":"https://www.hotels.com/ho161915/four-seasons-resort-oahu-at-ko-olina-kapolei-united-states-of-america/",
   "photos":[
      "https://images.trvl-media.com/lodging/1000000/10000/7000/6910/ad8af703.jpg?impolicy=resizecrop&rw=1200&ra=fit",
      "https://images.trvl-media.com/lodging/1000000/10000/7000/6910/45b7af11.jpg?impolicy=resizecrop&rw=1200&ra=fit",
      "https://images.trvl-media.com/lodging/1000000/10000/7000/6910/f1e44ee8.jpg?impolicy=resizecrop&rw=1200&ra=fit",
      ... and other photos
   ],
   "reviewsInfo":{
      "score":9.4,
      "scoreDescription":"Exceptional",
      "totalReviews":548,
      "categoriesRating":[
         {
            "Cleanliness":9.6
         },
         {
            "Staff & service":9.5
         },
         {
            "Amenities":9.4
         },
         {
            "Property conditions & facilities":9.5
         },
         {
            "Eco-friendliness":9.1
         }
      ],
      "reviews":[
         {
            "date":"Mar 2, 2023",
            "reting":10,
            "review":"Beautiful property and awesome service"
         },
        ... and other reviews
      ]
   }
}
```

</details>

## Known problems

- if you can't open any sites from this parser in your browser (probably your IP address is blocked) you can't get a results from this parser;
- sometimes Hotels.com does not load the place input field (which happens in the usual browser too), so it can crash. You need to wait time;
- parsed sites often change their structure or selectors, so from time to time one of the scraping fields can't be gotten (sometimes the parser can crash). Please [open an issue](https://github.com/dimitryzub/hotels-scraper-js/issues/new) with your problem.
