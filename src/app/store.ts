import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"
import attendanceReducer, { ATTENDANCE_STORAGE_KEY } from "@/features/attendance/attendanceSlice"
import employeeReducer, { EMPLOYEES_STORAGE_KEY } from "@/features/employees/employeeSlice"
import leaveReducer, { LEAVE_STORAGE_KEY } from "@/features/leave/leaveSlice"
import projectReducer, { PROJECTS_STORAGE_KEY } from "@/features/projects/projectSlice"
import recruitmentReducer, { RECRUITMENT_STORAGE_KEY } from "@/features/recruitment/recruitmentSlice"
import crmReducer, { CRM_STORAGE_KEY } from "@/features/crm/crmSlice"
import financeReducer, { FINANCE_STORAGE_KEY } from "@/features/finance/financeSlice"

export const store = configureStore({
  reducer: {
    attendance: attendanceReducer,
    employees: employeeReducer,
    leave: leaveReducer,
    recruitment: recruitmentReducer,
    projects: projectReducer,
    crm: crmReducer,
    finance: financeReducer,
  },
})

store.subscribe(() => {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(
    EMPLOYEES_STORAGE_KEY,
    JSON.stringify(store.getState().employees.employees)
  )
  window.localStorage.setItem(
    ATTENDANCE_STORAGE_KEY,
    JSON.stringify(store.getState().attendance.records)
  )
  window.localStorage.setItem(
    LEAVE_STORAGE_KEY,
    JSON.stringify(store.getState().leave.requests)
  )
  window.localStorage.setItem(
    RECRUITMENT_STORAGE_KEY,
    JSON.stringify(store.getState().recruitment.candidates)
  )
  window.localStorage.setItem(
    PROJECTS_STORAGE_KEY,
    JSON.stringify(store.getState().projects.projects)
  )
  window.localStorage.setItem(
    CRM_STORAGE_KEY,
    JSON.stringify(store.getState().crm.customers)
  )
  window.localStorage.setItem(
    FINANCE_STORAGE_KEY,
    JSON.stringify(store.getState().finance.payrolls)
  )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
