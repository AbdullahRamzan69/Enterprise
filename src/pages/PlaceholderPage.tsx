import { Construction, Sparkles, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PlaceholderPageProps {
  title: string
  description?: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title} Module
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {description || `Operational overview for ${title}`}
        </p>
      </div>

      {/* Main Content Notification */}
      <Card className="glass-card shadow-sm border border-dashed border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <CardContent className="p-8 md:p-12 flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <Construction className="w-8 h-8 animate-bounce" />
          </div>

          <div className="max-w-md space-y-3">
            <h2 className="text-xl font-bold text-foreground">
              Module Configured & Standardized
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The <span className="font-semibold text-foreground">{title}</span> management layout and navigation bindings have been integrated into the Aethel EBMS core shell.
            </p>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              The fully interactive CRM data visualizers, report builders, databases, and automated workflows for this screen are scheduled for the next development iteration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg text-xs">
              <Link to="/dashboard">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Return to Workspace
              </Link>
            </Button>
            <Button variant="outline" className="border-border/60 hover:bg-muted text-foreground text-xs rounded-lg">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Request Early Access
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wireframe Mockup UI to look beautiful */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 opacity-40 select-none pointer-events-none">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="w-24 h-4 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="w-12 h-8 bg-muted rounded animate-pulse" />
            <div className="w-32 h-3 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="w-24 h-4 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="w-12 h-8 bg-muted rounded animate-pulse" />
            <div className="w-32 h-3 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="w-24 h-4 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="w-12 h-8 bg-muted rounded animate-pulse" />
            <div className="w-32 h-3 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
