import { useNavigate } from "react-router-dom"
import { useAppSelector } from "@/app/store"
import { selectEmployees } from "@/features/employees/employeeSelectors"
import { selectAttendanceRecords } from "@/features/attendance/attendanceSelectors"
import { selectLeaveRequests } from "@/features/leave/leaveSelectors"
import { UserCheck, UserPlus, CalendarOff, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// intentionally prop-free: derives all data from Redux

interface ActivityItem {
  id: string
  description: string
  timestamp: string
  type: "present" | "absent" | "late" | "halfday" | "leave-pending" | "leave-approved" | "leave-rejected" | "new-employee"
  sortKey: string
}

function relativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  return `${diffDays}d ago`
}

const STATUS_ICON = {
  present: { icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  absent: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  late: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  halfday: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  "leave-pending": { icon: CalendarOff, color: "text-amber-500", bg: "bg-amber-500/10" },
  "leave-approved": { icon: CalendarOff, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  "leave-rejected": { icon: CalendarOff, color: "text-red-500", bg: "bg-red-500/10" },
  "new-employee": { icon: UserPlus, color: "text-primary", bg: "bg-primary/10" },
}

export function RecentActivity() {
  const navigate = useNavigate()
  const employees = useAppSelector(selectEmployees)
  const attendance = useAppSelector(selectAttendanceRecords)
  const leave = useAppSelector(selectLeaveRequests)

  const items: ActivityItem[] = []

  // Attendance events — use date as ISO string (date-only, so treat as noon UTC for relative calc)
  for (const rec of attendance) {
    const isoTs = `${rec.date}T12:00:00`
    let type: ActivityItem["type"] = "present"
    let verb = "checked in"
    if (rec.status === "Absent") { type = "absent"; verb = "was absent" }
    else if (rec.status === "Late") { type = "late"; verb = "checked in late" }
    else if (rec.status === "Half Day") { type = "halfday"; verb = "worked a half day" }
    items.push({
      id: `att-${rec.id}`,
      description: `${rec.employeeName} ${verb}`,
      timestamp: isoTs,
      type,
      sortKey: `${rec.date}T12:00:00`,
    })
  }

  // Leave events
  for (const req of leave) {
    let type: ActivityItem["type"] = "leave-pending"
    let verb = "submitted a leave request"
    if (req.status === "Approved") { type = "leave-approved"; verb = "leave was approved" }
    else if (req.status === "Rejected") { type = "leave-rejected"; verb = "leave was rejected" }
    items.push({
      id: `leave-${req.id}`,
      description: `${req.employeeName} ${verb}`,
      timestamp: req.appliedAt,
      type,
      sortKey: req.appliedAt,
    })
  }

  // New employee events
  for (const emp of employees) {
    items.push({
      id: `emp-${emp.id}`,
      description: `${emp.fullName} joined as ${emp.designation}`,
      timestamp: `${emp.joiningDate}T09:00:00`,
      type: "new-employee",
      sortKey: `${emp.joiningDate}T09:00:00`,
    })
  }

  // Sort newest first
  items.sort((a, b) => b.sortKey.localeCompare(a.sortKey))

  const visible = items.slice(0, 8)
  const hasMore = items.length > 8

  if (items.length === 0) {
    return (
      <section className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full">
        <h2 className="text-base font-semibold text-foreground mb-1">Recent Activity</h2>
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          No recent activity.
        </div>
      </section>
    )
  }

  return (
    <section className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full" aria-live="polite">
      <h2 className="text-base font-semibold text-foreground mb-4">Recent Activity</h2>

      <ul className="flex flex-col gap-3 flex-1">
        {visible.map((item) => {
          const cfg = STATUS_ICON[item.type]
          const Icon = cfg.icon
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div className={cn("mt-0.5 p-1.5 rounded-lg shrink-0", cfg.bg)}>
                <Icon className={cn("w-3.5 h-3.5", cfg.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground leading-snug">{item.description}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{relativeTime(item.timestamp)}</p>
              </div>
            </li>
          )
        })}
      </ul>

      {hasMore && (
        <button
          onClick={() => navigate("/attendance")}
          className="mt-4 text-xs font-semibold text-primary hover:underline text-left"
        >
          View all activity →
        </button>
      )}
    </section>
  )
}
