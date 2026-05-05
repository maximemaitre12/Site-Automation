import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, Brain, Zap, Smartphone, Shield, Battery, Check } from "lucide-react";
import PrecommanderReveal from "@/components/bracelet/PrecommanderReveal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import oreonBracelet from "@/assets/oreon-bracelet.png";
import oreonSpecs from "@/assets/oreon-specs.png";

import BraceletShowcaseSection from "@/components/bracelet/BraceletShowcaseSection";
import AnimatedSpecsSection from "@/components/bracelet/AnimatedSpecsSection";
import BusinessModelSection from "@/components/bracelet/BusinessModelSection";
import OceanWaveDivider from "@/components/bracelet/OceanWaveDivider";


const features = [
  {
    icon: Activity,
    title: "Capteurs biométriques avancés",
    desc: "Fréquence cardiaque, SpO2, température corporelle, variabilité cardiaque et qualité du sommeil en continu",
  },
  {
    icon: Brain,
    title: "Automatisations IA intégrées",
    desc: "Créez des workflows intelligents déclenchés par vos données biométriques via notre plateforme AETHER",
  },
  {
    icon: Zap,
    title: "Alertes en temps réel",
    desc: "Notifications instantanées en cas d'anomalie détectée par nos algorithmes de machine learning",
  },
  {
    icon: Smartphone,
    title: "Application connectée",
    desc: "Tableau de bord complet pour suivre vos tendances, historiques et prédictions santé",
  },
  {
    icon: Shield,
    title: "Données chiffrées RGPD",
    desc: "Vos données biométriques sont chiffrées de bout en bout et hébergées en Europe",
  },
  {
    icon: Battery,
    title: "Autonomie 14 jours",
    desc: "Batterie longue durée avec charge rapide USB-C, résistant à l'eau IP68",
  },
];

const plans = [
  {
    name: "SEPA",
    key: "sepa",
    price: "19",
    oldPrice: "21,25",
    features: [
      "Bracelet Oreon offert",
      "Suivi biométrique complet",
      "Tableau de bord santé",
      "Alertes intelligentes IA",
      "Automatisations IA",
      "Tarif early-bird verrouillé à vie",
    ],
  },
  {
    name: "Carte bancaire",
    key: "carte",
    price: "22",
    oldPrice: "25",
    popular: true,
    features: [
      "Bracelet Oreon offert",
      "Suivi biométrique complet",
      "Tableau de bord santé avancé",
      "Alertes intelligentes IA",
      "Automatisations IA illimitées",
      "Livraison sous 48h",
      "Rapports hebdomadaires",
      "Support prioritaire",
    ],
  },
];
const steps = [
  { num: "01", title: "Recevez votre bracelet", desc: "Commandez gratuitement votre Oreon, livré sous 48h en France métropolitaine" },
  { num: "02", title: "Scannez le QR code", desc: "Activez votre mandat SEPA en scannant le code avec votre téléphone" },
  { num: "03", title: "Commencez le suivi", desc: "Connectez le bracelet à l'application et créez vos premières automatisations IA" },
];

const faqs = [
  {
    q: "Le bracelet est-il vraiment gratuit ?",
    a: "Oui, le bracelet Oreon est offert. Vous payez uniquement 3,99€ (Précommande) ou 4,99€ (Livraison directe) en paiement unique par SEPA ou carte bancaire.",
  },
  {
    q: "Quelle est la différence entre les deux offres ?",
    a: "L'offre Précommande à 3,99€ vous permet de réserver votre bracelet à tarif réduit, livré dès disponibilité. L'offre Livraison directe à 4,99€ inclut une expédition sous 48h et des fonctionnalités avancées.",
  },
  {
    q: "Comment fonctionne le paiement ?",
    a: "Le paiement est unique. Vous réglez une seule fois par carte bancaire ou SEPA, et vous recevez votre bracelet Oreon avec accès complet à la plateforme.",
  },
  {
    q: "Puis-je payer par carte bancaire ?",
    a: "Oui, vous pouvez choisir le paiement par carte bancaire en cliquant sur le bouton correspondant dans la section tarifs.",
  },
  {
    q: "Y a-t-il un abonnement ou des frais récurrents ?",
    a: "Non, il n'y a aucun abonnement ni frais récurrents. Le paiement est unique et vous donne accès à l'ensemble des fonctionnalités.",
  },
  {
    q: "Mes données sont-elles protégées ?",
    a: "Absolument. Toutes les données biométriques sont chiffrées AES-256, hébergées en Europe et traitées conformément au RGPD. Vous pouvez demander la suppression à tout moment.",
  },
  {
    q: "Le bracelet est-il étanche ?",
    a: "Oui, l'Oreon est certifié IP68 : résistant à l'eau jusqu'à 50 mètres. Vous pouvez le porter sous la douche et en piscine.",
  },
  {
    q: "Quelles automatisations IA sont disponibles ?",
    a: "Exemples : alerte si votre rythme cardiaque dépasse un seuil, rapport automatique envoyé à votre médecin, ajustement de votre agenda selon votre qualité de sommeil.",
  },
];

