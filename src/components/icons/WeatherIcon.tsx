import { motion } from "framer-motion";
import type { SkyGroup } from "../../lib/weatherCodes";

interface IconProps {
  size?: number;
  isDay?: boolean;
  className?: string;
}

const spin = { rotate: 360 };
const spinTransition = { duration: 40, repeat: Infinity, ease: "linear" as const };

function SunIcon({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <motion.g animate={spin} transition={spinTransition} style={{ originX: "50px", originY: "50px" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x="47"
            y="4"
            width="6"
            height="16"
            rx="3"
            fill="currentColor"
            transform={`rotate(${i * 45} 50 50)`}
            opacity={0.85}
          />
        ))}
      </motion.g>
      <motion.circle
        cx="50"
        cy="50"
        r="22"
        fill="currentColor"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function MoonIcon({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <motion.path
        d="M62 20a32 32 0 1 0 18 40 26 26 0 0 1-18-40z"
        fill="currentColor"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      {[[75, 25, 1.6], [82, 40, 1.1], [68, 15, 1]].map(([cx, cy, r], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="currentColor"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}
    </svg>
  );
}

function CloudShape({ x = 0, y = 0, scale = 1, opacity = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <path
        d="M20 55c-8 0-14-6-14-13 0-6 4-11 10-13 1-9 9-16 18-16 8 0 15 5 18 12 8 0 14 6 14 13s-6 13-14 13H20z"
        fill="currentColor"
      />
    </g>
  );
}

function CloudIcon({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 90" fill="none">
      <motion.g animate={{ x: [-4, 4, -4] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <CloudShape x={8} y={8} scale={0.7} opacity={0.5} />
      </motion.g>
      <motion.g animate={{ x: [3, -3, 3] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <CloudShape x={18} y={22} scale={0.95} />
      </motion.g>
    </svg>
  );
}

function RainIcon({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <CloudShape x={14} y={4} scale={0.85} />
      {[24, 42, 60].map((x, i) => (
        <motion.line
          key={i}
          x1={x}
          y1={58}
          x2={x - 6}
          y2={74}
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          animate={{ y1: [58, 66, 58], y2: [74, 82, 74], opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2, ease: "easeIn" }}
        />
      ))}
    </svg>
  );
}

function SnowIcon({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <CloudShape x={14} y={4} scale={0.85} />
      {[26, 44, 62].map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={62}
          r={3}
          fill="currentColor"
          animate={{ cy: [60, 84], x: [x, x + (i % 2 === 0 ? 6 : -6)], opacity: [1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: "easeIn" }}
        />
      ))}
    </svg>
  );
}

function StormIcon({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <CloudShape x={12} y={2} scale={0.85} />
      <motion.path
        d="M48 50 L36 74 L48 74 L40 94 L64 64 L50 64 Z"
        fill="currentColor"
        animate={{ opacity: [0.3, 1, 0.3, 0.3, 1, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.05, 0.15, 0.7, 0.75, 1] }}
      />
    </svg>
  );
}

function FogIcon({ size = 64 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 70" fill="none">
      {[16, 32, 48].map((y, i) => (
        <motion.rect
          key={i}
          x={10}
          y={y}
          width={80}
          height={6}
          rx={3}
          fill="currentColor"
          opacity={0.75 - i * 0.15}
          animate={{ x: [10, 16, 10] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
    </svg>
  );
}

export function WeatherIcon({ group, isDay = true, size = 64, className }: { group: SkyGroup } & IconProps) {
  const props = { size, isDay };
  const content = (() => {
    switch (group) {
      case "clear":
        return isDay ? <SunIcon {...props} /> : <MoonIcon {...props} />;
      case "cloudy":
        return <CloudIcon {...props} />;
      case "rain":
        return <RainIcon {...props} />;
      case "snow":
        return <SnowIcon {...props} />;
      case "storm":
        return <StormIcon {...props} />;
      case "fog":
        return <FogIcon {...props} />;
      default:
        return <CloudIcon {...props} />;
    }
  })();
  return <div className={className}>{content}</div>;
}
