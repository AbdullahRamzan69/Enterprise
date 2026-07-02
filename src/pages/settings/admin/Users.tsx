import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Eye,
  KeyRound,
  Mail,
  Search,
  ShieldCheck,
  Trash2,
  UserMinus,
  UserPlus,
  Users as UsersIcon,
  UserRoundCheck,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AdminActionButton } from "@/components/settings/admin/AdminActionButton"
import { AdminEmptyState } from "@/components/settings/admin/AdminEmptyState"
import { AdminLoadingState } from "@/components/settings/admin/AdminLoadingState"
import { AdminStatCard } from "@/components/settings/admin/AdminStatCard"
import { AdminStatusBadge } from "@/components/settings/admin/AdminStatusBadge"
import { ConfirmationDialog } from "@/components/settings/admin/ConfirmationDialog"
import { MockToast } from "@/components/settings/admin/MockToast"
import { UserFormDialog } from "@/components/settings/admin/UserFormDialog"
import {
  deactivateAdminUser,
  deleteAdminUser,
  inviteAdminUser,
  updateAdminUser,
} from "@/features/settings/settingsSlice"
import {
  selectAdminUserCountByStatus,
  selectAdminUsers,
  selectDepartments,
  selectRoles,
} from "@/features/settings/settingsSelectors"
import { formatAdminDate, getAdminInitials, getRelativeLastLogin } from "@/features/settings/settingsAdminUtils"
import type { AdminUser } from "@/features/settings/settingsTypes"

const ITEMS_PER_PAGE = 8

type SortOption = "Newest" | "Oldest" | "Recently Active"

