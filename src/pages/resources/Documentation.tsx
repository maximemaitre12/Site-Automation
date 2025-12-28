import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Book, Code, Zap, Settings, Database, Shield, Users, Workflow, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const sections = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Set up your AETHER account and create your first automation in minutes.",
    articles: [
      "Quick Start Guide",
      "Account Setup",
      "Understanding the Dashboard",
      "Your First Workflow"
    ]
  },
  {
    icon: Workflow,
    title: "Flow Builder",
    description: "Build powerful automations with our visual workflow builder.",
    articles: [
      "Flow Builder Basics",
      "Triggers and Actions",
      "Conditional Logic",
      "Error Handling",
      "Testing Workflows"
    ]
  },
  {
    icon: Database,
    title: "Data Integration",
    description: "Connect your data sources and keep everything in sync.",
    articles: [
      "Supported Integrations",
      "API Connections",
      "Data Mapping",
      "Sync Configuration",
      "Webhooks"
    ]
  },
  {
    icon: Code,
    title: "API Reference",
    description: "Integrate AETHER into your applications with our REST API.",
    articles: [
      "Authentication",
      "Rate Limits",
      "Workflows API",
      "Documents API",
      "Users API"
    ]
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Learn about our security practices and compliance certifications.",
    articles: [
      "Security Overview",
      "Data Encryption",
      "Access Controls",
      "Audit Logs",
      "GDPR Compliance"
    ]
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Manage users, roles, and permissions in your organization.",
    articles: [
      "User Roles",
      "Team Workspaces",
      "SSO Configuration",
      "Activity Monitoring"
    ]
  }
];


export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Documentation
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Everything you need to build powerful automations with AETHER.
            </p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-lg"
              />
            </div>
          </div>
        </section>

        {/* Coming Soon Notice */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 text-center">
              <h2 className="text-lg font-semibold text-foreground mb-2">Documentation Coming Soon</h2>
              <p className="text-sm text-muted-foreground">
                We're working on comprehensive documentation. In the meantime, contact us for any questions.
              </p>
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section) => (
                <div 
                  key={section.title}
                  className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{section.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{section.description}</p>
                  <ul className="space-y-2">
                    {section.articles.map((article) => (
                      <li key={article}>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" />
                          {article}
                        </span>
                      </li>
                    ))}
                  </ul>
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
