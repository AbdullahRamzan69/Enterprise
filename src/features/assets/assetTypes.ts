export type AssetCategory =
  | "Laptop"
  | "Desktop"
  | "Monitor"
  | "Keyboard"
  | "Mouse"
  | "Phone"
  | "Printer"
  | "Furniture"
  | "Other"

export type AssetStatus = "Available" | "Assigned" | "Maintenance" | "Retired"

export interface Asset {
  id: string
  assetCode: string
  assetName: string
  category: AssetCategory
  brand: string
  model: string
  serialNumber: string
  purchaseDate: string
  purchasePrice: number
  warrantyExpiry: string
  assignedEmployeeId?: string
  assignedEmployeeName?: string
  status: AssetStatus
  location: string
  notes: string
}

export interface AssetsState {
  assets: Asset[]
}
