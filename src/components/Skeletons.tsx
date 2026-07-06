export function CardSkeleton() {
  return (
    <div className="glass rounded-3xl p-5 min-h-[132px] relative overflow-hidden">
      <div className="h-4 w-20 rounded bg-white/10 mb-6" />
      <div className="h-8 w-16 rounded bg-white/10" />
      <div className="shimmer absolute inset-0" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="glass-strong rounded-[2rem] p-8 mb-6 h-56 relative overflow-hidden">
        <div className="shimmer absolute inset-0" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
