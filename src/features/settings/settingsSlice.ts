import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  SettingsState,
  CompanyProfile,
  Department,
  Designation,
  Holiday,
  LeavePolicy,
  PayrollSettings,
  AssetCategory,
  SystemPreferences,
  AdminUser,
  AdminActivityItem,
  RoleDefinition,
  PermissionAction,
  PermissionModule,
  RolePermissions,
  EmploymentTypeOption,
  AdminUserStatus,
  JobSpecialPermission,
  SettingsSpecialPermission,
} from "./settingsTypes";
import {
  ADMIN_PERMISSION_ACTIONS,
  ADMIN_PERMISSION_MODULES,
  JOB_SPECIAL_PERMISSIONS,
  SETTINGS_SPECIAL_PERMISSIONS,
} from "./settingsTypes";

export const SETTINGS_STORAGE_KEY = "aethel_ebms_settings";

const createPermissionMatrix = (
  config: Partial<Record<PermissionModule, PermissionAction[]>>,
) => {
  return Object.fromEntries(
    ADMIN_PERMISSION_MODULES.map((module) => [
      module,
      Object.fromEntries(
        ADMIN_PERMISSION_ACTIONS.map((action) => [
          action,
          config[module]?.includes(action) ?? false,
        ]),
      ),
    ]),
  ) as RolePermissions["matrix"];
};

const createSpecialJobsPermissions = (enabled: JobSpecialPermission[]) =>
  Object.fromEntries(
    JOB_SPECIAL_PERMISSIONS.map((permission) => [
      permission,
      enabled.includes(permission),
    ]),
  ) as RolePermissions["jobs"];

const createSpecialSettingsPermissions = (
  enabled: SettingsSpecialPermission[],
) =>
  Object.fromEntries(
    SETTINGS_SPECIAL_PERMISSIONS.map((permission) => [
      permission,
      enabled.includes(permission),
    ]),
  ) as RolePermissions["settings"];

const createRolePermissions = (
  matrixConfig: Partial<Record<PermissionModule, PermissionAction[]>>,
  jobPermissions: JobSpecialPermission[] = [],
  settingsPermissions: SettingsSpecialPermission[] = [],
): RolePermissions => ({
  matrix: createPermissionMatrix(matrixConfig),
  jobs: createSpecialJobsPermissions(jobPermissions),
  settings: createSpecialSettingsPermissions(settingsPermissions),
});

const countEnabledPermissions = (permissions: RolePermissions) => {
  const matrixCount = Object.values(permissions.matrix).reduce(
    (total, modulePermissions) =>
      total + Object.values(modulePermissions).filter(Boolean).length,
    0,
  );
  const jobsCount = Object.values(permissions.jobs).filter(Boolean).length;
  const settingsCount = Object.values(permissions.settings).filter(
    Boolean,
  ).length;

  return matrixCount + jobsCount + settingsCount;
};

const getAssignedModulesFromRole = (role: RoleDefinition) =>
  ADMIN_PERMISSION_MODULES.filter((module) =>
    Object.values(role.permissions.matrix[module]).some(Boolean),
  );

const getPermissionsSummaryFromRole = (role: RoleDefinition) => [
  `${countEnabledPermissions(role.permissions)} permissions enabled`,
  `${getAssignedModulesFromRole(role).length} modules assigned`,
  `${role.kind} role`,
];

