import { ShieldCheck, Users, TrendingUp, Check } from "lucide-react";

export function PharmaTrust() {
  return (
    <section className="py-24" style={{ background: "#F9FBFF" }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-16 text-center" style={{ color: "#0033CC" }}>
          Pourquoi les pharmas nous font confiance
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Regulatory */}
          <div>
            <ShieldCheck className="w-12 h-12 mb-4" style={{ color: "#2CAA56" }} />
            <h3 className="font-heading text-lg font-bold mb-3" style={{ color: "#0033CC" }}>Conformité intégrée dans chaque solution</h3>
            <p className="text-sm mb-4" style={{ color: "#2C3E50" }}>
              L'industrie pharmaceutique = réglementation stricte. Chaque solution Aether respecte les standards d'entrée:
            </p>
            <ul className="space-y-3">
              {[
                ["21 CFR Part 11 (FDA)", "Audit trails immuables, signatures numériques"],
                ["GMP", "Processus documentés, traçables, reproductibles"],
                ["GDPR + Data Privacy", "Protection données personnelles"],
                ["ISO 27001", "Chiffrement, access control, incident response"],
                ["SOC 2 Type II", "Security, availability, integrity certifiés"],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#2CAA56" }} />
                  <div>
                    <span className="font-semibold" style={{ color: "#2C3E50" }}>{title}</span>
                    <br /><span style={{ color: "#6B7C8C" }}>{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Team */}
          <div>
            <Users className="w-12 h-12 mb-4" style={{ color: "#17A2B8" }} />
            <h3 className="font-heading text-lg font-bold mb-3" style={{ color: "#0033CC" }}>Fondée par des vétérans pharma + IA</h3>
            <p className="text-sm mb-4" style={{ color: "#2C3E50" }}>
              Aether Connect a été créée par une fusion d'expertises:
            </p>
            <div className="space-y-4">
              {[
                { role: "12 ans Operations, Sanofi", title: "VP Supply Chain Operations", spec: "Manufacturing, Logistics, Quality" },
                { role: "8 ans Pharma IT, Novartis", title: "Solutions Architect", spec: "Systems integration, ERP, Compliance" },
                { role: "AI/ML Engineer, Deep Learning", title: "PhD AI, ex-Google DeepMind", spec: "Custom models, production ML" },
              ].map((p) => (
                <div key={p.role} className="text-sm rounded-lg p-3" style={{ background: "#F0F4FF" }}>
                  <div className="font-semibold" style={{ color: "#0033CC" }}>{p.role}</div>
                  <div style={{ color: "#2C3E50" }}>{p.title}</div>
                  <div style={{ color: "#6B7C8C" }}>Specialty: {p.spec}</div>
                </div>
              ))}
            </div>
            <p className="text-sm italic mt-4" style={{ color: "#0033CC" }}>
              "Nous parlons couramment pharma ET technologie. Pas de miscommunication. Juste des résultats."
            </p>
          </div>

          {/* Track record */}
          <div>
            <TrendingUp className="w-12 h-12 mb-4" style={{ color: "#0033CC" }} />
            <h3 className="font-heading text-lg font-bold mb-3" style={{ color: "#0033CC" }}>Chiffres vérifiables</h3>
            <div className="space-y-5 mt-6">
              {[
                ["50+", "Clients pharma depuis 2023"],
                ["340+", "Automatisations en production"],
                ["7.2M", "€ économisés (audités)"],
                ["98%", "Taux de satisfaction clients"],
                ["34 jours", "Délai moyen déploiement"],
                ["0", "Incidents security depuis 2023"],
              ].map(([val, label]) => (
                <div key={label}>
                  <div className="font-heading text-2xl font-bold" style={{ color: "#0033CC" }}>{val}</div>
                  <div className="text-xs" style={{ color: "#6B7C8C" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
