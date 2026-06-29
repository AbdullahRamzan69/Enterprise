import { Link, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, Edit2, Package, DollarSign, Calendar, MapPin, User, FileText, Shield, Trash2 } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { selectAssetById } from "@/features/assets/assetSelectors"
import { deleteAsset, unassignAsset } from "@/features/assets/assetSlice"

export default function AssetDetails() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const asset = useAppSelector((state) => (id ? selectAssetById(state, id) : undefined))

  if (!asset) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Asset Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">
            We could not find the asset with ID "{id}".
          </p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/assets">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Registry
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${asset.assetName}? This action cannot be undone.`)) {
      dispatch(deleteAsset(asset.id))
      window.location.href = "/assets"
    }
  }

  const handleUnassign = () => {
    if (confirm(`Are you sure you want to unassign this asset from ${asset.assignedEmployeeName}?`)) {
      dispatch(unassignAsset(asset.id))
      window.location.reload()
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "Assigned":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Maintenance":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "Retired":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      default:
        return "bg-muted/10 text-muted-foreground border-border/20"
    }
  }

  const isWarrantyExpiring = () => {
    const expiry = new Date(asset.warrantyExpiry)
    const now = new Date()
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(now.getMonth() + 3)
    return expiry <= threeMonthsFromNow && expiry > now
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              {asset.assetName}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {asset.brand} {asset.model}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg">
            <Link to="/assets">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Registry
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm">
            <Link to={`/assets/edit/${asset.id}`}>
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit Asset
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/95 text-destructive-foreground font-semibold text-xs rounded-lg shadow-sm"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Asset Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card shadow-sm border border-border/60 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-border/50">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">
                      {asset.assetCode}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {asset.category}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
                    {asset.id}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(asset.status)}>
                    {asset.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              
              {/* Basic Information */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Asset Name</p>
                    <p className="text-sm font-semibold text-foreground">{asset.assetName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Brand</p>
                    <p className="text-sm font-semibold text-foreground">{asset.brand}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Model</p>
                    <p className="text-sm font-semibold text-foreground">{asset.model}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Serial Number</p>
                    <p className="text-sm font-mono font-semibold text-foreground">{asset.serialNumber}</p>
                  </div>
                </div>
              </div>

              {/* Purchase Information */}
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Purchase Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Purchase Date</p>
                    <p className="text-sm font-semibold text-foreground">{formatDate(asset.purchaseDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Purchase Price</p>
                    <p className="text-sm font-mono font-bold text-emerald-500">{formatCurrency(asset.purchasePrice)}</p>
                  </div>
                </div>
              </div>

              {/* Warranty Information */}
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Warranty Information
                </h3>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Warranty Expiry</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{formatDate(asset.warrantyExpiry)}</p>
                    {isWarrantyExpiring() && (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">
                        Expiring Soon
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="pt-4 border-t border-border/50">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </h3>
                <p className="text-sm font-semibold text-foreground">{asset.location}</p>
              </div>

              {/* Notes */}
              {asset.notes && (
                <div className="pt-4 border-t border-border/50">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Notes
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{asset.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Assignment */}
        <div className="space-y-6">
          <Card className="glass-card shadow-sm border border-border/60 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {asset.assignedEmployeeName ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                      {asset.assignedEmployeeName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">{asset.assignedEmployeeName}</p>
                      <p className="text-[10px] text-muted-foreground">Assigned Employee</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleUnassign}
                    className="w-full border-border/80 hover:bg-destructive/10 hover:text-destructive text-xs rounded-lg"
                  >
                    <User className="w-3 h-3 mr-1" />
                    Unassign Asset
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <User className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Not assigned to any employee</p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-3 border-border/80 hover:bg-muted text-xs rounded-lg"
                  >
                    <Link to={`/assets/edit/${asset.id}`}>
                      Assign Employee
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="glass-card shadow-sm border border-border/60 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                Age
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-mono font-extrabold text-foreground">
                  {Math.floor((new Date().getTime() - new Date(asset.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 30))}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Months Old</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
