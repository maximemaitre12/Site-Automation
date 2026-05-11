import { Building2, MapPin, Phone, CreditCard, Server, Shield, Scale } from "lucide-react";

const companyInfo = [
  {
    icon: Building2,
    title: "Entreprise",
    items: [
      { label: "Dénomination", value: "AETHER Group" },
      { label: "Forme juridique", value: "Société par actions simplifiée (SAS)" },
      { label: "Représentant légal", value: "Youriy Strashnyi, Président" },
      { label: "SIREN", value: "104 445 424" },
      { label: "SIRET", value: "104 445 424 00013" },
      { label: "Code APE", value: "70.22Z, Conseil pour les affaires et autres conseils de gestion" },
      { label: "Date de création", value: "29 avril 2026" },
      { label: "TVA", value: "Non applicable, art. 293 B du CGI (franchise en base)" },
    ],
  },
  {
    icon: MapPin,
    title: "Siège social",
    items: [
      { label: "Adresse", value: "66 Avenue des Champs Élysées, 75008 Paris, France" },
    ],
  },
  {
    icon: Phone,
    title: "Contact",
    items: [
      { label: "Email général", value: "contact@aether-connect.com", href: "mailto:contact@aether-connect.com" },
      { label: "Email direction", value: "youriy.strashnyi@edu.em-lyon.com", href: "mailto:youriy.strashnyi@edu.em-lyon.com" },
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

const additionalSections = [
  {
    icon: Server,
    title: "Directeur de la publication",
    body: "Le directeur de la publication du site aether-connect.com est Youriy Strashnyi, en sa qualité de Président d'AETHER Group. Toute demande relative au contenu publié peut lui être adressée par email à contact@aether-connect.com.",
  },
  {
    icon: Server,
    title: "Hébergement",
    body: "Le site aether-connect.com est hébergé sur une infrastructure cloud opérée pour le compte d'AETHER Group, avec stockage des données utilisateurs sur des serveurs situés dans l'Union européenne. Toute demande technique concernant l'hébergement peut être adressée à contact@aether-connect.com.",
  },
  {
    icon: Shield,
    title: "Propriété intellectuelle",
    body: "L'ensemble des contenus présents sur ce site, incluant textes, images, logos, marques, vidéos, codes sources et bases de données, sont protégés par le droit français et international de la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, par quelque procédé que ce soit, est strictement interdite sans autorisation écrite préalable d'AETHER Group. Toute utilisation non autorisée constitue une contrefaçon sanctionnée par les articles L.335.2 et suivants du Code de la propriété intellectuelle.",
  },
  {
    icon: Shield,
    title: "Données personnelles et cookies",
    body: "Les données personnelles collectées via ce site sont traitées conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés. Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité, de limitation et d'opposition que vous pouvez exercer à tout moment en écrivant à contact@aether-connect.com. Pour le détail des traitements et de la politique de cookies, merci de consulter la Politique de confidentialité accessible depuis le pied de page du site.",
  },
  {
    icon: Scale,
    title: "Droit applicable et juridiction compétente",
    body: "Les présentes mentions légales et l'utilisation du site sont régies par le droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents du ressort de la Cour d'appel de Paris seront seuls compétents.",
  },
];

export default function LegalNotice() {
  return (
    <div className="pt-20">
      <section className="pt-16 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5">Legal</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.08]">
            Mentions légales
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Informations légales relatives à AETHER Group, conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.
          </p>
          <p className="mt-3 text-xs text-muted-foreground/60">Dernière mise à jour : Mai 2026</p>
        </div>
      </section>

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
                      <a href={item.href} className="text-sm text-foreground hover:text-primary transition-colors">
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

      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {additionalSections.map((section) => (
            <div key={section.title} className="p-6 rounded-2xl bg-secondary/40 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center">
                  <section.icon className="w-4 h-4 text-foreground/60" />
                </div>
                <h2 className="text-base font-semibold text-foreground">{section.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
