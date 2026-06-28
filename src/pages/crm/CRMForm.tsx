import { useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { addCustomer, updateCustomer } from "@/features/crm/crmSlice"
import { selectCustomerById, selectAllCustomers } from "@/features/crm/crmSelectors"
import { selectEmployees } from "@/features/employees/employeeSelectors"
import type { Customer } from "@/features/crm/crmTypes"

const STATUSES = ["Lead", "Contacted", "Negotiation", "Active Client", "Inactive"] as const

const createCustomerFormData = (customers: Customer[], customer?: Customer): Customer => {
  if (customer) {
    return { ...customer }
  }

  const ids = customers
    .map((c) => parseInt(c.id.replace("CUST-", ""), 10))
    .filter((num) => !isNaN(num))
  const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 1001

  return {
    id: `CUST-${nextIdNum}`,
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    industry: "",
    website: "",
    address: "",
    city: "",
    country: "",
    status: "Lead",
    assignedEmployeeId: "",
    assignedEmployeeName: "",
    notes: "",
    createdAt: new Date().toISOString(),
  }
}

export default function CRMForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const customers = useAppSelector(selectAllCustomers)
  const customer = useAppSelector((state) => (id ? selectCustomerById(state, id) : undefined))
  const employees = useAppSelector(selectEmployees)

  const isEditMode = !!id
  const error =
    isEditMode && id && !customer
      ? `Client with ID "${id}" was not found in database registry.`
      : ""

  // Form State
  const [formData, setFormData] = useState<Customer>(() =>
    createCustomerFormData(customers, customer)
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    if (name === "assignedEmployeeId") {
      const emp = employees.find((emp) => emp.id === value)
      setFormData((prev) => ({
        ...prev,
        assignedEmployeeId: value,
        assignedEmployeeName: emp ? emp.fullName : "",
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation checks
    if (!formData.companyName.trim()) return alert("Company Name is required.")
    
    // Unique company name check (ignoring self if edit mode)
    const duplicate = customers.find(
      (c) => c.companyName.toLowerCase() === formData.companyName.trim().toLowerCase() && c.id !== formData.id
    )
    if (duplicate) return alert("Company Name must be unique.")

    if (!formData.contactPerson.trim()) return alert("Contact Person is required.")
    
    // Basic Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      return alert("A valid email is required.")
    }

    // Basic Phone validation (minimum 10 characters if provided, though we require it)
    if (!formData.phone.trim() || formData.phone.length < 5) {
       return alert("A valid phone number is required.")
    }

    // URL validation if provided
    if (formData.website.trim()) {
      try {
        new URL(formData.website)
      } catch {
        return alert("Website must be a valid URL (e.g., https://example.com).")
      }
    }

    if (!formData.assignedEmployeeId) return alert("An Account Manager must be assigned.")

    if (isEditMode) {
      dispatch(updateCustomer(formData))
    } else {
      dispatch(addCustomer(formData))
    }

    navigate("/crm")
  }

  if (error) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Record Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">{error}</p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/crm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Return to CRM
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="h-8 w-8 rounded-lg border-border/80 text-muted-foreground hover:text-foreground shrink-0"
        >
          <Link to="/crm">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {isEditMode ? "Modify Client Record" : "Add New Client"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEditMode ? `Updating database records for ${formData.companyName}` : "Create a new CRM record."}
          </p>
        </div>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 max-w-4xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isEditMode ? "Edit Client Info" : "New Client Information"}
              </CardTitle>
              <CardDescription className="text-xs">
                Fill all required fields to sync the profile in the central directory.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
              {formData.id}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              
              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Company Name <span className="text-destructive">*</span>
                </label>
                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Primary Contact <span className="text-destructive">*</span>
                </label>
                <Input
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. contact@acmecorp.com"
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 019-2834"
                  required
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Industry
                </label>
                <Input
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="e.g. Technology"
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Website
                </label>
                <Input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="e.g. https://acmecorp.com"
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  City
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. New York"
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Country
                </label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g. USA"
                  className="bg-muted/10 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-xs"
                />
              </div>

              {/* Status Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Client Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Manager Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Account Manager <span className="text-destructive">*</span>
                </label>
                <select
                  name="assignedEmployeeId"
                  value={formData.assignedEmployeeId}
                  onChange={handleChange}
                  required
                  className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                >
                  <option value="" disabled>Select an Account Manager</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              {/* Address (Span full-width) */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 123 Business Rd, Suite 400"
                  rows={2}
                  className="flex w-full rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* Notes (Span full-width) */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional context or internal notes..."
                  rows={3}
                  className="flex w-full rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

            </div>

            {/* Form Footer Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg"
              >
                <Link to="/crm">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isEditMode ? "Save Changes" : "Create Client"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
