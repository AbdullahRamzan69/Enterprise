import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  BriefcaseBusiness,
  Copy,
  Eye,
  PencilLine,
  Plus,
  Search,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ActionIconButton } from "@/components/jobs/ActionIconButton";
import { ConfirmationDialog } from "@/components/jobs/ConfirmationDialog";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { JobsEmptyState } from "@/components/jobs/JobsEmptyState";
import { JobsLoadingState } from "@/components/jobs/JobsLoadingState";
import { JobsStatCard } from "@/components/jobs/JobsStatCard";
import { MockToast } from "@/components/jobs/MockToast";
import { PermissionGuard } from "@/components/jobs/PermissionGuard";
import {
  archiveJob,
  deleteJob,
  duplicateJob,
  publishJob,
} from "@/features/jobs/jobSlice";
import {
  selectCurrentJobPermissions,
  selectJobApplicants,
  selectJobOpenings,
} from "@/features/jobs/jobSelectors";
import { formatDate, hasPermission } from "@/features/jobs/jobUtils";
import type { JobOpening } from "@/features/jobs/jobTypes";

const ITEMS_PER_PAGE = 8;

type SortOption =
  "Newest" | "Oldest" | "Most Applications" | "Recently Updated";

export default function Jobs() {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectJobOpenings);
  const applicants = useAppSelector(selectJobApplicants);
  const permissions = useAppSelector(selectCurrentJobPermissions);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState<
    "Job Title" | "Department" | "Job ID"
  >("Job Title");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationTypeFilter, setLocationTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<JobOpening | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JobOpening | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((job) => job.department)))],
    [jobs],
  );
  const employmentTypes = useMemo(
    () => [
      "All",
      ...Array.from(new Set(jobs.map((job) => job.employmentType))),
    ],
    [jobs],
  );
  const statuses = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((job) => job.status)))],
    [jobs],
  );
  const workModes = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((job) => job.workMode)))],
    [jobs],
  );

  const applicantCountByJob = useMemo(
    () =>
      Object.fromEntries(
        jobs.map((job) => [
          job.id,
          applicants.filter((applicant) => applicant.jobId === job.id).length,
        ]),
      ),
    [jobs, applicants],
  );

  const stats = useMemo(
    () => ({
      openJobs: jobs.filter(
        (job) => job.status === "Draft" || job.status === "Published",
      ).length,
      publishedJobs: jobs.filter((job) => job.status === "Published").length,
      closedJobs: jobs.filter((job) => job.status === "Closed").length,
      totalApplications: applicants.length,
    }),
    [jobs, applicants],
  );

  const filteredJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !query ||
        (searchBy === "Job Title" && job.title.toLowerCase().includes(query)) ||
        (searchBy === "Department" &&
          job.department.toLowerCase().includes(query)) ||
        (searchBy === "Job ID" && job.id.toLowerCase().includes(query));

      const matchesDepartment =
        departmentFilter === "All" || job.department === departmentFilter;
      const matchesEmploymentType =
        employmentTypeFilter === "All" ||
        job.employmentType === employmentTypeFilter;
      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;
      const matchesWorkMode =
        locationTypeFilter === "All" || job.workMode === locationTypeFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesEmploymentType &&
        matchesStatus &&
        matchesWorkMode
      );
    });

    return filtered.sort((a, b) => {
      if (sortBy === "Newest") return b.createdAt.localeCompare(a.createdAt);
      if (sortBy === "Oldest") return a.createdAt.localeCompare(b.createdAt);
      if (sortBy === "Most Applications")
        return (
          (applicantCountByJob[b.id] ?? 0) - (applicantCountByJob[a.id] ?? 0)
        );
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [
    jobs,
    searchTerm,
    searchBy,
    departmentFilter,
    employmentTypeFilter,
    statusFilter,
    locationTypeFilter,
    sortBy,
    applicantCountByJob,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedJobs = filteredJobs.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE,
  );

  const resetFilters = () => {
    setSearchTerm("");
    setSearchBy("Job Title");
    setDepartmentFilter("All");
    setEmploymentTypeFilter("All");
    setStatusFilter("All");
    setLocationTypeFilter("All");
    setSortBy("Newest");
    setCurrentPage(1);
  };

  if (!hasPermission(permissions, "jobs.view")) {
    return (
      <PermissionGuard
        title="403"
        description="You do not have permission to view jobs."
      />
    );
  }

  if (isLoading) {
    return <JobsLoadingState />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Jobs
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create, publish, and manage company job openings.
          </p>
        </div>
        {hasPermission(permissions, "jobs.create") && (
          <Button asChild className="rounded-lg text-xs shadow-sm">
            <Link to="/jobs/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Create Job
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <JobsStatCard
          title="Open Jobs"
          value={stats.openJobs}
          trend="Hiring"
          description="active requisitions"
          icon={<BriefcaseBusiness className="w-4 h-4 text-blue-500" />}
          iconClassName="bg-blue-500/10 text-blue-500"
        />
        <JobsStatCard
          title="Published Jobs"
          value={stats.publishedJobs}
          trend="Live"
          description="visible on careers portal"
          icon={<Send className="w-4 h-4 text-emerald-500" />}
          iconClassName="bg-emerald-500/10 text-emerald-500"
        />
        <JobsStatCard
          title="Closed Jobs"
          value={stats.closedJobs}
          trend="Completed"
          description="hiring windows closed"
          icon={<Archive className="w-4 h-4 text-amber-500" />}
          iconClassName="bg-amber-500/10 text-amber-500"
        />
        <JobsStatCard
          title="Total Applications"
          value={stats.totalApplications}
          trend="Inbound"
          description="across all job openings"
          icon={<Users className="w-4 h-4 text-violet-500" />}
          iconClassName="bg-violet-500/10 text-violet-500"
        />
      </div>

      <Card className="glass-card border border-border/60 shadow-sm rounded-xl">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_180px] gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search Jobs"
                className="pl-9 bg-card dark:bg-card border-border/80 rounded-lg text-sm"
              />
            </div>
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value as typeof searchBy)}
              className="flex h-8.5 w-full rounded-lg border border-border/80 bg-card dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            >
              <option>Job Title</option>
              <option>Department</option>
              <option>Job ID</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="flex h-8.5 w-full rounded-lg border border-border/80 bg-card dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  Department: {item}
                </option>
              ))}
            </select>
            <select
              value={employmentTypeFilter}
              onChange={(e) => {
                setEmploymentTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="flex h-8.5 w-full rounded-lg border border-border/80 bg-card dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            >
              {employmentTypes.map((item) => (
                <option key={item} value={item}>
                  Employment Type: {item}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="flex h-8.5 w-full rounded-lg border border-border/80 bg-card dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  Status: {item}
                </option>
              ))}
            </select>
            <select
              value={locationTypeFilter}
              onChange={(e) => {
                setLocationTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="flex h-8.5 w-full rounded-lg border border-border/80 bg-card dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            >
              {workModes.map((item) => (
                <option key={item} value={item}>
                  Location Type: {item}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setCurrentPage(1);
              }}
              className="flex h-8.5 w-full rounded-lg border border-border/80 bg-card dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            >
              {(
                [
                  "Newest",
                  "Oldest",
                  "Most Applications",
                  "Recently Updated",
                ] as SortOption[]
              ).map((item) => (
                <option key={item} value={item}>
                  Sort: {item}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="rounded-lg text-xs"
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {jobs.length === 0 ? (
        <JobsEmptyState
          title="No Jobs"
          description="Create your first job opening to start publishing vacancies to the careers portal."
        />
      ) : filteredJobs.length === 0 ? (
        <JobsEmptyState
          title="No Search Results"
          description="Try changing your filters or search keywords to find matching job openings."
        />
      ) : (
        <>
          <Card className="glass-card border border-border/60 shadow-sm rounded-xl overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Job ID</th>
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-4 hidden lg:table-cell">
                      Department
                    </th>
                    <th className="py-3 px-4 hidden lg:table-cell">
                      Employment Type
                    </th>
                    <th className="py-3 px-4 hidden xl:table-cell">
                      Location Type
                    </th>
                    <th className="py-3 px-4 hidden xl:table-cell">
                      Work Location
                    </th>
                    <th className="py-3 px-4 hidden xl:table-cell">
                      Experience
                    </th>
                    <th className="py-3 px-4">Applications</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 hidden xl:table-cell">
                      Published Date
                    </th>
                    <th className="py-3 px-4 hidden xl:table-cell">
                      Closing Date
                    </th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-xs">
                  {paginatedJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-foreground">
                        {job.id}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {job.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {job.hiringManager}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">
                        {job.department}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">
                        {job.employmentType}
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell text-muted-foreground">
                        {job.workMode}
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell text-muted-foreground">
                        {job.city}, {job.country}
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell text-muted-foreground">
                        {job.minExperience}–{job.maxExperience} yrs
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {applicantCountByJob[job.id] ?? 0} Applicants
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <JobStatusBadge status={job.status} />
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell text-muted-foreground">
                        {formatDate(job.publishedDate)}
                      </td>
                      <td className="py-3 px-4 hidden xl:table-cell text-muted-foreground">
                        {formatDate(job.closingDate)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          {hasPermission(permissions, "jobs.view") && (
                            <Link to={`/jobs/${job.id}`}>
                              <ActionIconButton
                                label="View"
                                icon={<Eye className="w-4 h-4" />}
                              />
                            </Link>
                          )}
                          {hasPermission(permissions, "jobs.edit") && (
                            <Link to={`/jobs/edit/${job.id}`}>
                              <ActionIconButton
                                label="Edit"
                                icon={<PencilLine className="w-4 h-4" />}
                              />
                            </Link>
                          )}
                          {hasPermission(permissions, "jobs.create") && (
                            <ActionIconButton
                              label="Duplicate"
                              icon={<Copy className="w-4 h-4" />}
                              onClick={() => {
                                dispatch(duplicateJob(job.id));
                                setToastMessage("Job duplicated successfully.");
                              }}
                            />
                          )}
                          {hasPermission(permissions, "jobs.publish") &&
                            job.status !== "Published" && (
                              <ActionIconButton
                                label="Publish"
                                icon={<Send className="w-4 h-4" />}
                                onClick={() => {
                                  dispatch(publishJob(job.id));
                                  setToastMessage(
                                    "Job published successfully.",
                                  );
                                }}
                              />
                            )}
                          {hasPermission(permissions, "jobs.archive") &&
                            job.status !== "Archived" && (
                              <ActionIconButton
                                label="Archive"
                                icon={<Archive className="w-4 h-4" />}
                                onClick={() => setArchiveTarget(job)}
                              />
                            )}
                          {hasPermission(permissions, "jobs.delete") && (
                            <ActionIconButton
                              label="Delete"
                              icon={<Trash2 className="w-4 h-4" />}
                              destructive
                              onClick={() => setDeleteTarget(job)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginatedJobs.map((job) => (
              <Card
                key={job.id}
                className="glass-card border border-border/60 shadow-sm rounded-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {job.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {job.id} • {job.department}
                      </p>
                    </div>
                    <JobStatusBadge status={job.status} className="shrink-0" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Employment</p>
                      <p className="font-medium text-foreground mt-1">
                        {job.employmentType}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground mt-1">
                        {job.workMode}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Applications</p>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="font-medium text-primary mt-1 block"
                      >
                        {applicantCountByJob[job.id] ?? 0} Applicants
                      </Link>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Closing Date</p>
                      <p className="font-medium text-foreground mt-1">
                        {formatDate(job.closingDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {hasPermission(permissions, "jobs.view") && (
                      <Link to={`/jobs/${job.id}`}>
                        <ActionIconButton
                          label="View"
                          icon={<Eye className="w-4 h-4" />}
                        />
                      </Link>
                    )}
                    {hasPermission(permissions, "jobs.edit") && (
                      <Link to={`/jobs/edit/${job.id}`}>
                        <ActionIconButton
                          label="Edit"
                          icon={<PencilLine className="w-4 h-4" />}
                        />
                      </Link>
                    )}
                    {hasPermission(permissions, "jobs.create") && (
                      <ActionIconButton
                        label="Duplicate"
                        icon={<Copy className="w-4 h-4" />}
                        onClick={() => {
                          dispatch(duplicateJob(job.id));
                          setToastMessage("Job duplicated successfully.");
                        }}
                      />
                    )}
                    {hasPermission(permissions, "jobs.publish") &&
                      job.status !== "Published" && (
                        <ActionIconButton
                          label="Publish"
                          icon={<Send className="w-4 h-4" />}
                          onClick={() => {
                            dispatch(publishJob(job.id));
                            setToastMessage("Job published successfully.");
                          }}
                        />
                      )}
                    {hasPermission(permissions, "jobs.archive") &&
                      job.status !== "Archived" && (
                        <ActionIconButton
                          label="Archive"
                          icon={<Archive className="w-4 h-4" />}
                          onClick={() => setArchiveTarget(job)}
                        />
                      )}
                    {hasPermission(permissions, "jobs.delete") && (
                      <ActionIconButton
                        label="Delete"
                        icon={<Trash2 className="w-4 h-4" />}
                        destructive
                        onClick={() => setDeleteTarget(job)}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredJobs.length)}{" "}
              of {filteredJobs.length} jobs
            </p>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(1, Math.min(page, totalPages) - 1),
                  )
                }
                disabled={safeCurrentPage === 1}
                className="rounded-lg border-border/80 text-xs"
              >
                Previous
              </Button>
              <div className="text-xs font-medium text-muted-foreground px-2">
                Page {safeCurrentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, Math.min(page, totalPages) + 1),
                  )
                }
                disabled={safeCurrentPage === totalPages}
                className="rounded-lg border-border/80 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <ConfirmationDialog
        open={archiveTarget !== null}
        onOpenChange={(open) => !open && setArchiveTarget(null)}
        title="Archive Job"
        description={
          archiveTarget
            ? `Archive ${archiveTarget.title}?`
            : "Archive this job?"
        }
        confirmLabel="Archive"
        onConfirm={() => {
          if (archiveTarget) {
            dispatch(archiveJob(archiveTarget.id));
            setToastMessage("Job archived successfully.");
          }
          setArchiveTarget(null);
        }}
      />

      <ConfirmationDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Job"
        description="Are you sure you want to permanently delete this job posting?"
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) {
            dispatch(deleteJob(deleteTarget.id));
            setToastMessage("Job deleted successfully.");
          }
          setDeleteTarget(null);
        }}
      />

      {toastMessage && <MockToast message={toastMessage} />}
    </div>
  );
}
