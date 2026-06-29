import { Outlet, Link, useLocation } from "react-router-dom"
import { Building2, Users, Briefcase, Calendar, FileText, DollarSign, Package, Settings as SettingsIcon, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Company Profile", href: "/settings/company", icon: Building2 },
  { name: "Departments", href: "/settings/departments", icon: Users },
  { name: "Designations", href: "/settings/designations", icon: Briefcase },
  { name: "Holidays", href: "/settings/holidays", icon: Calendar },
  { name: "Leave Policies", href: "/settings/leave-policies", icon: FileText },
  { name: "Payroll Settings", href: "/settings/payroll", icon: DollarSign },
  { name: "Asset Categories", href: "/settings/assets", icon: Package },
  { name: "System Preferences", href: "/settings/preferences", icon: SettingsIcon },
]

export default function Settings() {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Settings & Administration
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure your organization's settings and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 shrink-0">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = currentPath === item.href || (item.href !== "/settings" && currentPath.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
