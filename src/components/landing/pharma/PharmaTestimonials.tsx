import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Aether a transformé nos opérations. Nous avons économisé 40h de travail admin chaque semaine. Plus important: zéro erreurs en supply chain maintenant. Game-changer total.",
    author: "Jean Dupont",
    role: "COO, Farmasoft UA",
  },
  {
    quote: "On pensait que 6 semaines, c'était impossible. Mais Aether a livré. Audit → Prod en 34 jours. Maintenance après c'est facile. On score 10/10 pour fiabilité et support.",
    author: "Sophie Martin",
    role: "VP Operations, Biotech",
  },
  {
    quote: "Le vrai test pour nous était la conformité. Ils ont respecté 21 CFR à 100%. Audit externe a validé en première tentative. Zéro note sur notre dossier de conformité.",
    author: "Marc Leclerc",
    role: "Quality & Compliance Director",
  },
  {
    quote: "Peur de l'IA au départ. Peur que ça casse nos processus. Ils ont écouté, adapté, livré juste ce qu'il faut. Recommande sans hésiter.",
    author: "Anne Rousseau",
    role: "HR Director",
  },
];

export function PharmaTestimonials() {
  return (
    <section className="py-24" style={{ background: "#FAFBFC" }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center" style={{ color: "#0033CC" }}>
          Ce que disent nos clients
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.author} className="bg-white rounded-lg border p-8" style={{ borderColor: "#E8EFF8" }}>
              <div className="text-4xl mb-4" style={{ color: "#0033CC" }}>"</div>
              <p className="text-base italic mb-6" style={{ color: "#2C3E50" }}>{t.quote}</p>
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#FFB81C" }} />)}
              </div>
              <div className="text-sm font-semibold" style={{ color: "#0033CC" }}>{t.author}</div>
              <div className="text-xs" style={{ color: "#6B7C8C" }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
