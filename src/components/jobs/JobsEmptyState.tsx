import { BriefcaseBusiness } from "lucide-react";

interface JobsEmptyStateProps {
  title: string;
  description: string;
}

export function JobsEmptyState({ title, description }: JobsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card py-16 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
        <BriefcaseBusiness className="h-8 w-8" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
