import type { ReactNode } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface JobsStatCardProps {
  title: string;
  value: number;
  description: string;
  trend: string;
  icon: ReactNode;
  iconClassName: string;
}

export function JobsStatCard({
  title,
  value,
  description,
  trend,
  icon,
  iconClassName,
}: JobsStatCardProps) {
  return (
    <Card className="glass-card border border-border/60 shadow-sm hover:-translate-y-0.5 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", iconClassName)}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
          <span className="text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
