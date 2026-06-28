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
  UserX,
  X,
  FileSpreadsheet
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
import { deleteCustomer } from "@/features/crm/crmSlice"
import { selectAllCustomers } from "@/features/crm/crmSelectors"
import type { Customer } from "@/features/crm/crmTypes"

const ITEMS_PER_PAGE = 5

export default function CRMList() {
  const dispatch = useAppDispatch()
  const customers = useAppSelector(selectAllCustomers)
  const navigate = useNavigate()

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)

  // Get unique industries for filter dropdown
  const industries = ["All", ...Array.from(new Set(customers.map((c) => c.industry)))]
  const statuses = ["All", "Lead", "Contacted", "Negotiation", "Active Client", "Inactive"]

  // Filtered customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesIndustry = industryFilter === "All" || c.industry === industryFilter
    const matchesStatus = statusFilter === "All" || c.status === statusFilter

    return matchesSearch && matchesIndustry && matchesStatus
  })

  // Sort by creation date (newest first, fallback to id if missing)
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // Pagination calculation
  const totalPages = Math.ceil(sortedCustomers.length / ITEMS_PER_PAGE)
  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Reset page on filter changes
  const handleSearchChange = (val: string) => {
    setSearchTerm(val)
    setCurrentPage(1)
  }

  const handleIndustryFilterChange = (val: string) => {
    setIndustryFilter(val)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val)
    setCurrentPage(1)
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteCustomer(deleteTarget.id))
      setDeleteTarget(null)
      const updatedTotalPages = Math.ceil((sortedCustomers.length - 1) / ITEMS_PER_PAGE)
      if (currentPage > updatedTotalPages && currentPage > 1) {
        setCurrentPage(updatedTotalPages)
      }
    }
  }

  // Helper for company initials
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
            CRM Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage clients, track leads, and oversee active negotiations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-border/60 hover:bg-muted text-foreground text-xs rounded-lg shrink-0"
            onClick={() => alert("CSV Export mock triggered. Spreadsheet file downloaded successfully.")}
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm rounded-lg text-xs">
            <Link to="/crm/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Client
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
            placeholder="Search company or contact..."
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
          {/* Industry Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Industry:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[120px]">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate max-w-[80px]">{industryFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-panel min-w-[140px] rounded-lg max-h-[300px] overflow-y-auto">
                {industries.map((ind) => (
                  <DropdownMenuItem
                    key={ind}
                    onClick={() => handleIndustryFilterChange(ind)}
                    className="cursor-pointer text-xs rounded-md"
                  >
                    {ind}
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
                <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[120px]">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{statusFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-panel min-w-[140px] rounded-lg">
                {statuses.map((stat) => (
                  <DropdownMenuItem
                    key={stat}
                    onClick={() => handleStatusFilterChange(stat)}
                    className="cursor-pointer text-xs rounded-md"
                  >
                    {stat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Customers Table Container */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Client ID</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Industry</th>
                <th className="py-3 px-4">Account Manager</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <UserX className="w-8 h-8 text-muted-foreground/50 animate-bounce" />
                      <p className="font-semibold text-sm text-foreground">No clients found</p>
                      <p className="text-xs max-w-xs leading-normal">
                        Try modifying your filters or search keywords to locate client profiles.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {c.id}
                    </td>

                    {/* Company & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7 border border-border/50">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                            {getInitials(c.companyName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-foreground truncate max-w-[150px]">
                          {c.companyName}
                        </span>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="py-3 px-4 text-muted-foreground truncate max-w-[120px]">
                      {c.contactPerson}
                    </td>

                    {/* Industry */}
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-medium bg-muted/30 border-border/80">
                        {c.industry}
                      </Badge>
                    </td>

                    {/* Account Manager */}
                    <td className="py-3 px-4 text-muted-foreground">
                      {c.assignedEmployeeName}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === "Active Client"
                              ? "bg-emerald-500"
                              : c.status === "Lead"
                              ? "bg-blue-500"
                              : c.status === "Contacted"
                              ? "bg-purple-500"
                              : c.status === "Negotiation"
                              ? "bg-amber-500"
                              : "bg-zinc-400"
                          }`}
                        />
                        <span className="font-medium text-foreground">{c.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/crm/${c.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/crm/edit/${c.id}`)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md"
                          onClick={() => setDeleteTarget(c)}
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
        {filteredCustomers.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-border/50 bg-muted/10 text-xs">
            <span className="text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredCustomers.length}</span> records
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
            <DialogTitle className="text-foreground">Delete Client Record</DialogTitle>
            <DialogDescription className="text-xs leading-normal">
              Are you sure you want to permanently delete the profile of{" "}
              <span className="font-bold text-foreground">{deleteTarget?.companyName}</span> ({deleteTarget?.id})? This
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
