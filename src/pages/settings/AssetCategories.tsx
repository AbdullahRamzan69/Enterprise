import { useState } from "react"
import { Package, Plus, Edit2, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { selectAssetCategories } from "@/features/settings/settingsSelectors"
import { addAssetCategory, updateAssetCategory, deleteAssetCategory } from "@/features/settings/settingsSlice"
import type { AssetCategory } from "@/features/settings/settingsTypes"

export default function AssetCategories() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectAssetCategories)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AssetCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AssetCategory | null>(null)
  const [formData, setFormData] = useState({ name: "" })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData({ name: value })
    if (validationErrors.name) {
      setValidationErrors({})
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) errors.name = "Category name is required"

    const existingName = categories.find(
      (c) => c.name.toLowerCase() === formData.name.toLowerCase() && c.id !== editingCategory?.id
    )
    if (existingName) errors.name = "Category name must be unique"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setFormData({ name: "" })
    setValidationErrors({})
    setIsDialogOpen(true)
  }

  const handleEdit = (category: AssetCategory) => {
    setEditingCategory(category)
    setFormData({ name: category.name })
    setValidationErrors({})
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!validateForm()) return

    if (editingCategory) {
      dispatch(updateAssetCategory({ ...editingCategory, name: formData.name }))
    } else {
      const ids = categories.map((c) => parseInt(c.id.replace("ACAT-", ""), 10))
      const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 1
      dispatch(
        addAssetCategory({
          id: `ACAT-${String(nextIdNum).padStart(3, "0")}`,
          name: formData.name,
        })
      )
    }

    setIsDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteAssetCategory(deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Asset Categories</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage asset categories for inventory classification.
          </p>
        </div>
        <Button size="sm" onClick={handleAdd} className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Category
        </Button>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No asset categories configured yet.</p>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-muted/10 border border-border/60 rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{category.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                      className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(category)}
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
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingCategory ? "Update category name" : "Create a new asset category"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Category Name
              </label>
              <Input
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Laptop"
                className="bg-muted/10 border-border/80 rounded-lg text-xs"
              />
              {validationErrors.name && (
                <p className="text-[10px] text-destructive">{validationErrors.name}</p>
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
              {editingCategory ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="glass-panel max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Category</DialogTitle>
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
