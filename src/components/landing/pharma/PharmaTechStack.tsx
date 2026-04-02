import { Server, Cloud, Link2, Brain, Lock, Monitor, Check } from "lucide-react";

const cards = [
  {
    icon: Server,
    title: "On-Premise Deployment",
    subtitle: "Vos données ne quittent pas votre serveur.",
    items: ["Docker containers (Linux)", "Kubernetes orchestration", "API REST pour intégration externe", "Conformité stricte (GDPR, pharma)", "Zero data exfiltration risk"],
    bg: "#FFF8F0",
    border: "#FF6B35",
  },
  {
    icon: Cloud,
    title: "Cloud-Native (Azure/AWS)",
    subtitle: "Infrastructure gérée par nous.",
    items: ["Microsoft Azure (recommandé pharma EU)", "AWS si déjà en place", "Auto-scaling", "Disaster recovery inclus", "Coûts prévisibles"],
    bg: "#F0F4FF",
    border: "#0033CC",
  },
  {
    icon: Link2,
    title: "Intégrations Natives",
    subtitle: "On parle à tous les systèmes existants.",
    items: ["SAP (SuccessFactors, Ariba)", "Salesforce, Oracle, NetSuite", "Microsoft Dynamics 365", "Systèmes custom via API", "REST, SOAP, GraphQL · OAuth 2.0"],
    bg: "#E8F9F7",
    border: "#17A2B8",
  },
  {
    icon: Brain,
    title: "Modèles IA",
    subtitle: "Combinaison de SOTA + custom models.",
    items: ["Large Language Models (GPT-4, Claude)", "Computer Vision (doc classification)", "NLP (text extraction, sentiment)", "GPU acceleration (NVIDIA)", "Auto-retraining pipelines"],
    bg: "#F9F0FF",
    border: "#7C3AED",
  },
  {
    icon: Lock,
    title: "Security & Compliance",
    subtitle: "Sécurité de niveau enterprise.",
    items: ["ISO 27001 certified", "SOC 2 Type II audited", "End-to-end encryption (AES-256)", "Zero-trust architecture", "99.99% SLA"],
    bg: "#FFF4E6",
    border: "#FF6B35",
  },
  {
    icon: Monitor,
    title: "Monitoring & Support",
    subtitle: "Vous voyez tout en temps réel.",
    items: ["Process execution metrics", "Error rates & alerts", "Cost savings tracker", "24/7 monitoring", "4h incident response (critical)"],
    bg: "#F0FFF4",
    border: "#2CAA56",
  },
];

export function PharmaTechStack() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: "#0033CC" }}>
            Technologie de classe mondiale
          </h2>
          <p className="text-lg" style={{ color: "#4A4A4A" }}>
            Vos données restent là où elles sont. Nos solutions s'intègrent sans disruption.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.title} className="rounded-xl p-6" style={{ background: c.bg, borderLeft: `4px solid ${c.border}` }}>
              <c.icon className="w-8 h-8 mb-3" style={{ color: c.border }} />
              <h3 className="font-heading text-base font-bold mb-1" style={{ color: "#0033CC" }}>{c.title}</h3>
              <p className="text-sm mb-3" style={{ color: "#4A4A4A" }}>{c.subtitle}</p>
              <ul className="space-y-1.5">
                {c.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#2C3E50" }}>
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: c.border }} />
                    {item}
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
