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
import { PermissionMatrix } from "@/components/settings/admin/PermissionMatrix"
import type { RoleDefinition, RoleKind, RolePermissions } from "@/features/settings/settingsTypes"

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initialRole?: RoleDefinition | null
  emptyPermissions: RolePermissions
  onSubmit: (values: {
    name: string
    description: string
    kind: RoleKind
    permissionGroups: string[]
    permissions: RolePermissions
  }) => void
}

export function RoleFormDialog({
  open,
  onOpenChange,
  mode,
  initialRole,
  emptyPermissions,
  onSubmit,
}: RoleFormDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [kind, setKind] = useState<RoleKind>("Custom")
  const [permissionGroups, setPermissionGroups] = useState("Administration")
  const [permissions, setPermissions] = useState<RolePermissions>(emptyPermissions)

  useEffect(() => {
    if (mode === "edit" && initialRole) {
      setName(initialRole.name)
      setDescription(initialRole.description)
      setKind(initialRole.kind)
      setPermissionGroups(initialRole.permissionGroups.join(", "))
      setPermissions(initialRole.permissions)
      return
    }

    setName("")
    setDescription("")
    setKind("Custom")
    setPermissionGroups("Administration")
    setPermissions(emptyPermissions)
  }, [mode, initialRole, emptyPermissions, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel max-w-6xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">{mode === "create" ? "Create Role" : "Edit Role"}</DialogTitle>
          <DialogDescription className="text-xs">
            Configure role metadata and assign module-level permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Role Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-muted/10 border-border/80 rounded-lg text-xs" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Role Type</label>
              <select value={kind} onChange={(e) => setKind(e.target.value as RoleKind)} className="flex h-8.5 w-full rounded-lg border border-border/80 bg-muted/10 px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring">
                <option value="System">System</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Permission Groups</label>
              <Input value={permissionGroups} onChange={(e) => setPermissionGroups(e.target.value)} placeholder="Administration, Reporting" className="bg-muted/10 border-border/80 rounded-lg text-xs" />
            </div>
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-border/80 bg-muted/10 px-3 py-2 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring" />
            </div>
          </div>

          <PermissionMatrix value={permissions} onChange={setPermissions} />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg text-xs">Cancel</Button>
          <Button
            onClick={() =>
              onSubmit({
                name,
                description,
                kind,
                permissionGroups: permissionGroups.split(",").map((item) => item.trim()).filter(Boolean),
                permissions,
              })
            }
            className="rounded-lg text-xs"
          >
            {mode === "create" ? "Create Role" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
