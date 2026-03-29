import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Award, BarChart3, Compass } from "lucide-react";

const blocks = [
  {
    icon: Award,
    title: "Dual expertise",
    content: "We combine a deep understanding of supply chain operations with mastery of artificial intelligence technologies. This dual competence allows us to design solutions truly adapted to your operational challenges.",
  },
  {
    icon: BarChart3,
    title: "Demonstrated results",
    content: "Our interventions have identified hundreds of thousands of euros in optimization for our clients. Significant improvement in operational performance, cost reduction and process reliability are at the heart of every engagement.",
  },
  {
    icon: Compass,
    title: "Strategic partner",
    content: "We step in early to identify performance levers, then support their implementation. Our role is that of a long-term partner, not a one-off technical provider.",
  },
];

export function SupplyCaseStudy() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <p className={`text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-4 transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          Why us
        </p>
        <h2 className={`text-3xl sm:text-4xl font-semibold text-foreground text-center tracking-tight mb-16 transition-all duration-500 delay-75 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          Expertise at the service of your results
        </h2>

        <div className="space-y-6">
          {blocks.map((block, i) => {
            const Icon = block.icon;
            return (
              <div
                key={block.title}
                className={`bg-background rounded-2xl border border-border p-8 sm:p-10 transition-all duration-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: isVisible ? `${100 + i * 80}ms` : '0ms' }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{block.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{block.content}</p>
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
