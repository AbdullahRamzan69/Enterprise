import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  Copy,
  Shield,
  Trash2,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmationDialog } from "@/components/settings/admin/ConfirmationDialog"
import { MockToast } from "@/components/settings/admin/MockToast"
import { PermissionMatrix } from "@/components/settings/admin/PermissionMatrix"
import { RoleFormDialog } from "@/components/settings/admin/RoleFormDialog"
import {
  deleteRoleDefinition,
  duplicateRoleDefinition,
  updateRoleDefinition,
} from "@/features/settings/settingsSlice"
import { selectAdminUsers, selectRoleById, selectRoles } from "@/features/settings/settingsSelectors"
import { countRolePermissions, createEmptyRolePermissions, formatAdminDate, getRoleAssignedModules } from "@/features/settings/settingsAdminUtils"

export default function SettingsRoleDetails() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const roles = useAppSelector(selectRoles)
  const users = useAppSelector(selectAdminUsers)
  const role = useAppSelector((state) => (id ? selectRoleById(state, id) : undefined))
  const assignedUsers = users.filter((user) => user.roleId === role?.id)

  const [editOpen, setEditOpen] = useState(false)
  const [duplicateOpen, setDuplicateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [protectedOpen, setProtectedOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  if (!role) {
    return (
      <div className="space-y-6 text-center py-12 animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Role Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">
            We could not find a role record for this request.
          </p>
          <Button asChild size="sm" className="rounded-lg">
            <Link to="/settings/roles-permissions">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Roles
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const assignedModules = getRoleAssignedModules(role)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild className="h-8 w-8 rounded-lg border-border/80">
            <Link to="/settings/roles-permissions">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-bold text-foreground">Role Details</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Review metadata, assigned users, and permissions for {role.name}.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)} className="rounded-lg text-xs">Edit Role</Button>
          <Button variant="outline" onClick={() => setDuplicateOpen(true)} className="rounded-lg text-xs"><Copy className="w-4 h-4 mr-1.5" />Duplicate</Button>
          <Button variant="destructive" onClick={() => role.name === "Super Admin" ? setProtectedOpen(true) : setDeleteOpen(true)} className="rounded-lg text-xs"><Trash2 className="w-4 h-4 mr-1.5" />Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">{role.name}</CardTitle>
                  <CardDescription className="text-sm mt-1">{role.description}</CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full px-2.5 py-1 text-[11px] bg-muted/20 w-fit">
                  {role.kind}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Users Assigned" value={String(assignedUsers.length)} />
              <InfoCard label="Permissions Count" value={String(countRolePermissions(role))} />
              <InfoCard label="Created By" value={role.createdBy} />
              <InfoCard label="Created Date" value={formatAdminDate(role.createdDate)} />
              <InfoCard label="Last Modified" value={formatAdminDate(role.lastModified)} />
              <InfoCard label="Permission Groups" value={role.permissionGroups.join(", ")} />
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">Permission Matrix</CardTitle>
              <CardDescription className="text-xs">Read-only view of module-level and special permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionMatrix value={role.permissions} readOnly />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Assigned Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {assignedModules.map((module) => (
                <Badge key={module} variant="outline" className="rounded-full px-2.5 py-1 bg-muted/20">{module}</Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-foreground">Users Assigned</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignedUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users are currently assigned to this role.</p>
              ) : (
                assignedUsers.map((user) => (
                  <Link key={user.id} to={`/settings/users/${user.id}`} className="block rounded-lg border border-border/60 bg-muted/10 px-3 py-2 hover:bg-muted/20 transition-colors">
                    <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{user.department} • {user.designation}</p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <RoleFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        initialRole={role}
        emptyPermissions={createEmptyRolePermissions()}
        onSubmit={(values) => {
          dispatch(updateRoleDefinition({ ...role, ...values, lastModified: new Date().toISOString().split("T")[0] }))
          setEditOpen(false)
          setToastMessage("Role updated successfully.")
        }}
      />

      <ConfirmationDialog
        open={duplicateOpen}
        onOpenChange={setDuplicateOpen}
        title="Duplicate Role"
        description={`Create a copy of ${role.name}?`}
        confirmLabel="Duplicate"
        onConfirm={() => {
          const ids = roles.map((item) => parseInt(item.id.replace("ROLE-", ""), 10)).filter((value) => !Number.isNaN(value))
          const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 11
          dispatch(duplicateRoleDefinition({
            ...role,
            id: `ROLE-${String(nextId).padStart(3, "0")}`,
            name: `${role.name} Copy`,
            kind: "Custom",
            createdBy: "Alex Mercer",
            createdDate: new Date().toISOString().split("T")[0],
            lastModified: new Date().toISOString().split("T")[0],
          }))
          setDuplicateOpen(false)
          setToastMessage("Role duplicated successfully.")
        }}
      />

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Role"
        description={`Delete the ${role.name} role? Assigned users will fall back to Viewer access.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          dispatch(deleteRoleDefinition(role.id))
          setDeleteOpen(false)
          setToastMessage("Role deleted successfully.")
        }}
      />

      <ConfirmationDialog
        open={protectedOpen}
        onOpenChange={setProtectedOpen}
        title="Role Protected"
        description="The Super Admin role cannot be deleted."
        confirmLabel="Understood"
        onConfirm={() => setProtectedOpen(false)}
      />

      {toastMessage && <MockToast message={toastMessage} />}
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      <div className="rounded-lg border border-border/60 bg-muted/10 px-3 py-2 text-sm font-medium text-foreground">
        {value}
      </div>
    </div>
  )
}
