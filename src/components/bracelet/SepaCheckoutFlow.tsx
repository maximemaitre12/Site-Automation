import { useState } from "react";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import sepaQrCode from "@/assets/sepa-qrcode.jpg";

interface SepaCheckoutFlowProps {
  planName: string;
  planKey: string;
  price: string;
  onBack: () => void;
  dark?: boolean;
}

export default function SepaCheckoutFlow({ planName, planKey, price, onBack, dark = false }: SepaCheckoutFlowProps) {
  const [step, setStep] = useState<"form" | "qr">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const textColor = dark ? "#fff" : "#0F172A";
  const subColor = dark ? "rgba(255,255,255,0.6)" : "#64748B";
  const inputBg = dark ? "rgba(255,255,255,0.08)" : "#F8FAFC";
  const inputBorder = dark ? "rgba(255,255,255,0.15)" : "#E2E8F0";
  const inputText = dark ? "#fff" : "#0F172A";
  const accentColor = dark ? "#6FE0F5" : "#1A3FB8";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your full name");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const { error: insertError } = await supabase.from("bracelet_orders").insert({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        plan: planKey,
        amount: parseFloat(price.replace(",", ".")),
        payment_method: "sepa",
        status: "pending",
        metadata: { plan_name: planName },
      });

      if (insertError) throw insertError;
      setStep("qr");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (step === "qr") {
    return (
      <div className="text-center py-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: dark ? "rgba(255,180,50,0.15)" : "rgba(234,179,8,0.1)" }}>
          <span className="text-lg">⚠</span>
        </div>
        <p className="text-sm font-semibold mb-2" style={{ color: textColor }}>
          Temporarily Unavailable
        </p>
        <p className="text-xs leading-relaxed max-w-[260px] mx-auto mb-4" style={{ color: subColor }}>
          Unfortunately, this service is momentarily unavailable. We are actively working to resolve this. Please try again later.
        </p>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 mx-auto mt-2 text-xs font-medium transition-colors hover:opacity-80"
          style={{ color: accentColor }}
        >
          <ArrowLeft className="w-3 h-3" /> Back to options
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="py-4">
      <p className="text-sm font-semibold mb-1 text-center" style={{ color: textColor }}>
        SEPA Direct Debit — {planName}
      </p>
      <p className="text-xs mb-4 text-center" style={{ color: subColor }}>
        Enter your details to confirm your {price}€ order
      </p>

      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all focus:ring-2"
          style={{
            background: inputBg,
            border: `1px solid ${inputBorder}`,
            color: inputText,
          }}
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all focus:ring-2"
          style={{
            background: inputBg,
            border: `1px solid ${inputBorder}`,
            color: inputText,
          }}
          autoComplete="email"
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 text-center mb-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all disabled:opacity-60"
        style={{
          background: dark ? "linear-gradient(135deg, #6FE0F5, #0BA5C7)" : "linear-gradient(135deg, #1A3FB8, #2451D9)",
          color: dark ? "#0A1C4A" : "#fff",
        }}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Confirm and show QR code
      </button>

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 mx-auto mt-4 text-xs font-medium transition-colors hover:opacity-80"
        style={{ color: accentColor }}
      >
        <ArrowLeft className="w-3 h-3" /> Back to options
      </button>
    </form>
  );
}
