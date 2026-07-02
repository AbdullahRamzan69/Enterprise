import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  Copy,
  Eye,
  Mail,
  PencilLine,
  Send,
  Trash2,
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
import { ActionIconButton } from "@/components/jobs/ActionIconButton";
import { ApplicantStatusBadge } from "@/components/jobs/ApplicantStatusBadge";
import { ConfirmationDialog } from "@/components/jobs/ConfirmationDialog";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { JobsEmptyState } from "@/components/jobs/JobsEmptyState";
import { MockToast } from "@/components/jobs/MockToast";
import { PermissionGuard } from "@/components/jobs/PermissionGuard";
import {
  archiveJob,
  closeJob,
  deleteJob,
  duplicateJob,
  updateApplicantStatus,
} from "@/features/jobs/jobSlice";
import {
  selectApplicantsByJobId,
  selectCurrentJobPermissions,
  selectJobById,
} from "@/features/jobs/jobSelectors";
import {
  formatCurrency,
  formatDate,
  hasPermission,
  getInitials,
} from "@/features/jobs/jobUtils";

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(selectCurrentJobPermissions);
  const job = useAppSelector((state) =>
    id ? selectJobById(state, id) : undefined,
  );
  const applicants = useAppSelector((state) =>
    id ? selectApplicantsByJobId(state, id) : [],
  );

  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const groupedDescription = useMemo(
    () => [
      { title: "About the Role", value: job?.description.aboutRole },
      { title: "Responsibilities", value: job?.description.responsibilities },
      { title: "Requirements", value: job?.description.requirements },
      { title: "Qualifications", value: job?.description.qualifications },
      { title: "Nice to Have", value: job?.description.niceToHave },
      { title: "Benefits", value: job?.description.benefits },
      {
        title: "Company Information",
        value: job?.description.companyInformation,
      },
      {
        title: "Application Process",
        value: job?.description.applicationProcess,
      },
    ],
    [job],
  );

  if (!hasPermission(permissions, "jobs.view")) {
    return (
      <PermissionGuard
        title="403"
        description="You do not have permission to view jobs."
      />
    );
  }

  if (!job) {
    return (
      <div className="space-y-6 text-center py-12 animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Job Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">
            The requested job opening could not be found.
          </p>
          <Button asChild size="sm" className="rounded-lg">
            <Link to="/jobs">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-8 w-8 rounded-lg border-border/80"
          >
            <Link to="/jobs">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                {job.title}
              </h1>
              <JobStatusBadge status={job.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {job.department} • Published {formatDate(job.publishedDate)} •
              Deadline {formatDate(job.applicationDeadline)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {hasPermission(permissions, "jobs.edit") && (
            <Button asChild variant="outline" className="rounded-lg text-xs">
              <Link to={`/jobs/edit/${job.id}`}>
                <PencilLine className="w-4 h-4 mr-1.5" />
                Edit
              </Link>
            </Button>
          )}
          {hasPermission(permissions, "jobs.archive") && (
            <Button
              variant="outline"
              onClick={() => setArchiveOpen(true)}
              className="rounded-lg text-xs"
            >
              <Archive className="w-4 h-4 mr-1.5" />
              Archive
            </Button>
          )}
          {hasPermission(permissions, "jobs.delete") && (
            <Button
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
              className="rounded-lg text-xs"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
          )}
          {hasPermission(permissions, "jobs.publish") &&
            job.status !== "Closed" &&
            job.status !== "Archived" && (
              <Button
                variant="outline"
                onClick={() => {
                  dispatch(closeJob(job.id));
                  setToastMessage("Job closed successfully.");
                }}
                className="rounded-lg text-xs"
              >
                Close Job
              </Button>
            )}
          {hasPermission(permissions, "jobs.create") && (
            <Button
              variant="outline"
              onClick={() => {
                dispatch(duplicateJob(job.id));
                setToastMessage("Job duplicated successfully.");
              }}
              className="rounded-lg text-xs"
            >
              <Copy className="w-4 h-4 mr-1.5" />
              Duplicate
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Employment Type" value={job.employmentType} />
              <InfoCard label="Work Mode" value={job.workMode} />
              <InfoCard label="Department" value={job.department} />
              <InfoCard label="Designation" value={job.designation} />
              <InfoCard
                label="Location"
                value={`${job.city}, ${job.country}`}
              />
              <InfoCard label="Hiring Manager" value={job.hiringManager} />
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Working Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                label="Working Days"
                value={job.workingDays.join(", ")}
              />
              <InfoCard label="Shift" value={job.shift} />
              <InfoCard label="Start Time" value={job.startTime} />
              <InfoCard label="End Time" value={job.endTime} />
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Salary & Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard label="Salary Type" value={job.salaryType} />
                <InfoCard
                  label="Salary Range"
                  value={
                    job.salaryType === "Negotiable"
                      ? "Negotiable"
                      : `${job.minSalary ? formatCurrency(job.minSalary, job.currency) : "—"} – ${job.maxSalary ? formatCurrency(job.maxSalary, job.currency) : "—"}`
                  }
                />
                <InfoCard
                  label="Experience"
                  value={`${job.minExperience}–${job.maxExperience} years`}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {job.benefits.map((benefit) => (
                  <Badge
                    key={benefit}
                    variant="outline"
                    className="rounded-full px-2.5 py-1 bg-muted/20"
                  >
                    {benefit}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="rounded-full px-2.5 py-1 bg-muted/20"
                >
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {groupedDescription.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {section.value}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Applicants
              </CardTitle>
              <CardDescription className="text-xs">
                Candidates who applied specifically for this job opening.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applicants.length === 0 ? (
                <JobsEmptyState
                  title="No Applicants"
                  description="Applicants submitted through the careers portal will appear here for this job."
                />
              ) : (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          <th className="py-3 px-4">Applicant</th>
                          <th className="py-3 px-4">Experience</th>
                          <th className="py-3 px-4">Expected Salary</th>
                          <th className="py-3 px-4">Applied Date</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 text-xs">
                        {applicants.map((applicant) => (
                          <tr
                            key={applicant.id}
                            className="hover:bg-muted/20 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <Avatar className="h-10 w-10 border border-border/60 shadow-sm">
                                  <AvatarImage
                                    src={applicant.avatar}
                                    alt={applicant.fullName}
                                  />
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                    {getInitials(applicant.fullName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-foreground truncate">
                                    {applicant.fullName}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {applicant.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {applicant.experience} years
                            </td>
                            <td className="py-3 px-4 text-foreground font-medium">
                              {formatCurrency(applicant.expectedSalary)}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {formatDate(applicant.appliedDate)}
                            </td>
                            <td className="py-3 px-4">
                              <ApplicantStatusBadge status={applicant.status} />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-1">
                                {hasPermission(permissions, "jobs.view") && (
                                  <Link to={`/jobs/applicants/${applicant.id}`}>
                                    <ActionIconButton
                                      label="View Applicant"
                                      icon={<Eye className="w-4 h-4" />}
                                    />
                                  </Link>
                                )}
                                {hasPermission(
                                  permissions,
                                  "jobs.manageApplicants",
                                ) && (
                                  <a href={`mailto:${applicant.email}`}>
                                    <ActionIconButton
                                      label="Contact Applicant"
                                      icon={<Mail className="w-4 h-4" />}
                                    />
                                  </a>
                                )}
                                {hasPermission(
                                  permissions,
                                  "jobs.manageApplicants",
                                ) && (
                                  <ActionIconButton
                                    label="Schedule Interview"
                                    icon={<Send className="w-4 h-4" />}
                                    onClick={() => {
                                      dispatch(
                                        updateApplicantStatus({
                                          id: applicant.id,
                                          status: "Interview Scheduled",
                                        }),
                                      );
                                      setToastMessage("Interview scheduled.");
                                    }}
                                  />
                                )}
                                {hasPermission(
                                  permissions,
                                  "jobs.manageApplicants",
                                ) && (
                                  <ActionIconButton
                                    label="Reject"
                                    icon={<UserRoundX className="w-4 h-4" />}
                                    destructive
                                    onClick={() => {
                                      dispatch(
                                        updateApplicantStatus({
                                          id: applicant.id,
                                          status: "Rejected",
                                        }),
                                      );
                                      setToastMessage("Applicant rejected.");
                                    }}
                                  />
                                )}
                                {hasPermission(
                                  permissions,
                                  "jobs.manageApplicants",
                                ) && (
                                  <ActionIconButton
                                    label="Hire"
                                    icon={<UserCheck className="w-4 h-4" />}
                                    onClick={() => {
                                      dispatch(
                                        updateApplicantStatus({
                                          id: applicant.id,
                                          status: "Hired",
                                        }),
                                      );
                                      setToastMessage(
                                        "Applicant marked as hired.",
                                      );
                                    }}
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {applicants.map((applicant) => (
                      <Card
                        key={applicant.id}
                        className="border border-border/60 bg-muted/10 rounded-xl"
                      >
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar className="h-10 w-10 border border-border/60 shadow-sm">
                                <AvatarImage
                                  src={applicant.avatar}
                                  alt={applicant.fullName}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                  {getInitials(applicant.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">
                                  {applicant.fullName}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {applicant.email}
                                </p>
                              </div>
                            </div>
                            <ApplicantStatusBadge
                              status={applicant.status}
                              className="shrink-0"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="text-muted-foreground">
                                Experience
                              </p>
                              <p className="font-medium text-foreground mt-1">
                                {applicant.experience} years
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Expected Salary
                              </p>
                              <p className="font-medium text-foreground mt-1">
                                {formatCurrency(applicant.expectedSalary)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {hasPermission(permissions, "jobs.view") && (
                              <Link to={`/jobs/applicants/${applicant.id}`}>
                                <ActionIconButton
                                  label="View Applicant"
                                  icon={<Eye className="w-4 h-4" />}
                                />
                              </Link>
                            )}
                            {hasPermission(
                              permissions,
                              "jobs.manageApplicants",
                            ) && (
                              <a href={`mailto:${applicant.email}`}>
                                <ActionIconButton
                                  label="Contact Applicant"
                                  icon={<Mail className="w-4 h-4" />}
                                />
                              </a>
                            )}
                            {hasPermission(
                              permissions,
                              "jobs.manageApplicants",
                            ) && (
                              <ActionIconButton
                                label="Schedule Interview"
                                icon={<Send className="w-4 h-4" />}
                                onClick={() => {
                                  dispatch(
                                    updateApplicantStatus({
                                      id: applicant.id,
                                      status: "Interview Scheduled",
                                    }),
                                  );
                                  setToastMessage("Interview scheduled.");
                                }}
                              />
                            )}
                            {hasPermission(
                              permissions,
                              "jobs.manageApplicants",
                            ) && (
                              <ActionIconButton
                                label="Reject"
                                icon={<UserRoundX className="w-4 h-4" />}
                                destructive
                                onClick={() => {
                                  dispatch(
                                    updateApplicantStatus({
                                      id: applicant.id,
                                      status: "Rejected",
                                    }),
                                  );
                                  setToastMessage("Applicant rejected.");
                                }}
                              />
                            )}
                            {hasPermission(
                              permissions,
                              "jobs.manageApplicants",
                            ) && (
                              <ActionIconButton
                                label="Hire"
                                icon={<UserCheck className="w-4 h-4" />}
                                onClick={() => {
                                  dispatch(
                                    updateApplicantStatus({
                                      id: applicant.id,
                                      status: "Hired",
                                    }),
                                  );
                                  setToastMessage("Applicant marked as hired.");
                                }}
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Application Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoCard
                label="Application Deadline"
                value={formatDate(job.applicationDeadline)}
              />
              <InfoCard
                label="Expected Joining Date"
                value={formatDate(job.expectedJoiningDate)}
              />
              <InfoCard
                label="Resume Upload"
                value={job.allowResumeUpload ? "Required" : "Disabled"}
              />
              <InfoCard
                label="Cover Letter"
                value={job.allowCoverLetter ? "Enabled" : "Disabled"}
              />
              <InfoCard
                label="Portfolio Required"
                value={job.portfolioRequired ? "Yes" : "No"}
              />
              <InfoCard
                label="Expected Salary Required"
                value={job.expectedSalaryRequired ? "Yes" : "No"}
              />
              <InfoCard
                label="Notice Period Required"
                value={job.noticePeriodRequired ? "Yes" : "No"}
              />
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoCard
                label="Featured Job"
                value={job.featuredJob ? "Yes" : "No"}
              />
              <InfoCard
                label="Internal Only"
                value={job.internalOnly ? "Yes" : "No"}
              />
              <InfoCard label="Openings" value={String(job.openings)} />
              <InfoCard label="Applicants" value={String(applicants.length)} />
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmationDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title="Archive Job"
        description={`Archive ${job.title}?`}
        confirmLabel="Archive"
        onConfirm={() => {
          dispatch(archiveJob(job.id));
          setArchiveOpen(false);
          setToastMessage("Job archived successfully.");
        }}
      />
      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Job"
        description="Are you sure you want to permanently delete this job posting?"
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          dispatch(deleteJob(job.id));
          setDeleteOpen(false);
          navigate("/jobs");
          setToastMessage("Job deleted successfully.");
        }}
      />

      {toastMessage && <MockToast message={toastMessage} />}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <div className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm font-medium text-foreground">
        {value}
      </div>
    </div>
  );
}
