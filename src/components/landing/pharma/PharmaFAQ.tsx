import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const faqs = [
  { q: "Is your AI compliant with 21 CFR Part 11 and Annex 11?", a: "Yes. Every system is deployed with electronic signatures, immutable audit trails and RBAC access control. Our IQ/OQ/PQ validation protocols are delivered with each release and documented in a Validation Master Plan." },
  { q: "How do you integrate with existing systems (LIMS, MES, SAP)?", a: "Through a microservices architecture with RESTful/GraphQL APIs. We support native connectors for SAP, Veeva Vault, Documentum, Argus Safety and major LIMS platforms. Integration happens with zero disruption to your operations." },
  { q: "Are your models trained on pharmaceutical data?", a: "Our NLP models are fine-tuned on regulatory corpora from ICH, FDA Guidance Documents, EMA Scientific Guidelines and anonymized pharmacovigilance datasets. Vision models are trained on real GMP quality control data." },
  { q: "What is a typical deployment timeline?", a: "First validated MVP in 4 to 6 weeks in a qualification environment. Full production deployment with complete CSV validation in 12 to 16 weeks. We follow an adapted V-Model cycle for computerized pharmaceutical systems." },
  { q: "How do you handle patient data protection?", a: "Privacy-by-design architecture compliant with GDPR and HIPAA. Data is pseudonymized or anonymized at ingestion. AES-256 encryption at rest, TLS 1.3 in transit. Hosted on ISO 27001 and SOC 2 Type II certified infrastructure." },
  { q: "Can you migrate our legacy on-premise data to cloud?", a: "Absolutely. We design and execute full data migration strategies from legacy on-premise systems to cloud infrastructure (AWS, Azure, GCP). Every migration preserves data integrity, audit trails and regulatory traceability throughout the process." },
];

export function PharmaFAQ() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16">
            <div className="w-8 h-[3px]" style={{ background: "#0369A1" }} />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: "#0369A1" }}>
              Regulatory & technical questions
            </span>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <ScrollReveal delay={150}>
              <h2
                className="font-heading text-[34px] md:text-5xl lg:text-[52px] font-bold leading-[1.08] mb-6"
                style={{ color: "#0F172A" }}
              >
                Frequently
                <br />
                asked questions.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p className="text-[15px] leading-[1.85]" style={{ color: "#4a5568" }}>
                Everything your <strong style={{ color: "#0F172A" }}>Regulatory Affairs and Quality Assurance</strong> teams
                need to know before deploying our platform.
              </p>
            </ScrollReveal>
          </div>

          <div>
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <ScrollReveal key={i} delay={i * 120}>
                  <AccordionItem
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
                </ScrollReveal>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
