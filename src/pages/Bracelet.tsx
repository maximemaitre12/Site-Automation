import { useState } from "react";
import { Activity, Brain, Zap, Smartphone, Shield, Battery, Check, QrCode, CreditCard, Loader2 } from "lucide-react";
import PrecommanderReveal from "@/components/bracelet/PrecommanderReveal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import oreonSpecs from "@/assets/oreon-specs.png";

import BraceletShowcaseSection from "@/components/bracelet/BraceletShowcaseSection";
import AnimatedSpecsSection from "@/components/bracelet/AnimatedSpecsSection";
import BusinessModelSection from "@/components/bracelet/BusinessModelSection";
import OceanWaveDivider from "@/components/bracelet/OceanWaveDivider";
import OreonModelSection from "@/components/bracelet/OreonModelSection";
import SepaCheckoutFlow from "@/components/bracelet/SepaCheckoutFlow";

const features = [
  {
    icon: Activity,
    title: "Advanced biometric sensors",
    desc: "Heart rate, SpO2, body temperature, heart rate variability and continuous sleep tracking",
  },
  {
    icon: Brain,
    title: "Built-in AI automations",
    desc: "Create intelligent workflows triggered by your biometric data via our AETHER platform",
  },
  {
    icon: Zap,
    title: "Real-time alerts",
    desc: "Instant notifications when anomalies are detected by our machine learning algorithms",
  },
  {
    icon: Smartphone,
    title: "Connected app",
    desc: "Complete dashboard to track your trends, history and health predictions",
  },
  {
    icon: Shield,
    title: "GDPR encrypted data",
    desc: "Your biometric data is end-to-end encrypted and hosted in Europe",
  },
  {
    icon: Battery,
    title: "14-day battery life",
    desc: "Long-lasting battery with USB-C fast charging, IP68 water resistant",
  },
];

const plans = [
  {
    name: "Pre-order",
    key: "precommande",
    price: "3,99",
    features: [
      "Oreon physical bracelet",
      "Shipping included",
      "Delivered around June 1st",
    ],
  },
  {
    name: "Express delivery",
    key: "livraison",
    price: "4,99",
    popular: true,
    features: [
      "Oreon physical bracelet",
      "Shipping included",
      "Delivery within 48h",
      "Priority support",
    ],
  },
];

const steps = [
  { num: "01", title: "Receive your bracelet", desc: "Order your Oreon from 3,99 €, delivered within 48h" },
  { num: "02", title: "Scan the QR code", desc: "Activate your SEPA mandate by scanning the code with your phone" },
  { num: "03", title: "Start tracking", desc: "Connect the bracelet to the app and create your first AI automations" },
];

const faqs = [
  {
    q: "How much does the bracelet cost?",
    a: "The Oreon bracelet is sold as a one-time payment: 3,99 € for pre-order or 4,99 € for express delivery. The AETHER platform subscription opens separately on June 1st, 2026.",
  },
  {
    q: "What is the difference between the two plans?",
    a: "The Pre-order plan at 3.99€ lets you reserve your bracelet at a reduced price, delivered when available. The Express delivery plan at 4.99€ includes shipping within 48h and advanced features.",
  },
  {
    q: "How does the payment work?",
    a: "The bracelet payment is one-time. You pay once by credit card or SEPA, receive your Oreon bracelet, then subscribe to AETHER separately when the platform opens on June 1st, 2026.",
  },
  {
    q: "Can I pay by credit card?",
    a: "Yes, you can choose credit card payment by clicking the corresponding button in the pricing section.",
  },
  {
    q: "Is there a subscription or recurring fees?",
    a: "There is no subscription charged today. The bracelet is a one-time payment; the AETHER platform subscription becomes available separately on June 1st, 2026.",
  },
  {
    q: "Is my data protected?",
    a: "Absolutely. All biometric data is AES-256 encrypted, hosted in Europe and processed in compliance with GDPR. You can request deletion at any time.",
  },
  {
    q: "Is the bracelet waterproof?",
    a: "Yes, the Oreon is IP68 certified: water resistant up to 50 meters. You can wear it in the shower and in the pool.",
  },
  {
    q: "What AI automations are available?",
    a: "Examples: alert if your heart rate exceeds a threshold, automatic report sent to your doctor, schedule adjustments based on your sleep quality.",
  },
];

export default function Bracelet() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showSepaFor, setShowSepaFor] = useState<string | null>(null);
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
        window.location.href = url;
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Unable to create payment session",
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
          ref={(el) => { if (el) el.playbackRate = 1.5; }}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/bracelet-hero.mp4"
        />
        {/* Cinematic gradient overlay */}
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
              The smart bracelet that captures your biometric data and transforms it into
              <span className="text-white font-normal"> personalized AI automations</span> via our AETHER platform
            </p>

            <p className="text-[11px] text-white/35 mb-6 tracking-wide">
              Bracelet from 3,99 € · One-time payment · Subscription opens June 1st, 2026
            </p>

            <div className="flex flex-wrap gap-3">
              <PrecommanderReveal
                plans={plans}
                onCardPayment={handleCardPayment}
                loadingPlan={loadingPlan}
              />
              <a
                href="#features"
                className="inline-flex items-center justify-center h-10 px-6 text-[10px] font-medium tracking-[0.15em] uppercase text-white/80 border border-white/20 rounded-none transition-all hover:bg-white/10 hover:border-white/40"
              >
                Explore
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

      {/* Ocean wave transition */}
      <OceanWaveDivider
        backColor="#0F1F4F"
        midColor="#1A3FB8"
        frontColor="#0a2d6e"
        variant="b"
      />

      {/* Technical Specs */}
      <AnimatedSpecsSection specsSrc={oreonSpecs} />

      {/* Wave */}
      <OceanWaveDivider
        backColor="#0F1F4F"
        midColor="#1A3FB8"
        frontColor="#0a2d6e"
        variant="a"
      />

      {/* Business Model Section */}
      <BusinessModelSection />

      {/* Wave */}
      <OceanWaveDivider
        backColor="#0a2d6e"
        midColor="#1A3FB8"
        frontColor="#1A3FB8"
        variant="b"
      />

      {/* THE OREON MODEL */}
      <OreonModelSection />

      {/* Wave */}
      <OceanWaveDivider
        backColor="#1A3FB8"
        midColor="#1A3FB8"
        frontColor="#ffffff"
        variant="a"
      />

      {/* Features */}
      <section id="features" className="py-28 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "#1E4D8C" }}>
            Features
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#0F172A" }}>
            Cutting-edge technology on your wrist
          </h2>
          <p className="text-base mb-16 max-w-[600px]" style={{ color: "#64748B" }}>
            Oreon combines next-generation biomedical sensors and artificial intelligence for uncompromising health tracking
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
            How it works
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-16" style={{ color: "#0F172A" }}>
            Three steps to get started
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


      {/* FAQ */}
      <section className="py-28 bg-white">
        <div className="max-w-[800px] mx-auto px-6 lg:px-12">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "#1E4D8C" }}>
            Frequently asked questions
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-16" style={{ color: "#0F172A" }}>
            Everything about Oreon
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
            Ready to turn your data into intelligence
          </h2>
          <p className="text-lg text-white/65 mb-10 max-w-[500px] mx-auto">
            Pre-order your Oreon bracelet from 3,99 € and unlock AETHER when the platform opens
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center h-14 px-10 text-[13px] font-bold tracking-[0.1em] uppercase text-[#1E4D8C] bg-white transition-all hover:bg-white/90"
          >
            Order my Oreon
          </a>
        </div>
      </section>
    </div>
  );
}
