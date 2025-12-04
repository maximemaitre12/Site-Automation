import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Flow from "./pages/tools/Flow";
import Docs from "./pages/tools/Docs";
import Sales from "./pages/tools/Sales";
import Finance from "./pages/tools/Finance";
import HR from "./pages/tools/HR";
import Support from "./pages/tools/Support";
import Insights from "./pages/tools/Insights";
import BrainPage from "./pages/tools/Brain";
import Compliance from "./pages/tools/Compliance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/flow" element={<Flow />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/hr" element={<HR />} />
          <Route path="/support" element={<Support />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/brain" element={<BrainPage />} />
          <Route path="/compliance" element={<Compliance />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
