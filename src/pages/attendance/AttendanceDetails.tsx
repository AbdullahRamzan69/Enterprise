import { Link, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, CalendarDays, Clock, Edit2, UserRound } from "lucide-react"
import { useAppSelector } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { selectAttendanceById } from "@/features/attendance/attendanceSelectors"
import { calculateWorkingHours, type AttendanceRecord, type AttendanceStatus } from "@/features/attendance/attendanceTypes"

const getStatusDotClass = (status: AttendanceStatus) => {
  if (status === "Present") return "bg-emerald-500"
  if (status === "Absent") return "bg-rose-500"
  if (status === "Late") return "bg-amber-500"
  return "bg-blue-500"
}

const detailRows = (record: AttendanceRecord) => [
  { label: "Employee", value: `${record.employeeName} (${record.employeeId})` },
  { label: "Date", value: record.date, mono: true },
  { label: "Check In", value: record.checkIn, mono: true },
  { label: "Check Out", value: record.checkOut, mono: true },
  { label: "Working Hours", value: calculateWorkingHours(record.checkIn, record.checkOut) },
  { label: "Status", value: record.status },
]

export default function AttendanceDetails() {
  const { id } = useParams<{ id: string }>()
  const record = useAppSelector((state) => (id ? selectAttendanceById(state, id) : undefined))

  if (!record) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Attendance Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">
            We could not find an attendance record for ID "{id}". The log may have been removed or the link may be invalid.
          </p>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              Attendance Details
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Daily attendance log for {record.employeeName}.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg">
            <Link to="/attendance">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Attendance
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm">
            <Link to={`/attendance/edit/${record.id}`}>
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit Attendance
            </Link>
          </Button>
        </div>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 max-w-5xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-border/50">
                <UserRound className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">{record.employeeName}</CardTitle>
                <CardDescription className="text-xs">
                  Attendance record for {record.date}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
                {record.id}
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground border border-border/70 rounded px-2 py-1 bg-muted/20">
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(record.status)}`} />
                {record.status}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              <span className="font-mono">{record.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{calculateWorkingHours(record.checkIn, record.checkOut)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {detailRows(record).map((row) => (
              <div key={row.label} className="space-y-1.5">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {row.label}
                </p>
                <p className={`text-sm font-medium text-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2 ${row.mono ? "font-mono" : ""}`}>
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

