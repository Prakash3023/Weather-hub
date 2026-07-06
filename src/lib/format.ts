import type { TempUnit, WindUnit, PressureUnit } from "../store/useStore";

export function formatTemp(celsius: number, unit: TempUnit, decimals = 0): string {
  const v = unit === "F" ? celsius * (9 / 5) + 32 : celsius;
  return `${v.toFixed(decimals)}°`;
}

export function formatWind(kmh: number, unit: WindUnit): string {
  const v = unit === "mph" ? kmh * 0.621371 : kmh;
  return `${Math.round(v)} ${unit === "mph" ? "mph" : "km/h"}`;
}

export function formatPressure(hpa: number, unit: PressureUnit): string {
  const v = unit === "inHg" ? hpa * 0.02953 : hpa;
  return `${v.toFixed(unit === "inHg" ? 2 : 0)} ${unit === "inHg" ? "inHg" : "hPa"}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function formatHour(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric" });
}

export function formatDay(iso: string, index: number): string {
  if (index === 0) return "Today";
  const d = new Date(iso);
  return d.toLocaleDateString([], { weekday: "short" });
}

export function windDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Still up late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

export function aqiLabel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: "Good", color: "#5fd99a" };
  if (aqi <= 100) return { label: "Moderate", color: "#e0d15f" };
  if (aqi <= 150) return { label: "Unhealthy for sensitive groups", color: "#e0a15f" };
  if (aqi <= 200) return { label: "Unhealthy", color: "#e0705f" };
  if (aqi <= 300) return { label: "Very unhealthy", color: "#b05fe0" };
  return { label: "Hazardous", color: "#8a2f3a" };
}

export function uvLabel(uv: number): { label: string; color: string } {
  if (uv < 3) return { label: "Low", color: "#5fd99a" };
  if (uv < 6) return { label: "Moderate", color: "#e0d15f" };
  if (uv < 8) return { label: "High", color: "#e0a15f" };
  if (uv < 11) return { label: "Very high", color: "#e0705f" };
  return { label: "Extreme", color: "#b05fe0" };
}
