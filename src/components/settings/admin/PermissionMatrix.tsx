import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ADMIN_PERMISSION_ACTIONS,
  ADMIN_PERMISSION_MODULES,
  JOB_SPECIAL_PERMISSIONS,
  SETTINGS_SPECIAL_PERMISSIONS,
  type JobSpecialPermission,
  type PermissionAction,
  type PermissionModule,
  type RolePermissions,
  type SettingsSpecialPermission,
} from "@/features/settings/settingsTypes"

interface PermissionMatrixProps {
  value: RolePermissions
  onChange?: (next: RolePermissions) => void
  readOnly?: boolean
}

function PermissionToggle({
  checked,
  onClick,
  label,
  readOnly,
}: {
  checked: boolean
  onClick: () => void
  label: string
  readOnly?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={readOnly}
      aria-pressed={checked}
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-lg border px-2 text-[11px] font-medium transition-all duration-200",
        checked
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border/70 bg-muted/10 text-muted-foreground",
        !readOnly && "hover:border-primary/30 hover:bg-primary/5",
        readOnly && "cursor-default"
      )}
      title={label}
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className={cn(
            "flex h-3.5 w-3.5 items-center justify-center rounded border",
            checked ? "border-primary bg-primary text-primary-foreground" : "border-border/70"
          )}
        >
          {checked && <Check className="w-3 h-3" />}
        </span>
      </span>
    </button>
  )
}

export function PermissionMatrix({ value, onChange, readOnly }: PermissionMatrixProps) {
  const updateMatrix = (module: PermissionModule, action: PermissionAction) => {
    if (!onChange || readOnly) return
    onChange({
      ...value,
      matrix: {
        ...value.matrix,
        [module]: {
          ...value.matrix[module],
          [action]: !value.matrix[module][action],
        },
      },
    })
  }

  const updateJobsSpecial = (permission: JobSpecialPermission) => {
    if (!onChange || readOnly) return
    onChange({
      ...value,
      jobs: {
        ...value.jobs,
        [permission]: !value.jobs[permission],
      },
    })
  }

  const updateSettingsSpecial = (permission: SettingsSpecialPermission) => {
    if (!onChange || readOnly) return
    onChange({
      ...value,
      settings: {
        ...value.settings,
        [permission]: !value.settings[permission],
      },
    })
  }

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="bg-muted/30 border-b border-border/50 text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Module</th>
              {ADMIN_PERMISSION_ACTIONS.map((action) => (
                <th key={action} className="px-2 py-3 text-center font-semibold">
                  {action}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {ADMIN_PERMISSION_MODULES.map((module) => (
              <tr key={module} className="hover:bg-muted/10 transition-colors">
                <td className="px-4 py-3 text-sm font-semibold text-foreground">{module}</td>
                {ADMIN_PERMISSION_ACTIONS.map((action) => (
                  <td key={action} className="px-2 py-3 text-center">
                    <PermissionToggle
                      checked={value.matrix[module][action]}
                      onClick={() => updateMatrix(module, action)}
                      label={`${module} ${action}`}
                      readOnly={readOnly}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Jobs Special Permissions</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Additional actions for incoming job applications.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {JOB_SPECIAL_PERMISSIONS.map((permission) => (
              <PermissionToggle
                key={permission}
                checked={value.jobs[permission]}
                onClick={() => updateJobsSpecial(permission)}
                label={permission}
                readOnly={readOnly}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Settings Access</h4>
            <p className="text-xs text-muted-foreground mt-0.5">Control which settings panels this role can manage.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SETTINGS_SPECIAL_PERMISSIONS.map((permission) => (
              <PermissionToggle
                key={permission}
                checked={value.settings[permission]}
                onClick={() => updateSettingsSpecial(permission)}
                label={permission}
                readOnly={readOnly}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
