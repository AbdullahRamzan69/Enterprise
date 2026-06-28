import { Link, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, CalendarDays, CheckCircle2, Edit2, Umbrella, XCircle } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { approveLeave, rejectLeave } from "@/features/leave/leaveSlice"
import { selectLeaveById } from "@/features/leave/leaveSelectors"
import type { LeaveRequest, LeaveStatus } from "@/features/leave/leaveTypes"

const getStatusDotClass = (status: LeaveStatus) => {
  if (status === "Approved") return "bg-emerald-500"
  if (status === "Rejected") return "bg-rose-500"
  return "bg-amber-500"
}

const detailRows = (request: LeaveRequest) => [
  { label: "Employee", value: `${request.employeeName} (${request.employeeId})` },
  { label: "Leave Type", value: request.leaveType },
  { label: "Duration", value: `${request.startDate} - ${request.endDate}`, mono: true },
  { label: "Days", value: request.days.toString(), mono: true },
  { label: "Status", value: request.status },
  { label: "Applied Date", value: request.appliedAt, mono: true },
  { label: "Reason", value: request.reason, wide: true },
]

export default function LeaveDetails() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const request = useAppSelector((state) => (id ? selectLeaveById(state, id) : undefined))

  if (!request) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Leave Request Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">
            We could not find a leave request for ID "{id}". The request may have been removed or the link may be invalid.
          </p>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              Leave Details
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Leave application and manager decision status for {request.employeeName}.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg">
            <Link to="/leave">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Leave
            </Link>
          </Button>
          <Button
            variant="outline"
            disabled={request.status === "Approved"}
            onClick={() => dispatch(approveLeave(request.id))}
            className="border-border/80 hover:bg-emerald-500/10 hover:text-emerald-500 text-foreground text-xs rounded-lg disabled:opacity-40"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Approve
          </Button>
          <Button
            variant="outline"
            disabled={request.status === "Rejected"}
            onClick={() => dispatch(rejectLeave(request.id))}
            className="border-border/80 hover:bg-rose-500/10 hover:text-rose-500 text-foreground text-xs rounded-lg disabled:opacity-40"
          >
            <XCircle className="w-4 h-4 mr-1.5" />
            Reject
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm">
            <Link to={`/leave/edit/${request.id}`}>
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit Request
            </Link>
          </Button>
        </div>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 max-w-5xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-border/50">
                <Umbrella className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">{request.employeeName}</CardTitle>
                <CardDescription className="text-xs">
                  {request.leaveType} leave from {request.startDate} to {request.endDate}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
                {request.id}
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground border border-border/70 rounded px-2 py-1 bg-muted/20">
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(request.status)}`} />
                {request.status}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              <span className="font-mono">{request.startDate} - {request.endDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <Umbrella className="w-4 h-4 text-primary" />
              <span>{request.days} {request.days === 1 ? "day" : "days"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {detailRows(request).map((row) => (
              <div key={row.label} className={`space-y-1.5 ${row.wide ? "md:col-span-2" : ""}`}>
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

