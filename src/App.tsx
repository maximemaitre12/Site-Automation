import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth, RequireSubscription } from "@/hooks/useAuth";

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
import About from "./pages/company/About";
import Careers from "./pages/company/Careers";
import Blog from "./pages/company/Blog";
import Contact from "./pages/company/Contact";
import Products from "./pages/company/Products";

// Resources pages
import Documentation from "./pages/resources/Documentation";
import API from "./pages/resources/API";
import Status from "./pages/resources/Status";

// Legal pages
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Security from "./pages/legal/Security";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
            <Route path="/signup" element={<Navigate to="/auth?mode=signup" replace />} />
            
            {/* Company pages */}
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Resources pages */}
            <Route path="/resources/documentation" element={<Documentation />} />
            <Route path="/resources/api" element={<API />} />
            <Route path="/resources/status" element={<Status />} />
            
            {/* Legal pages */}
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/legal/security" element={<Security />} />

            {/* Legacy short paths (avoid 404s from old links) */}
            <Route path="/privacy" element={<Navigate to="/legal/privacy" replace />} />
            <Route path="/terms" element={<Navigate to="/legal/terms" replace />} />
            <Route path="/security" element={<Navigate to="/legal/security" replace />} />
            <Route path="/docs" element={<Navigate to="/resources/documentation" replace />} />
            <Route path="/api" element={<Navigate to="/resources/api" replace />} />
            <Route path="/status" element={<Navigate to="/resources/status" replace />} />
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

export default App;