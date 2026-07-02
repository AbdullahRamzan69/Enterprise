import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MockToast } from "@/components/jobs/MockToast";
import { PermissionGuard } from "@/components/jobs/PermissionGuard";
import { createJob, publishJob, updateJob } from "@/features/jobs/jobSlice";
import {
  selectCurrentJobPermissions,
  selectJobById,
} from "@/features/jobs/jobSelectors";
import {
  BENEFIT_OPTIONS,
  EDUCATION_LEVELS,
  EMPLOYMENT_TYPES,
  SALARY_TYPES,
  SHIFTS,
  WORKING_DAYS,
  WORK_MODES,
  type JobOpening,
} from "@/features/jobs/jobTypes";
import {
  createDefaultDescription,
  hasPermission,
  todayString,
} from "@/features/jobs/jobUtils";
import { selectEmployees } from "@/features/employees/employeeSelectors";
import {
  selectDepartments,
  selectDesignations,
} from "@/features/settings/settingsSelectors";

function createDefaultForm(): JobOpening {
  return {
    id: "",
    title: "",
    department: "Engineering",
    designation: "",
    hiringManager: "",
    openings: 1,
    employmentType: "Full Time",
    workMode: "Hybrid",
    officeLocation: "Main Office",
    country: "United States",
    city: "San Francisco",
    officeAddress: "",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    startTime: "09:00",
    endTime: "18:00",
    shift: "Morning",
    salaryType: "Range",
    minSalary: 70000,
    maxSalary: 100000,
    currency: "USD",
    benefits: ["Medical", "Paid Leave"],
    minExperience: 2,
    maxExperience: 5,
    education: "Bachelor",
    skills: [],
    description: createDefaultDescription(),
    applicationDeadline: todayString(),
    expectedJoiningDate: todayString(),
    allowResumeUpload: true,
    allowCoverLetter: true,
    portfolioRequired: false,
    expectedSalaryRequired: true,
    noticePeriodRequired: true,
    status: "Draft",
    featuredJob: false,
    internalOnly: false,
    publishedDate: null,
    closingDate: todayString(),
    createdAt: todayString(),
    updatedAt: todayString(),
  };
}

