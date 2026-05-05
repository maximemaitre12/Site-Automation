import { ArrowLeft, AlertTriangle } from "lucide-react";

interface SepaCheckoutFlowProps {
  planName: string;
  planKey: string;
  price: string;
  onBack: () => void;
  dark?: boolean;
}

export default function SepaCheckoutFlow({ planName, price, onBack, dark = false }: SepaCheckoutFlowProps) {
  const textColor = dark ? "#fff" : "#0F172A";
  const subColor = dark ? "rgba(255,255,255,0.6)" : "#64748B";
  const accentColor = dark ? "#6FE0F5" : "#1A3FB8";
  const warnBg = dark ? "rgba(251,191,36,0.1)" : "rgba(251,191,36,0.08)";
  const warnBorder = dark ? "rgba(251,191,36,0.25)" : "rgba(251,191,36,0.3)";

  return (
    <div className="py-6 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: warnBg }}
      >
        <AlertTriangle className="w-6 h-6" style={{ color: "#F59E0B" }} />
      </div>

      <p className="text-sm font-semibold mb-2" style={{ color: textColor }}>
        Paiement SEPA momentanément indisponible
      </p>
      <p className="text-xs leading-relaxed mb-4 max-w-[260px] mx-auto" style={{ color: subColor }}>
        Le prélèvement SEPA pour l'offre {planName} ({price}€) est en cours de maintenance. Nous travaillons activement pour rétablir ce mode de paiement dans les plus brefs délais.
      </p>

      <div
        className="rounded-lg px-4 py-3 mx-auto max-w-[280px] mb-4"
        style={{ background: warnBg, border: `1px solid ${warnBorder}` }}
      >
        <p className="text-[11px]" style={{ color: subColor }}>
          En attendant, vous pouvez utiliser le paiement par carte bancaire pour finaliser votre commande.
        </p>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-1.5 mx-auto mt-2 text-xs font-medium transition-colors hover:opacity-80"
        style={{ color: accentColor }}
      >
        <ArrowLeft className="w-3 h-3" /> Retour aux options
      </button>
    </div>
  );
}
