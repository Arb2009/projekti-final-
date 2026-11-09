# Explore Kosovo

A responsive, map-led tourism guide built with HTML, CSS, vanilla JavaScript, Leaflet, and OpenStreetMap. The app includes 17 hand-curated destination coordinates, location search, category filters, browser-saved favourites, live nearby listings, Wikimedia Commons photographs with visible credits, and visitor reviews persisted by the included backend.

## Run in Visual Studio Code

1. Install Node.js 20 or newer.
2. Open the `explore-kosovo` folder in Visual Studio Code.
3. Open a terminal in the `backend` folder and run `npm install` once.
4. Start the website and API with `npm start` (or `npm run dev` while developing).
5. Open <http://localhost:3000>.

The API writes visitor-submitted reviews to `backend/reviews.json`; these are not independently verified. To curate source-linked entries manually, edit the array in `data/manual-reviews.js`; those entries display separately and do not affect visitor ratings. The `destinationId` must match an ID in `js/destinations.js`. Only republish review text you have permission to use; otherwise add your own summary and link to the source. A few fictional demonstration examples appear in a separate, clearly labelled section for Rugova Canyon, Prizren, and Mirusha Waterfalls. They are UI examples only, are not stored by the API, and do not affect visitor ratings. The deployed service should add moderation, rate limiting, and backups before accepting public submissions.

Manual entry format (add objects to the exported array):

```js
export const manualReviews = [
  {
    "destinationId": "rugova-canyon",
    "name": "Reviewer name or attribution",
    "rating": 5,
    "text": "A short review or summary you have permission to publish.",
    "source": "Google Maps",
    "sourceUrl": "https://maps.google.com/",
    "date": "2026-11-09"
  },
];
```

## Data and attribution

- Leaflet and OpenStreetMap provide the map. Map tiles and the Overpass API require an internet connection and are subject to their providers' usage policies. Overpass listings can be incomplete or temporarily unavailable.
- Place search uses Nominatim. Follow the [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/), including its request-rate and attribution requirements.
- Destination photographs are searched dynamically through the Wikimedia Commons API. The photo credit links to its Commons file page; image availability varies. Check the file page for the individual license and reuse conditions.
- Coordinates and short destination descriptions are curated in `js/destinations.js`. They are informational and should be checked against current local access guidance, especially for protected cultural sites.
- Favourites are stored in the visitor's browser. Reviews are stored in the JSON-file-backed database on the server.

## Project layout

```text
explore-kosovo/
  index.html
  css/style.css
  js/app.js
  js/map.js
  js/destinations.js
  js/reviews.js
  data/manual-reviews.js
  backend/package.json
  backend/server.js
  backend/reviews.json   (created when the API first accepts a review)
```