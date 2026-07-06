import { motion } from "framer-motion";
import { useStore } from "../store/useStore";

export function Background() {
  const skyKey = useStore((s) => s.skyKey);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const isRain = skyKey.startsWith("rain") || skyKey.startsWith("storm");
  const isSnow = skyKey.startsWith("snow");
  const isStorm = skyKey.startsWith("storm");
  const isClearNight = skyKey === "clear-night";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 transition-[background] duration-1000"
        style={{
          background:
            "linear-gradient(160deg, var(--sky-a) 0%, var(--sky-b) 55%, var(--sky-c) 100%)",
        }}
      />

      {/* floating aurora blobs */}
      {!reduceMotion && (
        <>
          <motion.div
            className="absolute w-[50vw] h-[50vw] rounded-full blur-3xl opacity-30"
            style={{ background: "var(--sky-c)", top: "-10%", left: "-10%" }}
            animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[40vw] h-[40vw] rounded-full blur-3xl opacity-20"
            style={{ background: "var(--accent)", bottom: "-10%", right: "-5%" }}
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {isClearNight && !reduceMotion && (
        <div className="absolute inset-0">
          {Array.from({ length: 40 }).map((_, i) => {
            const top = (i * 37) % 100;
            const left = (i * 53) % 100;
            return (
              <motion.div
                key={i}
                className="absolute w-[2px] h-[2px] rounded-full bg-white"
                style={{ top: `${top}%`, left: `${left}%` }}
                animate={{ opacity: [0.1, 0.9, 0.1] }}
                transition={{ duration: 2 + (i % 5), repeat: Infinity, delay: (i % 7) * 0.3 }}
              />
            );
          })}
        </div>
      )}

      {isRain && !reduceMotion && (
        <div className="absolute inset-0">
          {Array.from({ length: 28 }).map((_, i) => {
            const left = (i * 29) % 100;
            const delay = (i % 10) * 0.15;
            return (
              <motion.div
                key={i}
                className="absolute w-px h-8 bg-white/30"
                style={{ left: `${left}%`, top: "-10%" }}
                animate={{ top: ["-10%", "110%"] }}
                transition={{ duration: 0.9 + (i % 4) * 0.2, repeat: Infinity, delay, ease: "linear" }}
              />
            );
          })}
        </div>
      )}

      {isSnow && !reduceMotion && (
        <div className="absolute inset-0">
          {Array.from({ length: 24 }).map((_, i) => {
            const left = (i * 41) % 100;
            const delay = (i % 8) * 0.4;
            return (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-white/70"
                style={{ left: `${left}%`, top: "-5%" }}
                animate={{ top: ["-5%", "105%"], x: [0, 15, -15, 0] }}
                transition={{ duration: 6 + (i % 5), repeat: Infinity, delay, ease: "linear" }}
              />
            );
          })}
        </div>
      )}

      {isStorm && !reduceMotion && (
        <motion.div
          className="absolute inset-0 bg-white"
          animate={{ opacity: [0, 0, 0.12, 0, 0, 0.06, 0] }}
          transition={{ duration: 5, repeat: Infinity, times: [0, 0.4, 0.42, 0.44, 0.7, 0.72, 1] }}
        />
      )}

      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
