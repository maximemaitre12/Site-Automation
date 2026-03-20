import { Code, Zap, Database, Shield, Users, Workflow } from "lucide-react";

const sections = [
  { icon: Zap, title: "Getting Started", description: "Set up your AETHER account and create your first automation." },
  { icon: Workflow, title: "Flow Builder", description: "Build powerful automations with our visual workflow builder." },
  { icon: Database, title: "Data Integration", description: "Connect your data sources and keep everything in sync." },
  { icon: Code, title: "API Reference", description: "Integrate AETHER into your applications with our REST API." },
  { icon: Shield, title: "Security & Compliance", description: "Learn about our security practices and compliance." },
  { icon: Users, title: "Team Management", description: "Manage users, roles, and permissions in your organization." },
];

export default function Documentation() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="pt-16 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5">Resources</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.08]">Documentation</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Everything you need to build powerful automations with AETHER.
          </p>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl border border-border bg-secondary/30 text-center mb-12">
            <h2 className="text-base font-semibold text-foreground mb-1.5">Documentation Coming Soon</h2>
            <p className="text-sm text-muted-foreground">
              We're working on comprehensive documentation. In the meantime, contact us for any questions.
            </p>
          </div>

          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-8">Topics we'll cover</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => (
              <div key={section.title}
                className="p-6 rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-foreground/[0.03] hover:border-foreground/10">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <section.icon className="w-5 h-5 text-foreground/60" />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{section.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
