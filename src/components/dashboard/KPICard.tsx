import { useEffect, useState, type ReactNode } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

function useCountUp(target: number, duration: number, delay: number): number {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(0)
    const timeout = setTimeout(() => {
      const start = performance.now()
      const animate = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(target * eased))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, delay)
    return () => clearTimeout(timeout)
  }, [target, duration, delay])
  return count
}

interface KPICardProps {
  icon: ReactNode
  iconBg: string
  iconColor: string
  label: string
  value: number
  suffix?: string
  change?: string
  changePositive?: boolean
  description?: string
  delay?: number
}

export function KPICard({
  icon, iconBg, iconColor, label, value, suffix,
  change, changePositive, description, delay = 0,
}: KPICardProps) {
  const animated = useCountUp(value, 900, delay)

  return (
    <div
      className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default"
      aria-label={`${label}: ${value}${suffix ?? ""}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl", iconBg)}>
          <div className={cn("w-5 h-5", iconColor)}>{icon}</div>
        </div>
        {change && (
          <div className={cn(
            "flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
            changePositive
              ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "text-red-500 bg-red-50 dark:bg-red-500/10 dark:text-red-400"
          )}>
            {changePositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      {/* aria-hidden hides the animated number from screen readers; the aria-label on the container exposes the final value */}
      <div className="text-3xl font-bold tracking-tight text-foreground tabular-nums" aria-hidden="true">
        {animated}
        {suffix && <span className="text-base font-medium text-muted-foreground ml-0.5">{suffix}</span>}
      </div>
      <div className="text-sm font-medium text-muted-foreground mt-1.5">{label}</div>
      {description && <div className="text-xs text-muted-foreground/60 mt-0.5">{description}</div>}
    </div>
  )
}
