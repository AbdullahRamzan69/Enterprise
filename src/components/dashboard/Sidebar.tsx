import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarOff,
  UserPlus,
  Handshake,
  FolderKanban,
  Coins,
  Package,
  Settings,
  Building2,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface SidebarProps {
  className?: string
  onCloseMobile?: () => void
}

export const sidebarMenuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", path: "/employees", icon: Users },
  { label: "Attendance", path: "/attendance", icon: CalendarCheck },
  { label: "Leave", path: "/leave", icon: CalendarOff },
  { label: "Recruitment", path: "/recruitment", icon: UserPlus },
  { label: "CRM", path: "/crm", icon: Handshake },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Finance", path: "/finance", icon: Coins },
  { label: "Assets", path: "/assets", icon: Package },
  { label: "Settings", path: "/settings", icon: Settings },
]

export function Sidebar({ className, onCloseMobile }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-card border-r border-border text-card-foreground select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Building2 className="w-5 h-5 animate-pulse" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Aethel EBMS
          </span>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {sidebarMenuItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-foreground animate-ping" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer Profile Mini-Banner */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm shadow-inner">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              Alex Mercer
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              Admin Manager
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
