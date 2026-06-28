import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, Save } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { addLeave, updateLeave } from "@/features/leave/leaveSlice"
import { selectLeaveById, selectLeaveRequests } from "@/features/leave/leaveSelectors"
import {
  calculateLeaveDays,
  isEndDateBeforeStartDate,
  type LeaveRequest,
  type LeaveType,
} from "@/features/leave/leaveTypes"
import { selectEmployees } from "@/features/employees/employeeSelectors"

const LEAVE_TYPES: LeaveType[] = ["Annual", "Sick", "Casual", "Unpaid"]

type LeaveFormData = Omit<LeaveRequest, "days" | "status" | "appliedAt"> & {
  days: number
  status: LeaveRequest["status"]
  appliedAt: string
}

const createLeaveFormData = (
  requests: LeaveRequest[],
  request?: LeaveRequest,
  firstEmployee?: { id: string; fullName: string }
): LeaveFormData => {
  if (request) {
    return request
  }

  const ids = requests
    .map((leave) => parseInt(leave.id.replace("LEV-", ""), 10))
    .filter((num) => !isNaN(num))
  const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 5001
  const today = new Date().toISOString().split("T")[0]

  return {
    id: `LEV-${nextIdNum}`,
    employeeId: firstEmployee?.id ?? "",
    employeeName: firstEmployee?.fullName ?? "",
    leaveType: "Annual",
    startDate: today,
    endDate: today,
    days: 1,
    reason: "",
    status: "Pending",
    appliedAt: today,
  }
}

export default function LeaveForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const requests = useAppSelector(selectLeaveRequests)
  const employees = useAppSelector(selectEmployees)
  const request = useAppSelector((state) => (id ? selectLeaveById(state, id) : undefined))

  const isEditMode = !!id
  const error =
    isEditMode && id && !request
      ? `Leave request "${id}" was not found in the registry.`
      : ""

  const [formData, setFormData] = useState<LeaveFormData>(() =>
    createLeaveFormData(requests, request, employees[0])
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
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    if (name === "employeeId") {
      handleEmployeeChange(value)
      return
    }

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      }

      if (name === "startDate" || name === "endDate") {
        updated.days = calculateLeaveDays(updated.startDate, updated.endDate)
      }

      return updated
    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.employeeId || !formData.employeeName) return alert("Employee is required.")
    if (!formData.leaveType) return alert("Leave Type is required.")
    if (!formData.startDate) return alert("Start Date is required.")
    if (!formData.endDate) return alert("End Date is required.")
    if (!formData.reason.trim()) return alert("Reason is required.")
    if (isEndDateBeforeStartDate(formData.startDate, formData.endDate)) {
      return alert("End date cannot be before start date.")
    }

    const payload: LeaveRequest = {
      ...formData,
      days: calculateLeaveDays(formData.startDate, formData.endDate),
    }

    if (isEditMode) {
      dispatch(updateLeave({ id: payload.id, updated: payload }))
    } else {
      dispatch(addLeave(payload))
    }

    navigate("/leave")
  }

  if (error) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Leave Request Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">{error}</p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/leave">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Leave
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
          <Link to="/leave">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {isEditMode ? "Modify Leave Request" : "Create Leave Request"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEditMode ? `Updating leave details for ${formData.employeeName}.` : "Submit a time-off request for review."}
          </p>
        </div>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 max-w-4xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isEditMode ? "Edit Leave Application" : "New Leave Application"}
              </CardTitle>
              <CardDescription className="text-xs">
                Duration is calculated automatically from the selected date range.
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
                  Leave Type <span className="text-destructive">*</span>
                </label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  required
                  className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                >
                  {LEAVE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Start Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  End Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Total Leave Days
                </label>
                <Input
                  value={formData.days}
                  readOnly
                  className="bg-muted/20 border-border/80 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Reason <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Provide a brief reason for the leave request."
                  className="flex w-full rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg"
              >
                <Link to="/leave">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isEditMode ? "Save Changes" : "Submit Request"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

