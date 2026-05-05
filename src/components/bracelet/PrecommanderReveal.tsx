import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { X } from "lucide-react";

/* ═══════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════ */

interface Plan {
  name: string;
  key: string;
  price: string;
  popular?: boolean;
  features: string[];
}

interface Props {
  plans: Plan[];
  onCardPayment: (planKey: string) => void;
  loadingPlan: string | null;
}

/* ═══════════════════════════════════════════
   SVG GOO FILTER
   ═══════════════════════════════════════════ */
const GooFilter = () => (
  <svg style={{ position: "absolute", width: 0, height: 0 }}>
    <defs>
      <filter id="goo-morph">
        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
);

/* ═══════════════════════════════════════════
   SPARKLE PARTICLE BURST (Canvas)
   ═══════════════════════════════════════════ */
function useSparkles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const burst = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string; life: number;
    }> = [];
    
    const colors = ["#ffffff", "#A8DDFF", "#7BC8FF", "#c4e4ff", "#ffffff"];
    
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.8;
      const speed = 3 + Math.random() * 6;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2.5,
        opacity: 0.8 + Math.random() * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }
    
    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= 0.018;
        p.opacity = p.life * 0.9;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * 0.15;
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;
      if (alive) frame = requestAnimationFrame(animate);
    };
    
    frame = requestAnimationFrame(animate);
    setTimeout(() => cancelAnimationFrame(frame), 1200);
  }, []);
  
  return { canvasRef, burst };
}

/* ═══════════════════════════════════════════
   SHOCKWAVE RING
   ═══════════════════════════════════════════ */
