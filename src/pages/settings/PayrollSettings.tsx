import { useState } from "react"
import { DollarSign, Save, Percent, Clock, FileText } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { selectPayrollSettings } from "@/features/settings/settingsSelectors"
import { updatePayrollSettings } from "@/features/settings/settingsSlice"

export default function PayrollSettings() {
  const dispatch = useAppDispatch()
  const settings = useAppSelector(selectPayrollSettings)

  const [formData, setFormData] = useState(settings)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["defaultTaxRate", "overtimeRate"].includes(name) 
        ? Number(value) || 0 
        : value,
    }))
  }

  const handleSave = () => {
    dispatch(updatePayrollSettings(formData))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Payroll Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure tax rates, overtime calculations, and salary cycles.
        </p>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <CardTitle className="text-base font-bold text-foreground">Payroll Configuration</CardTitle>
          <CardDescription className="text-xs">
            Set up default payroll parameters for salary calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Percent className="w-3 h-3" />
                Default Tax Rate (%)
              </label>
              <Input
                name="defaultTaxRate"
                type="number"
                value={formData.defaultTaxRate}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                placeholder="15"
                className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Overtime Rate (Multiplier)
              </label>
              <Input
                name="overtimeRate"
                type="number"
                value={formData.overtimeRate}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="1.5"
                className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Bonus Rules
            </label>
            <Input
              name="bonusRules"
              value={formData.bonusRules}
              onChange={handleChange}
              placeholder="e.g., Performance-based quarterly bonus"
              className="bg-muted/10 border-border/80 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Salary Cycle
              </label>
              <select
                name="salaryCycle"
                value={formData.salaryCycle}
                onChange={handleChange}
                className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
              >
                <option value="Monthly">Monthly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-3 h-3" />
                Currency Symbol
              </label>
              <Input
                name="currencySymbol"
                value={formData.currencySymbol}
                onChange={handleChange}
                placeholder="$"
                className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-border/50">
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
