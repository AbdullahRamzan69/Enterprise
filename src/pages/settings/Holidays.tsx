import { useState } from "react"
import { Calendar, Plus, Edit2, Trash2, Clock } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { selectHolidays, selectUpcomingHolidays } from "@/features/settings/settingsSelectors"
import { addHoliday, updateHoliday, deleteHoliday } from "@/features/settings/settingsSlice"
import type { Holiday } from "@/features/settings/settingsTypes"

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const getHolidayTypeColor = (type: string) => {
  switch (type) {
    case "National":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "Regional":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20"
    case "Company":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    default:
      return "bg-muted/10 text-muted-foreground border-border/20"
  }
}

export default function Holidays() {
  const dispatch = useAppDispatch()
  const holidays = useAppSelector(selectHolidays)
  const upcomingHolidays = useAppSelector(selectUpcomingHolidays)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Holiday | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    description: "",
    type: "National" as Holiday["type"],
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

    if (!formData.name.trim()) errors.name = "Holiday name is required"
    if (!formData.date) errors.date = "Date is required"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAdd = () => {
    setEditingHoliday(null)
    setFormData({ name: "", date: "", description: "", type: "National" })
    setValidationErrors({})
    setIsDialogOpen(true)
  }

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday)
    setFormData({
      name: holiday.name,
      date: holiday.date,
      description: holiday.description,
      type: holiday.type,
    })
    setValidationErrors({})
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!validateForm()) return

    if (editingHoliday) {
      dispatch(updateHoliday({ ...editingHoliday, ...formData }))
    } else {
      const ids = holidays.map((h) => parseInt(h.id.replace("HOL-", ""), 10))
      const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 1
      dispatch(
        addHoliday({
          id: `HOL-${String(nextIdNum).padStart(3, "0")}`,
          ...formData,
        })
      )
    }

    setIsDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteHoliday(deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  const sortedHolidays = [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Holidays</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage company holidays and time-off calendar.
          </p>
        </div>
        <Button size="sm" onClick={handleAdd} className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Holiday
        </Button>
      </div>

      {/* Upcoming Holidays Widget */}
      {upcomingHolidays.length > 0 && (
        <Card className="glass-card shadow-sm border border-border/60 rounded-xl bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="border-b border-border/50 pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Upcoming Holidays
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {upcomingHolidays.slice(0, 3).map((holiday) => (
                <div key={holiday.id} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{holiday.name}</span>
                  <span className="text-muted-foreground">{formatDate(holiday.date)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
        <CardContent className="p-6">
          <div className="space-y-3">
            {sortedHolidays.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No holidays configured yet.</p>
              </div>
            ) : (
              sortedHolidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center justify-between p-4 bg-muted/10 border border-border/60 rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{holiday.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">{formatDate(holiday.date)}</span>
                        <Badge variant="outline" className={getHolidayTypeColor(holiday.type)}>
                          {holiday.type}
                        </Badge>
                      </div>
                      {holiday.description && (
                        <p className="text-[10px] text-muted-foreground mt-1">{holiday.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(holiday)}
                      className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(holiday)}
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
              {editingHoliday ? "Edit Holiday" : "Add Holiday"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingHoliday ? "Update holiday information" : "Add a new holiday to the calendar"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Holiday Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., New Year's Day"
                className="bg-muted/10 border-border/80 rounded-lg text-xs"
              />
              {validationErrors.name && (
                <p className="text-[10px] text-destructive">{validationErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Date
              </label>
              <Input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="bg-muted/10 border-border/80 rounded-lg text-xs"
              />
              {validationErrors.date && (
                <p className="text-[10px] text-destructive">{validationErrors.date}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
              >
                <option value="National">National</option>
                <option value="Regional">Regional</option>
                <option value="Company">Company</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Description
              </label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Optional description"
                className="bg-muted/10 border-border/80 rounded-lg text-xs"
              />
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
              {editingHoliday ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="glass-panel max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Delete Holiday</DialogTitle>
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
