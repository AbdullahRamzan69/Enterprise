import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import DashboardLayout from "@/layouts/DashboardLayout"
import Login from "@/pages/Login"
import DashboardHome from "@/pages/DashboardHome"
import PlaceholderPage from "@/pages/PlaceholderPage"
import AttendanceDetails from "@/pages/attendance/AttendanceDetails"
import AttendanceForm from "@/pages/attendance/AttendanceForm"
import AttendanceList from "@/pages/attendance/AttendanceList"
import EmployeeDetails from "@/pages/employees/EmployeeDetails"
import EmployeeForm from "@/pages/employees/EmployeeForm"
import EmployeeList from "@/pages/employees/EmployeeList"
import LeaveDetails from "@/pages/leave/LeaveDetails"
import LeaveForm from "@/pages/leave/LeaveForm"
import LeaveList from "@/pages/leave/LeaveList"
import ProjectDetails from "@/pages/projects/ProjectDetails"
import ProjectForm from "@/pages/projects/ProjectForm"
import ProjectsList from "@/pages/projects/ProjectsList"
import RecruitmentDetails from "@/pages/recruitment/RecruitmentDetails"
import RecruitmentForm from "@/pages/recruitment/RecruitmentForm"
import RecruitmentList from "@/pages/recruitment/RecruitmentList"
import CRMList from "@/pages/crm/CRMList"
import CRMForm from "@/pages/crm/CRMForm"
import CRMDetails from "@/pages/crm/CRMDetails"
import FinanceList from "@/pages/finance/FinanceList"
import PayrollForm from "@/pages/finance/PayrollForm"
import PayrollDetails from "@/pages/finance/PayrollDetails"
import AssetsList from "@/pages/assets/AssetsList"
import AssetForm from "@/pages/assets/AssetForm"
import AssetDetails from "@/pages/assets/AssetDetails"
import AssetsReports from "@/pages/assets/AssetsReports"
import Settings from "@/pages/settings/Settings"
import CompanyProfile from "@/pages/settings/CompanyProfile"
import Departments from "@/pages/settings/Departments"
import Designations from "@/pages/settings/Designations"
import Holidays from "@/pages/settings/Holidays"
import LeavePolicies from "@/pages/settings/LeavePolicies"
import PayrollSettings from "@/pages/settings/PayrollSettings"
import AssetCategories from "@/pages/settings/AssetCategories"
import SystemPreferences from "@/pages/settings/SystemPreferences"

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
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/new" element={<EmployeeForm />} />
            <Route path="employees/edit/:id" element={<EmployeeForm />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />
            <Route path="attendance" element={<AttendanceList />} />
            <Route path="attendance/new" element={<AttendanceForm />} />
            <Route path="attendance/edit/:id" element={<AttendanceForm />} />
            <Route path="attendance/:id" element={<AttendanceDetails />} />
            <Route path="leave" element={<LeaveList />} />
            <Route path="leave/new" element={<LeaveForm />} />
            <Route path="leave/edit/:id" element={<LeaveForm />} />
            <Route path="leave/:id" element={<LeaveDetails />} />
            <Route path="recruitment" element={<RecruitmentList />} />
            <Route path="recruitment/new" element={<RecruitmentForm />} />
            <Route path="recruitment/edit/:id" element={<RecruitmentForm />} />
            <Route path="recruitment/:id" element={<RecruitmentDetails />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="crm" element={<CRMList />} />
            <Route path="crm/new" element={<CRMForm />} />
            <Route path="crm/edit/:id" element={<CRMForm />} />
            <Route path="crm/:id" element={<CRMDetails />} />
            <Route path="finance" element={<FinanceList />} />
            <Route path="finance/new" element={<PayrollForm />} />
            <Route path="finance/edit/:id" element={<PayrollForm />} />
            <Route path="finance/:id" element={<PayrollDetails />} />
            <Route path="assets" element={<AssetsList />} />
            <Route path="assets/new" element={<AssetForm />} />
            <Route path="assets/edit/:id" element={<AssetForm />} />
            <Route path="assets/:id" element={<AssetDetails />} />
            <Route path="assets/reports" element={<AssetsReports />} />
            <Route path="settings" element={<Settings />}>
              <Route index element={<CompanyProfile />} />
              <Route path="company" element={<CompanyProfile />} />
              <Route path="departments" element={<Departments />} />
              <Route path="designations" element={<Designations />} />
              <Route path="holidays" element={<Holidays />} />
              <Route path="leave-policies" element={<LeavePolicies />} />
              <Route path="payroll" element={<PayrollSettings />} />
              <Route path="assets" element={<AssetCategories />} />
              <Route path="preferences" element={<SystemPreferences />} />
            </Route>
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
