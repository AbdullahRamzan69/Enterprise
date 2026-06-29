import { useState } from "react"
import { Users, Plus, Edit2, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { selectDepartments } from "@/features/settings/settingsSelectors"
import { selectEmployees as selectEmployeesFromEmployees } from "@/features/employees/employeeSelectors"
import { addDepartment, updateDepartment, deleteDepartment } from "@/features/settings/settingsSlice"
import type { Department } from "@/features/settings/settingsTypes"

export default function Departments() {
  const dispatch = useAppDispatch()
  const departments = useAppSelector(selectDepartments)
  const employees = useAppSelector(selectEmployeesFromEmployees)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    managerId: "",
    managerName: "",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) errors.name = "Department name is required"

    const existingName = departments.find(
      (d) => d.name.toLowerCase() === formData.name.toLowerCase() && d.id !== editingDepartment?.id
    )
    if (existingName) errors.name = "Department name must be unique"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAdd = () => {
    setEditingDepartment(null)
    setFormData({ name: "", managerId: "", managerName: "" })
    setValidationErrors({})
    setIsDialogOpen(true)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      managerId: department.managerId || "",
      managerName: department.managerName || "",
    })
    setValidationErrors({})
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!validateForm()) return

    const manager = employees.find((e) => e.id === formData.managerId)

    if (editingDepartment) {
      dispatch(
        updateDepartment({
          ...editingDepartment,
          name: formData.name,
          managerId: formData.managerId || undefined,
          managerName: manager?.fullName,
        })
      )
    } else {
      const ids = departments.map((d) => parseInt(d.id.replace("DEP-", ""), 10))
      const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 1
      dispatch(
        addDepartment({
          id: `DEP-${String(nextIdNum).padStart(3, "0")}`,
          name: formData.name,
          managerId: formData.managerId || undefined,
          managerName: manager?.fullName,
          employeeCount: 0,
        })
      )
    }

    setIsDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteDepartment(deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Departments</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage organizational departments and their managers.
          </p>
        </div>
        <Button size="sm" onClick={handleAdd} className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Department
        </Button>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
        <CardContent className="p-6">
          <div className="space-y-3">
            {departments.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No departments configured yet.</p>
              </div>
            ) : (
              departments.map((dept) => (
                <div
                  key={dept.id}
                  className="flex items-center justify-between p-4 bg-muted/10 border border-border/60 rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{dept.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {dept.managerName ? (
                          <span className="text-[10px] text-muted-foreground">
                            Manager: {dept.managerName}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic">No manager assigned</span>
                        )}
                        <Badge variant="outline" className="text-[10px] bg-muted/30">
                          {dept.employeeCount} employees
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(dept)}
                      className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(dept)}
                      className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-panel max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingDepartment ? "Edit Department" : "Add Department"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingDepartment ? "Update department information" : "Create a new department"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Department Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Engineering"
                className="bg-muted/10 border-border/80 rounded-lg text-xs"
              />
              {validationErrors.name && (
                <p className="text-[10px] text-destructive">{validationErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Manager
              </label>
              <select
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
                className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
              >
                <option value="">Select Manager (Optional)</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg"
            >
              {editingDepartment ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="glass-panel max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Department</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete <span className="font-bold text-foreground">{deleteTarget?.name}</span>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/95 text-destructive-foreground text-xs rounded-lg"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
