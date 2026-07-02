import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import DashboardLayout from "@/layouts/DashboardLayout";
import Login from "@/pages/Login";
import DashboardHome from "@/pages/DashboardHome";

import AttendanceDetails from "@/pages/attendance/AttendanceDetails";
import AttendanceForm from "@/pages/attendance/AttendanceForm";
import AttendanceList from "@/pages/attendance/AttendanceList";

import EmployeeDetails from "@/pages/employees/EmployeeDetails";
import EmployeeForm from "@/pages/employees/EmployeeForm";
import EmployeeList from "@/pages/employees/EmployeeList";

import LeaveDetails from "@/pages/leave/LeaveDetails";
import LeaveForm from "@/pages/leave/LeaveForm";
import LeaveList from "@/pages/leave/LeaveList";

import ProjectDetails from "@/pages/projects/ProjectDetails";
import ProjectForm from "@/pages/projects/ProjectForm";
import ProjectsList from "@/pages/projects/ProjectsList";

import RecruitmentDetails from "@/pages/recruitment/RecruitmentDetails";
import RecruitmentForm from "@/pages/recruitment/RecruitmentForm";
import RecruitmentList from "@/pages/recruitment/RecruitmentList";

import Jobs from "./pages/jobs/Jobs";
import JobForm from "@/pages/jobs/JobForm";
import JobDetails from "@/pages/jobs/JobDetails";
import ApplicantProfile from "@/pages/jobs/ApplicantProfile";

import CRMList from "@/pages/crm/CRMList";
import CRMForm from "@/pages/crm/CRMForm";
import CRMDetails from "@/pages/crm/CRMDetails";

import FinanceList from "@/pages/finance/FinanceList";
import FinanceForm from "@/pages/finance/FinanceForm";
import FinanceDetail from "@/pages/finance/FinanceDetail";

import AssetsList from "@/pages/assets/AssetsList";
import AssetForm from "@/pages/assets/AssetForm";
import AssetDetails from "@/pages/assets/AssetDetails";
import AssetsReports from "@/pages/assets/AssetsReports";

import Settings from "@/pages/settings/Settings";
import CompanyProfile from "@/pages/settings/CompanyProfile";
import Departments from "@/pages/settings/Departments";
import Designations from "@/pages/settings/Designations";
import Holidays from "@/pages/settings/Holidays";
import LeavePolicies from "@/pages/settings/LeavePolicies";
import PayrollSettings from "@/pages/settings/PayrollSettings";
import AssetCategories from "@/pages/settings/AssetCategories";
import SystemPreferences from "@/pages/settings/SystemPreferences";
import SettingsUsers from "@/pages/settings/admin/Users";
import SettingsUserDetails from "@/pages/settings/admin/UserDetails";
import SettingsRolesPermissions from "@/pages/settings/admin/RolesPermissions";
import SettingsRoleDetails from "@/pages/settings/admin/RoleDetails";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="aethel-ebms-theme">
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard" element={<DashboardHome />} />

            {/* Employees */}
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/new" element={<EmployeeForm />} />
            <Route path="employees/edit/:id" element={<EmployeeForm />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />

            {/* Attendance */}
            <Route path="attendance" element={<AttendanceList />} />
            <Route path="attendance/new" element={<AttendanceForm />} />
            <Route path="attendance/edit/:id" element={<AttendanceForm />} />
            <Route path="attendance/:id" element={<AttendanceDetails />} />

            {/* Leave */}
            <Route path="leave" element={<LeaveList />} />
            <Route path="leave/new" element={<LeaveForm />} />
            <Route path="leave/edit/:id" element={<LeaveForm />} />
            <Route path="leave/:id" element={<LeaveDetails />} />

            {/* Recruitment */}
            <Route path="recruitment" element={<RecruitmentList />} />
            <Route path="recruitment/new" element={<RecruitmentForm />} />
            <Route path="recruitment/edit/:id" element={<RecruitmentForm />} />
            <Route path="recruitment/:id" element={<RecruitmentDetails />} />

            {/* Jobs */}
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/new" element={<JobForm />} />
            <Route path="jobs/edit/:id" element={<JobForm />} />
            <Route
              path="jobs/applicants/:applicantId"
              element={<ApplicantProfile />}
            />
            <Route path="jobs/:id" element={<JobDetails />} />

            {/* Projects */}
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
            <Route path="projects/:id" element={<ProjectDetails />} />

            {/* CRM */}
            <Route path="crm" element={<CRMList />} />
            <Route path="crm/new" element={<CRMForm />} />
            <Route path="crm/edit/:id" element={<CRMForm />} />
            <Route path="crm/:id" element={<CRMDetails />} />

            {/* Finance */}
            <Route path="finance" element={<FinanceList />} />
            <Route path="finance/new" element={<FinanceForm />} />
            <Route path="finance/edit/:id" element={<FinanceForm />} />
            <Route path="finance/:id" element={<FinanceDetail />} />

            {/* Assets */}
            <Route path="assets" element={<AssetsList />} />
            <Route path="assets/new" element={<AssetForm />} />
            <Route path="assets/edit/:id" element={<AssetForm />} />
            <Route path="assets/:id" element={<AssetDetails />} />
            <Route path="assets/reports" element={<AssetsReports />} />

            {/* Settings */}
            <Route path="settings" element={<Settings />}>
              <Route index element={<CompanyProfile />} />
              <Route path="company" element={<CompanyProfile />} />
              <Route path="departments" element={<Departments />} />
              <Route path="designations" element={<Designations />} />
              <Route path="holidays" element={<Holidays />} />
              <Route path="leave-policies" element={<LeavePolicies />} />
              <Route path="payroll" element={<PayrollSettings />} />
              <Route path="assets" element={<AssetCategories />} />
              <Route path="users" element={<SettingsUsers />} />
              <Route path="users/:id" element={<SettingsUserDetails />} />
              <Route
                path="roles-permissions"
                element={<SettingsRolesPermissions />}
              />
              <Route
                path="roles-permissions/:id"
                element={<SettingsRoleDetails />}
              />
              <Route path="preferences" element={<SystemPreferences />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
