import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { TrendingDown, PackageX, ClipboardList, Database } from "lucide-react";

const painPoints = [
  {
    icon: TrendingDown,
    title: "Unreliable forecasts",
    description: "Your demand forecasts lack accuracy, leading to decisions based on intuition rather than data.",
  },
  {
    icon: PackageX,
    title: "Overstocks & stockouts",
    description: "Balancing product availability with storage costs remains a constant challenge for your teams.",
  },
  {
    icon: ClipboardList,
    title: "Time-consuming manual processes",
    description: "Repetitive tasks keep your teams busy with low-value activities instead of focusing on analysis.",
  },
  {
    icon: Database,
    title: "Underutilized data",
    description: "You have large volumes of data, but their potential remains largely untapped due to a lack of proper tools.",
  },
];

export function SupplyPainPoints() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <p className={`text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-4 transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          Sound familiar?
        </p>
        <h2 className={`text-3xl sm:text-4xl font-semibold text-foreground text-center tracking-tight transition-all duration-500 delay-75 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          Challenges we understand
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className={`bg-background rounded-2xl border border-border p-8 transition-all duration-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: isVisible ? `${100 + i * 60}ms` : '0ms' }}
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
