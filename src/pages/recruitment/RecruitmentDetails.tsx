import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Edit2,
  Mail,
  Phone,
  Trash2,
  UserPlus,
  UserRound,
  XCircle,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { addEmployee } from "@/features/employees/employeeSlice"
import { selectEmployees } from "@/features/employees/employeeSelectors"
import type { Employee } from "@/features/employees/employeeTypes"
import {
  deleteCandidate,
  moveToInterviewScheduled,
  moveToInterviewed,
  moveToScreening,
  rejectCandidate,
  selectCandidate,
} from "@/features/recruitment/recruitmentSlice"
import { selectCandidateById } from "@/features/recruitment/recruitmentSelectors"
import type { Candidate, CandidateStatus } from "@/features/recruitment/recruitmentTypes"

const formatSalary = (salary: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(salary)

const getStatusDotClass = (status: CandidateStatus) => {
  if (status === "Selected") return "bg-emerald-500"
  if (status === "Rejected") return "bg-rose-500"
  if (status === "Interview Scheduled" || status === "Interviewed") return "bg-blue-500"
  if (status === "Screening") return "bg-amber-500"
  return "bg-zinc-400"
}

const detailRows = (candidate: Candidate) => [
  { label: "Full Name", value: candidate.fullName },
  { label: "Candidate ID", value: candidate.id, mono: true },
  { label: "Email", value: candidate.email },
  { label: "Phone", value: candidate.phone },
  { label: "Position", value: candidate.position },
  { label: "Department", value: candidate.department },
  { label: "Experience", value: `${candidate.experience} years`, mono: true },
  { label: "Expected Salary", value: formatSalary(candidate.expectedSalary), mono: true },
  { label: "Applied Date", value: candidate.appliedDate, mono: true },
  { label: "Interview Date", value: candidate.interviewDate ?? "Not scheduled", mono: true },
  { label: "Interviewer", value: candidate.interviewer ?? "Not assigned" },
  { label: "Notes", value: candidate.notes || "No notes recorded.", wide: true },
]

const generateEmployeeId = (employees: Employee[]) => {
  const ids = employees
    .map((emp) => parseInt(emp.id.replace("EMP-", ""), 10))
    .filter((num) => !isNaN(num))
  const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 101
  return `EMP-${nextIdNum}`
}

export default function RecruitmentDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const candidate = useAppSelector((state) => (id ? selectCandidateById(state, id) : undefined))
  const employees = useAppSelector(selectEmployees)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewer, setInterviewer] = useState("")

  if (!candidate) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Candidate Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">
            We could not find a candidate record for ID "{id}". The profile may have been removed or the link may be invalid.
          </p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/recruitment">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Recruitment
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    dispatch(deleteCandidate(candidate.id))
    navigate("/recruitment")
  }

  const handleConvertToEmployee = () => {
    const newEmployee: Employee = {
      id: generateEmployeeId(employees),
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      department: candidate.department,
      designation: candidate.position,
      employmentType: "Full-time",
      joiningDate: new Date().toISOString().split("T")[0],
      salary: candidate.expectedSalary,
      address: "",
      status: "Active",
    }

    dispatch(addEmployee(newEmployee))
    dispatch(deleteCandidate(candidate.id))
    navigate(`/employees/${newEmployee.id}`)
  }

  const openScheduleDialog = () => {
    setInterviewDate(candidate.interviewDate ?? new Date().toISOString().split("T")[0])
    setInterviewer(candidate.interviewer ?? "")
    setShowScheduleDialog(true)
  }

  const handleScheduleInterview = () => {
    if (!interviewDate.trim()) return alert("Interview date is required.")
    if (!interviewer.trim()) return alert("Interviewer name is required.")

    dispatch(moveToInterviewScheduled({ id: candidate.id, interviewDate, interviewer }))
    setShowScheduleDialog(false)
  }

  const workflowSteps: CandidateStatus[] = [
    "Applied",
    "Screening",
    "Interview Scheduled",
    "Interviewed",
    "Selected",
  ]

  const currentStepIndex = workflowSteps.indexOf(
    candidate.status === "Rejected" ? "Interviewed" : candidate.status
  )

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
            <Link to="/recruitment">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Candidate Profile
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Recruitment record and hiring workflow for {candidate.fullName}.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg">
            <Link to="/recruitment">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="border-border/80 hover:bg-destructive/10 hover:text-destructive text-foreground text-xs rounded-lg"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm">
            <Link to={`/recruitment/edit/${candidate.id}`}>
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit
            </Link>
          </Button>
          {candidate.status === "Selected" && (
            <Button
              onClick={handleConvertToEmployee}
              className="bg-emerald-600 hover:bg-emerald-600/95 text-white font-semibold text-xs rounded-lg shadow-sm"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Convert to Employee
            </Button>
          )}
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
                <CardTitle className="text-base font-bold text-foreground">{candidate.fullName}</CardTitle>
                <CardDescription className="text-xs">
                  {candidate.position} in {candidate.department}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
                {candidate.id}
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground border border-border/70 rounded px-2 py-1 bg-muted/20">
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(candidate.status)}`} />
                {candidate.status}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="truncate">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>{candidate.phone}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {detailRows(candidate).map((row) => (
              <div key={row.label} className={`space-y-1.5 ${row.wide ? "md:col-span-2" : ""}`}>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {row.label}
                </p>
                <p className={`text-sm font-medium text-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2 ${row.mono ? "font-mono" : ""}`}>
                  {row.value}
                </p>
              </div>
            ))}

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </p>
              <p className="text-sm font-medium text-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2 inline-flex items-center gap-1.5 w-full">
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(candidate.status)}`} />
                {candidate.status}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card shadow-sm border border-border/60 max-w-5xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <CardTitle className="text-base font-bold text-foreground">Hiring Workflow</CardTitle>
          <CardDescription className="text-xs">
            Advance the candidate through each stage of the recruitment pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {workflowSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                    candidate.status === step
                      ? "border-primary bg-primary/10 text-primary"
                      : index <= currentStepIndex
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                      : "border-border/60 bg-muted/10 text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {index < workflowSteps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                )}
              </div>
            ))}
            {candidate.status === "Rejected" && (
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold border border-rose-500/30 bg-rose-500/10 text-rose-500">
                  Rejected
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
            {candidate.status === "Applied" && (
              <Button
                size="sm"
                onClick={() => dispatch(moveToScreening(candidate.id))}
                className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg"
              >
                <ArrowRight className="w-4 h-4 mr-1.5" />
                Move to Screening
              </Button>
            )}
            {candidate.status === "Screening" && (
              <Button
                size="sm"
                onClick={openScheduleDialog}
                className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg"
              >
                <CalendarDays className="w-4 h-4 mr-1.5" />
                Schedule Interview
              </Button>
            )}
            {candidate.status === "Interview Scheduled" && (
              <Button
                size="sm"
                onClick={() => dispatch(moveToInterviewed(candidate.id))}
                className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg"
              >
                <Briefcase className="w-4 h-4 mr-1.5" />
                Mark as Interviewed
              </Button>
            )}
            {candidate.status === "Interviewed" && (
              <>
                <Button
                  size="sm"
                  onClick={() => dispatch(selectCandidate(candidate.id))}
                  className="bg-emerald-600 hover:bg-emerald-600/95 text-white text-xs rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Select Candidate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => dispatch(rejectCandidate(candidate.id))}
                  className="border-border/80 hover:bg-rose-500/10 hover:text-rose-500 text-foreground text-xs rounded-lg"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Reject Candidate
                </Button>
              </>
            )}
            {(candidate.status === "Selected" || candidate.status === "Rejected") && (
              <p className="text-xs text-muted-foreground">
                This candidate has reached a final stage. Use Edit to modify details or Convert to Employee if selected.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="glass-panel max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Candidate Record</DialogTitle>
            <DialogDescription className="text-xs leading-normal">
              Are you sure you want to permanently delete the profile of{" "}
              <span className="font-bold text-foreground">{candidate.fullName}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/95 text-destructive-foreground text-xs rounded-lg shadow-sm"
            >
              Delete Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="glass-panel max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Schedule Interview</DialogTitle>
            <DialogDescription className="text-xs leading-normal">
              Set the interview date and assign an interviewer for {candidate.fullName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Interview Date <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={interviewDate}
                onChange={(event) => setInterviewDate(event.target.value)}
                className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Interviewer <span className="text-destructive">*</span>
              </label>
              <Input
                value={interviewer}
                onChange={(event) => setInterviewer(event.target.value)}
                placeholder="e.g. Michael Chen"
                className="bg-muted/10 border-border/80 rounded-lg text-xs"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowScheduleDialog(false)}
              className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleScheduleInterview}
              className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg shadow-sm"
            >
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
