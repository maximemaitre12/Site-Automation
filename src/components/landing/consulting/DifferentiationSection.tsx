import { Users, BarChart3, Handshake } from "lucide-react";

const differentiators = [
  {
    icon: Users,
    title: "Dual expertise",
    description: "We combine a deep understanding of supply chain operations with mastery of artificial intelligence technologies. This dual competence allows us to design solutions truly adapted to your operational challenges.",
  },
  {
    icon: BarChart3,
    title: "Demonstrated results",
    description: "Our interventions have identified hundreds of thousands of euros in optimization for our clients. Significant improvement in operational performance, cost reduction and process reliability are at the heart of every engagement.",
  },
  {
    icon: Handshake,
    title: "Strategic partner",
    description: "We step in early to identify performance levers, then support their implementation. Our role is that of a long-term partner, not a one-off technical provider.",
  },
];

export function DifferentiationSection() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Why us
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Expertise at the service of your results
          </h2>
        </div>

        <div className="space-y-5">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="bg-card rounded-2xl border border-border/50 p-8 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
