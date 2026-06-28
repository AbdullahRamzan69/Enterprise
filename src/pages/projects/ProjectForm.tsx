import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, Save, Search, X } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { addProject, updateProject } from "@/features/projects/projectSlice"
import { selectProjectById, selectProjects } from "@/features/projects/projectSelectors"
import {
  isEndDateBeforeStart,
  isProjectCodeUnique,
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  type Project,
} from "@/features/projects/projectTypes"
import { selectEmployees } from "@/features/employees/employeeSelectors"

type ProjectFormData = Omit<Project, "budget" | "progress"> & {
  budget: string
  progress: string
}

const createProjectFormData = (projects: Project[], project?: Project): ProjectFormData => {
  if (project) {
    return {
      ...project,
      budget: project.budget.toString(),
      progress: project.progress.toString(),
    }
  }

  const ids = projects
    .map((item) => parseInt(item.id.replace("PRJ-", ""), 10))
    .filter((num) => !isNaN(num))
  const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 2001
  const today = new Date().toISOString().split("T")[0]

  return {
    id: `PRJ-${nextIdNum}`,
    name: "",
    code: "",
    description: "",
    client: "",
    managerId: "",
    managerName: "",
    assignedEmployees: [],
    status: "Planning",
    priority: "Medium",
    startDate: today,
    endDate: today,
    budget: "",
    progress: "0",
  }
}

export default function ProjectForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const projects = useAppSelector(selectProjects)
  const employees = useAppSelector(selectEmployees)
  const project = useAppSelector((state) => (id ? selectProjectById(state, id) : undefined))

  const isEditMode = !!id
  const error =
    isEditMode && id && !project
      ? `Project with ID "${id}" was not found in the registry.`
      : ""

  const [formData, setFormData] = useState<ProjectFormData>(() =>
    createProjectFormData(projects, project)
  )
  const [employeeSearch, setEmployeeSearch] = useState("")

  const filteredEmployees = useMemo(() => {
    const term = employeeSearch.toLowerCase()
    return employees.filter(
      (employee) =>
        employee.fullName.toLowerCase().includes(term) ||
        employee.id.toLowerCase().includes(term) ||
        employee.department.toLowerCase().includes(term)
    )
  }, [employees, employeeSearch])

  const handleManagerChange = (managerId: string) => {
    const selectedManager = employees.find((employee) => employee.id === managerId)

    setFormData((prev) => ({
      ...prev,
      managerId,
      managerName: selectedManager?.fullName ?? "",
    }))
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    if (name === "managerId") {
      handleManagerChange(value)
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const toggleEmployeeAssignment = (employeeId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedEmployees: prev.assignedEmployees.includes(employeeId)
        ? prev.assignedEmployees.filter((id) => id !== employeeId)
        : [...prev.assignedEmployees, employeeId],
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.name.trim()) return alert("Project Name is required.")
    if (!formData.code.trim()) return alert("Project Code is required.")
    if (!isProjectCodeUnique(formData.code, projects, isEditMode ? formData.id : undefined)) {
      return alert("Project code must be unique.")
    }
    if (!formData.description.trim()) return alert("Description is required.")
    if (!formData.client.trim()) return alert("Client is required.")
    if (!formData.managerId || !formData.managerName) return alert("Manager is required.")
    if (!formData.startDate) return alert("Start Date is required.")
    if (!formData.endDate) return alert("End Date is required.")
    if (isEndDateBeforeStart(formData.startDate, formData.endDate)) {
      return alert("End date cannot be before start date.")
    }
    if (!formData.budget.trim() || isNaN(Number(formData.budget))) {
      return alert("Please enter a valid budget amount.")
    }
    if (Number(formData.budget) <= 0) return alert("Budget must be greater than zero.")

    const progress = Number(formData.progress)
    const payload: Project = {
      ...formData,
      budget: Number(formData.budget),
      progress: isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress)),
      status: progress >= 100 ? "Completed" : formData.status,
    }

    if (isEditMode) {
      dispatch(updateProject({ id: formData.id, updated: payload }))
    } else {
      dispatch(addProject(payload))
    }

    navigate("/projects")
  }

  if (error) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Project Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">{error}</p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/projects">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Return to Projects
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
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
            {isEditMode ? "Modify Project" : "Create New Project"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEditMode ? `Updating project records for ${formData.name}` : "Define scope, timeline, and team for a new initiative."}
          </p>
        </div>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 max-w-4xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isEditMode ? "Edit Project Details" : "New Project Information"}
              </CardTitle>
              <CardDescription className="text-xs">
                Fill all required fields to register the project in the central registry.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
              {formData.id}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Project Name <span className="text-destructive">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Chronos Portal v2.0"
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Project Code <span className="text-destructive">*</span>
                </label>
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. CHR-2026"
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono uppercase"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief overview of project scope and objectives."
                  required
                  rows={3}
                  className="flex w-full rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Client <span className="text-destructive">*</span>
                </label>
                <Input
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="e.g. Aethel Internal"
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Manager <span className="text-destructive">*</span>
                </label>
                <select
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleChange}
                  required
                  className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select manager</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.fullName} ({employee.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                >
                  {PROJECT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                >
                  {PROJECT_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Budget ($ USD) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. 150000"
                  required
                  min="1"
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Start Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  End Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Assign Employees
                </label>
                <div className="border border-border/80 rounded-lg bg-muted/10 overflow-hidden">
                  <div className="relative border-b border-border/60 p-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search employees by name, ID, or department..."
                      value={employeeSearch}
                      onChange={(event) => setEmployeeSearch(event.target.value)}
                      className="pl-9 h-8 bg-muted/20 border-border/80 rounded-md text-xs"
                    />
                    {employeeSearch && (
                      <button
                        type="button"
                        onClick={() => setEmployeeSearch("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="max-h-[180px] overflow-y-auto p-2 space-y-1">
                    {filteredEmployees.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No employees match your search.</p>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <label
                          key={employee.id}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-muted/40 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.assignedEmployees.includes(employee.id)}
                            onChange={() => toggleEmployeeAssignment(employee.id)}
                            className="rounded border-border/80"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{employee.fullName}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {employee.id} · {employee.department}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                  {formData.assignedEmployees.length > 0 && (
                    <div className="border-t border-border/60 px-3 py-2 bg-muted/20">
                      <p className="text-[10px] text-muted-foreground">
                        {formData.assignedEmployees.length} employee{formData.assignedEmployees.length === 1 ? "" : "s"} selected
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg"
              >
                <Link to="/projects">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isEditMode ? "Save Changes" : "Create Project"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