export default function SettingsUsers() {
  const dispatch = useAppDispatch()
  const users = useAppSelector(selectAdminUsers)
  const roles = useAppSelector(selectRoles)
  const departments = useAppSelector(selectDepartments)
  const activeUsers = useAppSelector((state) => selectAdminUserCountByStatus(state, "Active"))
  const inactiveUsers = useAppSelector((state) => selectAdminUserCountByStatus(state, "Inactive"))
  const pendingInvitations = useAppSelector((state) => selectAdminUserCountByStatus(state, "Pending"))

  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortBy, setSortBy] = useState<SortOption>("Newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null)
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<AdminUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 500)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!toastMessage) return
    const timer = window.setTimeout(() => setToastMessage(null), 2200)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  const roleMap = useMemo(() => Object.fromEntries(roles.map((role) => [role.id, role])), [roles])
  const roleOptions = useMemo(() => ["All", ...roles.map((role) => role.name)], [roles])
  const departmentOptions = useMemo(
    () => ["All", ...departments.map((department) => department.name)],
    [departments]
  )

  const filteredUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const roleName = roleMap[user.roleId]?.name ?? "Unassigned"
      const query = searchTerm.toLowerCase()
      const matchesSearch =
        !query ||
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.employeeId.toLowerCase().includes(query)

      const matchesRole = roleFilter === "All" || roleName === roleFilter
      const matchesDepartment = departmentFilter === "All" || user.department === departmentFilter
      const matchesStatus = statusFilter === "All" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus
    })

    return filtered.sort((a, b) => {
      if (sortBy === "Newest") return b.createdAt.localeCompare(a.createdAt)
      if (sortBy === "Oldest") return a.createdAt.localeCompare(b.createdAt)
      return b.lastLogin.localeCompare(a.lastLogin)
    })
  }, [users, roleMap, searchTerm, roleFilter, departmentFilter, statusFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  const handleInviteUser = (values: {
    fullName: string
    email: string
    department: string
    roleId: string
    employmentType: AdminUser["employmentType"]
    status: AdminUser["status"]
    phone: string
  }) => {
    const ids = users.map((user) => parseInt(user.id.replace("USR-", ""), 10)).filter((id) => !Number.isNaN(id))
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1
    const employeeIds = users.map((user) => parseInt(user.employeeId.replace("EMP-", ""), 10)).filter((id) => !Number.isNaN(id))
    const nextEmployeeId = employeeIds.length > 0 ? Math.max(...employeeIds) + 1 : 141

    dispatch(
      inviteAdminUser({
        id: `USR-${String(nextId).padStart(3, "0")}`,
        employeeId: `EMP-${String(nextEmployeeId).padStart(3, "0")}`,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        department: values.department,
        designation: values.department === "HR" ? "People Operations Specialist" : `${values.department} Associate`,
        roleId: values.roleId,
        status: values.status,
        employmentType: values.employmentType,
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: values.status === "Pending" ? "Never" : `${todayLoginStamp()}`,
        avatar: "",
        assignedModules: [],
        permissionsSummary: [],
        recentActions: ["Invitation created", "Awaiting first sign-in", "Role assigned"],
        activityTimeline: [],
      })
    )

    setInviteOpen(false)
    setToastMessage("Invitation sent successfully.")
  }

  const handleEditUser = (values: {
    fullName: string
    email: string
    department: string
    roleId: string
    employmentType: AdminUser["employmentType"]
    status: AdminUser["status"]
    phone: string
  }) => {
    if (!editTarget) return

    dispatch(
      updateAdminUser({
        ...editTarget,
        fullName: values.fullName,
        email: values.email,
        department: values.department,
        roleId: values.roleId,
        employmentType: values.employmentType,
        status: values.status,
        phone: values.phone,
      })
    )

    setEditTarget(null)
    setToastMessage("User details updated.")
  }

  const resetFilters = () => {
    setSearchTerm("")
    setRoleFilter("All")
    setDepartmentFilter("All")
    setStatusFilter("All")
    setSortBy("Newest")
    setCurrentPage(1)
  }

  if (isLoading) {
    return <AdminLoadingState />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Users</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage employee accounts, assign roles, and control system access.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AdminStatCard title="Total Users" value={users.length} trend="+6%" description="across all departments" icon={<UsersIcon className="w-4 h-4 text-blue-500" />} accentClassName="bg-blue-500/10 text-blue-500" />
        <AdminStatCard title="Active Users" value={activeUsers} trend="Live" description="currently enabled accounts" icon={<UserRoundCheck className="w-4 h-4 text-emerald-500" />} accentClassName="bg-emerald-500/10 text-emerald-500" />
        <AdminStatCard title="Inactive Users" value={inactiveUsers} trend="Review" description="disabled or idle accounts" icon={<UserMinus className="w-4 h-4 text-zinc-500" />} accentClassName="bg-zinc-500/10 text-zinc-500" />
        <AdminStatCard title="Pending Invitations" value={pendingInvitations} trend="Awaiting" description="users yet to activate access" icon={<Mail className="w-4 h-4 text-amber-500" />} accentClassName="bg-amber-500/10 text-amber-500" />
      </div>

      <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search Users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 bg-muted/20 border-border/80 rounded-lg text-sm"
              />
            </div>
            <Button onClick={() => setInviteOpen(true)} className="rounded-lg text-xs">
              <UserPlus className="w-4 h-4 mr-1.5" />
              Invite User
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1) }} className="flex h-8.5 w-full rounded-lg border border-border/80 bg-muted/10 px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring">
              {roleOptions.map((role) => <option key={role} value={role}>Role: {role}</option>)}
            </select>
            <select value={departmentFilter} onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1) }} className="flex h-8.5 w-full rounded-lg border border-border/80 bg-muted/10 px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring">
              {departmentOptions.map((department) => <option key={department} value={department}>Department: {department}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }} className="flex h-8.5 w-full rounded-lg border border-border/80 bg-muted/10 px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring">
              {["All", "Active", "Inactive", "Pending", "Suspended"].map((status) => <option key={status} value={status}>Status: {status}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1) }} className="flex h-8.5 w-full rounded-lg border border-border/80 bg-muted/10 px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring">
              {(["Newest", "Oldest", "Recently Active"] as SortOption[]).map((sort) => <option key={sort} value={sort}>Sort: {sort}</option>)}
            </select>
            <Button variant="outline" onClick={resetFilters} className="rounded-lg text-xs">Reset Filters</Button>
          </div>
        </CardContent>
      </Card>

      {users.length === 0 ? (
        <AdminEmptyState title="No Users" description="User accounts will appear here once they are provisioned for the organization." />
      ) : filteredUsers.length === 0 ? (
        <AdminEmptyState title="No Search Results" description="Try changing your filters or searching with a different name, email, or employee ID." />
      ) : (
        <>
          <Card className="glass-card shadow-sm border border-border/60 rounded-xl overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Employee ID</th>
                    <th className="py-3 px-4 hidden lg:table-cell">Department</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 hidden xl:table-cell">Last Login</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-xs">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-10 w-10 border border-border/60 shadow-sm">
                            <AvatarImage src={user.avatar} alt={user.fullName} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                              {getAdminInitials(user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{user.fullName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">{user.employeeId}</td>
                      <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">{user.department}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-foreground">{roleMap[user.roleId]?.name ?? "Unassigned"}</p>
                          <p className="text-[10px] text-muted-foreground">{user.designation}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4"><AdminStatusBadge status={user.status} /></td>
                      <td className="py-3 px-4 hidden xl:table-cell text-muted-foreground">
                        <div>
                          <p>{getRelativeLastLogin(user.lastLogin)}</p>
                          <p className="text-[10px] text-muted-foreground/70">{formatAdminDate(user.lastLogin)}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/settings/users/${user.id}`}><AdminActionButton label="View" icon={<Eye className="w-4 h-4" />} /></Link>
                          <AdminActionButton label="Edit" icon={<ShieldCheck className="w-4 h-4" />} onClick={() => setEditTarget(user)} />
                          <AdminActionButton label="Reset Password" icon={<KeyRound className="w-4 h-4" />} onClick={() => setResetTarget(user)} />
                          <AdminActionButton label="Deactivate" icon={<UserMinus className="w-4 h-4" />} onClick={() => setDeactivateTarget(user)} destructive />
                          <AdminActionButton label="Delete" icon={<Trash2 className="w-4 h-4" />} onClick={() => setDeleteTarget(user)} destructive />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginatedUsers.map((user) => (
              <Card key={user.id} className="glass-card shadow-sm border border-border/60 rounded-xl hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 border border-border/60 shadow-sm">
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">{getAdminInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <AdminStatusBadge status={user.status} className="shrink-0" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><p className="text-muted-foreground">Employee ID</p><p className="font-medium text-foreground mt-1">{user.employeeId}</p></div>
                    <div><p className="text-muted-foreground">Role</p><p className="font-medium text-foreground mt-1">{roleMap[user.roleId]?.name ?? "Unassigned"}</p></div>
                    <div><p className="text-muted-foreground">Department</p><p className="font-medium text-foreground mt-1">{user.department}</p></div>
                    <div><p className="text-muted-foreground">Last Login</p><p className="font-medium text-foreground mt-1">{getRelativeLastLogin(user.lastLogin)}</p></div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link to={`/settings/users/${user.id}`}><AdminActionButton label="View" icon={<Eye className="w-4 h-4" />} /></Link>
                    <AdminActionButton label="Edit" icon={<ShieldCheck className="w-4 h-4" />} onClick={() => setEditTarget(user)} />
                    <AdminActionButton label="Reset Password" icon={<KeyRound className="w-4 h-4" />} onClick={() => setResetTarget(user)} />
                    <AdminActionButton label="Deactivate" icon={<UserMinus className="w-4 h-4" />} onClick={() => setDeactivateTarget(user)} destructive />
                    <AdminActionButton label="Delete" icon={<Trash2 className="w-4 h-4" />} onClick={() => setDeleteTarget(user)} destructive />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, totalPages) - 1))} disabled={safeCurrentPage === 1} className="rounded-lg border-border/80 text-xs">Previous</Button>
              <div className="text-xs font-medium text-muted-foreground px-2">Page {safeCurrentPage} of {totalPages}</div>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.min(totalPages, Math.min(page, totalPages) + 1))} disabled={safeCurrentPage === totalPages} className="rounded-lg border-border/80 text-xs">Next</Button>
            </div>
          </div>
        </>
      )}

      <UserFormDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        mode="invite"
        departments={departmentOptions.filter((item) => item !== "All")}
        roles={roles}
        onSubmit={handleInviteUser}
      />

      <UserFormDialog
        open={editTarget !== null}
        onOpenChange={(open) => !open && setEditTarget(null)}
        mode="edit"
        initialUser={editTarget}
        departments={departmentOptions.filter((item) => item !== "All")}
        roles={roles}
        onSubmit={handleEditUser}
      />

      <ConfirmationDialog
        open={resetTarget !== null}
        onOpenChange={(open) => !open && setResetTarget(null)}
        title="Reset Password"
        description={resetTarget ? `Send a password reset prompt for ${resetTarget.fullName}?` : "Reset password?"}
        confirmLabel="Reset Password"
        onConfirm={() => {
          setResetTarget(null)
          setToastMessage("Password reset prompt sent.")
        }}
      />

      <ConfirmationDialog
        open={deactivateTarget !== null}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title="Deactivate User"
        description={deactivateTarget ? `Are you sure you want to deactivate ${deactivateTarget.fullName}?` : "Deactivate user?"}
        confirmLabel="Deactivate"
        destructive
        onConfirm={() => {
          if (deactivateTarget) {
            dispatch(deactivateAdminUser(deactivateTarget.id))
            setToastMessage("User account deactivated.")
          }
          setDeactivateTarget(null)
        }}
      />

      <ConfirmationDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete User"
        description={deleteTarget ? `Delete ${deleteTarget.fullName}'s account? This action cannot be undone.` : "Delete user?"}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleteTarget) {
            dispatch(deleteAdminUser(deleteTarget.id))
            setToastMessage("User account deleted.")
          }
          setDeleteTarget(null)
        }}
      />

      {toastMessage && <MockToast message={toastMessage} />}
    </div>
  )
}

function todayLoginStamp() {
  return `${new Date().toISOString().split("T")[0]} 09:00`
}
