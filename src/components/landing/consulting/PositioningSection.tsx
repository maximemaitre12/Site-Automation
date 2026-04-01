import { Search, Lightbulb, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Analysis",
    description: "We study your operations, data and processes to understand your specific context and challenges.",
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Identification",
    description: "We identify and prioritize high-impact improvement opportunities for your operational performance.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Deployment",
    description: "We support the implementation of solutions tailored to your organization, with rapid measurable results.",
  },
];

export function PositioningSection() {
  return (
    <section id="methode" className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Our approach
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            A proven methodology
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-card rounded-2xl border border-border/50 p-8 hover:shadow-sm transition-shadow"
            >
              <p className="text-sm text-muted-foreground/60 mb-5">{step.number}</p>
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6">
                <step.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
