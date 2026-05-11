import { Link } from "react-router-dom";
import { ShieldCheck, Mail, Wallet, Clock, AlertCircle, Heart, Truck } from "lucide-react";

const sections = [
  {
    icon: Heart,
    title: "1. Notre engagement",
    content: `Tant que votre bracelet Oreon n'est pas expédié, vous pouvez en demander le remboursement intégral à tout moment. Sans frais, sans justification, sans question.

C'est notre engagement le plus simple : un précommandeur n'est jamais retenu contre son gré. Le bracelet n'a de valeur que si vous le souhaitez vraiment.`,
  },
  {
    icon: Clock,
    title: "2. Une fenêtre confortable",
    content: `Le bracelet Oreon est vendu en précommande. Entre la signature de votre mandat SEPA et l'expédition effective, plusieurs semaines s'écoulent. Toute cette période vous appartient : vous pouvez annuler votre commande librement.

Concrètement, vous disposez de la totalité du délai de précommande pour changer d'avis. Aucune fenêtre piégeuse, aucun délai caché.`,
  },
  {
    icon: Mail,
    title: "3. Comment annuler et être remboursé",
    content: `Une seule action suffit : envoyez un email à contact@aether-connect.com en précisant votre numéro de commande, présent dans l'email de confirmation.

Notre équipe vous répond sous 24 heures ouvrées avec :
• La confirmation immédiate de l'annulation de votre précommande
• L'arrêt de toute production ou préparation à votre nom
• Le déclenchement du remboursement intégral`,
  },
  {
    icon: Wallet,
    title: "4. Remboursement intégral et automatique",
    content: `Le remboursement porte sur la totalité du montant prélevé, sans aucune retenue, sans frais de dossier, sans pénalité.

Il est effectué automatiquement par virement bancaire sur le compte ayant servi au prélèvement SEPA initial, dans un délai maximum de 14 jours calendaires suivant la confirmation d'annulation. La plupart des remboursements sont émis sous 48 heures ouvrées.

Vous recevez une confirmation par email dès que le virement est émis.`,
  },
  {
    icon: Truck,
    title: "5. Et après l'expédition ?",
    content: `Une fois votre bracelet expédié, votre droit à remboursement reste pleinement protégé par la loi : vous bénéficiez du droit légal de rétractation de 14 jours calendaires à compter de la réception, conformément aux articles L.221.18 et suivants du Code de la consommation.

La procédure reste tout aussi simple : un email à contact@aether-connect.com, une étiquette de retour prépayée fournie par AETHER Group, et un remboursement intégral sous 14 jours après réception du retour.`,
  },
  {
    icon: AlertCircle,
    title: "6. Cas particuliers",
    content: `Bracelet personnalisé : si vous avez choisi une gravure ou une personnalisation sur mesure, l'annulation reste totalement gratuite tant que la production n'est pas physiquement lancée. Une fois la fabrication démarrée, le bracelet personnalisé ne peut plus faire l'objet d'un remboursement, mais nous vous prévenons toujours par email avant tout lancement, ce qui vous laisse une dernière fenêtre pour annuler sereinement.

Mauvaise utilisation après réception : les dommages résultant d'un usage manifestement non conforme (perforation volontaire, exposition à des produits chimiques agressifs, démontage de la puce NFC) ne sont pas couverts. La garantie commerciale à vie reste en revanche pleinement applicable pour tout défaut de fabrication.`,
  },
  {
    icon: ShieldCheck,
    title: "7. Garantie commerciale à vie",
    content: `Indépendamment de la présente politique de remboursement, le bracelet Oreon bénéficie d'une garantie commerciale à vie contre tout défaut de fabrication. En cas de défaut, le bracelet est remplacé gratuitement, sans condition de durée, dans le cadre d'une utilisation normale.`,
  },
];

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-[800px] mx-auto px-6">
        <Link to="/bracelet" className="text-sm font-medium mb-8 inline-block hover:underline" style={{ color: "#1E4D8C" }}>
          ← Retour au bracelet Oreon
        </Link>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#0F172A" }}>
          Politique de remboursement
        </h1>
        <p className="text-sm mb-2" style={{ color: "#64748B" }}>Bracelet connecté Oreon</p>
        <p className="text-xs mb-10" style={{ color: "#94A3B8" }}>Dernière mise à jour : Mai 2026</p>

        <div className="p-6 rounded-2xl mb-12" style={{ background: "#F1F5FB", border: "1px solid #DBE6F2" }}>
          <p className="font-heading text-lg font-semibold mb-2" style={{ color: "#1E4D8C" }}>
            Remboursement intégral et gratuit avant la livraison.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
            Tant que votre bracelet n'est pas expédié, vous pouvez annuler à tout moment. Un email suffit. Aucun frais, aucune justification, remboursement complet sous 14 jours, généralement en 48 heures.
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#F1F5FB" }}>
                  <section.icon className="w-5 h-5" style={{ color: "#1E4D8C" }} />
                </div>
                <h2 className="font-heading text-xl font-semibold" style={{ color: "#0F172A" }}>
                  {section.title}
                </h2>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line pl-[52px]" style={{ color: "#475569" }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm mb-2" style={{ color: "#64748B" }}>
            Une question avant de précommander ou pour annuler une commande en cours ?
          </p>
          <p className="text-sm" style={{ color: "#475569" }}>
            <a href="mailto:contact@aether-connect.com" className="underline hover:no-underline" style={{ color: "#1E4D8C" }}>
              contact@aether-connect.com
            </a>
            {" · "}
            <a href="tel:+33787248402" className="underline hover:no-underline" style={{ color: "#1E4D8C" }}>
              +33 7 87 24 84 02
            </a>
          </p>
          <p className="text-sm mt-6" style={{ color: "#64748B" }}>
            Voir également :{" "}
            <Link to="/legal/bracelet-cgv" className="underline hover:no-underline" style={{ color: "#1E4D8C" }}>
              Conditions générales de vente
            </Link>
            {" et "}
            <Link to="/legal/bracelet-cgu" className="underline hover:no-underline" style={{ color: "#1E4D8C" }}>
              Conditions générales d'utilisation
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
