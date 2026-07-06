import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";

interface WeatherCardProps {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  accentColor?: string;
  sublabel?: string;
  delay?: number;
}

function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1, ease: "easeOut" });
    return controls.stop;
  }, [value, mv]);

  return <motion.span>{rounded}</motion.span>;
}

export function WeatherCard({
  label,
  value,
  suffix = "",
  decimals = 0,
  icon: Icon,
  accentColor,
  sublabel,
  delay = 0,
}: WeatherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="glass rounded-3xl p-5 flex flex-col justify-between min-h-[132px] shadow-lg shadow-black/10"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </span>
        <Icon size={18} style={{ color: accentColor ?? "var(--accent)" }} strokeWidth={2} />
      </div>
      <div>
        <div className="font-display text-3xl font-semibold tracking-tight">
          <CountUp value={value} decimals={decimals} />
          <span className="text-xl">{suffix}</span>
        </div>
        {sublabel && (
          <div className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
            {sublabel}
          </div>
        )}
      </div>
    </motion.div>
  );
}