export default function JobForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const permissions = useAppSelector(selectCurrentJobPermissions);
  const job = useAppSelector((state) =>
    id ? selectJobById(state, id) : undefined,
  );
  const departments = useAppSelector(selectDepartments);
  const designations = useAppSelector(selectDesignations);
  const employees = useAppSelector(selectEmployees);

  const [form, setForm] = useState<JobOpening>(() => {
    if (isEditMode && job) {
      return job;
    }

    const defaultDepartment = departments[0]?.name ?? "Engineering";
    const firstDesignation =
      designations.find((item) => item.departmentName === defaultDepartment)
        ?.name ?? "";
    const firstManager = employees[0]?.fullName ?? "";

    return {
      ...createDefaultForm(),
      department: defaultDepartment,
      designation: firstDesignation,
      hiringManager: firstManager,
    };
  });
  const [skillInput, setSkillInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const departmentOptions = useMemo(
    () =>
      Array.from(
        new Set([
          "Engineering",
          "Product",
          "Design",
          "HR",
          "Finance",
          "Sales",
          "Marketing",
          "Operations",
          ...departments.map((department) => department.name),
        ]),
      ),
    [departments],
  );

  const fallbackDesignations = useMemo(
    () => ({
      Product: ["Product Manager", "Senior Product Manager", "Product Analyst"],
      Design: ["Product Designer", "UX Researcher", "Visual Designer"],
      Operations: [
        "Operations Coordinator",
        "Program Coordinator",
        "Facilities Coordinator",
      ],
      HR: ["HR Business Partner", "Talent Acquisition Specialist"],
      Marketing: ["Marketing Manager", "Content Strategist"],
      Sales: ["Account Executive", "Sales Development Representative"],
      Finance: ["Financial Analyst", "Controller"],
      Engineering: [
        "Senior Frontend Engineer",
        "Backend Engineer",
        "DevOps Engineer",
      ],
    }),
    [],
  );

  const filteredDesignations = useMemo(() => {
    const fromSettings = designations
      .filter((designation) => designation.departmentName === form.department)
      .map((designation) => designation.name);

    return fromSettings.length > 0
      ? fromSettings
      : (fallbackDesignations[
          form.department as keyof typeof fallbackDesignations
        ] ?? []);
  }, [designations, form.department, fallbackDesignations]);

  if (!hasPermission(permissions, isEditMode ? "jobs.edit" : "jobs.create")) {
    return (
      <PermissionGuard
        title="403"
        description={
          isEditMode
            ? "You do not have permission to edit jobs."
            : "You do not have permission to create jobs."
        }
      />
    );
  }

  if (isEditMode && !job) {
    return (
      <PermissionGuard
        title="Job Not Found"
        description="The requested job could not be found."
      />
    );
  }

  const updateField = <K extends keyof JobOpening>(
    key: K,
    value: JobOpening[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      updatedAt: todayString(),
    }));
  };

  const toggleArrayValue = (
    field: "workingDays" | "benefits",
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
      updatedAt: todayString(),
    }));
  };

  const updateDescription = (
    field: keyof JobOpening["description"],
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      description: { ...current.description, [field]: value },
      updatedAt: todayString(),
    }));
  };

  const addSkill = () => {
    const normalized = skillInput.trim();
    if (!normalized || form.skills.includes(normalized)) return;
    setForm((current) => ({
      ...current,
      skills: [...current.skills, normalized],
      updatedAt: todayString(),
    }));
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setForm((current) => ({
      ...current,
      skills: current.skills.filter((item) => item !== skill),
      updatedAt: todayString(),
    }));
  };

  const handleSave = (nextStatus: JobOpening["status"]) => {
    const closingDate = form.applicationDeadline;
    const payload: JobOpening = {
      ...form,
      id: form.id || generateJobId(),
      status: nextStatus,
      publishedDate:
        nextStatus === "Published"
          ? (form.publishedDate ?? todayString())
          : form.publishedDate,
      closingDate,
      createdAt: form.createdAt || todayString(),
      updatedAt: todayString(),
    };

    if (isEditMode) {
      dispatch(updateJob(payload));
      if (nextStatus === "Published") {
        dispatch(publishJob(payload.id));
      }
      setToastMessage(
        nextStatus === "Published"
          ? "Job updated and published."
          : "Job updated successfully.",
      );
      navigate("/jobs");
      return;
    }

    dispatch(createJob(payload));
    if (nextStatus === "Published") {
      dispatch(publishJob(payload.id));
    }
    setToastMessage(
      nextStatus === "Published"
        ? "Job created and published."
        : "Draft saved successfully.",
    );
    navigate("/jobs");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {isEditMode ? "Edit Job" : "Create Job"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isEditMode
                ? "Update job opening details and application rules."
                : "Create a new job opening for your careers portal."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard
            title="General Information"
            description="Core job metadata and hiring ownership."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Job Title">
                <Input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </Field>
              <Field label="Department">
                <select
                  value={form.department}
                  onChange={(e) => {
                    const nextDepartment = e.target.value;
                    const nextDesignations = designations
                      .filter(
                        (designation) =>
                          designation.departmentName === nextDepartment,
                      )
                      .map((designation) => designation.name);
                    const resolvedDesignations =
                      nextDesignations.length > 0
                        ? nextDesignations
                        : (fallbackDesignations[
                            nextDepartment as keyof typeof fallbackDesignations
                          ] ?? []);

                    setForm((current) => ({
                      ...current,
                      department: nextDepartment,
                      designation: resolvedDesignations[0] ?? "",
                      updatedAt: todayString(),
                    }));
                  }}
                  className={selectClassName}
                >
                  {departmentOptions.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Designation">
                <select
                  value={form.designation}
                  onChange={(e) => updateField("designation", e.target.value)}
                  className={selectClassName}
                >
                  {filteredDesignations.map((designation) => (
                    <option key={designation} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Hiring Manager">
                <select
                  value={form.hiringManager}
                  onChange={(e) => updateField("hiringManager", e.target.value)}
                  className={selectClassName}
                >
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.fullName}>
                      {employee.fullName}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Number of Openings">
                <Input
                  type="number"
                  min={1}
                  value={form.openings}
                  onChange={(e) =>
                    updateField("openings", Number(e.target.value))
                  }
                />
              </Field>
              <Field label="Employment Type">
                <select
                  value={form.employmentType}
                  onChange={(e) =>
                    updateField(
                      "employmentType",
                      e.target.value as JobOpening["employmentType"],
                    )
                  }
                  className={selectClassName}
                >
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Work Mode">
                <select
                  value={form.workMode}
                  onChange={(e) =>
                    updateField(
                      "workMode",
                      e.target.value as JobOpening["workMode"],
                    )
                  }
                  className={selectClassName}
                >
                  {WORK_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Office Location">
                <Input
                  value={form.officeLocation}
                  onChange={(e) =>
                    updateField("officeLocation", e.target.value)
                  }
                />
              </Field>
              <Field label="Country">
                <Input
                  value={form.country}
                  onChange={(e) => updateField("country", e.target.value)}
                />
              </Field>
              <Field label="City">
                <Input
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </Field>
              {(form.workMode === "On-site" || form.workMode === "Hybrid") && (
                <Field label="Office Address" className="md:col-span-2">
                  <Input
                    value={form.officeAddress}
                    onChange={(e) =>
                      updateField("officeAddress", e.target.value)
                    }
                  />
                </Field>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Working Schedule"
            description="Define working days, hours, and shift structure."
          >
            <div className="space-y-4">
              <Field
                label="Working Days"
                helper="Select all working days for this job."
              >
                <div className="flex flex-wrap gap-2">
                  {WORKING_DAYS.map((day) => (
                    <ToggleChip
                      key={day}
                      active={form.workingDays.includes(day)}
                      onClick={() => toggleArrayValue("workingDays", day)}
                    >
                      {day}
                    </ToggleChip>
                  ))}
                </div>
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Start Time">
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => updateField("startTime", e.target.value)}
                  />
                </Field>
                <Field label="End Time">
                  <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => updateField("endTime", e.target.value)}
                  />
                </Field>
                <Field label="Shift">
                  <select
                    value={form.shift}
                    onChange={(e) =>
                      updateField(
                        "shift",
                        e.target.value as JobOpening["shift"],
                      )
                    }
                    className={selectClassName}
                  >
                    {SHIFTS.map((shift) => (
                      <option key={shift} value={shift}>
                        {shift}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Salary"
            description="Compensation structure, currency, and benefits."
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Field label="Salary Type">
                  <select
                    value={form.salaryType}
                    onChange={(e) =>
                      updateField(
                        "salaryType",
                        e.target.value as JobOpening["salaryType"],
                      )
                    }
                    className={selectClassName}
                  >
                    {SALARY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Minimum Salary">
                  <Input
                    type="number"
                    value={form.minSalary ?? 0}
                    onChange={(e) =>
                      updateField("minSalary", Number(e.target.value))
                    }
                    disabled={form.salaryType === "Negotiable"}
                  />
                </Field>
                <Field label="Maximum Salary">
                  <Input
                    type="number"
                    value={form.maxSalary ?? 0}
                    onChange={(e) =>
                      updateField("maxSalary", Number(e.target.value))
                    }
                    disabled={form.salaryType !== "Range"}
                  />
                </Field>
                <Field label="Currency">
                  <Input
                    value={form.currency}
                    onChange={(e) => updateField("currency", e.target.value)}
                  />
                </Field>
              </div>
              <Field
                label="Benefits"
                helper="Use tags to highlight offered benefits."
              >
                <div className="flex flex-wrap gap-2">
                  {BENEFIT_OPTIONS.map((benefit) => (
                    <ToggleChip
                      key={benefit}
                      active={form.benefits.includes(benefit)}
                      onClick={() => toggleArrayValue("benefits", benefit)}
                    >
                      {benefit}
                    </ToggleChip>
                  ))}
                </div>
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Experience"
            description="Candidate experience and education requirements."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Minimum Experience">
                <Input
                  type="number"
                  value={form.minExperience}
                  onChange={(e) =>
                    updateField("minExperience", Number(e.target.value))
                  }
                />
              </Field>
              <Field label="Maximum Experience">
                <Input
                  type="number"
                  value={form.maxExperience}
                  onChange={(e) =>
                    updateField("maxExperience", Number(e.target.value))
                  }
                />
              </Field>
              <Field label="Required Education">
                <select
                  value={form.education}
                  onChange={(e) =>
                    updateField(
                      "education",
                      e.target.value as JobOpening["education"],
                    )
                  }
                  className={selectClassName}
                >
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Skills"
            description="Add key skills that should be highlighted to applicants."
          >
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add a skill and press Enter"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSkill}
                  className="rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/10 px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Job Description"
            description="Structured rich-text style content for the public careers portal."
          >
            <div className="space-y-4">
              {descriptionFields.map((field) => (
                <Field key={field.key} label={field.label}>
                  <textarea
                    value={form.description[field.key]}
                    onChange={(e) =>
                      updateDescription(field.key, e.target.value)
                    }
                    rows={4}
                    className={textareaClassName}
                  />
                </Field>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="Application Settings"
            description="Configure candidate submission requirements."
          >
            <div className="space-y-4">
              <Field label="Application Deadline">
                <Input
                  type="date"
                  value={form.applicationDeadline}
                  onChange={(e) =>
                    updateField("applicationDeadline", e.target.value)
                  }
                />
              </Field>
              <Field label="Expected Joining Date">
                <Input
                  type="date"
                  value={form.expectedJoiningDate}
                  onChange={(e) =>
                    updateField("expectedJoiningDate", e.target.value)
                  }
                />
              </Field>
              <ToggleRow
                label="Allow Resume Upload"
                checked={form.allowResumeUpload}
                onChange={(value) => updateField("allowResumeUpload", value)}
              />
              <ToggleRow
                label="Allow Cover Letter"
                checked={form.allowCoverLetter}
                onChange={(value) => updateField("allowCoverLetter", value)}
              />
              <ToggleRow
                label="Portfolio Required"
                checked={form.portfolioRequired}
                onChange={(value) => updateField("portfolioRequired", value)}
              />
              <ToggleRow
                label="Expected Salary Required"
                checked={form.expectedSalaryRequired}
                onChange={(value) =>
                  updateField("expectedSalaryRequired", value)
                }
              />
              <ToggleRow
                label="Notice Period Required"
                checked={form.noticePeriodRequired}
                onChange={(value) => updateField("noticePeriodRequired", value)}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Visibility"
            description="Control publishing state and visibility rules."
          >
            <div className="space-y-4">
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateField(
                      "status",
                      e.target.value as JobOpening["status"],
                    )
                  }
                  className={selectClassName}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Closed">Closed</option>
                  <option value="Archived">Archived</option>
                </select>
              </Field>
              <ToggleRow
                label="Featured Job"
                checked={form.featuredJob}
                onChange={(value) => updateField("featuredJob", value)}
              />
              <ToggleRow
                label="Internal Only"
                checked={form.internalOnly}
                onChange={(value) => updateField("internalOnly", value)}
              />
            </div>
          </SectionCard>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">
                Actions
              </CardTitle>
              <CardDescription className="text-xs">
                Save as draft or publish when ready.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                asChild
                className="w-full rounded-lg text-xs"
              >
                <Link to="/jobs">Cancel</Link>
              </Button>
              <Button
                onClick={() => handleSave("Draft")}
                className="w-full rounded-lg text-xs"
              >
                Save Draft
              </Button>
              {hasPermission(permissions, "jobs.publish") && (
                <Button
                  onClick={() => handleSave("Published")}
                  className="w-full rounded-lg text-xs bg-emerald-600 hover:bg-emerald-600/95 text-white"
                >
                  Publish Job
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {toastMessage && <MockToast message={toastMessage} />}
    </div>
  );
}

const descriptionFields: Array<{
  key: keyof JobOpening["description"];
  label: string;
}> = [
  { key: "aboutRole", label: "About the Role" },
  { key: "responsibilities", label: "Responsibilities" },
  { key: "requirements", label: "Requirements" },
  { key: "qualifications", label: "Qualifications" },
  { key: "niceToHave", label: "Nice to Have" },
  { key: "benefits", label: "Benefits" },
  { key: "companyInformation", label: "Company Information" },
  { key: "applicationProcess", label: "Application Process" },
];

const selectClassName =
  "flex h-8.5 w-full rounded-lg border border-border/80 bg-card dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring";
const textareaClassName =
  "w-full rounded-lg border border-border/80 bg-card dark:bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
      <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
        <CardTitle className="text-base font-bold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  helper,
  className,
  children,
}: {
  label: string;
  helper?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
        {label}
      </label>
      {helper && (
        <p className="text-[10px] text-muted-foreground mt-1">{helper}</p>
      )}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${active ? "border-primary/30 bg-primary/10 text-primary" : "border-border/70 bg-muted/10 text-muted-foreground hover:border-primary/20 hover:bg-primary/5"}`}
    >
      {children}
    </button>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/10 px-3 py-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded-lg px-3 py-1 text-xs font-medium ${checked ? "bg-emerald-500 text-white" : "bg-background border border-border text-muted-foreground"}`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded-lg px-3 py-1 text-xs font-medium ${!checked ? "bg-rose-500 text-white" : "bg-background border border-border text-muted-foreground"}`}
        >
          No
        </button>
      </div>
    </div>
  );
}

function generateJobId() {
  return `JOB-${Math.floor(1000 + Math.random() * 9000)}`;
}
