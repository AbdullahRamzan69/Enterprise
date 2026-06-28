import { useState, useEffect, useMemo } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { addPayroll, updatePayroll } from "@/features/finance/financeSlice"
import { selectPayrollById, selectAllPayrolls } from "@/features/finance/financeSelectors"
import { selectEmployees } from "@/features/employees/employeeSelectors"
import { selectLeaveRequestsByEmployeeId } from "@/features/leave/leaveSelectors"
import type { PayrollRecord } from "@/features/finance/financeTypes"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const createPayrollFormData = (payrolls: PayrollRecord[], payroll?: PayrollRecord): PayrollRecord => {
  if (payroll) {
    return { ...payroll }
  }

  const ids = payrolls
    .map((p) => parseInt(p.id.replace("PAY-", ""), 10))
    .filter((num) => !isNaN(num))
  const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 1001

  const currentDate = new Date()

  return {
    id: `PAY-${nextIdNum}`,
    employeeId: "",
    employeeName: "",
    month: MONTHS[currentDate.getMonth()],
    year: currentDate.getFullYear(),
    basicSalary: 0,
    allowances: 0,
    bonuses: 0,
    overtimePay: 0,
    deductions: 0,
    tax: 0,
    leaveDeduction: 0,
    netSalary: 0,
    paymentStatus: "Pending",
  }
}

