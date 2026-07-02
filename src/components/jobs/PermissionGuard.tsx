import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

interface PermissionGuardProps {
  title: string
  description: string
}

export function PermissionGuard({ title, description }: PermissionGuardProps) {
  return (
    <div className="space-y-6 text-center py-12 select-none animate-in fade-in duration-300">
      <div className="max-w-md mx-auto bg-card border border-border/60 p-8 rounded-2xl shadow-sm space-y-4">
        <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground leading-normal">{description}</p>
        <Button asChild size="sm" className="rounded-lg">
          <Link to="/jobs">Back to Jobs</Link>
        </Button>
      </div>
    </div>
  )
}
