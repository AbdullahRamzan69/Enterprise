import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { addPayroll, updatePayroll } from "@/features/finance/financeSlice"
import { selectPayrollById } from "@/features/finance/financeSelectors"
import type { PayrollRecord } from "@/features/finance/financeTypes"

function genId() {
  return `PAY-${Date.now().toString().slice(-6)}`
}

export default function FinanceForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const existing = useAppSelector((s) => (id ? selectPayrollById(s, id) : undefined)) as PayrollRecord | undefined

  const [employeeId, setEmployeeId] = useState("")
  const [employeeName, setEmployeeName] = useState("")
  const [month, setMonth] = useState<string>("")
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [basicSalary, setBasicSalary] = useState<number>(0)
  const [allowances, setAllowances] = useState<number>(0)
  const [bonuses, setBonuses] = useState<number>(0)
  const [overtimePay, setOvertimePay] = useState<number>(0)
  const [deductions, setDeductions] = useState<number>(0)
  const [tax, setTax] = useState<number>(0)
  const [leaveDeduction, setLeaveDeduction] = useState<number>(0)
  const [paymentStatus, setPaymentStatus] = useState<PayrollRecord["paymentStatus"]>("Pending")

  useEffect(() => {
    if (existing) {
      setEmployeeId(existing.employeeId)
      setEmployeeName(existing.employeeName)
      setMonth(existing.month)
      setYear(existing.year)
      setBasicSalary(existing.basicSalary)
      setAllowances(existing.allowances)
      setBonuses(existing.bonuses)
      setOvertimePay(existing.overtimePay)
      setDeductions(existing.deductions)
      setTax(existing.tax)
      setLeaveDeduction(existing.leaveDeduction)
      setPaymentStatus(existing.paymentStatus)
    } else {
      const d = new Date()
      setMonth(d.toLocaleString("default", { month: "long" }))
      setYear(d.getFullYear())
    }
  }, [existing])

  const netSalary = useMemo(() => {
    const gross = Number(basicSalary || 0) + Number(allowances || 0) + Number(bonuses || 0) + Number(overtimePay || 0)
    const totalDeductions = Number(deductions || 0) + Number(tax || 0) + Number(leaveDeduction || 0)
    return Math.round(gross - totalDeductions)
  }, [basicSalary, allowances, bonuses, overtimePay, deductions, tax, leaveDeduction])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: PayrollRecord = {
      id: existing?.id ?? genId(),
      employeeId: employeeId || "UNKNOWN",
      employeeName: employeeName || "Unnamed",
      month,
      year,
      basicSalary: Number(basicSalary || 0),
      allowances: Number(allowances || 0),
      bonuses: Number(bonuses || 0),
      overtimePay: Number(overtimePay || 0),
      deductions: Number(deductions || 0),
      tax: Number(tax || 0),
      leaveDeduction: Number(leaveDeduction || 0),
      netSalary,
      paymentStatus,
      paymentDate: paymentStatus === "Paid" ? (existing?.paymentDate ?? new Date().toISOString()) : existing?.paymentDate,
    }

    if (existing) {
      dispatch(updatePayroll(payload))
    } else {
      dispatch(addPayroll(payload))
    }

    navigate("/finance")
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Payroll {existing ? "Edit" : "Create"}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage payroll record details and compute net salary.</p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{existing ? "Update Payroll" : "New Payroll"}</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
              <Input placeholder="Employee Name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
              <Input placeholder="Month" value={month} onChange={(e) => setMonth(e.target.value)} />
              <Input type="number" value={String(year)} onChange={(e) => setYear(Number(e.target.value))} />
              <Input type="number" placeholder="Basic Salary" value={String(basicSalary)} onChange={(e) => setBasicSalary(Number(e.target.value))} />
              <Input type="number" placeholder="Allowances" value={String(allowances)} onChange={(e) => setAllowances(Number(e.target.value))} />
              <Input type="number" placeholder="Bonuses" value={String(bonuses)} onChange={(e) => setBonuses(Number(e.target.value))} />
              <Input type="number" placeholder="Overtime Pay" value={String(overtimePay)} onChange={(e) => setOvertimePay(Number(e.target.value))} />
              <Input type="number" placeholder="Deductions" value={String(deductions)} onChange={(e) => setDeductions(Number(e.target.value))} />
              <Input type="number" placeholder="Tax" value={String(tax)} onChange={(e) => setTax(Number(e.target.value))} />
              <Input type="number" placeholder="Leave Deduction" value={String(leaveDeduction)} onChange={(e) => setLeaveDeduction(Number(e.target.value))} />
              <div>
                <div className="text-sm text-muted-foreground">Net Salary</div>
                <div className="font-extrabold text-2xl">${netSalary.toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigate("/finance")}>Cancel</Button>
              <Button type="submit">{existing ? "Update Payroll" : "Create Payroll"}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
