import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Employee } from "./employeeTypes"

export interface EmployeesState {
  employees: Employee[]
}

export const EMPLOYEES_STORAGE_KEY = "aethel-ebms-employees"

const initialMockEmployees: Employee[] = [
  {
    id: "EMP-101",
    fullName: "Sarah Jenkins",
    email: "sarah.jenkins@aethel.com",
    phone: "+1 (555) 123-4567",
    department: "HR",
    designation: "HR Director",
    employmentType: "Full-time",
    joiningDate: "2022-03-15",
    salary: 85000,
    address: "742 Evergreen Terrace, Springfield",
    status: "Active",
  },
  {
    id: "EMP-102",
    fullName: "Michael Chen",
    email: "michael.chen@aethel.com",
    phone: "+1 (555) 234-5678",
    department: "Engineering",
    designation: "Principal Engineer",
    employmentType: "Full-time",
    joiningDate: "2023-01-10",
    salary: 140000,
    address: "123 Elm Street, Metropolis",
    status: "Active",
  },
  {
    id: "EMP-103",
    fullName: "Sophia Miller",
    email: "sophia.miller@aethel.com",
    phone: "+1 (555) 345-6789",
    department: "Marketing",
    designation: "Marketing Specialist",
    employmentType: "Full-time",
    joiningDate: "2024-05-18",
    salary: 65000,
    address: "456 Oak Avenue, Riverdale",
    status: "On Leave",
  },
  {
    id: "EMP-104",
    fullName: "Robert Frost",
    email: "robert.frost@aethel.com",
    phone: "+1 (555) 456-7890",
    department: "Sales",
    designation: "Account Executive",
    employmentType: "Contract",
    joiningDate: "2025-11-01",
    salary: 75000,
    address: "789 Pine Lane, Gotham City",
    status: "Active",
  },
  {
    id: "EMP-105",
    fullName: "David Vance",
    email: "david.vance@aethel.com",
    phone: "+1 (555) 567-8901",
    department: "Finance",
    designation: "Financial Controller",
    employmentType: "Full-time",
    joiningDate: "2023-06-20",
    salary: 95000,
    address: "321 Cedar Boulevard, Star City",
    status: "Active",
  },
  {
    id: "EMP-106",
    fullName: "Emily Blunt",
    email: "emily.blunt@aethel.com",
    phone: "+1 (555) 678-9012",
    department: "HR",
    designation: "Talent Acquisition Specialist",
    employmentType: "Part-time",
    joiningDate: "2026-06-01",
    salary: 50000,
    address: "555 Maple Drive, Hill Valley",
    status: "Active",
  },
  {
    id: "EMP-107",
    fullName: "Marcus Aurelius",
    email: "marcus.aurelius@aethel.com",
    phone: "+1 (555) 789-0123",
    department: "Operations",
    designation: "Operations Lead",
    employmentType: "Full-time",
    joiningDate: "2021-08-01",
    salary: 110000,
    address: "999 Forum Way, Rome",
    status: "Active",
  },
  {
    id: "EMP-108",
    fullName: "Clara Oswald",
    email: "clara.oswald@aethel.com",
    phone: "+1 (555) 890-1234",
    department: "Engineering",
    designation: "Junior Developer",
    employmentType: "Intern",
    joiningDate: "2026-06-15",
    salary: 35000,
    address: "777 TARDIS Court, London",
    status: "Active",
  },
  {
    id: "EMP-109",
    fullName: "John Hammond",
    email: "john.hammond@aethel.com",
    phone: "+1 (555) 901-2345",
    department: "Operations",
    designation: "Facilities Manager",
    employmentType: "Full-time",
    joiningDate: "2020-04-12",
    salary: 90000,
    address: "1 Isla Nublar, Costa Rica",
    status: "Resigned",
  },
]

const loadInitialEmployees = (): Employee[] => {
  if (typeof window === "undefined") {
    return initialMockEmployees
  }

  const savedEmployees = window.localStorage.getItem(EMPLOYEES_STORAGE_KEY)

  if (!savedEmployees) {
    return initialMockEmployees
  }

  try {
    return JSON.parse(savedEmployees) as Employee[]
  } catch {
    return initialMockEmployees
  }
}

const initialState: EmployeesState = {
  employees: loadInitialEmployees(),
}

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload)
    },
    updateEmployee: (
      state,
      action: PayloadAction<{ id: string; updated: Partial<Employee> }>
    ) => {
      const employee = state.employees.find((emp) => emp.id === action.payload.id)

      if (employee) {
        Object.assign(employee, action.payload.updated)
      }
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter((emp) => emp.id !== action.payload)
    },
  },
})

export const { addEmployee, updateEmployee, deleteEmployee } = employeeSlice.actions
export default employeeSlice.reducer