const Shockwave = ({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) => (
  <motion.div
    className="fixed pointer-events-none z-[9999]"
    style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    initial={{ width: 0, height: 0, opacity: 0.7 }}
    animate={{ width: 800, height: 800, opacity: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    <div
      className="w-full h-full rounded-full"
      style={{
        background: "radial-gradient(circle, transparent 60%, rgba(168,221,255,0.3) 70%, transparent 80%)",
      }}
    />
  </motion.div>
);


/* ═══════════════════════════════════════════
   MODAL AMBIENT PARTICLES (subtle shimmer)
   ═══════════════════════════════════════════ */
const ModalAmbientParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[28px]">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          width: 80 + i * 30,
          height: 80 + i * 30,
          background: `radial-gradient(circle, rgba(111,224,245,${0.04 + (i % 3) * 0.015}) 0%, transparent 70%)`,
          left: `${10 + (i * 22) % 70}%`,
          top: `${15 + (i * 19) % 60}%`,
          animation: `modal-particle-${i} ${14 + i * 3}s ease-in-out infinite`,
        }}
      />
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   MAGNETIC BUTTON
   ═══════════════════════════════════════════ */
const MagneticButton = ({ onClick, children }: { onClick: (e: React.MouseEvent) => void; children: React.ReactNode }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const [hovered, setHovered] = useState(false);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 100) {
      const factor = (1 - dist / 100) * 8;
      x.set(dx * factor / dist * (dist > 0 ? 1 : 0));
      y.set(dy * factor / dist * (dist > 0 ? 1 : 0));
    } else {
      x.set(0);
      y.set(0);
    }
  }, [x, y]);
  
  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setHovered(false);
  }, [x, y]);
  
  return (
    <motion.button
      ref={ref}
      layoutId="precommander-portal"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative inline-flex items-center justify-center h-10 px-6 text-[10px] font-bold tracking-[0.15em] uppercase overflow-hidden cursor-pointer border-0"
      style={{
        x: springX,
        y: springY,
        background: "white",
        color: "#0a1e46",
        borderRadius: 0,
      }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
          animation: hovered ? "shimmer-sweep 2s ease-in-out infinite" : "shimmer-sweep 4s ease-in-out infinite",
        }}
      />
      {hovered && (
        <motion.div
          className="absolute -inset-2 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "radial-gradient(ellipse, rgba(168,221,255,0.15) 0%, transparent 70%)",
            animation: "aura-breathe 2s ease-in-out infinite",
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function PrecommanderReveal({ plans, onCardPayment, loadingPlan }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [showShockwave, setShowShockwave] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const { canvasRef, burst } = useSparkles();
  
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);
  
  const handleClick = (e: React.MouseEvent) => {
    const pos = { x: e.clientX, y: e.clientY };
    setClickPos(pos);
    
    if (!prefersReduced) {
      burst(pos.x, pos.y);
      setShowShockwave(true);
      setTimeout(() => setShowShockwave(false), 800);
    }
    
    setTimeout(() => setIsOpen(true), prefersReduced ? 0 : 80);
  };
  

  return (
    <>
      <GooFilter />
      
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[100000]"
        style={{ width: "100vw", height: "100vh" }}
      />
      
      <AnimatePresence>
        {showShockwave && (
          <>
            <Shockwave x={clickPos.x} y={clickPos.y} delay={0} />
            <Shockwave x={clickPos.x} y={clickPos.y} delay={0.08} />
          </>
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {!isOpen && (
          <MagneticButton onClick={handleClick}>
            Réserver ma place
          </MagneticButton>
        )}
      </AnimatePresence>
      
      {/* THE MODAL OVERLAY — rendered via portal to escape stacking contexts */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0"
                style={{
                  zIndex: 99998,
                  background: "rgba(5, 12, 35, 0.72)",
                  backdropFilter: "blur(28px) saturate(1.2)",
                  WebkitBackdropFilter: "blur(28px) saturate(1.2)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                onClick={() => setIsOpen(false)}
              >
                <div className="absolute inset-0" style={{
                  background: "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(111,224,245,0.08) 0%, transparent 70%)"
                }} />
              </motion.div>
              
              {/* Modal */}
              <div
                className="fixed inset-0 flex items-center justify-center pointer-events-none"
                style={{ zIndex: 99999, padding: 24 }}
              >
                <motion.div
                  layoutId="precommander-portal"
                  className="relative w-full pointer-events-auto"
                  style={{
                    maxWidth: 1080,
                    maxHeight: "92vh",
                    overflowY: "auto",
                    overflowX: "hidden",
                    background: "#FAFBFE",
                    border: "1px solid rgba(26,63,184,0.08)",
                    borderRadius: 28,
                    boxShadow: `
                      0 1px 2px rgba(15,30,80,0.06),
                      0 16px 32px rgba(15,30,80,0.12),
                      0 48px 96px rgba(15,30,80,0.24),
                      inset 0 0 0 1px rgba(255,255,255,0.6)
                    `,
                  }}
                  initial={prefersReduced ? { opacity: 0, scale: 0.95 } : undefined}
                  animate={prefersReduced ? { opacity: 1, scale: 1 } : undefined}
                  exit={prefersReduced ? { opacity: 0, scale: 0.95 } : undefined}
                  transition={{ type: "spring", stiffness: 220, damping: 26, mass: 1.1 }}
                >
                  {/* Top cyan glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none" style={{
                    background: "radial-gradient(ellipse at center top, rgba(111,224,245,0.10) 0%, transparent 70%)",
                    borderRadius: "28px 28px 0 0",
                  }} />

                  {!prefersReduced && <ModalAmbientParticles />}
                  
                  {/* Close button */}
                  <motion.button
                    className="absolute top-5 right-5 z-50 w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                    style={{ background: "rgba(10,28,74,0.06)" }}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                    whileHover={{ scale: 1.1, background: "rgba(10,28,74,0.12)" }}
                  >
                    <X className="w-4 h-4" style={{ color: "#5A6478" }} />
                  </motion.button>
                  
                  {/* Content */}
                  <div className="p-6 md:p-14 relative z-10">
                    <div className="text-center mb-8">
                      <motion.div
                        className="inline-flex items-center gap-2 rounded-full mb-5"
                        style={{
                          background: "linear-gradient(135deg, rgba(26,63,184,0.08), rgba(11,165,199,0.08))",
                          border: "1px solid rgba(26,63,184,0.15)",
                          padding: "6px 16px",
                        }}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <span
                          className="w-[6px] h-[6px] rounded-full"
                          style={{ background: "#6FE0F5", animation: "badge-pulse 2.5s ease-in-out infinite" }}
                        />
                        <span style={{ color: "#1A3FB8", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                          Lancement officiel
                        </span>
                      </motion.div>
                      
                      <motion.h2
                        className="font-heading text-[32px] sm:text-[42px] font-bold mb-2"
                        style={{ color: "#0A1C4A", letterSpacing: "-0.02em", lineHeight: 1.1 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      >
                        1er Juin 2026
                      </motion.h2>
                      
                      <motion.p
                        className="text-[18px] font-medium mb-2"
                        style={{ color: "#1A3FB8" }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Soyez parmi les 1000 premiers
                      </motion.p>
                      
                      <motion.p
                        className="text-[14px] max-w-[480px] mx-auto"
                        style={{ color: "#5A6478", lineHeight: 1.55 }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                      >
                        Premier mois offert · Bracelet livré dès lancement · Tarif early-bird verrouillé à vie
                      </motion.p>
                    </div>
                    
                    {/* Pricing cards */}
                    <motion.div
                      className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="p-6 rounded-2xl border text-center" style={{ borderColor: "#E5E8F0", minWidth: 200, background: "#fff" }}>
                        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#64748B" }}>SEPA</p>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="font-heading text-[40px] font-bold" style={{ color: "#1A3FB8" }}>19€</span>
                          <span className="text-sm" style={{ color: "#64748B" }}>/mois</span>
                        </div>
                        <p className="text-sm mt-1 line-through" style={{ color: "#94A3B8" }}>21,25€</p>
                      </div>
                      <span className="text-sm font-medium" style={{ color: "#94A3B8" }}>ou</span>
                      <div className="p-6 rounded-2xl border-2 text-center" style={{ borderColor: "#1A3FB8", minWidth: 200, background: "#fff" }}>
                        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#64748B" }}>Carte bancaire</p>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="font-heading text-[40px] font-bold" style={{ color: "#1A3FB8" }}>22€</span>
                          <span className="text-sm" style={{ color: "#64748B" }}>/mois</span>
                        </div>
                        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>au lieu de <span className="line-through">25€</span></p>
                      </div>
                    </motion.div>

                    {/* Progress bar */}
                    <motion.div
                      className="max-w-[400px] mx-auto mb-8"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold" style={{ color: "#0A1C4A" }}>812 places réservées sur 1000</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "#E5E8F0" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "linear-gradient(90deg, #1A3FB8, #0BA5C7)" }}
                          initial={{ width: 0 }}
                          animate={{ width: "81.2%" }}
                          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <p className="text-xs mt-3 font-medium text-center" style={{ color: "#F59E0B" }}>
                        Bientôt disponible
                      </p>
                    </motion.div>

                    {/* Disabled CTA */}
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.65 }}
                    >
                      <button
                        disabled
                        className="px-10 py-4 text-sm font-semibold tracking-wide uppercase rounded-xl opacity-50 cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg, #1A3FB8, #2451D9)", color: "#fff" }}
                      >
                        Réserver ma place
                      </button>
                      <p className="text-[11px] mt-3" style={{ color: "#94A3B8" }}>
                        Les réservations ouvriront prochainement
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
      
      {/* GLOBAL ANIMATION STYLES */}
      <style>{`
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes aura-breathe {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes aurora-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(3%, -2%) scale(1.02); }
          50% { transform: translate(-2%, 3%) scale(0.98); }
          75% { transform: translate(2%, 1%) scale(1.01); }
        }
        @keyframes badge-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes caustic-shift {
          from { transform: translate(0, 0); }
          to { transform: translate(30px, 30px); }
        }
        ${[0,1,2,3].map(i => `
          @keyframes right-card-bubble-${i} {
            0%, 100% { transform: translateY(0); opacity: 0.15; }
            50% { transform: translateY(-${12 + i * 4}px); opacity: 0.35; }
          }
        `).join("")}
        ${[0,1,2,3,4].map(i => `
          @keyframes modal-particle-${i} {
            0%, 100% { transform: translate(0, 0); opacity: ${0.03 + i * 0.01}; }
            33% { transform: translate(${8 - i * 3}px, ${-6 + i * 2}px); opacity: ${0.05 + i * 0.01}; }
            66% { transform: translate(${-5 + i * 2}px, ${8 - i * 2}px); opacity: ${0.04 + i * 0.01}; }
          }
        `).join("")}
      `}</style>
    </>
  );
}
