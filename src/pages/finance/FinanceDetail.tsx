import { useMemo } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, DollarSign } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/app/store"
import { selectPayrollById } from "@/features/finance/financeSelectors"
import { markAsPaid, deletePayroll } from "@/features/finance/financeSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { PayrollRecord } from "@/features/finance/financeTypes"

export default function FinanceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const payroll = useAppSelector((s) => selectPayrollById(s, id || "")) as PayrollRecord | undefined

  const breakdown = useMemo(() => {
    if (!payroll) return null
    return [
      { label: "Basic Salary", value: payroll.basicSalary },
      { label: "Allowances", value: payroll.allowances },
      { label: "Bonuses", value: payroll.bonuses },
      { label: "Overtime Pay", value: payroll.overtimePay },
      { label: "Deductions", value: payroll.deductions },
      { label: "Tax", value: payroll.tax },
      { label: "Leave Deduction", value: payroll.leaveDeduction },
    ]
  }, [payroll])

  if (!payroll) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <h1 className="text-2xl font-bold">Payroll not found</h1>
        <Button asChild>
          <Link to="/finance">Return to Finance</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Payroll Detail</h1>
          <p className="text-sm text-muted-foreground">Record {payroll.id} — {payroll.employeeName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {payroll.paymentStatus === 'Pending' && (
            <Button onClick={() => dispatch(markAsPaid(payroll.id))}>
              <DollarSign className="w-4 h-4 mr-2" /> Mark as Paid
            </Button>
          )}
          <Button variant="destructive" onClick={() => { dispatch(deletePayroll(payroll.id)); navigate('/finance') }}>
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Summary</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Employee</div>
              <div className="font-semibold text-foreground">{payroll.employeeName} <span className="font-mono text-sm ml-2">{payroll.employeeId}</span></div>
              <div className="text-sm text-muted-foreground mt-2">Period</div>
              <div className="font-medium">{payroll.month} {payroll.year}</div>
              <div className="text-sm text-muted-foreground mt-2">Status</div>
              <div className="font-medium">{payroll.paymentStatus}{payroll.paymentDate ? ` — ${new Date(payroll.paymentDate).toLocaleDateString()}` : ''}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">Net Salary</div>
              <div className="font-extrabold text-foreground text-2xl">${payroll.netSalary.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-2">Breakdown</div>
              <div className="mt-2 space-y-1">
                {breakdown?.map((b) => (
                  <div key={b.label} className="flex justify-between text-sm">
                    <div className="text-muted-foreground">{b.label}</div>
                    <div className="font-medium">${b.value.toLocaleString()}</div>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-2 mt-2">
                  <div>Total</div>
                  <div>${payroll.netSalary.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
