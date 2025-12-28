import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Code, Key, Zap, Database, FileText, Users, Webhook, Lock, Copy, Check } from "lucide-react";
import { useState } from "react";

const endpoints = [
  {
    method: "GET",
    path: "/v1/workflows",
    description: "List all workflows",
    category: "Workflows"
  },
  {
    method: "POST",
    path: "/v1/workflows",
    description: "Create a new workflow",
    category: "Workflows"
  },
  {
    method: "GET",
    path: "/v1/workflows/{id}",
    description: "Get workflow details",
    category: "Workflows"
  },
  {
    method: "POST",
    path: "/v1/workflows/{id}/execute",
    description: "Execute a workflow",
    category: "Workflows"
  },
  {
    method: "GET",
    path: "/v1/documents",
    description: "List all documents",
    category: "Documents"
  },
  {
    method: "POST",
    path: "/v1/documents/analyze",
    description: "Analyze a document with AI",
    category: "Documents"
  },
  {
    method: "GET",
    path: "/v1/users",
    description: "List organization users",
    category: "Users"
  },
  {
    method: "POST",
    path: "/v1/webhooks",
    description: "Register a webhook",
    category: "Webhooks"
  }
];

const sdks = [
  { name: "Python", icon: "🐍", version: "2.1.0" },
  { name: "Node.js", icon: "📦", version: "3.0.1" },
  { name: "Go", icon: "🔵", version: "1.2.0" },
  { name: "Ruby", icon: "💎", version: "1.0.5" }
];

export default function API() {
  const [copied, setCopied] = useState(false);
  const apiKey = "sk_live_xxxxxxxxxxxxxxxxxxxx";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                API Reference
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Build powerful integrations with the AETHER REST API.
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                Get API Key
              </button>
              <button className="px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors">
                View on GitHub
              </button>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Start</h2>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-4 bg-muted/50 border-b border-border flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Authentication</span>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code className="text-foreground">
{`curl -X GET "https://api.aether-ai.com/v1/workflows" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Base URL */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-border bg-card">
                <Key className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Authentication</h3>
                <p className="text-sm text-muted-foreground">All API requests require a Bearer token in the Authorization header.</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <Zap className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Rate Limits</h3>
                <p className="text-sm text-muted-foreground">1000 requests per minute for standard plans. Enterprise plans have custom limits.</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <Lock className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">HTTPS Only</h3>
                <p className="text-sm text-muted-foreground">All API requests must be made over HTTPS. HTTP requests will be rejected.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Endpoints</h2>
            <div className="space-y-3">
              {endpoints.map((endpoint, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer flex items-center gap-4"
                >
                  <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                    endpoint.method === "GET" ? "bg-green-500/10 text-green-600" :
                    endpoint.method === "POST" ? "bg-blue-500/10 text-blue-600" :
                    endpoint.method === "PUT" ? "bg-yellow-500/10 text-yellow-600" :
                    "bg-red-500/10 text-red-600"
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-foreground flex-1">{endpoint.path}</code>
                  <span className="text-sm text-muted-foreground hidden md:block">{endpoint.description}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{endpoint.category}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SDKs */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Official SDKs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sdks.map((sdk) => (
                <div 
                  key={sdk.name}
                  className="p-6 rounded-xl border border-border bg-card text-center hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <span className="text-4xl mb-3 block">{sdk.icon}</span>
                  <h3 className="font-semibold text-foreground">{sdk.name}</h3>
                  <span className="text-sm text-muted-foreground">v{sdk.version}</span>
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
