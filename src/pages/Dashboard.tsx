import { motion } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  CloudRain,
  Droplet,
} from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import { useStore } from "../store/useStore";
import { getWeatherInfo } from "../lib/weatherCodes";
import { WeatherIcon } from "../components/icons/WeatherIcon";
import { WeatherCard } from "../components/WeatherCard";
import { DashboardSkeleton } from "../components/Skeletons";
import { ErrorState } from "../components/ErrorState";
import { formatTemp, formatWind, formatPressure, formatTime, greeting, uvLabel } from "../lib/format";

export function Dashboard() {
  const { forecast, loading, error, reload } = useWeather();
  const location = useStore((s) => s.currentLocation);
  const tempUnit = useStore((s) => s.tempUnit);
  const windUnit = useStore((s) => s.windUnit);
  const pressureUnit = useStore((s) => s.pressureUnit);

  if (loading && !forecast) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!forecast) return null;

  const { current, daily } = forecast;
  const info = getWeatherInfo(current.weather_code);
  const isDay = current.is_day === 1;
  const today = daily.time[0] ? new Date(daily.time[0]) : new Date();

  return (
    <div className="pt-2 pb-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-strong rounded-[2rem] p-6 md:p-10 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {greeting()} · {today.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-1">
            {location?.name}
            {location?.admin1 ? `, ${location.admin1}` : ""}
          </h1>
          <div className="flex items-end gap-3 mt-4">
            <span className="font-display text-6xl md:text-7xl font-semibold tracking-tight">
              {formatTemp(current.temperature_2m, tempUnit)}
            </span>
            <div className="pb-2">
              <div className="text-base font-medium">{info.label}</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Feels like {formatTemp(current.apparent_temperature, tempUnit)}
              </div>
            </div>
          </div>
        </div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="self-center md:self-auto"
          style={{ color: "var(--accent)" }}
        >
          <WeatherIcon group={info.group} isDay={isDay} size={130} />
        </motion.div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <WeatherCard
          label="Humidity"
          value={current.relative_humidity_2m}
          suffix="%"
          icon={Droplets}
          delay={0.05}
        />
        <WeatherCard
          label="UV Index"
          value={daily.uv_index_max[0] ?? 0}
          decimals={1}
          icon={Sun}
          accentColor={uvLabel(daily.uv_index_max[0] ?? 0).color}
          sublabel={uvLabel(daily.uv_index_max[0] ?? 0).label}
          delay={0.1}
        />
        <div className="glass rounded-3xl p-5 flex flex-col justify-between min-h-[132px] shadow-lg shadow-black/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Wind
            </span>
            <Wind size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div className="font-display text-2xl font-semibold">
            {formatWind(current.wind_speed_10m, windUnit)}
          </div>
        </div>
        <div className="glass rounded-3xl p-5 flex flex-col justify-between min-h-[132px] shadow-lg shadow-black/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Pressure
            </span>
            <Gauge size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div className="font-display text-2xl font-semibold">
            {formatPressure(current.pressure_msl, pressureUnit)}
          </div>
        </div>
        <WeatherCard
          label="Chance of Rain"
          value={daily.precipitation_probability_max[0] ?? 0}
          suffix="%"
          icon={CloudRain}
          delay={0.15}
        />
        <WeatherCard
          label="Precipitation"
          value={current.precipitation}
          decimals={1}
          suffix=" mm"
          icon={Droplet}
          delay={0.2}
        />
        <div className="glass rounded-3xl p-5 flex flex-col justify-between min-h-[132px] shadow-lg shadow-black/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Sunrise
            </span>
            <Sunrise size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div className="font-display text-2xl font-semibold">{formatTime(daily.sunrise[0])}</div>
        </div>
        <div className="glass rounded-3xl p-5 flex flex-col justify-between min-h-[132px] shadow-lg shadow-black/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Sunset
            </span>
            <Sunset size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div className="font-display text-2xl font-semibold">{formatTime(daily.sunset[0])}</div>
        </div>
        <div className="glass rounded-3xl p-5 flex flex-col justify-between min-h-[132px] shadow-lg shadow-black/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              High / Low
            </span>
            <Thermometer size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div className="font-display text-2xl font-semibold">
            {formatTemp(daily.temperature_2m_max[0], tempUnit)} / {formatTemp(daily.temperature_2m_min[0], tempUnit)}
          </div>
        </div>
        <div className="glass rounded-3xl p-5 flex flex-col justify-between min-h-[132px] shadow-lg shadow-black/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Visibility
            </span>
            <Eye size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div className="font-display text-2xl font-semibold">Good</div>
        </div>
      </div>
    </div>
  );
}
