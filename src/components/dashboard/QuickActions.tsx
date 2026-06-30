import { useNavigate } from "react-router-dom"
import { UserPlus, CheckSquare, DollarSign, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"

// intentionally prop-free

interface Action {
  label: string
  icon: React.ElementType
  path: string
  iconBg: string
  iconColor: string
}

const ACTIONS: Action[] = [
  {
    label: "Add Employee",
    icon: UserPlus,
    path: "/employees/new",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    label: "Approve Leave",
    icon: CheckSquare,
    path: "/leave",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    label: "Generate Payroll",
    icon: DollarSign,
    path: "/finance/new",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    label: "View Reports",
    icon: BarChart2,
    path: "/assets/reports",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
]

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <section className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full">
      <h2 className="text-base font-semibold text-foreground mb-1">Quick Actions</h2>
      <p className="text-xs text-muted-foreground mb-4">Shortcuts to common workflows</p>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border",
                "hover:bg-muted/60 transition-all duration-200 group focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              aria-label={action.label}
            >
              <div className={cn("p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-110", action.iconBg)}>
                <Icon className={cn("w-5 h-5", action.iconColor)} />
              </div>
              <span className="text-xs font-medium text-foreground text-center leading-tight">
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
