export type JobStatus = "Draft" | "Published" | "Closed" | "Archived";
export type EmploymentType =
  | "Full Time"
  | "Part Time"
  | "Contract"
  | "Internship"
  | "Temporary"
  | "Freelance";
export type WorkMode = "On-site" | "Remote" | "Hybrid";
export type ShiftType = "Morning" | "Evening" | "Night" | "Flexible";
export type SalaryType = "Fixed" | "Range" | "Negotiable";
export type EducationLevel =
  "Bachelor" | "Master" | "PhD" | "Diploma" | "Certification" | "No Preference";
export type ApplicantStatus =
  "New" | "Under Review" | "Interview Scheduled" | "Rejected" | "Hired";

export type JobPermission =
  | "jobs.view"
  | "jobs.create"
  | "jobs.edit"
  | "jobs.delete"
  | "jobs.publish"
  | "jobs.archive"
  | "jobs.manageApplicants";

export interface JobDescriptionContent {
  aboutRole: string;
  responsibilities: string;
  requirements: string;
  qualifications: string;
  niceToHave: string;
  benefits: string;
  companyInformation: string;
  applicationProcess: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  designation: string;
  hiringManager: string;
  openings: number;
  employmentType: EmploymentType;
  workMode: WorkMode;
  officeLocation: string;
  country: string;
  city: string;
  officeAddress: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
  shift: ShiftType;
  salaryType: SalaryType;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string;
  benefits: string[];
  minExperience: number;
  maxExperience: number;
  education: EducationLevel;
  skills: string[];
  description: JobDescriptionContent;
  applicationDeadline: string;
  expectedJoiningDate: string;
  allowResumeUpload: boolean;
  allowCoverLetter: boolean;
  portfolioRequired: boolean;
  expectedSalaryRequired: boolean;
  noticePeriodRequired: boolean;
  status: JobStatus;
  featuredJob: boolean;
  internalOnly: boolean;
  publishedDate: string | null;
  closingDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplicant {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  experience: number;
  expectedSalary: number;
  appliedDate: string;
  status: ApplicantStatus;
  currentCompany: string;
  currentRole: string;
  noticePeriod: string;
  location: string;
  skills: string[];
  coverLetter: string;
  education: string[];
  previousEmployment: string[];
  notes: string;
}

export interface JobsState {
  jobs: JobOpening[];
  applicants: JobApplicant[];
  currentUserPermissions: JobPermission[];
}

export const JOB_STATUSES: JobStatus[] = [
  "Draft",
  "Published",
  "Closed",
  "Archived",
];
export const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Temporary",
  "Freelance",
];
export const WORK_MODES: WorkMode[] = ["On-site", "Remote", "Hybrid"];
export const SHIFTS: ShiftType[] = ["Morning", "Evening", "Night", "Flexible"];
export const SALARY_TYPES: SalaryType[] = ["Fixed", "Range", "Negotiable"];
export const EDUCATION_LEVELS: EducationLevel[] = [
  "Bachelor",
  "Master",
  "PhD",
  "Diploma",
  "Certification",
  "No Preference",
];
export const APPLICANT_STATUSES: ApplicantStatus[] = [
  "New",
  "Under Review",
  "Interview Scheduled",
  "Rejected",
  "Hired",
];
export const WORKING_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export const BENEFIT_OPTIONS = [
  "Medical",
  "Bonus",
  "Paid Leave",
  "Transport",
  "Accommodation",
  "Health Insurance",
  "Provident Fund",
  "Gym Membership",
  "Stock Options",
  "Custom",
];
