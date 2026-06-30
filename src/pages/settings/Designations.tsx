import { useState } from "react"
import { Briefcase, Plus, Edit2, Trash2 } from "lucide-react"
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
import { selectDepartments, selectDesignations } from "@/features/settings/settingsSelectors"
import { addDesignation, updateDesignation, deleteDesignation } from "@/features/settings/settingsSlice"
import type { Designation } from "@/features/settings/settingsTypes"

export default function Designations() {
  const dispatch = useAppDispatch()
  const departments = useAppSelector(selectDepartments)
  const designations = useAppSelector(selectDesignations)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Designation | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    departmentId: "",
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

    if (!formData.name.trim()) errors.name = "Designation name is required"
    if (!formData.departmentId) errors.departmentId = "Department is required"

    const existingName = designations.find(
      (d) =>
        d.name.toLowerCase() === formData.name.toLowerCase() &&
        d.departmentId === formData.departmentId &&
        d.id !== editingDesignation?.id
    )
    if (existingName) errors.name = "Designation must be unique within department"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAdd = () => {
    setEditingDesignation(null)
    setFormData({ name: "", departmentId: "" })
    setValidationErrors({})
    setIsDialogOpen(true)
  }

  const handleEdit = (designation: Designation) => {
    setEditingDesignation(designation)
    setFormData({
      name: designation.name,
      departmentId: designation.departmentId,
    })
    setValidationErrors({})
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!validateForm()) return

    const department = departments.find((d) => d.id === formData.departmentId)

    if (editingDesignation) {
      dispatch(
        updateDesignation({
          ...editingDesignation,
          name: formData.name,
          departmentId: formData.departmentId,
          departmentName: department?.name || "",
        })
      )
    } else {
      const ids = designations.map((d) => parseInt(d.id.replace("DES-", ""), 10))
      const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 1
      dispatch(
        addDesignation({
          id: `DES-${String(nextIdNum).padStart(3, "0")}`,
          name: formData.name,
          departmentId: formData.departmentId,
          departmentName: department?.name || "",
        })
      )
    }

    setIsDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteDesignation(deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  const groupedDesignations = departments.map((dept) => ({
    ...dept,
    designations: designations.filter((d) => d.departmentId === dept.id),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Designations</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage job titles and roles within departments.
          </p>
        </div>
        <Button size="sm" onClick={handleAdd} className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Designation
        </Button>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
        <CardContent className="p-6">
          {groupedDesignations.map((dept) => (
            <div key={dept.id} className="mb-6 last:mb-0">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-foreground">{dept.name}</h3>
                <Badge variant="outline" className="text-[10px] bg-muted/30">
                  {dept.designations.length} roles
                </Badge>
              </div>
              {dept.designations.length === 0 ? (
                <p className="text-xs text-muted-foreground italic pl-4">No designations</p>
              ) : (
                <div className="space-y-2 pl-4">
                  {dept.designations.map((designation) => (
                    <div
                      key={designation.id}
                      className="flex items-center justify-between p-3 bg-muted/10 border border-border/60 rounded-lg hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-medium text-foreground">{designation.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(designation)}
                          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(designation)}
                          className="h-8 w-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-panel max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingDesignation ? "Edit Designation" : "Add Designation"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingDesignation ? "Update designation information" : "Create a new designation"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Designation Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer"
                className="bg-muted/10 border-border/80 rounded-lg text-xs"
              />
              {validationErrors.name && (
                <p className="text-[10px] text-destructive">{validationErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Department
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {validationErrors.departmentId && (
                <p className="text-[10px] text-destructive">{validationErrors.departmentId}</p>
              )}
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
              {editingDesignation ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="glass-panel max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Designation</DialogTitle>
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
