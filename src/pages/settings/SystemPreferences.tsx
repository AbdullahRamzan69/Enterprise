import { useState } from "react"
import { Save, Moon, Sun, Monitor, Bell, LayoutGrid } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { selectSystemPreferences } from "@/features/settings/settingsSelectors"
import { updateSystemPreferences } from "@/features/settings/settingsSlice"

export default function SystemPreferences() {
  const dispatch = useAppDispatch()
  const preferences = useAppSelector(selectSystemPreferences)

  const [formData, setFormData] = useState(preferences)

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    dispatch(updateSystemPreferences(formData))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">System Preferences</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure application-wide settings and user preferences.
        </p>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <CardTitle className="text-base font-bold text-foreground">Application Settings</CardTitle>
          <CardDescription className="text-xs">
            Customize your application experience
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          
          {/* Theme */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Theme
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant={formData.theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => handleChange("theme", "light")}
                className={formData.theme === "light" ? "bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-lg" : "border-border/80 text-xs rounded-lg"}
              >
                <Sun className="w-3 h-3 mr-1" />
                Light
              </Button>
              <Button
                variant={formData.theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => handleChange("theme", "dark")}
                className={formData.theme === "dark" ? "bg-slate-800 hover:bg-slate-900 text-white text-xs rounded-lg" : "border-border/80 text-xs rounded-lg"}
              >
                <Moon className="w-3 h-3 mr-1" />
                Dark
              </Button>
              <Button
                variant={formData.theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => handleChange("theme", "system")}
                className={formData.theme === "system" ? "bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg" : "border-border/80 text-xs rounded-lg"}
              >
                <Monitor className="w-3 h-3 mr-1" />
                System
              </Button>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="flex h-8.5 w-full max-w-xs items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Format */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Date Format
              </label>
              <select
                value={formData.dateFormat}
                onChange={(e) => handleChange("dateFormat", e.target.value)}
                className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            {/* Time Format */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Time Format
              </label>
              <select
                value={formData.timeFormat}
                onChange={(e) => handleChange("timeFormat", e.target.value)}
                className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
              >
                <option value="12h">12 Hour (AM/PM)</option>
                <option value="24h">24 Hour</option>
              </select>
            </div>
          </div>

          {/* Pagination Size */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <LayoutGrid className="w-3 h-3" />
              Default Pagination Size
            </label>
            <select
              value={formData.defaultPaginationSize}
              onChange={(e) => handleChange("defaultPaginationSize", parseInt(e.target.value))}
              className="flex h-8.5 w-full max-w-xs items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            >
              <option value={5}>5 items per page</option>
              <option value={10}>10 items per page</option>
              <option value={20}>20 items per page</option>
              <option value={50}>50 items per page</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-3 h-3" />
              Notifications
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant={formData.notificationsEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => handleChange("notificationsEnabled", true)}
                className={formData.notificationsEnabled ? "bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg" : "border-border/80 text-xs rounded-lg"}
              >
                Enabled
              </Button>
              <Button
                variant={!formData.notificationsEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => handleChange("notificationsEnabled", false)}
                className={!formData.notificationsEnabled ? "bg-rose-500 hover:bg-rose-600 text-white text-xs rounded-lg" : "border-border/80 text-xs rounded-lg"}
              >
                Disabled
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-border/50">
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
