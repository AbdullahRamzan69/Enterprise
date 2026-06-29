import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { SettingsState, CompanyProfile, Department, Designation, Holiday, LeavePolicy, PayrollSettings, AssetCategory, SystemPreferences } from "./settingsTypes"

export const SETTINGS_STORAGE_KEY = "aethel_ebms_settings"

const getInitialState = (): SettingsState => {
  if (typeof window === "undefined") {
    return {
      companyProfile: {
        name: "",
        logo: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        city: "",
        country: "",
        timeZone: "",
        currency: "",
      },
      departments: [],
      designations: [],
      holidays: [],
      leavePolicies: [],
      payrollSettings: {
        defaultTaxRate: 0,
        overtimeRate: 0,
        bonusRules: "",
        salaryCycle: "Monthly",
        currencySymbol: "$",
      },
      assetCategories: [],
      systemPreferences: {
        theme: "system",
        language: "en",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h",
        defaultPaginationSize: 10,
        notificationsEnabled: true,
      },
    }
  }
  const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error("Failed to parse Settings from localStorage", e)
    }
  }

  const currentYear = new Date().getFullYear()

  // Mock data
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
      { id: "DEP-001", name: "Engineering", managerId: "EMP-101", managerName: "Sarah Jenkins", employeeCount: 15 },
      { id: "DEP-002", name: "Human Resources", managerId: "EMP-102", managerName: "Michael Chen", employeeCount: 5 },
      { id: "DEP-003", name: "Finance", managerId: "EMP-105", managerName: "David Vance", employeeCount: 8 },
      { id: "DEP-004", name: "Marketing", managerId: "EMP-104", managerName: "Robert Frost", employeeCount: 6 },
      { id: "DEP-005", name: "Sales", managerId: "EMP-106", managerName: "Emily Blunt", employeeCount: 10 },
    ],
    designations: [
      { id: "DES-001", name: "Frontend Developer", departmentId: "DEP-001", departmentName: "Engineering" },
      { id: "DES-002", name: "Backend Developer", departmentId: "DEP-001", departmentName: "Engineering" },
      { id: "DES-003", name: "DevOps Engineer", departmentId: "DEP-001", departmentName: "Engineering" },
      { id: "DES-004", name: "HR Executive", departmentId: "DEP-002", departmentName: "Human Resources" },
      { id: "DES-005", name: "Recruiter", departmentId: "DEP-002", departmentName: "Human Resources" },
      { id: "DES-006", name: "Accountant", departmentId: "DEP-003", departmentName: "Finance" },
      { id: "DES-007", name: "Financial Analyst", departmentId: "DEP-003", departmentName: "Finance" },
      { id: "DES-008", name: "Marketing Manager", departmentId: "DEP-004", departmentName: "Marketing" },
      { id: "DES-009", name: "Sales Executive", departmentId: "DEP-005", departmentName: "Sales" },
    ],
    holidays: [
      { id: "HOL-001", name: "New Year's Day", date: `${currentYear}-01-01`, description: "First day of the year", type: "National" },
      { id: "HOL-002", name: "Martin Luther King Jr. Day", date: `${currentYear}-01-15`, description: "MLK Day", type: "National" },
      { id: "HOL-003", name: "Memorial Day", date: `${currentYear}-05-27`, description: "Memorial Day", type: "National" },
      { id: "HOL-004", name: "Independence Day", date: `${currentYear}-07-04`, description: "4th of July", type: "National" },
      { id: "HOL-005", name: "Labor Day", date: `${currentYear}-09-02`, description: "Labor Day", type: "National" },
      { id: "HOL-006", name: "Thanksgiving", date: `${currentYear}-11-28`, description: "Thanksgiving Day", type: "National" },
      { id: "HOL-007", name: "Christmas Day", date: `${currentYear}-12-25`, description: "Christmas", type: "National" },
      { id: "HOL-008", name: "Company Anniversary", date: `${currentYear}-03-15`, description: "Company founding day", type: "Company" },
    ],
    leavePolicies: [
      { id: "POL-001", type: "Annual", maxDays: 20, carryForward: true, requiresApproval: true },
      { id: "POL-002", type: "Casual", maxDays: 10, carryForward: false, requiresApproval: true },
      { id: "POL-003", type: "Sick", maxDays: 15, carryForward: true, requiresApproval: false },
      { id: "POL-004", type: "Unpaid", maxDays: 30, carryForward: false, requiresApproval: true },
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
  }
}

const settingsSlice = createSlice({
  name: "settings",
  initialState: getInitialState(),
  reducers: {
    updateCompanyProfile: (state, action: PayloadAction<CompanyProfile>) => {
      state.companyProfile = action.payload
    },
    addDepartment: (state, action: PayloadAction<Department>) => {
      state.departments.push(action.payload)
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
      const index = state.departments.findIndex((d) => d.id === action.payload.id)
      if (index !== -1) {
        state.departments[index] = action.payload
      }
    },
    deleteDepartment: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter((d) => d.id !== action.payload)
    },
    addDesignation: (state, action: PayloadAction<Designation>) => {
      state.designations.push(action.payload)
    },
    updateDesignation: (state, action: PayloadAction<Designation>) => {
      const index = state.designations.findIndex((d) => d.id === action.payload.id)
      if (index !== -1) {
        state.designations[index] = action.payload
      }
    },
    deleteDesignation: (state, action: PayloadAction<string>) => {
      state.designations = state.designations.filter((d) => d.id !== action.payload)
    },
    addHoliday: (state, action: PayloadAction<Holiday>) => {
      state.holidays.push(action.payload)
    },
    updateHoliday: (state, action: PayloadAction<Holiday>) => {
      const index = state.holidays.findIndex((h) => h.id === action.payload.id)
      if (index !== -1) {
        state.holidays[index] = action.payload
      }
    },
    deleteHoliday: (state, action: PayloadAction<string>) => {
      state.holidays = state.holidays.filter((h) => h.id !== action.payload)
    },
    updateLeavePolicy: (state, action: PayloadAction<LeavePolicy>) => {
      const index = state.leavePolicies.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.leavePolicies[index] = action.payload
      }
    },
    updatePayrollSettings: (state, action: PayloadAction<PayrollSettings>) => {
      state.payrollSettings = action.payload
    },
    addAssetCategory: (state, action: PayloadAction<AssetCategory>) => {
      state.assetCategories.push(action.payload)
    },
    updateAssetCategory: (state, action: PayloadAction<AssetCategory>) => {
      const index = state.assetCategories.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) {
        state.assetCategories[index] = action.payload
      }
    },
    deleteAssetCategory: (state, action: PayloadAction<string>) => {
      state.assetCategories = state.assetCategories.filter((c) => c.id !== action.payload)
    },
    updateSystemPreferences: (state, action: PayloadAction<SystemPreferences>) => {
      state.systemPreferences = action.payload
    },
  },
})

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
} = settingsSlice.actions

export default settingsSlice.reducer
