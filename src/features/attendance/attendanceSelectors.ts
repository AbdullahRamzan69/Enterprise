import type { RootState } from "@/app/store"
import type { AttendanceStatus } from "./attendanceTypes"

export const selectAttendanceRecords = (state: RootState) => state.attendance.records

export const selectAttendanceById = (state: RootState, id: string) =>
  selectAttendanceRecords(state).find((record) => record.id === id)

export const selectAttendanceByDate = (state: RootState, date: string) =>
  selectAttendanceRecords(state).filter((record) => record.date === date)

export const selectAttendanceCountByDateAndStatus = (
  state: RootState,
  date: string,
  status: AttendanceStatus
) => selectAttendanceByDate(state, date).filter((record) => record.status === status).length

export const selectAttendanceByEmployeeId = (state: RootState, employeeId: string) =>
  selectAttendanceRecords(state).filter((record) => record.employeeId === employeeId)

