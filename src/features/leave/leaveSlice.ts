import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { LeaveRequest } from "./leaveTypes"

export interface LeaveState {
  requests: LeaveRequest[]
}

export const LEAVE_STORAGE_KEY = "aethel-ebms-leave"

const today = new Date().toISOString().split("T")[0]

const initialMockLeaveRequests: LeaveRequest[] = [
  {
    id: "LEV-5001",
    employeeId: "EMP-101",
    employeeName: "Sarah Jenkins",
    leaveType: "Annual",
    startDate: "2026-06-26",
    endDate: "2026-06-28",
    days: 3,
    reason: "Family travel and annual time off.",
    status: "Pending",
    appliedAt: today,
  },
  {
    id: "LEV-5002",
    employeeId: "EMP-102",
    employeeName: "Michael Chen",
    leaveType: "Sick",
    startDate: "2026-06-20",
    endDate: "2026-06-21",
    days: 2,
    reason: "Medical rest after seasonal illness.",
    status: "Approved",
    appliedAt: "2026-06-18",
  },
  {
    id: "LEV-5003",
    employeeId: "EMP-103",
    employeeName: "Sophia Miller",
    leaveType: "Annual",
    startDate: "2026-06-21",
    endDate: "2026-06-25",
    days: 5,
    reason: "Planned vacation leave.",
    status: "Approved",
    appliedAt: "2026-06-10",
  },
  {
    id: "LEV-5004",
    employeeId: "EMP-104",
    employeeName: "Robert Frost",
    leaveType: "Casual",
    startDate: "2026-06-27",
    endDate: "2026-06-27",
    days: 1,
    reason: "Personal appointment during work hours.",
    status: "Pending",
    appliedAt: today,
  },
  {
    id: "LEV-5005",
    employeeId: "EMP-105",
    employeeName: "David Vance",
    leaveType: "Unpaid",
    startDate: "2026-06-14",
    endDate: "2026-06-16",
    days: 3,
    reason: "Unpaid leave requested for personal commitments.",
    status: "Rejected",
    appliedAt: "2026-06-08",
  },
  {
    id: "LEV-5006",
    employeeId: "EMP-106",
    employeeName: "Emily Blunt",
    leaveType: "Sick",
    startDate: "2026-06-24",
    endDate: "2026-06-24",
    days: 1,
    reason: "Doctor appointment and recovery time.",
    status: "Pending",
    appliedAt: "2026-06-23",
  },
  {
    id: "LEV-5007",
    employeeId: "EMP-108",
    employeeName: "Clara Oswald",
    leaveType: "Casual",
    startDate: "2026-06-12",
    endDate: "2026-06-12",
    days: 1,
    reason: "University documentation appointment.",
    status: "Approved",
    appliedAt: "2026-06-08",
  },
]

const loadInitialLeaveRequests = (): LeaveRequest[] => {
  if (typeof window === "undefined") {
    return initialMockLeaveRequests
  }

  const savedLeaveRequests = window.localStorage.getItem(LEAVE_STORAGE_KEY)

  if (!savedLeaveRequests) {
    return initialMockLeaveRequests
  }

  try {
    return JSON.parse(savedLeaveRequests) as LeaveRequest[]
  } catch {
    return initialMockLeaveRequests
  }
}

const initialState: LeaveState = {
  requests: loadInitialLeaveRequests(),
}

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    addLeave: (state, action: PayloadAction<LeaveRequest>) => {
      state.requests.push(action.payload)
    },
    updateLeave: (
      state,
      action: PayloadAction<{ id: string; updated: Partial<LeaveRequest> }>
    ) => {
      const request = state.requests.find((leave) => leave.id === action.payload.id)

      if (request) {
        Object.assign(request, action.payload.updated)
      }
    },
    deleteLeave: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter((leave) => leave.id !== action.payload)
    },
    approveLeave: (state, action: PayloadAction<string>) => {
      const request = state.requests.find((leave) => leave.id === action.payload)

      if (request) {
        request.status = "Approved"
      }
    },
    rejectLeave: (state, action: PayloadAction<string>) => {
      const request = state.requests.find((leave) => leave.id === action.payload)

      if (request) {
        request.status = "Rejected"
      }
    },
  },
})

export const { addLeave, updateLeave, deleteLeave, approveLeave, rejectLeave } = leaveSlice.actions
export default leaveSlice.reducer

