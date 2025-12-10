import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Workflow,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  HeadphonesIcon,
  BarChart3,
  Brain,
  Shield,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
  LogOut,
  Building2,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSidebarState } from "@/hooks/useSidebar";
import { toast } from "sonner";

const tools = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "AETHER Data", path: "/tools/data", icon: BarChart3, description: "Data Platform" },
  { name: "AETHER CRM", path: "/tools/crm", icon: DollarSign, description: "Sales CRM" },
  { name: "AETHER Flow", path: "/tools/flow", icon: Workflow, description: "Workflow Orchestrator" },
  { name: "AETHER Doc", path: "/tools/doc", icon: FileText, description: "Document Management" },
  { name: "Sales Copilot", path: "/tools/sales", icon: TrendingUp, description: "Sales Assistant" },
  { name: "HR Copilot", path: "/tools/hr", icon: Users, description: "HR Assistant" },
  { name: "Brain", path: "/tools/brain", icon: Brain, description: "Internal Assistant" },
  { name: "Compliance", path: "/tools/compliance", icon: Shield, description: "Audit & Compliance" },
];

const settingsLinks = [
  { name: "Company Settings", path: "/settings/company", icon: Building2 },
  { name: "API Keys", path: "/settings/api-keys", icon: Settings },
];

export function Sidebar() {
  const { collapsed, toggle } = useSidebarState();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        // Desktop: normal behavior
        "lg:translate-x-0",
        collapsed ? "lg:w-16 w-64" : "lg:w-64 w-64",
        // Mobile: slide in/out
        collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(260_100%_65%)] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-foreground">AETHER</span>
          )}
        </NavLink>
        {/* Close button on mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="lg:hidden"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {tools.map((tool) => {
            const isActive = location.pathname === tool.path;
            return (
              <NavLink
                key={tool.path}
                to={tool.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                <tool.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {!collapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">{tool.name}</span>
                    {tool.description && (
                      <span className="text-xs text-muted-foreground truncate">{tool.description}</span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Settings Section */}
        <div className="mt-6 pt-4 border-t border-sidebar-border">
          {!collapsed && (
            <span className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Settings</span>
          )}
          <div className="mt-2 space-y-1">
            {settingsLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">{item.name}</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User section */}
      <div className="p-2 border-t border-sidebar-border space-y-2">
        {user && !collapsed && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">
            {user.email}
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="ml-2">Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}