import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DollarSign, Upload, FileText, AlertTriangle, TrendingUp, Download } from "lucide-react";

const invoices = [
  { id: 1, vendor: "AWS Services", amount: "$12,450.00", status: "processed", category: "Cloud Infrastructure", date: "Dec 1, 2024" },
  { id: 2, vendor: "Office Supplies Co", amount: "$890.50", status: "pending", category: "Operations", date: "Dec 2, 2024" },
  { id: 3, vendor: "Marketing Agency", amount: "$5,200.00", status: "anomaly", category: "Marketing", date: "Dec 3, 2024" },
  { id: 4, vendor: "Software License", amount: "$2,999.00", status: "processed", category: "Software", date: "Dec 4, 2024" },
];

const stats = [
  { label: "This Month", value: "$45,890", trend: "+12%" },
  { label: "Pending", value: "3", trend: "invoices" },
  { label: "Anomalies", value: "1", trend: "detected" },
];

export default function Finance() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                AETHER Finance
              </h1>
              <p className="text-muted-foreground mt-1">Automated invoice processing and financial analysis</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="hero">
                <Upload className="w-4 h-4 mr-2" />
                Upload Invoice
              </Button>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="px-8 py-6 border-b border-border">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-card border border-border">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-sm text-success">{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Invoices</h2>
          
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    invoice.status === "anomaly" 
                      ? "bg-destructive/20" 
                      : "bg-gradient-to-br from-yellow-500/20 to-orange-400/20"
                  }`}>
                    {invoice.status === "anomaly" 
                      ? <AlertTriangle className="w-6 h-6 text-destructive" />
                      : <FileText className="w-6 h-6 text-yellow-400" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-foreground">{invoice.vendor}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        invoice.status === "processed" ? "bg-success/20 text-success" :
                        invoice.status === "pending" ? "bg-warning/20 text-warning" :
                        "bg-destructive/20 text-destructive"
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {invoice.category} · {invoice.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">{invoice.amount}</p>
                  </div>
                </div>
                
                {invoice.status === "anomaly" && (
                  <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      Unusual amount detected. 150% higher than average for this vendor.
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