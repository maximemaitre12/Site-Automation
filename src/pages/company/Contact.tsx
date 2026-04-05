import { Mail, ArrowRight, Clock, Shield, Zap } from "lucide-react";

const EMAILS = ["maxime.maitre@edu.em-lyon.com", "youriy.strashnyi@edu.em-lyon.com"];

const faqs = [
  { q: "Comment démarrer rapidement ?", a: "La plupart de nos clients sont opérationnels en moins d'une semaine. Notre équipe gère l'onboarding et la configuration initiale." },
  { q: "Proposez-vous un essai gratuit ?", a: "Oui. 14 jours d'essai gratuit avec accès complet à toutes les fonctionnalités. Sans carte bancaire." },
  { q: "Quelles intégrations supportez-vous ?", a: "Nous nous intégrons aux principaux outils entreprise : Salesforce, HubSpot, Slack, Microsoft 365, et plus de 100 autres." },
  { q: "Mes données sont-elles sécurisées ?", a: "Toutes les données sont chiffrées au repos et en transit. Nous sommes conformes RGPD et certifiés SOC 2 Type II." },
];

const reasons = [
  { icon: Clock, title: "Réponse rapide", desc: "Nous répondons sous 24 heures les jours ouvrés." },
  { icon: Zap, title: "Démo personnalisée", desc: "Présentation sur mesure adaptée à votre cas d'usage." },
  { icon: Shield, title: "Sans engagement", desc: "Évaluation gratuite, sans obligation." },
];

export default function Contact() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 lg:px-12" style={{ background: "#0C4A6E" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
            Contact
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]" style={{ color: "#FFFFFF" }}>
            Parlons de votre projet
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
            Intéressé par AETHER ? Contactez-nous directement par email et nous vous répondons sous 24 heures.
          </p>
        </div>
      </section>

      {/* Email CTA */}
      <section className="py-20 sm:py-28 px-6 lg:px-12" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[600px] mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{ background: "#E8F4F8" }}>
            <Mail className="w-8 h-8" style={{ color: "#0369A1" }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3" style={{ color: "#0F172A" }}>
            Envoyez-nous un email
          </h2>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "#64748B" }}>
            Décrivez-nous vos besoins et nous vous répondrons avec une proposition personnalisée.
          </p>
          <div className="flex flex-col gap-4">
            {EMAILS.map((email) => (
              <a
                key={email}
                href={`mailto:${email}?subject=AETHER — J'aimerais en savoir plus`}
                className="inline-flex items-center gap-3 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 group justify-center"
                style={{ background: "#0891B2" }}
              >
                {email}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why reach out */}
      <section className="py-20 sm:py-28 px-6 lg:px-12" style={{ background: "#E8F4F8" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-center mb-4" style={{ color: "#0369A1" }}>
            À quoi s'attendre
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-14" style={{ color: "#0F172A" }}>
            Ce que nous vous offrons
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {reasons.map((r) => (
              <div key={r.title} className="p-8 text-center" style={{ background: "#FFFFFF", border: "1px solid #D6EEF5" }}>
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-5" style={{ background: "#E8F4F8" }}>
                  <r.icon className="w-5 h-5" style={{ color: "#0369A1" }} />
                </div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#0F172A" }}>{r.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 px-6 lg:px-12" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-center mb-4" style={{ color: "#94A3B8" }}>
            Questions fréquentes
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center mb-14" style={{ color: "#0F172A" }}>
            Vous avez des questions ?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-8" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "#0F172A" }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
