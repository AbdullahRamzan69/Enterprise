import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ApplicantStatus } from "@/features/jobs/jobTypes"

const statusClasses: Record<ApplicantStatus, string> = {
  New: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10",
  "Under Review": "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10",
  "Interview Scheduled": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10",
  Rejected: "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/10",
  Hired: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10",
}

export function ApplicantStatusBadge({ status, className }: { status: ApplicantStatus; className?: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-200",
        statusClasses[status],
        className
      )}
    >
      {status}
    </Badge>
  )
}
