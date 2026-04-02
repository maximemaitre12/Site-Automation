import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "On doit vraiment faire une transformation complète ?",
    a: "Non nécessairement.\n\nOn propose 3 options :\n1. Diagnostic seul (€8-15k) : You get clarity\n2. Targeted implementation (€50k+) : Fix your biggest gap\n3. Full transformation (€100-200k+) : Complete reset\n\nÇa dépend de votre compliance maturity level, growth trajectory, et budget. On peut vous aider à décider après le diagnostic.",
  },
  {
    q: "Ça va interrompre notre production ?",
    a: "Non. C'est une garantie.\n\nPourquoi :\n→ We plan everything as \"no disruption\"\n→ We work off-hours when possible\n→ We have contingencies for everything\n→ Our team includes ops veterans\n→ We've done this 50+ times\n\nSi ça commence à affecter production, on ajuste le plan immédiatement.",
  },
  {
    q: "Combien de temps ça prend vraiment ?",
    a: "Dépend du scope :\n\n• Diagnostic : 2-3 weeks\n• Transformation : 12-16 weeks\n• Scaling : 16-24 weeks\n• Ongoing : 12-36 months\n\nTimeline réaliste :\n• Weeks 1-2 : Assessment\n• Weeks 3-5 : Strategy & design\n• Weeks 6-12 : Implementation & training\n• Months 4-12 : Sustainment\n\nNo shortcuts. No magic. Just proven process.",
  },
  {
    q: "Vous travaillez avec nos systèmes actuels ?",
    a: "Oui, toujours.\n\nNotre approche :\n✓ We integrate with what you have\n✓ We don't force new systems\n✓ We optimize existing infrastructure\n✓ We add tech only when needed\n\nSystèmes intégrés : SAP, Oracle, Salesforce, NetSuite, Microsoft Dynamics, systèmes legacy custom.\n\nVous gardez votre stack. On optimise ce qui existe.",
  },
  {
    q: "Vous avez des références ?",
    a: "Oui. Sous NDA stricte.\n\nOn peut vous mettre en contact avec :\n• Clients similar size/sector\n• Companies in your region\n• Organizations with similar challenges\n\nDemandez lors de votre first call.",
  },
  {
    q: "Qu'est-ce que je vais apprendre ?",
    a: "L'objectif est que vous DEVENIEZ experts.\n\nAprès notre engagement :\n✓ Votre team comprend GMP en profondeur\n✓ Vos processes sont documentées\n✓ Vous pouvez maintenir & évoluer\n✓ Vous pouvez passer audit FDA\n✓ Vous avez institutional knowledge\n\nOn ne crée pas de dépendance. On augmente votre capacité.",
  },
];

export function PharmaFAQ() {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12 text-center" style={{ color: "#1A3A6B" }}>
          Questions fréquentes
        </h2>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-6" style={{ borderColor: "#E8EFF8" }}>
              <AccordionTrigger className="font-heading text-base font-bold hover:no-underline" style={{ color: "#1A3A6B" }}>
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
