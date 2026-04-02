import { Users, Package, ShieldCheck, Check } from "lucide-react";

const columns = [
  {
    icon: Users,
    iconColor: "#17A2B8",
    title: "RH & Recrutement",
    problem: "Recruter des talents pharma prend 8-12 semaines. Et c'est chaque fois un cauchemar administratif.",
    pains: [
      "Tri manuel de 200-500 CVs par poste → 60-80 heures de travail pur",
      "Matching candidat/compétences exige expertise pharma → Souvent des mauvaises décisions",
      "Scheduling entretiens = 15 emails ping-pong → 20+ heures perdues en coordination",
      "Onboarding des nouvelles recrues = 40 tâches manuelles → Checklist dispersée en 5 outils",
    ],
    costLabel: "Coût mensuel de ce goulot:",
    costValue: "€35,000 - €50,000",
    costSub: "(salaires + temps perdu)",
    costBg: "#FFF4E6",
    costBorder: "#FF6B35",
    solutions: ["Screening automatisé par IA", "Scoring de fit en 5 minutes", "Scheduling auto avec calendrier", "Onboarding checklist intelligente"],
  },
  {
    icon: Package,
    iconColor: "#17A2B8",
    title: "Supply Chain & Logistique",
    problem: "Traiter manuellement les commandes fournisseurs ? C'est lent, ça crée des erreurs, ça coûte cher.",
    pains: [
      "Bons de commande saisis manuellement dans 3 systèmes → Risque erreurs, doublons",
      "Suivi fournisseurs = feuilles Excel → Pas de visibilité temps-réel",
      "Ruptures de stock imprévisibles → Arrêts production, délais clients",
      "Réconciliation inventaire = 2 jours/mois → Nombreuses discordances non résolues",
    ],
    costLabel: "Coût moyen rupture de stock:",
    costValue: "€150,000 - €300,000",
    costSub: "(perte prod + livraisons urgentes)",
    costBg: "#E8F9F7",
    costBorder: "#17A2B8",
    solutions: ["Traitement automatisé commandes", "Synchronisation temps-réel (ERP/fournisseurs)", "Prévention proactive ruptures", "Reporting inventaire quotidien"],
  },
  {
    icon: ShieldCheck,
    iconColor: "#2CAA56",
    title: "Conformité & Regulatory",
    problem: "La pharma = réglementation stricte. Mais votre compliance est dispersée partout.",
    pains: [
      "Audit trails = documentation manuelle → Incomplètes, non traçables",
      "Reports réglementaires = construction manuelle → Temps énorme, risque erreurs",
      "21 CFR Part 11, GMP, GDPR = 4 systèmes disjoints → Pas de vue globale",
      "Chaque audit externe = 2-3 semaines de collecte info → Stressant, tardif",
    ],
    costLabel: "Temps annuel compliance:",
    costValue: "500-800 heures/an",
    costSub: "Risque: Non-conformité = €50-500k",
    costBg: "#F0F9F4",
    costBorder: "#2CAA56",
    solutions: ["Audit trails automatisés & immuables", "Génération rapports en 1 clic", "Traçabilité complète 21 CFR Part 11", "Documentation compliance ready-for-audit"],
  },
];

export function PharmaProblems() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[48px] font-bold mb-5" style={{ color: "#0033CC" }}>
            Vos processus pharma deviennent coûteux.
            <br className="hidden md:block" />
            Voici pourquoi — et comment on les réduit.
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#4A4A4A" }}>
            Nous avons analysé +50 entreprises pharmaceutiques. Voici les 3 goulots d'étranglement qu'on voit partout.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {columns.map((col) => (
            <div key={col.title} className="rounded-xl p-8" style={{ background: "#F9FBFF" }}>
              <col.icon className="w-14 h-14 mb-4" style={{ color: col.iconColor }} />
              <h3 className="font-heading text-xl font-bold mb-3" style={{ color: "#0033CC" }}>{col.title}</h3>
              <p className="text-base mb-4" style={{ color: "#2C3E50" }}>{col.problem}</p>

              <ul className="space-y-2 mb-5">
                {col.pains.map((p) => (
                  <li key={p} className="text-sm leading-relaxed" style={{ color: "#4A4A4A" }}>
                    <span style={{ color: "#FF6B35" }}>•</span> {p}
                  </li>
                ))}
              </ul>

              {/* Cost box */}
              <div className="rounded-lg p-4 mb-5" style={{ background: col.costBg, borderLeft: `4px solid ${col.costBorder}` }}>
                <div className="text-sm" style={{ color: "#2C3E50" }}>{col.costLabel}</div>
                <div className="text-2xl font-bold" style={{ color: col.costBorder }}>{col.costValue}</div>
                <div className="text-sm" style={{ color: "#6B7C8C" }}>{col.costSub}</div>
              </div>

              {/* Solutions */}
              <ul className="space-y-1.5">
                {col.solutions.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm" style={{ color: "#2C3E50" }}>
                    <Check className="w-4 h-4 shrink-0" style={{ color: "#17A2B8" }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
