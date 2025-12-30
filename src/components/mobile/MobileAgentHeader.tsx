import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MobileAgentHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  accentColor: string;
  actions?: ReactNode;
  stats?: Array<{
    value: string | number;
    label: string;
    color?: string;
  }>;
}

export function MobileAgentHeader({
  icon: Icon,
  title,
  subtitle,
  accentColor,
  actions,
  stats
}: MobileAgentHeaderProps) {
  return (
    <header className="shrink-0 border-b border-border bg-card/50">
      {/* Main header row */}
      <div className="px-3 py-2.5 md:px-6 md:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
          <div className={cn(
            "w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0",
            `${accentColor}/10 border ${accentColor}/20`
          )}>
            <Icon className={cn("w-4.5 h-4.5 md:w-6 md:h-6", accentColor.replace('bg-', 'text-'))} />
          </div>
          <div className="min-w-0">
            <h1 className="text-base md:text-xl font-bold text-foreground truncate">{title}</h1>
            {subtitle && (
              <p className="text-[11px] md:text-sm text-muted-foreground hidden sm:block truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="shrink-0 flex items-center gap-1.5">
            {actions}
          </div>
        )}
      </div>
      
      {/* Compact stats row for mobile */}
      {stats && stats.length > 0 && (
        <div className="px-3 pb-2.5 md:px-6 md:pb-4 flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-1.5 shrink-0">
              <span className={cn("text-sm md:text-lg font-bold tabular-nums", stat.color || "text-foreground")}>
                {stat.value}
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
