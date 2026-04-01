import { ArrowRight, Mail } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8">
          Talk to an expert to identify your optimization levers
        </h2>

        <a href="mailto:maxime.maitre@edu.em-lyon.com,youriy.strashnyi@edu.em-lyon.com">
          <button className="inline-flex items-center gap-2 h-11 px-6 text-sm font-medium text-white bg-foreground rounded-full hover:opacity-90 transition-opacity">
            <Mail className="w-5 h-5" />
            Schedule a call
            <ArrowRight className="w-4 h-4" />
          </button>
        </a>

        <p className="text-sm text-muted-foreground mt-5">
          No commitment · Response within 24h
        </p>
      </div>
    </section>
  );
}
