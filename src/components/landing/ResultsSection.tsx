const metrics = [
  { value: "90%", label: "de réduction du temps de traitement" },
  { value: "847h", label: "économisées par mois en moyenne" },
  { value: "99.7%", label: "de précision sur les tâches automatisées" },
  { value: "<30j", label: "pour un retour sur investissement" },
];

const testimonial = {
  quote: "AETHER a transformé notre façon de travailler. Nous avons automatisé 80% de nos tâches répétitives en moins d'un mois.",
  author: "Marie Dupont",
  role: "Directrice des Opérations",
  company: "TechCorp",
};

export function ResultsSection() {
  return (
    <section className="py-24 lg:py-32 bg-background border-t border-border">
      <div className="max-w-5xl mx-auto px-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-24">
          {metrics.map((metric, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-semibold text-foreground mb-2">{metric.value}</div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
        
        {/* Testimonial */}
        <div className="max-w-3xl">
          <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-snug mb-8">
            "{testimonial.quote}"
          </blockquote>
          <div>
            <p className="font-medium text-foreground">{testimonial.author}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
