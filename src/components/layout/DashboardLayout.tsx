import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Database, Workflow, FileText, TrendingUp, Users, Brain, Shield, Settings, LogOut, LayoutDashboard, Plug } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AetherLogo } from "@/components/ui/aether-logo";

interface DashboardLayoutProps {
  children: ReactNode;
  headerActions?: ReactNode;
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
    icon: TrendingUp,
  },
  {
    label: "HR Copilot",
    description: "HR Assistant",
    path: "/tools/hr",
    icon: Users,
  },
  {
    label: "Brain",
    description: "Internal Assistant",
    path: "/tools/brain",
    icon: Brain,
  },
  {
    label: "Compliance",
    description: "Audit & Compliance",
    path: "/tools/compliance",
    icon: Shield,
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

export function DashboardLayout({ children, headerActions }: DashboardLayoutProps) {
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
    <div className="min-h-screen bg-background">
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

            {/* Logo - Center */}
            <Link to="/dashboard" className="absolute left-1/2 -translate-x-1/2 flex items-center">
              <AetherLogo size="sm" className="sm:hidden" />
              <AetherLogo size="md" className="hidden sm:block" />
            </Link>

            {/* Header Actions - Right side */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 max-w-[40%] overflow-hidden">
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
                    <span className="font-medium text-sm truncate">{item.label}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground truncate">{item.description}</span>
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
                  <span className="font-medium text-sm truncate">{item.label}</span>
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
      <main className="pt-12 sm:pt-14 min-h-screen">
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
