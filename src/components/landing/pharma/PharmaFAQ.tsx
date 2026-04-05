import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Votre IA est-elle conforme 21 CFR Part 11 et Annexe 11 ?", a: "Oui. Chaque système est déployé avec des electronic signatures, audit trails immutables et contrôle d'accès RBAC. Nos protocoles de validation IQ/OQ/PQ sont fournis avec chaque release et documentés dans un Validation Master Plan." },
  { q: "Comment intégrez-vous les systèmes existants (LIMS, MES, SAP) ?", a: "Via une architecture microservices et des API RESTful/GraphQL. Nous supportons les connecteurs natifs SAP, Veeva Vault, Documentum, Argus Safety et les principaux LIMS du marché. L'intégration se fait sans interruption de vos opérations." },
  { q: "Vos modèles sont-ils entraînés sur des données pharma ?", a: "Nos modèles NLP sont fine-tunés sur des corpus réglementaires ICH, FDA Guidance Documents, EMA Scientific Guidelines et des datasets de pharmacovigilance anonymisés. Les modèles de vision sont entraînés sur des données GMP de contrôle qualité." },
  { q: "Quel est le délai de déploiement typique ?", a: "Premier MVP validé en 4 à 6 semaines en environnement de qualification. Déploiement production avec validation CSV complète en 12 à 16 semaines. Nous suivons un cycle V-Model adapté aux systèmes informatisés pharmaceutiques." },
  { q: "Comment gérez-vous la protection des données patients ?", a: "Architecture privacy-by-design conforme RGPD et HIPAA. Les données sont pseudonymisées ou anonymisées à l'ingestion. Encryption AES-256 at rest, TLS 1.3 in transit. Hébergement sur infrastructure certifiée ISO 27001 et SOC 2 Type II." },
];

export function PharmaFAQ() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
            Questions réglementaires & techniques
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
              Tout ce que les <strong style={{ color: "#0F172A" }}>équipes Regulatory Affairs et Quality Assurance</strong> doivent
              savoir avant de déployer notre plateforme.
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
