import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Brain, Zap, Smartphone, Shield, Battery, Check, QrCode, CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import oreonBracelet from "@/assets/oreon-bracelet.png";
import oreonSpecs from "@/assets/oreon-specs.png";
import ScrollVideoPlayer from "@/components/bracelet/ScrollVideoPlayer";

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
    name: "Précommande",
    key: "precommande",
    price: "3,99",
    features: [
      "Bracelet Oreon offert",
      "Suivi biométrique complet",
      "Tableau de bord santé",
      "Alertes intelligentes IA",
      "Automatisations IA",
      "Livraison dès disponibilité",
    ],
  },
  {
    name: "Livraison directe",
    key: "livraison",
    price: "4,99",
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
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCardPayment = async (planKey: string) => {
    setLoadingPlan(planKey);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await supabase.functions.invoke("bracelet-checkout", {
        body: { plan: planKey },
      });

      if (response.error) throw new Error(response.error.message);
      const { url } = response.data;
      if (url) {
        window.open(url, "_blank");
      }
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Impossible de créer la session de paiement",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero with Video */}
      <section className="relative h-screen flex items-end overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/bracelet-hero.mp4"
        />
        {/* Cinematic gradient overlay — darker at bottom for text */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 40%, rgba(10,30,70,0.7) 75%, rgba(5,15,40,0.92) 100%)"
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
              Bracelet offert · À partir de 3,99€ · Paiement unique
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center h-10 px-6 text-[10px] font-bold tracking-[0.15em] uppercase text-[#0a1e46] bg-white rounded-none transition-all hover:bg-white/90"
              >
                Précommander
              </a>
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

      {/* Scroll Video Animation */}
      <ScrollVideoPlayer />

      {/* Technical Specs Image */}
      <section className="py-28" style={{ background: "#0a2d6e" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-white/45 mb-4">
              Spécifications techniques
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              Conçu pour la performance
            </h2>
            <p className="text-base text-white/60 max-w-[500px] mx-auto">
              Chaque composant a été pensé pour allier durabilité, confort et sécurité cryptographique
            </p>
          </div>
          <img
            src={oreonSpecs}
            alt="Spécifications techniques du bracelet Oreon — NFC, silicone, antenne intégrée"
            className="w-full max-w-[1200px] mx-auto rounded-sm"
          />
        </div>
      </section>

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

      {/* Pricing */}
      <section id="pricing" className="py-28 bg-white">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "#1E4D8C" }}>
              Tarifs
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#0F172A" }}>
              Bracelet offert, abonnement simple
            </h2>
            <p className="text-base max-w-[500px] mx-auto" style={{ color: "#64748B" }}>
              Aucun frais d'achat. Choisissez votre formule et recevez votre Oreon gratuitement
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative p-10 rounded-sm border"
                style={{
                  borderColor: plan.popular ? "#1E4D8C" : "#E2E8F0",
                  borderWidth: plan.popular ? 2 : 1,
                }}
              >
                {plan.popular && (
                  <span
                    className="absolute -top-3 left-10 px-4 py-1 text-xs font-semibold text-white tracking-wider uppercase"
                    style={{ background: "#1E4D8C" }}
                  >
                    Recommandé
                  </span>
                )}
                <h3 className="font-heading text-2xl font-bold mb-2" style={{ color: "#0F172A" }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-heading text-4xl font-bold" style={{ color: "#1E4D8C" }}>{plan.price}€</span>
                  <span className="text-sm" style={{ color: "#64748B" }}>paiement unique</span>
                </div>
                <p className="text-xs mb-8" style={{ color: "#94A3B8" }}>Bracelet offert · Paiement en une seule fois</p>
                <ul className="space-y-3 mb-10">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm" style={{ color: "#334155" }}>
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#1E4D8C" }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Two payment buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleCardPayment(plan.key)}
                    disabled={loadingPlan === plan.key}
                    className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold tracking-wide uppercase transition-all disabled:opacity-60"
                    style={{
                      background: plan.popular ? "#1E4D8C" : "transparent",
                      color: plan.popular ? "#fff" : "#1E4D8C",
                      border: plan.popular ? "none" : "1px solid #1E4D8C",
                    }}
                  >
                    {loadingPlan === plan.key ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    Payer par carte
                  </button>
                  <a
                    href="#qrcode"
                    className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold tracking-wide uppercase transition-all"
                    style={{
                      background: plan.popular ? "transparent" : "#1E4D8C",
                      color: plan.popular ? "#1E4D8C" : "#fff",
                      border: plan.popular ? "1px solid #1E4D8C" : "none",
                    }}
                  >
                    <QrCode className="w-4 h-4" />
                    Prélèvement SEPA
                  </a>
                </div>

                <p className="text-xs text-center mt-4" style={{ color: "#94A3B8" }}>
                  Paiement unique · Bracelet offert · Satisfait ou remboursé
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Code */}
      <section id="qrcode" className="py-28" style={{ background: "#F8FAFC" }}>
        <div className="max-w-[800px] mx-auto px-6 lg:px-12 text-center">
          <div className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-8" style={{ background: "#1E4D8C10" }}>
            <QrCode className="w-8 h-8" style={{ color: "#1E4D8C" }} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#0F172A" }}>
            Activez votre mandat SEPA
          </h2>
          <p className="text-base mb-12 max-w-[500px] mx-auto" style={{ color: "#64748B" }}>
            Scannez le QR code ci-dessous avec votre téléphone pour autoriser le prélèvement mensuel et recevoir votre bracelet Oreon
          </p>

          {/* Placeholder QR Code */}
          <div className="inline-block p-8 bg-white rounded-sm border" style={{ borderColor: "#E2E8F0" }}>
            <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
              {/* Placeholder QR pattern */}
              <rect width="200" height="200" fill="white" />
              {/* Corner squares */}
              <rect x="10" y="10" width="50" height="50" fill="#0F172A" />
              <rect x="16" y="16" width="38" height="38" fill="white" />
              <rect x="22" y="22" width="26" height="26" fill="#0F172A" />
              <rect x="140" y="10" width="50" height="50" fill="#0F172A" />
              <rect x="146" y="16" width="38" height="38" fill="white" />
              <rect x="152" y="22" width="26" height="26" fill="#0F172A" />
              <rect x="10" y="140" width="50" height="50" fill="#0F172A" />
              <rect x="16" y="146" width="38" height="38" fill="white" />
              <rect x="22" y="152" width="26" height="26" fill="#0F172A" />
              {/* Data pattern (placeholder) */}
              {[70,80,90,100,110,120].map(x =>
                [70,80,90,100,110,120].map(y => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill={(x+y) % 20 === 0 ? "white" : "#0F172A"} />
                ))
              )}
              {[10,20,30,40,50,140,150,160,170,180].map(x =>
                [70,80,90,100,110,120].map(y => (
                  <rect key={`h-${x}-${y}`} x={x} y={y} width="8" height="8" fill={(x*y) % 3 === 0 ? "#0F172A" : "white"} />
                ))
              )}
              {[70,80,90,100,110,120].map(x =>
                [140,150,160,170,180].map(y => (
                  <rect key={`v-${x}-${y}`} x={x} y={y} width="8" height="8" fill={(x+y) % 3 === 0 ? "#0F172A" : "white"} />
                ))
              )}
            </svg>
            <p className="text-xs mt-6 font-medium" style={{ color: "#94A3B8" }}>
              QR Code de démonstration — sera remplacé avant publication
            </p>
          </div>

          <p className="text-xs mt-8 max-w-[400px] mx-auto leading-relaxed" style={{ color: "#94A3B8" }}>
            En scannant ce QR code, vous autorisez AETHER GROUP (SIREN 104 445 424) à émettre des prélèvements SEPA
            sur votre compte bancaire conformément aux{" "}
            <Link to="/legal/bracelet-cgu" className="underline hover:text-[#1E4D8C]">
              conditions générales d'utilisation
            </Link>
          </p>
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
