import { useEffect, useState, useCallback } from "react";
import { getForecast, getAirQuality, type ForecastData, type AirQualityData } from "../lib/api";
import { useStore } from "../store/useStore";
import { skyKey } from "../lib/weatherCodes";

interface WeatherState {
  forecast: ForecastData | null;
  airQuality: AirQualityData | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useWeather(): WeatherState {
  const location = useStore((s) => s.currentLocation);
  const setSkyKey = useStore((s) => s.setSkyKey);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!location) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getForecast(location.latitude, location.longitude),
      getAirQuality(location.latitude, location.longitude),
    ])
      .then(([f, a]) => {
        if (cancelled) return;
        setForecast(f);
        setAirQuality(a);
        setSkyKey(skyKey(f.current.weather_code, f.current.is_day === 1));
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Something went wrong");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [location, tick, setSkyKey]);

  return { forecast, airQuality, loading, error, reload };
}
