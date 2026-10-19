# CAB India

A cab booking demo for India built with Next.js 16 (App Router), React 19, Chakra UI 3 and Leaflet.

- Search pickup and drop locations across India (OpenStreetMap Nominatim, India-only results)
- Use your current location as pickup, swap or clear locations
- Real driving route, distance and travel time (OSRM) drawn on the map
- Fare estimates for Micro, Hatchback, Sedan, SUV and MPV, with a booking confirmation
- Responsive layout for desktop and mobile

## Getting started

Requires Node.js 24 (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Run `npm run lint` to lint.

## Deploying on Vercel

`package.json` pins `"engines": { "node": "24.x" }`, which Vercel uses instead of the Node.js version in Project Settings.

## Project structure

```
src/app
├── home/            Booking page (search, map, fares)
├── about/, contact/ Static pages
├── components/      Header, footer, splash screen, location input, map, cab list
└── lib/             Geocoding, routing, fare and formatting helpers
```

Fare rates live in `src/app/lib/fares.js`. Booking is a front-end demo; no rides are dispatched.
