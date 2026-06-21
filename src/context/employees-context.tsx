import { createContext, useContext, useEffect, useState } from "react"

export interface Employee {
  id: string
  fullName: string
  email: string
  phone: string
  department: string
  designation: string
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern"
  joiningDate: string // YYYY-MM-DD
  salary: number
  address: string
  status: "Active" | "On Leave" | "Resigned" | "Suspended"
}

interface EmployeesContextType {
  employees: Employee[]
  addEmployee: (employee: Employee) => void
  updateEmployee: (id: string, updated: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  getEmployeeById: (id: string) => Employee | undefined
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(undefined)

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
    joiningDate: "2026-06-01", // New Joiner (under 30 days from June 21, 2026)
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
    joiningDate: "2026-06-15", // New Joiner (under 30 days from June 21, 2026)
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

export function EmployeesProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("aethel-ebms-employees")
    return saved ? JSON.parse(saved) : initialMockEmployees
  })

  useEffect(() => {
    localStorage.setItem("aethel-ebms-employees", JSON.stringify(employees))
  }, [employees])

  const addEmployee = (employee: Employee) => {
    setEmployees((prev) => [...prev, employee])
  }

  const updateEmployee = (id: string, updated: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updated } : emp))
    )
  }

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id))
  }

  const getEmployeeById = (id: string) => {
    return employees.find((emp) => emp.id === id)
  }

  return (
    <EmployeesContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  )
}

export function useEmployees() {
  const context = useContext(EmployeesContext)
  if (!context) {
    throw new Error("useEmployees must be used within an EmployeesProvider")
  }
  return context
}
