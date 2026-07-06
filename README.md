# Weather Hub

A polished, animated weather dashboard built with React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion, Zustand, and Recharts.

No API key required — weather, forecast, and air-quality data come from [Open-Meteo](https://open-meteo.com/), a free public API.

## Features

- **Live search** with debounced city autocomplete (Open-Meteo geocoding)
- **Dashboard** — current conditions, feels-like, humidity, UV index, wind, pressure, precipitation chance, sunrise/sunset, high/low
- **Forecast** page — 24-hour scrollable timeline, animated temperature-trend and rain-probability charts, 7-day outlook
- **Air Quality** page — US AQI gauge plus PM2.5, PM10, ozone, NO2, SO2 breakdown
- **Favorites** — save/remove/quick-switch cities, persisted locally
- **Settings** — light/dark theme, C/F, km/h vs mph, hPa vs inHg, and a reduce-motion toggle
- **Dynamic sky theme** — the entire background gradient, particle effects (rain/snow/stars/lightning), and accent color shift based on the real current weather condition and time of day
- **Animated custom SVG weather icons** (sun, moon, clouds, rain, snow, storm, fog)
- Respects `prefers-reduced-motion` and includes an in-app toggle for the same
- Fully responsive: sidebar nav on desktop, bottom nav on mobile

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. No `.env` or API key needed.

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/        Layout, SearchBar, WeatherCard, Background, Skeletons, ErrorState
  components/icons/  Animated SVG weather icons
  hooks/             useWeather - fetches forecast + air quality for the selected city
  lib/               api.ts (Open-Meteo client), weatherCodes.ts, format.ts (unit conversions)
  pages/             Dashboard, Forecast, AirQuality, Favorites, Settings
  store/             useStore.ts - Zustand store (theme, units, favorites, current location)
```

## Notes

- Data source: Open-Meteo Forecast API, Air Quality API, and Geocoding API (all free, no key, generous rate limits for personal projects).
- To switch providers (e.g. OpenWeatherMap), only `src/lib/api.ts` needs to change - every page consumes data through the `useWeather` hook.
- The main JS bundle is a single chunk (~237 kB gzipped). For a larger app, route-based code-splitting (`React.lazy`) would be the next step.
