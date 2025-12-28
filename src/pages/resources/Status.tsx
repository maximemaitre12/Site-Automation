import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, Server, Database, Globe, Zap } from "lucide-react";

const services = [
  { name: "API", status: "operational", uptime: "99.99%" },
  { name: "Web Application", status: "operational", uptime: "99.98%" },
  { name: "Workflow Engine", status: "operational", uptime: "99.97%" },
  { name: "Document Processing", status: "operational", uptime: "99.95%" },
  { name: "AI Services", status: "operational", uptime: "99.94%" },
  { name: "Database", status: "operational", uptime: "99.99%" },
  { name: "Authentication", status: "operational", uptime: "99.99%" },
  { name: "Webhooks", status: "operational", uptime: "99.96%" }
];

const incidents = [
  {
    date: "December 15, 2024",
    title: "Increased latency on Document Processing",
    status: "resolved",
    duration: "23 minutes",
    description: "Some users experienced slower document processing times. Issue was identified and resolved."
  },
  {
    date: "December 8, 2024",
    title: "Scheduled maintenance - Database upgrade",
    status: "completed",
    duration: "45 minutes",
    description: "Planned maintenance window to upgrade database infrastructure. No service interruption."
  },
  {
    date: "November 28, 2024",
    title: "API rate limiting adjustment",
    status: "resolved",
    duration: "12 minutes",
    description: "Brief period of increased rate limiting errors. Configuration was corrected."
  }
];

const metrics = [
  { label: "Overall Uptime (30 days)", value: "99.97%", icon: Activity },
  { label: "Average Response Time", value: "89ms", icon: Zap },
  { label: "Incidents This Month", value: "1", icon: AlertTriangle },
  { label: "Scheduled Maintenance", value: "0", icon: Clock }
];

export default function Status() {
  const allOperational = services.every(s => s.status === "operational");

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Status Banner */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`p-8 rounded-2xl text-center ${
              allOperational 
                ? "bg-green-500/10 border border-green-500/20" 
                : "bg-yellow-500/10 border border-yellow-500/20"
            }`}>
              {allOperational ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-foreground mb-2">All Systems Operational</h1>
                  <p className="text-muted-foreground">All AETHER services are running normally.</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-foreground mb-2">Partial Service Disruption</h1>
                  <p className="text-muted-foreground">Some services are experiencing issues.</p>
                </>
              )}
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="p-6 rounded-xl border border-border bg-card text-center">
                  <metric.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Status */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Service Status</h2>
            <div className="space-y-3">
              {services.map((service) => (
                <div 
                  key={service.name}
                  className="p-4 rounded-lg border border-border bg-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {service.status === "operational" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : service.status === "degraded" ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium text-foreground">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{service.uptime} uptime</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.status === "operational" 
                        ? "bg-green-500/10 text-green-600"
                        : service.status === "degraded"
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-red-500/10 text-red-600"
                    }`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Incidents</h2>
            <div className="space-y-6">
              {incidents.map((incident, index) => (
                <div key={index} className="p-6 rounded-xl border border-border bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{incident.title}</h3>
                      <p className="text-sm text-muted-foreground">{incident.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      incident.status === "resolved" || incident.status === "completed"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-yellow-500/10 text-yellow-600"
                    }`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">{incident.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Duration: {incident.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <LandingFooter />
    </div>
  );
}
