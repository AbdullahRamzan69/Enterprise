import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { PayrollRecord, FinanceState } from "./financeTypes"

export const FINANCE_STORAGE_KEY = "aethel_ebms_finance"

const getInitialState = (): FinanceState => {
  if (typeof window === "undefined") {
    return { payrolls: [] }
  }
  const stored = window.localStorage.getItem(FINANCE_STORAGE_KEY)
  if (stored) {
    try {
      return { payrolls: JSON.parse(stored) }
    } catch (e) {
      console.error("Failed to parse Finance from localStorage", e)
    }
  }

  const currentDate = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' })
  const currentYear = currentDate.getFullYear()

  // Generate mock payrolls for existing mock employees
  const mockPayrolls: PayrollRecord[] = [
    {
      id: "PAY-1001",
      employeeId: "EMP-101",
      employeeName: "Sarah Jenkins",
      month: currentMonth,
      year: currentYear,
      basicSalary: 7000,
      allowances: 1000,
      bonuses: 500,
      overtimePay: 0,
      deductions: 200,
      tax: 1500,
      leaveDeduction: 0,
      netSalary: 6800,
      paymentStatus: "Paid",
      paymentDate: new Date(currentYear, currentDate.getMonth(), 1).toISOString(),
    },
    {
      id: "PAY-1002",
      employeeId: "EMP-102",
      employeeName: "Michael Chen",
      month: currentMonth,
      year: currentYear,
      basicSalary: 11000,
      allowances: 1500,
      bonuses: 0,
      overtimePay: 0,
      deductions: 100,
      tax: 2500,
      leaveDeduction: 0,
      netSalary: 9900,
      paymentStatus: "Pending",
    },
    {
      id: "PAY-1003",
      employeeId: "EMP-103",
      employeeName: "Sophia Miller",
      month: currentMonth,
      year: currentYear,
      basicSalary: 5000,
      allowances: 500,
      bonuses: 200,
      overtimePay: 150,
      deductions: 50,
      tax: 800,
      leaveDeduction: 100,
      netSalary: 4900,
      paymentStatus: "Paid",
      paymentDate: new Date(currentYear, currentDate.getMonth(), 3).toISOString(),
    },
    {
      id: "PAY-1004",
      employeeId: "EMP-104",
      employeeName: "Robert Frost",
      month: currentMonth,
      year: currentYear,
      basicSalary: 6000,
      allowances: 800,
      bonuses: 1000,
      overtimePay: 0,
      deductions: 0,
      tax: 1200,
      leaveDeduction: 0,
      netSalary: 6600,
      paymentStatus: "Pending",
    },
    {
      id: "PAY-1005",
      employeeId: "EMP-105",
      employeeName: "David Vance",
      month: currentMonth,
      year: currentYear,
      basicSalary: 7500,
      allowances: 1200,
      bonuses: 0,
      overtimePay: 0,
      deductions: 300,
      tax: 1600,
      leaveDeduction: 0,
      netSalary: 6800,
      paymentStatus: "Pending",
    },
    {
      id: "PAY-1006",
      employeeId: "EMP-106",
      employeeName: "Emily Blunt",
      month: currentMonth,
      year: currentYear,
      basicSalary: 4000,
      allowances: 400,
      bonuses: 100,
      overtimePay: 0,
      deductions: 0,
      tax: 600,
      leaveDeduction: 0,
      netSalary: 3900,
      paymentStatus: "Paid",
      paymentDate: new Date(currentYear, currentDate.getMonth(), 2).toISOString(),
    },
    {
      id: "PAY-1007",
      employeeId: "EMP-107",
      employeeName: "Marcus Aurelius",
      month: currentMonth,
      year: currentYear,
      basicSalary: 9000,
      allowances: 1000,
      bonuses: 1500,
      overtimePay: 200,
      deductions: 150,
      tax: 2100,
      leaveDeduction: 0,
      netSalary: 9450,
      paymentStatus: "Pending",
    },
  ]

  return { payrolls: mockPayrolls }
}

const financeSlice = createSlice({
  name: "finance",
  initialState: getInitialState(),
  reducers: {
    addPayroll: (state, action: PayloadAction<PayrollRecord>) => {
      state.payrolls.push(action.payload)
    },
    updatePayroll: (state, action: PayloadAction<PayrollRecord>) => {
      const index = state.payrolls.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.payrolls[index] = action.payload
      }
    },
    deletePayroll: (state, action: PayloadAction<string>) => {
      state.payrolls = state.payrolls.filter((p) => p.id !== action.payload)
    },
    markAsPaid: (state, action: PayloadAction<string>) => {
      const payroll = state.payrolls.find((p) => p.id === action.payload)
      if (payroll && payroll.paymentStatus === "Pending") {
        payroll.paymentStatus = "Paid"
        payroll.paymentDate = new Date().toISOString()
      }
    },
  },
})

export const { addPayroll, updatePayroll, deletePayroll, markAsPaid } = financeSlice.actions

export default financeSlice.reducer
