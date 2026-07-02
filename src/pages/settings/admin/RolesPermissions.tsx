import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Copy,
  Eye,
  KeyRound,
  PencilLine,
  Search,
  Shield,
  ShieldCheck,
  ShieldPlus,
  Trash2,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AdminActionButton } from "@/components/settings/admin/AdminActionButton"
import { AdminEmptyState } from "@/components/settings/admin/AdminEmptyState"
import { AdminLoadingState } from "@/components/settings/admin/AdminLoadingState"
import { AdminStatCard } from "@/components/settings/admin/AdminStatCard"
import { ConfirmationDialog } from "@/components/settings/admin/ConfirmationDialog"
import { MockToast } from "@/components/settings/admin/MockToast"
import { RoleFormDialog } from "@/components/settings/admin/RoleFormDialog"
import {
  addRoleDefinition,
  deleteRoleDefinition,
  duplicateRoleDefinition,
  updateRoleDefinition,
} from "@/features/settings/settingsSlice"
import {
  selectAdminUsers,
  selectCustomRolesCount,
  selectPermissionGroupsCount,
  selectRoles,
  selectSystemRolesCount,
  selectTotalRolesCount,
} from "@/features/settings/settingsSelectors"
import { countRolePermissions, createEmptyRolePermissions, formatAdminDate } from "@/features/settings/settingsAdminUtils"
import type { RoleDefinition } from "@/features/settings/settingsTypes"

const ITEMS_PER_PAGE = 8

type SortOption = "Newest" | "Oldest"

