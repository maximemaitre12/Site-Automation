import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Key, Zap, Check, ArrowRight, Plug, Settings, Sparkles } from "lucide-react";
import { 
  SlackLogo, GmailLogo, NotionLogo, SalesforceLogo,
  HubSpotLogo, ZapierLogo, StripeLogo, ShopifyLogo,
  TrelloLogo, AirtableLogo
} from "./BrandLogos";

const platforms = [
  { name: "Slack", Logo: SlackLogo },
  { name: "Gmail", Logo: GmailLogo },
  { name: "Notion", Logo: NotionLogo },
  { name: "Salesforce", Logo: SalesforceLogo },
  { name: "HubSpot", Logo: HubSpotLogo },
  { name: "Zapier", Logo: ZapierLogo },
  { name: "Stripe", Logo: StripeLogo },
  { name: "Shopify", Logo: ShopifyLogo },
  { name: "Trello", Logo: TrelloLogo },
  { name: "Airtable", Logo: AirtableLogo },
];

const steps = [
  {
    icon: Key,
    title: "Paste your API key",
    description: "Copy-paste your API key from any platform",
  },
  {
    icon: Plug,
    title: "Auto-connect",
    description: "Aether detects and configures the connection",
  },
  {
    icon: Sparkles,
    title: "Ready to use",
    description: "Your integration is live in seconds",
  },
];

export function IntegrationsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-background overflow-hidden">

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 animate-cloud-fade-in">
            <Key className="w-3.5 h-3.5" />
            <span>Simple API Integration</span>
          </div>
          <h2 className={cn(
            "text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Connect Everything in Seconds
          </h2>
          <p className={cn(
            "text-sm sm:text-base text-muted-foreground transition-all duration-700 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            One API key. Instant connection. No complex setup required.
          </p>
        </div>

        {/* Visual Integration Diagram */}
        <div className={cn(
          "relative mb-10 transition-all duration-1000 delay-200",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          {/* Central Hub */}
          <div className="relative flex items-center justify-center">
            {/* Orbiting platforms */}
            <div className="relative w-full max-w-sm mx-auto aspect-square">
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                {platforms.map((_, i) => {
                  const angle = (i * 36 - 90) * (Math.PI / 180);
                  const x = 200 + 150 * Math.cos(angle);
                  const y = 200 + 150 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1="200"
                      y1="200"
                      x2={x}
                      y2={y}
                      stroke="hsl(220 13% 80%)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  );
                })}
              </svg>

              {/* Center Aether logo */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-bold text-base sm:text-lg">A</span>
                </div>
              </div>

              {/* Platform icons in orbit */}
              {platforms.map((platform, i) => {
                const angle = (i * 36 - 90) * (Math.PI / 180);
                const radius = 38; // percentage from center
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                
                return (
                  <div
                    key={platform.name}
                    className="absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary border border-border flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-110 hover:border-primary/30"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    title={platform.name}
                  >
                    <platform.Logo className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3-Step Process */}
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-1000 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <div key={i} className="relative group">
                {/* Connector arrow (except last) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-2 z-10">
                    <ArrowRight className="w-4 h-4 text-border" />
                  </div>
                )}
                
                <div className="relative text-center p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-all duration-300">
                  {/* Step number */}
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                    {i + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
                    <StepIcon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <div className={cn(
          "text-center mt-8 transition-all duration-1000 delay-600",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="w-3.5 h-3.5 text-primary" />
            <span>No coding required</span>
            <span className="mx-1">•</span>
            <Check className="w-3.5 h-3.5 text-primary" />
            <span>100+ integrations</span>
            <span className="mx-1">•</span>
            <Check className="w-3.5 h-3.5 text-primary" />
            <span>Secure & encrypted</span>
          </div>
        </div>
      </div>
    </section>
  );
}
