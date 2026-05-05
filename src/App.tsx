import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth, RequireSubscription, RequireCompany } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/ScrollToTop";
import { BlockLibraryProvider } from "@/contexts/BlockLibraryContext";
import PublicLayout from "@/components/layout/PublicLayout";

// Pages
import Landing from "./pages/Landing";
import Demo from "./pages/Demo";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import SelectPlan from "./pages/SelectPlan";
import CompanySettings from "./pages/settings/CompanySettings";
import Integrations from "./pages/settings/Integrations";
import DemoRequests from "./pages/admin/DemoRequests";

// Tools
import Flow from "./pages/tools/Flow";
import DocPage from "./pages/tools/Doc";
import Sales from "./pages/tools/Sales";
import HR from "./pages/tools/HR";
import Support from "./pages/tools/Support";
import BrainPage from "./pages/tools/Brain";
import Compliance from "./pages/tools/ComplianceAuto";
import Data from "./pages/tools/Data";
import Executive from "./pages/tools/Executive";

// Company pages
import Blog from "./pages/company/Blog";
import Contact from "./pages/company/Contact";

// Resources pages
import Documentation from "./pages/resources/Documentation";

// Legal pages
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Security from "./pages/legal/Security";
import LegalNotice from "./pages/legal/LegalNotice";
import BraceletCGU from "./pages/legal/BraceletCGU";

// Product pages
import Bracelet from "./pages/Bracelet";

// Product Tour
import ProductTour from "./pages/ProductTour";
import SupplyChain from "./pages/SupplyChain";

// Farmasoft
import FarmasoftApp from "./farmasoft/FarmasoftApp";

// OAuth callbacks
import GoogleCallback from "./pages/oauth/GoogleCallback";

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
          <BlockLibraryProvider>
            <Routes>
              {/* Public routes with shared header/footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Bracelet />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/supply" element={<SupplyChain />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/resources/documentation" element={<Documentation />} />
                <Route path="/legal/privacy" element={<Privacy />} />
                <Route path="/legal/terms" element={<Terms />} />
                <Route path="/legal/security" element={<Security />} />
                <Route path="/legal/mentions" element={<LegalNotice />} />
                <Route path="/legal/bracelet-cgu" element={<BraceletCGU />} />
                <Route path="/bracelet" element={<Bracelet />} />
                <Route path="/platform" element={<Landing />} />
              </Route>

              {/* Product Tour (own layout) */}
              <Route path="/product-tour" element={<ProductTour />} />

              {/* Farmasoft (own layout) */}
              <Route path="/farmasoft" element={<FarmasoftApp />} />

              {/* Auth (no shared layout) */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
              <Route path="/signup" element={<Navigate to="/auth?mode=signup" replace />} />
              
              {/* Redirects */}
              <Route path="/index" element={<Navigate to="/" replace />} />
              <Route path="/about" element={<Navigate to="/" replace />} />
              <Route path="/privacy" element={<Navigate to="/legal/privacy" replace />} />
              <Route path="/terms" element={<Navigate to="/legal/terms" replace />} />
              <Route path="/security" element={<Navigate to="/legal/security" replace />} />
              <Route path="/docs" element={<Navigate to="/resources/documentation" replace />} />
              
              {/* OAuth callbacks */}
              <Route path="/oauth/google/callback" element={<GoogleCallback />} />
              {/* Protected routes - require subscription AND company */}
              <Route path="/dashboard" element={<RequireCompany><Dashboard /></RequireCompany>} />
              <Route path="/tools/flow" element={<RequireCompany><Flow /></RequireCompany>} />
              <Route path="/tools/doc" element={<RequireCompany><DocPage /></RequireCompany>} />
              <Route path="/tools/sales" element={<RequireCompany><Sales /></RequireCompany>} />
              <Route path="/tools/hr" element={<RequireCompany><HR /></RequireCompany>} />
              <Route path="/tools/support" element={<RequireCompany><Support /></RequireCompany>} />
              <Route path="/tools/brain" element={<RequireCompany><BrainPage /></RequireCompany>} />
              <Route path="/tools/compliance" element={<RequireCompany><Compliance /></RequireCompany>} />
              <Route path="/tools/data" element={<RequireCompany><Data /></RequireCompany>} />
              <Route path="/tools/executive" element={<RequireCompany><Executive /></RequireCompany>} />
              <Route path="/onboarding" element={<RequireSubscription><Onboarding /></RequireSubscription>} />
              <Route path="/select-plan" element={<RequireAuth><SelectPlan /></RequireAuth>} />
              <Route path="/settings/company" element={<RequireCompany><CompanySettings /></RequireCompany>} />
              <Route path="/settings/api-keys" element={<Navigate to="/settings/integrations" replace />} />
              <Route path="/settings/integrations" element={<RequireCompany><Integrations /></RequireCompany>} />
              
              {/* Admin routes */}
              <Route path="/admin/demo-requests" element={<RequireAuth><DemoRequests /></RequireAuth>} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BlockLibraryProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;