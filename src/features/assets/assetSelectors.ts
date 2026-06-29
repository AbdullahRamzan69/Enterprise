import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "@/app/store"

export const selectAssetsState = (state: RootState) => state.assets

export const selectAllAssets = createSelector(
  [selectAssetsState],
  (assetsState) => assetsState.assets
)

export const selectAssetById = createSelector(
  [selectAllAssets, (_state: RootState, id: string) => id],
  (assets, id) => assets.find((a) => a.id === id)
)

export const selectAssetsByEmployeeId = createSelector(
  [selectAllAssets, (_state: RootState, employeeId: string) => employeeId],
  (assets, employeeId) => assets.filter((a) => a.assignedEmployeeId === employeeId)
)

export const selectAssetsByCategory = createSelector(
  [selectAllAssets, (_state: RootState, category: string) => category],
  (assets, category) => {
    if (category === "All") return assets
    return assets.filter((a) => a.category === category)
  }
)

export const selectAssetsByStatus = createSelector(
  [selectAllAssets, (_state: RootState, status: string) => status],
  (assets, status) => {
    if (status === "All") return assets
    return assets.filter((a) => a.status === status)
  }
)

export const selectTotalAssetsCount = createSelector(
  [selectAllAssets],
  (assets) => assets.length
)

export const selectAssignedAssetsCount = createSelector(
  [selectAllAssets],
  (assets) => assets.filter((a) => a.status === "Assigned").length
)

export const selectAvailableAssetsCount = createSelector(
  [selectAllAssets],
  (assets) => assets.filter((a) => a.status === "Available").length
)

export const selectMaintenanceAssetsCount = createSelector(
  [selectAllAssets],
  (assets) => assets.filter((a) => a.status === "Maintenance").length
)

export const selectRetiredAssetsCount = createSelector(
  [selectAllAssets],
  (assets) => assets.filter((a) => a.status === "Retired").length
)

export const selectTotalAssetValue = createSelector(
  [selectAllAssets],
  (assets) => assets.reduce((total, a) => total + a.purchasePrice, 0)
)

export const selectAssetsByCategoryCount = createSelector(
  [selectAllAssets],
  (assets) => {
    const counts: Record<string, number> = {}
    assets.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1
    })
    return counts
  }
)

export const selectWarrantyExpiringSoon = createSelector(
  [selectAllAssets],
  (assets) => {
    const now = new Date()
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(now.getMonth() + 3)
    
    return assets.filter((a) => {
      const expiry = new Date(a.warrantyExpiry)
      return expiry <= threeMonthsFromNow && expiry > now
    })
  }
)

export const selectRecentlyPurchasedAssets = createSelector(
  [selectAllAssets],
  (assets) => {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    return assets
      .filter((a) => new Date(a.purchaseDate) >= sixMonthsAgo)
      .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
  }
)