export default function PayrollForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const payrolls = useAppSelector(selectAllPayrolls)
  const payroll = useAppSelector((state) => (id ? selectPayrollById(state, id) : undefined))
  const employees = useAppSelector(selectEmployees)

  const isEditMode = !!id
  const error =
    isEditMode && id && !payroll
      ? `Payroll record with ID "${id}" was not found in database registry.`
      : ""

  // Form State
  const [formData, setFormData] = useState<PayrollRecord>(() =>
    createPayrollFormData(payrolls, payroll)
  )

  // Fetch Leave Requests for the selected employee to calculate unpaid leave deduction
  // Select only approved, unpaid leave requests.
  const employeeLeaveRequests = useAppSelector((state) => 
    selectLeaveRequestsByEmployeeId(state, formData.employeeId)
  )

  const unpaidLeaveDays = useMemo(() => {
    if (!formData.employeeId || !formData.month || !formData.year) return 0;
    
    const monthIndex = MONTHS.indexOf(formData.month);
    
    return employeeLeaveRequests
      .filter((req) => req.status === "Approved" && req.leaveType === "Unpaid")
      .filter((req) => {
        // Basic check: does the leave start in the selected month/year?
        // (A more robust check would see if dates overlap the month, but this is sufficient for typical use cases)
        const startDate = new Date(req.startDate)
        return startDate.getMonth() === monthIndex && startDate.getFullYear() === formData.year
      })
      .reduce((total, req) => total + req.days, 0)
  }, [employeeLeaveRequests, formData.employeeId, formData.month, formData.year])

  // Automatic Calculations
  useEffect(() => {
    const basic = Number(formData.basicSalary) || 0
    const allowances = Number(formData.allowances) || 0
    const bonuses = Number(formData.bonuses) || 0
    const overtime = Number(formData.overtimePay) || 0
    const tax = Number(formData.tax) || 0
    const manualDeductions = Number(formData.deductions) || 0
    
    // Auto-calculate leave deduction: (Basic / 30) * unpaidLeaveDays
    const dailyRate = basic / 30
    const autoLeaveDeduction = Math.round(dailyRate * unpaidLeaveDays)

    const gross = basic + allowances + bonuses + overtime
    const net = gross - tax - manualDeductions - autoLeaveDeduction

    setFormData((prev) => ({
      ...prev,
      leaveDeduction: autoLeaveDeduction,
      netSalary: net,
    }))
  }, [
    formData.basicSalary,
    formData.allowances,
    formData.bonuses,
    formData.overtimePay,
    formData.tax,
    formData.deductions,
    unpaidLeaveDays
  ])

  // When Employee Changes, auto-fill basic salary from Employee record if not in edit mode (or even in edit mode to reset it)
  const handleEmployeeChange = (employeeId: string) => {
    const emp = employees.find((e) => e.id === employeeId)
    if (emp) {
      setFormData((prev) => ({
        ...prev,
        employeeId: emp.id,
        employeeName: emp.fullName,
        // Default basic salary to monthly (salary / 12)
        basicSalary: Math.round(emp.salary / 12),
      }))
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === "employeeId") {
      handleEmployeeChange(value)
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: ["basicSalary", "allowances", "bonuses", "overtimePay", "deductions", "tax", "year"].includes(name) 
          ? Number(value) 
          : value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.employeeId) return alert("An Employee must be selected.")
    
    // Check positive values constraint
    if (
      formData.basicSalary < 0 ||
      formData.allowances < 0 ||
      formData.bonuses < 0 ||
      formData.overtimePay < 0 ||
      formData.deductions < 0 ||
      formData.tax < 0
    ) {
      return alert("All financial values must be positive.")
    }

    if (isEditMode) {
      dispatch(updatePayroll(formData))
    } else {
      dispatch(addPayroll(formData))
    }

    navigate("/finance")
  }

  if (error) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Record Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">{error}</p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/finance">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Return to Ledger
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="h-8 w-8 rounded-lg border-border/80 text-muted-foreground hover:text-foreground shrink-0"
        >
          <Link to="/finance">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {isEditMode ? "Modify Payroll Record" : "Generate Payroll"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEditMode ? `Updating salary records for ${formData.employeeName}` : "Create a new salary record."}
          </p>
        </div>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 max-w-4xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isEditMode ? "Edit Salary Info" : "Salary Information"}
              </CardTitle>
              <CardDescription className="text-xs">
                Fill financial details to calculate final net pay.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
              {formData.id}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Context Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
              {/* Employee Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Employee <span className="text-destructive">*</span>
                </label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                  className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring disabled:opacity-50"
                >
                  <option value="" disabled>Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Month <span className="text-destructive">*</span>
                </label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Year <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="2000"
                  max="2100"
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            {/* Earnings Section */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">
                Earnings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Basic Salary</label>
                  <Input
                    type="number"
                    name="basicSalary"
                    value={formData.basicSalary}
                    onChange={handleChange}
                    required
                    min="0"
                    className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Allowances</label>
                  <Input
                    type="number"
                    name="allowances"
                    value={formData.allowances}
                    onChange={handleChange}
                    required
                    min="0"
                    className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Bonuses</label>
                  <Input
                    type="number"
                    name="bonuses"
                    value={formData.bonuses}
                    onChange={handleChange}
                    required
                    min="0"
                    className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Overtime</label>
                  <Input
                    type="number"
                    name="overtimePay"
                    value={formData.overtimePay}
                    onChange={handleChange}
                    required
                    min="0"
                    className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Deductions Section */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">
                Deductions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Tax</label>
                  <Input
                    type="number"
                    name="tax"
                    value={formData.tax}
                    onChange={handleChange}
                    required
                    min="0"
                    className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">Manual Deductions</label>
                  <Input
                    type="number"
                    name="deductions"
                    value={formData.deductions}
                    onChange={handleChange}
                    required
                    min="0"
                    className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground">
                    Leave Deduction
                    {unpaidLeaveDays > 0 && (
                      <span className="text-[10px] text-amber-500 ml-2">({unpaidLeaveDays} unpaid days)</span>
                    )}
                  </label>
                  <Input
                    type="number"
                    value={formData.leaveDeduction}
                    readOnly
                    className="bg-muted/30 border-border/50 rounded-lg text-xs font-mono cursor-not-allowed opacity-70"
                  />
                  <p className="text-[9px] text-muted-foreground mt-1 leading-tight">Auto-calculated based on approved unpaid leaves.</p>
                </div>
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-muted/20 border border-border/60 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gross Salary</p>
                <p className="text-lg font-mono font-bold text-foreground mt-1">
                  ${(formData.basicSalary + formData.allowances + formData.bonuses + formData.overtimePay).toLocaleString()}
                </p>
              </div>
              <div className="hidden md:block w-px h-10 bg-border/50"></div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Deductions</p>
                <p className="text-lg font-mono font-bold text-rose-500 mt-1">
                  ${(formData.tax + formData.deductions + formData.leaveDeduction).toLocaleString()}
                </p>
              </div>
              <div className="hidden md:block w-px h-10 bg-border/50"></div>
              <div className="md:text-right">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Net Salary</p>
                <p className="text-3xl font-mono font-extrabold text-emerald-500 mt-1">
                  ${formData.netSalary.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Form Footer Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg"
              >
                <Link to="/finance">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isEditMode ? "Save Changes" : "Generate Payroll"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
