import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth, RequireSubscription } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/ScrollToTop";

// Pages
import Landing from "./pages/Landing";
import Demo from "./pages/Demo";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import SelectPlan from "./pages/SelectPlan";
import CompanySettings from "./pages/settings/CompanySettings";
import ApiKeys from "./pages/settings/ApiKeys";
import Integrations from "./pages/settings/Integrations";
import DemoRequests from "./pages/admin/DemoRequests";

// Tools
import Flow from "./pages/tools/Flow";
import DocPage from "./pages/tools/Doc";
import Sales from "./pages/tools/Sales";
import HR from "./pages/tools/HR";
import Support from "./pages/tools/Support";
import BrainPage from "./pages/tools/Brain";
import Compliance from "./pages/tools/Compliance";
import Data from "./pages/tools/Data";

// Company pages
import Blog from "./pages/company/Blog";
import Contact from "./pages/company/Contact";

// Resources pages
import Documentation from "./pages/resources/Documentation";

// Legal pages
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Security from "./pages/legal/Security";

// Product Tour
import ProductTour from "./pages/ProductTour";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

// Detect Internet Explorer (unsupported)
const isIE = typeof document !== 'undefined' && !!(document as any).documentMode;

const App = () => {
  if (isIE) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Navigateur non supporté</h1>
          <p className="text-muted-foreground mb-4">
            AETHER nécessite un navigateur moderne. 
            Veuillez utiliser Chrome, Firefox, Safari ou Edge.
          </p>
        </div>
      </div>
    );
  }

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/product-tour" element={<ProductTour />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
            <Route path="/signup" element={<Navigate to="/auth?mode=signup" replace />} />
            
            {/* Company pages */}
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Resources pages */}
            <Route path="/resources/documentation" element={<Documentation />} />
            
            {/* Legal pages */}
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/legal/security" element={<Security />} />

            {/* Legacy short paths (avoid 404s from old links) */}
            <Route path="/privacy" element={<Navigate to="/legal/privacy" replace />} />
            <Route path="/terms" element={<Navigate to="/legal/terms" replace />} />
            <Route path="/security" element={<Navigate to="/legal/security" replace />} />
            <Route path="/docs" element={<Navigate to="/resources/documentation" replace />} />
            {/* Protected routes - require subscription */}
            <Route path="/dashboard" element={<RequireSubscription><Dashboard /></RequireSubscription>} />
            <Route path="/tools/flow" element={<RequireSubscription><Flow /></RequireSubscription>} />
            <Route path="/tools/doc" element={<RequireSubscription><DocPage /></RequireSubscription>} />
            <Route path="/tools/sales" element={<RequireSubscription><Sales /></RequireSubscription>} />
            <Route path="/tools/hr" element={<RequireSubscription><HR /></RequireSubscription>} />
            <Route path="/tools/support" element={<RequireSubscription><Support /></RequireSubscription>} />
            <Route path="/tools/brain" element={<RequireSubscription><BrainPage /></RequireSubscription>} />
            <Route path="/tools/compliance" element={<RequireSubscription><Compliance /></RequireSubscription>} />
            <Route path="/tools/data" element={<RequireSubscription><Data /></RequireSubscription>} />
            <Route path="/onboarding" element={<RequireSubscription><Onboarding /></RequireSubscription>} />
            <Route path="/select-plan" element={<RequireAuth><SelectPlan /></RequireAuth>} />
            <Route path="/settings/company" element={<RequireSubscription><CompanySettings /></RequireSubscription>} />
            <Route path="/settings/api-keys" element={<RequireSubscription><ApiKeys /></RequireSubscription>} />
            <Route path="/settings/integrations" element={<RequireSubscription><Integrations /></RequireSubscription>} />
            
            {/* Admin routes */}
            <Route path="/admin/demo-requests" element={<RequireAuth><DemoRequests /></RequireAuth>} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;