import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Brain, Zap, Smartphone, Shield, Battery, Check, QrCode, CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import oreonBracelet from "@/assets/oreon-bracelet.png";

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
    price: "11,97",
    monthly: "3,99",
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
    price: "14,97",
    monthly: "4,99",
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
    a: "Oui, le bracelet Oreon est offert. Vous vous engagez à un abonnement d'un an avec prélèvement trimestriel de 8,97€ (Essentiel) ou 11,97€ (Premium) par SEPA ou carte bancaire.",
  },
  {
    q: "Comment fonctionne le prélèvement SEPA ?",
    a: "En scannant le QR code fourni, vous autorisez un mandat de prélèvement SEPA. Le montant est débité automatiquement tous les 3 mois de votre compte bancaire.",
  },
  {
    q: "Puis-je payer par carte bancaire ?",
    a: "Oui, vous pouvez choisir le paiement par carte bancaire en cliquant sur le bouton correspondant dans la section tarifs. Le prélèvement sera effectué tous les 3 mois automatiquement.",
  },
  {
    q: "Puis-je résilier mon abonnement ?",
    a: "L'abonnement comporte un engagement de 12 mois. Au-delà, vous pouvez résilier à tout moment avec un préavis de 30 jours. En cas de résiliation anticipée, des frais de restitution du bracelet (29€) peuvent s'appliquer.",
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
      {/* Hero */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1E4D8C 0%, #152d52 100%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-[8%] w-[480px] h-[480px] rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="absolute bottom-[5%] left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 w-full z-10 pt-32 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.35em] uppercase text-white/45 mb-8">
                Biometric Intelligence · AI Automation · Health Tracking
              </p>
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.02] tracking-tight text-white mb-8">
                Oreon
              </h1>
              <p className="text-lg md:text-xl text-white/65 max-w-[500px] leading-relaxed mb-6">
                Le bracelet intelligent qui capture vos données biométriques et les transforme en
                <strong className="text-white font-medium"> automatisations IA personnalisées</strong> via notre plateforme AETHER
              </p>
              <p className="text-sm text-white/50 mb-10">
                Bracelet offert · À partir de 2,99€/mois · SEPA ou Carte bancaire · 12 mois d'engagement
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center h-14 px-10 text-[13px] font-bold tracking-[0.1em] uppercase text-[#1E4D8C] bg-white transition-all hover:bg-white/90"
                >
                  Choisir mon offre
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center h-14 px-10 text-[13px] font-medium tracking-[0.1em] uppercase text-white border border-white/25 transition-all hover:bg-white/10"
                >
                  Découvrir les fonctionnalités
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={oreonBracelet}
                alt="Bracelet Oreon"
                width={1024}
                height={1024}
                className="w-full max-w-[480px] drop-shadow-2xl"
              />
            </div>
          </div>
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
                  <span className="text-sm" style={{ color: "#64748B" }}>/trimestre</span>
                </div>
                <p className="text-xs mb-8" style={{ color: "#94A3B8" }}>soit {plan.monthly}€/mois · Engagement 12 mois</p>
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
                  Prélèvement trimestriel · Engagement 12 mois
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
