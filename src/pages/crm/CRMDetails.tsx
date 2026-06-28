import { Link, useParams } from "react-router-dom"
import { AlertCircle, ArrowLeft, Edit2, Phone, Mail, Globe, MapPin, Briefcase, Building, Clock } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/app/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { selectCustomerById } from "@/features/crm/crmSelectors"
import { updateCustomerStatus } from "@/features/crm/crmSlice"
import type { Customer } from "@/features/crm/crmTypes"

const getStatusColor = (status: Customer["status"]) => {
  switch (status) {
    case "Active Client": return "bg-emerald-500"
    case "Lead": return "bg-blue-500"
    case "Contacted": return "bg-purple-500"
    case "Negotiation": return "bg-amber-500"
    case "Inactive": return "bg-zinc-400"
    default: return "bg-zinc-400"
  }
}

export default function CRMDetails() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const customer = useAppSelector((state) => (id ? selectCustomerById(state, id) : undefined))

  if (!customer) {
    return (
      <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
        <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Client Not Found</h2>
          <p className="text-xs text-muted-foreground leading-normal">
            We could not find a client record for ID "{id}". The profile may have been removed or the link may be invalid.
          </p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs rounded-lg mt-2">
            <Link to="/crm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to CRM
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleStatusChange = (newStatus: Customer["status"]) => {
    dispatch(updateCustomerStatus({ id: customer.id, status: newStatus }))
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
            <Link to="/crm">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Client Profile
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Detailed view of {customer.companyName}.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="border-border/80 hover:bg-muted text-foreground text-xs rounded-lg">
            <Link to="/crm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to CRM
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm">
            <Link to={`/crm/edit/${customer.id}`}>
              <Edit2 className="w-4 h-4 mr-1.5" />
              Edit Client
            </Link>
          </Button>
        </div>
      </div>

      <Card className="glass-card shadow-sm border border-border/60 max-w-5xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-border/50">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-foreground">{customer.companyName}</CardTitle>
                <CardDescription className="text-xs">
                  {customer.industry}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono bg-muted/40 text-xs font-semibold px-2 py-0.5 rounded">
                {customer.id}
              </Badge>
              <div className="flex items-center gap-2 relative">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${getStatusColor(customer.status)} pointer-events-none`} />
                <select
                  value={customer.status}
                  onChange={(e) => handleStatusChange(e.target.value as Customer["status"])}
                  className="flex h-8 w-[140px] items-center justify-between rounded-lg border border-border/70 bg-muted/20 pl-7 pr-3 py-1.5 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
                >
                  <option value="Lead">Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Active Client">Active Client</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
              <Globe className="w-4 h-4 text-primary" />
              <a href={customer.website} target="_blank" rel="noreferrer" className="truncate hover:underline text-primary">
                {customer.website || "No website"}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Primary Contact
              </p>
              <p className="text-sm font-medium text-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
                {customer.contactPerson}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Account Manager
              </p>
              <p className="text-sm font-medium text-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
                <Link to={`/employees/${customer.assignedEmployeeId}`} className="hover:underline text-primary">
                  {customer.assignedEmployeeName}
                </Link>
              </p>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Location
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2">
                 <MapPin className="w-4 h-4 text-muted-foreground" />
                 <span>{customer.address}, {customer.city}, {customer.country}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Industry
              </p>
              <p className="text-sm font-medium text-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                {customer.industry || "Not specified"}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Created At
              </p>
              <p className="text-sm font-medium text-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-2 font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="space-y-1.5 md:col-span-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Internal Notes
              </p>
              <div className="text-sm text-foreground border border-border/60 rounded-lg bg-muted/10 px-3 py-3 min-h-[80px]">
                {customer.notes || <span className="text-muted-foreground italic">No notes added.</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
