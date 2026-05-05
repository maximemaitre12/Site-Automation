import { useEffect, useRef, useState } from "react";
import { Fingerprint, HeartPulse, Workflow, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "Tap to act",
    desc: "One tap triggers a personalized AI flow. No app to open.",
  },
  {
    icon: HeartPulse,
    title: "Biometric intelligence",
    desc: "Your phone reads heart rate, stress, breath in 30 seconds.",
  },
  {
    icon: Workflow,
    title: "AETHER automations",
    desc: "Music, lights, messages, focus mode — adapted to how you feel.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy by design",
    desc: "Captured only on your terms. End-to-end encrypted. EU-hosted.",
  },
];

/* ─── Frame loader (same logic as ScrollVideoPlayer) ─── */
const FRAME_NUMBERS = [
  ...Array.from({ length: 242 }, (_, i) => i + 1),
  ...Array.from({ length: 25 }, (_, i) => i + 274),
];
const TOTAL_FRAMES = FRAME_NUMBERS.length;
const LOGO_FRAME = 55;
const INITIAL_FRAME = 205;

function getFrameSrc(index: number): string {
  return `/bracelet-frames/frame-${String(index).padStart(3, "0")}.jpg`;
}

export default function BraceletShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const lastFrameRef = useRef(-1);
  const [visible, setVisible] = useState(false);

  /* Preload frames */
  useEffect(() => {
    let mounted = true;
    const images: HTMLImageElement[] = [];
    let count = 0;
    for (const frameNumber of FRAME_NUMBERS) {
      const img = new Image();
      img.src = getFrameSrc(frameNumber);
      img.onload = () => {
        count++;
        if (count === TOTAL_FRAMES && mounted) {
          imagesRef.current = images;
          setLoaded(true);
          drawFrameByIndex(FRAME_NUMBERS.indexOf(INITIAL_FRAME));
        }
      };
      images.push(img);
    }
    return () => { mounted = false; };
  }, []);

  const drawFrameByIndex = (idx: number) => {
    if (idx === lastFrameRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[idx];
    if (!canvas || !ctx || !img) return;
    if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
    if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    lastFrameRef.current = idx;
  };

  /* Scroll-driven rotation */
  useEffect(() => {
    if (!loaded) return;
    const LOGO_INDEX = FRAME_NUMBERS.indexOf(LOGO_FRAME);
    const START_INDEX = FRAME_NUMBERS.indexOf(INITIAL_FRAME);
    const forwardDist = ((LOGO_INDEX - START_INDEX) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES;
    const backwardDist = TOTAL_FRAMES - forwardDist;
    const direction = forwardDist <= backwardDist ? -1 : 1;
    const travelFrames = Math.min(forwardDist, backwardDist);

    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const container = sectionRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const viewH = window.innerHeight;
        const earlyStart = viewH * 0.5;
        const stickyTravel = Math.max(1, rect.height - viewH + earlyStart);
        const progress = Math.max(0, Math.min(1, (earlyStart - rect.top) / stickyTravel));
        const rotateProgress = Math.min(1, progress * 1.4);
        const frameOffset = Math.round(rotateProgress * travelFrames) * direction;
        const frameIndex = ((START_INDEX + frameOffset) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES;
        drawFrameByIndex(frameIndex);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, [loaded]);

  /* Intersection observer for fade-in */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>

      <div
        ref={sectionRef}
        className="relative"
        style={{ height: "110vh", background: "radial-gradient(ellipse 80% 60% at 75% 50%, #0e3a8a 0%, #0a2d6e 45%, #071e52 100%)" }}
      >
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="w-full max-w-[1440px] mx-auto px-8 md:px-12 lg:px-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-0">

            {/* ─── Left column: text ─── */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center py-12 lg:py-0">
              {/* Eyebrow */}
              <span
                className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-6"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
              >
                Why Oreon
              </span>

              {/* Headline */}
              <h2
                className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-medium leading-[1.1] tracking-[-0.02em] text-white mb-5"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
                }}
              >
                One tap.<br />Infinite possibilities.
              </h2>

              {/* Subtitle */}
              <p
                className="text-[15px] leading-[1.7] max-w-[380px] mb-10"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
                }}
              >
                Your biometric data, transformed into intelligent automations — without ever leaving your wrist.
              </p>

              {/* Feature rows */}
              <div className="flex flex-col gap-5 mb-10">
                {features.map((f, i) => (
                  <div
                    key={f.title}
                    className="group flex items-start gap-4 cursor-default"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(16px)",
                      transition: `opacity 0.5s ease ${0.3 + i * 0.1}s, transform 0.5s ease ${0.3 + i * 0.1}s`,
                    }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <f.icon
                        className="w-[22px] h-[22px] transition-all duration-300 group-hover:drop-shadow-[0_0_6px_rgba(168,221,255,0.6)]"
                        style={{ color: "#A8DDFF" }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-white transition-colors duration-300 group-hover:text-white/95">
                        {f.title}
                      </p>
                      <p className="text-[13px] leading-relaxed transition-colors duration-300" style={{ color: "rgba(255,255,255,0.55)" }}>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider + link */}
              <div
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 0.5s ease 0.7s, transform 0.5s ease 0.7s",
                }}
              >
                <div className="w-[120px] h-px mb-5" style={{ background: "rgba(255,255,255,0.12)" }} />
                <a
                  href="#features"
                  className="group/link inline-flex items-center gap-2 text-[13px] font-medium text-white/70 hover:text-white transition-colors duration-300"
                >
                  See all features
                  <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                </a>
              </div>
            </div>

            {/* ─── Right column: 3D bracelet ─── */}
            <div className="w-full lg:w-[55%] flex items-center justify-center lg:justify-end relative">
              {/* Ambient cyan glow */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: "70%",
                  paddingBottom: "70%",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "radial-gradient(circle, rgba(168,221,255,0.08) 0%, transparent 70%)",
                  animation: "pulse 4s ease-in-out infinite",
                }}
              />

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 3 + (i % 3),
                    height: 3 + (i % 3),
                    background: `rgba(168,221,255,${0.15 + (i % 3) * 0.05})`,
                    top: `${20 + i * 12}%`,
                    left: `${30 + (i * 7) % 40}%`,
                    animation: `float-particle-${i} ${6 + i * 1.5}s ease-in-out infinite`,
                  }}
                />
              ))}

              <canvas
                ref={canvasRef}
                className="relative z-10 w-full max-w-[520px] max-h-[70vh] object-contain"
                style={{
                  opacity: loaded ? 1 : 0,
                  transition: "opacity 0.6s",
                  borderRadius: "50%",
                  filter: "drop-shadow(0 0 40px rgba(168,221,255,0.06))",
                }}
              />

              {/* Reflection */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[30%] z-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center top, rgba(168,221,255,0.04) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* No bottom gradient — transition zone handles continuity */}

      {/* Particle keyframes */}
      <style>{`
        @keyframes float-particle-0 { 0%,100% { transform: translate(0,0); opacity: 0.3; } 50% { transform: translate(12px,-18px); opacity: 0.6; } }
        @keyframes float-particle-1 { 0%,100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(-10px,14px); opacity: 0.5; } }
        @keyframes float-particle-2 { 0%,100% { transform: translate(0,0); opacity: 0.25; } 50% { transform: translate(8px,20px); opacity: 0.55; } }
        @keyframes float-particle-3 { 0%,100% { transform: translate(0,0); opacity: 0.3; } 50% { transform: translate(-15px,-12px); opacity: 0.5; } }
        @keyframes float-particle-4 { 0%,100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(18px,10px); opacity: 0.45; } }
        @keyframes float-particle-5 { 0%,100% { transform: translate(0,0); opacity: 0.15; } 50% { transform: translate(-8px,-22px); opacity: 0.4; } }
      `}</style>
    </>
  );
}
