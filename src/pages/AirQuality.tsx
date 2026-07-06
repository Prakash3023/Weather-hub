import { motion } from "framer-motion";
import { useWeather } from "../hooks/useWeather";
import { DashboardSkeleton } from "../components/Skeletons";
import { ErrorState } from "../components/ErrorState";
import { aqiLabel } from "../lib/format";

const POLLUTANTS: { key: keyof AirQualityRow; label: string; unit: string }[] = [
  { key: "pm2_5", label: "PM2.5", unit: "µg/m³" },
  { key: "pm10", label: "PM10", unit: "µg/m³" },
  { key: "ozone", label: "Ozone (O₃)", unit: "µg/m³" },
  { key: "nitrogen_dioxide", label: "Nitrogen Dioxide (NO₂)", unit: "µg/m³" },
  { key: "sulphur_dioxide", label: "Sulphur Dioxide (SO₂)", unit: "µg/m³" },
];

interface AirQualityRow {
  pm2_5: number;
  pm10: number;
  ozone: number;
  nitrogen_dioxide: number;
  sulphur_dioxide: number;
}

export function AirQuality() {
  const { airQuality, loading, error, reload } = useWeather();

  if (loading && !airQuality) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!airQuality) return null;

  const now = new Date();
  let idx = airQuality.hourly.time.findIndex((t) => new Date(t) >= now);
  if (idx < 0) idx = 0;

  const aqi = Math.round(airQuality.hourly.us_aqi[idx] ?? 0);
  const { label, color } = aqiLabel(aqi);
  const pct = Math.min((aqi / 300) * 100, 100);

  return (
    <div className="pt-2 pb-6 space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-strong rounded-[2rem] p-8 flex flex-col items-center text-center"
      >
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Air Quality Index (US)
        </span>
        <span className="font-display text-6xl font-semibold mt-2">{aqi}</span>
        <span className="text-base font-medium mt-1" style={{ color }}>
          {label}
        </span>
        <div className="w-full max-w-sm h-2 rounded-full bg-white/10 mt-6 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {POLLUTANTS.map((p) => (
          <div key={p.key} className="glass rounded-3xl p-5">
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {p.label}
            </div>
            <div className="font-display text-2xl font-semibold mt-2">
              {airQuality.hourly[p.key][idx]?.toFixed(1) ?? "—"}
              <span className="text-sm ml-1" style={{ color: "var(--text-tertiary)" }}>
                {p.unit}
              </span>
            </div>
          </div>
        ))}
      </motion.section>
    </div>
  );
}
