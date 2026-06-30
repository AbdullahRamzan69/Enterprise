import { useMemo } from "react"
import { Users, UserCheck, CalendarOff, Banknote } from "lucide-react"
import { useAppSelector } from "@/app/store"
import { selectEmployees } from "@/features/employees/employeeSelectors"
import { selectAttendanceCountByDateAndStatus, selectAttendanceRecords } from "@/features/attendance/attendanceSelectors"
import { selectLeaveCountByStatus } from "@/features/leave/leaveSelectors"
import { selectPendingPaymentsCount } from "@/features/finance/financeSelectors"
import { KPICard } from "@/components/dashboard/KPICard"
import { AttendanceTrend } from "@/components/dashboard/AttendanceTrend"
import { DepartmentOverview } from "@/components/dashboard/DepartmentOverview"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents"

const today = new Date().toISOString().split("T")[0]

function buildTrendData(records: ReturnType<typeof selectAttendanceRecords>, days: number) {
  const result: { day: string; present: number; absent: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split("T")[0]
    const dayLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const dayRecords = records.filter((r) => r.date === dateStr)
    const present = dayRecords.filter((r) => r.status === "Present").length
    const absent = dayRecords.filter(
      (r) => r.status === "Absent" || r.status === "Late" || r.status === "Half Day"
    ).length
    result.push({ day: dayLabel, present, absent })
  }
  return result
}

export default function DashboardHome() {
  const employees = useAppSelector(selectEmployees)
  const attendanceRecords = useAppSelector(selectAttendanceRecords)
  const activeCount = employees.filter((e) => e.status === "Active").length
  const presentToday = useAppSelector((s) => selectAttendanceCountByDateAndStatus(s, today, "Present"))
  const pendingLeave = useAppSelector((s) => selectLeaveCountByStatus(s, "Pending"))
  const pendingPayroll = useAppSelector(selectPendingPaymentsCount)

  const data7d = useMemo(() => buildTrendData(attendanceRecords, 7), [attendanceRecords])
  const data30d = useMemo(() => buildTrendData(attendanceRecords, 30), [attendanceRecords])

  const kpiCards = [
    {
      icon: <Users className="w-full h-full" />,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      label: "Total Employees",
      value: activeCount,
      delay: 0,
    },
    {
      icon: <UserCheck className="w-full h-full" />,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      label: "Attendance Today",
      value: presentToday,
      delay: 100,
    },
    {
      icon: <CalendarOff className="w-full h-full" />,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      label: "Pending Leave Requests",
      value: pendingLeave,
      delay: 200,
    },
    {
      icon: <Banknote className="w-full h-full" />,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      label: "Payroll Pending",
      value: pendingPayroll,
      delay: 300,
    },
  ]

  return (
    <main className="flex flex-col gap-6">
      {/* KPI Cards */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up"
        style={{ animationDelay: "0ms" }}
      >
        {kpiCards.map((card) => (
          <KPICard key={card.label} {...card} />
        ))}
      </section>

      {/* Attendance Trend Chart */}
      <div className="animate-fade-in-up" style={{ animationDelay: "50ms" }}>
        <AttendanceTrend data7d={data7d} data30d={data30d} totalEmployees={activeCount} />
      </div>

      {/* Activity + Department row */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <RecentActivity />
        <DepartmentOverview />
      </div>

      {/* Quick Actions + Upcoming Events row */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up"
        style={{ animationDelay: "150ms" }}
      >
        <QuickActions />
        <UpcomingEvents />
      </div>
    </main>
  )
}
