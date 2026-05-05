import { ArrowRight, Mail } from "lucide-react";

export function HeroSection() {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center bg-background pt-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
          Improve your supply chain performance
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          We help companies reduce costs, strengthen operations and identify measurable gains within weeks.
        </p>

        <a href="mailto:contact@aether-connect.com,youriy.strashnyi@edu.em-lyon.com">
          <button className="inline-flex items-center gap-2 h-11 px-6 text-sm font-medium text-white bg-foreground rounded-full hover:opacity-90 transition-opacity">
            <Mail className="w-5 h-5" />
            Request a conversation
            <ArrowRight className="w-4 h-4" />
          </button>
        </a>
      </div>
    </section>
  );
}
