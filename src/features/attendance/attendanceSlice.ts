import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AttendanceRecord } from "./attendanceTypes"

export interface AttendanceState {
  records: AttendanceRecord[]
}

export const ATTENDANCE_STORAGE_KEY = "aethel-ebms-attendance"

const today = new Date().toISOString().split("T")[0]

const initialMockAttendance: AttendanceRecord[] = [
  {
    id: "ATT-1001",
    employeeId: "EMP-101",
    employeeName: "Sarah Jenkins",
    date: today,
    checkIn: "08:55",
    checkOut: "17:10",
    status: "Present",
  },
  {
    id: "ATT-1002",
    employeeId: "EMP-102",
    employeeName: "Michael Chen",
    date: today,
    checkIn: "09:35",
    checkOut: "18:05",
    status: "Late",
  },
  {
    id: "ATT-1003",
    employeeId: "EMP-103",
    employeeName: "Sophia Miller",
    date: today,
    checkIn: "09:00",
    checkOut: "13:00",
    status: "Half Day",
  },
  {
    id: "ATT-1004",
    employeeId: "EMP-104",
    employeeName: "Robert Frost",
    date: today,
    checkIn: "00:00",
    checkOut: "00:00",
    status: "Absent",
  },
  {
    id: "ATT-1005",
    employeeId: "EMP-105",
    employeeName: "David Vance",
    date: today,
    checkIn: "08:45",
    checkOut: "17:00",
    status: "Present",
  },
  {
    id: "ATT-1006",
    employeeId: "EMP-106",
    employeeName: "Emily Blunt",
    date: today,
    checkIn: "09:10",
    checkOut: "17:20",
    status: "Present",
  },
  {
    id: "ATT-1007",
    employeeId: "EMP-107",
    employeeName: "Marcus Aurelius",
    date: "2026-06-20",
    checkIn: "08:50",
    checkOut: "17:15",
    status: "Present",
  },
  {
    id: "ATT-1008",
    employeeId: "EMP-108",
    employeeName: "Clara Oswald",
    date: "2026-06-20",
    checkIn: "09:45",
    checkOut: "17:30",
    status: "Late",
  },
  {
    id: "ATT-1009",
    employeeId: "EMP-109",
    employeeName: "John Hammond",
    date: "2026-06-19",
    checkIn: "09:00",
    checkOut: "13:30",
    status: "Half Day",
  },
]

const loadInitialAttendance = (): AttendanceRecord[] => {
  if (typeof window === "undefined") {
    return initialMockAttendance
  }

  const savedAttendance = window.localStorage.getItem(ATTENDANCE_STORAGE_KEY)

  if (!savedAttendance) {
    return initialMockAttendance
  }

  try {
    return JSON.parse(savedAttendance) as AttendanceRecord[]
  } catch {
    return initialMockAttendance
  }
}

const initialState: AttendanceState = {
  records: loadInitialAttendance(),
}

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    addAttendance: (state, action: PayloadAction<AttendanceRecord>) => {
      state.records.push(action.payload)
    },
    updateAttendance: (
      state,
      action: PayloadAction<{ id: string; updated: Partial<AttendanceRecord> }>
    ) => {
      const record = state.records.find((attendance) => attendance.id === action.payload.id)

      if (record) {
        Object.assign(record, action.payload.updated)
      }
    },
    deleteAttendance: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter((attendance) => attendance.id !== action.payload)
    },
  },
})

export const { addAttendance, updateAttendance, deleteAttendance } = attendanceSlice.actions
export default attendanceSlice.reducer

