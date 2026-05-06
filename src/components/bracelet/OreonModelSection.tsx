import { motion } from "framer-motion";
import {
  Check, Nfc, Calendar, Building2, CreditCard, Plus,
} from "lucide-react";
import IPhoneMockup from "./IPhoneMockup";
import AetherAppHomeScreen from "./AetherAppHomeScreen";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const } }),
};

function GlassCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-3xl ${className}`}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(24px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function OreonModelSection() {
  return (
    <section
      className="relative"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #2550D0 0%, #1A3FB8 40%, #142E8C 100%)",
      }}
    >
      {/* BLOCK 1 — HEADER */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-28 md:pt-32 pb-16 text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
          {/* Eyebrow pill */}
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase mb-6"
            style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.3)", color: "#0EA5E9" }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#0EA5E9" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            THE OREON MODEL
          </span>
        </motion.div>

        <motion.h2
          className="font-heading text-[32px] md:text-[52px] font-semibold text-white leading-tight mb-6"
          style={{ letterSpacing: "-0.02em" }}
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
        >
          The bracelet starts at 3,99 €.<br className="hidden md:block" /> The intelligence is in AETHER.
        </motion.h2>

        <motion.p
          className="text-white/75 mx-auto mb-8 leading-relaxed"
          style={{ fontSize: 18, maxWidth: 720 }}
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
        >
          Our conviction: the object should be simple, durable, and accessible to all.
          The real value is not in the silicone — it is in the platform that transforms
          your biometric signals into intelligent automations. That is why the bracelet
          is sold at an accessible one-time price, while the intelligence remains a subscription.
        </motion.p>

        <div className="w-20 h-px mx-auto" style={{ background: "rgba(14,165,233,0.4)" }} />
      </div>

      {/* BLOCK 2 — TWO COLUMNS WITH IPHONE */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pb-24">
        <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-0">
          {/* LEFT — THE OBJECT */}
          <motion.div
            className="flex-1 lg:max-w-[380px]"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <GlassCard className="p-8 md:p-10 h-full flex flex-col">
                <Nfc style={{ width: 32, height: 32, color: "#0EA5E9" }} />
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mt-4 mb-1" style={{ color: "#0EA5E9" }}>THE OBJECT</p>
                <h3 className="text-white font-semibold text-2xl mb-6">Oreon Bracelet</h3>

                {/* Bracelet silhouette placeholder */}
                <div className="flex items-center justify-center py-6">
                  <div
                    className="rounded-full"
                    style={{
                      width: 160, height: 160,
                      border: "12px solid rgba(14,165,233,0.15)",
                      boxShadow: "0 0 40px rgba(14,165,233,0.1), inset 0 0 30px rgba(14,165,233,0.05)",
                    }}
                  />
                </div>

                <div className="mb-1">
                  <p className="text-white font-bold mb-1" style={{ fontSize: 56 }}>From 3,99 €</p>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: "#0EA5E9" }}>ONE-TIME PAYMENT</p>
                  <p className="italic mt-1" style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>Pre-order 3,99 € · Express delivery 4,99 €</p>
                </div>

                <p className="text-white/80 mt-4 mb-3 leading-relaxed" style={{ fontSize: 14 }}>
                  A minimalist design. An encrypted NFC chip. No active electronics, no battery,
                  no planned obsolescence. The bracelet is your identity key — nothing more, nothing less.
                </p>

                <p className="text-white/50 mb-6" style={{ fontSize: 12 }}>
                  Requires an active AETHER subscription to unlock all features.
                </p>

                <div className="space-y-2.5 mt-auto">
                  {["Waterproof, indestructible", "No battery, no charging", "Lifetime warranty"].map((t) => (
                    <div key={t} className="flex items-center gap-2.5">
                      <Check style={{ width: 16, height: 16, color: "#0EA5E9" }} />
                      <span className="text-white/90" style={{ fontSize: 14 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>

          {/* CENTER CONNECTOR */}
          <div className="hidden lg:flex flex-col items-center justify-center w-16 relative">
            <div className="flex-1 w-px" style={{ background: "repeating-linear-gradient(180deg, rgba(14,165,233,0.3) 0, rgba(14,165,233,0.3) 6px, transparent 6px, transparent 12px)" }} />
            <motion.div
              className="absolute rounded-full flex items-center justify-center"
              style={{ width: 32, height: 32, background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.4)", top: "50%" }}
              animate={{ boxShadow: ["0 0 8px rgba(14,165,233,0.2)", "0 0 20px rgba(14,165,233,0.5)", "0 0 8px rgba(14,165,233,0.2)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Plus style={{ width: 14, height: 14, color: "#0EA5E9" }} />
            </motion.div>
            {/* Traveling dot */}
            <motion.div
              className="absolute rounded-full"
              style={{ width: 6, height: 6, background: "#0EA5E9", left: "50%", marginLeft: -3 }}
              animate={{ top: ["10%", "90%"] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            />
            <p className="absolute text-white/50 italic whitespace-nowrap" style={{ fontSize: 11, bottom: "42%", transform: "rotate(-90deg)" }}>+ requires</p>
          </div>

          {/* Mobile connector */}
          <div className="flex lg:hidden items-center justify-center py-2">
            <div className="h-px flex-1" style={{ background: "repeating-linear-gradient(90deg, rgba(14,165,233,0.3) 0, rgba(14,165,233,0.3) 6px, transparent 6px, transparent 12px)" }} />
            <div className="mx-3 flex items-center justify-center rounded-full" style={{ width: 28, height: 28, background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.4)" }}>
              <Plus style={{ width: 12, height: 12, color: "#0EA5E9" }} />
            </div>
            <div className="h-px flex-1" style={{ background: "repeating-linear-gradient(90deg, rgba(14,165,233,0.3) 0, rgba(14,165,233,0.3) 6px, transparent 6px, transparent 12px)" }} />
          </div>

          {/* RIGHT — THE INTELLIGENCE */}
          <motion.div
            className="flex-1"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
          >
            <GlassCard
              className="p-8 md:p-10 h-full"
              style={{
                border: "1.5px solid rgba(14,165,233,0.3)",
                boxShadow: "0 0 60px rgba(14,165,233,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: "#0EA5E9" }}>THE INTELLIGENCE</p>
                  <h3 className="text-white font-semibold text-2xl mt-1">AETHER Platform</h3>
                </div>
                <span
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-semibold tracking-wider uppercase"
                  style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.25)", color: "#0EA5E9" }}
                >
                  <Calendar style={{ width: 10, height: 10 }} />
                  AVAILABLE JUNE 1ST, 2026
                </span>
              </div>

              {/* iPhone */}
              <div className="flex justify-center py-6">
                <div className="w-[240px] md:w-[280px] lg:w-[300px]">
                  <IPhoneMockup scale={0.85} className="mx-auto">
                    <AetherAppHomeScreen />
                  </IPhoneMockup>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 mb-3">
                <span className="text-white font-bold" style={{ fontSize: 48 }}>25€</span>
                <span className="text-white/70 ml-1" style={{ fontSize: 20 }}>/month</span>
              </div>
              <p style={{ fontSize: 14, color: "#0EA5E9" }}>No commitment · First month free</p>

              <p className="text-white/80 mt-4 mb-5 leading-relaxed" style={{ fontSize: 14 }}>
                The AI agent that transforms your biometric data into concrete actions.
                Proactive coach, unlimited automations, flow marketplace,
                smart-home integrations, lifetime updates.
              </p>

              <div className="space-y-2.5">
                {[
                  "AETHER Coach — conversational AI agent",
                  "Unlimited automations (Aether Flows)",
                  "Marketplace + Spotify, HomeKit, Calendar integrations...",
                  "EU hosted · end-to-end encryption",
                  "Lifetime updates · priority support",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 flex-shrink-0" style={{ width: 16, height: 16, color: "#0EA5E9" }} />
                    <span className="text-white/90" style={{ fontSize: 14 }}>{t}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>


    </section>
  );
}
