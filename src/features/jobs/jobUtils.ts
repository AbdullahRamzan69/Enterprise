import type {
  ApplicantStatus,
  JobOpening,
  JobPermission,
  JobStatus,
} from "./jobTypes";

export const formatCurrency = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (value: string) => {
  if (value === "Never") return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const hasPermission = (
  permissions: JobPermission[],
  permission: JobPermission,
) => permissions.includes(permission);

export const todayString = () => new Date().toISOString().split("T")[0];

export const getJobStatusAccent = (status: JobStatus) => {
  if (status === "Published") return "published";
  if (status === "Closed") return "closed";
  if (status === "Archived") return "archived";
  return "draft";
};

export const getApplicantStatusAccent = (status: ApplicantStatus) => {
  if (status === "Hired") return "hired";
  if (status === "Rejected") return "rejected";
  if (status === "Interview Scheduled") return "scheduled";
  if (status === "Under Review") return "review";
  return "new";
};

export const duplicateJobTitle = (title: string) =>
  title.includes("(Copy)") ? title : `${title} (Copy)`;

export const createDefaultDescription = (): JobOpening["description"] => ({
  aboutRole:
    "Summarize the purpose of the role, the team context, and the impact this hire will make.",
  responsibilities:
    "List the day-to-day responsibilities, ownership areas, and key outcomes expected from the role.",
  requirements:
    "Describe the must-have technical skills, domain knowledge, and core expectations for applicants.",
  qualifications:
    "Outline the required education, certifications, or practical qualifications for success.",
  niceToHave:
    "Mention any optional experience or differentiators that would strengthen an application.",
  benefits:
    "Describe role-specific perks, compensation notes, and employee benefits.",
  companyInformation:
    "Introduce the company, mission, culture, and what makes the team compelling to join.",
  applicationProcess:
    "Explain the interview steps, timelines, and what candidates can expect after applying.",
});
