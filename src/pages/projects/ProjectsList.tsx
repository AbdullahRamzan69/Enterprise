import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  X,
  ArrowUpDown,
  UserRound,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteProject } from "@/features/projects/projectSlice"
import { selectProjects } from "@/features/projects/projectSelectors"
import type { Project, ProjectPriority, ProjectStatus } from "@/features/projects/projectTypes"
import { PROJECT_PRIORITIES, PROJECT_STATUSES } from "@/features/projects/projectTypes"

const ITEMS_PER_PAGE = 6

type SortOrder = "newest" | "oldest"

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

export default function ProjectsList() {
  const dispatch = useAppDispatch()
  const projects = useAppSelector(selectProjects)
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">("All")
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | "All">("All")
  const [managerFilter, setManagerFilter] = useState("All")
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  const managers = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.managerName)))],
    [projects]
  )
  const statuses: Array<ProjectStatus | "All"> = ["All", ...PROJECT_STATUSES]
  const priorities: Array<ProjectPriority | "All"> = ["All", ...PROJECT_PRIORITIES]

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.managerName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "All" || project.status === statusFilter
      const matchesPriority = priorityFilter === "All" || project.priority === priorityFilter
      const matchesManager = managerFilter === "All" || project.managerName === managerFilter

      return matchesSearch && matchesStatus && matchesPriority && matchesManager
    })

    return filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.startDate.localeCompare(a.startDate)
      }
      return a.startDate.localeCompare(b.startDate)
    })
  }, [projects, searchTerm, statusFilter, priorityFilter, managerFilter, sortOrder])

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const resetPage = () => setCurrentPage(1)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteProject(deleteTarget.id))
      setDeleteTarget(null)
      const updatedTotalPages = Math.ceil((filteredProjects.length - 1) / ITEMS_PER_PAGE)

      if (currentPage > updatedTotalPages && currentPage > 1) {
        setCurrentPage(updatedTotalPages)
      }
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Project Registry
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage project portfolios, timelines, budgets, and team assignments.
          </p>
        </div>
        <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm rounded-lg text-xs">
          <Link to="/projects/new">
            <Plus className="w-4 h-4 mr-1.5" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-3.5 bg-card border border-border/60 p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search name, code, client, manager..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value)
              resetPage()
            }}
            className="pl-9 bg-muted/20 border-border/80 rounded-lg text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("")
                resetPage()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[120px]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{statusFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel min-w-[140px] rounded-lg">
              {statuses.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => {
                    setStatusFilter(status)
                    resetPage()
                  }}
                  className="cursor-pointer text-xs rounded-md"
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[120px]">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{priorityFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel min-w-[120px] rounded-lg">
              {priorities.map((priority) => (
                <DropdownMenuItem
                  key={priority}
                  onClick={() => {
                    setPriorityFilter(priority)
                    resetPage()
                  }}
                  className="cursor-pointer text-xs rounded-md"
                >
                  {priority}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[130px]">
                <UserRound className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="truncate max-w-[90px]">{managerFilter === "All" ? "Manager" : managerFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel min-w-[160px] max-h-[240px] overflow-y-auto rounded-lg">
              {managers.map((manager) => (
                <DropdownMenuItem
                  key={manager}
                  onClick={() => {
                    setManagerFilter(manager)
                    resetPage()
                  }}
                  className="cursor-pointer text-xs rounded-md"
                >
                  {manager}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[130px]">
                <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel min-w-[140px] rounded-lg">
              <DropdownMenuItem
                onClick={() => {
                  setSortOrder("newest")
                  resetPage()
                }}
                className="cursor-pointer text-xs rounded-md"
              >
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortOrder("oldest")
                  resetPage()
                }}
                className="cursor-pointer text-xs rounded-md"
              >
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Manager</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <FolderKanban className="w-8 h-8 text-muted-foreground/50" />
                      <p className="font-semibold text-sm text-foreground">No projects found</p>
                      <p className="text-xs max-w-xs leading-normal">
                        Adjust your search or filters to locate matching project records.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-foreground truncate max-w-[140px]">{project.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{project.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-foreground">{project.code}</td>
                    <td className="py-3 px-4 text-muted-foreground truncate max-w-[100px]">{project.client}</td>
                    <td className="py-3 px-4 text-muted-foreground truncate max-w-[100px]">{project.managerName}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{project.startDate}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{formatBudget(project.budget)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`text-[9px] font-bold uppercase rounded px-1.5 py-0 ${getPriorityClass(project.priority)}`}>
                        {project.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(project.status)}`} />
                        <span className="font-medium text-foreground">{project.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/projects/edit/${project.id}`)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md"
                          onClick={() => setDeleteTarget(project)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredProjects.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-border/50 bg-muted/10 text-xs">
            <span className="text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredProjects.length}</span> projects
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="h-8 w-8 rounded-lg border-border/80"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-muted-foreground font-medium px-2">
                Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
                <span className="font-semibold text-foreground">{totalPages}</span>
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="h-8 w-8 rounded-lg border-border/80"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="glass-panel max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Project Record</DialogTitle>
            <DialogDescription className="text-xs leading-normal">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-foreground">{deleteTarget?.name}</span> ({deleteTarget?.code})? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
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
