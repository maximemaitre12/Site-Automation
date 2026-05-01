const sections = [
  {
    title: "1. Responsable du traitement",
    items: [
      { subtitle: "Identité", text: "AETHER Group, représenté par Youriy Strashnyi, dont le siège social est situé au 66 Avenue des Champs-Élysées, 75008 Paris, France. SIREN : 104 445 424 — SIRET : 104 445 424 00013." },
      { subtitle: "Contact", text: "Pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter à l'adresse : youriy.strashnyi@edu.em-lyon.com ou par téléphone au +33 7 87 24 84 02." },
    ]
  },
  {
    title: "2. Données collectées",
    items: [
      { subtitle: "Données que vous fournissez", text: "Lorsque vous créez un compte, demandez une démonstration ou nous contactez, nous collectons des informations telles que votre nom, adresse email, nom d'entreprise, fonction, et toute autre information que vous choisissez de fournir." },
      { subtitle: "Données collectées automatiquement", text: "Nous collectons automatiquement certaines informations lors de votre utilisation de nos services : adresse IP, type de navigateur, informations sur l'appareil, pages visitées et habitudes d'utilisation." },
      { subtitle: "Cookies", text: "Notre site utilise des cookies strictement nécessaires au fonctionnement du service. Aucun cookie publicitaire ou de traçage n'est utilisé sans votre consentement explicite." },
    ]
  },
  {
    title: "3. Finalités du traitement",
    items: [
      { subtitle: "Fourniture du service", text: "Nous utilisons vos données pour fournir, maintenir et améliorer les services AETHER, y compris le traitement de vos demandes et l'assistance client." },
      { subtitle: "Communication", text: "Nous pouvons utiliser votre email pour vous envoyer des mises à jour de service et des alertes de sécurité. Les communications marketing ne sont envoyées qu'avec votre consentement préalable." },
      { subtitle: "Analyses et amélioration", text: "Nous analysons les habitudes d'utilisation pour améliorer notre plateforme. Cette analyse est effectuée sur des données agrégées et anonymisées dans la mesure du possible." },
      { subtitle: "Obligations légales", text: "Nous pouvons utiliser vos données pour nous conformer à nos obligations légales, faire respecter nos conditions d'utilisation et protéger la sécurité de notre plateforme." },
    ]
  },
  {
    title: "4. Base juridique du traitement",
    items: [
      { subtitle: "Consentement", text: "Pour les communications marketing et les cookies non essentiels (article 6.1.a du RGPD)." },
      { subtitle: "Exécution du contrat", text: "Pour la fourniture de nos services et la gestion de votre compte (article 6.1.b du RGPD)." },
      { subtitle: "Intérêt légitime", text: "Pour l'amélioration de nos services et la prévention de la fraude (article 6.1.f du RGPD)." },
      { subtitle: "Obligation légale", text: "Pour le respect de nos obligations fiscales et réglementaires (article 6.1.c du RGPD)." },
    ]
  },
  {
    title: "5. Partage et divulgation des données",
    items: [
      { subtitle: "Nous ne vendons pas vos données", text: "AETHER Group ne vend, ne loue ni n'échange vos informations personnelles à des tiers à des fins commerciales." },
      { subtitle: "Sous-traitants", text: "Nous travaillons avec des prestataires de confiance qui traitent les données pour notre compte dans le cadre d'accords de confidentialité stricts et conformes au RGPD." },
      { subtitle: "Obligations légales", text: "Nous pouvons divulguer des informations lorsque la loi l'exige, sur décision de justice, ou pour protéger les droits et la sécurité d'AETHER Group et de ses utilisateurs." },
    ]
  },
  {
    title: "6. Sécurité des données",
    items: [
      { subtitle: "Chiffrement", text: "Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256)." },
      { subtitle: "Contrôles d'accès", text: "Nous mettons en œuvre des contrôles d'accès stricts, garantissant que seul le personnel autorisé peut accéder aux données des utilisateurs." },
    ]
  },
  {
    title: "7. Vos droits (RGPD)",
    items: [
      { subtitle: "Droit d'accès", text: "Vous avez le droit d'accéder à vos données personnelles et d'en obtenir une copie (article 15 du RGPD)." },
      { subtitle: "Droit de rectification", text: "Vous pouvez demander la correction de données inexactes ou incomplètes (article 16 du RGPD)." },
      { subtitle: "Droit à l'effacement", text: "Vous pouvez demander la suppression de vos données personnelles (article 17 du RGPD)." },
      { subtitle: "Droit à la portabilité", text: "Vous pouvez recevoir vos données dans un format structuré et couramment utilisé (article 20 du RGPD)." },
      { subtitle: "Droit d'opposition", text: "Vous pouvez vous opposer au traitement de vos données à tout moment (article 21 du RGPD)." },
      { subtitle: "Droit de retirer votre consentement", text: "Lorsque le traitement repose sur votre consentement, vous pouvez le retirer à tout moment sans affecter la licéité du traitement antérieur." },
      { subtitle: "Réclamation auprès de la CNIL", text: "Si vous estimez que le traitement de vos données constitue une violation du RGPD, vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr)." },
    ]
  },
];

