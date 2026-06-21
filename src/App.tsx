import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import DashboardLayout from "@/layouts/DashboardLayout"
import Login from "@/pages/Login"
import DashboardHome from "@/pages/DashboardHome"
import PlaceholderPage from "@/pages/PlaceholderPage"

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="aethel-ebms-theme">
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />

          {/* Private Shell Layout Routes */}
          <Route path="/" element={<DashboardLayout />}>
            {/* Redirect root to dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Core Home Dashboard */}
            <Route path="dashboard" element={<DashboardHome />} />

            {/* Sidebar Module Views */}
            <Route
              path="employees"
              element={
                <PlaceholderPage
                  title="Employees"
                  description="Administrative directory, personnel rosters, and contract listings."
                />
              }
            />
            <Route
              path="attendance"
              element={
                <PlaceholderPage
                  title="Attendance"
                  description="Daily clock-in registers, timesheets, and biometric sensor logs."
                />
              }
            />
            <Route
              path="leave"
              element={
                <PlaceholderPage
                  title="Leave"
                  description="Paid time off (PTO) balances, holiday records, and sick leaves."
                />
              }
            />
            <Route
              path="recruitment"
              element={
                <PlaceholderPage
                  title="Recruitment"
                  description="Job postings pipeline, candidate profiles, resumes, and interview feedback."
                />
              }
            />
            <Route
              path="crm"
              element={
                <PlaceholderPage
                  title="CRM"
                  description="Sales prospects pipeline, customer directories, and key account deals."
                />
              }
            />
            <Route
              path="projects"
              element={
                <PlaceholderPage
                  title="Projects"
                  description="Sprint milestones, Kanban task boards, and overall project status tracking."
                />
              }
            />
            <Route
              path="finance"
              element={
                <PlaceholderPage
                  title="Finance"
                  description="Operational expenditures, monthly payroll registries, and budget sheets."
                />
              }
            />
            <Route
              path="assets"
              element={
                <PlaceholderPage
                  title="Assets"
                  description="Cataloging enterprise hardware assets, software licenses, and inventory."
                />
              }
            />
            <Route
              path="settings"
              element={
                <PlaceholderPage
                  title="Settings"
                  description="General parameters, user roles permissions, and API integrations."
                />
              }
            />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
