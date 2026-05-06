import { useState } from "react";
import { Check, CreditCard, Calendar, Brain, Fingerprint, ChevronDown, Rocket, ArrowRight, Lock, Shield, ShoppingCart, Package, Zap } from "lucide-react";

const faqItems = [
  {
    q: "Why a subscription instead of a one-time purchase?",
    a: "Because artificial intelligence evolves constantly. Every month, we deploy new algorithms, new integrations and new automations. A one-time purchase freezes the product in time. The subscription ensures your platform stays cutting-edge, indefinitely."
  },
  {
    q: "What happens if I cancel my subscription? Does the bracelet still work?",
    a: "The bracelet remains yours and continues to work as an NFC identifier. However, access to the AETHER platform (AI coach, automations, analytics) will be suspended until you reactivate your subscription."
  },
  {
    q: "Why is SEPA 15% cheaper?",
    a: "SEPA direct debit processing fees are about 5 times lower than credit card transaction fees. Rather than keeping this margin, we decided to pass the savings entirely to our users as a discount."
  },
  {
    q: "Can I switch from SEPA to card (or vice versa)?",
    a: "Yes, at any time from your personal space in the app. The change takes effect at the next billing cycle."
  },
  {
    q: "How do I cancel my subscription?",
    a: "In two clicks from your app, no justification needed, no phone call, no email. The cancellation is immediate and you keep access until the end of your current period."
  },
  {
    q: "Is my biometric data truly private?",
    a: "Absolutely. End-to-end AES-256 encryption, hosted exclusively in France (SecNumCloud certified datacenter), full GDPR compliance. Your data is never sold, never shared, never used for advertising. You can request permanent deletion at any time."
  },
];

