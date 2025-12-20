import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "@/hooks/useAuth";

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

// Tools
import Flow from "./pages/tools/Flow";
import DocPage from "./pages/tools/Doc";
import Sales from "./pages/tools/Sales";
import HR from "./pages/tools/HR";
import Support from "./pages/tools/Support";
import BrainPage from "./pages/tools/Brain";
import Compliance from "./pages/tools/Compliance";
import Data from "./pages/tools/Data";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
      gcTime: 1000 * 60 * 30, // 30 minutes cache
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
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/tools/flow" element={<RequireAuth><Flow /></RequireAuth>} />
            <Route path="/tools/doc" element={<RequireAuth><DocPage /></RequireAuth>} />
            <Route path="/tools/sales" element={<RequireAuth><Sales /></RequireAuth>} />
            <Route path="/tools/hr" element={<RequireAuth><HR /></RequireAuth>} />
            <Route path="/tools/support" element={<RequireAuth><Support /></RequireAuth>} />
            <Route path="/tools/brain" element={<RequireAuth><BrainPage /></RequireAuth>} />
            <Route path="/tools/compliance" element={<RequireAuth><Compliance /></RequireAuth>} />
            <Route path="/tools/data" element={<RequireAuth><Data /></RequireAuth>} />
            <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
            <Route path="/select-plan" element={<RequireAuth><SelectPlan /></RequireAuth>} />
            <Route path="/settings/company" element={<RequireAuth><CompanySettings /></RequireAuth>} />
            <Route path="/settings/api-keys" element={<RequireAuth><ApiKeys /></RequireAuth>} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
