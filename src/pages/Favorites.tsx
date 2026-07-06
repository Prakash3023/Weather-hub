import { motion, AnimatePresence } from "framer-motion";
import { Star, Trash2, MapPin } from "lucide-react";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";

export function Favorites() {
  const favorites = useStore((s) => s.favorites);
  const removeFavorite = useStore((s) => s.removeFavorite);
  const setCurrentLocation = useStore((s) => s.setCurrentLocation);
  const currentLocation = useStore((s) => s.currentLocation);
  const navigate = useNavigate();

  return (
    <div className="pt-2 pb-6">
      <h1 className="font-display text-xl font-semibold mb-4">Favorites</h1>

      {favorites.length === 0 ? (
        <div className="glass rounded-3xl p-10 flex flex-col items-center text-center gap-2">
          <Star size={28} style={{ color: "var(--text-tertiary)" }} />
          <p className="text-sm max-w-xs" style={{ color: "var(--text-secondary)" }}>
            No favorites yet. Search for a city and tap the star to save it here.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {favorites.map((f) => {
              const active = currentLocation?.id === f.id;
              return (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass rounded-3xl p-5 flex items-center justify-between"
                  style={active ? { borderColor: "var(--accent)" } : undefined}
                >
                  <button
                    className="flex items-center gap-3 text-left"
                    onClick={() => {
                      setCurrentLocation(f);
                      navigate("/");
                    }}
                  >
                    <MapPin size={18} style={{ color: "var(--accent)" }} />
                    <div>
                      <div className="font-medium text-sm">{f.name}</div>
                      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {f.admin1 ? `${f.admin1}, ` : ""}
                        {f.country}
                      </div>
                    </div>
                  </button>
                  <button
                    aria-label={`Remove ${f.name} from favorites`}
                    onClick={() => removeFavorite(f.id)}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <Trash2 size={16} style={{ color: "var(--text-tertiary)" }} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
