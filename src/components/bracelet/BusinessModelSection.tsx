import { useState } from "react";
import { Check, CreditCard, Calendar, Brain, Fingerprint, ChevronDown, Rocket, ArrowRight, Lock, Shield } from "lucide-react";

const faqItems = [
  {
    q: "Pourquoi un abonnement et pas un achat unique ?",
    a: "Parce que l'intelligence artificielle évolue en permanence. Chaque mois, nous déployons de nouveaux algorithmes, de nouvelles intégrations et de nouvelles automatisations. Un achat unique fige le produit dans le temps. L'abonnement garantit que votre plateforme reste à la pointe, indéfiniment."
  },
  {
    q: "Que se passe-t-il si j'arrête mon abonnement ? Le bracelet fonctionne-t-il encore ?",
    a: "Le bracelet reste votre propriété et continue de fonctionner comme identifiant NFC. Cependant, l'accès à la plateforme AETHER (coach IA, automatisations, analytics) sera suspendu jusqu'à réactivation de votre abonnement."
  },
  {
    q: "Pourquoi le SEPA est-il 15% moins cher ?",
    a: "Les frais de traitement d'un prélèvement SEPA sont environ 5 fois inférieurs à ceux d'une transaction par carte bancaire. Plutôt que de garder cette marge, nous avons décidé de la reverser intégralement à nos utilisateurs sous forme de réduction."
  },
  {
    q: "Puis-je passer du SEPA à la carte (ou inversement) ?",
    a: "Oui, à tout moment depuis votre espace personnel dans l'application. Le changement prend effet au prochain cycle de facturation."
  },
  {
    q: "Comment annuler mon abonnement ?",
    a: "En deux clics depuis votre application, sans justification, sans appel téléphonique, sans email. L'annulation est immédiate et vous conservez l'accès jusqu'à la fin de votre période en cours."
  },
  {
    q: "Mes données biométriques sont-elles vraiment privées ?",
    a: "Absolument. Chiffrement AES-256 de bout en bout, hébergement exclusif en France (datacenter certifié SecNumCloud), conformité RGPD intégrale. Vos données ne sont jamais vendues, jamais partagées, jamais utilisées à des fins publicitaires. Vous pouvez demander leur suppression définitive à tout moment."
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

        {/* ═══ BEAT 1 — PHILOSOPHY ═══ */}
        <div className="text-center mb-20 md:mb-28">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-400/30 mb-8" style={{ background: "rgba(34,211,238,0.08)" }}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-[11px] font-semibold tracking-[0.2em] uppercase">Le modèle Oreon</span>
          </div>

          <h2 className="text-white font-semibold text-[32px] md:text-[52px] leading-[1.1] tracking-[-0.02em] mb-6 max-w-[800px] mx-auto">
            Le bracelet est libre.{" "}
            <span className="text-cyan-400">L'intelligence est dans AETHER.</span>
          </h2>

          <p className="text-white/75 text-base md:text-lg leading-[1.55] max-w-[720px] mx-auto mb-8">
            Notre conviction : l'objet doit être simple, durable, et accessible à tous. La vraie valeur n'est pas dans le silicone — elle est dans la plateforme qui transforme vos signaux biométriques en automatisations intelligentes. C'est pour cela que nous offrons le bracelet et que nous facturons l'intelligence.
          </p>

          <div className="w-20 h-[1px] bg-cyan-400/40 mx-auto" />
        </div>

        {/* ═══ BEAT 2 — TWO COMPONENTS ═══ */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-0 items-stretch mb-20 md:mb-28">
          {/* LEFT — L'OBJET */}
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
            <span className="text-cyan-400 text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">L'objet</span>
            <h3 className="text-white font-semibold text-[28px] mb-1">Bracelet Oreon</h3>
            <div className="mb-4">
              <span className="text-white font-bold text-[56px] leading-none">OFFERT</span>
              <span className="block text-cyan-400 text-sm mt-1">À l'inscription</span>
            </div>
            <p className="text-white/80 text-[15px] leading-relaxed mb-6">
              Un design minimaliste. Une puce NFC chiffrée. Aucune électronique active, aucune batterie, aucune obsolescence. Le bracelet est votre clé d'identité — rien de plus, rien de moins.
            </p>
            <ul className="space-y-3 mt-auto">
              {["Étanche, indestructible", "Sans batterie, sans charge", "Garantie à vie"].map(t => (
                <li key={t} className="flex items-center gap-3 text-white/90 text-sm">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* CENTER CONNECTOR */}
          <div className="hidden md:flex flex-col items-center justify-center px-6 relative" style={{ minWidth: 80 }}>
            <span className="text-cyan-400/70 text-xs italic mb-3">+ requiert</span>
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

          {/* RIGHT — L'INTELLIGENCE */}
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
                  <Calendar className="w-3 h-3" /> Disponible le 1er juin 2026
                </span>
              </div>

              <span className="text-cyan-400 text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">L'intelligence</span>
              <h3 className="text-white font-semibold text-[28px] mb-1">Plateforme AETHER</h3>
              <div className="mb-1">
                <span className="text-white font-bold text-[56px] leading-none">25€</span>
                <span className="text-white/70 text-2xl ml-1">/mois</span>
              </div>
              <p className="text-cyan-400 text-sm mb-4">Sans engagement · Premier mois offert</p>

              <p className="text-white/80 text-[15px] leading-relaxed mb-6">
                L'agent IA qui transforme vos données biométriques en actions concrètes. Coach proactif, automatisations illimitées, marketplace de flows, intégrations smart-home, mises à jour à vie.
              </p>

              <ul className="space-y-3 mt-auto">
                {[
                  "AETHER Coach — agent IA conversationnel",
                  "Automatisations illimitées (Aether Flows)",
                  "Marketplace + intégrations Spotify, HomeKit, Calendar...",
                  "Hébergement EU · chiffrement bout-en-bout",
                  "Mises à jour à vie · support prioritaire",
                ].map(t => (
                  <li key={t} className="flex items-start gap-3 text-white/90 text-sm">
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ═══ BEAT 3 — PAYMENT METHODS ═══ */}
        <div className="mb-20 md:mb-28">
          <div className="text-center mb-12">
            <div className="w-16 h-[1px] bg-cyan-400/40 mx-auto mb-6" />
            <span className="text-cyan-400 text-[11px] font-semibold tracking-[0.2em] uppercase">Comment on paie</span>
            <h3 className="text-white font-semibold text-[28px] md:text-[38px] leading-tight tracking-[-0.01em] mt-4 mb-4">
              Deux façons de payer. Une seule philosophie : la transparence.
            </h3>
            <p className="text-white/75 text-[15px] md:text-[17px] max-w-[640px] mx-auto">
              Pas de coût caché, pas de palier piège, pas d'engagement. Choisissez le moyen de paiement qui vous correspond.
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
                Recommandé · -15%
              </div>
              <Shield className="w-7 h-7 text-cyan-400 mb-4 mt-2" />
              <h4 className="text-white font-semibold text-[22px] mb-1">Prélèvement SEPA</h4>
              <p className="text-cyan-400 text-sm font-medium mb-4">21,25€/mois — économisez 3,75€/mois</p>
              <p className="text-white/80 text-[15px] leading-relaxed mb-6">
                Le standard des abonnements européens. Vous autorisez un prélèvement automatique mensuel depuis votre compte bancaire, comme Netflix ou Spotify avec votre IBAN. Plus économique pour nous, donc 15% moins cher pour vous.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "15% de réduction permanente",
                  "Aucune carte à mettre à jour à l'expiration",
                  "Mandat révocable à tout moment depuis votre app",
                  "Garantie SEPA : remboursement intégral sous 8 semaines en cas de litige",
                ].map(t => (
                  <li key={t} className="flex items-start gap-3 text-white/90 text-sm">
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
              <p className="text-white/60 text-xs">Conforme au règlement SEPA Direct Debit · IBAN européen requis</p>
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
              <h4 className="text-white font-semibold text-[22px] mb-1">Carte bancaire</h4>
              <p className="text-white/70 text-sm font-medium mb-4">25€/mois — Visa, Mastercard, Amex</p>
              <p className="text-white/80 text-[15px] leading-relaxed mb-6">
                Le paiement classique, instantané, accepté partout. Vos coordonnées sont chiffrées et tokenisées via Stripe. Aucune carte n'est stockée chez nous.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Activation instantanée à l'inscription",
                  "Compatible avec toutes les cartes (Visa, Mastercard, Amex)",
                  "Sécurisé par 3D Secure 2 (authentification forte)",
                  "Annulation libre depuis votre app",
                ].map(t => (
                  <li key={t} className="flex items-start gap-3 text-white/90 text-sm">
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
              <p className="text-white/60 text-xs">Paiement traité par Stripe · Conforme PCI-DSS niveau 1</p>
            </div>
          </div>

          <p className="text-center text-white/70 text-sm italic mt-8 max-w-[700px] mx-auto">
            Pourquoi le SEPA est moins cher ? Parce que les frais bancaires de prélèvement sont 5× moins élevés que ceux d'une transaction carte. Nous vous reversons cette économie directement.
          </p>
        </div>

        {/* ═══ BEAT 4 — PRICE ANCHORING ═══ */}
        <div className="mb-20 md:mb-28">
          <div className="text-center mb-10">
            <span className="text-cyan-400 text-[11px] font-semibold tracking-[0.2em] uppercase">Le prix de l'intelligence biométrique</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Whoop */}
            <div className="rounded-3xl p-8 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
              <p className="text-white/50 text-xs font-semibold tracking-[0.15em] uppercase mb-4">Whoop 4.0</p>
              <p className="text-white/70 font-bold text-3xl mb-2">30€<span className="text-lg font-normal">/mois</span></p>
              <p className="text-white/50 text-sm">+ pas de hardware inclus</p>
            </div>

            {/* Oura */}
            <div className="rounded-3xl p-8 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
              <p className="text-white/50 text-xs font-semibold tracking-[0.15em] uppercase mb-4">Oura Ring</p>
              <p className="text-white/70 font-bold text-3xl mb-2">5,99€<span className="text-lg font-normal">/mois</span></p>
              <p className="text-white/50 text-sm">+ 349€ pour la bague</p>
              <p className="text-white/40 text-xs mt-2">= ~25€/mois sur 2 ans</p>
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
              <p className="text-white font-bold text-3xl mb-1">21,25€<span className="text-lg font-normal text-white/70">/mois en SEPA</span></p>
              <p className="text-white/60 text-sm mb-2">ou 25€/mois en CB</p>
              <p className="text-cyan-400 text-sm font-medium">+ bracelet offert</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Check className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-xs">Le meilleur rapport intelligence/prix du marché</span>
              </div>
            </div>
          </div>

          <p className="text-center text-white/70 text-sm mt-8 max-w-[700px] mx-auto">
            Plus complet que les leaders. Moins cher que la concurrence directe. Et sans hardware à 300€ à débourser.
          </p>
        </div>

        {/* ═══ BEAT 5 — CTA BANNER ═══ */}
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

          <div className="relative z-10 grid md:grid-cols-[auto_1fr_auto] gap-8 items-center">
            {/* Left */}
            <div className="text-center md:text-left">
              <Rocket className="w-6 h-6 text-cyan-400 mb-2 mx-auto md:mx-0" />
              <span className="text-cyan-400 text-[10px] font-semibold tracking-[0.2em] uppercase block">Lancement officiel</span>
              <p className="text-white font-bold text-[28px] md:text-[32px]">1er Juin 2026</p>
            </div>

            {/* Center */}
            <div className="text-center md:text-left">
              <h4 className="text-white font-semibold text-xl md:text-2xl mb-2">Soyez parmi les 1000 premiers</h4>
              <p className="text-white/80 text-[15px] mb-3">
                Premier mois offert · Bracelet livré dès lancement · Tarif early-bird verrouillé à vie
              </p>
              <div className="mb-1">
                <span className="text-cyan-400 font-bold text-[28px]">19€</span>
                <span className="text-white/70 text-lg">/mois en SEPA</span>
                <span className="text-white/50 text-sm line-through ml-3">21,25€</span>
              </div>
              <p className="text-white/60 text-sm">ou 22€/mois en carte bancaire (au lieu de 25€)</p>
            </div>

            {/* Right */}
            <div className="flex flex-col items-center gap-3">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-cyan-400 text-[#0F1F4F] font-bold text-sm tracking-wide uppercase transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105"
              >
                Réserver ma place <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#features" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-white/80 text-xs font-medium uppercase tracking-wide transition-all hover:bg-white/10">
                En savoir plus
              </a>
              <div className="mt-2 w-full max-w-[200px]">
                <p className="text-white/60 text-[11px] text-center mb-1">812 places réservées sur 1000</p>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-400/80 w-[81%]" style={{ animation: "pulse-glow 3s ease-in-out infinite" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white/60 text-xs mb-16">
          <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Paiement sécurisé Stripe</span>
          <span>·</span>
          <span>🇪🇺 Hébergé en France</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><Check className="w-3 h-3" /> RGPD compliant</span>
          <span>·</span>
          <span>↩ Annulation libre</span>
        </div>

        {/* ═══ BEAT 6 — FAQ ═══ */}
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
        <p className="text-center text-white/60 text-sm italic mt-16">
          Modèle transparent · Sans engagement · Construit pour durer.
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
