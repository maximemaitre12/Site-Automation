import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatItem {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  color?: string;
  bgColor?: string;
}

interface MobileStatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  compact?: boolean;
}

export function MobileStatsGrid({ stats, columns = 2, compact = false }: MobileStatsGridProps) {
  return (
    <div className={cn(
      "grid gap-2 md:gap-3",
      columns === 2 && "grid-cols-2",
      columns === 3 && "grid-cols-3",
      columns === 4 && "grid-cols-2 sm:grid-cols-4"
    )}>
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div 
            key={i} 
            className={cn(
              "rounded-xl md:rounded-2xl border border-border bg-card",
              compact ? "p-2.5 md:p-3" : "p-3 md:p-4"
            )}
          >
            <div className="flex items-center gap-2 md:gap-3">
              {Icon && (
                <div className={cn(
                  "shrink-0 rounded-lg md:rounded-xl flex items-center justify-center",
                  compact ? "w-8 h-8 md:w-9 md:h-9" : "w-9 h-9 md:w-10 md:h-10",
                  stat.bgColor || "bg-secondary"
                )}>
                  <Icon className={cn(
                    compact ? "w-4 h-4" : "w-4 h-4 md:w-5 md:h-5",
                    stat.color || "text-muted-foreground"
                  )} />
                </div>
              )}
              <div className="min-w-0">
                <p className={cn(
                  "font-bold tabular-nums text-foreground",
                  compact ? "text-base md:text-lg" : "text-lg md:text-2xl"
                )}>
                  {stat.value}
                </p>
                <p className={cn(
                  "text-muted-foreground truncate",
                  compact ? "text-[10px] md:text-xs" : "text-[11px] md:text-sm"
                )}>
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
