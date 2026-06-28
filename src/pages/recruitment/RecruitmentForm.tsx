import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, Save } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { addCandidate, updateCandidate } from "@/features/recruitment/recruitmentSlice"
import { selectCandidateById, selectCandidates } from "@/features/recruitment/recruitmentSelectors"
import {
  CANDIDATE_STATUSES,
  DEPARTMENTS,
  isValidEmail,
  isValidPhone,
  type Candidate,
} from "@/features/recruitment/recruitmentTypes"

type CandidateFormData = Omit<Candidate, "experience" | "expectedSalary"> & {
  experience: string
  expectedSalary: string
}

const createCandidateFormData = (candidates: Candidate[], candidate?: Candidate): CandidateFormData => {
  if (candidate) {
    return {
      ...candidate,
      experience: candidate.experience.toString(),
      expectedSalary: candidate.expectedSalary.toString(),
    }
  }

  const ids = candidates
    .map((item) => parseInt(item.id.replace("CAN-", ""), 10))
    .filter((num) => !isNaN(num))
  const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 1001
  const today = new Date().toISOString().split("T")[0]

  return {
    id: `CAN-${nextIdNum}`,
    fullName: "",
    email: "",
    phone: "",
    position: "",
    department: "Engineering",
    experience: "",
    expectedSalary: "",
    appliedDate: today,
    interviewDate: "",
    interviewer: "",
    status: "Applied",
    notes: "",
  }
}

export default function RecruitmentForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const candidates = useAppSelector(selectCandidates)
  const candidate = useAppSelector((state) => (id ? selectCandidateById(state, id) : undefined))

  const isEditMode = !!id
  const error =
    isEditMode && id && !candidate
      ? `Candidate with ID "${id}" was not found in the recruitment registry.`
      : ""

  const [formData, setFormData] = useState<CandidateFormData>(() =>
    createCandidateFormData(candidates, candidate)
  )

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.fullName.trim()) return alert("Full Name is required.")
    if (!formData.email.trim()) return alert("Email is required.")
    if (!isValidEmail(formData.email)) return alert("Please enter a valid email address.")
    if (!formData.phone.trim()) return alert("Phone number is required.")
    if (!isValidPhone(formData.phone)) return alert("Please enter a valid phone number (10–15 digits).")
    if (!formData.position.trim()) return alert("Position is required.")
    if (!formData.experience.trim() || isNaN(Number(formData.experience))) {
      return alert("Please enter a valid experience value.")
    }
    if (Number(formData.experience) <= 0) return alert("Experience must be a positive number.")
    if (!formData.expectedSalary.trim() || isNaN(Number(formData.expectedSalary))) {
      return alert("Please enter a valid expected salary.")
    }
    if (Number(formData.expectedSalary) <= 0) return alert("Expected salary must be a positive number.")

    const payload: Candidate = {
      ...formData,
      experience: Number(formData.experience),
      expectedSalary: Number(formData.expectedSalary),
      interviewDate: formData.interviewDate || undefined,
      interviewer: formData.interviewer || undefined,
    }

    if (isEditMode) {
      dispatch(updateCandidate({ id: formData.id, updated: payload }))
    } else {
      dispatch(addCandidate(payload))
    }

    navigate("/recruitment")
  }

  if (error) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Record Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">{error}</p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/recruitment">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Return to Pipeline
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
          <Link to="/recruitment">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {isEditMode ? "Modify Candidate Profile" : "Register New Candidate"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEditMode ? `Updating recruitment records for ${formData.fullName}` : "Add a new applicant to the hiring pipeline."}
          </p>
        </div>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 max-w-4xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isEditMode ? "Edit Candidate Records" : "New Candidate Information"}
              </CardTitle>
              <CardDescription className="text-xs">
                Fill all required fields to sync the profile in the recruitment pipeline.
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
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Alexandra Rivera"
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. candidate@email.com"
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 019-2834"
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Position <span className="text-destructive">*</span>
                </label>
                <Input
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g. Senior React Developer"
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Experience (years) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  required
                  min="1"
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Expected Salary ($ USD) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  placeholder="e.g. 95000"
                  required
                  min="1"
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Applied Date
                </label>
                <Input
                  type="date"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Interview Date
                </label>
                <Input
                  type="date"
                  name="interviewDate"
                  value={formData.interviewDate ?? ""}
                  onChange={handleChange}
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Interviewer
                </label>
                <Input
                  name="interviewer"
                  value={formData.interviewer ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. Michael Chen"
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              {isEditMode && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                  >
                    {CANDIDATE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Recruiter notes, interview feedback, or referral details."
                  rows={3}
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
                <Link to="/recruitment">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isEditMode ? "Save Changes" : "Add Candidate"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
