import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { AdminUserStatus } from "./settingsTypes";

export const selectSettingsState = (state: RootState) => state.settings;

export const selectCompanyProfile = createSelector(
  [selectSettingsState],
  (settingsState) => settingsState.companyProfile,
);

export const selectDepartments = createSelector(
  [selectSettingsState],
  (settingsState) => settingsState.departments,
);

export const selectDepartmentById = createSelector(
  [selectDepartments, (_state: RootState, id: string) => id],
  (departments, id) => departments.find((d) => d.id === id),
);

export const selectDesignations = createSelector(
  [selectSettingsState],
  (settingsState) => settingsState.designations,
);

export const selectDesignationsByDepartment = createSelector(
  [
    selectDesignations,
    (_state: RootState, departmentId: string) => departmentId,
  ],
  (designations, departmentId) =>
    designations.filter((d) => d.departmentId === departmentId),
);

export const selectHolidays = createSelector(
  [selectSettingsState],
  (settingsState) => settingsState.holidays,
);

export const selectUpcomingHolidays = createSelector(
  [selectHolidays],
  (holidays) => {
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);

    return holidays
      .filter(
        (h) =>
          new Date(h.date) >= now && new Date(h.date) <= threeMonthsFromNow,
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
);

export const selectLeavePolicies = createSelector(
  [selectSettingsState],
  (settingsState) => settingsState.leavePolicies,
);

export const selectLeavePolicyByType = createSelector(
  [selectLeavePolicies, (_state: RootState, type: string) => type],
  (policies, type) => policies.find((p) => p.type === type),
);

export const selectPayrollSettings = createSelector(
  [selectSettingsState],
  (settingsState) => settingsState.payrollSettings,
);

export const selectAssetCategories = createSelector(
  [selectSettingsState],
  (settingsState) => settingsState.assetCategories,
);

export const selectSystemPreferences = createSelector(
  [selectSettingsState],
  (settingsState) => settingsState.systemPreferences,
);

export const selectAdminUsers = createSelector(
  [selectSettingsState],
  (settingsState) => settingsState.users,
);

export const selectAdminUserById = createSelector(
  [selectAdminUsers, (_state: RootState, id: string) => id],
  (users, id) => users.find((user) => user.id === id),
);

export const selectRoles = createSelector(
  [selectSettingsState],
  (settingsState) => settingsState.roles,
);

export const selectRoleById = createSelector(
  [selectRoles, (_state: RootState, id: string) => id],
  (roles, id) => roles.find((role) => role.id === id),
);

export const selectUsersByRoleId = createSelector(
  [selectAdminUsers, (_state: RootState, roleId: string) => roleId],
  (users, roleId) => users.filter((user) => user.roleId === roleId),
);

export const selectAdminUserCountByStatus = createSelector(
  [selectAdminUsers, (_state: RootState, status: AdminUserStatus) => status],
  (users, status) => users.filter((user) => user.status === status).length,
);

export const selectTotalDepartmentsCount = createSelector(
  [selectDepartments],
  (departments) => departments.length,
);

export const selectTotalDesignationsCount = createSelector(
  [selectDesignations],
  (designations) => designations.length,
);

export const selectTotalHolidaysCount = createSelector(
  [selectHolidays],
  (holidays) => holidays.length,
);

export const selectTotalRolesCount = createSelector(
  [selectRoles],
  (roles) => roles.length,
);

export const selectCustomRolesCount = createSelector(
  [selectRoles],
  (roles) => roles.filter((role) => role.kind === "Custom").length,
);

export const selectSystemRolesCount = createSelector(
  [selectRoles],
  (roles) => roles.filter((role) => role.kind === "System").length,
);

export const selectPermissionGroupsCount = createSelector(
  [selectRoles],
  (roles) => new Set(roles.flatMap((role) => role.permissionGroups)).size,
);
