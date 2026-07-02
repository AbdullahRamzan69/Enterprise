import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { JobStatus } from "@/features/jobs/jobTypes";

const statusClasses: Record<JobStatus, string> = {
  Draft:
    "bg-slate-500/10 text-slate-600 dark:text-slate-300 hover:bg-slate-500/10",
  Published:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10",
  Closed:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10",
  Archived:
    "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-500/10",
};

export function JobStatusBadge({
  status,
  className,
}: {
  status: JobStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-200",
        statusClasses[status],
        className,
      )}
    >
      {status}
    </Badge>
  );
}
