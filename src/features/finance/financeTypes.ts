export interface PayrollRecord {
  id: string
  employeeId: string
  employeeName: string
  month: string
  year: number
  basicSalary: number
  allowances: number
  bonuses: number
  overtimePay: number
  deductions: number
  tax: number
  leaveDeduction: number
  netSalary: number
  paymentStatus: "Pending" | "Paid"
  paymentDate?: string
}

export interface FinanceState {
  payrolls: PayrollRecord[]
}
