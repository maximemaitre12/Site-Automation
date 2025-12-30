import { cn } from "@/lib/utils";
import { LucideIcon, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  onClick?: () => void;
  accentColor?: string;
  showArrow?: boolean;
  compact?: boolean;
}

export function MobileFeatureCard({
  icon: Icon,
  title,
  description,
  badge,
  badgeVariant = "secondary",
  onClick,
  accentColor = "bg-primary",
  showArrow = true,
  compact = false
}: MobileFeatureCardProps) {
  const iconBgClass = accentColor.replace('bg-', 'bg-') + '/10';
  const iconTextClass = accentColor.replace('bg-', 'text-');
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 rounded-xl border border-border bg-card transition-all active:scale-[0.98]",
        "hover:border-border/80 hover:shadow-sm",
        compact ? "p-2.5" : "p-3 md:p-4"
      )}
    >
      <div className={cn(
        "shrink-0 rounded-lg flex items-center justify-center",
        compact ? "w-9 h-9" : "w-10 h-10 md:w-11 md:h-11",
        iconBgClass
      )}>
        <Icon className={cn(
          compact ? "w-4 h-4" : "w-5 h-5",
          iconTextClass
        )} />
      </div>
      
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-medium text-foreground truncate",
            compact ? "text-sm" : "text-sm md:text-base"
          )}>
            {title}
          </span>
          {badge !== undefined && (
            <Badge variant={badgeVariant} className="text-[10px] h-5 px-1.5 shrink-0">
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className={cn(
            "text-muted-foreground truncate mt-0.5",
            compact ? "text-[10px]" : "text-xs"
          )}>
            {description}
          </p>
        )}
      </div>
      
      {showArrow && (
        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
      )}
    </button>
  );
}
