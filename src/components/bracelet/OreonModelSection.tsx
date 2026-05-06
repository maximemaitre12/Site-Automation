import { motion } from "framer-motion";
import {
  Check, Nfc, Calendar, Plus, Watch, Sparkles,
} from "lucide-react";
import IPhoneMockup from "./IPhoneMockup";
import AetherAppHomeScreen from "./AetherAppHomeScreen";
import oreonBraceletDark from "@/assets/oreon-bracelet-dark.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

function GlassCard({
  children, className = "", style = {},
}: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
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

/* ── Day-in-AETHER moments ── */
const moments = [
  { time: "7:15", label: "Morning", desc: "High HRV detected. AETHER activates your sunrise routine — lights warm, coffee starts, focus playlist begins." },
  { time: "12:30", label: "Midday", desc: "Stress spike identified. AETHER pauses notifications, dims screens and suggests a 4-7-8 breathing exercise." },
  { time: "18:45", label: "Evening", desc: "Energy dipping. AETHER triggers your wind-down flow — smart lights shift, calendar locks, recovery music plays." },
  { time: "22:00", label: "Night", desc: "Sleep readiness confirmed. AETHER silences your home, sets temperature to 18.5°C and starts your sleep story." },
];

export default function OreonModelSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #2550D0 0%, #1A3FB8 40%, #142E8C 100%)",
      }}
    >
      {/* Ambient particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 2 + Math.random() * 2,
            height: 2 + Math.random() * 2,
            background: "white",
            opacity: 0.12 + Math.random() * 0.08,
            left: `${5 + Math.random() * 90}%`,
            bottom: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, -70 - Math.random() * 60], opacity: [0.15, 0] }}
          transition={{ duration: 7 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 6, ease: "linear" }}
        />
      ))}

      {/* ═══════ BLOCK 1 — HEADER ═══════ */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-28 md:pt-32 pb-16 text-center relative z-10">
        {/* Launch date badge — FIRST element */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
          className="mb-5"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold tracking-[0.16em] uppercase"
            style={{ color: "#0EA5E9" }}
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Calendar style={{ width: 13, height: 13 }} />
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#0EA5E9" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            COMING JUNE 1ST, 2026
          </motion.span>
        </motion.div>

        {/* Eyebrow pill */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.5}>
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
          your biometric signals into intelligent automations.
        </motion.p>

        <div className="w-20 h-px mx-auto" style={{ background: "rgba(14,165,233,0.4)" }} />
      </div>

      {/* ═══════ BLOCK 2 — TWO COLUMNS WITH IPHONE ═══════ */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pb-24 relative z-10">
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
                  Intelligence activates when paired with an AETHER subscription.
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
              className="p-8 md:p-10 h-full relative"
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
                  JUNE 1ST, 2026
                </span>
              </div>

              {/* iPhone */}
              <div className="flex justify-center py-6 relative">
                <div className="w-[240px] md:w-[280px] lg:w-[300px]">
                  <IPhoneMockup scale={0.85} className="mx-auto">
                    <AetherAppHomeScreen />
                  </IPhoneMockup>
                </div>
              </div>

              {/* Preview label on iPhone */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#0EA5E9" }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-white/75 text-[11px] uppercase tracking-[0.16em] font-medium">
                  PREVIEW — Live from June 1st, 2026
                </span>
              </div>

              {/* Price */}
              <div className="mt-2 mb-3">
                <span className="text-white font-bold" style={{ fontSize: 48 }}>25€</span>
                <span className="text-white/70 ml-1" style={{ fontSize: 20 }}>/month</span>
              </div>
              <p style={{ fontSize: 14, color: "#0EA5E9" }}>No commitment · First month included</p>

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

      {/* ═══════ BLOCK 3 — "A DAY IN AETHER" ═══════ */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pb-20 relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-px mx-auto mb-6" style={{ background: "rgba(14,165,233,0.4)" }} />
          <motion.p
            className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: "#0EA5E9" }}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
          >
            A DAY IN AETHER
          </motion.p>

          {/* Future-tense narrative line (Message 1 reinforcement) */}
          <motion.p
            className="italic mb-8"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 16,
              color: "rgba(255,255,255,0.7)",
            }}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.5}
          >
            This is what one tap on your wrist will trigger — once AETHER opens on June 1st.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {moments.map((m, i) => (
            <motion.div
              key={m.time}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1}
            >
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
              >
                <GlassCard className="p-5 h-full transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white font-bold" style={{ fontSize: 20 }}>{m.time}</span>
                    <span className="text-[9px] font-semibold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.25)", color: "#0EA5E9" }}>
                      {m.label}
                    </span>
                  </div>
                  <p className="text-white/78 leading-relaxed" style={{ fontSize: 13, lineHeight: 1.55 }}>{m.desc}</p>
                </GlassCard>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══════ BLOCK 4 — "WITHOUT AETHER" BANNER ═══════ */}
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 pb-20 relative z-10">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
        >
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1.5px solid rgba(14,165,233,0.35)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 0 60px rgba(14,165,233,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(14,165,233,0.06) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />

            <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-10 relative z-10">
              {/* Left — bracelet illustration */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <motion.div
                  className="relative"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(14,165,233,0.05)",
                      "0 0 40px rgba(14,165,233,0.15)",
                      "0 0 20px rgba(14,165,233,0.05)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ borderRadius: "50%" }}
                >
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: 120, height: 120,
                      border: "8px solid rgba(14,165,233,0.12)",
                      background: "rgba(14,165,233,0.03)",
                    }}
                  >
                    <Watch style={{ width: 36, height: 36, color: "rgba(14,165,233,0.35)" }} />
                  </div>
                  {/* Dormant indicator — dim dotted circle */}
                  <div
                    className="absolute inset-[-12px] rounded-full"
                    style={{
                      border: "2px dashed rgba(14,165,233,0.15)",
                    }}
                  />
                </motion.div>
              </div>

              {/* Right — text content */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "#0EA5E9" }}>
                  WITHOUT AETHER
                </p>
                <h3 className="text-white font-semibold mb-3" style={{ fontSize: 24 }}>
                  A beautiful object. Quietly waiting.
                </h3>
                <p className="text-white/78 leading-relaxed mb-4" style={{ fontSize: 15, lineHeight: 1.55 }}>
                  Without an active AETHER subscription, your Oreon bracelet remains exactly what it is physically — a durable, waterproof, lifetime-warranted piece of design. But it cannot trigger, learn or automate anything. The intelligence lives in AETHER. The bracelet is the key — AETHER is what unlocks every door behind it.
                </p>
                <p
                  className="italic"
                  style={{
                    fontFamily: "'EB Garamond', Georgia, serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  That is why we will invite you, by email, to activate AETHER on June 1st 2026. You remain entirely free to accept or decline.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══════ BLOCK 5 — TRUST STRIP / LAUNCH REMINDER FOOTER ═══════ */}
      <div className="max-w-[800px] mx-auto px-6 lg:px-12 pb-28 md:pb-32 relative z-10 text-center">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
        >
          {/* Pulsing launch badge */}
          <motion.span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-bold tracking-[0.14em] uppercase mb-6"
            style={{
              background: "#0EA5E9",
              color: "#0A1C3A",
              boxShadow: "0 0 20px rgba(14,165,233,0.3)",
            }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(14,165,233,0.3)",
                "0 0 40px rgba(14,165,233,0.5)",
                "0 0 20px rgba(14,165,233,0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Calendar style={{ width: 13, height: 13 }} />
            AVAILABLE JUNE 1ST, 2026
          </motion.span>

          <h3 className="text-white font-semibold mb-4" style={{ fontSize: 22 }}>
            Your bracelet ships before. AETHER opens after.
          </h3>

          <p
            className="italic mx-auto"
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 15,
              color: "rgba(255,255,255,0.75)",
              maxWidth: 600,
              lineHeight: 1.55,
            }}
          >
            On June 1st, every bracelet owner receives a personal email invitation to subscribe to AETHER — at the early-bird price for the first 1,000, at the standard price for everyone else. Accept, decline, or take your time. Your bracelet is yours either way.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
