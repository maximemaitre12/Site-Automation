import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "@/hooks/useAuth";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Tools
import Flow from "./pages/tools/Flow";
import Docs from "./pages/tools/Docs";
import Sales from "./pages/tools/Sales";
import Finance from "./pages/tools/Finance";
import HR from "./pages/tools/HR";
import Support from "./pages/tools/Support";
import Insights from "./pages/tools/Insights";
import BrainPage from "./pages/tools/Brain";
import Compliance from "./pages/tools/Compliance";

const queryClient = new QueryClient();

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
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
            <Route path="/signup" element={<Navigate to="/auth?mode=signup" replace />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/tools/flow" element={<RequireAuth><Flow /></RequireAuth>} />
            <Route path="/tools/docs" element={<RequireAuth><Docs /></RequireAuth>} />
            <Route path="/tools/sales" element={<RequireAuth><Sales /></RequireAuth>} />
            <Route path="/tools/finance" element={<RequireAuth><Finance /></RequireAuth>} />
            <Route path="/tools/hr" element={<RequireAuth><HR /></RequireAuth>} />
            <Route path="/tools/support" element={<RequireAuth><Support /></RequireAuth>} />
            <Route path="/tools/insights" element={<RequireAuth><Insights /></RequireAuth>} />
            <Route path="/tools/brain" element={<RequireAuth><BrainPage /></RequireAuth>} />
            <Route path="/tools/compliance" element={<RequireAuth><Compliance /></RequireAuth>} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
