import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "@/app/store"

export const selectCRMState = (state: RootState) => state.crm

export const selectAllCustomers = createSelector(
  [selectCRMState],
  (crmState) => crmState.customers
)

export const selectCustomerById = createSelector(
  [selectAllCustomers, (_state: RootState, id: string) => id],
  (customers, id) => customers.find((c) => c.id === id)
)

export const selectCustomersByAssignedEmployee = createSelector(
  [selectAllCustomers, (_state: RootState, employeeId: string) => employeeId],
  (customers, employeeId) => customers.filter((c) => c.assignedEmployeeId === employeeId)
)

export const selectTotalCustomersCount = createSelector(
  [selectAllCustomers],
  (customers) => customers.length
)

export const selectActiveClientsCount = createSelector(
  [selectAllCustomers],
  (customers) => customers.filter((c) => c.status === "Active Client").length
)

export const selectNewLeadsCount = createSelector(
  [selectAllCustomers],
  (customers) => customers.filter((c) => c.status === "Lead").length
)

export const selectNegotiationsCount = createSelector(
  [selectAllCustomers],
  (customers) => customers.filter((c) => c.status === "Negotiation").length
)

export const selectCustomersByStatus = createSelector(
  [selectAllCustomers, (_state: RootState, status: string) => status],
  (customers, status) => {
    if (status === "All") return customers
    return customers.filter((c) => c.status === status)
  }
)
