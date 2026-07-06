import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Forecast } from "./pages/Forecast";
import { AirQuality } from "./pages/AirQuality";
import { Favorites } from "./pages/Favorites";
import { Settings } from "./pages/Settings";
import { useStore } from "./store/useStore";

export default function App() {
  const themeMode = useStore((s) => s.themeMode);
  const skyKey = useStore((s) => s.skyKey);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-sky", skyKey);
  }, [skyKey]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/air-quality" element={<AirQuality />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
