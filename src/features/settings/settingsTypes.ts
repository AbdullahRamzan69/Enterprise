export interface CompanyProfile {
  name: string;
  logo: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  timeZone: string;
  currency: string;
}

export interface Department {
  id: string;
  name: string;
  managerId?: string;
  managerName?: string;
  employeeCount: number;
}

export interface Designation {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  description: string;
  type: "National" | "Regional" | "Company";
}

export interface LeavePolicy {
  id: string;
  type: "Annual" | "Casual" | "Sick" | "Unpaid";
  maxDays: number;
  carryForward: boolean;
  requiresApproval: boolean;
}

export interface PayrollSettings {
  defaultTaxRate: number;
  overtimeRate: number;
  bonusRules: string;
  salaryCycle: "Monthly" | "Bi-Weekly" | "Weekly";
  currencySymbol: string;
}

export interface AssetCategory {
  id: string;
  name: string;
}

export interface SystemPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  timeFormat: "12h" | "24h";
  defaultPaginationSize: number;
  notificationsEnabled: boolean;
}

export type AdminUserStatus = "Active" | "Inactive" | "Pending" | "Suspended";
export type EmploymentTypeOption =
  "Full-time" | "Part-time" | "Contract" | "Intern";
export type RoleKind = "System" | "Custom";
export type ActivitySeverity = "info" | "success" | "warning" | "danger";

export const ADMIN_PERMISSION_MODULES = [
  "Dashboard",
  "Employees",
  "Attendance",
  "Leave",
  "Recruitment",
  "Jobs",
  "CRM",
  "Projects",
  "Finance",
  "Assets",
  "Settings",
] as const;

export const ADMIN_PERMISSION_ACTIONS = [
  "View",
  "Create",
  "Edit",
  "Delete",
  "Approve",
  "Export",
  "Assign",
  "Manage",
] as const;

export const JOB_SPECIAL_PERMISSIONS = [
  "Contact Applicant",
  "Reject Applicant",
  "Hire Applicant",
] as const;

export const SETTINGS_SPECIAL_PERMISSIONS = [
  "Company Profile",
  "Departments",
  "Designations",
  "Holidays",
  "Payroll",
  "Users",
  "Roles",
  "Preferences",
] as const;

export type PermissionModule = (typeof ADMIN_PERMISSION_MODULES)[number];
export type PermissionAction = (typeof ADMIN_PERMISSION_ACTIONS)[number];
export type JobSpecialPermission = (typeof JOB_SPECIAL_PERMISSIONS)[number];
export type SettingsSpecialPermission =
  (typeof SETTINGS_SPECIAL_PERMISSIONS)[number];

export type PermissionMatrix = Record<
  PermissionModule,
  Record<PermissionAction, boolean>
>;
export type JobSpecialPermissionMatrix = Record<JobSpecialPermission, boolean>;
export type SettingsSpecialPermissionMatrix = Record<
  SettingsSpecialPermission,
  boolean
>;

export interface RolePermissions {
  matrix: PermissionMatrix;
  jobs: JobSpecialPermissionMatrix;
  settings: SettingsSpecialPermissionMatrix;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  kind: RoleKind;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  permissionGroups: string[];
  permissions: RolePermissions;
}

export interface AdminActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: ActivitySeverity;
}

export interface AdminUser {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  roleId: string;
  status: AdminUserStatus;
  employmentType: EmploymentTypeOption;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
  assignedModules: string[];
  permissionsSummary: string[];
  recentActions: string[];
  activityTimeline: AdminActivityItem[];
}

export interface SettingsState {
  companyProfile: CompanyProfile;
  departments: Department[];
  designations: Designation[];
  holidays: Holiday[];
  leavePolicies: LeavePolicy[];
  payrollSettings: PayrollSettings;
  assetCategories: AssetCategory[];
  systemPreferences: SystemPreferences;
  users: AdminUser[];
  roles: RoleDefinition[];
}
