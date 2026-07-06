import { motion } from "framer-motion";
import { Moon, Sun, Thermometer, Wind, Gauge, Sparkles } from "lucide-react";
import { useStore } from "../store/useStore";

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="glass rounded-xl p-1 flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="relative px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={{ color: value === opt.value ? "var(--text-primary)" : "var(--text-secondary)" }}
        >
          {value === opt.value && (
            <motion.span
              layoutId={`segment-${options.map((o) => o.value).join("-")}`}
              className="absolute inset-0 glass-strong rounded-lg"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="glass rounded-xl p-2.5">
          <Icon size={18} style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <div className="text-sm font-medium">{title}</div>
          {description && (
            <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {description}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="w-12 h-7 rounded-full p-1 transition-colors"
      style={{ background: checked ? "var(--accent)" : "var(--glass-border)" }}
    >
      <motion.div
        className="w-5 h-5 rounded-full bg-white"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export function Settings() {
  const themeMode = useStore((s) => s.themeMode);
  const setThemeMode = useStore((s) => s.setThemeMode);
  const tempUnit = useStore((s) => s.tempUnit);
  const setTempUnit = useStore((s) => s.setTempUnit);
  const windUnit = useStore((s) => s.windUnit);
  const setWindUnit = useStore((s) => s.setWindUnit);
  const pressureUnit = useStore((s) => s.pressureUnit);
  const setPressureUnit = useStore((s) => s.setPressureUnit);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const setReduceMotion = useStore((s) => s.setReduceMotion);

  return (
    <div className="pt-2 pb-6 max-w-xl">
      <h1 className="font-display text-xl font-semibold mb-4">Settings</h1>
      <div className="glass rounded-3xl px-5 divide-y" style={{ borderColor: "var(--glass-border)" }}>
        <SettingRow icon={themeMode === "dark" ? Moon : Sun} title="Appearance" description="Light or dark interface">
          <SegmentedControl
            value={themeMode}
            onChange={setThemeMode}
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
          />
        </SettingRow>

        <SettingRow icon={Thermometer} title="Temperature unit">
          <SegmentedControl
            value={tempUnit}
            onChange={setTempUnit}
            options={[
              { value: "C", label: "°C" },
              { value: "F", label: "°F" },
            ]}
          />
        </SettingRow>

        <SettingRow icon={Wind} title="Wind unit">
          <SegmentedControl
            value={windUnit}
            onChange={setWindUnit}
            options={[
              { value: "kmh", label: "km/h" },
              { value: "mph", label: "mph" },
            ]}
          />
        </SettingRow>

        <SettingRow icon={Gauge} title="Pressure unit">
          <SegmentedControl
            value={pressureUnit}
            onChange={setPressureUnit}
            options={[
              { value: "hpa", label: "hPa" },
              { value: "inHg", label: "inHg" },
            ]}
          />
        </SettingRow>

        <SettingRow icon={Sparkles} title="Reduce motion" description="Turn off ambient background animation">
          <Toggle checked={reduceMotion} onChange={setReduceMotion} label="Reduce motion" />
        </SettingRow>
      </div>
    </div>
  );
}
