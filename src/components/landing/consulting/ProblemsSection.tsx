import { TrendingDown, Package, ClipboardList, Database } from "lucide-react";

const challenges = [
  {
    icon: TrendingDown,
    title: "Unreliable forecasts",
    description: "Your demand forecasts lack accuracy, leading to decisions based on intuition rather than data.",
  },
  {
    icon: Package,
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

export function ProblemsSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Sound familiar?
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Challenges we understand
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {challenges.map((item) => (
            <div
              key={item.title}
              className="bg-card rounded-2xl border border-border/50 p-8 hover:shadow-sm transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
