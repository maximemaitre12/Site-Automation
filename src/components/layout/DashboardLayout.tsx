import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { SidebarProvider, useSidebarState } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const { collapsed, toggle } = useSidebarState();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggle}
          className="bg-card border-border"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          collapsed ? "lg:pl-16" : "lg:pl-64",
          "pl-0" // Mobile: no padding, sidebar overlays
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
