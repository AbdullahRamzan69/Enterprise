import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Bell,
  Sun,
  Moon,
  Laptop,
  Menu,
  LogOut,
  User,
  Settings,
  ShieldCheck,
  Check
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface NavbarProps {
  onOpenSidebar: () => void
}

const mockNotifications = [
  {
    id: 1,
    title: "New Leave Application",
    desc: "Jane Doe requested 3 days of sick leave.",
    time: "5m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Interview Scheduled",
    desc: "UX designer candidate interview at 3:00 PM.",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Payroll Generated",
    desc: "June monthly payroll file is ready for review.",
    time: "4h ago",
    unread: false,
  },
]

export function Navbar({ onOpenSidebar }: NavbarProps) {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })))
  }

  const handleLogout = () => {
    // Navigate to login
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-4 md:px-6 bg-background/80 backdrop-blur-md border-b border-border select-none">
      {/* Left side: Hamburger (mobile) + Search Bar */}
      <div className="flex items-center flex-1 gap-4 max-w-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className="lg:hidden shrink-0 hover:bg-muted text-muted-foreground"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Global Search Bar */}
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search dashboard, tasks, employees... (Ctrl+K)"
            className="w-full pl-9 pr-4 h-9 bg-muted/40 border-border/80 focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-sm transition-all duration-200 focus-visible:bg-background"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </div>
        <Button variant="ghost" size="icon" className="sm:hidden text-muted-foreground">
          <Search className="w-5 h-5" />
        </Button>
      </div>

      {/* Right side: Theme switch + Notifications + User Dropdown */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-muted rounded-lg">
              {theme === "light" && <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all" />}
              {theme === "dark" && <Moon className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all" />}
              {theme === "system" && <Laptop className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-panel min-w-[120px] rounded-lg">
            <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 cursor-pointer">
              <Sun className="w-4 h-4" />
              <span>Light</span>
              {theme === "light" && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 cursor-pointer">
              <Moon className="w-4 h-4" />
              <span>Dark</span>
              {theme === "dark" && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 cursor-pointer">
              <Laptop className="w-4 h-4" />
              <span>System</span>
              {theme === "system" && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Icon with Panel */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:bg-muted rounded-lg">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[9px] font-bold text-white bg-destructive rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] glass-panel p-2 rounded-xl">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-semibold text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <div className="max-h-[250px] overflow-y-auto py-1 space-y-1">
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex flex-col gap-1 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      notif.unread
                        ? "bg-primary/5 hover:bg-primary/10 border-l-2 border-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${notif.unread ? "text-foreground" : "text-muted-foreground"}`}>
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notif.desc}
                    </p>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 rounded-full flex items-center gap-2 px-1 hover:bg-muted rounded-lg">
              <Avatar className="h-8 w-8 border border-border shadow-sm">
                <AvatarImage src="" alt="Alex Mercer" />
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">AM</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col text-left mr-1">
                <span className="text-xs font-semibold text-foreground">Alex Mercer</span>
                <span className="text-[9px] text-muted-foreground">Admin Manager</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-panel rounded-xl">
            <DropdownMenuLabel className="font-normal py-3 px-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-foreground leading-none">Alex Mercer</p>
                <p className="text-xs text-muted-foreground leading-none">alex.mercer@company.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="gap-2 cursor-pointer rounded-md">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer rounded-md">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer rounded-md">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              <span>Admin Panel</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
