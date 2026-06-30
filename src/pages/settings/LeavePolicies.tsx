import { useState } from "react"
import { FileText, Save, CheckCircle2, XCircle } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { selectLeavePolicies } from "@/features/settings/settingsSelectors"
import { updateLeavePolicy } from "@/features/settings/settingsSlice"

export default function LeavePolicies() {
  const dispatch = useAppDispatch()
  const policies = useAppSelector(selectLeavePolicies)

  const [formData, setFormData] = useState<Record<string, { maxDays: number; carryForward: boolean; requiresApproval: boolean }>>(() => {
    const initial: Record<string, any> = {}
    policies.forEach((p) => {
      initial[p.id] = {
        maxDays: p.maxDays,
        carryForward: p.carryForward,
        requiresApproval: p.requiresApproval,
      }
    })
    return initial
  })

  const handleChange = (policyId: string, field: string, value: number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [policyId]: {
        ...prev[policyId],
        [field]: value,
      },
    }))
  }

  const handleSave = (policyId: string) => {
    const policy = policies.find((p) => p.id === policyId)
    if (policy) {
      dispatch(
        updateLeavePolicy({
          ...policy,
          ...formData[policyId],
        })
      )
    }
  }

  const getPolicyColor = (type: string) => {
    switch (type) {
      case "Annual":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Casual":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "Sick":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "Unpaid":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      default:
        return "bg-muted/10 text-muted-foreground border-border/20"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Leave Policies</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure leave types, maximum days, and approval requirements.
        </p>
      </div>

      <div className="space-y-4">
        {policies.map((policy) => (
          <Card key={policy.id} className="glass-card shadow-sm border border-border/60 rounded-xl">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">{policy.type} Leave</CardTitle>
                    <Badge variant="outline" className={getPolicyColor(policy.type)}>
                      {policy.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Maximum Days
                  </label>
                  <Input
                    type="number"
                    value={formData[policy.id].maxDays}
                    onChange={(e) => handleChange(policy.id, "maxDays", parseInt(e.target.value) || 0)}
                    min="0"
                    className="bg-muted/10 border-border/80 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Carry Forward
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={formData[policy.id].carryForward ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChange(policy.id, "carryForward", true)}
                      className={formData[policy.id].carryForward ? "bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg" : "border-border/80 text-xs rounded-lg"}
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Yes
                    </Button>
                    <Button
                      variant={!formData[policy.id].carryForward ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChange(policy.id, "carryForward", false)}
                      className={!formData[policy.id].carryForward ? "bg-rose-500 hover:bg-rose-600 text-white text-xs rounded-lg" : "border-border/80 text-xs rounded-lg"}
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      No
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Requires Approval
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={formData[policy.id].requiresApproval ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChange(policy.id, "requiresApproval", true)}
                      className={formData[policy.id].requiresApproval ? "bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg" : "border-border/80 text-xs rounded-lg"}
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Yes
                    </Button>
                    <Button
                      variant={!formData[policy.id].requiresApproval ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChange(policy.id, "requiresApproval", false)}
                      className={!formData[policy.id].requiresApproval ? "bg-rose-500 hover:bg-rose-600 text-white text-xs rounded-lg" : "border-border/80 text-xs rounded-lg"}
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      No
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 mt-4 border-t border-border/50">
                <Button
                  onClick={() => handleSave(policy.id)}
                  size="sm"
                  className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