const createRoles = (): RoleDefinition[] => [
  {
    id: "ROLE-001",
    name: "Super Admin",
    description:
      "Full system access across all modules, settings, and administrative actions.",
    kind: "System",
    createdBy: "System",
    createdDate: "2026-01-05",
    lastModified: "2026-06-28",
    permissionGroups: ["Administration", "Operations", "Security", "Reporting"],
    permissions: createRolePermissions(
      Object.fromEntries(
        ADMIN_PERMISSION_MODULES.map((module) => [
          module,
          [...ADMIN_PERMISSION_ACTIONS],
        ]),
      ) as Partial<Record<PermissionModule, PermissionAction[]>>,
      [...JOB_SPECIAL_PERMISSIONS],
      [...SETTINGS_SPECIAL_PERMISSIONS],
    ),
  },
  {
    id: "ROLE-002",
    name: "Admin",
    description:
      "Broad administrative control over business modules, users, and operational settings.",
    kind: "System",
    createdBy: "System",
    createdDate: "2026-01-08",
    lastModified: "2026-06-24",
    permissionGroups: ["Administration", "Operations", "Reporting"],
    permissions: createRolePermissions(
      {
        Dashboard: ["View", "Export", "Manage"],
        Employees: ["View", "Create", "Edit", "Delete", "Export", "Assign"],
        Attendance: ["View", "Create", "Edit", "Approve", "Export"],
        Leave: ["View", "Create", "Edit", "Approve", "Export"],
        Recruitment: ["View", "Create", "Edit", "Delete", "Assign"],
        Jobs: ["View", "Edit", "Approve", "Assign", "Manage"],
        CRM: ["View", "Create", "Edit", "Delete", "Export"],
        Projects: ["View", "Create", "Edit", "Delete", "Assign"],
        Finance: ["View", "Create", "Edit", "Approve", "Export"],
        Assets: ["View", "Create", "Edit", "Delete", "Assign"],
        Settings: ["View", "Edit", "Manage"],
      },
      ["Contact Applicant", "Reject Applicant", "Hire Applicant"],
      [
        "Company Profile",
        "Departments",
        "Designations",
        "Holidays",
        "Payroll",
        "Users",
        "Roles",
        "Preferences",
      ],
    ),
  },
  {
    id: "ROLE-003",
    name: "HR Manager",
    description:
      "Manages employees, leave, recruitment, jobs inbox, and HR administration.",
    kind: "System",
    createdBy: "System",
    createdDate: "2026-01-12",
    lastModified: "2026-06-22",
    permissionGroups: ["People Operations", "Recruitment", "Reporting"],
    permissions: createRolePermissions(
      {
        Dashboard: ["View", "Export"],
        Employees: ["View", "Create", "Edit", "Export", "Assign"],
        Attendance: ["View", "Edit", "Approve", "Export"],
        Leave: ["View", "Edit", "Approve", "Export"],
        Recruitment: ["View", "Create", "Edit", "Assign"],
        Jobs: ["View", "Edit", "Approve", "Assign"],
        Settings: ["View", "Edit", "Manage"],
      },
      ["Contact Applicant", "Reject Applicant", "Hire Applicant"],
      ["Departments", "Designations", "Holidays", "Users", "Roles"],
    ),
  },
  {
    id: "ROLE-004",
    name: "Finance Manager",
    description: "Controls payroll, finance workflows, approvals, and exports.",
    kind: "System",
    createdBy: "System",
    createdDate: "2026-01-18",
    lastModified: "2026-06-15",
    permissionGroups: ["Finance", "Reporting"],
    permissions: createRolePermissions(
      {
        Dashboard: ["View", "Export"],
        Employees: ["View", "Export"],
        Leave: ["View", "Export"],
        Finance: ["View", "Create", "Edit", "Approve", "Export", "Manage"],
        Settings: ["View", "Edit"],
      },
      [],
      ["Payroll"],
    ),
  },
  {
    id: "ROLE-005",
    name: "Project Manager",
    description:
      "Coordinates projects, staffing assignments, and delivery-related visibility.",
    kind: "System",
    createdBy: "System",
    createdDate: "2026-01-20",
    lastModified: "2026-06-12",
    permissionGroups: ["Delivery", "Operations"],
    permissions: createRolePermissions({
      Dashboard: ["View", "Export"],
      Employees: ["View", "Assign"],
      Attendance: ["View"],
      Leave: ["View", "Approve"],
      Projects: ["View", "Create", "Edit", "Delete", "Assign", "Manage"],
    }),
  },
  {
    id: "ROLE-006",
    name: "Asset Manager",
    description:
      "Manages asset inventory, assignments, maintenance, and reporting.",
    kind: "System",
    createdBy: "System",
    createdDate: "2026-01-22",
    lastModified: "2026-06-18",
    permissionGroups: ["Operations", "Inventory"],
    permissions: createRolePermissions(
      {
        Dashboard: ["View"],
        Employees: ["View"],
        Assets: [
          "View",
          "Create",
          "Edit",
          "Delete",
          "Assign",
          "Export",
          "Manage",
        ],
        Settings: ["View", "Edit"],
      },
      [],
      ["Preferences"],
    ),
  },
  {
    id: "ROLE-007",
    name: "CRM Manager",
    description:
      "Oversees customer records, sales pipeline workflows, and CRM reporting.",
    kind: "System",
    createdBy: "System",
    createdDate: "2026-01-25",
    lastModified: "2026-06-14",
    permissionGroups: ["Revenue", "Reporting"],
    permissions: createRolePermissions({
      Dashboard: ["View", "Export"],
      CRM: ["View", "Create", "Edit", "Delete", "Export", "Manage"],
      Projects: ["View"],
    }),
  },
  {
    id: "ROLE-008",
    name: "Team Lead",
    description:
      "Reviews team activity, approves leave, and supports operational coordination.",
    kind: "Custom",
    createdBy: "Alex Mercer",
    createdDate: "2026-02-02",
    lastModified: "2026-06-10",
    permissionGroups: ["Team Management", "Approvals"],
    permissions: createRolePermissions({
      Dashboard: ["View"],
      Employees: ["View"],
      Attendance: ["View", "Approve"],
      Leave: ["View", "Approve"],
      Projects: ["View", "Edit", "Assign"],
    }),
  },
  {
    id: "ROLE-009",
    name: "Employee",
    description: "Standard employee access to personal and team-level modules.",
    kind: "System",
    createdBy: "System",
    createdDate: "2026-01-03",
    lastModified: "2026-06-08",
    permissionGroups: ["Self Service"],
    permissions: createRolePermissions({
      Dashboard: ["View"],
      Attendance: ["View", "Create"],
      Leave: ["View", "Create"],
      Projects: ["View"],
      Assets: ["View"],
    }),
  },
  {
    id: "ROLE-010",
    name: "Viewer",
    description:
      "Read-only access for observers, auditors, and limited stakeholders.",
    kind: "Custom",
    createdBy: "Alex Mercer",
    createdDate: "2026-02-16",
    lastModified: "2026-06-06",
    permissionGroups: ["Read Only"],
    permissions: createRolePermissions(
      Object.fromEntries(
        ADMIN_PERMISSION_MODULES.map((module) => [module, ["View"]]),
      ) as Partial<Record<PermissionModule, PermissionAction[]>>,
    ),
  },
];

