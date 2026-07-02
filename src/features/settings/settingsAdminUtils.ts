import {
  ADMIN_PERMISSION_ACTIONS,
  ADMIN_PERMISSION_MODULES,
  JOB_SPECIAL_PERMISSIONS,
  SETTINGS_SPECIAL_PERMISSIONS,
  type PermissionAction,
  type PermissionModule,
  type RoleDefinition,
  type RolePermissions,
} from "./settingsTypes"

export const formatAdminDate = (date: string) => {
  if (date === "Never") return "Never"

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    return date
  }

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export const getAdminInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

export const createEmptyRolePermissions = (): RolePermissions => ({
  matrix: Object.fromEntries(
    ADMIN_PERMISSION_MODULES.map((module) => [
      module,
      Object.fromEntries(ADMIN_PERMISSION_ACTIONS.map((action) => [action, false])),
    ])
  ) as Record<PermissionModule, Record<PermissionAction, boolean>>,
  jobs: Object.fromEntries(JOB_SPECIAL_PERMISSIONS.map((permission) => [permission, false])) as RolePermissions["jobs"],
  settings: Object.fromEntries(SETTINGS_SPECIAL_PERMISSIONS.map((permission) => [permission, false])) as RolePermissions["settings"],
})

export const countRolePermissions = (role: RoleDefinition) => {
  const matrixCount = Object.values(role.permissions.matrix).reduce(
    (total, permissions) => total + Object.values(permissions).filter(Boolean).length,
    0
  )
  const jobsCount = Object.values(role.permissions.jobs).filter(Boolean).length
  const settingsCount = Object.values(role.permissions.settings).filter(Boolean).length

  return matrixCount + jobsCount + settingsCount
}

export const getRoleAssignedModules = (role: RoleDefinition) =>
  ADMIN_PERMISSION_MODULES.filter((module) =>
    Object.values(role.permissions.matrix[module]).some(Boolean)
  )

export const getRelativeLastLogin = (lastLogin: string) => {
  if (lastLogin === "Never") return "Never"

  const parsed = new Date(lastLogin)
  if (Number.isNaN(parsed.getTime())) return lastLogin

  const diffMs = Date.now() - parsed.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return formatAdminDate(lastLogin)
}
