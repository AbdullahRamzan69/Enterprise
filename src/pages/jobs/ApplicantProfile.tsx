import { type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useAppSelector } from "@/app/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicantStatusBadge } from "@/components/jobs/ApplicantStatusBadge";
import { PermissionGuard } from "@/components/jobs/PermissionGuard";
import {
  selectApplicantById,
  selectCurrentJobPermissions,
  selectJobById,
} from "@/features/jobs/jobSelectors";
import {
  formatCurrency,
  formatDate,
  getInitials,
  hasPermission,
} from "@/features/jobs/jobUtils";

export default function ApplicantProfile() {
  const { applicantId } = useParams<{ applicantId: string }>();
  const permissions = useAppSelector(selectCurrentJobPermissions);
  const applicant = useAppSelector((state) =>
    applicantId ? selectApplicantById(state, applicantId) : undefined,
  );
  const job = useAppSelector((state) =>
    applicant ? selectJobById(state, applicant.jobId) : undefined,
  );

  if (!hasPermission(permissions, "jobs.view")) {
    return (
      <PermissionGuard
        title="403"
        description="You do not have permission to view applicants."
      />
    );
  }

  if (!applicant) {
    return (
      <div className="space-y-6 text-center py-12 animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Applicant Not Found
          </h2>
          <p className="text-xs text-muted-foreground leading-normal">
            We could not find that applicant record.
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
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="h-8 w-8 rounded-lg border-border/80"
        >
          <Link to={job ? `/jobs/${job.id}` : "/jobs"}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Applicant Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Candidate details for {applicant.fullName}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="glass-card shadow-sm border border-border/60 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border border-border/60 shadow-sm">
                    <AvatarImage
                      src={applicant.avatar}
                      alt={applicant.fullName}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {getInitials(applicant.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">
                      {applicant.fullName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {job?.title ?? applicant.currentRole}
                    </p>
                  </div>
                </div>
                <ApplicantStatusBadge status={applicant.status} />
              </div>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                label="Email"
                value={applicant.email}
                icon={<Mail className="w-4 h-4 text-primary" />}
              />
              <InfoCard
                label="Phone"
                value={applicant.phone}
                icon={<Phone className="w-4 h-4 text-primary" />}
              />
              <InfoCard
                label="Experience"
                value={`${applicant.experience} years`}
              />
              <InfoCard
                label="Expected Salary"
                value={formatCurrency(applicant.expectedSalary)}
              />
              <InfoCard
                label="Applied Date"
                value={formatDate(applicant.appliedDate)}
              />
              <InfoCard label="Notice Period" value={applicant.noticePeriod} />
              <InfoCard
                label="Current Company"
                value={applicant.currentCompany}
              />
              <InfoCard label="Current Role" value={applicant.currentRole} />
              <InfoCard
                label="Location"
                value={applicant.location}
                icon={<MapPin className="w-4 h-4 text-primary" />}
                className="md:col-span-2"
              />
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Cover Letter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">
                {applicant.coverLetter}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Previous Employment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {applicant.previousEmployment.map((item) => (
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

        <div className="space-y-6">
          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <BriefcaseBusiness className="w-4 h-4 text-primary" />
                Applied Job
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoCard label="Job Title" value={job?.title ?? "—"} />
              <InfoCard label="Department" value={job?.department ?? "—"} />
              <InfoCard label="Work Mode" value={job?.workMode ?? "—"} />
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {applicant.skills.map((skill) => (
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
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {applicant.education.map((item) => (
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
    </div>
  );
}

function InfoCard({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <div className="mt-1.5 rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm font-medium text-foreground flex items-center gap-2">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}