const createActivityTimeline = (
  name: string,
  roleName: string,
  status: AdminUserStatus,
): AdminActivityItem[] => [
  {
    id: `${name}-1`,
    title: "Account created",
    description: `${name} was provisioned with ${roleName} access.`,
    timestamp: "2026-05-10 09:00",
    severity: "success" as const,
  },
  {
    id: `${name}-2`,
    title: "Permissions synced",
    description: `Module permissions were synchronized with the ${roleName} role.`,
    timestamp: "2026-05-16 13:30",
    severity: "info" as const,
  },
  {
    id: `${name}-3`,
    title:
      status === "Suspended"
        ? "Account suspended"
        : status === "Inactive"
          ? "Account marked inactive"
          : "Recent activity recorded",
    description:
      status === "Suspended"
        ? "Administrative access was suspended pending review."
        : status === "Inactive"
          ? "User has not signed in recently and access is currently inactive."
          : "User recently accessed assigned modules successfully.",
    timestamp: "2026-06-28 16:20",
    severity:
      status === "Suspended"
        ? "danger"
        : status === "Inactive"
          ? "warning"
          : "success",
  },
];

const createUsers = (roles: RoleDefinition[]): AdminUser[] => {
  const roleMap = Object.fromEntries(roles.map((role) => [role.id, role]));
  const seeds: Array<{
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
    createdAt: string;
    lastLogin: string;
  }> = [
    {
      id: "USR-001",
      employeeId: "EMP-101",
      fullName: "Alex Mercer",
      email: "alex.mercer@aethel.com",
      phone: "+1 (555) 210-0001",
      department: "Administration",
      designation: "System Administrator",
      roleId: "ROLE-001",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-01-05",
      lastLogin: "2026-07-02 08:15",
    },
    {
      id: "USR-002",
      employeeId: "EMP-102",
      fullName: "Sarah Jenkins",
      email: "sarah.jenkins@aethel.com",
      phone: "+1 (555) 210-0002",
      department: "HR",
      designation: "HR Director",
      roleId: "ROLE-003",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-01-08",
      lastLogin: "2026-07-02 07:52",
    },
    {
      id: "USR-003",
      employeeId: "EMP-103",
      fullName: "Michael Chen",
      email: "michael.chen@aethel.com",
      phone: "+1 (555) 210-0003",
      department: "Engineering",
      designation: "Principal Engineer",
      roleId: "ROLE-008",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-01-12",
      lastLogin: "2026-07-01 19:10",
    },
    {
      id: "USR-004",
      employeeId: "EMP-104",
      fullName: "Sophia Miller",
      email: "sophia.miller@aethel.com",
      phone: "+1 (555) 210-0004",
      department: "Marketing",
      designation: "Marketing Specialist",
      roleId: "ROLE-009",
      status: "Inactive",
      employmentType: "Full-time",
      createdAt: "2026-01-18",
      lastLogin: "2026-06-12 09:34",
    },
    {
      id: "USR-005",
      employeeId: "EMP-105",
      fullName: "David Vance",
      email: "david.vance@aethel.com",
      phone: "+1 (555) 210-0005",
      department: "Finance",
      designation: "Financial Controller",
      roleId: "ROLE-004",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-01-20",
      lastLogin: "2026-07-02 06:45",
    },
    {
      id: "USR-006",
      employeeId: "EMP-106",
      fullName: "Emily Blunt",
      email: "emily.blunt@aethel.com",
      phone: "+1 (555) 210-0006",
      department: "HR",
      designation: "Talent Acquisition Specialist",
      roleId: "ROLE-003",
      status: "Active",
      employmentType: "Part-time",
      createdAt: "2026-01-22",
      lastLogin: "2026-07-01 17:22",
    },
    {
      id: "USR-007",
      employeeId: "EMP-107",
      fullName: "Marcus Aurelius",
      email: "marcus.aurelius@aethel.com",
      phone: "+1 (555) 210-0007",
      department: "Operations",
      designation: "Operations Lead",
      roleId: "ROLE-005",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-01-25",
      lastLogin: "2026-07-02 07:12",
    },
    {
      id: "USR-008",
      employeeId: "EMP-108",
      fullName: "Clara Oswald",
      email: "clara.oswald@aethel.com",
      phone: "+1 (555) 210-0008",
      department: "Engineering",
      designation: "Junior Developer",
      roleId: "ROLE-009",
      status: "Pending",
      employmentType: "Intern",
      createdAt: "2026-02-01",
      lastLogin: "Never",
    },
    {
      id: "USR-009",
      employeeId: "EMP-109",
      fullName: "Robert Frost",
      email: "robert.frost@aethel.com",
      phone: "+1 (555) 210-0009",
      department: "Sales",
      designation: "Account Executive",
      roleId: "ROLE-007",
      status: "Active",
      employmentType: "Contract",
      createdAt: "2026-02-03",
      lastLogin: "2026-07-01 18:03",
    },
    {
      id: "USR-010",
      employeeId: "EMP-110",
      fullName: "Lisa Nakamura",
      email: "lisa.nakamura@aethel.com",
      phone: "+1 (555) 210-0010",
      department: "HR",
      designation: "HR Generalist",
      roleId: "ROLE-003",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-02-06",
      lastLogin: "2026-07-01 14:30",
    },
    {
      id: "USR-011",
      employeeId: "EMP-111",
      fullName: "Nina Patel",
      email: "nina.patel@aethel.com",
      phone: "+1 (555) 210-0011",
      department: "Engineering",
      designation: "Data Scientist",
      roleId: "ROLE-008",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-02-08",
      lastLogin: "2026-07-01 20:11",
    },
    {
      id: "USR-012",
      employeeId: "EMP-112",
      fullName: "Omar Hassan",
      email: "omar.hassan@aethel.com",
      phone: "+1 (555) 210-0012",
      department: "Engineering",
      designation: "Backend Developer",
      roleId: "ROLE-009",
      status: "Suspended",
      employmentType: "Full-time",
      createdAt: "2026-02-10",
      lastLogin: "2026-05-28 11:20",
    },
    {
      id: "USR-013",
      employeeId: "EMP-113",
      fullName: "Ryan Cooper",
      email: "ryan.cooper@aethel.com",
      phone: "+1 (555) 210-0013",
      department: "Operations",
      designation: "Operations Analyst",
      roleId: "ROLE-005",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-02-14",
      lastLogin: "2026-07-01 16:41",
    },
    {
      id: "USR-014",
      employeeId: "EMP-114",
      fullName: "Maria Gonzalez",
      email: "maria.gonzalez@aethel.com",
      phone: "+1 (555) 210-0014",
      department: "Marketing",
      designation: "Content Strategist",
      roleId: "ROLE-009",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-02-18",
      lastLogin: "2026-07-01 13:09",
    },
    {
      id: "USR-015",
      employeeId: "EMP-115",
      fullName: "Kevin Zhang",
      email: "kevin.zhang@aethel.com",
      phone: "+1 (555) 210-0015",
      department: "Engineering",
      designation: "QA Engineer",
      roleId: "ROLE-008",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-02-20",
      lastLogin: "2026-07-01 12:48",
    },
    {
      id: "USR-016",
      employeeId: "EMP-116",
      fullName: "Sophie Laurent",
      email: "sophie.laurent@aethel.com",
      phone: "+1 (555) 210-0016",
      department: "HR",
      designation: "Talent Acquisition Specialist",
      roleId: "ROLE-003",
      status: "Pending",
      employmentType: "Full-time",
      createdAt: "2026-02-24",
      lastLogin: "Never",
    },
    {
      id: "USR-017",
      employeeId: "EMP-117",
      fullName: "Patrick O'Brien",
      email: "patrick.obrien@aethel.com",
      phone: "+1 (555) 210-0017",
      department: "Finance",
      designation: "Controller",
      roleId: "ROLE-004",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-03-02",
      lastLogin: "2026-07-01 10:21",
    },
    {
      id: "USR-018",
      employeeId: "EMP-118",
      fullName: "Aisha Mohammed",
      email: "aisha.mohammed@aethel.com",
      phone: "+1 (555) 210-0018",
      department: "Engineering",
      designation: "Frontend Developer",
      roleId: "ROLE-009",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-03-04",
      lastLogin: "2026-07-01 21:16",
    },
    {
      id: "USR-019",
      employeeId: "EMP-119",
      fullName: "Leila Ahmed",
      email: "leila.ahmed@aethel.com",
      phone: "+1 (555) 210-0019",
      department: "HR",
      designation: "People Operations Specialist",
      roleId: "ROLE-003",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-03-07",
      lastLogin: "2026-07-01 15:05",
    },
    {
      id: "USR-020",
      employeeId: "EMP-120",
      fullName: "Marcus Lee",
      email: "marcus.lee@aethel.com",
      phone: "+1 (555) 210-0020",
      department: "Product",
      designation: "Product Manager",
      roleId: "ROLE-005",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-03-09",
      lastLogin: "2026-07-02 08:01",
    },
    {
      id: "USR-021",
      employeeId: "EMP-121",
      fullName: "Olivia Santos",
      email: "olivia.santos@aethel.com",
      phone: "+1 (555) 210-0021",
      department: "Sales",
      designation: "Sales Manager",
      roleId: "ROLE-007",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-03-12",
      lastLogin: "2026-07-01 18:50",
    },
    {
      id: "USR-022",
      employeeId: "EMP-122",
      fullName: "Lucas Bennett",
      email: "lucas.bennett@aethel.com",
      phone: "+1 (555) 210-0022",
      department: "Finance",
      designation: "Financial Analyst",
      roleId: "ROLE-004",
      status: "Inactive",
      employmentType: "Full-time",
      createdAt: "2026-03-14",
      lastLogin: "2026-06-01 09:05",
    },
    {
      id: "USR-023",
      employeeId: "EMP-123",
      fullName: "Ethan Park",
      email: "ethan.park@aethel.com",
      phone: "+1 (555) 210-0023",
      department: "Design",
      designation: "Product Designer",
      roleId: "ROLE-010",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-03-20",
      lastLogin: "2026-07-01 11:18",
    },
    {
      id: "USR-024",
      employeeId: "EMP-124",
      fullName: "Jonas Weber",
      email: "jonas.weber@aethel.com",
      phone: "+1 (555) 210-0024",
      department: "Engineering",
      designation: "Backend Engineer",
      roleId: "ROLE-008",
      status: "Active",
      employmentType: "Contract",
      createdAt: "2026-03-24",
      lastLogin: "2026-07-01 20:40",
    },
    {
      id: "USR-025",
      employeeId: "EMP-125",
      fullName: "Maya Richardson",
      email: "maya.richardson@aethel.com",
      phone: "+1 (555) 210-0025",
      department: "Engineering",
      designation: "Senior Frontend Engineer",
      roleId: "ROLE-008",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-03-27",
      lastLogin: "2026-07-02 08:08",
    },
    {
      id: "USR-026",
      employeeId: "EMP-126",
      fullName: "Sana Iqbal",
      email: "sana.iqbal@aethel.com",
      phone: "+1 (555) 210-0026",
      department: "HR",
      designation: "HR Business Partner",
      roleId: "ROLE-003",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-03-30",
      lastLogin: "2026-07-01 17:04",
    },
    {
      id: "USR-027",
      employeeId: "EMP-127",
      fullName: "Ava Mitchell",
      email: "ava.mitchell@aethel.com",
      phone: "+1 (555) 210-0027",
      department: "Marketing",
      designation: "Marketing Manager",
      roleId: "ROLE-009",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-04-02",
      lastLogin: "2026-07-01 12:15",
    },
    {
      id: "USR-028",
      employeeId: "EMP-128",
      fullName: "Noah Collins",
      email: "noah.collins@aethel.com",
      phone: "+1 (555) 210-0028",
      department: "Operations",
      designation: "Operations Coordinator",
      roleId: "ROLE-006",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-04-05",
      lastLogin: "2026-07-01 09:42",
    },
    {
      id: "USR-029",
      employeeId: "EMP-129",
      fullName: "Emma Thompson",
      email: "emma.thompson@aethel.com",
      phone: "+1 (555) 210-0029",
      department: "Marketing",
      designation: "Marketing Coordinator",
      roleId: "ROLE-009",
      status: "Pending",
      employmentType: "Contract",
      createdAt: "2026-04-08",
      lastLogin: "Never",
    },
    {
      id: "USR-030",
      employeeId: "EMP-130",
      fullName: "Carlos Mendez",
      email: "carlos.mendez@aethel.com",
      phone: "+1 (555) 210-0030",
      department: "Sales",
      designation: "Account Executive",
      roleId: "ROLE-007",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-04-12",
      lastLogin: "2026-07-01 19:22",
    },
    {
      id: "USR-031",
      employeeId: "EMP-131",
      fullName: "Hannah Wright",
      email: "hannah.wright@aethel.com",
      phone: "+1 (555) 210-0031",
      department: "Finance",
      designation: "Finance Associate",
      roleId: "ROLE-004",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-04-14",
      lastLogin: "2026-07-01 08:58",
    },
    {
      id: "USR-032",
      employeeId: "EMP-132",
      fullName: "Thomas Berger",
      email: "thomas.berger@aethel.com",
      phone: "+1 (555) 210-0032",
      department: "Sales",
      designation: "Sales Development Rep",
      roleId: "ROLE-009",
      status: "Inactive",
      employmentType: "Full-time",
      createdAt: "2026-04-16",
      lastLogin: "2026-05-30 16:10",
    },
    {
      id: "USR-033",
      employeeId: "EMP-133",
      fullName: "Benjamin Cole",
      email: "benjamin.cole@aethel.com",
      phone: "+1 (555) 210-0033",
      department: "Operations",
      designation: "Facilities Coordinator",
      roleId: "ROLE-006",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-04-18",
      lastLogin: "2026-07-01 07:49",
    },
    {
      id: "USR-034",
      employeeId: "EMP-134",
      fullName: "Priya Sharma",
      email: "priya.sharma@aethel.com",
      phone: "+1 (555) 210-0034",
      department: "Design",
      designation: "UX Designer",
      roleId: "ROLE-010",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-04-20",
      lastLogin: "2026-07-01 14:48",
    },
    {
      id: "USR-035",
      employeeId: "EMP-135",
      fullName: "James Okafor",
      email: "james.okafor@aethel.com",
      phone: "+1 (555) 210-0035",
      department: "Product",
      designation: "Senior Product Manager",
      roleId: "ROLE-005",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-04-23",
      lastLogin: "2026-07-02 07:41",
    },
    {
      id: "USR-036",
      employeeId: "EMP-136",
      fullName: "Daniel Kim",
      email: "daniel.kim@aethel.com",
      phone: "+1 (555) 210-0036",
      department: "Engineering",
      designation: "DevOps Engineer",
      roleId: "ROLE-008",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-04-28",
      lastLogin: "2026-07-01 22:03",
    },
    {
      id: "USR-037",
      employeeId: "EMP-137",
      fullName: "Ariana Brooks",
      email: "ariana.brooks@aethel.com",
      phone: "+1 (555) 210-0037",
      department: "Administration",
      designation: "Operations Administrator",
      roleId: "ROLE-002",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-05-01",
      lastLogin: "2026-07-02 08:10",
    },
    {
      id: "USR-038",
      employeeId: "EMP-138",
      fullName: "Victor Almeida",
      email: "victor.almeida@aethel.com",
      phone: "+1 (555) 210-0038",
      department: "Assets",
      designation: "Asset Coordinator",
      roleId: "ROLE-006",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-05-04",
      lastLogin: "2026-07-01 09:04",
    },
    {
      id: "USR-039",
      employeeId: "EMP-139",
      fullName: "Grace Coleman",
      email: "grace.coleman@aethel.com",
      phone: "+1 (555) 210-0039",
      department: "Support",
      designation: "Operations Support Specialist",
      roleId: "ROLE-010",
      status: "Suspended",
      employmentType: "Part-time",
      createdAt: "2026-05-06",
      lastLogin: "2026-05-24 15:16",
    },
    {
      id: "USR-040",
      employeeId: "EMP-140",
      fullName: "Mohammed Faris",
      email: "mohammed.faris@aethel.com",
      phone: "+1 (555) 210-0040",
      department: "CRM",
      designation: "CRM Specialist",
      roleId: "ROLE-007",
      status: "Active",
      employmentType: "Full-time",
      createdAt: "2026-05-08",
      lastLogin: "2026-07-01 18:28",
    },
  ];

  return seeds.map((seed) => {
    const role = roleMap[seed.roleId];
    const assignedModules = role ? getAssignedModulesFromRole(role) : [];
    const permissionsSummary = role ? getPermissionsSummaryFromRole(role) : [];

    return {
      ...seed,
      assignedModules,
      permissionsSummary,
      recentActions: [
        `Reviewed ${assignedModules[0] ?? "dashboard"} data`,
        `Updated ${seed.department} workflow preferences`,
        `Accessed role-based modules`,
      ],
      activityTimeline: createActivityTimeline(
        seed.fullName,
        role?.name ?? "Unknown",
        seed.status,
      ),
    };
  });
};

