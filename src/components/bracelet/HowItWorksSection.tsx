import { motion } from "framer-motion";
import { Fingerprint, Smartphone, Brain, Network } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const steps = [
  {
    num: "01",
    icon: Fingerprint,
    title: "You tap your bracelet",
    text: "A simple tap on your wrist wakes your phone and signals your intention — no app to open, no decision to make.",
  },
  {
    num: "02",
    icon: Smartphone,
    title: "Your phone captures",
    text: "The phone reads your heart rate, HRV, breath and stress in 30 seconds via its camera, microphone and motion sensors.",
  },
  {
    num: "03",
    icon: Brain,
    title: "AETHER analyzes",
    text: "Our AI platform interprets your biometric signals in context — your time, location, calendar, recent moments — to decide what should happen next.",
    isAether: true,
  },
  {
    num: "04",
    icon: Network,
    title: "The world responds",
    text: "Music shifts, lights dim, focus mode activates, a message is sent — your environment adapts to how you feel, not just to what you click.",
  },
];

function GlassCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[20px] ${className}`}
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ConnectorDot({ direction = "horizontal" }: { direction?: "horizontal" | "vertical" }) {
  const isH = direction === "horizontal";
  return (
    <div
      className={`absolute ${isH ? "top-1/2 left-0 w-full h-[1px] -translate-y-1/2" : "left-1/2 top-0 h-full w-[1px] -translate-x-1/2"}`}
      style={{
        backgroundImage: isH
          ? "repeating-linear-gradient(90deg, rgba(111,224,245,0.4) 0, rgba(111,224,245,0.4) 6px, transparent 6px, transparent 12px)"
          : "repeating-linear-gradient(180deg, rgba(111,224,245,0.4) 0, rgba(111,224,245,0.4) 6px, transparent 6px, transparent 12px)",
        animation: "connector-pulse 4s ease-in-out infinite",
      }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 5,
          height: 5,
          background: "#6FE0F5",
          boxShadow: "0 0 8px rgba(111,224,245,0.6)",
          ...(isH ? { top: -2 } : { left: -2 }),
        }}
        animate={isH ? { left: ["0%", "100%"] } : { top: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 20%, rgba(14,165,233,0.06) 0%, #0F1F4F 50%, #0F1F4F 100%)",
      }}
    >
      {/* Ambient particles */}
      {Array.from({ length: 12 }).map((_, i) => (
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
          animate={{ y: [0, -60 - Math.random() * 80], opacity: [0.15, 0] }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 py-24 md:py-32">
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase mb-6"
              style={{
                background: "rgba(14,165,233,0.08)",
                border: "1px solid rgba(14,165,233,0.3)",
                color: "#0EA5E9",
              }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#0EA5E9" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              HOW IT WORKS
            </span>
          </motion.div>

          <motion.h2
            className="font-heading text-[28px] md:text-[36px] font-semibold text-white leading-tight mb-5"
            style={{ letterSpacing: "-0.02em" }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            The bracelet is the trigger. AETHER is the intelligence.
          </motion.h2>

          <motion.p
            className="text-white/75 mx-auto leading-relaxed mb-6"
            style={{ fontSize: 16, maxWidth: 680, lineHeight: 1.55 }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            Without the AETHER platform, your Oreon bracelet remains a beautiful, durable object — but it has no intelligence. Here is how the two work together to turn a tap on your wrist into a real-world action.
          </motion.p>

          <div
            className="mx-auto"
            style={{
              width: 80,
              height: 1.5,
              background: "linear-gradient(90deg, transparent, #0EA5E9, transparent)",
            }}
          />
        </div>

        {/* 4 STEP CARDS */}
        <div className="relative">
          {/* Desktop horizontal connector */}
          <div className="hidden lg:block absolute top-1/2 left-[12.5%] right-[12.5%] -translate-y-1/2 z-0">
            <ConnectorDot direction="horizontal" />
          </div>

          {/* Mobile vertical connector */}
          <div className="block lg:hidden absolute left-1/2 top-[60px] bottom-[60px] -translate-x-1/2 z-0">
            <ConnectorDot direction="vertical" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i + 3}
                  className="group"
                >
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
                  >
                    <GlassCard
                      className="p-6 h-full transition-all duration-300 group-hover:-translate-y-1"
                      style={{
                        ...(step.isAether
                          ? {
                              border: "1.5px solid rgba(14,165,233,0.35)",
                              boxShadow:
                                "0 0 40px rgba(14,165,233,0.1), 0 4px 30px rgba(0,0,0,0.12)",
                            }
                          : {}),
                      }}
                    >
                      {/* Number + AETHER badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="italic"
                          style={{
                            fontFamily: "'EB Garamond', Georgia, serif",
                            fontSize: 24,
                            color: "#6FE0F5",
                            textShadow: "0 0 12px rgba(111,224,245,0.3)",
                          }}
                        >
                          {step.num}
                        </span>
                        {step.isAether && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[8px] font-bold tracking-[0.15em] uppercase"
                            style={{
                              background: "rgba(14,165,233,0.15)",
                              border: "1px solid rgba(14,165,233,0.35)",
                              color: "#0EA5E9",
                            }}
                          >
                            AETHER
                          </span>
                        )}
                      </div>

                      {/* Icon */}
                      <div className="relative mb-4 w-fit">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            width: 40,
                            height: 40,
                            background: "radial-gradient(circle, rgba(111,224,245,0.3) 0%, transparent 70%)",
                            top: -6,
                            left: -6,
                          }}
                        />
                        <Icon
                          className="relative transition-transform duration-200 group-hover:scale-110"
                          style={{ width: 28, height: 28, color: "#6FE0F5" }}
                        />
                      </div>

                      {/* Title */}
                      <h4
                        className="text-white font-semibold mb-2"
                        style={{ fontSize: 18 }}
                      >
                        {step.title}
                      </h4>

                      {/* Text */}
                      <p
                        className="leading-snug"
                        style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.5 }}
                      >
                        {step.text}
                      </p>
                    </GlassCard>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* KEY-TAKEAWAY STRIP */}
        <motion.div
          className="mt-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={8}
        >
          <div
            className="rounded-xl px-8 py-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderLeft: "4px solid #0EA5E9",
              backdropFilter: "blur(16px)",
            }}
          >
            <p
              className="text-center italic"
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontSize: 16,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Steps 1 and 2 happen on your wrist and in your hand. Steps 3 and 4 only happen with an active AETHER subscription.
            </p>
          </div>
        </motion.div>

        {/* FREEDOM-OF-CHOICE FOOTER */}
        <motion.p
          className="text-center italic mt-8"
          style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={9}
        >
          Pre-ordering the bracelet does not create any subscription. AETHER will be proposed to you by email after June 1st 2026 — you remain free to accept or decline.
        </motion.p>
      </div>

      <style>{`
        @keyframes connector-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}
