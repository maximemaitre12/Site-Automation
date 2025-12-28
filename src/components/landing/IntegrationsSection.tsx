import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Key, Zap, Check, ArrowRight, Plug, Settings, Sparkles } from "lucide-react";
import { 
  SlackLogo, GmailLogo, NotionLogo, SalesforceLogo,
  HubSpotLogo, ZapierLogo, StripeLogo, ShopifyLogo,
  TrelloLogo, AirtableLogo
} from "./BrandLogos";

const platforms = [
  { name: "Slack", Logo: SlackLogo, color: "#4A154B" },
  { name: "Gmail", Logo: GmailLogo, color: "#EA4335" },
  { name: "Notion", Logo: NotionLogo, color: "#000000" },
  { name: "Salesforce", Logo: SalesforceLogo, color: "#00A1E0" },
  { name: "HubSpot", Logo: HubSpotLogo, color: "#FF7A59" },
  { name: "Zapier", Logo: ZapierLogo, color: "#FF4A00" },
  { name: "Stripe", Logo: StripeLogo, color: "#635BFF" },
  { name: "Shopify", Logo: ShopifyLogo, color: "#96BF48" },
  { name: "Trello", Logo: TrelloLogo, color: "#0052CC" },
  { name: "Airtable", Logo: AirtableLogo, color: "#18BFFF" },
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
    <section className="relative py-16 sm:py-24 lg:py-32 bg-background overflow-hidden">
      {/* Cloud background decorations */}
      <div 
        className="absolute top-10 left-[5%] w-72 h-48 bg-gradient-to-br from-[hsl(200_80%_85%/0.3)] to-[hsl(220_70%_90%/0.15)] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-3xl animate-cloud-float"
        style={{ animationDuration: "14s" }}
      />
      <div 
        className="absolute bottom-20 right-[8%] w-64 h-44 bg-gradient-to-br from-[hsl(260_70%_85%/0.25)] to-[hsl(280_60%_90%/0.12)] rounded-[40%_60%_70%_30%/50%_40%_60%_50%] blur-3xl animate-cloud-drift"
        style={{ animationDuration: "12s", animationDelay: "-3s" }}
      />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-cloud-fade-in">
            <Key className="w-4 h-4" />
            <span>Simple API Integration</span>
          </div>
          <h2 className={cn(
            "text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Connect Everything in Seconds
          </h2>
          <p className={cn(
            "text-base sm:text-lg text-muted-foreground transition-all duration-700 delay-100",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            One API key. Instant connection. No complex setup required.
          </p>
        </div>

        {/* Visual Integration Diagram */}
        <div className={cn(
          "relative mb-16 transition-all duration-1000 delay-200",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          {/* Central Hub */}
          <div className="relative flex items-center justify-center">
            {/* Orbiting platforms */}
            <div className="relative w-full max-w-lg mx-auto aspect-square">
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
                      stroke="url(#lineGradient)"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      className="animate-cloud-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  );
                })}
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(200 80% 70%)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="hsl(260 70% 70%)" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Aether logo */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-[hsl(200_80%_70%/0.4)] to-[hsl(260_70%_70%/0.4)] rounded-[50%_50%_40%_60%/40%_60%_50%_50%] blur-xl animate-cloud-pulse" />
                  {/* Hub */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[45%_55%_40%_60%/50%_45%_55%_50%] bg-gradient-to-br from-[hsl(200_80%_65%)] to-[hsl(260_70%_60%)] flex items-center justify-center shadow-xl animate-cloud-morph" style={{ animationDuration: "15s" }}>
                    <span className="text-white font-bold text-lg sm:text-xl">A</span>
                  </div>
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
                    className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-[40%_60%_30%_70%/60%_30%_70%_40%] flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-125 hover:z-20 animate-cloud-fade-in"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                      backgroundColor: platform.color,
                      animationDelay: `${300 + i * 100}ms`,
                      opacity: 0,
                    }}
                    title={platform.name}
                  >
                    <platform.Logo className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3-Step Process */}
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 transition-all duration-1000 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <div key={i} className="relative group">
                {/* Connector arrow (except last) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 z-10">
                    <ArrowRight className="w-6 h-6 text-primary/40" />
                  </div>
                )}
                
                <div className="relative text-center p-6 rounded-2xl bg-secondary/30 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg group-hover:bg-secondary/50">
                  {/* Cloud decoration on hover */}
                  <div 
                    className={cn(
                      "absolute -inset-3 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10",
                      i === 0 ? "bg-gradient-to-br from-[hsl(200_80%_70%)] to-[hsl(220_70%_80%)]" :
                      i === 1 ? "bg-gradient-to-br from-[hsl(240_70%_70%)] to-[hsl(260_60%_80%)]" :
                      "bg-gradient-to-br from-[hsl(260_70%_70%)] to-[hsl(280_60%_80%)]"
                    )}
                  />
                  
                  {/* Step number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">
                    {i + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 mx-auto mb-4 rounded-[40%_60%_30%_70%/60%_30%_70%_40%] bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <StepIcon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <div className={cn(
          "text-center mt-12 transition-all duration-1000 delay-600",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-primary" />
            <span>No coding required</span>
            <span className="mx-2">•</span>
            <Check className="w-4 h-4 text-primary" />
            <span>100+ integrations</span>
            <span className="mx-2">•</span>
            <Check className="w-4 h-4 text-primary" />
            <span>Secure & encrypted</span>
          </div>
        </div>
      </div>
    </section>
  );
}
