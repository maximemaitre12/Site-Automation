import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { BarChart3, Upload, TrendingUp, TrendingDown, AlertTriangle, Download, Sparkles } from "lucide-react";

export default function Insights() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                AETHER Insights
              </h1>
              <p className="text-muted-foreground mt-1">AI-powered business intelligence and predictive analytics</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="hero">
                <Upload className="w-4 h-4 mr-2" />
                Upload Data
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Revenue", value: "$124.5K", change: "+12.3%", up: true },
              { label: "Users", value: "8,429", change: "+5.7%", up: true },
              { label: "Churn Rate", value: "2.1%", change: "-0.3%", up: false },
              { label: "MRR Growth", value: "18%", change: "+2.1%", up: true },
            ].map((kpi) => (
              <div key={kpi.label} className="p-4 rounded-xl bg-card border border-border">
                <p className="text-sm text-muted-foreground mb-1">{kpi.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                  <span className={`text-sm flex items-center ${kpi.up ? "text-success" : "text-destructive"}`}>
                    {kpi.up ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {kpi.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Area */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Revenue Trend</h3>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-xl">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Upload data to generate charts</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* AI Insights */}
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">AI Insights</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-sm text-foreground">Revenue up 12% vs last month. Enterprise segment driving growth.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <p className="text-sm text-foreground">User engagement dipped on weekends. Consider weekend campaigns.</p>
                  </div>
                </div>
              </div>

              {/* Anomalies */}
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <h3 className="font-semibold text-foreground">Anomalies</h3>
                </div>
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-foreground">Unusual spike in support tickets from EU region on Dec 3.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}