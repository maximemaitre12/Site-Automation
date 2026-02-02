import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Database, Workflow, FileText, BarChart3, Users, MessageSquare, ShieldCheck, Settings, LogOut, LayoutDashboard, Plug, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AetherLogo } from "@/components/ui/aether-logo";

interface DashboardLayoutProps {
  children: ReactNode;
  headerActions?: ReactNode;
  toolName?: string;
  toolDescription?: string;
  toolIcon?: ReactNode;
  showAIBadge?: boolean;
}

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "AETHER Data",
    description: "Data Platform",
    path: "/tools/data",
    icon: Database,
  },
  {
    label: "AETHER Flow",
    description: "Workflow Orchestrator",
    path: "/tools/flow",
    icon: Workflow,
    colorClass: "text-agent-flow",
  },
  {
    label: "AETHER Doc",
    description: "Document Management",
    path: "/tools/doc",
    icon: FileText,
  },
  {
    label: "Sales Copilot",
    description: "Sales Assistant",
    path: "/tools/sales",
    icon: BarChart3,
    colorClass: "text-agent-sales",
  },
  {
    label: "HR Copilot",
    description: "HR Assistant",
    path: "/tools/hr",
    icon: Users,
    colorClass: "text-agent-hr",
  },
  {
    label: "Brain",
    description: "Internal Assistant",
    path: "/tools/brain",
    icon: Database,
    colorClass: "text-agent-brain",
  },
  {
    label: "Support",
    description: "Customer Support",
    path: "/tools/support",
    icon: MessageSquare,
    colorClass: "text-agent-support",
  },
  {
    label: "Compliance",
    description: "Audit & Compliance",
    path: "/tools/compliance",
    icon: ShieldCheck,
    colorClass: "text-agent-compliance",
  },
];

const settingsItems = [
  {
    label: "Company Settings",
    path: "/settings/company",
    icon: Settings,
  },
  {
    label: "Intégrations",
    path: "/settings/integrations",
    icon: Plug,
  },
];

export function DashboardLayout({ children, headerActions, toolName, toolDescription, toolIcon, showAIBadge }: DashboardLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-[100dvh] bg-background overflow-hidden overscroll-none">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="px-3 sm:px-4 md:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14">
            {/* Menu Button - Left side */}
            <button
              className="p-1.5 sm:p-2 rounded-lg hover:bg-muted/50 transition-colors shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Center - Logo or Tool Name */}
            <Link to="/dashboard" className="absolute left-1/2 -translate-x-1/2 flex items-center">
              {location.pathname === '/tools/flow' ? (
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  <span className="text-foreground">AETHER</span>
                  <span className="text-agent-flow ml-1">Flow</span>
                </span>
              ) : location.pathname === '/tools/support' ? (
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  <span className="text-foreground">Aether</span>
                  <span className="text-agent-support ml-1">Support</span>
                </span>
              ) : location.pathname === '/tools/brain' ? (
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  <span className="text-foreground">Aether</span>
                  <span className="text-agent-brain ml-1">Brain</span>
                </span>
              ) : location.pathname === '/tools/hr' ? (
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  <span className="text-foreground">Aether</span>
                  <span className="text-agent-hr ml-1">HR</span>
                </span>
              ) : location.pathname === '/tools/sales' ? (
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  <span className="text-foreground">Aether</span>
                  <span className="text-agent-sales ml-1">Sales</span>
                </span>
              ) : location.pathname === '/tools/doc' ? (
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  <span className="text-foreground">Aether</span>
                  <span className="text-primary ml-1">Doc</span>
                </span>
              ) : location.pathname === '/tools/data' ? (
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  <span className="text-foreground">Aether</span>
                  <span className="text-agent-data ml-1">Data</span>
                </span>
              ) : location.pathname === '/tools/compliance' ? (
                <span className="text-lg sm:text-xl font-bold tracking-tight">
                  <span className="text-foreground">Aether</span>
                  <span className="text-agent-compliance ml-1">Compliance</span>
                </span>
              ) : (
                <>
                  <AetherLogo size="md" className="sm:hidden" />
                  <AetherLogo size="lg" className="hidden sm:block" />
                </>
              )}
            </Link>

            {/* Header Actions - Right side */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {headerActions}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-12 sm:top-14 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border shadow-xl animate-fade-in max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <nav className="p-3 sm:p-4 space-y-1">
              {/* Main Menu Items */}
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors",
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-xs sm:text-sm leading-tight whitespace-normal break-words">{item.label}</span>
                    {item.description && (
                      <span className="text-[11px] sm:text-xs text-muted-foreground leading-tight whitespace-normal break-words">{item.description}</span>
                    )}
                  </div>
                </Link>
              ))}

              {/* Separator */}
              <div className="border-t border-border my-2 sm:my-3" />

              {/* Settings Section */}
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 sm:px-4 py-2">
                Settings
              </div>
              {settingsItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors",
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-xs sm:text-sm leading-tight whitespace-normal break-words">{item.label}</span>
                </Link>
              ))}

              {/* Sign Out */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignOut();
                }}
                className="flex items-center gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-destructive hover:bg-destructive/10 w-full"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span className="font-medium text-sm">Sign out</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="mt-12 sm:mt-14 h-[calc(100dvh-3rem)] sm:h-[calc(100dvh-3.5rem)] overflow-hidden flex flex-col overscroll-none">
        {children}
      </main>

      {/* Overlay for menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          style={{ top: '3rem' }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}
