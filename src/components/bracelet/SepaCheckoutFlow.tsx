import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { loadStripe, type Stripe as StripeJS } from "@stripe/stripe-js";
import { Elements, IbanElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { supabase } from "@/integrations/supabase/client";

interface SepaCheckoutFlowProps {
  planName: string;
  planKey: string;
  price: string;
  onBack: () => void;
  dark?: boolean;
}

interface IntentData {
  client_secret: string;
  publishable_key: string;
}

export default function SepaCheckoutFlow(props: SepaCheckoutFlowProps) {
  return <SepaForm {...props} />;
}

function SepaForm({ planName, planKey, price, onBack, dark = false }: SepaCheckoutFlowProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("France");
  const [acceptMandate, setAcceptMandate] = useState(false);
  const [error, setError] = useState("");
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [intent, setIntent] = useState<IntentData | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<StripeJS | null> | null>(null);
  const [success, setSuccess] = useState(false);

  const textColor = dark ? "#fff" : "#0F172A";
  const subColor = dark ? "rgba(255,255,255,0.6)" : "#64748B";
  const inputBg = dark ? "rgba(255,255,255,0.08)" : "#F8FAFC";
  const inputBorder = dark ? "rgba(255,255,255,0.15)" : "#E2E8F0";
  const inputText = dark ? "#fff" : "#0F172A";
  const accentColor = dark ? "#6FE0F5" : "#1A3FB8";
  const noticeBg = dark ? "rgba(111,224,245,0.08)" : "rgba(26,63,184,0.06)";
  const noticeBorder = dark ? "rgba(111,224,245,0.25)" : "rgba(26,63,184,0.2)";

  const countryCode = useMemo(() => {
    const c = country.trim().toLowerCase();
    if (["france", "fr"].includes(c)) return "FR";
    if (["belgium", "belgique", "be"].includes(c)) return "BE";
    if (["germany", "deutschland", "allemagne", "de"].includes(c)) return "DE";
    if (["spain", "espagne", "es"].includes(c)) return "ES";
    if (["italy", "italie", "it"].includes(c)) return "IT";
    if (["netherlands", "pays-bas", "nl"].includes(c)) return "NL";
    if (["luxembourg", "lu"].includes(c)) return "LU";
    if (["portugal", "pt"].includes(c)) return "PT";
    return country.trim().slice(0, 2).toUpperCase() || "FR";
  }, [country]);

  const handleCreateIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim() || fullName.trim().length < 2) return setError("Please enter your full name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address");
    if (!address.trim() || address.trim().length < 5) return setError("Please enter your delivery address");
    if (!city.trim()) return setError("Please enter your city");
    if (!postalCode.trim()) return setError("Please enter your postal code");
    if (!acceptMandate) return setError("You must authorize the SEPA direct debit mandate to proceed");

    setCreatingIntent(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("bracelet-sepa-intent", {
        body: {
          plan: planKey,
          email: email.trim().toLowerCase(),
          full_name: fullName.trim(),
          address: address.trim(),
          city: city.trim(),
          postal_code: postalCode.trim(),
          country: countryCode,
        },
      });
      if (fnError) throw fnError;
      if (!data?.client_secret || !data?.publishable_key) throw new Error("Missing Stripe configuration");
      setIntent({ client_secret: data.client_secret, publishable_key: data.publishable_key });
      setStripePromise(loadStripe(data.publishable_key));
    } catch (err: any) {
      setError(err.message || "Could not initialize SEPA mandate");
    } finally {
      setCreatingIntent(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: accentColor + "20" }}>
          <CheckCircle2 className="w-6 h-6" style={{ color: accentColor }} />
        </div>
        <p className="text-sm font-semibold mb-2" style={{ color: textColor }}>Mandate authorized</p>
        <p className="text-xs leading-relaxed max-w-[280px] mx-auto" style={{ color: subColor }}>
          Your SEPA Direct Debit of {price}€ has been registered. Funds will be debited from your account within 24 hours. A confirmation email is on its way.
        </p>
      </div>
    );
  }

  if (intent && stripePromise) {
    return (
      <Elements stripe={stripePromise} options={{ locale: "en" }}>
        <SepaConfirmStep
          clientSecret={intent.client_secret}
          fullName={fullName}
          email={email}
          price={price}
          dark={dark}
          onBack={() => { setIntent(null); setStripePromise(null); }}
          onSuccess={() => setSuccess(true)}
        />
      </Elements>
    );
  }

  return (
    <form onSubmit={handleCreateIntent} className="py-4">
      <p className="text-sm font-semibold mb-1 text-center" style={{ color: textColor }}>SEPA Direct Debit — {planName}</p>
      <p className="text-xs mb-4 text-center" style={{ color: subColor }}>
        Authorize a secure SEPA mandate of {price}€ — funds debited within 24 hours
      </p>

      <div className="space-y-3 mb-4">
        <input type="text" placeholder="Full name (account holder)" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} autoComplete="name" />
        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} autoComplete="email" />
        <input type="text" placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} autoComplete="street-address" />
        <div className="flex gap-3">
          <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="flex-1 px-4 py-3 rounded-lg text-sm outline-none" style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} autoComplete="address-level2" />
          <input type="text" placeholder="Postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-[120px] px-4 py-3 rounded-lg text-sm outline-none" style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} autoComplete="postal-code" />
        </div>
        <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-3 rounded-lg text-sm outline-none" style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: inputText }} autoComplete="country-name" />
      </div>

      <label className="flex items-start gap-2 mb-4 cursor-pointer text-[11px]" style={{ color: subColor }}>
        <input type="checkbox" checked={acceptMandate} onChange={(e) => setAcceptMandate(e.target.checked)} className="mt-[2px] cursor-pointer" />
        <span>I have read and accept the <a href="/legal/bracelet-cgv" target="_blank" rel="noopener" style={{ color: accentColor }} className="underline">Terms of Sale</a>.</span>
      </label>

      {error && <p className="text-xs text-red-400 text-center mb-3">{error}</p>}

      <button type="submit" disabled={creatingIntent} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all disabled:opacity-60" style={{ background: dark ? "linear-gradient(135deg, #6FE0F5, #0BA5C7)" : "linear-gradient(135deg, #1A3FB8, #2451D9)", color: dark ? "#0A1C4A" : "#fff" }}>
        {creatingIntent ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Continue to IBAN
      </button>

      <button type="button" onClick={onBack} className="flex items-center gap-1.5 mx-auto mt-4 text-xs font-medium transition-colors hover:opacity-80" style={{ color: accentColor }}>
        <ArrowLeft className="w-3 h-3" /> Back to options
      </button>
    </form>
  );
}

