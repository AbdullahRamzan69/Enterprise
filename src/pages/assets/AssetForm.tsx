import { useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft, Save, AlertCircle, User, UserMinus } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { addAsset, updateAsset, assignAsset, unassignAsset } from "@/features/assets/assetSlice"
import { selectAssetById, selectAllAssets } from "@/features/assets/assetSelectors"
import { selectEmployees } from "@/features/employees/employeeSelectors"
import type { Asset, AssetCategory, AssetStatus } from "@/features/assets/assetTypes"

const CATEGORIES: AssetCategory[] = ["Laptop", "Desktop", "Monitor", "Keyboard", "Mouse", "Phone", "Printer", "Furniture", "Other"]
const STATUSES: AssetStatus[] = ["Available", "Assigned", "Maintenance", "Retired"]

const createAssetFormData = (assets: Asset[], asset?: Asset): Asset => {
  if (asset) {
    return { ...asset }
  }

  const ids = assets
    .map((a) => parseInt(a.id.replace("AST-", ""), 10))
    .filter((num) => !isNaN(num))
  const nextIdNum = ids.length > 0 ? Math.max(...ids) + 1 : 1001

  const currentDate = new Date()

  return {
    id: `AST-${nextIdNum}`,
    assetCode: "",
    assetName: "",
    category: "Laptop",
    brand: "",
    model: "",
    serialNumber: "",
    purchaseDate: currentDate.toISOString().split('T')[0],
    purchasePrice: 0,
    warrantyExpiry: new Date(currentDate.getFullYear() + 2, currentDate.getMonth(), currentDate.getDate()).toISOString().split('T')[0],
    assignedEmployeeId: undefined,
    assignedEmployeeName: undefined,
    status: "Available",
    location: "",
    notes: "",
  }
}

