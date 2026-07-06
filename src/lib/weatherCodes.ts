export type SkyGroup = "clear" | "cloudy" | "rain" | "storm" | "snow" | "fog";

export interface WeatherInfo {
  label: string;
  group: SkyGroup;
}

// WMO Weather interpretation codes (used by Open-Meteo)
const CODE_MAP: Record<number, WeatherInfo> = {
  0: { label: "Clear sky", group: "clear" },
  1: { label: "Mostly clear", group: "clear" },
  2: { label: "Partly cloudy", group: "cloudy" },
  3: { label: "Overcast", group: "cloudy" },
  45: { label: "Fog", group: "fog" },
  48: { label: "Depositing rime fog", group: "fog" },
  51: { label: "Light drizzle", group: "rain" },
  53: { label: "Drizzle", group: "rain" },
  55: { label: "Dense drizzle", group: "rain" },
  56: { label: "Light freezing drizzle", group: "rain" },
  57: { label: "Freezing drizzle", group: "rain" },
  61: { label: "Slight rain", group: "rain" },
  63: { label: "Rain", group: "rain" },
  65: { label: "Heavy rain", group: "rain" },
  66: { label: "Light freezing rain", group: "rain" },
  67: { label: "Freezing rain", group: "rain" },
  71: { label: "Slight snow", group: "snow" },
  73: { label: "Snow", group: "snow" },
  75: { label: "Heavy snow", group: "snow" },
  77: { label: "Snow grains", group: "snow" },
  80: { label: "Slight showers", group: "rain" },
  81: { label: "Showers", group: "rain" },
  82: { label: "Violent showers", group: "rain" },
  85: { label: "Slight snow showers", group: "snow" },
  86: { label: "Heavy snow showers", group: "snow" },
  95: { label: "Thunderstorm", group: "storm" },
  96: { label: "Thunderstorm, slight hail", group: "storm" },
  99: { label: "Thunderstorm, heavy hail", group: "storm" },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return CODE_MAP[code] ?? { label: "Unknown", group: "cloudy" };
}

export function isDaytime(hour: number): boolean {
  return hour >= 6 && hour < 19;
}

export function skyKey(code: number, isDay: boolean): string {
  const { group } = getWeatherInfo(code);
  return `${group === "clear" ? "clear" : group}-${isDay ? "day" : "night"}`;
}
