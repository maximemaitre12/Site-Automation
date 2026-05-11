import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Objet",
    content: `Les présentes Conditions Générales de Vente (ci‑après désignées CGV) régissent la vente du bracelet connecté Oreon (ci‑après désigné le Bracelet) par AETHER Group, société par actions simplifiée immatriculée sous le SIREN 104 445 424, dont le siège social est situé au 66 Avenue des Champs Élysées, 75008 Paris (ci‑après désigné le Vendeur), à toute personne physique majeure (ci‑après désignée l'Acheteur).

Toute commande passée sur le site aether-connect.com implique l'acceptation pleine, entière et sans réserve des présentes CGV.`,
  },
  {
    title: "2. Produit",
    content: `Le Bracelet Oreon est un bracelet en silicone médical équipé d'une puce NFC chiffrée. Il sert exclusivement de clé d'identification permettant à son porteur d'accéder aux services de la plateforme AETHER.

Le Bracelet n'est pas un dispositif médical au sens du Règlement (UE) 2017/745. Il ne contient aucun composant électronique actif, aucune batterie, aucun capteur biométrique embarqué et n'effectue aucune mesure physiologique.

Caractéristiques essentielles :
• Matériau : silicone médical hypoallergénique
• Puce NFC chiffrée en lecture seule
• Étanchéité certifiée IP68
• Résistance aux chocs et à la torsion
• Garantie commerciale à vie contre tout défaut de fabrication`,
  },
  {
    title: "3. Prix",
    content: `Le prix du Bracelet est indiqué en euros, toutes taxes comprises. La TVA n'est pas applicable conformément à l'article 293 B du Code général des impôts.

Tarif en vigueur :
• Bracelet Oreon, formule Précommande : 3,99 € TTC en paiement unique

Les frais de livraison sont inclus dans le prix pour la France métropolitaine. Des frais supplémentaires peuvent s'appliquer pour les livraisons hors de France métropolitaine et seront affichés clairement avant validation de la commande.

Le Vendeur se réserve la possibilité de modifier ses prix à tout moment. Les commandes sont facturées au tarif en vigueur au moment de leur validation.`,
  },
  {
    title: "4. Commande",
    content: `La commande s'effectue exclusivement en ligne sur le site aether-connect.com selon les étapes suivantes :

1. Sélection du Bracelet
2. Saisie des informations de livraison
3. Signature électronique du mandat de prélèvement SEPA
4. Vérification et validation de la commande
5. Confirmation par email contenant le récapitulatif et le numéro de commande

La validation de la commande vaut acceptation des présentes CGV et constitue la conclusion du contrat de vente.

Le Vendeur se réserve le droit de refuser toute commande pour motif légitime, notamment en cas de soupçon de fraude, d'informations manifestement erronées ou d'impayé antérieur.`,
  },
  {
    title: "5. Paiement",
    content: `Le paiement s'effectue exclusivement par prélèvement SEPA Direct Debit (Single Euro Payments Area), en une seule fois, au moment de la commande.

Le mandat SEPA est signé électroniquement directement sur le site, conformément au règlement (UE) n° 260/2012. L'Acheteur autorise ainsi le Vendeur à émettre un ordre de prélèvement unique sur le compte bancaire renseigné. Le débit intervient sous 24 heures ouvrées suivant la signature.

L'ensemble du processus de paiement est sécurisé par Stripe Payments Europe Ltd, prestataire certifié PCI DSS niveau 1. Aucune coordonnée bancaire n'est stockée sur les serveurs d'AETHER Group.

L'Acheteur conserve la faculté légale de contester un prélèvement auprès de sa banque dans un délai de 8 semaines suivant la date de débit, conformément aux règles SEPA.

Aucun prélèvement récurrent n'est effectué pour l'achat du Bracelet. L'éventuel abonnement à la plateforme AETHER fait l'objet d'un contrat distinct soumis à des conditions séparées.`,
  },
  {
    title: "6. Livraison",
    content: `Le Bracelet est livré à l'adresse renseignée par l'Acheteur lors de la commande.

Délai indicatif :
• Livraison estimée avant le 1er juin 2026 pour les commandes Précommande validées avant cette date

Le Vendeur informe l'Acheteur de l'expédition par email, accompagné d'un lien de suivi. Le Vendeur ne saurait être tenu responsable des retards imputables au transporteur ou résultant d'un cas de force majeure.

En cas de non livraison dans un délai de 30 jours après la date prévue, l'Acheteur peut annuler sa commande et obtenir un remboursement intégral selon la procédure décrite dans la Politique de remboursement.

Le transfert de propriété s'opère dès la livraison effective. Le transfert des risques intervient au moment de la remise du colis au transporteur.`,
  },
  {
    title: "7. Droit de rétractation",
    content: `Conformément aux articles L.221.18 et suivants du Code de la consommation, l'Acheteur dispose d'un délai de 14 jours calendaires à compter de la réception du Bracelet pour exercer son droit de rétractation, sans avoir à se justifier ni à payer de pénalité.

Pour exercer ce droit, l'Acheteur adresse simplement un email à contact@aether-connect.com en indiquant son numéro de commande. AETHER Group accuse réception sous 24 heures ouvrées et transmet une étiquette de retour prépayée.

Le Bracelet doit être retourné dans son emballage d'origine, en bon état général, dans un délai de 14 jours suivant la notification de rétractation.

Le remboursement intégral est effectué dans un délai maximum de 14 jours suivant la réception du Bracelet retourné, par le même moyen de paiement que celui utilisé lors de la commande.`,
  },
  {
    title: "8. Politique de remboursement étendue",
    content: `Au‑delà du droit légal de rétractation de 14 jours, AETHER Group accorde un délai commercial étendu de 30 jours calendaires à compter de la réception du Bracelet pour demander un remboursement intégral, sans justification.

Procédure simplifiée :
• Un email à contact@aether-connect.com avec le numéro de commande
• Réponse sous 24 heures ouvrées
• Étiquette de retour prépayée fournie par AETHER Group, aucun frais à la charge de l'Acheteur
• Remboursement effectué dans les 14 jours suivant la réception du retour

Le détail complet de cette politique figure sur la page Politique de remboursement, accessible depuis le pied de page du site.`,
  },
  {
    title: "9. Garanties",
    content: `Le Bracelet bénéficie des garanties suivantes :

Garantie légale de conformité (articles L.217.4 à L.217.14 du Code de la consommation) : l'Acheteur dispose d'un délai de 2 ans à compter de la livraison pour agir. Il peut choisir entre la réparation ou le remplacement du Bracelet et est dispensé d'apporter la preuve du défaut durant les 24 mois suivant la délivrance.

Garantie des vices cachés (articles 1641 à 1649 du Code civil) : l'Acheteur peut choisir entre la résolution de la vente ou une réduction du prix conformément à l'article 1644 du Code civil.

Garantie commerciale à vie : AETHER Group garantit le Bracelet contre tout défaut de fabrication, sans limitation de durée, dans des conditions normales d'utilisation. Cette garantie couvre le remplacement gratuit du Bracelet défectueux. Elle ne couvre pas l'usure normale, les dommages résultant d'une mauvaise utilisation ou les modifications apportées par l'Acheteur.`,
  },
  {
    title: "10. Responsabilité",
    content: `Le Vendeur est responsable de la conformité du Bracelet à sa description et à l'usage prévu.

Le Vendeur ne saurait être tenu responsable :
• Des dommages indirects résultant de l'utilisation du Bracelet
• De l'interruption ou de l'indisponibilité ponctuelle des services de la plateforme AETHER
• Des décisions opérationnelles prises par l'Acheteur sur la base des données fournies par la plateforme
• Des dommages résultant d'un cas de force majeure

La responsabilité du Vendeur est en tout état de cause limitée au montant de la commande concernée.`,
  },
  {
    title: "11. Données personnelles",
    content: `Les données personnelles collectées lors de la commande (nom, prénom, adresse postale, email, coordonnées bancaires) sont traitées conformément au Règlement Général sur la Protection des Données (RGPD).

Responsable du traitement : AETHER Group
Finalités : exécution de la commande, livraison, service client, obligations comptables et légales, communication commerciale sous réserve du consentement de l'Acheteur
Base légale : exécution du contrat (article 6.1.b du RGPD)
Durée de conservation : durée de la relation commerciale augmentée de 5 ans au titre des obligations légales

L'Acheteur dispose à tout moment des droits d'accès, de rectification, d'effacement, de portabilité, de limitation et d'opposition. Ces droits s'exercent par email à contact@aether-connect.com.`,
  },
  {
    title: "12. Propriété intellectuelle",
    content: `La marque AETHER, le nom Oreon, les logos, designs et l'ensemble des éléments visuels associés sont la propriété exclusive d'AETHER Group.

Toute reproduction, représentation ou exploitation, même partielle, sans autorisation écrite préalable, est strictement interdite et constitue une contrefaçon sanctionnée par les articles L.335.2 et suivants du Code de la propriété intellectuelle.`,
  },
  {
    title: "13. Droit applicable et litiges",
    content: `Les présentes CGV sont régies par le droit français.

En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGV, les parties s'efforceront en premier lieu de trouver une solution amiable.

Conformément à l'article L.616.1 du Code de la consommation, l'Acheteur peut recourir gratuitement à un médiateur de la consommation dans un délai d'un an à compter de sa réclamation écrite auprès du Vendeur.

À défaut de résolution amiable, les tribunaux compétents du ressort de la Cour d'appel de Paris seront seuls compétents.`,
  },
  {
    title: "14. Contact",
    content: `AETHER Group
66 Avenue des Champs Élysées, 75008 Paris
SIREN : 104 445 424
Email : contact@aether-connect.com
Téléphone : +33 7 87 24 84 02
TVA non applicable, art. 293 B du CGI`,
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
            {" et "}
            <Link to="/legal/remboursement" className="underline hover:no-underline" style={{ color: "#1E4D8C" }}>
              Politique de remboursement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
