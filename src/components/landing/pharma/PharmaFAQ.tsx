import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "On doit vraiment faire une transformation complète ?",
    a: "Non. Diagnostic seul (€8-15k), implémentation ciblée (€50k+), ou transformation complète (€100-200k+). Le diagnostic vous aide à décider.",
  },
  {
    q: "Ça va interrompre notre production ?",
    a: "Non, c'est une garantie. Planification « no disruption » dès le jour 1. Notre équipe inclut des vétérans ops qui comprennent vos contraintes.",
  },
  {
    q: "Combien de temps ça prend ?",
    a: "Diagnostic : 2-3 semaines. Transformation : 12-16 semaines. Scaling : 16-24 semaines. Pas de raccourcis.",
  },
  {
    q: "Vous travaillez avec nos systèmes actuels ?",
    a: "Toujours. SAP, Oracle, Salesforce, systèmes legacy. Nous optimisons l'existant, jamais d'imposition de nouveaux outils.",
  },
  {
    q: "Vous avez des références ?",
    a: "Oui, sous NDA. Nous pouvons vous connecter avec des clients de taille et secteur similaires.",
  },
];

export function PharmaFAQ() {
  return (
    <section className="py-36 md:py-44 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
          <div>
            <h2
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1]"
              style={{ color: "#0F172A" }}
            >
              Questions
              <br />
              fréquentes.
            </h2>
          </div>

          <div>
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b py-0"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  <AccordionTrigger
                    className="font-heading text-base font-bold hover:no-underline py-6"
                    style={{ color: "#0F172A" }}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm leading-relaxed pb-4" style={{ color: "#64748B" }}>
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
