import { useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, Edit2, Calendar, FileText, CheckCircle2, DollarSign, Clock, Check, XCircle } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { selectPayrollById } from "@/features/finance/financeSelectors"
import { markAsPaid } from "@/features/finance/financeSlice"
import { selectLeaveRequestsByEmployeeId } from "@/features/leave/leaveSelectors"
import { selectAttendanceByEmployeeId } from "@/features/attendance/attendanceSelectors"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function PayrollDetails() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const payroll = useAppSelector((state) => (id ? selectPayrollById(state, id) : undefined))

  const leaveRequests = useAppSelector((state) =>
    payroll ? selectLeaveRequestsByEmployeeId(state, payroll.employeeId) : []
  )

  const attendanceRecords = useAppSelector((state) =>
    payroll ? selectAttendanceByEmployeeId(state, payroll.employeeId) : []
  )

  // Calculations for Attendance & Leave for the specific Month & Year
  const stats = useMemo(() => {
    let presentDays = 0
    let absentDays = 0
    let lateDays = 0
    let halfDays = 0
    
    let approvedLeaveDays = 0
    let unpaidLeaveDays = 0

    if (payroll) {
      const monthIndex = MONTHS.indexOf(payroll.month)

      // Attendance
      attendanceRecords.forEach((record) => {
        const recordDate = new Date(record.date)
        if (recordDate.getMonth() === monthIndex && recordDate.getFullYear() === payroll.year) {
          if (record.status === "Present") presentDays++
          else if (record.status === "Absent") absentDays++
          else if (record.status === "Late") lateDays++
          else if (record.status === "Half Day") halfDays++
        }
      })

      // Leave
      leaveRequests.forEach((req) => {
        const startDate = new Date(req.startDate)
        if (req.status === "Approved" && startDate.getMonth() === monthIndex && startDate.getFullYear() === payroll.year) {
          approvedLeaveDays += req.days
          if (req.leaveType === "Unpaid") {
            unpaidLeaveDays += req.days
          }
        }
      })
    }

    const totalWorkingDays = presentDays + lateDays + (halfDays * 0.5)

    return {
      presentDays,
      absentDays,
      lateDays,
      workingDays: totalWorkingDays,
      approvedLeaveDays,
      unpaidLeaveDays
    }
  }, [payroll, attendanceRecords, leaveRequests])

  if (!payroll) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Payroll Record Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">
            We could not find the salary record for "{id}".
          </p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/finance">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Ledger
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleMarkPaid = () => {
    dispatch(markAsPaid(payroll.id))
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              Payroll Summary
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Detailed salary breakdown for {payroll.month} {payroll.year}.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {payroll.paymentStatus === "Pending" && (
            <Button 
              onClick={handleMarkPaid}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-lg shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Mark as Paid
            </Button>
          )}
          <Button variant="outline" asChild className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg">
            <Link to="/finance">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Ledger
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm">
            <Link to={`/finance/edit/${payroll.id}`}>
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit Payroll
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Financial Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card shadow-sm border border-border/60 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-border/50">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">
                      <Link to={`/employees/${payroll.employeeId}`} className="hover:underline text-primary">
                        {payroll.employeeName}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {payroll.month} {payroll.year}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
                    {payroll.id}
                  </Badge>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    payroll.paymentStatus === "Paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${payroll.paymentStatus === "Paid" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {payroll.paymentStatus}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
                {/* Earnings List */}
                <div className="p-6 md:p-8 space-y-4">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Earnings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Basic Salary</span>
                      <span className="font-mono font-medium">${payroll.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Allowances</span>
                      <span className="font-mono font-medium">${payroll.allowances.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Bonuses</span>
                      <span className="font-mono font-medium">${payroll.bonuses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Overtime</span>
                      <span className="font-mono font-medium">${payroll.overtimePay.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border/50 flex justify-between items-center text-sm font-bold text-foreground">
                    <span>Gross Salary</span>
                    <span className="font-mono">${(payroll.basicSalary + payroll.allowances + payroll.bonuses + payroll.overtimePay).toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions List */}
                <div className="p-6 md:p-8 space-y-4 bg-muted/5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-500" />
                    Deductions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-mono font-medium text-rose-500">-${payroll.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Manual Deductions</span>
                      <span className="font-mono font-medium text-rose-500">-${payroll.deductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Unpaid Leave</span>
                      <span className="font-mono font-medium text-rose-500">-${payroll.leaveDeduction.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border/50 flex justify-between items-center text-sm font-bold text-foreground">
                    <span>Total Deductions</span>
                    <span className="font-mono text-rose-500">-${(payroll.tax + payroll.deductions + payroll.leaveDeduction).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Salary Banner */}
              <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-t border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Net Salary Transfer</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {payroll.paymentStatus === "Paid" 
                        ? `Payment completed on ${new Date(payroll.paymentDate!).toLocaleDateString()}`
                        : "Awaiting final dispersal approval."}
                    </p>
                  </div>
                  <div className="text-3xl font-mono font-extrabold text-emerald-500 dark:text-emerald-400">
                    ${payroll.netSalary.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Attendance & Leave Integrations */}
        <div className="space-y-6">
          <Card className="glass-card shadow-sm border border-border/60 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Attendance Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 border border-border/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-foreground">{stats.workingDays}</div>
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground mt-1 tracking-wider">Working Days</div>
                </div>
                <div className="bg-muted/30 border border-border/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-emerald-500">{stats.presentDays}</div>
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground mt-1 tracking-wider">Present</div>
                </div>
                <div className="bg-muted/30 border border-border/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-rose-500">{stats.absentDays}</div>
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground mt-1 tracking-wider">Absent</div>
                </div>
                <div className="bg-muted/30 border border-border/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-amber-500">{stats.lateDays}</div>
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground mt-1 tracking-wider">Late</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                Leave Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                  <span className="text-muted-foreground font-medium flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    Approved Paid Leave
                  </span>
                  <span className="font-bold text-foreground">{stats.approvedLeaveDays - stats.unpaidLeaveDays} Days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                    Approved Unpaid Leave
                  </span>
                  <span className="font-bold text-foreground">{stats.unpaidLeaveDays} Days</span>
                </div>
                {stats.unpaidLeaveDays > 0 && (
                  <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 p-3 rounded-lg text-[11px] leading-relaxed mt-2">
                    <span className="font-bold block mb-0.5">Deduction Applied</span>
                    Salary has been automatically deducted for {stats.unpaidLeaveDays} unpaid leave days based on the basic monthly rate.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
