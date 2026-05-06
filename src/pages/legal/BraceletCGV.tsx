import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Objet",
    content: `Les présentes Conditions Générales de Vente (ci-après "CGV") régissent la vente du bracelet connecté Oreon (ci-après "le Bracelet") par AETHER GROUP, SAS immatriculée sous le SIREN 104 445 424, dont le siège social est situé au 66 Avenue des Champs-Élysées, 75008 Paris (ci-après "le Vendeur"), à toute personne physique majeure (ci-après "l'Acheteur").

Toute commande implique l'acceptation sans réserve des présentes CGV.`,
  },
  {
    title: "2. Produit",
    content: `Le Bracelet Oreon est un bracelet en silicone équipé d'une puce NFC chiffrée, servant de clé d'identification pour accéder aux services de la plateforme AETHER.

Le Bracelet n'est pas un dispositif médical au sens du Règlement (UE) 2017/745. Il ne contient aucun composant électronique actif, aucune batterie et aucun capteur biométrique embarqué.

Les caractéristiques essentielles du Bracelet sont :
• Matériau : silicone médical hypoallergénique
• Puce NFC chiffrée (lecture seule)
• Étanche (IP68)
• Résistant aux chocs
• Garanti à vie contre les défauts de fabrication`,
  },
  {
    title: "3. Prix",
    content: `Les prix sont indiqués en euros, toutes taxes comprises (TTC). TVA non applicable conformément à l'article 293 B du CGI.

Les tarifs en vigueur sont :
• Formule Précommande : 3,99 € TTC (paiement unique)
• Formule Livraison Express : 4,99 € TTC (paiement unique)

Les frais de livraison sont inclus dans le prix pour la France métropolitaine. Des frais supplémentaires peuvent s'appliquer pour les livraisons hors France métropolitaine.

Le Vendeur se réserve le droit de modifier ses prix à tout moment. Les produits sont facturés sur la base du tarif en vigueur au moment de la validation de la commande.`,
  },
  {
    title: "4. Commande",
    content: `La commande s'effectue exclusivement en ligne via le site aether-connect.com.

Le processus de commande comprend les étapes suivantes :
1. Sélection de la formule (Précommande ou Livraison Express)
2. Renseignement des informations de livraison
3. Choix du mode de paiement
4. Vérification et validation de la commande
5. Confirmation par email

La validation de la commande vaut acceptation des présentes CGV et constitue la conclusion du contrat de vente.

Le Vendeur se réserve le droit de refuser toute commande en cas de motif légitime (suspicion de fraude, informations erronées, etc.).`,
  },
  {
    title: "5. Paiement",
    content: `Le paiement s'effectue en une seule fois, au moment de la commande, par l'un des moyens suivants :
• Carte bancaire (Visa, Mastercard, American Express)
• Prélèvement SEPA (Single Euro Payments Area)

Les paiements sont sécurisés par notre prestataire Stripe, certifié PCI DSS niveau 1. Aucune donnée bancaire n'est stockée sur nos serveurs.

En cas de paiement par SEPA, l'Acheteur autorise le Vendeur à émettre un ordre de prélèvement unique sur le compte bancaire indiqué. Ce mandat est conforme au règlement (UE) n°260/2012. L'Acheteur peut contester un prélèvement auprès de sa banque dans un délai de 8 semaines suivant le débit.

Aucun prélèvement récurrent ne sera effectué pour l'achat du Bracelet. L'abonnement à la plateforme AETHER fait l'objet de conditions distinctes.`,
  },
  {
    title: "6. Livraison",
    content: `Les délais indicatifs de livraison sont :
• Formule Précommande : livraison estimée avant le 1er juin 2026
• Formule Livraison Express : expédition sous 48h ouvrées après validation du paiement

La livraison est effectuée à l'adresse indiquée par l'Acheteur lors de la commande. Le Vendeur ne saurait être tenu responsable des retards de livraison imputables au transporteur ou résultant de cas de force majeure.

En cas de non-livraison dans un délai de 30 jours après la date prévue, l'Acheteur pourra annuler sa commande et obtenir un remboursement intégral.

Le transfert de propriété du Bracelet s'opère dès la livraison effective. Le transfert des risques intervient au moment de la remise du colis au transporteur.`,
  },
  {
    title: "7. Droit de rétractation",
    content: `Conformément aux articles L.221-18 et suivants du Code de la consommation, l'Acheteur dispose d'un délai de 14 jours calendaires à compter de la réception du Bracelet pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalité.

Pour exercer ce droit, l'Acheteur doit notifier sa décision par email à contact@aether-connect.com en indiquant son numéro de commande.

Le Bracelet devra être retourné dans son emballage d'origine, en parfait état, dans un délai de 14 jours suivant la notification de rétractation. Les frais de retour sont à la charge de l'Acheteur.

Le remboursement sera effectué dans un délai maximum de 14 jours suivant la réception du Bracelet retourné, par le même moyen de paiement que celui utilisé lors de la commande.`,
  },
  {
    title: "8. Garanties",
    content: `Le Bracelet bénéficie des garanties suivantes :

Garantie légale de conformité (articles L.217-4 à L.217-14 du Code de la consommation) :
L'Acheteur dispose d'un délai de 2 ans à compter de la livraison pour agir. Il peut choisir entre la réparation ou le remplacement du Bracelet. Il est dispensé de rapporter la preuve de l'existence du défaut de conformité durant les 24 mois suivant la délivrance.

Garantie des vices cachés (articles 1641 à 1649 du Code civil) :
L'Acheteur peut choisir entre la résolution de la vente ou une réduction du prix conformément à l'article 1644 du Code civil.

Garantie commerciale "à vie" :
Le Vendeur garantit le Bracelet contre tout défaut de fabrication, sans limitation de durée, dans des conditions normales d'utilisation. Cette garantie couvre le remplacement gratuit du Bracelet défectueux. Elle ne couvre pas l'usure normale, les dommages résultant d'une mauvaise utilisation ou les modifications apportées par l'Acheteur.`,
  },
  {
    title: "9. Responsabilité",
    content: `Le Vendeur est responsable de la conformité du Bracelet à sa description et à l'usage prévu.

Le Vendeur ne saurait être tenu responsable :
• Des dommages indirects résultant de l'utilisation du Bracelet
• De l'interruption ou de l'indisponibilité des services de la plateforme AETHER
• Des décisions prises par l'Acheteur sur la base des données fournies par la plateforme
• Des dommages résultant d'un cas de force majeure

La responsabilité du Vendeur est limitée au montant de la commande.`,
  },
  {
    title: "10. Données personnelles",
    content: `Les données personnelles collectées lors de la commande (nom, prénom, adresse, email, coordonnées bancaires) sont traitées conformément au Règlement Général sur la Protection des Données (RGPD).

Responsable du traitement : AETHER GROUP
Finalités : exécution de la commande, livraison, service après-vente, communication commerciale (avec consentement)
Base légale : exécution du contrat (article 6.1.b du RGPD)
Durée de conservation : durée de la relation commerciale + 5 ans (obligations légales)

L'Acheteur dispose des droits d'accès, de rectification, d'effacement, de portabilité, de limitation et d'opposition.

Pour exercer ces droits : contact@aether-connect.com

Pour plus d'informations, consulter notre Politique de Confidentialité.`,
  },
  {
    title: "11. Propriété intellectuelle",
    content: `La marque AETHER, le nom Oreon, les logos, designs et l'ensemble des éléments visuels associés sont la propriété exclusive d'AETHER GROUP.

Toute reproduction, représentation ou exploitation, même partielle, sans autorisation écrite préalable est strictement interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.`,
  },
  {
    title: "12. Droit applicable et litiges",
    content: `Les présentes CGV sont régies par le droit français.

En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGV, les parties s'efforceront de trouver une solution amiable.

Conformément à l'article L.616-1 du Code de la consommation, l'Acheteur peut recourir gratuitement à un médiateur de la consommation dans un délai d'un an à compter de sa réclamation écrite auprès du Vendeur.

À défaut de résolution amiable, les tribunaux compétents du ressort de la Cour d'appel de Paris seront seuls compétents.`,
  },
  {
    title: "13. Contact",
    content: `AETHER GROUP
66 Avenue des Champs-Élysées, 75008 Paris
SIREN : 104 445 424
Email : contact@aether-connect.com
TVA non applicable — art. 293 B du CGI`,
  },
];

export default function BraceletCGV() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-[800px] mx-auto px-6">
        <Link to="/bracelet" className="text-sm font-medium mb-8 inline-block hover:underline" style={{ color: "#1E4D8C" }}>
          ← Retour au bracelet Oreon
        </Link>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#0F172A" }}>
          Conditions Générales de Vente
        </h1>
        <p className="text-sm mb-2" style={{ color: "#64748B" }}>Bracelet connecté Oreon</p>
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
            <Link to="/legal/bracelet-cgu" className="underline hover:no-underline" style={{ color: "#1E4D8C" }}>
              Conditions Générales d'Utilisation
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
