import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, X } from "lucide-react";
import { searchCities, type GeoResult } from "../lib/api";
import { useStore } from "../store/useStore";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const setCurrentLocation = useStore((s) => s.setCurrentLocation);
  const favorites = useStore((s) => s.favorites);
  const addFavorite = useStore((s) => s.addFavorite);
  const isFavorite = useStore((s) => s.isFavorite);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      searchCities(query)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function selectCity(city: GeoResult) {
    setCurrentLocation(city);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  const showFavorites = open && query.trim().length < 2 && favorites.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="glass rounded-2xl flex items-center gap-2 px-4 py-3">
        <Search size={18} style={{ color: "var(--text-tertiary)" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search for a city…"
          aria-label="Search for a city"
          className="bg-transparent outline-none w-full text-sm placeholder:opacity-50"
          style={{ color: "var(--text-primary)" }}
        />
        {query && (
          <button aria-label="Clear search" onClick={() => setQuery("")}>
            <X size={16} style={{ color: "var(--text-tertiary)" }} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (results.length > 0 || loading || showFavorites) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="glass-strong absolute mt-2 w-full rounded-2xl overflow-hidden z-30 shadow-xl"
          >
            {loading && (
              <div className="px-4 py-3 text-sm" style={{ color: "var(--text-tertiary)" }}>
                Searching…
              </div>
            )}

            {!loading && showFavorites && (
              <div>
                <div
                  className="px-4 pt-3 pb-1 text-xs uppercase tracking-wide"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Favorites
                </div>
                {favorites.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => selectCity(f)}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors"
                  >
                    <Star size={14} style={{ color: "var(--accent)" }} fill="currentColor" />
                    <span className="text-sm">
                      {f.name}
                      {f.admin1 ? `, ${f.admin1}` : ""}, {f.country}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {!loading &&
              results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => selectCity(r)}
                  className="w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-3 text-sm">
                    <MapPin size={14} style={{ color: "var(--text-tertiary)" }} />
                    {r.name}
                    {r.admin1 ? `, ${r.admin1}` : ""}, {r.country}
                  </span>
                  <span
                    role="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      addFavorite(r);
                    }}
                    aria-label="Add to favorites"
                  >
                    <Star
                      size={14}
                      style={{ color: isFavorite(r.id) ? "var(--accent)" : "var(--text-tertiary)" }}
                      fill={isFavorite(r.id) ? "currentColor" : "none"}
                    />
                  </span>
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
