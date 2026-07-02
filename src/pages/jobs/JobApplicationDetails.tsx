import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserCheck,
  UserRoundX,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ApplicantStatusBadge } from "@/components/jobs/ApplicantStatusBadge";
import {
  selectApplicantById,
  selectJobById,
} from "@/features/jobs/jobSelectors";
import { updateApplicantStatus } from "@/features/jobs/jobSlice";
import {
  formatCurrency,
  formatDate,
  getInitials,
} from "@/features/jobs/jobUtils";
import type { ApplicantStatus } from "@/features/jobs/jobTypes";

const APPLICANT_STATUS_FLOW: ApplicantStatus[] = [
  "New",
  "Under Review",
  "Interview Scheduled",
  "Hired",
];

export default function JobApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const application = useAppSelector((state) =>
    id ? selectApplicantById(state, id) : undefined,
  );
  const job = useAppSelector((state) =>
    application ? selectJobById(state, application.jobId) : undefined,
  );

  const [contactOpen, setContactOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    interviewDate: new Date().toISOString().split("T")[0],
    interviewTime: "10:00",
    interviewer: "",
    interviewNotes: application?.notes ?? "",
  });

  if (!application) {
    return (
      <div className="space-y-6 py-12 text-center select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto space-y-4 rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Application Not Found
          </h2>
          <p className="text-xs leading-normal text-muted-foreground">
            We could not find that application record. It may have been removed
            or the link may be invalid.
          </p>
          <Button asChild size="sm" className="rounded-lg">
            <Link to="/jobs">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentStatusForTimeline =
    application.status === "Rejected"
      ? "Interview Scheduled"
      : application.status;

  const timelineSteps = APPLICANT_STATUS_FLOW.map((status) => ({
    status,
    completed:
      APPLICANT_STATUS_FLOW.indexOf(status) <=
      APPLICANT_STATUS_FLOW.indexOf(currentStatusForTimeline),
    active: application.status === status,
  }));

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(application.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 1400);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleSchedule = () => {
    dispatch(
      updateApplicantStatus({
        id: application.id,
        status: "Interview Scheduled",
      }),
    );
    setScheduleOpen(false);
  };

  const handleReject = () => {
    dispatch(
      updateApplicantStatus({
        id: application.id,
        status: "Rejected",
      }),
    );
    setRejectOpen(false);
  };

  const handleHire = () => {
    dispatch(
      updateApplicantStatus({
        id: application.id,
        status: "Hired",
      }),
    );
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-8 w-8 shrink-0 rounded-lg border-border/80"
          >
            <Link to={job ? `/jobs/${job.id}` : "/jobs"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent md:text-3xl">
              Job Application Details
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Full applicant profile and hiring workflow for{" "}
              {application.fullName}.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setContactOpen(true)}
            className="rounded-lg border-border/80 text-xs"
          >
            <Mail className="mr-1.5 h-4 w-4" />
            Contact
          </Button>
          <Button
            variant="outline"
            onClick={() => setScheduleOpen(true)}
            className="rounded-lg border-border/80 text-xs"
          >
            <CalendarDays className="mr-1.5 h-4 w-4" />
            Schedule Interview
          </Button>
          <Button
            variant="outline"
            onClick={() => setRejectOpen(true)}
            className="rounded-lg border-border/80 text-xs hover:bg-destructive/10 hover:text-destructive"
          >
            <UserRoundX className="mr-1.5 h-4 w-4" />
            Reject
          </Button>
          {application.status !== "Hired" &&
            application.status !== "Rejected" && (
              <Button
                onClick={handleHire}
                className="rounded-lg bg-emerald-600 text-xs text-white shadow-sm hover:bg-emerald-600/95"
              >
                <UserCheck className="mr-1.5 h-4 w-4" />
                Hire Candidate
              </Button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card className="glass-card overflow-hidden rounded-2xl border border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border border-border/60 shadow-sm">
                    <AvatarImage
                      src={application.avatar}
                      alt={application.fullName}
                    />
                    <AvatarFallback className="bg-primary/10 font-bold text-primary">
                      {getInitials(application.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {application.fullName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {job?.title ?? application.currentRole}
                      {job ? ` • ${job.department}` : ""}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full px-2.5 py-1 font-mono text-[11px]"
                  >
                    {application.id}
                  </Badge>
                  <ApplicantStatusBadge status={application.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="truncate">{application.email}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{application.phone}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm text-muted-foreground md:col-span-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{application.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Position Applied
                  </p>
                  <div className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm font-medium text-foreground">
                    {job?.title ?? application.currentRole}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Department
                  </p>
                  <div className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm font-medium text-foreground">
                    {job?.department ?? "Not assigned"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Experience
                  </p>
                  <div className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm font-medium text-foreground">
                    {application.experience} years
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Expected Salary
                  </p>
                  <div className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm font-medium text-foreground">
                    {formatCurrency(application.expectedSalary)}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Current Company
                  </p>
                  <div className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm font-medium text-foreground">
                    {application.currentCompany}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Notice Period
                  </p>
                  <div className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm font-medium text-foreground">
                    {application.noticePeriod}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Cover Letter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">
                {application.coverLetter}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {application.skills.map((skill: string) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="rounded-full bg-muted/20 px-2.5 py-1"
                >
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="glass-card rounded-2xl border border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {application.education.map((item: string) => (
                  <div
                    key={item}
                    className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card rounded-2xl border border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <BriefcaseBusiness className="h-4 w-4 text-primary" />
                  Previous Employment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {application.previousEmployment.map((item: string) => (
                  <div
                    key={item}
                    className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm text-foreground"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="glass-card rounded-2xl border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Application Timeline
              </CardTitle>
              <CardDescription className="text-xs">
                Track the applicant through each hiring stage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {timelineSteps.map((step, index) => (
                <div key={step.status} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-semibold ${
                        step.active
                          ? "border-primary bg-primary/10 text-primary"
                          : step.completed
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                            : "border-border bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div className="mt-1 h-8 w-px bg-border" />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-semibold text-foreground">
                      {step.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.active
                        ? "Current stage"
                        : step.completed
                          ? "Completed"
                          : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
              {application.status === "Rejected" && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">
                  Application rejected
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/10 px-3 py-2">
                <span className="text-muted-foreground">Current Stage</span>
                <ApplicantStatusBadge status={application.status} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/10 px-3 py-2">
                <span className="text-muted-foreground">Applied Date</span>
                <span className="font-medium text-foreground">
                  {formatDate(application.appliedDate)}
                </span>
              </div>
              {job && (
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/10 px-3 py-2">
                  <span className="text-muted-foreground">Job</span>
                  <span className="font-medium text-foreground">
                    {job.title}
                  </span>
                </div>
              )}
              <div className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2">
                <p className="text-xs text-muted-foreground">
                  Scheduling an interview updates the applicant status to
                  <span className="font-medium text-foreground">
                    {" "}
                    Interview Scheduled
                  </span>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">
                {application.notes}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl border border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Sparkles className="h-4 w-4 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button
                variant="outline"
                onClick={() => setContactOpen(true)}
                className="justify-start rounded-lg border-border/80"
              >
                <Mail className="mr-1.5 h-4 w-4" />
                Contact Applicant
              </Button>
              <Button
                variant="outline"
                onClick={() => setScheduleOpen(true)}
                className="justify-start rounded-lg border-border/80"
              >
                <CalendarDays className="mr-1.5 h-4 w-4" />
                Schedule Interview
              </Button>
              <Button
                variant="outline"
                onClick={() => setRejectOpen(true)}
                className="justify-start rounded-lg border-border/80 hover:bg-destructive/10 hover:text-destructive"
              >
                <UserRoundX className="mr-1.5 h-4 w-4" />
                Reject Application
              </Button>
              {application.status !== "Hired" &&
                application.status !== "Rejected" && (
                  <Button
                    onClick={handleHire}
                    className="justify-start rounded-lg bg-emerald-600 text-white hover:bg-emerald-600/95"
                  >
                    <UserCheck className="mr-1.5 h-4 w-4" />
                    Hire Candidate
                  </Button>
                )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Applicant</DialogTitle>
            <DialogDescription>
              Use the options below to reach out to the candidate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-sm font-semibold text-foreground">
              {application.fullName}
            </p>
            <p className="text-xs text-muted-foreground">{application.email}</p>
            <p className="text-xs text-muted-foreground">{application.phone}</p>
            <p className="text-xs text-muted-foreground">
              {job?.title ?? application.currentRole}
            </p>
          </div>
          <DialogFooter>
            <Button asChild variant="outline">
              <a href={`mailto:${application.email}`}>
                <Mail className="mr-1.5 h-4 w-4" />
                Email Applicant
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={`tel:${application.phone}`}>
                <Phone className="mr-1.5 h-4 w-4" />
                Call Applicant
              </a>
            </Button>
            <Button variant="outline" onClick={handleCopyEmail}>
              {copiedEmail ? "Copied" : "Copy Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Set interview details for this applicant. This updates the
              applicant to the scheduled stage in the mock workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Interview Date
              </label>
              <Input
                type="date"
                value={scheduleForm.interviewDate}
                onChange={(event) =>
                  setScheduleForm((current) => ({
                    ...current,
                    interviewDate: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Interview Time
              </label>
              <Input
                type="time"
                value={scheduleForm.interviewTime}
                onChange={(event) =>
                  setScheduleForm((current) => ({
                    ...current,
                    interviewTime: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">
                Interviewer
              </label>
              <Input
                value={scheduleForm.interviewer}
                onChange={(event) =>
                  setScheduleForm((current) => ({
                    ...current,
                    interviewer: event.target.value,
                  }))
                }
                placeholder="Enter interviewer name"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">
                Notes
              </label>
              <textarea
                rows={4}
                value={scheduleForm.interviewNotes}
                onChange={(event) =>
                  setScheduleForm((current) => ({
                    ...current,
                    interviewNotes: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-border/80 bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                placeholder="Add interview notes or instructions"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Applicant</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this application?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
