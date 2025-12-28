import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, AlertCircle, CheckCircle, Clock } from "lucide-react";
import agentSupportLogo from "@/assets/agent-support.png";

const tickets = [
  { id: "#4521", subject: "Login issues after update", category: "Bug", priority: "high", status: "open", time: "5 min ago" },
  { id: "#4520", subject: "Billing question - invoice discrepancy", category: "Billing", priority: "medium", status: "ai-response", time: "12 min ago" },
  { id: "#4519", subject: "Feature request: Dark mode", category: "Feature", priority: "low", status: "closed", time: "1 hour ago" },
  { id: "#4518", subject: "Cannot export data to CSV", category: "Bug", priority: "high", status: "open", time: "2 hours ago" },
];

const stats = [
  { label: "Open Tickets", value: "23", icon: MessageSquare, color: "text-warning" },
  { label: "AI Resolved", value: "156", icon: Sparkles, color: "text-[hsl(var(--agent-support))]" },
  { label: "Avg. Response", value: "2.3m", icon: Clock, color: "text-success" },
];

export default function Support() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-3 md:px-8 py-3 md:py-6 border-b border-border shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center overflow-hidden shrink-0">
                <img src={agentSupportLogo} alt="Support" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Support Copilot</h1>
                <p className="text-muted-foreground text-xs md:text-sm hidden md:block">Ticket classification and automated response generation</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mt-3 md:mt-6">
            {stats.map((stat) => (
              <div key={stat.label} className="p-2.5 md:p-4 rounded-xl bg-card border border-border flex items-center gap-2 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-base md:text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] md:text-sm text-muted-foreground truncate">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-3 md:p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-base md:text-lg font-semibold text-foreground">Recent Tickets</h2>
            <Button variant="outline" size="sm" className="h-8 text-xs md:text-sm">View All</Button>
          </div>

          <div className="space-y-2 md:space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-3 md:p-4 rounded-xl bg-card border border-border hover:border-[hsl(var(--agent-support))]/30 transition-all">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    ticket.priority === "high" ? "bg-destructive/20" :
                    ticket.priority === "medium" ? "bg-warning/20" :
                    "bg-muted"
                  }`}>
                    {ticket.status === "closed" 
                      ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-success" />
                      : ticket.status === "ai-response"
                      ? <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[hsl(var(--agent-support))]" />
                      : <AlertCircle className={`w-4 h-4 md:w-5 md:h-5 ${ticket.priority === "high" ? "text-destructive" : "text-warning"}`} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                      <span className="text-xs md:text-sm font-mono text-muted-foreground">{ticket.id}</span>
                      <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded bg-secondary text-muted-foreground">{ticket.category}</span>
                    </div>
                    <h3 className="font-medium text-foreground text-sm md:text-base truncate">{ticket.subject}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${
                      ticket.status === "open" ? "bg-warning/20 text-warning" :
                      ticket.status === "ai-response" ? "bg-[hsl(var(--agent-support))]/20 text-[hsl(var(--agent-support))]" :
                      "bg-success/20 text-success"
                    }`}>
                      {ticket.status === "ai-response" ? "AI Ready" : ticket.status}
                    </span>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">{ticket.time}</p>
                  </div>
                </div>
                
                {ticket.status === "ai-response" && (
                  <div className="mt-2 md:mt-3 p-2 md:p-3 rounded-lg bg-[hsl(var(--agent-support))]/5 border border-[hsl(var(--agent-support))]/20">
                    <p className="text-xs md:text-sm text-foreground">
                      <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 inline mr-1.5 md:mr-2 text-[hsl(var(--agent-support))]" />
                      AI has generated a suggested response. Click to review and send.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
