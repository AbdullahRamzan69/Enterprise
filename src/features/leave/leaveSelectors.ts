import type { RootState } from "@/app/store"
import type { LeaveStatus } from "./leaveTypes"

export const selectLeaveRequests = (state: RootState) => state.leave.requests

export const selectLeaveById = (state: RootState, id: string) =>
  selectLeaveRequests(state).find((request) => request.id === id)

export const selectLeaveRequestsByEmployeeId = (state: RootState, employeeId: string) =>
  selectLeaveRequests(state).filter((request) => request.employeeId === employeeId)

export const selectLeaveCountByStatus = (state: RootState, status: LeaveStatus) =>
  selectLeaveRequests(state).filter((request) => request.status === status).length

export const selectApprovedLeaveDaysByEmployeeId = (state: RootState, employeeId: string) =>
  selectLeaveRequestsByEmployeeId(state, employeeId)
    .filter((request) => request.status === "Approved")
    .reduce((total, request) => total + request.days, 0)

export const selectPendingLeaveCountByEmployeeId = (state: RootState, employeeId: string) =>
  selectLeaveRequestsByEmployeeId(state, employeeId).filter((request) => request.status === "Pending").length

export const selectApprovedLeaveCountByEmployeeId = (state: RootState, employeeId: string) =>
  selectLeaveRequestsByEmployeeId(state, employeeId).filter((request) => request.status === "Approved").length

