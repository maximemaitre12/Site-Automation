import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { SidebarProvider, useSidebarState } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles, Workflow, Brain, HeadphonesIcon, Users, Shield, TrendingUp, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

const toolNames: Record<string, { name: string; icon: React.ElementType }> = {
  '/tools/flow': { name: 'AETHER Flow', icon: Workflow },
  '/tools/brain': { name: 'AETHER Brain', icon: Brain },
  '/tools/support': { name: 'AETHER Support', icon: HeadphonesIcon },
  '/tools/hr': { name: 'AETHER HR', icon: Users },
  '/tools/compliance': { name: 'AETHER Compliance', icon: Shield },
  '/tools/sales': { name: 'AETHER Sales', icon: TrendingUp },
  '/dashboard': { name: 'Dashboard', icon: LayoutDashboard },
  '/settings': { name: 'Paramètres', icon: Sparkles },
};

function DashboardContent({ children }: DashboardLayoutProps) {
  const { collapsed, toggle } = useSidebarState();
  const location = useLocation();
  
  // Get current tool info based on route
  const currentTool = Object.entries(toolNames).find(([path]) => 
    location.pathname.startsWith(path)
  );
  const toolInfo = currentTool?.[1] || { name: 'AETHER', icon: Sparkles };
  const ToolIcon = toolInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Top Header Bar */}
      <header
        className={cn(
          "fixed top-0 right-0 z-30 h-14 bg-card/80 backdrop-blur-md border-b border-border transition-all duration-300 flex items-center px-4 gap-4",
          collapsed ? "left-0 lg:left-16" : "left-0 lg:left-64"
        )}
      >
        {/* Menu toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="hover:bg-primary/10"
        >
          <Menu className="w-5 h-5" />
        </Button>

      </header>

      <main
        className={cn(
          "transition-all duration-300 min-h-screen pt-14",
          collapsed ? "lg:pl-16" : "lg:pl-64",
          "pl-0"
        )}
      >
        <div className="min-h-screen">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggle}
        />
      )}
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
