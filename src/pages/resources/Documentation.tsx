import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Code, Zap, Database, Shield, Users, Workflow } from "lucide-react";

const sections = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Set up your AETHER account and create your first automation."
  },
  {
    icon: Workflow,
    title: "Flow Builder",
    description: "Build powerful automations with our visual workflow builder."
  },
  {
    icon: Database,
    title: "Data Integration",
    description: "Connect your data sources and keep everything in sync."
  },
  {
    icon: Code,
    title: "API Reference",
    description: "Integrate AETHER into your applications with our REST API."
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Learn about our security practices and compliance."
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Manage users, roles, and permissions in your organization."
  }
];

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-10 md:py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-violet-500/5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-3 sm:mb-4">
              AETHER{" "}
              <span className="text-primary">Documentation</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build powerful automations with AETHER.
            </p>
          </div>
        </section>

        {/* Coming Soon Notice */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 text-center mb-12">
              <h2 className="text-lg font-semibold text-foreground mb-2">Documentation Coming Soon</h2>
              <p className="text-sm text-muted-foreground">
                We're working on comprehensive documentation. In the meantime, contact us for any questions.
              </p>
            </div>

            {/* Topics Preview */}
            <h3 className="text-lg font-medium text-foreground mb-6 text-center">Topics we'll cover</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((section) => (
                <div 
                  key={section.title}
                  className="p-5 rounded-xl border border-border bg-card"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-base font-medium text-foreground mb-1">{section.title}</h4>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
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
