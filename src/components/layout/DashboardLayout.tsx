import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { SidebarProvider, useSidebarState } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
  headerActions?: ReactNode;
}

function DashboardContent({ children, headerActions }: DashboardLayoutProps) {
  const { collapsed, toggle } = useSidebarState();

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

        {/* Mobile logo (visible when sidebar is hidden) */}
        <Link to="/dashboard" className={cn("flex items-center gap-2", collapsed ? "flex" : "flex lg:hidden")}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-[hsl(260_100%_65%)] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">AETHER</span>
        </Link>

        <div className="flex-1" />

        {/* Header Actions */}
        {headerActions && (
          <div className="flex items-center gap-2">
            {headerActions}
          </div>
        )}
      </header>

      <main
        className={cn(
          "transition-all duration-300 h-[calc(100vh-3.5rem)] pt-0 overflow-hidden",
          collapsed ? "lg:pl-16" : "lg:pl-64",
          "pl-0"
        )}
        style={{ marginTop: '3.5rem' }}
      >
        {children}
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

export function DashboardLayout({ children, headerActions }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardContent headerActions={headerActions}>{children}</DashboardContent>
    </SidebarProvider>
  );
}