export default function SettingsRolesPermissions() {
  const dispatch = useAppDispatch()
  const roles = useAppSelector(selectRoles)
  const users = useAppSelector(selectAdminUsers)
  const totalRoles = useAppSelector(selectTotalRolesCount)
  const customRoles = useAppSelector(selectCustomRolesCount)
  const systemRoles = useAppSelector(selectSystemRolesCount)
  const permissionGroups = useAppSelector(selectPermissionGroupsCount)

  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("Newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<RoleDefinition | null>(null)
  const [duplicateTarget, setDuplicateTarget] = useState<RoleDefinition | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<RoleDefinition | null>(null)
  const [systemDeleteError, setSystemDeleteError] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 500)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!toastMessage) return
    const timer = window.setTimeout(() => setToastMessage(null), 2200)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  const filteredRoles = useMemo(() => {
    const filtered = roles.filter((role) => {
      const query = searchTerm.toLowerCase()
      return (
        !query ||
        role.name.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query)
      )
    })

    return filtered.sort((a, b) =>
      sortBy === "Newest"
        ? b.createdDate.localeCompare(a.createdDate)
        : a.createdDate.localeCompare(b.createdDate)
    )
  }, [roles, searchTerm, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedRoles = filteredRoles.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  const userCountByRole = useMemo(
    () => Object.fromEntries(roles.map((role) => [role.id, users.filter((user) => user.roleId === role.id).length])),
    [roles, users]
  )

  if (isLoading) {
    return <AdminLoadingState />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Roles & Permissions</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage system roles and module access permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard title="Total Roles" value={totalRoles} trend="Stable" description="configured access profiles" icon={<Shield className="w-4 h-4 text-blue-500" />} accentClassName="bg-blue-500/10 text-blue-500" />
        <AdminStatCard title="Custom Roles" value={customRoles} trend="Flexible" description="roles tailored to operations" icon={<ShieldPlus className="w-4 h-4 text-violet-500" />} accentClassName="bg-violet-500/10 text-violet-500" />
        <AdminStatCard title="System Roles" value={systemRoles} trend="Core" description="default enterprise access tiers" icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />} accentClassName="bg-emerald-500/10 text-emerald-500" />
        <AdminStatCard title="Permission Groups" value={permissionGroups} trend="Coverage" description="logical policy groupings" icon={<KeyRound className="w-4 h-4 text-amber-500" />} accentClassName="bg-amber-500/10 text-amber-500" />
      </div>

      <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_auto] gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 bg-muted/20 border-border/80 rounded-lg text-sm"
              />
            </div>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1) }} className="flex h-8.5 w-full rounded-lg border border-border/80 bg-muted/10 px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring">
              <option value="Newest">Sort: Newest</option>
              <option value="Oldest">Sort: Oldest</option>
            </select>
            <Button onClick={() => setCreateOpen(true)} className="rounded-lg text-xs">
              <ShieldPlus className="w-4 h-4 mr-1.5" />
              Create Role
            </Button>
          </div>
        </CardContent>
      </Card>

      {roles.length === 0 ? (
        <AdminEmptyState title="No Roles" description="Create access roles to control module visibility and permissions across the system." />
      ) : filteredRoles.length === 0 ? (
        <AdminEmptyState title="No Search Results" description="Try searching by a different role name or clear the filter criteria." />
      ) : (
        <>
          <Card className="glass-card shadow-sm border border-border/60 rounded-xl overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Role Name</th>
                    <th className="py-3 px-4 hidden lg:table-cell">Description</th>
                    <th className="py-3 px-4">Users Assigned</th>
                    <th className="py-3 px-4">Permissions Count</th>
                    <th className="py-3 px-4 hidden xl:table-cell">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-xs">
                  {paginatedRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{role.name}</p>
                          <p className="text-[10px] text-muted-foreground">{role.kind} role</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground max-w-md">{role.description}</td>
                      <td className="py-3 px-4 font-semibold text-foreground">{userCountByRole[role.id] ?? 0}</td>
                      <td className="py-3 px-4 text-muted-foreground">{countRolePermissions(role)}</td>
                      <td className="py-3 px-4 hidden xl:table-cell text-muted-foreground">{formatAdminDate(role.createdDate)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/settings/roles-permissions/${role.id}`}><AdminActionButton label="View" icon={<Eye className="w-4 h-4" />} /></Link>
                          <AdminActionButton label="Edit" icon={<PencilLine className="w-4 h-4" />} onClick={() => setEditTarget(role)} />
                          <AdminActionButton label="Duplicate" icon={<Copy className="w-4 h-4" />} onClick={() => setDuplicateTarget(role)} />
                          <AdminActionButton label="Delete" icon={<Trash2 className="w-4 h-4" />} destructive onClick={() => role.name === "Super Admin" ? setSystemDeleteError(true) : setDeleteTarget(role)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginatedRoles.map((role) => (
              <Card key={role.id} className="glass-card shadow-sm border border-border/60 rounded-xl hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{role.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{role.description}</p>
                    </div>
                    <span className="rounded-full bg-muted/30 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">{role.kind}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><p className="text-muted-foreground">Users Assigned</p><p className="font-medium text-foreground mt-1">{userCountByRole[role.id] ?? 0}</p></div>
                    <div><p className="text-muted-foreground">Permissions</p><p className="font-medium text-foreground mt-1">{countRolePermissions(role)}</p></div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link to={`/settings/roles-permissions/${role.id}`}><AdminActionButton label="View" icon={<Eye className="w-4 h-4" />} /></Link>
                    <AdminActionButton label="Edit" icon={<PencilLine className="w-4 h-4" />} onClick={() => setEditTarget(role)} />
                    <AdminActionButton label="Duplicate" icon={<Copy className="w-4 h-4" />} onClick={() => setDuplicateTarget(role)} />
                    <AdminActionButton label="Delete" icon={<Trash2 className="w-4 h-4" />} destructive onClick={() => role.name === "Super Admin" ? setSystemDeleteError(true) : setDeleteTarget(role)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredRoles.length)} of {filteredRoles.length} roles
            </p>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, totalPages) - 1))} disabled={safeCurrentPage === 1} className="rounded-lg border-border/80 text-xs">Previous</Button>
              <div className="text-xs font-medium text-muted-foreground px-2">Page {safeCurrentPage} of {totalPages}</div>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.min(totalPages, Math.min(page, totalPages) + 1))} disabled={safeCurrentPage === totalPages} className="rounded-lg border-border/80 text-xs">Next</Button>
            </div>
          </div>
        </>
      )}

      <RoleFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        emptyPermissions={createEmptyRolePermissions()}
        onSubmit={(values) => {
          const ids = roles.map((role) => parseInt(role.id.replace("ROLE-", ""), 10)).filter((id) => !Number.isNaN(id))
          const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 11
          dispatch(addRoleDefinition({
            id: `ROLE-${String(nextId).padStart(3, "0")}`,
            name: values.name,
            description: values.description,
            kind: values.kind,
            createdBy: "Alex Mercer",
            createdDate: new Date().toISOString().split("T")[0],
            lastModified: new Date().toISOString().split("T")[0],
            permissionGroups: values.permissionGroups,
            permissions: values.permissions,
          }))
          setCreateOpen(false)
          setToastMessage("Role created successfully.")
        }}
      />

      <RoleFormDialog
        open={editTarget !== null}
        onOpenChange={(open) => !open && setEditTarget(null)}
        mode="edit"
        initialRole={editTarget}
        emptyPermissions={createEmptyRolePermissions()}
        onSubmit={(values) => {
          if (!editTarget) return
          dispatch(updateRoleDefinition({ ...editTarget, ...values, lastModified: new Date().toISOString().split("T")[0] }))
          setEditTarget(null)
          setToastMessage("Role updated successfully.")
        }}
      />

      <ConfirmationDialog
        open={duplicateTarget !== null}
        onOpenChange={(open) => !open && setDuplicateTarget(null)}
        title="Duplicate Role"
        description={duplicateTarget ? `Create a copy of ${duplicateTarget.name}?` : "Duplicate role?"}
        confirmLabel="Duplicate"
        onConfirm={() => {
          if (!duplicateTarget) return
          const ids = roles.map((role) => parseInt(role.id.replace("ROLE-", ""), 10)).filter((id) => !Number.isNaN(id))
          const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 11
          dispatch(duplicateRoleDefinition({
            ...duplicateTarget,
            id: `ROLE-${String(nextId).padStart(3, "0")}`,
            name: `${duplicateTarget.name} Copy`,
            kind: "Custom",
            createdBy: "Alex Mercer",
            createdDate: new Date().toISOString().split("T")[0],
            lastModified: new Date().toISOString().split("T")[0],
          }))
          setDuplicateTarget(null)
          setToastMessage("Role duplicated successfully.")
        }}
      />

      <ConfirmationDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Role"
        description={deleteTarget ? `Delete the ${deleteTarget.name} role? Assigned users will fall back to Viewer access.` : "Delete role?"}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) {
            dispatch(deleteRoleDefinition(deleteTarget.id))
            setToastMessage("Role deleted successfully.")
          }
          setDeleteTarget(null)
        }}
      />

      <ConfirmationDialog
        open={systemDeleteError}
        onOpenChange={setSystemDeleteError}
        title="Role Protected"
        description="The Super Admin role cannot be deleted."
        confirmLabel="Understood"
        onConfirm={() => setSystemDeleteError(false)}
      />

      {toastMessage && <MockToast message={toastMessage} />}
    </div>
  )
}
