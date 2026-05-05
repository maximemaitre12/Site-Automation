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
      {/* ═══ BLOCK 1 — HEADER ═══ */}
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
            LE MODÈLE OREON
          </span>
        </motion.div>

        <motion.h2
          className="font-heading text-[32px] md:text-[52px] font-semibold text-white leading-tight mb-6"
          style={{ letterSpacing: "-0.02em" }}
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
        >
          Le bracelet est libre.<br className="hidden md:block" /> L'intelligence est dans AETHER.
        </motion.h2>

        <motion.p
          className="text-white/75 mx-auto mb-8 leading-relaxed"
          style={{ fontSize: 18, maxWidth: 720 }}
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
        >
          Notre conviction : l'objet doit être simple, durable, et accessible à tous.
          La vraie valeur n'est pas dans le silicone — elle est dans la plateforme qui transforme
          vos signaux biométriques en automatisations intelligentes. C'est pour cela que nous offrons
          le bracelet et que nous facturons l'intelligence.
        </motion.p>

        <div className="w-20 h-px mx-auto" style={{ background: "rgba(14,165,233,0.4)" }} />
      </div>

      {/* ═══ BLOCK 2 — TWO COLUMNS WITH IPHONE ═══ */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pb-24">
        <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-0">
          {/* LEFT — L'OBJET */}
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
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mt-4 mb-1" style={{ color: "#0EA5E9" }}>L'OBJET</p>
                <h3 className="text-white font-semibold text-2xl mb-6">Bracelet Oreon</h3>

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

                <p className="text-white font-bold mb-0.5" style={{ fontSize: 56 }}>OFFERT</p>
                <p style={{ fontSize: 14, color: "#0EA5E9" }}>À l'inscription</p>

                <p className="text-white/80 mt-4 mb-6 leading-relaxed" style={{ fontSize: 14 }}>
                  Un design minimaliste. Une puce NFC chiffrée. Aucune électronique active, aucune batterie,
                  aucune obsolescence. Le bracelet est votre clé d'identité — rien de plus, rien de moins.
                </p>

                <div className="space-y-2.5 mt-auto">
                  {["Étanche, indestructible", "Sans batterie, sans charge", "Garantie à vie"].map((t) => (
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
            <p className="absolute text-white/50 italic whitespace-nowrap" style={{ fontSize: 11, bottom: "42%", transform: "rotate(-90deg)" }}>+ requiert</p>
          </div>

          {/* Mobile connector */}
          <div className="flex lg:hidden items-center justify-center py-2">
            <div className="h-px flex-1" style={{ background: "repeating-linear-gradient(90deg, rgba(14,165,233,0.3) 0, rgba(14,165,233,0.3) 6px, transparent 6px, transparent 12px)" }} />
            <div className="mx-3 flex items-center justify-center rounded-full" style={{ width: 28, height: 28, background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.4)" }}>
              <Plus style={{ width: 12, height: 12, color: "#0EA5E9" }} />
            </div>
            <div className="h-px flex-1" style={{ background: "repeating-linear-gradient(90deg, rgba(14,165,233,0.3) 0, rgba(14,165,233,0.3) 6px, transparent 6px, transparent 12px)" }} />
          </div>

          {/* RIGHT — L'INTELLIGENCE */}
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
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: "#0EA5E9" }}>L'INTELLIGENCE</p>
                  <h3 className="text-white font-semibold text-2xl mt-1">Plateforme AETHER</h3>
                </div>
                <span
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-semibold tracking-wider uppercase"
                  style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.25)", color: "#0EA5E9" }}
                >
                  <Calendar style={{ width: 10, height: 10 }} />
                  DISPONIBLE LE 1ER JUIN 2026
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
                <span className="text-white/70 ml-1" style={{ fontSize: 20 }}>/mois</span>
              </div>
              <p style={{ fontSize: 14, color: "#0EA5E9" }}>Sans engagement · Premier mois offert</p>

              <p className="text-white/80 mt-4 mb-5 leading-relaxed" style={{ fontSize: 14 }}>
                L'agent IA qui transforme vos données biométriques en actions concrètes.
                Coach proactif, automatisations illimitées, marketplace de flows,
                intégrations smart-home, mises à jour à vie.
              </p>

              <div className="space-y-2.5">
                {[
                  "AETHER Coach — agent IA conversationnel",
                  "Automatisations illimitées (Aether Flows)",
                  "Marketplace + intégrations Spotify, HomeKit, Calendar...",
                  "Hébergement EU · chiffrement bout-en-bout",
                  "Mises à jour à vie · support prioritaire",
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

      {/* ═══ BLOCK 3 — PAYMENT METHODS ═══ */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pb-24">
        <div className="text-center mb-12">
          <div className="w-20 h-px mx-auto mb-6" style={{ background: "rgba(14,165,233,0.4)" }} />
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#0EA5E9" }}>COMMENT ON PAIE</p>
          <motion.h2
            className="font-heading text-2xl md:text-[38px] font-semibold text-white leading-tight mb-4"
            style={{ letterSpacing: "-0.01em" }}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
          >
            Deux façons de payer. Une seule philosophie : la transparence.
          </motion.h2>
          <p className="text-white/75 mx-auto" style={{ fontSize: 17, maxWidth: 640 }}>
            Pas de coût caché, pas de palier piège, pas d'engagement. Choisissez le moyen de paiement qui vous correspond.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* SEPA */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <GlassCard
              className="p-8 md:p-10 h-full relative transition-transform duration-300 hover:-translate-y-1"
              style={{ border: "1.5px solid rgba(14,165,233,0.3)", boxShadow: "0 0 40px rgba(14,165,233,0.08)" }}
            >
              <span
                className="absolute -top-3 left-8 px-3 py-1 rounded-full text-[9px] font-semibold tracking-wider uppercase"
                style={{ background: "#0EA5E9", color: "#0A1C3A" }}
              >
                RECOMMANDÉ · -15%
              </span>
              <Building2 className="mb-4" style={{ width: 28, height: 28, color: "#0EA5E9" }} />
              <h3 className="text-white font-semibold mb-1" style={{ fontSize: 22 }}>Prélèvement SEPA</h3>
              <p style={{ fontSize: 14, color: "#0EA5E9" }} className="mb-4">21,25€/mois — économisez 3,75€/mois</p>
              <p className="text-white/80 leading-relaxed mb-6" style={{ fontSize: 15 }}>
                Le standard des abonnements européens. Vous autorisez un prélèvement automatique mensuel
                depuis votre compte bancaire, comme Netflix ou Spotify avec votre IBAN.
                Plus économique pour nous, donc 15% moins cher pour vous.
              </p>
              <div className="space-y-2.5 mb-6">
                {[
                  "15% de réduction permanente",
                  "Aucune carte à mettre à jour à l'expiration",
                  "Mandat révocable à tout moment depuis votre app",
                  "Garantie SEPA : remboursement intégral sous 8 semaines en cas de litige",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 flex-shrink-0" style={{ width: 16, height: 16, color: "#0EA5E9" }} />
                    <span className="text-white/90" style={{ fontSize: 14 }}>{t}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/50" style={{ fontSize: 12 }}>Conforme au règlement SEPA Direct Debit · IBAN européen requis</p>
            </GlassCard>
          </motion.div>

          {/* Card */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <GlassCard className="p-8 md:p-10 h-full transition-transform duration-300 hover:-translate-y-1">
              <CreditCard className="mb-4" style={{ width: 28, height: 28, color: "#0EA5E9" }} />
              <h3 className="text-white font-semibold mb-1" style={{ fontSize: 22 }}>Carte bancaire</h3>
              <p className="text-white/60 mb-4" style={{ fontSize: 14 }}>25€/mois — Visa, Mastercard, Amex</p>
              <p className="text-white/80 leading-relaxed mb-6" style={{ fontSize: 15 }}>
                Le paiement classique, instantané, accepté partout.
                Vos coordonnées sont chiffrées et tokenisées via Stripe.
                Aucune carte n'est stockée chez nous.
              </p>
              <div className="space-y-2.5 mb-6">
                {[
                  "Activation instantanée à l'inscription",
                  "Compatible avec toutes les cartes (Visa, Mastercard, Amex)",
                  "Sécurisé par 3D Secure 2 (authentification forte)",
                  "Annulation libre depuis votre app",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 flex-shrink-0" style={{ width: 16, height: 16, color: "#0EA5E9" }} />
                    <span className="text-white/90" style={{ fontSize: 14 }}>{t}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/50" style={{ fontSize: 12 }}>Paiement traité par Stripe · Conforme PCI-DSS niveau 1</p>
            </GlassCard>
          </motion.div>
        </div>

        <p className="text-center text-white/60 italic" style={{ fontSize: 14 }}>
          Pourquoi le SEPA est moins cher ? Parce que les frais bancaires de prélèvement sont 5× moins élevés
          que ceux d'une transaction carte. Nous vous reversons cette économie directement.
        </p>
      </div>

      {/* ═══ BLOCK 4 — PRICE ANCHORING ═══ */}
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12 pb-28 md:pb-32">
        <motion.div
          className="text-center mb-10"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
        >
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: "#0EA5E9" }}>
            LE PRIX DE L'INTELLIGENCE BIOMÉTRIQUE
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Whoop */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <GlassCard className="p-6 text-center h-full transition-all duration-300 hover:brightness-110">
              <p className="text-white/50 font-bold tracking-wider mb-4" style={{ fontSize: 14 }}>WHOOP</p>
              <p className="text-white font-bold mb-1" style={{ fontSize: 28 }}>30€/mois</p>
              <p className="text-white/50" style={{ fontSize: 13 }}>+ pas de hardware inclus</p>
            </GlassCard>
          </motion.div>

          {/* Oura */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <GlassCard className="p-6 text-center h-full transition-all duration-300 hover:brightness-110">
              <p className="text-white/50 font-bold tracking-wider mb-4" style={{ fontSize: 14 }}>OURA RING</p>
              <p className="text-white font-bold mb-1" style={{ fontSize: 28 }}>5,99€/mois</p>
              <p className="text-white/50" style={{ fontSize: 13 }}>+ 349€ pour la bague</p>
              <p className="italic mt-1" style={{ fontSize: 13, color: "#0EA5E9" }}>= ~25€/mois sur 2 ans</p>
            </GlassCard>
          </motion.div>

          {/* OREON */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
            <GlassCard
              className="p-6 text-center h-full transition-all duration-300 hover:-translate-y-1"
              style={{
                border: "1.5px solid rgba(14,165,233,0.4)",
                boxShadow: "0 0 40px rgba(14,165,233,0.15)",
                transform: "scale(1.05)",
              }}
            >
              <p className="text-white font-bold tracking-wider mb-4" style={{ fontSize: 14 }}>OREON</p>
              <p className="font-bold mb-1" style={{ fontSize: 24, color: "#0EA5E9" }}>21,25€/mois en SEPA</p>
              <p className="text-white/60 mb-2" style={{ fontSize: 14 }}>ou 25€/mois en CB</p>
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <Check style={{ width: 14, height: 14, color: "#0EA5E9" }} />
                <span style={{ fontSize: 13, color: "#0EA5E9" }}>+ bracelet offert</span>
              </div>
              <p className="text-white/70 italic" style={{ fontSize: 12 }}>Le meilleur rapport intelligence/prix du marché</p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
