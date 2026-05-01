import { Building2, MapPin, Phone, Mail, CreditCard } from "lucide-react";

const companyInfo = [
  {
    icon: Building2,
    title: "Entreprise",
    items: [
      { label: "Dénomination commerciale", value: "AETHER Group" },
      { label: "Représentant légal", value: "Youriy Strashnyi" },
      { label: "SIREN", value: "104 445 424" },
      { label: "SIRET", value: "104 445 424 00013" },
      { label: "Code APE", value: "70.22Z — Conseil pour les affaires et autres conseils de gestion" },
      { label: "Date de création", value: "29/04/2026" },
      { label: "TVA", value: "Non applicable, art. 293 B du CGI (franchise en base)" },
    ],
  },
  {
    icon: MapPin,
    title: "Siège social",
    items: [
      { label: "Adresse", value: "66 Avenue des Champs-Élysées, 75008 Paris, France" },
    ],
  },
  {
    icon: Phone,
    title: "Contact",
    items: [
      { label: "Email", value: "youriy.strashnyi@edu.em-lyon.com", href: "mailto:youriy.strashnyi@edu.em-lyon.com" },
      { label: "Téléphone", value: "+33 7 87 24 84 02", href: "tel:+33787248402" },
    ],
  },
  {
    icon: CreditCard,
    title: "Coordonnées bancaires (mandats SEPA)",
    items: [
      { label: "IBAN", value: "FR76 3123 3123 4500 8631 4891 173" },
      { label: "BIC", value: "TRBKFRPPXXX" },
      { label: "Banque", value: "Trade Republic Bank GmbH, Branch France" },
    ],
  },
];

export default function LegalNotice() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="pt-16 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5">Legal</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.08]">
            Mentions Légales
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Informations légales relatives à AETHER Group conformément à la législation française.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {companyInfo.map((section) => (
            <div
              key={section.title}
              className="p-6 rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-foreground/[0.03] hover:border-foreground/10"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-foreground/60" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.label} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide min-w-[160px]">
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-sm text-foreground">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hébergement & Éditeur */}
      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
            <h2 className="text-base font-semibold text-foreground mb-2">Éditeur du site</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le site aether-connect.com est édité par AETHER Group, société enregistrée sous le SIREN 104 445 424,
              dont le siège social est situé au 66 Avenue des Champs-Élysées, 75008 Paris, France.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
            <h2 className="text-base font-semibold text-foreground mb-2">Hébergement</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ce site est hébergé par Lovable (GPT Engineer Inc.), dont le siège social est situé à San Francisco, CA, États-Unis.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
            <h2 className="text-base font-semibold text-foreground mb-2">Propriété intellectuelle</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              L'ensemble des contenus présents sur ce site (textes, images, logos, marques) sont protégés par le droit de la propriété intellectuelle.
              Toute reproduction, même partielle, est interdite sans autorisation écrite préalable d'AETHER Group.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
