export interface Employee {
  id: string
  fullName: string
  email: string
  phone: string
  department: string
  designation: string
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern"
  joiningDate: string
  salary: number
  address: string
  status: "Active" | "On Leave" | "Resigned" | "Suspended"
}