export default function BusinessModelSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #1e45c8 0%, #1A3FB8 35%, #0F1F4F 100%)",
      }}
    >
      {/* Ambient aurora */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, #22d3ee, transparent 70%)",
            top: "10%", left: "60%",
            animation: "aurora-drift 20s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #22d3ee, transparent 70%)",
            top: "60%", left: "20%",
            animation: "aurora-drift 25s ease-in-out infinite alternate-reverse",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 py-24 md:py-32">

        {/* BEAT 1 — PHILOSOPHY */}
        <div className="text-center mb-20 md:mb-28">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-400/30 mb-8" style={{ background: "rgba(34,211,238,0.08)" }}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-[11px] font-semibold tracking-[0.2em] uppercase">The Oreon model</span>
          </div>

          <h2 className="text-white font-semibold text-[32px] md:text-[52px] leading-[1.1] tracking-[-0.02em] mb-6 max-w-[800px] mx-auto">
            The bracelet is the key.{" "}
            <span className="text-cyan-400">The intelligence is in AETHER.</span>
          </h2>

          <p className="text-white/75 text-base md:text-lg leading-[1.55] max-w-[720px] mx-auto mb-8">
            Our conviction: the object should be simple, durable, and accessible to all. The real value is not in the silicone — it is in the platform that transforms your biometric signals into intelligent automations. That is why the bracelet is offered at an accessible price, while the intelligence remains a monthly subscription.
          </p>

          <div className="w-20 h-[1px] bg-cyan-400/40 mx-auto" />
        </div>

        {/* BEAT 2 — TWO COMPONENTS */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-0 items-stretch mb-20 md:mb-28">
          {/* LEFT — THE OBJECT */}
          <div
            className="rounded-3xl p-8 md:p-10 flex flex-col"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(20px)",
              animation: "card-float 6s ease-in-out infinite",
            }}
          >
            <Fingerprint className="w-8 h-8 text-cyan-400 mb-4" />
            <span className="text-cyan-400 text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">The object</span>
            <h3 className="text-white font-semibold text-[28px] mb-1">Oreon Bracelet</h3>
            <div className="mb-4">
              <span className="text-white font-bold text-[56px] leading-none tracking-[-0.04em]">From 3,99 €</span>
              <span className="block text-cyan-400 text-[13px] font-semibold tracking-[0.14em] uppercase mt-1">One-time payment</span>
              <span className="block text-white/65 text-[13px] italic mt-1" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
                Pre-order 3,99 €  ·  Express delivery 4,99 €
              </span>
            </div>
            <p className="text-white/80 text-[15px] leading-relaxed mb-6">
              A minimalist design. An encrypted NFC chip. No active electronics, no battery, no planned obsolescence. The bracelet is your identity key — but its intelligence lives in AETHER.
            </p>
            <ul className="space-y-3">
              {["Oreon physical bracelet", "Shipping included", "Lifetime warranty"].map(t => (
                <li key={t} className="flex items-center gap-3 text-white/90 text-sm">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" /> {t}
                </li>
              ))}
            </ul>
            <p className="text-cyan-400/70 text-xs italic mt-4">
              Requires an active AETHER subscription to unlock all features.
            </p>
          </div>

          {/* CENTER CONNECTOR */}
          <div className="hidden md:flex flex-col items-center justify-center px-6 relative" style={{ minWidth: 80 }}>
            <span className="text-cyan-400/70 text-xs mb-3" style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: "italic" }}>unlocks</span>
            <div className="relative w-full h-[2px]">
              <div className="absolute inset-0 border-t-2 border-dashed border-cyan-400/30" />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400/60"
                style={{ animation: "dot-travel 4s ease-in-out infinite" }}
              />
            </div>
            <div
              className="w-8 h-8 rounded-full border-2 border-cyan-400/40 flex items-center justify-center mt-3"
              style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
            >
              <span className="text-cyan-400 text-sm font-bold">+</span>
            </div>
          </div>

          {/* Mobile connector */}
          <div className="flex md:hidden items-center justify-center py-2">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400/40 flex items-center justify-center animate-pulse">
              <span className="text-cyan-400 text-sm font-bold">+</span>
            </div>
          </div>

          {/* RIGHT — THE INTELLIGENCE */}
          <div
            className="rounded-3xl p-8 md:p-10 flex flex-col relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1.5px solid rgba(34,211,238,0.3)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(34,211,238,0.08)",
              animation: "card-float 6s ease-in-out infinite 1s",
            }}
          >
            {/* Aurora inside */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <div
                className="absolute w-[300px] h-[300px] rounded-full opacity-[0.06]"
                style={{
                  background: "radial-gradient(circle, #22d3ee, transparent 70%)",
                  top: "-20%", right: "-10%",
                  animation: "aurora-drift 15s ease-in-out infinite alternate",
                }}
              />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Brain className="w-8 h-8 text-cyan-400" />
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-cyan-400 text-[10px] font-semibold tracking-[0.15em] uppercase border border-cyan-400/30" style={{ background: "rgba(34,211,238,0.08)", animation: "badge-shimmer 8s ease-in-out infinite" }}>
                  <Calendar className="w-3 h-3" /> Available June 1st, 2026
                </span>
              </div>

              <span className="text-cyan-400 text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">The intelligence</span>
              <h3 className="text-white font-semibold text-[28px] mb-1">AETHER Platform</h3>
              <div className="mb-1">
                <span className="text-white font-bold text-[56px] leading-none">25€</span>
                <span className="text-white/70 text-2xl ml-1">/month</span>
              </div>
              <p className="text-cyan-400 text-sm mb-4">No commitment · First month free</p>

              <p className="text-white/80 text-[15px] leading-relaxed mb-6">
                The AI agent that activates your Oreon bracelet and transforms your biometric data into concrete actions. Proactive coach, unlimited automations, flow marketplace, smart-home integrations, lifetime updates.
              </p>

              <ul className="space-y-3 mt-auto">
                {[
                  "AETHER Coach — conversational AI agent",
                  "Unlimited automations (Aether Flows)",
                  "Marketplace + Spotify, HomeKit, Calendar integrations...",
                  "EU hosted · end-to-end encryption",
                  "Lifetime updates · priority support",
                ].map(t => (
                  <li key={t} className="flex items-start gap-3 text-white/90 text-sm">
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* BEAT 3 — PAYMENT METHODS */}
        <div className="mb-20 md:mb-28">
          <div className="text-center mb-12">
            <div className="w-16 h-[1px] bg-cyan-400/40 mx-auto mb-6" />
            <span className="text-cyan-400 text-[11px] font-semibold tracking-[0.2em] uppercase">How you pay</span>
            <h3 className="text-white font-semibold text-[28px] md:text-[38px] leading-tight tracking-[-0.01em] mt-4 mb-4">
              Two ways to pay. One philosophy: transparency.
            </h3>
            <p className="text-white/75 text-[15px] md:text-[17px] max-w-[640px] mx-auto">
              No hidden costs, no pricing traps, no commitment. Choose the payment method that suits you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* SEPA */}
            <div
              className="rounded-3xl p-8 md:p-10 relative"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1.5px solid rgba(34,211,238,0.25)",
                backdropFilter: "blur(20px)",
                animation: "card-float 6s ease-in-out infinite 0.5s",
              }}
            >
              <div className="absolute -top-3 left-8 px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase bg-cyan-400 text-[#0F1F4F]">
                Recommended · -15%
              </div>
              <Shield className="w-7 h-7 text-cyan-400 mb-4 mt-2" />
              <h4 className="text-white font-semibold text-[22px] mb-1">SEPA Direct Debit</h4>
              <p className="text-cyan-400 text-sm font-medium mb-4">21.25€/month — save 3.75€/month</p>
              <p className="text-white/80 text-[15px] leading-relaxed mb-6">
                The European subscription standard. You authorize an automatic monthly debit from your bank account, just like Netflix or Spotify with your IBAN. More cost-effective for us, so 15% cheaper for you.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Permanent 15% discount",
                  "No card to update on expiration",
                  "Mandate revocable at any time from your app",
                  "SEPA guarantee: full refund within 8 weeks in case of dispute",
                ].map(t => (
                  <li key={t} className="flex items-start gap-3 text-white/90 text-sm">
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
              <p className="text-white/60 text-xs">Compliant with SEPA Direct Debit regulation · European IBAN required</p>
            </div>

            {/* CARD */}
            <div
              className="rounded-3xl p-8 md:p-10"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(20px)",
                animation: "card-float 6s ease-in-out infinite 1.5s",
              }}
            >
              <CreditCard className="w-7 h-7 text-cyan-400 mb-4" />
              <h4 className="text-white font-semibold text-[22px] mb-1">Credit card</h4>
              <p className="text-white/70 text-sm font-medium mb-4">25€/month — Visa, Mastercard, Amex</p>
              <p className="text-white/80 text-[15px] leading-relaxed mb-6">
                The classic, instant payment method, accepted everywhere. Your details are encrypted and tokenized via Stripe. No card is stored on our end.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Instant activation upon registration",
                  "Compatible with all cards (Visa, Mastercard, Amex)",
                  "Secured by 3D Secure 2 (strong authentication)",
                  "Free cancellation from your app",
                ].map(t => (
                  <li key={t} className="flex items-start gap-3 text-white/90 text-sm">
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
              <p className="text-white/60 text-xs">Payment processed by Stripe · PCI-DSS Level 1 compliant</p>
            </div>
          </div>

          <p className="text-center text-white/70 text-sm italic mt-8 max-w-[700px] mx-auto">
            Why is SEPA cheaper? Because direct debit bank fees are 5x lower than card transaction fees. We pass this saving directly to you.
          </p>
        </div>

        {/* BEAT 4 — PRICE ANCHORING */}
        <div className="mb-20 md:mb-28">
          <div className="text-center mb-10">
            <span className="text-cyan-400 text-[11px] font-semibold tracking-[0.2em] uppercase">The price of biometric intelligence</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Whoop */}
            <div className="rounded-3xl p-8 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
              <p className="text-white/50 text-xs font-semibold tracking-[0.15em] uppercase mb-4">Whoop 4.0</p>
              <p className="text-white/70 font-bold text-3xl mb-2">30€<span className="text-lg font-normal">/month</span></p>
              <p className="text-white/50 text-sm">+ no hardware included</p>
            </div>

            {/* Oura */}
            <div className="rounded-3xl p-8 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
              <p className="text-white/50 text-xs font-semibold tracking-[0.15em] uppercase mb-4">Oura Ring</p>
              <p className="text-white/70 font-bold text-3xl mb-2">5.99€<span className="text-lg font-normal">/month</span></p>
              <p className="text-white/50 text-sm">+ 349€ for the ring</p>
              <p className="text-white/40 text-xs mt-2">= ~25€/month over 2 years</p>
            </div>

            {/* OREON */}
            <div
              className="rounded-3xl p-8 text-center relative"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1.5px solid rgba(34,211,238,0.35)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 30px rgba(34,211,238,0.1)",
                transform: "translateY(-4px)",
              }}
            >
              <p className="text-cyan-400 text-xs font-semibold tracking-[0.15em] uppercase mb-4">Oreon</p>
              <p className="text-white font-bold text-3xl mb-1">21.25€<span className="text-lg font-normal text-white/70">/month via SEPA</span></p>
              <p className="text-white/60 text-sm mb-2">or 25€/month by card</p>
              <p className="text-cyan-400 text-sm font-medium">+ bracelet from 3,99 €</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Check className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-xs">Best intelligence-to-price ratio on the market</span>
              </div>
            </div>
          </div>

          <p className="text-center text-white/70 text-sm mt-8 max-w-[700px] mx-auto">
            More comprehensive than the leaders. Cheaper than direct competitors. And without 300€ hardware to buy upfront.
          </p>

          <p className="text-center text-white/65 text-[18px] italic mt-6" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
            Two purchases. One ecosystem. Built to work together.
          </p>
        </div>

        {/* BEAT 5 — CTA BANNER */}
        <div
          className="rounded-3xl p-8 md:p-10 relative overflow-hidden mb-16 transition-all duration-300 hover:-translate-y-1"
          style={{
            background: "linear-gradient(135deg, #0A1C4A, #1A3FB8)",
            boxShadow: "0 0 40px rgba(34,211,238,0.1), 0 20px 60px rgba(0,0,0,0.3)",
            border: "1px solid rgba(34,211,238,0.2)",
          }}
        >
          {/* Aurora */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div
              className="absolute w-[400px] h-[400px] rounded-full opacity-[0.08]"
              style={{
                background: "radial-gradient(circle, #22d3ee, transparent 70%)",
                top: "-30%", right: "-10%",
                animation: "aurora-drift 18s ease-in-out infinite alternate",
              }}
            />
          </div>

          <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
            {/* Left */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                <Rocket className="w-6 h-6 text-cyan-400" />
                <span className="text-cyan-400 text-[10px] font-semibold tracking-[0.2em] uppercase">Pre-order now</span>
              </div>
              <h4 className="text-white font-semibold text-xl md:text-2xl mb-2">Get your Oreon bracelet from 3,99 €</h4>
              <p className="text-white/80 text-[15px] mb-3">
                One-time payment · Shipping included · Bracelet delivered around June 1st, when the AETHER platform goes live
              </p>
              <p className="text-white/60 text-sm">
                Your delivery address will be requested by email around mid-May
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-cyan-400 font-bold text-[32px]">3,99 €</span>
              <span className="text-white/60 text-xs">or 4,99 € express</span>
            </div>
          </div>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white/60 text-xs mb-16">
          <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Secure payment via Stripe</span>
          <span>·</span>
          <span>🇪🇺 Hosted in France</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><Check className="w-3 h-3" /> GDPR compliant</span>
          <span>·</span>
          <span>↩ Free cancellation</span>
        </div>

        {/* BEAT 6 — FAQ */}
        <div className="max-w-[800px] mx-auto">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl mb-3 overflow-hidden transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-white/90 text-[15px] font-medium pr-4">{item.q}</span>
                <ChevronDown
                  className="w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform duration-300"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: openFaq === i ? 300 : 0,
                  opacity: openFaq === i ? 1 : 0,
                }}
              >
                <p className="px-6 pb-5 text-white/70 text-sm leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section footer */}
        <p className="text-center text-white/65 text-[18px] italic mt-16" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
          Two purchases. One ecosystem. Built to work together.
        </p>
      </div>

      <style>{`
        @keyframes aurora-drift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-40px, 30px) scale(1.1); }
        }
        @keyframes card-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes dot-travel {
          0% { left: 0; }
          100% { left: calc(100% - 12px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes badge-shimmer {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}
