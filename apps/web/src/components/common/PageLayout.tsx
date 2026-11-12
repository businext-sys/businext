import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen w-full bg-background pt-14 md:pt-0">
      <div
        className={cn(
          "mx-auto max-w-7xl space-y-6 px-5 py-6 md:px-10 md:py-8",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-raised sm:flex">
          <Icon className="h-5 w-5 text-secondary" />
        </div>
        <div className="min-w-0">
          <h1 className="font-heading text-h2 font-bold text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-body-sm text-foreground-muted">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
