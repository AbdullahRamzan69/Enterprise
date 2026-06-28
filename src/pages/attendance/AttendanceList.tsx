import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  Filter,
  Plus,
  Search,
  TimerOff,
  Trash2,
  X,
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
import { deleteAttendance } from "@/features/attendance/attendanceSlice"
import { selectAttendanceRecords } from "@/features/attendance/attendanceSelectors"
import { calculateWorkingHours, type AttendanceRecord, type AttendanceStatus } from "@/features/attendance/attendanceTypes"

const ITEMS_PER_PAGE = 6
const STATUSES: Array<AttendanceStatus | "All"> = ["All", "Present", "Absent", "Late", "Half Day"]

const getStatusClass = (status: AttendanceStatus) => {
  if (status === "Present") return "bg-emerald-500"
  if (status === "Absent") return "bg-rose-500"
  if (status === "Late") return "bg-amber-500"
  return "bg-blue-500"
}

export default function AttendanceList() {
  const dispatch = useAppDispatch()
  const records = useAppSelector(selectAttendanceRecords)
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "All">("All")
  const [dateFilter, setDateFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<AttendanceRecord | null>(null)

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || record.status === statusFilter
    const matchesDate = !dateFilter || record.date === dateFilter

    return matchesSearch && matchesStatus && matchesDate
  })

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE)
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: AttendanceStatus | "All") => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value)
    setCurrentPage(1)
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteAttendance(deleteTarget.id))
      setDeleteTarget(null)
      const updatedTotalPages = Math.ceil((filteredRecords.length - 1) / ITEMS_PER_PAGE)

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
            Attendance Register
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor daily clock-ins, work sessions, and attendance exceptions.
          </p>
        </div>
        <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm rounded-lg text-xs">
          <Link to="/attendance/new">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Attendance
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3.5 bg-card border border-border/60 p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employee name..."
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="pl-9 bg-muted/20 border-border/80 rounded-lg text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[130px]">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{statusFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel min-w-[140px] rounded-lg">
              {STATUSES.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusFilterChange(status)}
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
              value={dateFilter}
              onChange={(event) => handleDateFilterChange(event.target.value)}
              className="pl-9 w-[160px] bg-muted/20 border-border/80 rounded-lg text-xs font-mono"
            />
          </div>

          {dateFilter && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDateFilterChange("")}
              className="h-9 w-9 rounded-lg border-border/80 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <TimerOff className="w-8 h-8 text-muted-foreground/50" />
                      <p className="font-semibold text-sm text-foreground">No attendance records found</p>
                      <p className="text-xs max-w-xs leading-normal">
                        Adjust the search, date, or status filters to find matching attendance logs.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">{record.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-foreground">{record.employeeName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{record.employeeId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{record.date}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{record.checkIn}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono">{record.checkOut}</td>
                    <td className="py-3 px-4 text-muted-foreground">{calculateWorkingHours(record.checkIn, record.checkOut)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusClass(record.status)}`} />
                        <span className="font-medium text-foreground">{record.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/attendance/${record.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/attendance/edit/${record.id}`)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md"
                          onClick={() => setDeleteTarget(record)}
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

        {filteredRecords.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-border/50 bg-muted/10 text-xs">
            <span className="text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredRecords.length}</span> records
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
            <DialogTitle className="text-foreground">Delete Attendance Record</DialogTitle>
            <DialogDescription className="text-xs leading-normal">
              Are you sure you want to delete the attendance record for{" "}
              <span className="font-bold text-foreground">{deleteTarget?.employeeName}</span> on{" "}
              <span className="font-bold text-foreground">{deleteTarget?.date}</span>? This action cannot be undone.
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
