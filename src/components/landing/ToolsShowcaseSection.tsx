import { Check } from "lucide-react";

const features = [
  {
    title: "Deploy in minutes",
    description: "Configure your AI agents in a few clicks. No technical expertise required.",
  },
  {
    title: "Native integrations",
    description: "Connect your existing tools. Slack, Gmail, Salesforce, and 100+ more.",
  },
  {
    title: "Supervised AI",
    description: "Stay in control. Validate critical actions, adjust parameters in real-time.",
  },
  {
    title: "Enterprise security",
    description: "GDPR compliant, end-to-end encryption, hosted in Europe.",
  },
  {
    title: "Detailed analytics",
    description: "Track the performance of your automations. Measure time saved.",
  },
  {
    title: "Dedicated support",
    description: "A team of experts guides you through deployment and optimization.",
  },
];

export function ToolsShowcaseSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Built for enterprise
          </h2>
          <p className="text-lg text-muted-foreground">
            The features you need to automate at scale.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {features.map((feature, i) => (
            <div key={i} className="group">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                  <Check className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}