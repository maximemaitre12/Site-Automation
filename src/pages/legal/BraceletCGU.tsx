import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Objet",
    content: `Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'utilisation du bracelet connecté Oreon (ci-après "le Bracelet") et des services associés fournis par AETHER GROUP, SAS immatriculée sous le SIREN 104 445 424, dont le siège social est situé au 66 Avenue des Champs-Élysées, 75008 Paris (ci-après "l'Éditeur").

En scannant le QR code d'activation et en souscrivant à l'abonnement, l'utilisateur (ci-après "l'Abonné") accepte sans réserve l'intégralité des présentes CGU.`,
  },
  {
    title: "2. Description de l'offre",
    content: `L'offre Oreon comprend :

• L'achat d'un bracelet connecté Oreon à prix accessible
• L'accès à l'application AETHER de suivi biométrique et d'automatisations IA
• Un paiement unique selon la formule choisie :
  — Formule Précommande : 3,99€ TTC (paiement unique)
  — Formule Livraison directe : 4,99€ TTC (paiement unique)

Le Bracelet est acheté par l'Abonné et devient sa propriété dès réception.`,
  },
  {
    title: "3. Paiement",
    content: `Le paiement s'effectue en une seule fois par carte bancaire ou prélèvement SEPA (Single Euro Payments Area) via notre prestataire de paiement sécurisé Stripe.

Le montant est débité une seule fois lors de la commande. Aucun prélèvement récurrent ne sera effectué.

En cas de paiement par SEPA, l'Abonné autorise l'Éditeur à émettre un ordre de prélèvement unique sur le compte bancaire indiqué. Ce mandat de prélèvement est conforme au règlement (UE) n°260/2012.

L'Abonné peut contester un prélèvement auprès de sa banque dans un délai de 8 semaines suivant le débit, conformément à la réglementation SEPA.`,
  },
  {
    title: "4. Accès aux services",
    content: `L'accès à l'application AETHER et aux fonctionnalités associées est accordé dès validation du paiement, sans limitation de durée.

L'Éditeur se réserve le droit de suspendre l'accès en cas d'utilisation frauduleuse ou contraire aux présentes CGU.`,
  },
  {
    title: "5. Collecte et traitement des données biométriques",
    content: `Le Bracelet collecte les données biométriques suivantes :
• Fréquence cardiaque et variabilité cardiaque (HRV)
• Saturation en oxygène (SpO2)
• Température corporelle
• Données de mouvement et d'activité physique
• Qualité et cycles du sommeil

Ces données constituent des données de santé au sens de l'article 9 du Règlement Général sur la Protection des Données (RGPD). Leur traitement repose sur le consentement explicite de l'Abonné (article 9.2.a du RGPD).

L'Abonné peut retirer son consentement à tout moment via l'application ou par email. Le retrait du consentement entraîne la cessation du traitement mais n'affecte pas la licéité du traitement effectué avant ce retrait.`,
  },
  {
    title: "6. Hébergement et sécurité des données",
    content: `Les données biométriques sont :
• Chiffrées de bout en bout (AES-256) lors de la transmission et du stockage
• Hébergées exclusivement sur des serveurs situés dans l'Union Européenne
• Conservées pendant la durée de l'abonnement et supprimées dans un délai de 30 jours après résiliation, sauf demande contraire de l'Abonné

L'Abonné dispose des droits suivants conformément au RGPD :
• Droit d'accès, de rectification et d'effacement
• Droit à la portabilité des données
• Droit à la limitation du traitement
• Droit d'opposition

Pour exercer ces droits : contact@aether-connect.com`,
  },
  {
    title: "7. Garantie et responsabilité",
    content: `Le Bracelet bénéficie de la garantie légale de conformité (articles L.217-4 à L.217-14 du Code de la consommation) et de la garantie des vices cachés (articles 1641 à 1649 du Code civil).

L'Éditeur garantit le bon fonctionnement du Bracelet pendant 24 mois à compter de la livraison, dans des conditions normales d'utilisation.

L'Éditeur ne saurait être tenu responsable :
• Des dommages résultant d'une utilisation non conforme du Bracelet
• De l'exactitude absolue des mesures biométriques, le Bracelet n'étant pas un dispositif médical
• Des décisions prises par l'Abonné sur la base des données fournies

Le Bracelet Oreon n'est pas un dispositif médical au sens du Règlement (UE) 2017/745. Les données fournies sont indicatives et ne se substituent en aucun cas à un avis médical professionnel.`,
  },
  {
    title: "8. Automatisations IA",
    content: `Les fonctionnalités d'automatisation IA permettent à l'Abonné de créer des workflows déclenchés par ses données biométriques.

L'Éditeur ne garantit pas que les automatisations fonctionneront de manière ininterrompue ou sans erreur. L'Abonné est seul responsable de la configuration de ses automatisations et des actions qui en résultent.

L'Éditeur se réserve le droit de modifier, limiter ou supprimer certaines fonctionnalités d'automatisation, avec un préavis raisonnable de 30 jours.`,
  },
  {
    title: "9. Droit de rétractation",
    content: `Conformément à l'article L.221-18 du Code de la consommation, l'Abonné dispose d'un délai de 14 jours à compter de la réception du Bracelet pour exercer son droit de rétractation, sans motif et sans pénalité.

Pour exercer ce droit, l'Abonné doit notifier sa décision par email à contact@aether-connect.com et retourner le Bracelet dans son emballage d'origine, en parfait état, dans un délai de 14 jours suivant la notification.

Le remboursement des sommes éventuellement prélevées sera effectué dans un délai de 14 jours suivant la réception du Bracelet retourné.`,
  },
  {
    title: "10. Modification des CGU",
    content: `L'Éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications seront notifiées à l'Abonné par email au moins 30 jours avant leur entrée en vigueur.

En cas de désaccord avec les nouvelles CGU, l'Abonné pourra résilier son abonnement sans frais dans un délai de 30 jours suivant la notification.`,
  },
  {
    title: "11. Droit applicable et litiges",
    content: `Les présentes CGU sont régies par le droit français.

En cas de litige, l'Abonné peut recourir gratuitement au service de médiation de la consommation. À défaut de résolution amiable, les tribunaux français seront compétents.

Conformément à l'article L.616-1 du Code de la consommation, l'Abonné peut saisir le médiateur de la consommation dans un délai d'un an à compter de sa réclamation écrite auprès de l'Éditeur.`,
  },
  {
    title: "12. Contact",
    content: `AETHER GROUP
66 Avenue des Champs-Élysées, 75008 Paris
SIREN : 104 445 424
Email : contact@aether-connect.com
TVA non applicable — art. 293 B du CGI`,
  },
];

export default function BraceletCGU() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-[800px] mx-auto px-6">
        <Link to="/bracelet" className="text-sm font-medium mb-8 inline-block hover:underline" style={{ color: "#1E4D8C" }}>
          ← Retour au bracelet Oreon
        </Link>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#0F172A" }}>
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-sm mb-2" style={{ color: "#64748B" }}>Bracelet connecté Oreon et services associés</p>
        <p className="text-xs mb-16" style={{ color: "#94A3B8" }}>Dernière mise à jour : Mai 2026</p>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-heading text-xl font-semibold mb-4" style={{ color: "#0F172A" }}>{section.title}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#475569" }}>{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm" style={{ color: "#64748B" }}>
            Voir également :{" "}
            <Link to="/legal/bracelet-cgv" className="underline hover:no-underline" style={{ color: "#1E4D8C" }}>
              Conditions Générales de Vente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
