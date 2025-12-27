import { Check, Zap, Shield, Globe, BarChart3, Users, Headphones } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Deploy in Minutes",
    description: "Set up your AI agents in just a few clicks. No technical expertise required.",
  },
  {
    icon: Globe,
    title: "Native Integrations",
    description: "Connect your existing tools. Slack, Gmail, Salesforce, and 100+ more.",
  },
  {
    icon: Shield,
    title: "Supervised AI",
    description: "Stay in control. Validate critical actions, adjust parameters in real-time.",
  },
  {
    icon: Users,
    title: "Enterprise Security",
    description: "GDPR compliant, end-to-end encryption, hosted in Europe.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Track the performance of your automations. Measure time saved.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "An expert team to guide you through deployment and optimization.",
  },
];

export function ToolsShowcaseSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="features" className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
            Built for Enterprise
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            The features you need to automate at scale.
          </p>
        </div>
        
        {/* Features grid */}
        <div 
          ref={ref}
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-x-12 sm:gap-y-10 stagger-children",
            isVisible && "visible"
          )}
        >
          {features.map((feature, i) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={i} 
                className="group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