function SepaConfirmStep({
  clientSecret, fullName, email, price, dark, onBack, onSuccess,
}: { clientSecret: string; fullName: string; email: string; price: string; dark: boolean; onBack: () => void; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const textColor = dark ? "#fff" : "#0F172A";
  const subColor = dark ? "rgba(255,255,255,0.6)" : "#64748B";
  const inputBg = dark ? "rgba(255,255,255,0.08)" : "#F8FAFC";
  const inputBorder = dark ? "rgba(255,255,255,0.15)" : "#E2E8F0";
  const accentColor = dark ? "#6FE0F5" : "#1A3FB8";
  const noticeBg = dark ? "rgba(111,224,245,0.08)" : "rgba(26,63,184,0.06)";
  const noticeBorder = dark ? "rgba(111,224,245,0.25)" : "rgba(26,63,184,0.2)";

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError("");
    setSubmitting(true);
    const iban = elements.getElement(IbanElement);
    if (!iban) { setError("IBAN field not ready"); setSubmitting(false); return; }

    const { error: confirmErr, paymentIntent } = await stripe.confirmSepaDebitPayment(clientSecret, {
      payment_method: {
        sepa_debit: iban,
        billing_details: { name: fullName, email },
      },
    });

    if (confirmErr) {
      setError(confirmErr.message || "Mandate could not be authorized");
      setSubmitting(false);
      return;
    }
    if (paymentIntent && (paymentIntent.status === "processing" || paymentIntent.status === "succeeded")) {
      onSuccess();
    } else {
      setError("Unexpected status: " + (paymentIntent?.status || "unknown"));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleConfirm} className="py-4">
      <p className="text-sm font-semibold mb-1 text-center" style={{ color: textColor }}>Enter your IBAN</p>
      <p className="text-xs mb-4 text-center" style={{ color: subColor }}>
        Securely processed by Stripe — your IBAN never touches our servers
      </p>

      <div className="px-4 py-3 rounded-lg mb-4" style={{ background: inputBg, border: `1px solid ${inputBorder}` }}>
        <IbanElement
          options={{
            supportedCountries: ["SEPA"],
            placeholderCountry: "FR",
            style: {
              base: {
                color: textColor,
                fontSize: "14px",
                fontFamily: "inherit",
                "::placeholder": { color: subColor },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>

      <div className="rounded-lg p-3 mb-4 text-[11px] leading-relaxed" style={{ background: noticeBg, border: `1px solid ${noticeBorder}`, color: subColor }}>
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 mt-[1px] flex-shrink-0" style={{ color: accentColor }} />
          <span style={{ color: textColor }}>
            By providing your IBAN and confirming this payment, you authorize <strong>AETHER</strong> and Stripe, our payment service provider, to send instructions to your bank to debit your account of <strong>{price}€</strong>. The amount will be debited within <strong>24 hours</strong>. You are entitled to a refund from your bank under the terms of your agreement with your bank. A refund must be claimed within 8 weeks starting from the date on which your account was debited.
          </span>
        </div>
      </div>

      {error && <p className="text-xs text-red-400 text-center mb-3">{error}</p>}

      <button type="submit" disabled={!stripe || submitting} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all disabled:opacity-60" style={{ background: dark ? "linear-gradient(135deg, #6FE0F5, #0BA5C7)" : "linear-gradient(135deg, #1A3FB8, #2451D9)", color: dark ? "#0A1C4A" : "#fff" }}>
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {submitting ? "Authorizing mandate…" : `Confirm SEPA mandate — ${price}€`}
      </button>

      <button type="button" onClick={onBack} className="flex items-center gap-1.5 mx-auto mt-4 text-xs font-medium transition-colors hover:opacity-80" style={{ color: accentColor }}>
        <ArrowLeft className="w-3 h-3" /> Edit details
      </button>
    </form>
  );
}