const syncUserRoleMeta = (user: AdminUser, roles: RoleDefinition[]) => {
  const role = roles.find((item) => item.id === user.roleId);
  if (!role) return user;

  user.assignedModules = getAssignedModulesFromRole(role);
  user.permissionsSummary = getPermissionsSummaryFromRole(role);
  user.activityTimeline = createActivityTimeline(
    user.fullName,
    role.name,
    user.status,
  );
  return user;
};

const createBaseState = (): SettingsState => {
  const currentYear = new Date().getFullYear();
  const roles = createRoles();
  const users = createUsers(roles);

  return {
    companyProfile: {
      name: "Aethel Enterprise",
      logo: "",
      email: "contact@aethel.com",
      phone: "+1 (555) 123-4567",
      website: "https://aethel.com",
      address: "123 Innovation Drive",
      city: "San Francisco",
      country: "United States",
      timeZone: "America/Los_Angeles",
      currency: "USD",
    },
    departments: [
      {
        id: "DEP-001",
        name: "Engineering",
        managerId: "EMP-101",
        managerName: "Sarah Jenkins",
        employeeCount: 15,
      },
      {
        id: "DEP-002",
        name: "Human Resources",
        managerId: "EMP-102",
        managerName: "Michael Chen",
        employeeCount: 5,
      },
      {
        id: "DEP-003",
        name: "Finance",
        managerId: "EMP-105",
        managerName: "David Vance",
        employeeCount: 8,
      },
      {
        id: "DEP-004",
        name: "Marketing",
        managerId: "EMP-104",
        managerName: "Robert Frost",
        employeeCount: 6,
      },
      {
        id: "DEP-005",
        name: "Sales",
        managerId: "EMP-106",
        managerName: "Emily Blunt",
        employeeCount: 10,
      },
    ],
    designations: [
      {
        id: "DES-001",
        name: "Frontend Developer",
        departmentId: "DEP-001",
        departmentName: "Engineering",
      },
      {
        id: "DES-002",
        name: "Backend Developer",
        departmentId: "DEP-001",
        departmentName: "Engineering",
      },
      {
        id: "DES-003",
        name: "DevOps Engineer",
        departmentId: "DEP-001",
        departmentName: "Engineering",
      },
      {
        id: "DES-004",
        name: "HR Executive",
        departmentId: "DEP-002",
        departmentName: "Human Resources",
      },
      {
        id: "DES-005",
        name: "Recruiter",
        departmentId: "DEP-002",
        departmentName: "Human Resources",
      },
      {
        id: "DES-006",
        name: "Accountant",
        departmentId: "DEP-003",
        departmentName: "Finance",
      },
      {
        id: "DES-007",
        name: "Financial Analyst",
        departmentId: "DEP-003",
        departmentName: "Finance",
      },
      {
        id: "DES-008",
        name: "Marketing Manager",
        departmentId: "DEP-004",
        departmentName: "Marketing",
      },
      {
        id: "DES-009",
        name: "Sales Executive",
        departmentId: "DEP-005",
        departmentName: "Sales",
      },
    ],
    holidays: [
      {
        id: "HOL-001",
        name: "New Year's Day",
        date: `${currentYear}-01-01`,
        description: "First day of the year",
        type: "National",
      },
      {
        id: "HOL-002",
        name: "Martin Luther King Jr. Day",
        date: `${currentYear}-01-15`,
        description: "MLK Day",
        type: "National",
      },
      {
        id: "HOL-003",
        name: "Memorial Day",
        date: `${currentYear}-05-27`,
        description: "Memorial Day",
        type: "National",
      },
      {
        id: "HOL-004",
        name: "Independence Day",
        date: `${currentYear}-07-04`,
        description: "4th of July",
        type: "National",
      },
      {
        id: "HOL-005",
        name: "Labor Day",
        date: `${currentYear}-09-02`,
        description: "Labor Day",
        type: "National",
      },
      {
        id: "HOL-006",
        name: "Thanksgiving",
        date: `${currentYear}-11-28`,
        description: "Thanksgiving Day",
        type: "National",
      },
      {
        id: "HOL-007",
        name: "Christmas Day",
        date: `${currentYear}-12-25`,
        description: "Christmas",
        type: "National",
      },
      {
        id: "HOL-008",
        name: "Company Anniversary",
        date: `${currentYear}-03-15`,
        description: "Company founding day",
        type: "Company",
      },
    ],
    leavePolicies: [
      {
        id: "POL-001",
        type: "Annual",
        maxDays: 20,
        carryForward: true,
        requiresApproval: true,
      },
      {
        id: "POL-002",
        type: "Casual",
        maxDays: 10,
        carryForward: false,
        requiresApproval: true,
      },
      {
        id: "POL-003",
        type: "Sick",
        maxDays: 15,
        carryForward: true,
        requiresApproval: false,
      },
      {
        id: "POL-004",
        type: "Unpaid",
        maxDays: 30,
        carryForward: false,
        requiresApproval: true,
      },
    ],
    payrollSettings: {
      defaultTaxRate: 15,
      overtimeRate: 1.5,
      bonusRules: "Performance-based quarterly bonus",
      salaryCycle: "Monthly",
      currencySymbol: "$",
    },
    assetCategories: [
      { id: "ACAT-001", name: "Laptop" },
      { id: "ACAT-002", name: "Desktop" },
      { id: "ACAT-003", name: "Monitor" },
      { id: "ACAT-004", name: "Keyboard" },
      { id: "ACAT-005", name: "Mouse" },
      { id: "ACAT-006", name: "Phone" },
      { id: "ACAT-007", name: "Printer" },
      { id: "ACAT-008", name: "Furniture" },
      { id: "ACAT-009", name: "Other" },
    ],
    systemPreferences: {
      theme: "system",
      language: "en",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      defaultPaginationSize: 10,
      notificationsEnabled: true,
    },
    users,
    roles,
  };
};

