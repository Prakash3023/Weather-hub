import { CloudOff } from "lucide-react";

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="glass rounded-3xl p-10 flex flex-col items-center text-center gap-3">
      <CloudOff size={32} style={{ color: "var(--text-tertiary)" }} />
      <div className="font-display text-lg font-semibold">Couldn't load the forecast</div>
      <p className="text-sm max-w-sm" style={{ color: "var(--text-secondary)" }}>
        {message || "Check your connection and try again."}
      </p>
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 rounded-xl text-sm font-medium glass-strong hover:opacity-90 transition-opacity"
      >
        Retry
      </button>
    </div>
  );
}
