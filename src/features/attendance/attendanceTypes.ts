export type AttendanceStatus = "Present" | "Absent" | "Late" | "Half Day"

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  status: AttendanceStatus
}

export const calculateWorkingHours = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) {
    return "0 hours"
  }

  const [inHours, inMinutes] = checkIn.split(":").map(Number)
  const [outHours, outMinutes] = checkOut.split(":").map(Number)
  const startMinutes = inHours * 60 + inMinutes
  const endMinutes = outHours * 60 + outMinutes
  const diffMinutes = Math.max(endMinutes - startMinutes, 0)
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  if (minutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`
  }

  return `${hours}h ${minutes}m`
}

export const isCheckOutBeforeCheckIn = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) {
    return false
  }

  return checkOut < checkIn
}

