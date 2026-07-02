import { CheckCircle2 } from "lucide-react"

export function MockToast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="glass-panel rounded-xl border border-emerald-500/20 bg-card px-4 py-3 shadow-lg flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Success</p>
          <p className="text-xs text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  )
}
