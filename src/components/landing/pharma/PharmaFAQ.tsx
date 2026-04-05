import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "On doit vraiment faire une transformation complète ?", a: "Non. Diagnostic seul (€8-15k), implémentation ciblée (€50k+), ou transformation complète (€100-200k+). Le diagnostic vous aide à décider." },
  { q: "Ça va interrompre notre production ?", a: "Non, c'est une garantie. Planification « no disruption » dès le jour 1. Notre équipe inclut des vétérans ops qui comprennent vos contraintes." },
  { q: "Combien de temps ça prend ?", a: "Diagnostic : 2-3 semaines. Transformation : 12-16 semaines. Scaling : 16-24 semaines. Pas de raccourcis." },
  { q: "Vous travaillez avec nos systèmes actuels ?", a: "Toujours. SAP, Oracle, Salesforce, systèmes legacy. Nous optimisons l'existant, jamais d'imposition de nouveaux outils." },
  { q: "Vous avez des références ?", a: "Oui, sous NDA. Nous pouvons vous connecter avec des clients de taille et secteur similaires." },
];

export function PharmaFAQ() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section label */}
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
              Tout ce que vous devez savoir avant de <strong style={{ color: "#0F172A" }}>commencer un engagement</strong> avec nous.
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
