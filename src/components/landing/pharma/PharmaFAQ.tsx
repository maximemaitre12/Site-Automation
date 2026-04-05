import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "L'IA, c'est pour les grandes entreprises non ?", a: "Non. Nos solutions s'adaptent à toutes les tailles. PME, ETI, grands groupes — le ROI est le même. On commence petit, on scale vite." },
  { q: "Ça va interrompre nos opérations ?", a: "Jamais. Nos déploiements s'intègrent dans vos systèmes existants (SAP, ERP, CRM, legacy). Zéro disruption, c'est notre garantie." },
  { q: "Combien de temps pour voir des résultats ?", a: "Premier prototype fonctionnel en 4 à 6 semaines. Déploiement complet en 12 à 16 semaines. Pas de projets qui traînent." },
  { q: "Vous travaillez dans quel secteur ?", a: "Industrie, finance, logistique, retail, santé, manufacturing... Notre force c'est de comprendre votre métier en profondeur avant de construire quoi que ce soit." },
  { q: "Quelle différence avec un cabinet de conseil classique ?", a: "On ne livre pas de slides. On livre des systèmes IA en production, avec des KPIs mesurables et un ROI concret." },
];

export function PharmaFAQ() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            FAQ
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2
              className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-6"
              style={{ color: "#0F172A" }}
            >
              Questions
              <br />
              fréquentes.
            </h2>
            <p className="text-[15px] leading-[1.85]" style={{ color: "#4a5568" }}>
              Tout ce que vous devez savoir avant de <strong style={{ color: "#0F172A" }}>lancer un projet IA</strong> avec nous.
            </p>
          </div>

          <div>
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b py-0"
                  style={{ borderColor: "#e8ecf1" }}
                >
                  <AccordionTrigger
                    className="font-heading text-[15px] font-bold hover:no-underline py-6 text-left"
                    style={{ color: "#0F172A" }}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-[14px] leading-[1.8] pb-4" style={{ color: "#5a6577" }}>
                      {faq.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
