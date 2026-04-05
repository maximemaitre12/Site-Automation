import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "On doit vraiment faire une transformation complète ?",
    a: "Non nécessairement. On propose 3 options : Diagnostic seul (€8-15k), Targeted implementation (€50k+), ou Full transformation (€100-200k+). On peut vous aider à décider après le diagnostic.",
  },
  {
    q: "Ça va interrompre notre production ?",
    a: "Non, c'est une garantie. Nous planifions tout en mode \"no disruption\", travaillons en off-hours quand possible, et avons des contingencies pour tout. Notre équipe inclut des vétérans ops qui comprennent vos contraintes.",
  },
  {
    q: "Combien de temps ça prend vraiment ?",
    a: "Diagnostic : 2-3 semaines. Transformation : 12-16 semaines. Scaling : 16-24 semaines. Ongoing : 12-36 mois. No shortcuts. No magic. Just proven process.",
  },
  {
    q: "Vous travaillez avec nos systèmes actuels ?",
    a: "Oui, toujours. Nous intégrons avec ce que vous avez (SAP, Oracle, Salesforce, NetSuite, systèmes legacy). Nous n'imposons pas de nouveaux systèmes. Nous optimisons l'existant.",
  },
  {
    q: "Vous avez des références ?",
    a: "Oui, sous NDA stricte. Nous pouvons vous mettre en contact avec des clients de taille et secteur similaires. Demandez lors de votre premier appel.",
  },
  {
    q: "Qu'est-ce que mon équipe va apprendre ?",
    a: "L'objectif est que vous deveniez experts. Après notre engagement, votre équipe comprend le GMP en profondeur, vos processus sont documentés, et vous pouvez passer un audit FDA en autonomie.",
  },
];

export function PharmaFAQ() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-[700px] mx-auto px-6">
        <div className="mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#0891B2" }}>
            FAQ
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold" style={{ color: "#0F172A" }}>
            Questions fréquentes.
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-0 divide-y" style={{ borderColor: "#E2E8F0" }}>
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-none py-0"
            >
              <AccordionTrigger className="font-heading text-base font-bold hover:no-underline py-6" style={{ color: "#0F172A" }}>
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
    </section>
  );
}
