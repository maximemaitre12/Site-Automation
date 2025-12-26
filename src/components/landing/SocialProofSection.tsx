import { Zap, Shield, Clock, Sparkles } from "lucide-react";

const features = [
  { icon: Zap, label: "Lightning fast" },
  { icon: Shield, label: "Enterprise secure" },
  { icon: Clock, label: "Always available" },
  { icon: Sparkles, label: "AI-powered" },
];

export function SocialProofSection() {
  return (
    <section className="relative py-12 sm:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-primary/5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wider mb-2 sm:mb-3 animate-fade-in">
            Built for scale
          </p>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Trusted by growing businesses worldwide
          </h3>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2 sm:mb-3">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="text-sm sm:text-base font-medium text-foreground">{feature.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}