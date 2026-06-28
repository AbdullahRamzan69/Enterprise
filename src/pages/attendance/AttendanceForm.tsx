import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, Save } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { addAttendance, updateAttendance } from "@/features/attendance/attendanceSlice"
import { selectAttendanceById, selectAttendanceRecords } from "@/features/attendance/attendanceSelectors"
import { isCheckOutBeforeCheckIn, type AttendanceRecord, type AttendanceStatus } from "@/features/attendance/attendanceTypes"
import { selectEmployees } from "@/features/employees/employeeSelectors"

const STATUSES: AttendanceStatus[] = ["Present", "Absent", "Late", "Half Day"]

type AttendanceFormData = AttendanceRecord

const createAttendanceFormData = (
  records: AttendanceRecord[],
  record?: AttendanceRecord,
  firstEmployee?: { id: string; fullName: string }
): AttendanceFormData => {
  if (record) {
    return record
  }

  const ids = records
    .map((attendance) => parseInt(attendance.id.replace("ATT-", ""), 10))
    .filter((num) => !isNaN(num))
  const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 1001

  return {
    id: `ATT-${nextIdNum}`,
    employeeId: firstEmployee?.id ?? "",
    employeeName: firstEmployee?.fullName ?? "",
    date: new Date().toISOString().split("T")[0],
    checkIn: "09:00",
    checkOut: "17:00",
    status: "Present",
  }
}

export default function AttendanceForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const records = useAppSelector(selectAttendanceRecords)
  const employees = useAppSelector(selectEmployees)
  const record = useAppSelector((state) => (id ? selectAttendanceById(state, id) : undefined))

  const isEditMode = !!id
  const error =
    isEditMode && id && !record
      ? `Attendance record "${id}" was not found in the register.`
      : ""

  const [formData, setFormData] = useState<AttendanceFormData>(() =>
    createAttendanceFormData(records, record, employees[0])
  )

  const handleEmployeeChange = (employeeId: string) => {
    const selectedEmployee = employees.find((employee) => employee.id === employeeId)

    setFormData((prev) => ({
      ...prev,
      employeeId,
      employeeName: selectedEmployee?.fullName ?? "",
    }))
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target

    if (name === "employeeId") {
      handleEmployeeChange(value)
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.employeeId || !formData.employeeName) return alert("Employee is required.")
    if (!formData.date) return alert("Date is required.")
    if (!formData.checkIn) return alert("Check In is required.")
    if (!formData.checkOut) return alert("Check Out is required.")
    if (!formData.status) return alert("Status is required.")
    if (isCheckOutBeforeCheckIn(formData.checkIn, formData.checkOut)) {
      return alert("Check-out cannot be earlier than check-in.")
    }

    if (isEditMode) {
      dispatch(updateAttendance({ id: formData.id, updated: formData }))
    } else {
      dispatch(addAttendance(formData))
    }

    navigate("/attendance")
  }

  if (error) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Attendance Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">{error}</p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/attendance">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Attendance
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="h-8 w-8 rounded-lg border-border/80 text-muted-foreground hover:text-foreground shrink-0"
        >
          <Link to="/attendance">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {isEditMode ? "Modify Attendance Log" : "Record Attendance"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEditMode ? `Updating attendance for ${formData.employeeName}.` : "Capture daily attendance for an employee."}
          </p>
        </div>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 max-w-4xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isEditMode ? "Edit Attendance Record" : "New Attendance Record"}
              </CardTitle>
              <CardDescription className="text-xs">
                Required fields keep the attendance register consistent and reportable.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
              {formData.id}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Employee <span className="text-destructive">*</span>
                </label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                >
                  {employees.length === 0 && <option value="">No employees available</option>}
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.fullName} ({employee.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Check In <span className="text-destructive">*</span>
                </label>
                <Input
                  type="time"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Check Out <span className="text-destructive">*</span>
                </label>
                <Input
                  type="time"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Status <span className="text-destructive">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg"
              >
                <Link to="/attendance">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isEditMode ? "Save Changes" : "Create Record"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