const getInitialState = (): SettingsState => {
  const baseState = createBaseState();

  if (typeof window === "undefined") {
    return baseState;
  }

  const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!stored) {
    return baseState;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<SettingsState>;
    return {
      ...baseState,
      ...parsed,
      users: parsed.users ?? baseState.users,
      roles: parsed.roles ?? baseState.roles,
      departments: parsed.departments ?? baseState.departments,
      designations: parsed.designations ?? baseState.designations,
      holidays: parsed.holidays ?? baseState.holidays,
      leavePolicies: parsed.leavePolicies ?? baseState.leavePolicies,
      assetCategories: parsed.assetCategories ?? baseState.assetCategories,
      payrollSettings: parsed.payrollSettings ?? baseState.payrollSettings,
      systemPreferences:
        parsed.systemPreferences ?? baseState.systemPreferences,
      companyProfile: parsed.companyProfile ?? baseState.companyProfile,
    };
  } catch (e) {
    console.error("Failed to parse Settings from localStorage", e);
    return baseState;
  }
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: getInitialState(),
  reducers: {
    updateCompanyProfile: (state, action: PayloadAction<CompanyProfile>) => {
      state.companyProfile = action.payload;
    },
    addDepartment: (state, action: PayloadAction<Department>) => {
      state.departments.push(action.payload);
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
      const index = state.departments.findIndex(
        (d) => d.id === action.payload.id,
      );
      if (index !== -1) {
        state.departments[index] = action.payload;
      }
    },
    deleteDepartment: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter(
        (d) => d.id !== action.payload,
      );
    },
    addDesignation: (state, action: PayloadAction<Designation>) => {
      state.designations.push(action.payload);
    },
    updateDesignation: (state, action: PayloadAction<Designation>) => {
      const index = state.designations.findIndex(
        (d) => d.id === action.payload.id,
      );
      if (index !== -1) {
        state.designations[index] = action.payload;
      }
    },
    deleteDesignation: (state, action: PayloadAction<string>) => {
      state.designations = state.designations.filter(
        (d) => d.id !== action.payload,
      );
    },
    addHoliday: (state, action: PayloadAction<Holiday>) => {
      state.holidays.push(action.payload);
    },
    updateHoliday: (state, action: PayloadAction<Holiday>) => {
      const index = state.holidays.findIndex((h) => h.id === action.payload.id);
      if (index !== -1) {
        state.holidays[index] = action.payload;
      }
    },
    deleteHoliday: (state, action: PayloadAction<string>) => {
      state.holidays = state.holidays.filter((h) => h.id !== action.payload);
    },
    updateLeavePolicy: (state, action: PayloadAction<LeavePolicy>) => {
      const index = state.leavePolicies.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (index !== -1) {
        state.leavePolicies[index] = action.payload;
      }
    },
    updatePayrollSettings: (state, action: PayloadAction<PayrollSettings>) => {
      state.payrollSettings = action.payload;
    },
    addAssetCategory: (state, action: PayloadAction<AssetCategory>) => {
      state.assetCategories.push(action.payload);
    },
    updateAssetCategory: (state, action: PayloadAction<AssetCategory>) => {
      const index = state.assetCategories.findIndex(
        (c) => c.id === action.payload.id,
      );
      if (index !== -1) {
        state.assetCategories[index] = action.payload;
      }
    },
    deleteAssetCategory: (state, action: PayloadAction<string>) => {
      state.assetCategories = state.assetCategories.filter(
        (c) => c.id !== action.payload,
      );
    },
    updateSystemPreferences: (
      state,
      action: PayloadAction<SystemPreferences>,
    ) => {
      state.systemPreferences = action.payload;
    },
    inviteAdminUser: (state, action: PayloadAction<AdminUser>) => {
      const user = { ...action.payload };
      syncUserRoleMeta(user, state.roles);
      state.users.unshift(user);
    },
    updateAdminUser: (state, action: PayloadAction<AdminUser>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id,
      );
      if (index !== -1) {
        const user = { ...action.payload };
        syncUserRoleMeta(user, state.roles);
        state.users[index] = user;
      }
    },
    deactivateAdminUser: (state, action: PayloadAction<string>) => {
      const user = state.users.find((item) => item.id === action.payload);
      if (user) {
        user.status = "Inactive";
        syncUserRoleMeta(user, state.roles);
      }
    },
    deleteAdminUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    addRoleDefinition: (state, action: PayloadAction<RoleDefinition>) => {
      state.roles.unshift(action.payload);
    },
    updateRoleDefinition: (state, action: PayloadAction<RoleDefinition>) => {
      const index = state.roles.findIndex(
        (role) => role.id === action.payload.id,
      );
      if (index !== -1) {
        state.roles[index] = action.payload;
        state.users.forEach((user) => {
          if (user.roleId === action.payload.id) {
            syncUserRoleMeta(user, state.roles);
          }
        });
      }
    },
    duplicateRoleDefinition: (state, action: PayloadAction<RoleDefinition>) => {
      state.roles.unshift(action.payload);
    },
    deleteRoleDefinition: (state, action: PayloadAction<string>) => {
      const role = state.roles.find((item) => item.id === action.payload);
      if (!role || role.name === "Super Admin") {
        return;
      }

      state.roles = state.roles.filter((item) => item.id !== action.payload);
      state.users.forEach((user) => {
        if (user.roleId === action.payload) {
          user.roleId = "ROLE-010";
          syncUserRoleMeta(user, state.roles);
        }
      });
    },
  },
});

export const {
  updateCompanyProfile,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  addDesignation,
  updateDesignation,
  deleteDesignation,
  addHoliday,
  updateHoliday,
  deleteHoliday,
  updateLeavePolicy,
  updatePayrollSettings,
  addAssetCategory,
  updateAssetCategory,
  deleteAssetCategory,
  updateSystemPreferences,
  inviteAdminUser,
  updateAdminUser,
  deactivateAdminUser,
  deleteAdminUser,
  addRoleDefinition,
  updateRoleDefinition,
  duplicateRoleDefinition,
  deleteRoleDefinition,
} = settingsSlice.actions;

export default settingsSlice.reducer;
