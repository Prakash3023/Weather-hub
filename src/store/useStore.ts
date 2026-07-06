import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GeoResult } from "../lib/api";

export type ThemeMode = "dark" | "light";
export type TempUnit = "C" | "F";
export type WindUnit = "kmh" | "mph";
export type PressureUnit = "hpa" | "inHg";

interface AppState {
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;

  reduceMotion: boolean;
  setReduceMotion: (v: boolean) => void;

  tempUnit: TempUnit;
  windUnit: WindUnit;
  pressureUnit: PressureUnit;
  setTempUnit: (u: TempUnit) => void;
  setWindUnit: (u: WindUnit) => void;
  setPressureUnit: (u: PressureUnit) => void;

  currentLocation: GeoResult | null;
  setCurrentLocation: (loc: GeoResult) => void;

  favorites: GeoResult[];
  addFavorite: (loc: GeoResult) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;

  skyKey: string;
  setSkyKey: (key: string) => void;
}

const DEFAULT_LOCATION: GeoResult = {
  id: 1277333,
  name: "Guwahati",
  country: "India",
  admin1: "Assam",
  latitude: 26.1445,
  longitude: 91.7362,
  timezone: "Asia/Kolkata",
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      themeMode: "dark",
      setThemeMode: (m) => set({ themeMode: m }),

      reduceMotion: false,
      setReduceMotion: (v) => set({ reduceMotion: v }),

      tempUnit: "C",
      windUnit: "kmh",
      pressureUnit: "hpa",
      setTempUnit: (u) => set({ tempUnit: u }),
      setWindUnit: (u) => set({ windUnit: u }),
      setPressureUnit: (u) => set({ pressureUnit: u }),

      currentLocation: DEFAULT_LOCATION,
      setCurrentLocation: (loc) => set({ currentLocation: loc }),

      favorites: [],
      addFavorite: (loc) =>
        set((s) => (s.favorites.some((f) => f.id === loc.id) ? s : { favorites: [...s.favorites, loc] })),
      removeFavorite: (id) => set((s) => ({ favorites: s.favorites.filter((f) => f.id !== id) })),
      isFavorite: (id) => get().favorites.some((f) => f.id === id),

      skyKey: "clear-day",
      setSkyKey: (key) => set({ skyKey: key }),
    }),
    {
      name: "weather-hub-storage",
      partialize: (s) => ({
        themeMode: s.themeMode,
        reduceMotion: s.reduceMotion,
        tempUnit: s.tempUnit,
        windUnit: s.windUnit,
        pressureUnit: s.pressureUnit,
        currentLocation: s.currentLocation,
        favorites: s.favorites,
      }),
    }
  )
);