export default function AssetForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const assets = useAppSelector(selectAllAssets)
  const asset = useAppSelector((state) => (id ? selectAssetById(state, id) : undefined))
  const employees = useAppSelector(selectEmployees)

  const isEditMode = !!id
  const error =
    isEditMode && id && !asset
      ? `Asset with ID "${id}" was not found in database registry.`
      : ""

  // Form State
  const [formData, setFormData] = useState<Asset>(() =>
    createAssetFormData(assets, asset)
  )

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: ["purchasePrice"].includes(name) 
        ? Number(value) || 0 
        : value,
    }))

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Required fields
    if (!formData.assetCode.trim()) errors.assetCode = "Asset code is required"
    if (!formData.assetName.trim()) errors.assetName = "Asset name is required"
    if (!formData.brand.trim()) errors.brand = "Brand is required"
    if (!formData.model.trim()) errors.model = "Model is required"
    if (!formData.serialNumber.trim()) errors.serialNumber = "Serial number is required"
    if (!formData.purchaseDate) errors.purchaseDate = "Purchase date is required"
    if (!formData.warrantyExpiry) errors.warrantyExpiry = "Warranty expiry is required"
    if (!formData.location.trim()) errors.location = "Location is required"

    // Asset code uniqueness
    const existingCode = assets.find(
      (a) => a.assetCode === formData.assetCode && a.id !== formData.id
    )
    if (existingCode) errors.assetCode = "Asset code must be unique"

    // Purchase price must be positive
    if (formData.purchasePrice < 0) errors.purchasePrice = "Purchase price must be positive"

    // Warranty expiry cannot be before purchase date
    if (formData.purchaseDate && formData.warrantyExpiry) {
      if (new Date(formData.warrantyExpiry) < new Date(formData.purchaseDate)) {
        errors.warrantyExpiry = "Warranty expiry cannot be before purchase date"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (isEditMode) {
      dispatch(updateAsset(formData))
    } else {
      dispatch(addAsset(formData))
    }

    navigate("/assets")
  }

  const handleAssignEmployee = (employeeId: string) => {
    const emp = employees.find((e) => e.id === employeeId)
    if (emp) {
      dispatch(assignAsset({
        assetId: formData.id,
        employeeId: emp.id,
        employeeName: emp.fullName,
      }))
      setFormData((prev) => ({
        ...prev,
        assignedEmployeeId: emp.id,
        assignedEmployeeName: emp.fullName,
        status: "Assigned",
      }))
    }
  }

  const handleUnassignEmployee = () => {
    dispatch(unassignAsset(formData.id))
    setFormData((prev) => ({
      ...prev,
      assignedEmployeeId: undefined,
      assignedEmployeeName: undefined,
      status: "Available",
    }))
  }

  if (error) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Asset Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">{error}</p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/assets">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Return to Registry
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const canAssign = formData.status === "Available" || formData.status === "Assigned"

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="h-8 w-8 rounded-lg border-border/80 text-muted-foreground hover:text-foreground shrink-0"
        >
          <Link to="/assets">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {isEditMode ? "Modify Asset" : "Register New Asset"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEditMode ? `Updating asset record for ${formData.assetName}` : "Add a new asset to the inventory."}
          </p>
        </div>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 max-w-4xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                {isEditMode ? "Edit Asset Information" : "Asset Information"}
              </CardTitle>
              <CardDescription className="text-xs">
                Fill in the asset details for inventory tracking.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
              {formData.id}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Information */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Asset Code <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="assetCode"
                    value={formData.assetCode}
                    onChange={handleChange}
                    placeholder="e.g., LPT-001"
                    className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
                  />
                  {validationErrors.assetCode && (
                    <p className="text-[10px] text-destructive">{validationErrors.assetCode}</p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Asset Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="assetName"
                    value={formData.assetName}
                    onChange={handleChange}
                    placeholder='e.g., MacBook Pro 16"'
                    className="bg-muted/10 border-border/80 rounded-lg text-xs"
                  />
                  {validationErrors.assetName && (
                    <p className="text-[10px] text-destructive">{validationErrors.assetName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Category <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Brand <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g., Apple"
                    className="bg-muted/10 border-border/80 rounded-lg text-xs"
                  />
                  {validationErrors.brand && (
                    <p className="text-[10px] text-destructive">{validationErrors.brand}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Model <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder='e.g., MacBook Pro 16" M3 Max'
                    className="bg-muted/10 border-border/80 rounded-lg text-xs"
                  />
                  {validationErrors.model && (
                    <p className="text-[10px] text-destructive">{validationErrors.model}</p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Serial Number <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="e.g., C02XYZ123ABC"
                    className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
                  />
                  {validationErrors.serialNumber && (
                    <p className="text-[10px] text-destructive">{validationErrors.serialNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase & Warranty */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">
                Purchase & Warranty
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Purchase Date <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="bg-muted/10 border-border/80 rounded-lg text-xs"
                  />
                  {validationErrors.purchaseDate && (
                    <p className="text-[10px] text-destructive">{validationErrors.purchaseDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Purchase Price ($) <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-muted/10 border-border/80 rounded-lg text-xs font-mono"
                  />
                  {validationErrors.purchasePrice && (
                    <p className="text-[10px] text-destructive">{validationErrors.purchasePrice}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Warranty Expiry <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="date"
                    name="warrantyExpiry"
                    value={formData.warrantyExpiry}
                    onChange={handleChange}
                    className="bg-muted/10 border-border/80 rounded-lg text-xs"
                  />
                  {validationErrors.warrantyExpiry && (
                    <p className="text-[10px] text-destructive">{validationErrors.warrantyExpiry}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Assignment & Status */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">
                Assignment & Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Location <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Headquarters - Floor 3"
                    className="bg-muted/10 border-border/80 rounded-lg text-xs"
                  />
                  {validationErrors.location && (
                    <p className="text-[10px] text-destructive">{validationErrors.location}</p>
                  )}
                </div>
              </div>

              {/* Employee Assignment */}
              <div className="mt-4 p-4 bg-muted/20 border border-border/60 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Assigned Employee
                  </label>
                  {formData.assignedEmployeeName && canAssign && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleUnassignEmployee}
                      className="h-7 text-xs border-border/80 hover:bg-destructive/10 hover:text-destructive rounded-md"
                    >
                      <UserMinus className="w-3 h-3 mr-1" />
                      Unassign
                    </Button>
                  )}
                </div>
                
                {formData.assignedEmployeeName ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      <User className="w-3 h-3 mr-1" />
                      {formData.assignedEmployeeName}
                    </Badge>
                  </div>
                ) : canAssign ? (
                  <select
                    value=""
                    onChange={(e) => e.target.value && handleAssignEmployee(e.target.value)}
                    className="flex h-8.5 w-full items-center justify-between rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Select Employee to Assign</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Cannot assign asset in {formData.status} status
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes about the asset..."
                className="flex w-full rounded-lg border border-border/80 bg-muted/10 dark:bg-card px-3 py-2 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            {/* Form Footer Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg"
              >
                <Link to="/assets">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isEditMode ? "Save Changes" : "Register Asset"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
