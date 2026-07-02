import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdminActionButtonProps {
  label: string
  icon: ReactNode
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
  className?: string
}

export function AdminActionButton({ label, icon, onClick, disabled, destructive, className }: AdminActionButtonProps) {
  return (
    <div className="relative group/action">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onClick}
        disabled={disabled}
        title={label}
        aria-label={label}
        className={cn(
          "rounded-lg border border-transparent hover:border-border/60 hover:bg-muted/60",
          destructive && "hover:bg-destructive/10 hover:text-destructive",
          className
        )}
      >
        {icon}
      </Button>
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[10px] text-popover-foreground shadow-md group-hover/action:block">
        {label}
      </span>
    </div>
  )
}
