import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "On a divisé par 10 le temps de traitement de nos tickets. L'équipe support peut enfin se concentrer sur les cas complexes.",
    author: "Marie Dupont",
    role: "Head of Customer Success",
    company: "TechScale",
    avatar: "MD",
    stat: "10x plus rapide",
  },
  {
    quote: "AETHER HR a transformé notre recrutement. On analyse 500 CV en 10 minutes au lieu de 3 jours.",
    author: "Thomas Martin",
    role: "DRH",
    company: "GrowthCorp",
    avatar: "TM",
    stat: "500 CV en 10 min",
  },
  {
    quote: "L'audit RGPD qui nous prenait une semaine se fait maintenant en 2 heures. Le ROI était immédiat.",
    author: "Sophie Bernard",
    role: "Chief Compliance Officer",
    company: "FinanceFirst",
    avatar: "SB",
    stat: "ROI en 2 semaines",
  },
];

const metrics = [
  { value: "847h", label: "économisées / mois", sublabel: "en moyenne par entreprise" },
  { value: "99.7%", label: "précision IA", sublabel: "sur les tâches automatisées" },
  { value: "<30j", label: "ROI moyen", sublabel: "retour sur investissement" },
  { value: "2,000+", label: "entreprises", sublabel: "nous font confiance" },
];

export function ResultsSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {metrics.map((metric, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-gradient-to-br from-[hsl(250_50%_98%)] to-[hsl(280_50%_98%)] border border-[hsl(250_100%_90%)]">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{metric.value}</div>
              <div className="font-semibold text-foreground mb-1">{metric.label}</div>
              <div className="text-sm text-muted-foreground">{metric.sublabel}</div>
            </div>
          ))}
        </div>
        
        {/* Testimonials header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center gap-1 mb-4">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-[hsl(45_100%_50%)] text-[hsl(45_100%_50%)]" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Ils ont transformé leurs opérations.
          </h2>
          <p className="text-xl text-muted-foreground">
            Découvrez comment nos clients ont automatisé leur quotidien.
          </p>
        </div>
        
        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="p-6 lg:p-8 rounded-2xl bg-white border border-border hover:shadow-xl transition-shadow">
              <Quote className="w-8 h-8 text-[hsl(250_100%_85%)] mb-4" />
              
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(280_100%_55%)] to-[hsl(250_100%_55%)] flex items-center justify-center text-white text-sm font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-semibold text-[hsl(250_100%_55%)]">{testimonial.stat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
