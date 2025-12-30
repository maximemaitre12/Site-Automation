import { ReactNode } from "react";
import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AgentCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconBg?: string;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  meta?: ReactNode;
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
}

export function AgentCard({
  title,
  subtitle,
  icon: Icon,
  iconBg = "bg-primary/10",
  badge,
  badgeVariant = "secondary",
  meta,
  actions,
  onClick,
  className,
  compact = false,
}: AgentCardProps) {
  const Wrapper = onClick ? "button" : "div";
  
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "group w-full text-left rounded-2xl bg-card border border-border/50 transition-all",
        compact ? "p-3" : "p-4",
        onClick && "cursor-pointer hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div
            className={cn(
              "rounded-xl flex items-center justify-center shrink-0",
              compact ? "w-9 h-9" : "w-11 h-11",
              iconBg
            )}
          >
            <Icon className={cn("text-primary", compact ? "w-4 h-4" : "w-5 h-5")} />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                "font-medium text-foreground truncate",
                compact ? "text-sm" : "text-base"
              )}
            >
              {title}
            </h4>
            {badge !== undefined && (
              <Badge variant={badgeVariant} className="shrink-0 text-xs">
                {badge}
              </Badge>
            )}
          </div>
          
          {subtitle && (
            <p
              className={cn(
                "text-muted-foreground truncate",
                compact ? "text-xs mt-0.5" : "text-sm mt-1"
              )}
            >
              {subtitle}
            </p>
          )}
          
          {meta && <div className="mt-2">{meta}</div>}
        </div>
        
        {onClick && !actions && (
          <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
        )}
        
        {actions && (
          <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {actions}
          </div>
        )}
      </div>
    </Wrapper>
  );
}

// Compact company/entity card for lists
interface EntityCardProps {
  name: string;
  description?: string;
  badges?: Array<{ label: string; variant?: "default" | "secondary" | "destructive" | "outline" }>;
  meta?: string[];
  verified?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

export function EntityCard({
  name,
  description,
  badges = [],
  meta = [],
  verified,
  onClick,
}: EntityCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left p-4 rounded-2xl bg-card border border-border/50 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        {/* Avatar/Icon */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
              {name}
            </h4>
            {verified && (
              <Badge className="bg-success/10 text-success border-success/20 shrink-0">
                Vérifié
              </Badge>
            )}
          </div>
          
          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
              {description}
            </p>
          )}
          
          {/* Meta info */}
          {meta.length > 0 && (
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
              {meta.slice(0, 3).map((item, i) => (
                <span key={i} className="truncate max-w-[120px]">{item}</span>
              ))}
            </div>
          )}
          
          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {badges.slice(0, 4).map((badge, i) => (
                <Badge
                  key={i}
                  variant={badge.variant || "outline"}
                  className="text-xs"
                >
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
      </div>
    </button>
  );
}
