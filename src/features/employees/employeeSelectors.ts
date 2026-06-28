import type { RootState } from "@/app/store"

export const selectEmployees = (state: RootState) => state.employees.employees

export const selectEmployeeById = (state: RootState, id: string) =>
  selectEmployees(state).find((emp) => emp.id === id)