export default function Bracelet() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero with Video */}
      <section className="relative h-screen flex items-end overflow-hidden">
        {/* Video background */}
        <video
          ref={(el) => { if (el) el.playbackRate = 1.5; }}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/bracelet-hero.mp4"
        />
        {/* Cinematic gradient overlay — darker at bottom for text */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 40%, rgba(10,20,50,0.65) 70%, rgba(8,16,42,0.95) 100%)"
        }} />
        {/* Subtle vignette */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)"
        }} />

        <div className="relative w-full z-10 pb-12 md:pb-16 px-8 md:px-16 lg:px-24">
          <div className="max-w-[900px]">
            <div className="flex flex-wrap gap-2 mb-4">
              {["Biometric Intelligence", "AI Automation", "Health Tracking"].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center h-6 px-3 text-[8px] font-semibold tracking-[0.2em] uppercase text-white/70 rounded-full border border-white/15"
                  style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}
                >
                  <span className="w-1 h-1 rounded-full bg-white/40 mr-2" />
                  {label}
                </span>
              ))}
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-[-0.02em] text-white mb-4">
              Oreon
            </h1>

            <p className="text-sm md:text-base text-white/60 max-w-[440px] leading-relaxed mb-3 font-light">
              Le bracelet intelligent qui capture vos données biométriques et les transforme en
              <span className="text-white font-normal"> automatisations IA personnalisées</span> via notre plateforme AETHER
            </p>

            <p className="text-[11px] text-white/35 mb-6 tracking-wide">
              Bracelet offert · À partir de 19€/mois · Premier mois offert
            </p>

            <div className="flex flex-wrap gap-3">
              <PrecommanderReveal plans={plans} />
              <a
                href="#features"
                className="inline-flex items-center justify-center h-10 px-6 text-[10px] font-medium tracking-[0.15em] uppercase text-white/80 border border-white/20 rounded-none transition-all hover:bg-white/10 hover:border-white/40"
              >
                Explorer
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 right-8 md:right-16 lg:right-24 flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 rotate-90 origin-center translate-y-4">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* Ocean wave transition */}
      <OceanWaveDivider />

      {/* Bracelet Showcase Section */}
      <BraceletShowcaseSection />

      {/* Ocean wave transition — showcase → specs */}
      <OceanWaveDivider
        backColor="#0F1F4F"
        midColor="#1A3FB8"
        frontColor="#0a2d6e"
        variant="b"
      />

      {/* Technical Specs — Animated */}
      <AnimatedSpecsSection specsSrc={oreonSpecs} />

      {/* Wave → Business Model */}
      <OceanWaveDivider
        backColor="#0F1F4F"
        midColor="#1A3FB8"
        frontColor="#0a2d6e"
        variant="a"
      />

      {/* Business Model Section */}
      <BusinessModelSection />

      {/* Wave → Features */}
      <OceanWaveDivider
        backColor="#0a2d6e"
        midColor="#1A3FB8"
        frontColor="#ffffff"
        variant="b"
      />

      {/* Features */}
      <section id="features" className="py-28 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "#1E4D8C" }}>
            Fonctionnalités
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#0F172A" }}>
            Technologie de pointe au poignet
          </h2>
          <p className="text-base mb-16 max-w-[600px]" style={{ color: "#64748B" }}>
            Oreon combine capteurs biomédicaux de dernière génération et intelligence artificielle pour un suivi santé sans compromis
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="p-8 rounded-sm border" style={{ borderColor: "#E2E8F0" }}>
                <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-6" style={{ background: "#1E4D8C10" }}>
                  <f.icon className="w-6 h-6" style={{ color: "#1E4D8C" }} />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-3" style={{ color: "#0F172A" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-28" style={{ background: "#F8FAFC" }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "#1E4D8C" }}>
            Comment ça marche
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-16" style={{ color: "#0F172A" }}>
            Trois étapes pour commencer
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((s) => (
              <div key={s.num}>
                <span className="font-heading text-5xl font-bold" style={{ color: "#1E4D8C20" }}>{s.num}</span>
                <h3 className="font-heading text-xl font-semibold mt-4 mb-3" style={{ color: "#0F172A" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch Section */}
      <section id="pricing" className="py-28 bg-white">
        <div className="max-w-[800px] mx-auto px-6 lg:px-12 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "#1E4D8C" }}>
            Lancement officiel
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-2" style={{ color: "#0F172A" }}>
            1er Juin 2026
          </h2>
          <p className="text-lg font-medium mb-6" style={{ color: "#1E4D8C" }}>
            Soyez parmi les 1000 premiers
          </p>
          <p className="text-sm mb-10 max-w-[520px] mx-auto" style={{ color: "#64748B" }}>
            Premier mois offert · Bracelet livré dès lancement · Tarif early-bird verrouillé à vie
          </p>

          {/* Pricing display */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
            <div className="p-6 rounded-sm border text-center" style={{ borderColor: "#E2E8F0", minWidth: 220 }}>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "#64748B" }}>SEPA</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="font-heading text-4xl font-bold" style={{ color: "#1E4D8C" }}>19€</span>
                <span className="text-sm" style={{ color: "#64748B" }}>/mois</span>
              </div>
              <p className="text-sm mt-1 line-through" style={{ color: "#94A3B8" }}>21,25€</p>
            </div>
            <div className="text-sm font-medium" style={{ color: "#94A3B8" }}>ou</div>
            <div className="p-6 rounded-sm border-2 text-center" style={{ borderColor: "#1E4D8C", minWidth: 220 }}>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "#64748B" }}>Carte bancaire</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="font-heading text-4xl font-bold" style={{ color: "#1E4D8C" }}>22€</span>
                <span className="text-sm" style={{ color: "#64748B" }}>/mois</span>
              </div>
              <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>au lieu de <span className="line-through">25€</span></p>
            </div>
          </div>

          {/* CTA Buttons — disabled */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              disabled
              className="px-8 py-3.5 text-sm font-semibold tracking-wide uppercase opacity-50 cursor-not-allowed"
              style={{ background: "#1E4D8C", color: "#fff" }}
            >
              Réserver ma place
            </button>
            <a
              href="#features"
              className="px-8 py-3.5 text-sm font-semibold tracking-wide uppercase border transition-all hover:bg-gray-50"
              style={{ borderColor: "#1E4D8C", color: "#1E4D8C" }}
            >
              En savoir plus
            </a>
          </div>

          {/* Counter */}
          <div className="max-w-[400px] mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>812 places réservées sur 1000</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "#E2E8F0" }}>
              <div className="h-full rounded-full" style={{ width: "81.2%", background: "linear-gradient(90deg, #1E4D8C, #1A3FB8)" }} />
            </div>
            <p className="text-xs mt-3 font-medium" style={{ color: "#F59E0B" }}>
              Bientôt disponible
            </p>
          </div>
        </div>
      </section>



      {/* FAQ */}
      <section className="py-28 bg-white">
        <div className="max-w-[800px] mx-auto px-6 lg:px-12">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "#1E4D8C" }}>
            Questions fréquentes
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-16" style={{ color: "#0F172A" }}>
            Tout savoir sur Oreon
          </h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q} className="pb-8 border-b" style={{ borderColor: "#E2E8F0" }}>
                <h3 className="font-heading text-lg font-semibold mb-3" style={{ color: "#0F172A" }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28" style={{ background: "#1E4D8C" }}>
        <div className="max-w-[800px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
            Prêt à transformer vos données en intelligence
          </h2>
          <p className="text-lg text-white/65 mb-10 max-w-[500px] mx-auto">
            Recevez votre bracelet Oreon gratuitement et commencez à créer vos automatisations IA dès aujourd'hui
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center h-14 px-10 text-[13px] font-bold tracking-[0.1em] uppercase text-[#1E4D8C] bg-white transition-all hover:bg-white/90"
          >
            Commander mon Oreon
          </a>
        </div>
      </section>
    </div>
  );
}
