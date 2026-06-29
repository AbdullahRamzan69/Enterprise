import { useState } from "react"
import {
  Users,
  CalendarCheck,
  FolderKanban,
  DollarSign,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle2,
  ListTodo,
  UserX,
  Umbrella,
  XCircle,
  UserSearch,
  CalendarClock,
  PauseCircle,
  Building2,
  Handshake,
  MessageSquareShare,
  Package,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/app/store"
import { selectAttendanceCountByDateAndStatus } from "@/features/attendance/attendanceSelectors"
import { selectEmployees } from "@/features/employees/employeeSelectors"
import { selectLeaveCountByStatus, selectLeaveRequests } from "@/features/leave/leaveSelectors"
import {
  selectCandidateCountByStatus,
  selectTotalCandidates,
} from "@/features/recruitment/recruitmentSelectors"
import {
  selectActiveProjectsCount,
  selectProjectCountByStatus,
  selectTotalProjects,
} from "@/features/projects/projectSelectors"
import {
  selectTotalCustomersCount,
  selectActiveClientsCount,
  selectNewLeadsCount,
  selectNegotiationsCount,
} from "@/features/crm/crmSelectors"
import {
  selectTotalAssetsCount,
  selectAssignedAssetsCount,
  selectAvailableAssetsCount,
  selectMaintenanceAssetsCount,
} from "@/features/assets/assetSelectors"
import {
  selectTotalDepartmentsCount,
  selectTotalDesignationsCount,
  selectUpcomingHolidays,
  selectCompanyProfile,
} from "@/features/settings/settingsSelectors"

// Types for activities & tasks
interface Activity {
  id: string
  user: string
  action: string
  target: string
  time: string
  type: "hr" | "finance" | "project" | "crm"
  avatarInitials: string
}

interface Task {
  id: string
  title: string
  dueDate: string
  priority: "high" | "medium" | "low"
  status: "pending" | "completed"
}

export default function DashboardHome() {
  const todayDate = new Date().toISOString().split("T")[0]
  const todayLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const employees = useAppSelector(selectEmployees)
  const totalEmployees = employees.length
  const presentEmployees = useAppSelector((state) =>
    selectAttendanceCountByDateAndStatus(state, todayDate, "Present")
  )
  const absentEmployees = useAppSelector((state) =>
    selectAttendanceCountByDateAndStatus(state, todayDate, "Absent")
  )
  const lateEmployees = useAppSelector((state) =>
    selectAttendanceCountByDateAndStatus(state, todayDate, "Late")
  )
  const leaveRequests = useAppSelector(selectLeaveRequests)
  const totalLeaveRequests = leaveRequests.length
  const pendingLeaveRequests = useAppSelector((state) => selectLeaveCountByStatus(state, "Pending"))
  const approvedLeaveRequests = useAppSelector((state) => selectLeaveCountByStatus(state, "Approved"))
  const rejectedLeaveRequests = useAppSelector((state) => selectLeaveCountByStatus(state, "Rejected"))
  const totalCandidates = useAppSelector(selectTotalCandidates)
  const interviewScheduledCandidates = useAppSelector((state) =>
    selectCandidateCountByStatus(state, "Interview Scheduled")
  )
  const selectedCandidates = useAppSelector((state) => selectCandidateCountByStatus(state, "Selected"))
  const rejectedCandidates = useAppSelector((state) => selectCandidateCountByStatus(state, "Rejected"))
  const totalProjects = useAppSelector(selectTotalProjects)
  const activeProjects = useAppSelector(selectActiveProjectsCount)
  const completedProjects = useAppSelector((state) => selectProjectCountByStatus(state, "Completed"))
  const projectsOnHold = useAppSelector((state) => selectProjectCountByStatus(state, "On Hold"))
  const presentPercentage = totalEmployees > 0 ? (presentEmployees / totalEmployees) * 100 : 0
  const formattedPresentPercentage = presentPercentage.toFixed(1)

  // CRM Stats
  const totalClients = useAppSelector(selectTotalCustomersCount)
  const activeClients = useAppSelector(selectActiveClientsCount)
  const newLeads = useAppSelector(selectNewLeadsCount)
  const negotiations = useAppSelector(selectNegotiationsCount)

  // Assets Stats
  const totalAssets = useAppSelector(selectTotalAssetsCount)
  const assignedAssets = useAppSelector(selectAssignedAssetsCount)
  const availableAssets = useAppSelector(selectAvailableAssetsCount)
  const maintenanceAssets = useAppSelector(selectMaintenanceAssetsCount)

  // Settings Stats
  const totalDepartments = useAppSelector(selectTotalDepartmentsCount)
  const totalDesignations = useAppSelector(selectTotalDesignationsCount)
  const upcomingHolidays = useAppSelector(selectUpcomingHolidays)
  const companyProfile = useAppSelector(selectCompanyProfile)

  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Approve pending leave requests", dueDate: "Today, 5:00 PM", priority: "high", status: "pending" },
    { id: "2", title: "Conduct interview with Senior React Developer", dueDate: "Today, 3:00 PM", priority: "high", status: "pending" },
    { id: "3", title: "Review Q2 financial forecast spreadsheet", dueDate: "Tomorrow", priority: "medium", status: "pending" },
    { id: "4", title: "Verify hardware asset logs for new joiners", dueDate: "In 2 days", priority: "low", status: "pending" },
    { id: "5", title: "Update Kanban board for Project Chronos", dueDate: "In 3 days", priority: "medium", status: "pending" },
  ])

  const [activities] = useState<Activity[]>([
    { id: "1", user: "Sophia Miller", action: "submitted a leave request for", target: "Annual Leave (5 days)", time: "10 minutes ago", type: "hr", avatarInitials: "SM" },
    { id: "2", user: "Michael Chen", action: "updated milestone of project", target: "Chronos Portal v2.0", time: "42 minutes ago", type: "project", avatarInitials: "MC" },
    { id: "3", user: "Admin", action: "approved invoice payment to vendor for", target: "Office Cloud Servers", time: "2 hours ago", type: "finance", avatarInitials: "AD" },
    { id: "4", user: "Sarah Jenkins", action: "onboarded new employee", target: "John Doe (Developer)", time: "4 hours ago", type: "hr", avatarInitials: "SJ" },
    { id: "5", user: "Robert Frost", action: "closed premium sales lead with client", target: "Astra Corp", time: "1 day ago", type: "crm", avatarInitials: "RF" },
  ])

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: task.status === "pending" ? "completed" : "pending" } : task
      )
    )
  }

  // Quick Action handler alert/placeholder
  const handleQuickAction = (actionName: string) => {
    alert(`Quick Action Triggered: "${actionName}". This feature will be connected once the corresponding module is generated!`)
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Workspace Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Operational synopsis for today, {todayLabel}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm rounded-lg" onClick={() => handleQuickAction("Add Employee")}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Employees */}
        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Employees
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="flex items-center font-medium text-emerald-500 bg-emerald-500/10 px-1 rounded">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +8.2%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Present Today */}
        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Present Today
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentEmployees}<span className="text-xs font-normal text-muted-foreground">/{totalEmployees}</span></div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-emerald-500">{formattedPresentPercentage}%</span>
              <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${formattedPresentPercentage}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Absent Today */}
        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Absent Today
            </CardTitle>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <UserX className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absentEmployees}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-rose-500">
                {totalEmployees > 0 ? ((absentEmployees / totalEmployees) * 100).toFixed(1) : "0.0"}%
              </span>
              <span className="text-muted-foreground">of workforce</span>
            </div>
          </CardContent>
        </Card>

        {/* Late Today */}
        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Late Today
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lateEmployees}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="flex items-center font-medium text-amber-500 bg-amber-500/10 px-1 rounded">
                <Clock className="w-3 h-3 mr-0.5" />
                active logs
              </span>
              <span className="text-muted-foreground">today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Leave Requests
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Umbrella className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeaveRequests}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-blue-500">{leaveRequests.reduce((total, request) => total + request.days, 0)}</span>
              <span className="text-muted-foreground">total days requested</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Requests
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLeaveRequests}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-amber-500">awaiting review</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Approved Requests
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLeaveRequests}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-emerald-500">approved</span>
              <span className="text-muted-foreground">applications</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Rejected Requests
            </CardTitle>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <XCircle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedLeaveRequests}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-rose-500">declined</span>
              <span className="text-muted-foreground">applications</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Candidates
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <UserSearch className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCandidates}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-blue-500">active pipeline</span>
              <span className="text-muted-foreground">applicants</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Interview Scheduled
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <CalendarClock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewScheduledCandidates}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-purple-500">upcoming</span>
              <span className="text-muted-foreground">interviews</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Selected
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedCandidates}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-emerald-500">ready to hire</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Rejected
            </CardTitle>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <XCircle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCandidates}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-rose-500">declined</span>
              <span className="text-muted-foreground">applications</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Projects
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <FolderKanban className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-blue-500">registered</span>
              <span className="text-muted-foreground">initiatives</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Projects
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-emerald-500">in progress</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Completed Projects
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-purple-500">delivered</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Projects On Hold
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <PauseCircle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsOnHold}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-amber-500">paused</span>
              <span className="text-muted-foreground">initiatives</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CRM Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Clients
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Building2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-blue-500">CRM database</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Clients
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-emerald-500">paying customers</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              New Leads
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <MessageSquareShare className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newLeads}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-purple-500">prospects</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Negotiations
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Handshake className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{negotiations}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-amber-500">in discussion</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assets Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Assets
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Package className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-blue-500">inventory</span>
              <span className="text-muted-foreground">items</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Assigned Assets
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedAssets}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-purple-500">in use</span>
              <span className="text-muted-foreground">by employees</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Available Assets
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableAssets}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-emerald-500">ready for</span>
              <span className="text-muted-foreground">assignment</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card hover:translate-y-[-2px] transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Under Maintenance
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <PauseCircle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenanceAssets}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="font-semibold text-amber-500">requiring</span>
              <span className="text-muted-foreground">service</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Activities, Tasks & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Recent Activity (lg:col-span-7) */}
        <Card className="lg:col-span-7 glass-card shadow-sm rounded-xl overflow-hidden flex flex-col h-[400px]">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold text-foreground">Recent Activity</CardTitle>
                <CardDescription className="text-xs">Chronological timeline of system events</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                Live Feed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="flex gap-3 text-sm items-start relative group">
                {/* Visual Connector Dot */}
                <div className="relative flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs border border-border group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                    {act.avatarInitials}
                  </div>
                </div>
                <div className="flex-1 space-y-0.5 pt-0.5">
                  <p className="text-xs text-foreground">
                    <span className="font-semibold text-foreground">{act.user} </span>
                    <span className="text-muted-foreground">{act.action}</span>{" "}
                    <span className="font-medium text-foreground">{act.target}</span>
                  </p>
                  <span className="text-[10px] text-muted-foreground block">{act.time}</span>
                </div>
                {/* Side Tag Badge */}
                <Badge
                  variant="secondary"
                  className={`text-[9px] uppercase font-bold px-1.5 py-0 rounded ${
                    act.type === "hr"
                      ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10"
                      : act.type === "finance"
                      ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/10"
                      : act.type === "project"
                      ? "bg-purple-500/10 text-purple-500 hover:bg-purple-500/10"
                      : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10"
                  }`}
                >
                  {act.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Side: Upcoming Tasks (lg:col-span-5) */}
        <Card className="lg:col-span-5 glass-card shadow-sm rounded-xl overflow-hidden flex flex-col h-[400px]">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold text-foreground">Upcoming Tasks</CardTitle>
                <CardDescription className="text-xs">Your action items schedule</CardDescription>
              </div>
              <ListTodo className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task.id)}
                className={`flex gap-3 items-center p-2.5 rounded-lg border border-transparent hover:bg-muted/40 cursor-pointer transition-all duration-200 ${
                  task.status === "completed" ? "opacity-50" : ""
                }`}
              >
                {/* Task check icon */}
                {task.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded border border-muted-foreground/60 shrink-0 group-hover:border-primary" />
                )}

                {/* Task title */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium text-foreground truncate ${
                      task.status === "completed" ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <span className="text-[10px] text-muted-foreground block">{task.dueDate}</span>
                </div>

                {/* Priority Badge */}
                <Badge
                  className={`text-[8px] font-bold uppercase rounded px-1.5 py-0 ${
                    task.priority === "high"
                      ? "bg-destructive/15 text-destructive hover:bg-destructive/15"
                      : task.priority === "medium"
                      ? "bg-amber-500/15 text-amber-500 hover:bg-amber-500/15"
                      : "bg-blue-500/15 text-blue-500 hover:bg-blue-500/15"
                  }`}
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <Card className="glass-card shadow-sm rounded-xl">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-base font-bold text-foreground">Quick Management Actions</CardTitle>
          <CardDescription className="text-xs">Immediate short-cuts for core operational flows</CardDescription>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Button
            variant="outline"
            onClick={() => handleQuickAction("Record Attendance")}
            className="flex flex-col items-center justify-center p-6 h-auto border-border/70 hover:border-primary/50 hover:bg-primary/5 rounded-xl group transition-all duration-200"
          >
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Record Attendance</span>
            <span className="text-[9px] text-muted-foreground mt-0.5 text-center">Clock-in team logs</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleQuickAction("Request Leave")}
            className="flex flex-col items-center justify-center p-6 h-auto border-border/70 hover:border-primary/50 hover:bg-primary/5 rounded-xl group transition-all duration-200"
          >
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Request Leave</span>
            <span className="text-[9px] text-muted-foreground mt-0.5 text-center">Submit leave request</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleQuickAction("Create Project")}
            className="flex flex-col items-center justify-center p-6 h-auto border-border/70 hover:border-primary/50 hover:bg-primary/5 rounded-xl group transition-all duration-200"
          >
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform mb-3">
              <FolderKanban className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Create Project</span>
            <span className="text-[9px] text-muted-foreground mt-0.5 text-center">Open kanban workflow</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => handleQuickAction("Generate Invoice")}
            className="flex flex-col items-center justify-center p-6 h-auto border-border/70 hover:border-primary/50 hover:bg-primary/5 rounded-xl group transition-all duration-200"
          >
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform mb-3">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-foreground">Generate Invoice</span>
            <span className="text-[9px] text-muted-foreground mt-0.5 text-center">Process client payments</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
