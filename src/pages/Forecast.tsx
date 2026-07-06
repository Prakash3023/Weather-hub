import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { useWeather } from "../hooks/useWeather";
import { useStore } from "../store/useStore";
import { getWeatherInfo } from "../lib/weatherCodes";
import { WeatherIcon } from "../components/icons/WeatherIcon";
import { DashboardSkeleton } from "../components/Skeletons";
import { ErrorState } from "../components/ErrorState";
import { formatTemp, formatHour, formatDay } from "../lib/format";

export function Forecast() {
  const { forecast, loading, error, reload } = useWeather();
  const tempUnit = useStore((s) => s.tempUnit);

  if (loading && !forecast) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!forecast) return null;

  const { hourly, daily } = forecast;
  const now = new Date();
  const startIdx = hourly.time.findIndex((t) => new Date(t) >= now);
  const hoursSlice = Math.max(startIdx, 0);
  const next24 = hourly.time.slice(hoursSlice, hoursSlice + 24);

  const chartData = next24.map((t, i) => ({
    time: formatHour(t),
    temp: Math.round(hourly.temperature_2m[hoursSlice + i]),
    rain: hourly.precipitation_probability[hoursSlice + i],
  }));

  return (
    <div className="pt-2 pb-6 space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-5"
      >
        <h2 className="font-display text-lg font-semibold mb-4">Next 24 hours</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {next24.map((t, i) => {
            const idx = hoursSlice + i;
            const info = getWeatherInfo(hourly.weather_code[idx]);
            return (
              <div
                key={t}
                className="flex flex-col items-center gap-2 shrink-0 w-16 text-center"
              >
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {i === 0 ? "Now" : formatHour(t)}
                </span>
                <WeatherIcon group={info.group} isDay={hourly.is_day[idx] === 1} size={32} />
                <span className="text-sm font-medium">{formatTemp(hourly.temperature_2m[idx], tempUnit)}</span>
              </div>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="glass rounded-3xl p-5"
      >
        <h2 className="font-display text-lg font-semibold mb-4">Temperature trend</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} width={30} />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,25,40,0.9)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="var(--accent)"
                strokeWidth={2}
                fill="url(#tempGradient)"
                isAnimationActive
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass rounded-3xl p-5"
      >
        <h2 className="font-display text-lg font-semibold mb-4">Rain probability</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} width={30} />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,25,40,0.9)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="rain" fill="var(--accent)" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="glass rounded-3xl p-5"
      >
        <h2 className="font-display text-lg font-semibold mb-4">7-day forecast</h2>
        <div className="divide-y" style={{ borderColor: "var(--glass-border)" }}>
          {daily.time.map((t, i) => {
            const info = getWeatherInfo(daily.weather_code[i]);
            return (
              <div
                key={t}
                className="flex items-center justify-between py-3"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <span className="w-20 text-sm font-medium">{formatDay(t, i)}</span>
                <WeatherIcon group={info.group} isDay size={28} />
                <span
                  className="flex-1 text-sm text-center hidden sm:block"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {info.label}
                </span>
                <span className="text-sm w-24 text-right" style={{ color: "var(--text-secondary)" }}>
                  {formatTemp(daily.temperature_2m_min[i], tempUnit)} / {formatTemp(daily.temperature_2m_max[i], tempUnit)}
                </span>
              </div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
