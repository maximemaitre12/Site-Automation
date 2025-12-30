import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

interface AgentStatsProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  compact?: boolean;
}

export function AgentStats({ stats, columns = 4, compact = false }: AgentStatsProps) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-2 md:grid-cols-4"
      )}
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={cn(
              "rounded-2xl bg-secondary/50 border border-border/50",
              compact ? "p-3" : "p-4"
            )}
          >
            <div className="flex items-start justify-between">
              {Icon && (
                <div
                  className={cn(
                    "rounded-xl flex items-center justify-center",
                    compact ? "w-8 h-8" : "w-10 h-10",
                    stat.color ? `bg-${stat.color}/10` : "bg-primary/10"
                  )}
                >
                  <Icon
                    className={cn(
                      compact ? "w-4 h-4" : "w-5 h-5",
                      stat.color ? `text-${stat.color}` : "text-primary"
                    )}
                  />
                </div>
              )}
              {stat.trend && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    stat.trendUp
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {stat.trend}
                </span>
              )}
            </div>
            <div className={cn(Icon ? "mt-3" : "")}>
              <p
                className={cn(
                  "font-bold text-foreground tabular-nums",
                  compact ? "text-xl" : "text-2xl"
                )}
              >
                {stat.value}
              </p>
              <p
                className={cn(
                  "text-muted-foreground",
                  compact ? "text-xs mt-0.5" : "text-sm mt-1"
                )}
              >
                {stat.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Inline stats for mobile headers
export function AgentInlineStats({
  stats,
}: {
  stats: Array<{ value: string | number; label: string; color?: string }>;
}) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide py-1">
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-1.5 shrink-0">
          <span
            className={cn(
              "text-base font-bold tabular-nums",
              stat.color || "text-foreground"
            )}
          >
            {stat.value}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
