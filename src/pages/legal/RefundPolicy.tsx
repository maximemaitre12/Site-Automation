import { Link } from "react-router-dom";
import { ShieldCheck, Mail, PackageCheck, Wallet, Clock, AlertCircle, Heart } from "lucide-react";

const sections = [
  {
    icon: Heart,
    title: "1. Notre engagement",
    content: `Si le bracelet ne vous convient pas, nous vous remboursons. Sans discussion, sans justification, sans frais cachés.

Cet engagement est la traduction concrète de notre conviction : un produit n'a de valeur que si vous en êtes pleinement satisfait. Nous préférons un client serein qu'un client retenu.`,
  },
  {
    icon: Clock,
    title: "2. Délai pour demander un remboursement",
    content: `Vous disposez de 30 jours calendaires à compter de la réception du bracelet pour en demander le remboursement intégral. Ce délai est volontairement plus long que le minimum légal de 14 jours prévu par le Code de la consommation, afin de vous laisser le temps de l'essayer en conditions réelles.

Aucune justification n'est requise. Aucune question ne vous sera posée.`,
  },
  {
    icon: Mail,
    title: "3. Comment nous le demander",
    content: `Une seule étape suffit : envoyez un email à contact@aether-connect.com en précisant votre numéro de commande (présent dans l'email de confirmation).

Notre équipe vous répond sous 24 heures ouvrées avec :
• La confirmation de la prise en compte de votre demande
• Une étiquette de retour prépayée à imprimer
• Les instructions de retour, simples et claires`,
  },
  {
    icon: PackageCheck,
    title: "4. Retour du bracelet",
    content: `Glissez le bracelet dans son emballage d'origine, collez l'étiquette prépayée fournie, déposez le colis dans le point relais ou la boîte aux lettres indiqués. Aucun frais n'est à votre charge.

Le bracelet doit être retourné dans un état général satisfaisant. L'usure d'essai est tolérée et n'affecte pas votre droit au remboursement.`,
  },
  {
    icon: Wallet,
    title: "5. Délai et modalités de remboursement",
    content: `Dès réception et vérification du retour, nous procédons au remboursement intégral du montant payé, frais de port inclus, dans un délai maximum de 14 jours calendaires.

Le remboursement est effectué automatiquement par virement bancaire sur le compte ayant servi au prélèvement SEPA initial. Aucune action de votre part n'est nécessaire à cette étape.

Vous recevrez une confirmation par email dès que le virement est émis.`,
  },
  {
    icon: AlertCircle,
    title: "6. Cas particuliers",
    content: `Bracelet personnalisé : un bracelet ayant fait l'objet d'une personnalisation gravée ou colorée sur mesure ne peut être remboursé une fois la production lancée. L'annulation reste possible sans frais avant le démarrage effectif de la fabrication.

Bracelet endommagé par mauvaise utilisation : les dommages résultant d'une utilisation manifestement non conforme (perforation volontaire, exposition à des produits chimiques agressifs, démontage de la puce NFC) ne sont pas couverts par la politique de remboursement. La garantie commerciale à vie reste en revanche applicable pour tout défaut de fabrication.

Au‑delà de 30 jours : votre droit légal de garantie de conformité (2 ans) et la garantie commerciale à vie restent intégralement applicables. Contactez notre service client pour toute prise en charge.`,
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
            Remboursement simple, rapide, sans condition.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
            Vous avez 30 jours pour changer d'avis. Un email suffit. Étiquette de retour offerte. Remboursement intégral sous 14 jours.
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
            Une question avant de commander ou pour un retour en cours ?
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
