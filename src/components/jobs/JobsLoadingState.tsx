export function JobsLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="glass-card rounded-xl border border-border/60 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-9 w-9 rounded-lg bg-muted" />
            </div>
            <div className="mt-5 h-8 w-16 rounded bg-muted" />
            <div className="mt-3 h-3 w-40 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="glass-card rounded-xl border border-border/60 p-4 shadow-sm space-y-4">
        <div className="h-10 w-full rounded-lg bg-muted" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-9 rounded-lg bg-muted" />
          ))}
        </div>
      </div>
      <div className="glass-card rounded-xl border border-border/60 p-4 shadow-sm space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-3 items-center border-b border-border/40 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="col-span-3 space-y-2">
              <div className="h-3 w-32 rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
            <div className="col-span-2 h-3 rounded bg-muted" />
            <div className="col-span-2 h-3 rounded bg-muted" />
            <div className="col-span-2 h-6 rounded-full bg-muted" />
            <div className="col-span-3 flex justify-end gap-2">
              <div className="h-7 w-7 rounded-lg bg-muted" />
              <div className="h-7 w-7 rounded-lg bg-muted" />
              <div className="h-7 w-7 rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
