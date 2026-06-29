export interface CompanyProfile {
  name: string
  logo: string
  email: string
  phone: string
  website: string
  address: string
  city: string
  country: string
  timeZone: string
  currency: string
}

export interface Department {
  id: string
  name: string
  managerId?: string
  managerName?: string
  employeeCount: number
}

export interface Designation {
  id: string
  name: string
  departmentId: string
  departmentName: string
}

export interface Holiday {
  id: string
  name: string
  date: string
  description: string
  type: "National" | "Regional" | "Company"
}

export interface LeavePolicy {
  id: string
  type: "Annual" | "Casual" | "Sick" | "Unpaid"
  maxDays: number
  carryForward: boolean
  requiresApproval: boolean
}

export interface PayrollSettings {
  defaultTaxRate: number
  overtimeRate: number
  bonusRules: string
  salaryCycle: "Monthly" | "Bi-Weekly" | "Weekly"
  currencySymbol: string
}

export interface AssetCategory {
  id: string
  name: string
}

export interface SystemPreferences {
  theme: "light" | "dark" | "system"
  language: string
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD"
  timeFormat: "12h" | "24h"
  defaultPaginationSize: number
  notificationsEnabled: boolean
}

export interface SettingsState {
  companyProfile: CompanyProfile
  departments: Department[]
  designations: Designation[]
  holidays: Holiday[]
  leavePolicies: LeavePolicy[]
  payrollSettings: PayrollSettings
  assetCategories: AssetCategory[]
  systemPreferences: SystemPreferences
}
