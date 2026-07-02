import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { AdminUserStatus } from "@/features/settings/settingsTypes"

const statusClasses: Record<AdminUserStatus, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10",
  Inactive: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-500/10",
  Pending: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10",
  Suspended: "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/10",
}

export function AdminStatusBadge({ status, className }: { status: AdminUserStatus; className?: string }) {
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
