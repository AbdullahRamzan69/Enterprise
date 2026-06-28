import { useState } from "react"
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
  FileSpreadsheet,
  Banknote,
  X,
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
import { deletePayroll } from "@/features/finance/financeSlice"
import { selectAllPayrolls } from "@/features/finance/financeSelectors"
import type { PayrollRecord } from "@/features/finance/financeTypes"

const ITEMS_PER_PAGE = 5
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
const YEARS = [2023, 2024, 2025, 2026, 2027]

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)

export default function FinanceList() {
  const dispatch = useAppDispatch()
  const payrolls = useAppSelector(selectAllPayrolls)
  const navigate = useNavigate()

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("")
  const [monthFilter, setMonthFilter] = useState("All")
  const [yearFilter, setYearFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<PayrollRecord | null>(null)

  // Filtered payrolls
  const filteredPayrolls = payrolls.filter((p) => {
    const matchesSearch =
      p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMonth = monthFilter === "All" || p.month === monthFilter
    const matchesYear = yearFilter === "All" || p.year.toString() === yearFilter
    const matchesStatus = statusFilter === "All" || p.paymentStatus === statusFilter

    return matchesSearch && matchesMonth && matchesYear && matchesStatus
  })

  // Sort by Year desc, then Month (basic sort)
  const sortedPayrolls = [...filteredPayrolls].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return MONTHS.indexOf(b.month) - MONTHS.indexOf(a.month)
  })

  // Pagination calculation
  const totalPages = Math.ceil(sortedPayrolls.length / ITEMS_PER_PAGE)
  const paginatedPayrolls = sortedPayrolls.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleSearchChange = (val: string) => {
    setSearchTerm(val)
    setCurrentPage(1)
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deletePayroll(deleteTarget.id))
      setDeleteTarget(null)
      const updatedTotalPages = Math.ceil((sortedPayrolls.length - 1) / ITEMS_PER_PAGE)
      if (currentPage > updatedTotalPages && currentPage > 1) {
        setCurrentPage(updatedTotalPages)
      }
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Payroll Ledger
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage employee compensations, track salary dispersals, and review payment histories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            asChild
            className="border-border/60 hover:bg-muted text-foreground text-xs rounded-lg shrink-0"
          >
            <Link to="/finance/reports">
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              Reports
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm rounded-lg text-xs">
            <Link to="/finance/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Payroll
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3.5 bg-card border border-border/60 p-4 rounded-xl shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employee name or ID..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
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

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-2.5">
          {/* Month Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Month:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[120px]">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate max-w-[80px]">{monthFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-panel min-w-[140px] rounded-lg max-h-[300px] overflow-y-auto">
                <DropdownMenuItem onClick={() => { setMonthFilter("All"); setCurrentPage(1) }} className="cursor-pointer text-xs rounded-md">All</DropdownMenuItem>
                {MONTHS.map((m) => (
                  <DropdownMenuItem
                    key={m}
                    onClick={() => { setMonthFilter(m); setCurrentPage(1) }}
                    className="cursor-pointer text-xs rounded-md"
                  >
                    {m}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Year:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[100px]">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{yearFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-panel min-w-[120px] rounded-lg">
                <DropdownMenuItem onClick={() => { setYearFilter("All"); setCurrentPage(1) }} className="cursor-pointer text-xs rounded-md">All</DropdownMenuItem>
                {YEARS.map((y) => (
                  <DropdownMenuItem
                    key={y}
                    onClick={() => { setYearFilter(y.toString()); setCurrentPage(1) }}
                    className="cursor-pointer text-xs rounded-md"
                  >
                    {y}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Status:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[110px]">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{statusFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-panel min-w-[120px] rounded-lg">
                <DropdownMenuItem onClick={() => { setStatusFilter("All"); setCurrentPage(1) }} className="cursor-pointer text-xs rounded-md">All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setStatusFilter("Pending"); setCurrentPage(1) }} className="cursor-pointer text-xs rounded-md">Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setStatusFilter("Paid"); setCurrentPage(1) }} className="cursor-pointer text-xs rounded-md">Paid</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Payrolls Table Container */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Pay ID</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4 text-right">Basic Salary</th>
                <th className="py-3 px-4 text-right">Net Salary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {paginatedPayrolls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Banknote className="w-8 h-8 text-muted-foreground/50 animate-bounce" />
                      <p className="font-semibold text-sm text-foreground">No payroll records found</p>
                      <p className="text-xs max-w-xs leading-normal">
                        Try modifying your filters or search keywords to locate salary records.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPayrolls.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {p.id}
                    </td>

                    {/* Employee & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7 border border-border/50">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                            {getInitials(p.employeeName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground truncate max-w-[150px]">
                            {p.employeeName}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">{p.employeeId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Period */}
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-medium bg-muted/30 border-border/80">
                        {p.month} {p.year}
                      </Badge>
                    </td>

                    {/* Basic Salary */}
                    <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                      {formatCurrency(p.basicSalary)}
                    </td>

                    {/* Net Salary */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-500 dark:text-emerald-400">
                      {formatCurrency(p.netSalary)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.paymentStatus === "Paid"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        <span className="font-medium text-foreground">{p.paymentStatus}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/finance/${p.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/finance/edit/${p.id}`)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md"
                          onClick={() => setDeleteTarget(p)}
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

        {/* Table Footer / Pagination */}
        {filteredPayrolls.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-border/50 bg-muted/10 text-xs">
            <span className="text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredPayrolls.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredPayrolls.length}</span> records
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

      {/* Delete Confirmation Alert Dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="glass-panel max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Payroll Record</DialogTitle>
            <DialogDescription className="text-xs leading-normal">
              Are you sure you want to permanently delete the payroll record for{" "}
              <span className="font-bold text-foreground">{deleteTarget?.employeeName}</span> ({deleteTarget?.month} {deleteTarget?.year})? This
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
