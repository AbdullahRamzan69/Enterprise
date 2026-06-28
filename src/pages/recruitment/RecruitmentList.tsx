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
  UserX,
  X,
  ArrowUpDown,
  Briefcase,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { deleteCandidate } from "@/features/recruitment/recruitmentSlice"
import { selectCandidates } from "@/features/recruitment/recruitmentSelectors"
import type { Candidate, CandidateStatus } from "@/features/recruitment/recruitmentTypes"
import { CANDIDATE_STATUSES } from "@/features/recruitment/recruitmentTypes"

const ITEMS_PER_PAGE = 6

type SortOrder = "newest" | "oldest"

const getStatusDotClass = (status: CandidateStatus) => {
  if (status === "Selected") return "bg-emerald-500"
  if (status === "Rejected") return "bg-rose-500"
  if (status === "Interview Scheduled" || status === "Interviewed") return "bg-blue-500"
  if (status === "Screening") return "bg-amber-500"
  return "bg-zinc-400"
}

const formatSalary = (salary: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(salary)

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

export default function RecruitmentList() {
  const dispatch = useAppDispatch()
  const candidates = useAppSelector(selectCandidates)
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "All">("All")
  const [deptFilter, setDeptFilter] = useState("All")
  const [positionFilter, setPositionFilter] = useState("All")
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Candidate | null>(null)

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(candidates.map((candidate) => candidate.department)))],
    [candidates]
  )
  const positions = useMemo(
    () => ["All", ...Array.from(new Set(candidates.map((candidate) => candidate.position)))],
    [candidates]
  )
  const statuses: Array<CandidateStatus | "All"> = ["All", ...CANDIDATE_STATUSES]

  const filteredCandidates = useMemo(() => {
    const filtered = candidates.filter((candidate) => {
      const matchesSearch =
        candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "All" || candidate.status === statusFilter
      const matchesDept = deptFilter === "All" || candidate.department === deptFilter
      const matchesPosition = positionFilter === "All" || candidate.position === positionFilter

      return matchesSearch && matchesStatus && matchesDept && matchesPosition
    })

    return filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.appliedDate.localeCompare(a.appliedDate)
      }
      return a.appliedDate.localeCompare(b.appliedDate)
    })
  }, [candidates, searchTerm, statusFilter, deptFilter, positionFilter, sortOrder])

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE)
  const paginatedCandidates = filteredCandidates.slice(
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
      dispatch(deleteCandidate(deleteTarget.id))
      setDeleteTarget(null)
      const updatedTotalPages = Math.ceil((filteredCandidates.length - 1) / ITEMS_PER_PAGE)

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
            Recruitment Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track candidates, interview stages, and hiring decisions.
          </p>
        </div>
        <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm rounded-lg text-xs">
          <Link to="/recruitment/new">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Candidate
          </Link>
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-3.5 bg-card border border-border/60 p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search name, email, position, ID..."
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
            <DropdownMenuContent align="end" className="glass-panel min-w-[160px] rounded-lg">
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
                <span>{deptFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel min-w-[140px] rounded-lg">
              {departments.map((dept) => (
                <DropdownMenuItem
                  key={dept}
                  onClick={() => {
                    setDeptFilter(dept)
                    resetPage()
                  }}
                  className="cursor-pointer text-xs rounded-md"
                >
                  {dept}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[140px]">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="truncate max-w-[100px]">{positionFilter === "All" ? "Position" : positionFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel min-w-[180px] max-h-[240px] overflow-y-auto rounded-lg">
              {positions.map((position) => (
                <DropdownMenuItem
                  key={position}
                  onClick={() => {
                    setPositionFilter(position)
                    resetPage()
                  }}
                  className="cursor-pointer text-xs rounded-md"
                >
                  {position}
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
                <th className="py-3 px-4">Candidate ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Expected Salary</th>
                <th className="py-3 px-4">Applied</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {paginatedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <UserX className="w-8 h-8 text-muted-foreground/50" />
                      <p className="font-semibold text-sm text-foreground">No candidates found</p>
                      <p className="text-xs max-w-xs leading-normal">
                        Adjust your search or filters to locate matching candidate profiles.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">{candidate.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7 border border-border/50">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                            {getInitials(candidate.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-none">
                            {candidate.fullName}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{candidate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground truncate max-w-[120px]">{candidate.position}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-medium bg-muted/30 border-border/80">
                        {candidate.department}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{candidate.experience} yrs</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{formatSalary(candidate.expectedSalary)}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{candidate.appliedDate}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(candidate.status)}`} />
                        <span className="font-medium text-foreground">{candidate.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/recruitment/${candidate.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/recruitment/edit/${candidate.id}`)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md"
                          onClick={() => setDeleteTarget(candidate)}
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

        {filteredCandidates.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-border/50 bg-muted/10 text-xs">
            <span className="text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredCandidates.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredCandidates.length}</span> candidates
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
            <DialogTitle className="text-foreground">Delete Candidate Record</DialogTitle>
            <DialogDescription className="text-xs leading-normal">
              Are you sure you want to permanently delete the profile of{" "}
              <span className="font-bold text-foreground">{deleteTarget?.fullName}</span> ({deleteTarget?.id})? This
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
              Delete Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
