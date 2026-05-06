import { useState } from "react";
import { Check, CreditCard, Calendar, Brain, Fingerprint, ChevronDown, Rocket, ArrowRight, Lock, Shield, ShoppingCart, Package, Zap } from "lucide-react";
import oreonBraceletImg from "@/assets/oreon-bracelet.png";

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
