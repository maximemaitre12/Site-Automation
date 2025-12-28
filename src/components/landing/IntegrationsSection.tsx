import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Key, Check } from "lucide-react";
import { 
  SlackLogo, GmailLogo, NotionLogo, SalesforceLogo,
  HubSpotLogo, ZapierLogo, StripeLogo, ShopifyLogo,
  TrelloLogo, AirtableLogo
} from "./BrandLogos";
import { ApiConnectionDemo } from "./ApiConnectionDemo";

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

export function IntegrationsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-background overflow-hidden">
      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
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

        {/* Main content: Animation + Platforms */}
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-8 transition-all duration-1000 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {/* Left: Interactive Demo */}
          <div className="order-2 lg:order-1">
            <ApiConnectionDemo />
          </div>
          
          {/* Right: Platforms grid */}
          <div className="order-1 lg:order-2">
            <p className="text-sm font-medium text-foreground mb-4 text-center lg:text-left">
              Works with your favorite tools
            </p>
            <div className="grid grid-cols-5 gap-2 sm:gap-3 max-w-xs mx-auto lg:mx-0">
              {platforms.map((platform, i) => (
                <div
                  key={platform.name}
                  className="aspect-square rounded-lg bg-secondary border border-border flex items-center justify-center transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:scale-105"
                  title={platform.name}
                >
                  <platform.Logo className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center lg:text-left">
              And many more integrations available
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className={cn(
          "text-center transition-all duration-1000 delay-600",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground flex-wrap justify-center">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-primary" />
              No coding required
            </span>
            <span className="mx-1 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-primary" />
              Growing library
            </span>
            <span className="mx-1 hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-primary" />
              Secure & encrypted
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
