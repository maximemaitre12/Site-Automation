import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Key, Zap, Check, ArrowRight, Plug, Settings, Sparkles } from "lucide-react";
import { 
  SlackLogo, GmailLogo, NotionLogo, SalesforceLogo,
  HubSpotLogo, ZapierLogo, StripeLogo, ShopifyLogo,
  TrelloLogo, AirtableLogo
} from "./BrandLogos";
import aetherLogo from "@/assets/aether-logo.jpeg";

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

        {/* Clean Platform Grid */}
        <div className={cn(
          "relative mb-10 transition-all duration-1000 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {/* Platforms row with center Aether hub */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap max-w-lg mx-auto">
            {/* Left platforms */}
            {platforms.slice(0, 5).map((platform, i) => (
              <div
                key={platform.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-secondary border border-border flex items-center justify-center transition-all duration-300 hover:border-primary/40 hover:shadow-md"
                style={{ animationDelay: `${i * 50}ms` }}
                title={platform.name}
              >
                <platform.Logo className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              </div>
            ))}
            
            {/* Right platforms */}
            {platforms.slice(5, 10).map((platform, i) => (
              <div
                key={platform.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-secondary border border-border flex items-center justify-center transition-all duration-300 hover:border-primary/40 hover:shadow-md"
                style={{ animationDelay: `${(i + 4) * 50}ms` }}
                title={platform.name}
              >
                <platform.Logo className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              </div>
            ))}
          </div>
          
          {/* +more indicator */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            +100 other integrations available
          </p>
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