const highlights = ["RGPD", "Pas de revente de données", "Droit à l'oubli", "Chiffrement bout-en-bout"];

export default function Privacy() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="pt-16 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5">Legal</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.08]">Politique de Confidentialité</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            La protection de vos données personnelles est au cœur de nos engagements.
          </p>
          <p className="mt-3 text-xs text-muted-foreground/60">Dernière mise à jour : 1er mai 2026</p>
        </div>
      </section>

      {/* Highlights */}
      <section className="pb-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {highlights.map((h) => (
              <span key={h} className="px-4 py-2 rounded-full text-xs font-medium bg-secondary text-foreground/70 border border-border">
                ✓ {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed mb-10">
            AETHER Group ("AETHER", "nous", "notre") s'engage à protéger votre vie privée conformément au 
            Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679). 
            La présente politique de confidentialité explique comment nous collectons, utilisons, divulguons 
            et protégeons vos informations lorsque vous utilisez notre plateforme et nos services associés.
          </p>

          <div className="space-y-10">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-border pb-10 last:border-0 last:pb-0">
                <h2 className="text-lg font-semibold text-foreground mb-5">{section.title}</h2>
                <div className="space-y-4">
                  {section.items.map((item, i) => (
                    <div key={i}>
                      <h3 className="text-sm font-semibold text-foreground mb-1">{item.subtitle}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-6">
            <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
              <h2 className="text-base font-semibold text-foreground mb-2">8. Conservation des données</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nous conservons vos données personnelles aussi longtemps que votre compte est actif ou que cela est nécessaire pour fournir nos services. À la suppression du compte, nous supprimerons ou anonymiserons vos données dans un délai de 90 jours.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
              <h2 className="text-base font-semibold text-foreground mb-2">9. Transferts internationaux</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AETHER Group opère avec des centres de données dans l'Union européenne. En cas de transfert de données hors UE, nous utilisons les Clauses Contractuelles Types approuvées par la Commission européenne.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
              <h2 className="text-base font-semibold text-foreground mb-2">10. Modifications de cette politique</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nous pouvons mettre à jour cette politique de confidentialité à tout moment. Toute modification substantielle vous sera notifiée par la publication de la nouvelle politique sur cette page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-secondary/40">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Questions ?</p>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">Protection des données</h2>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p>
              <a href="mailto:youriy.strashnyi@edu.em-lyon.com" className="hover:text-foreground transition-colors">
                youriy.strashnyi@edu.em-lyon.com
              </a>
            </p>
            <p>
              <a href="tel:+33787248402" className="hover:text-foreground transition-colors">
                +33 7 87 24 84 02
              </a>
            </p>
            <p className="text-xs text-muted-foreground/60 mt-3">
              AETHER Group — 66 Av. des Champs-Élysées, 75008 Paris
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
