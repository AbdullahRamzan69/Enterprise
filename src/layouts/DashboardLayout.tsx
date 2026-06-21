import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { Navbar } from "@/components/dashboard/Navbar"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export default function DashboardLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden lg:block w-64 h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64 border-r border-border glass-panel">
          <Sidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar onOpenSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Content Panel Scrollable */}
        <main className="flex-1 overflow-y-auto bg-muted/20 dark:bg-muted/10 p-4 md:p-6 transition-colors duration-200">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
