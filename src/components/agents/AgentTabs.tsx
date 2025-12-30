import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

interface AgentTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: "pills" | "underline";
  size?: "sm" | "md";
}

export function AgentTabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "pills",
  size = "md",
}: AgentTabsProps) {
  if (variant === "underline") {
    return (
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className="ml-1"
                >
                  {tab.count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-full font-medium transition-all whitespace-nowrap",
              size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            )}
          >
            {Icon && <Icon className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <Badge
                variant={isActive ? "secondary" : "outline"}
                className={cn(
                  "ml-0.5",
                  size === "sm" ? "text-[10px] h-4 px-1" : "text-xs"
                )}
              >
                {tab.count}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
