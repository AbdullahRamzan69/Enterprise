import { Link } from "react-router-dom"
import { ArrowLeft, BarChart3, Package, TrendingUp, AlertTriangle, Clock, DollarSign, PieChart } from "lucide-react"
import { useAppSelector } from "@/app/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  selectTotalAssetsCount,
  selectAssignedAssetsCount,
  selectAvailableAssetsCount,
  selectMaintenanceAssetsCount,
  selectTotalAssetValue,
  selectAssetsByCategoryCount,
  selectWarrantyExpiringSoon,
  selectRecentlyPurchasedAssets,
} from "@/features/assets/assetSelectors"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function AssetsReports() {
  const totalCount = useAppSelector(selectTotalAssetsCount)
  const assignedCount = useAppSelector(selectAssignedAssetsCount)
  const availableCount = useAppSelector(selectAvailableAssetsCount)
  const maintenanceCount = useAppSelector(selectMaintenanceAssetsCount)
  const totalValue = useAppSelector(selectTotalAssetValue)
  const categoryCounts = useAppSelector(selectAssetsByCategoryCount)
  const warrantyExpiring = useAppSelector(selectWarrantyExpiringSoon)
  const recentlyPurchased = useAppSelector(selectRecentlyPurchasedAssets)

  const categoryColors: Record<string, string> = {
    Laptop: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Desktop: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Monitor: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    Keyboard: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Mouse: "bg-lime-500/10 text-lime-500 border-lime-500/20",
    Phone: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Printer: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    Furniture: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Other: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
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
            Asset Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Comprehensive analytics and insights for asset management.
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Assets</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalCount}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Assigned</p>
                <p className="text-2xl font-bold text-blue-500 mt-1">{assignedCount}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Available</p>
                <p className="text-2xl font-bold text-emerald-500 mt-1">{availableCount}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Maintenance</p>
                <p className="text-2xl font-bold text-amber-500 mt-1">{maintenanceCount}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Total Value Card */}
      <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Total Asset Value</p>
              <p className="text-3xl font-bold text-emerald-500 mt-1">{formatCurrency(totalValue)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets by Category */}
        <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
          <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-500" />
              Assets by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {Object.entries(categoryCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={categoryColors[category] || "bg-muted/10 text-muted-foreground"}>
                        {category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(count / totalCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Assets by Status */}
        <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
          <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Assets by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-foreground">Assigned</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(assignedCount / totalCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-8 text-right">{assignedCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-foreground">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(availableCount / totalCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-8 text-right">{availableCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm text-foreground">Maintenance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(maintenanceCount / totalCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-8 text-right">{maintenanceCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-sm text-foreground">Retired</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${((totalCount - assignedCount - availableCount - maintenanceCount) / totalCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-8 text-right">
                    {totalCount - assignedCount - availableCount - maintenanceCount}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warranty Expiring Soon */}
        <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
          <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Warranty Expiring Soon
            </CardTitle>
            <CardDescription className="text-xs">
              Assets with warranty expiring within 3 months
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {warrantyExpiring.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No assets with expiring warranty</p>
            ) : (
              <div className="space-y-3">
                {warrantyExpiring.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{asset.assetName}</p>
                      <p className="text-[10px] text-muted-foreground">{asset.assetCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-amber-500">{formatDate(asset.warrantyExpiry)}</p>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] mt-1">
                        Expiring
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recently Purchased */}
        <Card className="glass-card shadow-sm border border-border/60 rounded-xl">
          <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Recently Purchased
            </CardTitle>
            <CardDescription className="text-xs">
              Assets purchased in the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {recentlyPurchased.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent purchases</p>
            ) : (
              <div className="space-y-3">
                {recentlyPurchased.slice(0, 5).map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{asset.assetName}</p>
                      <p className="text-[10px] text-muted-foreground">{formatDate(asset.purchaseDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-semibold text-emerald-500">{formatCurrency(asset.purchasePrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
