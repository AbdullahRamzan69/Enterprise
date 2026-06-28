export type LeaveType = "Annual" | "Sick" | "Casual" | "Unpaid"
export type LeaveStatus = "Pending" | "Approved" | "Rejected"

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  days: number
  reason: string
  status: LeaveStatus
  appliedAt: string
}

export const calculateLeaveDays = (startDate: string, endDate: string) => {
  if (!startDate || !endDate || endDate < startDate) {
    return 0
  }

  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  const diffMs = end.getTime() - start.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  return diffDays + 1
}

export const isEndDateBeforeStartDate = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) {
    return false
  }

  return endDate < startDate
}

