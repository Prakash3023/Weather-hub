import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid, CalendarDays, Wind, Star, Settings, CloudSun } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { Background } from "./Background";
import { useStore } from "../store/useStore";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/forecast", label: "Forecast", icon: CalendarDays },
  { to: "/air-quality", label: "Air Quality", icon: Wind },
  { to: "/favorites", label: "Favorites", icon: Star },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Layout() {
  const location = useStore((s) => s.currentLocation);

  return (
    <div className="min-h-screen flex" style={{ color: "var(--text-primary)" }}>
      <Background />

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col gap-1 p-6 shrink-0">
        <div className="flex items-center gap-2 mb-8 px-2">
          <CloudSun size={26} style={{ color: "var(--accent)" }} />
          <span className="font-display text-lg font-semibold">Weather Hub</span>
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? "" : "hover:bg-white/5"
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 glass-strong rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon size={18} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="mt-auto px-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
          {location && (
            <span>
              Showing {location.name}, {location.country}
            </span>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-4 p-4 md:p-6 md:pl-0">
          <div className="md:hidden flex items-center gap-2">
            <CloudSun size={22} style={{ color: "var(--accent)" }} />
          </div>
          <SearchBar />
        </header>

        <main className="flex-1 px-4 md:px-6 pb-24 md:pb-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-strong flex items-center justify-around py-2 px-2 z-20">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px]"
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={20}
                    style={{ color: isActive ? "var(--accent)" : "var(--text-tertiary)" }}
                  />
                  <span style={{ color: isActive ? "var(--text-primary)" : "var(--text-tertiary)" }}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
