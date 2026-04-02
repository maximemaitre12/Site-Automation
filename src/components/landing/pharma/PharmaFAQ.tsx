import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Ça prend combien de temps vraiment ?",
    a: "4-6 semaines du diagnostic au déploiement.\n\n• Semaine 1 : Audit complet\n• Semaines 2-3 : Design & specifications\n• Semaines 4-6 : Development + testing + deployment\n\nComparaison : Nous : 6 semaines vs. Grands consultants : 16-24 semaines vs. Intégration interne : 12-20 semaines.\n\nRaison : On a fait ça 50+ fois. Pour vous, c'est la première.",
  },
  {
    q: "C'est sûr au niveau réglementation ?",
    a: "Oui. Chaque solution est 21 CFR Part 11 ready.\n\nCe que ça veut dire :\n✓ Audit trails complètes et immuables\n✓ Signatures numériques légalement valides\n✓ Traçabilité 100% (qui a fait quoi, quand)\n✓ Validation de chaque étape processus\n\nOn vous livre un dossier de conformité, des test reports complets et une documentation audit-ready. Vous pouvez auditer immédiatement.",
  },
  {
    q: "Combien ça coûte ?",
    a: "Dépend du périmètre.\n\n1. Audit gratuit (valeur: €5k) — Diagnostic complet + ROI estimate\n2. Pilote (€35k - €80k) — 1-3 automations + 12 mois support\n3. Scaling (€50k - €200k+) — 5-10+ automations + full infrastructure\n\nROI Pattern : Year 1: 300-500% ROI (payback: 2-4 mois)\n\nExemple réel (Farmasoft UA) : Cost: €42k → Year 1 savings: €251k → ROI: 500%",
  },
  {
    q: "On doit remplacer nos systèmes existants ?",
    a: "Non, absolument pas.\n\nNotre approche :\n✓ Nous intégrons à vos ERP/systèmes existants\n✓ Zéro disruption opérationnelle\n✓ On ajoute, on n'enlève rien\n\nSystèmes supportés : SAP, Oracle, Salesforce, NetSuite, Microsoft Dynamics, systèmes legacy custom.\n\nVous gardez votre stack. On ajoute l'IA là où ça manque.",
  },
  {
    q: "Qu'est-ce qui se passe après les 6 semaines ?",
    a: "Support + optimisation continue.\n\nInclus (12 mois) :\n✓ 24/7 monitoring & alerting\n✓ Bug fixes (4h SLA pour critical)\n✓ Weekly optimization calls\n✓ Performance reports mensuels\n✓ Retraining équipe (on-demand)\n\nAprès 12 mois : Maintenance SLA, Scaling, ou Knowledge transfer. C'est à vous de décider.",
  },
  {
    q: "Vous avez déjà fait ça pour un concurrent ?",
    a: "Oui, mais confidentialité respectée.\n\nClients sous NDA (3 cas anonymisés). Case studies partagées (1-2 identifiés). Pas de data sharing cross-clients.\n\nJe peux vous mettre en contact avec 2-3 références vérifiables (avec permission).",
  },
];

export function PharmaFAQ() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center" style={{ color: "#0033CC" }}>
          Questions Fréquentes
        </h2>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-6" style={{ borderColor: "#E8EFF8" }}>
              <AccordionTrigger className="font-heading text-base font-bold hover:no-underline" style={{ color: "#0033CC" }}>
                {faq.q}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#2C3E50" }}>
                  {faq.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
