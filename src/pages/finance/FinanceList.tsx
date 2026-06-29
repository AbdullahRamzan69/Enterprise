import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, Edit2, Trash2, DollarSign, Plus, FileSpreadsheet } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { selectAllPayrolls, selectPendingPaymentsCount, selectTotalPayrollExpense } from "@/features/finance/financeSelectors"
import { deletePayroll, markAsPaid } from "@/features/finance/financeSlice"
import type { PayrollRecord } from "@/features/finance/financeTypes"

const ITEMS_PER_PAGE = 6

export default function FinanceList() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const payrolls = useAppSelector(selectAllPayrolls)
  const pendingCount = useAppSelector(selectPendingPaymentsCount)
  const totalExpense = useAppSelector(selectTotalPayrollExpense)

  const [search, setSearch] = useState("")
  const [monthFilter, setMonthFilter] = useState("All")
  const [yearFilter, setYearFilter] = useState<number | "All">("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<PayrollRecord | null>(null)

  const months = useMemo(() => [
    "All",
    "January","February","March","April","May","June","July","August","September","October","November","December"
  ], [])

  const years = useMemo(() => {
    const ys = Array.from(new Set(payrolls.map((p) => p.year)))
    ys.sort((a,b) => b - a)
    return ["All", ...ys]
  }, [payrolls])

  const filtered = payrolls.filter((p) => {
    const matchesSearch =
      p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      p.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())

    const matchesMonth = monthFilter === "All" || p.month === monthFilter
    const matchesYear = yearFilter === "All" || p.year === yearFilter

    return matchesSearch && matchesMonth && matchesYear
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deletePayroll(deleteTarget.id))
      setDeleteTarget(null)
      // adjust page
      const updatedTotalPages = Math.max(1, Math.ceil((filtered.length - 1) / ITEMS_PER_PAGE))
      if (currentPage > updatedTotalPages) setCurrentPage(updatedTotalPages)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Finance</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Payroll registries, payment statuses and budget overview.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground mr-4">
            <div>Total Expense: <span className="font-semibold text-foreground">${totalExpense.toLocaleString()}</span></div>
            <div>Pending Payments: <span className="font-semibold text-foreground">{pendingCount}</span></div>
          </div>

          <Button
            variant="outline"
            className="border-border/60 hover:bg-muted text-foreground text-xs rounded-lg shrink-0"
            onClick={() => alert("CSV Export mock triggered. Spreadsheet file downloaded successfully.")}
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>

          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm rounded-lg text-xs">
            <Link to="/finance/new">
              <Plus className="w-4 h-4 mr-1.5" /> New Payroll
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3.5 bg-card border border-border/60 p-4 rounded-xl shadow-sm">
        <Input
          placeholder="Search name, employee ID or payroll ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
          className="bg-muted/20 border-border/80 rounded-lg text-sm"
        />

        <div className="flex gap-2">
          <select
            value={monthFilter}
            onChange={(e) => { setMonthFilter(e.target.value); setCurrentPage(1) }}
            className="rounded-lg bg-card border border-border/60 px-3 py-2 text-sm"
          >
            {months.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <select
            value={yearFilter as any}
            onChange={(e) => { const v = e.target.value === 'All' ? 'All' : Number(e.target.value); setYearFilter(v); setCurrentPage(1) }}
            className="rounded-lg bg-card border border-border/60 px-3 py-2 text-sm"
          >
            {years.map((y) => <option key={String(y)} value={String(y)}>{String(y)}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Payroll ID</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Net Salary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">No payroll records found</td>
                </tr>
              ) : (
                paginated.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">{p.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-foreground truncate max-w-[160px]">{p.employeeName}</div>
                        <div className="text-muted-foreground text-xs">{p.employeeId}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{p.month} {p.year}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-foreground">${p.netSalary.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant={p.paymentStatus === 'Paid' ? 'secondary' : 'outline'} className="font-medium">{p.paymentStatus}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/finance/${p.id}`)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/finance/edit/${p.id}`)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteTarget(p)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {p.paymentStatus === 'Pending' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => dispatch(markAsPaid(p.id))}>
                            <DollarSign className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-border/50 bg-muted/10 text-xs">
            <span className="text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-foreground">{filtered.length}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="h-8 w-8 rounded-lg border-border/80">◀</Button>
              <span className="text-muted-foreground font-medium px-2">Page <span className="font-semibold text-foreground">{currentPage}</span> of <span className="font-semibold text-foreground">{totalPages}</span></span>
              <Button variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="h-8 w-8 rounded-lg border-border/80">▶</Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog (lightweight) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-black/40 absolute inset-0" onClick={() => setDeleteTarget(null)} />
          <div className="bg-card glass-panel rounded-xl p-6 z-10 max-w-sm w-full">
            <h3 className="text-lg font-bold text-foreground">Delete Payroll</h3>
            <p className="text-sm text-muted-foreground mt-2">Permanently delete payroll record <span className="font-mono">{deleteTarget.id}</span> for <span className="font-semibold">{deleteTarget.employeeName}</span>?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
