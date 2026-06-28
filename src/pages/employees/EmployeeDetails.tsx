import { Link, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, Edit2, FolderKanban, Mail, Phone, UserRound, Building2 } from "lucide-react"
import { useAppSelector } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { selectEmployeeById } from "@/features/employees/employeeSelectors"
import type { Employee } from "@/features/employees/employeeTypes"
import {
  selectApprovedLeaveCountByEmployeeId,
  selectApprovedLeaveDaysByEmployeeId,
  selectPendingLeaveCountByEmployeeId,
} from "@/features/leave/leaveSelectors"
import { selectProjectsByEmployeeId } from "@/features/projects/projectSelectors"
import { selectCustomersByAssignedEmployee } from "@/features/crm/crmSelectors"

const formatSalary = (salary: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(salary)

const getStatusDotClass = (status: Employee["status"]) => {
  if (status === "Active") return "bg-emerald-500"
  if (status === "On Leave") return "bg-amber-500"
  if (status === "Resigned") return "bg-rose-500"
  return "bg-zinc-400"
}

const detailRows = (employee: Employee) => [
  { label: "Full Name", value: employee.fullName },
  { label: "Employee ID", value: employee.id, mono: true },
  { label: "Email", value: employee.email },
  { label: "Phone", value: employee.phone },
  { label: "Department", value: employee.department },
  { label: "Designation", value: employee.designation },
  { label: "Employment Type", value: employee.employmentType },
  { label: "Joining Date", value: employee.joiningDate, mono: true },
  { label: "Salary", value: formatSalary(employee.salary), mono: true },
  { label: "Address", value: employee.address, wide: true },
]

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>()
  const employee = useAppSelector((state) => (id ? selectEmployeeById(state, id) : undefined))
  const totalLeavesTaken = useAppSelector((state) =>
    employee ? selectApprovedLeaveDaysByEmployeeId(state, employee.id) : 0
  )
  const pendingLeaves = useAppSelector((state) =>
    employee ? selectPendingLeaveCountByEmployeeId(state, employee.id) : 0
  )
  const approvedLeaves = useAppSelector((state) =>
    employee ? selectApprovedLeaveCountByEmployeeId(state, employee.id) : 0
  )
  const assignedProjects = useAppSelector((state) =>
    employee ? selectProjectsByEmployeeId(state, employee.id) : []
  )
  const managedClients = useAppSelector((state) =>
    employee ? selectCustomersByAssignedEmployee(state, employee.id) : []
  )

  if (!employee) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Employee Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">
            We could not find an employee record for ID "{id}". The profile may have been removed or the link may be invalid.
          </p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/employees">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Employees
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-8 w-8 rounded-lg border-border/80 text-muted-foreground hover:text-foreground shrink-0"
          >
            <Link to="/employees">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Employee Profile
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Personnel record and employment details for {employee.fullName}.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg">
            <Link to="/employees">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Employees
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm">
            <Link to={`/employees/edit/${employee.id}`}>
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit Employee
            </Link>
          </Button>
        </div>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 max-w-5xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-border/50">
                <UserRound className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">{employee.fullName}</CardTitle>
                <CardDescription className="text-xs">
                  {employee.designation} in {employee.department}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
                {employee.id}
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground border border-border/70 rounded px-2 py-1 bg-muted/20">
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(employee.status)}`} />
                {employee.status}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>{employee.phone}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {detailRows(employee).map((row) => (
              <div key={row.label} className={`space-y-1.5 ${row.wide ? "md:col-span-2" : ""}`}>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {row.label}
                </p>
                <p className={`text-sm font-medium text-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2 ${row.mono ? "font-mono" : ""}`}>
                  {row.value}
                </p>
              </div>
            ))}

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </p>
              <p className="text-sm font-medium text-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2 inline-flex items-center gap-1.5 w-full">
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(employee.status)}`} />
                {employee.status}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card shadow-sm border border-border/60 max-w-5xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <CardTitle className="text-base font-bold text-foreground">Leave Summary</CardTitle>
          <CardDescription className="text-xs">
            Time-off totals linked to this employee profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-border/60 rounded-lg bg-muted/10 px-4 py-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Total Leaves Taken
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalLeavesTaken}</p>
            </div>
            <div className="border border-border/60 rounded-lg bg-muted/10 px-4 py-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Pending Leaves
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">{pendingLeaves}</p>
            </div>
            <div className="border border-border/60 rounded-lg bg-muted/10 px-4 py-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Approved Leaves
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">{approvedLeaves}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card shadow-sm border border-border/60 max-w-5xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <CardTitle className="text-base font-bold text-foreground">Projects Assigned</CardTitle>
          <CardDescription className="text-xs">
            Projects where this employee is assigned as a team member or manager.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {assignedProjects.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No projects assigned to this employee.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assignedProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="flex items-center gap-3 border border-border/60 rounded-lg bg-muted/10 px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-border/50">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">{project.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {project.code} · {project.status}
                      {project.managerId === employee.id && " · Manager"}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">{project.progress}%</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card shadow-sm border border-border/60 max-w-5xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <CardTitle className="text-base font-bold text-foreground">Clients Managed</CardTitle>
          <CardDescription className="text-xs">
            CRM client accounts assigned to this employee.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {managedClients.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No clients assigned to this employee.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {managedClients.map((client) => (
                <Link
                  key={client.id}
                  to={`/crm/${client.id}`}
                  className="flex items-center gap-3 border border-border/60 rounded-lg bg-muted/10 px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-border/50">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">{client.companyName}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {client.status} · {client.industry}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
