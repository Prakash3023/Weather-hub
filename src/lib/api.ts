export interface GeoResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface ForecastData {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    pressure_msl: number;
    surface_pressure: number;
    is_day: number;
    precipitation: number;
    uv_index?: number;
    visibility?: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    is_day: number[];
    uv_index?: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_probability_max: number[];
    uv_index_max: number[];
  };
  timezone: string;
}

export interface AirQualityData {
  hourly: {
    time: string[];
    pm2_5: number[];
    pm10: number[];
    ozone: number[];
    nitrogen_dioxide: number[];
    sulphur_dioxide: number[];
    us_aqi: number[];
  };
}

const GEO_BASE = "https://geocoding-api.open-meteo.com/v1";
const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";
const AIR_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function searchCities(query: string): Promise<GeoResult[]> {
  if (!query.trim()) return [];
  const url = `${GEO_BASE}/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
  const data = await fetchJson<{ results?: GeoResult[] }>(url);
  return data.results ?? [];
}

export async function getForecast(lat: number, lon: number): Promise<ForecastData> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "pressure_msl",
      "surface_pressure",
      "is_day",
      "precipitation",
    ].join(","),
    hourly: [
      "temperature_2m",
      "weather_code",
      "precipitation_probability",
      "is_day",
      "uv_index",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "precipitation_probability_max",
      "uv_index_max",
    ].join(","),
    timezone: "auto",
    forecast_days: "8",
  });
  return fetchJson<ForecastData>(`${FORECAST_BASE}?${params.toString()}`);
}

export async function getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: ["pm2_5", "pm10", "ozone", "nitrogen_dioxide", "sulphur_dioxide", "us_aqi"].join(","),
    timezone: "auto",
    forecast_days: "2",
  });
  return fetchJson<AirQualityData>(`${AIR_BASE}?${params.toString()}`);
}

