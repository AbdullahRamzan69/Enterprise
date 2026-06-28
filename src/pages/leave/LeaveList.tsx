import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  Filter,
  Plus,
  Search,
  Trash2,
  Umbrella,
  X,
  XCircle,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { approveLeave, deleteLeave, rejectLeave } from "@/features/leave/leaveSlice"
import { selectLeaveRequests } from "@/features/leave/leaveSelectors"
import type { LeaveRequest, LeaveStatus, LeaveType } from "@/features/leave/leaveTypes"

const ITEMS_PER_PAGE = 6
const LEAVE_TYPES: Array<LeaveType | "All"> = ["All", "Annual", "Sick", "Casual", "Unpaid"]
const STATUSES: Array<LeaveStatus | "All"> = ["All", "Pending", "Approved", "Rejected"]

const getStatusClass = (status: LeaveStatus) => {
  if (status === "Approved") return "bg-emerald-500"
  if (status === "Rejected") return "bg-rose-500"
  return "bg-amber-500"
}

export default function LeaveList() {
  const dispatch = useAppDispatch()
  const requests = useAppSelector(selectLeaveRequests)
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<LeaveType | "All">("All")
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "All">("All")
  const [startDateFilter, setStartDateFilter] = useState("")
  const [endDateFilter, setEndDateFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<LeaveRequest | null>(null)

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "All" || request.leaveType === typeFilter
    const matchesStatus = statusFilter === "All" || request.status === statusFilter
    const matchesStart = !startDateFilter || request.endDate >= startDateFilter
    const matchesEnd = !endDateFilter || request.startDate <= endDateFilter

    return matchesSearch && matchesType && matchesStatus && matchesStart && matchesEnd
  })

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const resetPage = () => setCurrentPage(1)

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteLeave(deleteTarget.id))
      setDeleteTarget(null)
      const updatedTotalPages = Math.ceil((filteredRequests.length - 1) / ITEMS_PER_PAGE)

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
            Leave Requests
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review, approve, and manage employee leave applications.
          </p>
        </div>
        <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm rounded-lg text-xs">
          <Link to="/leave/new">
            <Plus className="w-4 h-4 mr-1.5" />
            New Request
          </Link>
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-3.5 bg-card border border-border/60 p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employee name..."
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
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{typeFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel min-w-[140px] rounded-lg">
              {LEAVE_TYPES.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => {
                    setTypeFilter(type)
                    resetPage()
                  }}
                  className="cursor-pointer text-xs rounded-md"
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[120px]">
                <Umbrella className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{statusFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel min-w-[140px] rounded-lg">
              {STATUSES.map((status) => (
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

          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="date"
              value={startDateFilter}
              onChange={(event) => {
                setStartDateFilter(event.target.value)
                resetPage()
              }}
              className="pl-9 w-[160px] bg-muted/20 border-border/80 rounded-lg text-xs font-mono"
            />
          </div>

          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="date"
              value={endDateFilter}
              onChange={(event) => {
                setEndDateFilter(event.target.value)
                resetPage()
              }}
              className="pl-9 w-[160px] bg-muted/20 border-border/80 rounded-lg text-xs font-mono"
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Applied</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Umbrella className="w-8 h-8 text-muted-foreground/50" />
                      <p className="font-semibold text-sm text-foreground">No leave requests found</p>
                      <p className="text-xs max-w-xs leading-normal">
                        Adjust the employee, type, status, or date filters to locate matching leave applications.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">{request.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-foreground">{request.employeeName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{request.employeeId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{request.leaveType}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">
                      {request.startDate} - {request.endDate}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{request.days}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{request.appliedAt}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusClass(request.status)}`} />
                        <span className="font-medium text-foreground">{request.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/leave/${request.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/leave/edit/${request.id}`)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={request.status === "Approved"}
                          className="h-8 w-8 hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-500 rounded-md disabled:opacity-40"
                          onClick={() => dispatch(approveLeave(request.id))}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={request.status === "Rejected"}
                          className="h-8 w-8 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 rounded-md disabled:opacity-40"
                          onClick={() => dispatch(rejectLeave(request.id))}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md"
                          onClick={() => setDeleteTarget(request)}
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

        {filteredRequests.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-border/50 bg-muted/10 text-xs">
            <span className="text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredRequests.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredRequests.length}</span> requests
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
            <DialogTitle className="text-foreground">Delete Leave Request</DialogTitle>
            <DialogDescription className="text-xs leading-normal">
              Are you sure you want to delete the leave request for{" "}
              <span className="font-bold text-foreground">{deleteTarget?.employeeName}</span>? This action cannot be undone.
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
              Delete Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

