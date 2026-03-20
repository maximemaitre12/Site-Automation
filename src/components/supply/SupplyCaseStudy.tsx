import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Factory, ArrowUpRight } from "lucide-react";

const results = [
  { metric: "OTIF", before: "79%", after: "94.2%", change: "+15 pts" },
  { metric: "Excess Stock", before: "$8.4M", after: "$6.9M", change: "-18%" },
  { metric: "Supplier Alerts", before: "Post-impact", after: "72h early", change: "Predictive" },
];

export function SupplyCaseStudy() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  return (
    <section ref={ref} className="py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className={`bg-card rounded-2xl border border-border overflow-hidden transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Header */}
          <div className="px-7 sm:px-10 pt-8 sm:pt-10 pb-6 border-b border-border">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-foreground/[0.04] flex items-center justify-center shrink-0">
                <Factory className="w-4.5 h-4.5 text-foreground/50" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground/60">Case Study</p>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mt-1 tracking-tight leading-tight">
                  How a global manufacturer cut logistics costs by 23% in 90 days
                </h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-4">
              <span>12 manufacturing sites</span>
              <span className="text-border">·</span>
              <span>400+ suppliers</span>
              <span className="text-border">·</span>
              <span>3 continents</span>
            </div>
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {results.map((r, i) => (
              <div
                key={r.metric}
                className={`px-7 sm:px-8 py-6 transition-all duration-500 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: isVisible ? `${300 + i * 100}ms` : '0ms' }}
              >
                <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground/50">{r.metric}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-sm text-muted-foreground line-through">{r.before}</span>
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                  <span className="text-lg font-semibold text-foreground">{r.after}</span>
                </div>
                <p className="text-xs font-medium text-emerald-600 mt-1">{r.change}</p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className={`px-7 sm:px-10 py-7 bg-secondary/30 border-t border-border transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            <blockquote className="text-sm sm:text-base text-foreground/80 italic leading-relaxed">
              "For the first time, we see our entire supply chain in real time. Decisions that took days now take minutes."
            </blockquote>
            <p className="text-xs text-muted-foreground mt-3">
              — VP Supply Chain, Industrial Group · €2.4B revenue
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
