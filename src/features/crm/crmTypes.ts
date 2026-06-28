export interface Customer {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  industry: string
  website: string
  address: string
  city: string
  country: string
  status: "Lead" | "Contacted" | "Negotiation" | "Active Client" | "Inactive"
  assignedEmployeeId: string
  assignedEmployeeName: string
  notes: string
  createdAt: string
}

export interface CRMState {
  customers: Customer[]
}
