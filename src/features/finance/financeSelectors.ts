import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "@/app/store"

export const selectFinanceState = (state: RootState) => state.finance

export const selectAllPayrolls = createSelector(
  [selectFinanceState],
  (financeState) => financeState.payrolls
)

export const selectPayrollById = createSelector(
  [selectAllPayrolls, (_state: RootState, id: string) => id],
  (payrolls, id) => payrolls.find((p) => p.id === id)
)

export const selectPayrollsByEmployeeId = createSelector(
  [selectAllPayrolls, (_state: RootState, employeeId: string) => employeeId],
  (payrolls, employeeId) => payrolls.filter((p) => p.employeeId === employeeId)
)

export const selectTotalPayrollExpense = createSelector(
  [selectAllPayrolls],
  (payrolls) => payrolls.reduce((total, p) => total + p.netSalary, 0)
)

export const selectAverageSalary = createSelector(
  [selectAllPayrolls],
  (payrolls) => {
    if (payrolls.length === 0) return 0
    const total = payrolls.reduce((sum, p) => sum + p.netSalary, 0)
    return total / payrolls.length
  }
)

export const selectHighestSalary = createSelector(
  [selectAllPayrolls],
  (payrolls) => {
    if (payrolls.length === 0) return 0
    return Math.max(...payrolls.map(p => p.netSalary))
  }
)

export const selectLowestSalary = createSelector(
  [selectAllPayrolls],
  (payrolls) => {
    if (payrolls.length === 0) return 0
    return Math.min(...payrolls.map(p => p.netSalary))
  }
)

export const selectPendingPaymentsCount = createSelector(
  [selectAllPayrolls],
  (payrolls) => payrolls.filter((p) => p.paymentStatus === "Pending").length
)

export const selectPaidEmployeesCount = createSelector(
  [selectAllPayrolls],
  (payrolls) => payrolls.filter((p) => p.paymentStatus === "Paid").length
)

export const selectTotalBonuses = createSelector(
  [selectAllPayrolls],
  (payrolls) => payrolls.reduce((total, p) => total + p.bonuses, 0)
)

export const selectTotalDeductions = createSelector(
  [selectAllPayrolls],
  (payrolls) => payrolls.reduce((total, p) => total + p.deductions + p.tax + p.leaveDeduction, 0)
)

export const selectPayrollsByMonthAndYear = createSelector(
  [selectAllPayrolls, (_state: RootState, month: string) => month, (_state: RootState, year: number) => year],
  (payrolls, month, year) => payrolls.filter((p) => p.month === month && p.year === year)
)
