import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Edit2,
  FolderKanban,
  Trash2,
  Users,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { selectEmployees } from "@/features/employees/employeeSelectors"
import { deleteProject, updateProjectProgress } from "@/features/projects/projectSlice"
import { selectProjectById } from "@/features/projects/projectSelectors"
import type { Project, ProjectPriority, ProjectStatus } from "@/features/projects/projectTypes"

const formatBudget = (budget: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(budget)

const getStatusDotClass = (status: ProjectStatus) => {
  if (status === "Completed") return "bg-emerald-500"
  if (status === "In Progress") return "bg-blue-500"
  if (status === "On Hold") return "bg-amber-500"
  if (status === "Cancelled") return "bg-rose-500"
  return "bg-zinc-400"
}

const getPriorityClass = (priority: ProjectPriority) => {
  if (priority === "High") return "bg-destructive/15 text-destructive"
  if (priority === "Medium") return "bg-amber-500/15 text-amber-500"
  return "bg-blue-500/15 text-blue-500"
}

const detailRows = (project: Project) => [
  { label: "Project Name", value: project.name },
  { label: "Project ID", value: project.id, mono: true },
  { label: "Project Code", value: project.code, mono: true },
  { label: "Client", value: project.client },
  { label: "Manager", value: `${project.managerName} (${project.managerId})` },
  { label: "Budget", value: formatBudget(project.budget), mono: true },
  { label: "Priority", value: project.priority },
  { label: "Status", value: project.status },
  { label: "Description", value: project.description, wide: true },
]

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const project = useAppSelector((state) => (id ? selectProjectById(state, id) : undefined))
  const employees = useAppSelector(selectEmployees)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [progressInput, setProgressInput] = useState(project?.progress.toString() ?? "0")

  if (!project) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Project Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">
            We could not find a project record for ID "{id}". The project may have been removed or the link may be invalid.
          </p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/projects">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const assignedEmployeeDetails = project.assignedEmployees
    .map((employeeId) => employees.find((employee) => employee.id === employeeId))
    .filter(Boolean)

  const handleDelete = () => {
    dispatch(deleteProject(project.id))
    navigate("/projects")
  }

  const handleProgressUpdate = () => {
    const progress = Number(progressInput)

    if (isNaN(progress) || progress < 0 || progress > 100) {
      return alert("Progress must be a number between 0 and 100.")
    }

    const clampedProgress = Math.min(100, Math.max(0, progress))
    dispatch(updateProjectProgress({ id: project.id, progress: clampedProgress }))
    setProgressInput(clampedProgress.toString())
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
            <Link to="/projects">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Project Details
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Scope, timeline, and team overview for {project.name}.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg">
            <Link to="/projects">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="border-border/80 hover:bg-destructive/10 hover:text-destructive text-foreground text-xs rounded-lg"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm">
            <Link to={`/projects/edit/${project.id}`}>
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 max-w-5xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-border/50">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">{project.name}</CardTitle>
                <CardDescription className="text-xs">
                  {project.code} · {project.client}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
                {project.id}
              </Badge>
              <Badge className={`text-[9px] font-bold uppercase rounded px-1.5 py-0 ${getPriorityClass(project.priority)}`}>
                {project.priority}
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground border border-border/70 rounded px-2 py-1 bg-muted/20">
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(project.status)}`} />
                {project.status}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              <span className="font-mono">{project.startDate} → {project.endDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <Users className="w-4 h-4 text-primary" />
              <span>{assignedEmployeeDetails.length} team member{assignedEmployeeDetails.length === 1 ? "" : "s"} assigned</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {detailRows(project).map((row) => (
              <div key={row.label} className={`space-y-1.5 ${row.wide ? "md:col-span-2" : ""}`}>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {row.label}
                </p>
                <p className={`text-sm font-medium text-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2 ${row.mono ? "font-mono" : ""}`}>
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card shadow-sm border border-border/60 max-w-5xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <CardTitle className="text-base font-bold text-foreground">Timeline & Progress</CardTitle>
          <CardDescription className="text-xs">
            Project schedule and completion tracking. Setting progress to 100% automatically marks the project as Completed.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-border/60 rounded-lg bg-muted/10 px-4 py-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Start Date</p>
              <p className="text-lg font-bold text-foreground mt-1 font-mono">{project.startDate}</p>
            </div>
            <div className="border border-border/60 rounded-lg bg-muted/10 px-4 py-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">End Date</p>
              <p className="text-lg font-bold text-foreground mt-1 font-mono">{project.endDate}</p>
            </div>
            <div className="border border-border/60 rounded-lg bg-muted/10 px-4 py-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Budget</p>
              <p className="text-lg font-bold text-foreground mt-1 font-mono">{formatBudget(project.budget)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Progress
              </p>
              <span className="text-sm font-bold text-foreground font-mono">{project.progress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="flex flex-wrap items-end gap-2 pt-2">
              <div className="space-y-1.5 flex-1 min-w-[120px] max-w-[160px]">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Update Progress (0–100)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={progressInput}
                  onChange={(event) => setProgressInput(event.target.value)}
                  className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono h-8"
                />
              </div>
              <Button
                size="sm"
                onClick={handleProgressUpdate}
                className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg h-8"
              >
                Update Progress
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card shadow-sm border border-border/60 max-w-5xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <CardTitle className="text-base font-bold text-foreground">Assigned Employees</CardTitle>
          <CardDescription className="text-xs">
            Team members linked to this project.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {assignedEmployeeDetails.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No employees assigned to this project.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assignedEmployeeDetails.map((employee) => (
                <Link
                  key={employee!.id}
                  to={`/employees/${employee!.id}`}
                  className="flex items-center gap-3 border border-border/60 rounded-lg bg-muted/10 px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border border-border/50">
                    {employee!.fullName.split(" ").map((part) => part[0]).join("").substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{employee!.fullName}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {employee!.id} · {employee!.designation}
                      {employee!.id === project.managerId && " · Manager"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="glass-panel max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Project Record</DialogTitle>
            <DialogDescription className="text-xs leading-normal">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-foreground">{project.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/95 text-destructive-foreground text-xs rounded-lg shadow-sm"
            >
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
