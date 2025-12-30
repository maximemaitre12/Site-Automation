import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface MobileTabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface MobileTabBarProps {
  items: MobileTabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  accentColor?: string;
}

export function MobileTabBar({ 
  items, 
  activeTab, 
  onTabChange,
  accentColor = "bg-primary"
}: MobileTabBarProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-14 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <span className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full", accentColor)} />
              )}
              <div className="relative">
                <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={cn("text-[10px] font-medium truncate max-w-[60px]", isActive && "font-semibold")}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
