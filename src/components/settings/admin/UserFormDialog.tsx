import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { AdminUser, AdminUserStatus, EmploymentTypeOption, RoleDefinition } from "@/features/settings/settingsTypes"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "invite" | "edit"
  departments: string[]
  roles: RoleDefinition[]
  initialUser?: AdminUser | null
  onSubmit: (values: {
    fullName: string
    email: string
    department: string
    roleId: string
    employmentType: EmploymentTypeOption
    status: AdminUserStatus
    phone: string
  }) => void
}

const defaultValues = {
  fullName: "",
  email: "",
  department: "Engineering",
  roleId: "ROLE-009",
  employmentType: "Full-time" as EmploymentTypeOption,
  status: "Pending" as AdminUserStatus,
  phone: "",
}

export function UserFormDialog({ open, onOpenChange, mode, departments, roles, initialUser, onSubmit }: UserFormDialogProps) {
  const [form, setForm] = useState(defaultValues)

  useEffect(() => {
    if (mode === "edit" && initialUser) {
      setForm({
        fullName: initialUser.fullName,
        email: initialUser.email,
        department: initialUser.department,
        roleId: initialUser.roleId,
        employmentType: initialUser.employmentType,
        status: initialUser.status,
        phone: initialUser.phone,
      })
      return
    }

    setForm({
      ...defaultValues,
      department: departments[0] ?? "Engineering",
      roleId: roles[0]?.id ?? "ROLE-009",
    })
  }, [mode, initialUser, departments, roles, open])

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel max-w-lg rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">{mode === "invite" ? "Invite User" : "Edit User"}</DialogTitle>
          <DialogDescription className="text-xs">
            {mode === "invite"
              ? "Create a new user invitation and assign access controls."
              : "Update account details, role assignment, and access status."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Full Name</label>
            <Input value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} className="bg-muted/10 border-border/80 rounded-lg text-xs" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Email</label>
            <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="bg-muted/10 border-border/80 rounded-lg text-xs" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Department</label>
            <select value={form.department} onChange={(e) => handleChange("department", e.target.value)} className="flex h-8.5 w-full rounded-lg border border-border/80 bg-muted/10 px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring">
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Role</label>
            <select value={form.roleId} onChange={(e) => handleChange("roleId", e.target.value)} className="flex h-8.5 w-full rounded-lg border border-border/80 bg-muted/10 px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring">
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Employment Type</label>
            <select value={form.employmentType} onChange={(e) => handleChange("employmentType", e.target.value)} className="flex h-8.5 w-full rounded-lg border border-border/80 bg-muted/10 px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring">
              {(["Full-time", "Part-time", "Contract", "Intern"] as EmploymentTypeOption[]).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Status</label>
            <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className="flex h-8.5 w-full rounded-lg border border-border/80 bg-muted/10 px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring">
              {(["Active", "Inactive", "Pending", "Suspended"] as AdminUserStatus[]).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Phone</label>
            <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className="bg-muted/10 border-border/80 rounded-lg text-xs" />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg text-xs">Cancel</Button>
          <Button onClick={() => onSubmit(form)} className="rounded-lg text-xs">
            {mode === "invite" ? "Send Invitation" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
