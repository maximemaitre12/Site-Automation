import { ReactNode, useState } from "react";
import { LucideIcon, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface AgentSection {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  badgeVariant?: "default" | "secondary" | "destructive";
}

interface AgentLayoutProps {
  icon: LucideIcon;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  accentColor: string;
  sections: AgentSection[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  headerActions?: ReactNode;
  sidebarContent?: ReactNode;
  children: ReactNode;
  hideIcon?: boolean;
}

export function AgentLayout({
  icon: Icon,
  title,
  titleHighlight,
  subtitle,
  accentColor,
  sections,
  activeSection,
  onSectionChange,
  headerActions,
  sidebarContent,
  children,
  hideIcon,
}: AgentLayoutProps) {
  const activeItem = sections.find((s) => s.id === activeSection);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Modern Header */}
      <header className="shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="px-4 md:px-6 py-4 md:py-5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
              {!hideIcon && (
                <div
                  className={cn(
                    "w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                    `bg-gradient-to-br from-${accentColor.replace('bg-', '')} to-${accentColor.replace('bg-', '')}/80`
                  )}
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--${accentColor.replace('bg-', '')})) 0%, hsl(var(--${accentColor.replace('bg-', '')}) / 0.8) 100%)`,
                  }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight truncate">
                  <span className="text-foreground">{title}</span>
                  {titleHighlight && (
                    <span 
                      className="ml-1.5"
                      style={{ color: `hsl(var(--${accentColor.replace('bg-', '')}))` }}
                    >
                      {titleHighlight}
                    </span>
                  )}
                </h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground hidden md:block truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {headerActions}
            </div>
          </div>

          {/* Mobile Section Selector - Apple style pill */}
          <div className="mt-4 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-12 rounded-xl bg-secondary/50 border-border/50 hover:bg-secondary"
                >
                  <div className="flex items-center gap-3">
                    {activeItem && (
                      <>
                        <activeItem.icon className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{activeItem.label}</span>
                        {activeItem.badge !== undefined && (
                          <Badge
                            variant={activeItem.badgeVariant || "secondary"}
                            className="ml-1"
                          >
                            {activeItem.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-md" align="start">
                {sections.map((section) => (
                  <DropdownMenuItem
                    key={section.id}
                    onClick={() => onSectionChange(section.id)}
                    className="flex items-center justify-between py-3 px-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <section.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{section.label}</span>
                      {section.badge !== undefined && (
                        <Badge
                          variant={section.badgeVariant || "secondary"}
                          className="ml-1"
                        >
                          {section.badge}
                        </Badge>
                      )}
                    </div>
                    {activeSection === section.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar - Apple style */}
        <aside className="hidden md:flex w-56 lg:w-64 shrink-0 flex-col border-r border-border/50 bg-secondary/30">
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <section.icon
                    className={cn(
                      "w-5 h-5 shrink-0 transition-colors",
                      isActive && "text-primary"
                    )}
                  />
                  <span className="truncate">{section.label}</span>
                  {section.badge !== undefined && (
                    <Badge
                      variant={isActive ? "default" : section.badgeVariant || "secondary"}
                      className="ml-auto shrink-0"
                    >
                      {section.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
          
          {/* Sidebar extra content */}
          {sidebarContent && (
            <div className="p-3 border-t border-border/50">
              {sidebarContent}
            </div>
          )}
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Section header component for content areas
export function AgentSectionHeader({
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
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground truncate">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground truncate">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// Modern stat card
export function AgentStatCard({
  icon: Icon,
  value,
  label,
  trend,
  trendUp,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trendUp
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// Modern list item card
export function AgentListCard({
  icon: Icon,
  title,
  subtitle,
  meta,
  badge,
  badgeVariant,
  onClick,
  actions,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  onClick?: () => void;
  actions?: ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group p-4 rounded-2xl bg-card border border-border/50 transition-all",
        onClick && "cursor-pointer hover:shadow-md hover:border-border active:scale-[0.99]"
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground truncate">{title}</h4>
            {badge !== undefined && (
              <Badge variant={badgeVariant || "secondary"} className="shrink-0">
                {badge}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5 truncate">{subtitle}</p>
          )}
          {meta && <div className="mt-2">{meta}</div>}
        </div>
        {actions && (
          <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// Empty state
export function AgentEmptyState({
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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
