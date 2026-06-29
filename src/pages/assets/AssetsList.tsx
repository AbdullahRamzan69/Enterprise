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
  Package,
  X,
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
import { deleteAsset } from "@/features/assets/assetSlice"
import { selectAllAssets } from "@/features/assets/assetSelectors"
import type { Asset } from "@/features/assets/assetTypes"

const ITEMS_PER_PAGE = 8
const CATEGORIES = ["All", "Laptop", "Desktop", "Monitor", "Keyboard", "Mouse", "Phone", "Printer", "Furniture", "Other"]
const STATUSES = ["All", "Available", "Assigned", "Maintenance", "Retired"]

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)

export default function AssetsList() {
  const dispatch = useAppDispatch()
  const assets = useAppSelector(selectAllAssets)
  const navigate = useNavigate()

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [employeeFilter, setEmployeeFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null)

  // Get unique assigned employees
  const assignedEmployees = Array.from(
    new Set(assets.filter((a) => a.assignedEmployeeName).map((a) => a.assignedEmployeeName))
  )

  // Filtered assets
  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assetCode.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "All" || a.category === categoryFilter
    const matchesStatus = statusFilter === "All" || a.status === statusFilter
    const matchesEmployee =
      employeeFilter === "All" || a.assignedEmployeeName === employeeFilter

    return matchesSearch && matchesCategory && matchesStatus && matchesEmployee
  })

  // Sort by purchase date (newest first)
  const sortedAssets = [...filteredAssets].sort(
    (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  )

  // Pagination calculation
  const totalPages = Math.ceil(sortedAssets.length / ITEMS_PER_PAGE)
  const paginatedAssets = sortedAssets.slice(
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
      dispatch(deleteAsset(deleteTarget.id))
      setDeleteTarget(null)
      const updatedTotalPages = Math.ceil((sortedAssets.length - 1) / ITEMS_PER_PAGE)
      if (currentPage > updatedTotalPages && currentPage > 1) {
        setCurrentPage(updatedTotalPages)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "Assigned":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Maintenance":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "Retired":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      default:
        return "bg-muted/10 text-muted-foreground border-border/20"
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Asset Registry
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage company hardware, software licenses, and inventory tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            asChild
            className="border-border/60 hover:bg-muted text-foreground text-xs rounded-lg shrink-0"
          >
            <Link to="/assets/reports">
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              Reports
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm rounded-lg text-xs">
            <Link to="/assets/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Asset
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
            placeholder="Search asset name or code..."
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
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Category:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[120px]">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate max-w-[80px]">{categoryFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-panel min-w-[140px] rounded-lg max-h-[300px] overflow-y-auto">
                {CATEGORIES.map((c) => (
                  <DropdownMenuItem
                    key={c}
                    onClick={() => { setCategoryFilter(c); setCurrentPage(1) }}
                    className="cursor-pointer text-xs rounded-md"
                  >
                    {c}
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
                {STATUSES.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => { setStatusFilter(s); setCurrentPage(1) }}
                    className="cursor-pointer text-xs rounded-md"
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Employee Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Assignee:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border/80 h-9 text-xs rounded-lg flex gap-1.5 px-3 min-w-[110px]">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="truncate max-w-[80px]">{employeeFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-panel min-w-[140px] rounded-lg max-h-[300px] overflow-y-auto">
                <DropdownMenuItem onClick={() => { setEmployeeFilter("All"); setCurrentPage(1) }} className="cursor-pointer text-xs rounded-md">All</DropdownMenuItem>
                {assignedEmployees.map((emp) => (
                  <DropdownMenuItem
                    key={emp}
                    onClick={() => { setEmployeeFilter(emp!); setCurrentPage(1) }}
                    className="cursor-pointer text-xs rounded-md"
                  >
                    {emp}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Assets Table Container */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {paginatedAssets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Package className="w-8 h-8 text-muted-foreground/50 animate-bounce" />
                      <p className="font-semibold text-sm text-foreground">No assets found</p>
                      <p className="text-xs max-w-xs leading-normal">
                        Try modifying your filters or search keywords to locate assets.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-muted/20 transition-colors">
                    {/* Code */}
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {asset.assetCode}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-foreground truncate max-w-[150px]">
                          {asset.assetName}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{asset.brand} {asset.model}</p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-medium bg-muted/30 border-border/80">
                        {asset.category}
                      </Badge>
                    </td>

                    {/* Assigned To */}
                    <td className="py-3 px-4">
                      {asset.assignedEmployeeName ? (
                        <span className="font-medium text-foreground">{asset.assignedEmployeeName}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right font-mono text-muted-foreground">
                      {formatCurrency(asset.purchasePrice)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getStatusColor(asset.status)}>
                        {asset.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/assets/${asset.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                          onClick={() => navigate(`/assets/edit/${asset.id}`)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md"
                          onClick={() => setDeleteTarget(asset)}
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
        {filteredAssets.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-border/50 bg-muted/10 text-xs">
            <span className="text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredAssets.length)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{filteredAssets.length}</span> assets
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
            <DialogTitle className="text-foreground">Delete Asset</DialogTitle>
            <DialogDescription className="text-xs leading-normal">
              Are you sure you want to permanently delete <span className="font-bold text-foreground">{deleteTarget?.assetName}</span> ({deleteTarget?.assetCode})? This
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
              Delete Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
