const benefits = [
  { title: "Faster processing", description: "Reduce manual task time significantly" },
  { title: "Hours saved", description: "Free your team for strategic work" },
  { title: "High accuracy", description: "AI-powered precision on automated tasks" },
  { title: "Quick ROI", description: "See results in weeks, not months" },
];

export function ResultsSection() {
  return (
    <section id="results" className="py-16 sm:py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
            See the impact
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            Transform your operations and measure results from day one.
          </p>
        </div>
        
        {/* Benefits */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-6 mb-12 sm:mb-20">
          {benefits.map((benefit, i) => (
            <div key={i} className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-background border border-border">
              <div className="text-base sm:text-xl md:text-2xl font-bold text-primary mb-1 sm:mb-2">{benefit.title}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        {/* Value proposition */}
        <div className="max-w-3xl mx-auto text-center px-2">
          <p className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground leading-snug mb-6 sm:mb-8">
            "Join companies that are transforming their operations with intelligent automation."
          </p>
          <div>
            <p className="font-semibold text-foreground text-sm sm:text-base">Ready to get started?</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Request a personalized demo today</p>
          </div>
        </div>
      </div>
    </section>
  );
}