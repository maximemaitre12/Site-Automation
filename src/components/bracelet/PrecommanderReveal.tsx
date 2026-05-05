import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Check, CreditCard, QrCode, X, Loader2 } from "lucide-react";

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
        
        // Glow
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
   ANIMATED PRICE COUNTER
   ═══════════════════════════════════════════ */
const PriceCounter = ({ target, delay }: { target: string; delay: number }) => {
  const [display, setDisplay] = useState("0,00");
  const [started, setStarted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  useEffect(() => {
    if (!started) return;
    const [intPart, decPart] = target.split(",");
    const targetVal = parseFloat(`${intPart}.${decPart}`);
    const duration = 500;
    const startTime = performance.now();
    
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = targetVal * eased;
      const formatted = current.toFixed(2).replace(".", ",");
      setDisplay(formatted);
      if (progress < 1) requestAnimationFrame(tick);
    };
    
    requestAnimationFrame(tick);
  }, [started, target]);
  
  return <>{display}</>;
};

/* ═══════════════════════════════════════════
   AMBIENT FLOATING PARTICLES (CSS)
   ═══════════════════════════════════════════ */
const AmbientParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          width: 1.5 + (i % 4) * 0.8,
          height: 1.5 + (i % 4) * 0.8,
          background: `rgba(168,221,255,${0.15 + (i % 5) * 0.06})`,
          left: `${(i * 17.3) % 100}%`,
          top: `${(i * 23.7) % 100}%`,
          animation: `ambient-float-${i % 8} ${12 + (i % 6) * 3}s ease-in-out infinite`,
          animationDelay: `${(i * 0.7) % 6}s`,
        }}
      />
    ))}
  </div>
);

/* ═══════════════════════════════════════════
   AURORA GRADIENT BACKGROUND
   ═══════════════════════════════════════════ */
const AuroraBackground = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.4 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="absolute inset-0" style={{
      background: `
        radial-gradient(ellipse 120% 80% at 20% 30%, rgba(30,77,140,0.4) 0%, transparent 60%),
        radial-gradient(ellipse 100% 60% at 80% 70%, rgba(100,180,255,0.15) 0%, transparent 50%),
        radial-gradient(ellipse 80% 90% at 50% 50%, rgba(80,40,180,0.08) 0%, transparent 60%)
      `,
      animation: "aurora-drift 20s ease-in-out infinite",
    }} />
    <AmbientParticles />
  </motion.div>
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
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
          animation: hovered ? "shimmer-sweep 2s ease-in-out infinite" : "shimmer-sweep 4s ease-in-out infinite",
          animationDelay: "0s",
        }}
      />
      
      {/* Cyan aura on hover */}
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
      
      {/* Rotating conic border */}
      <div
        className="absolute -inset-[1px] pointer-events-none"
        style={{
          background: "conic-gradient(from var(--conic-angle, 0deg), transparent, rgba(168,221,255,0.3), transparent, rgba(168,221,255,0.15), transparent)",
          animation: "conic-rotate 20s linear infinite",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

/* ═══════════════════════════════════════════
   FEATURE ROW WITH ANIMATION
   ═══════════════════════════════════════════ */
const FeatureRow = ({ text, delay }: { text: string; delay: number }) => (
  <motion.li
    className="flex items-start gap-3 text-sm"
    style={{ color: "#334155" }}
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.3, ease: "easeOut" }}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.3, 1] }}
      transition={{ delay, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#1E4D8C" }} />
    </motion.div>
    {text}
  </motion.li>
);

/* ═══════════════════════════════════════════
   PRICING CARD
   ═══════════════════════════════════════════ */
const PricingCard = ({ plan, index, onCardPayment, loadingPlan }: {
  plan: Plan; index: number; onCardPayment: (key: string) => void; loadingPlan: string | null;
}) => {
  const [hovered, setHovered] = useState(false);
  const isLeft = index === 0;
  const baseDelay = isLeft ? 0.45 : 0.58;

  return (
    <motion.div
      className="relative p-10 rounded-sm overflow-hidden"
      style={{
        borderColor: plan.popular ? "#1E4D8C" : "#E2E8F0",
        borderWidth: plan.popular ? 2 : 1,
        borderStyle: "solid",
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(40px)",
      }}
      initial={{ opacity: 0, x: isLeft ? -40 : 40, scale: 0.94 }}
      animate={{
        opacity: hovered ? 1 : 1,
        x: 0,
        scale: hovered ? 1.02 : 1,
        y: hovered ? -6 : 0,
      }}
      transition={{
        type: "spring", stiffness: 220, damping: 26, mass: 1.1,
        delay: baseDelay,
        y: { type: "spring", stiffness: 300, damping: 20, delay: 0 },
        scale: { type: "spring", stiffness: 300, damping: 20, delay: 0 },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover rim glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-sm"
        style={{
          boxShadow: hovered
            ? "inset 0 0 0 1px rgba(168,221,255,0.3), 0 0 30px rgba(168,221,255,0.1)"
            : "none",
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Recommandé badge */}
      {plan.popular && (
        <motion.span
          className="absolute -top-3 left-10 px-4 py-1 text-xs font-semibold text-white tracking-wider uppercase"
          style={{ background: "#1E4D8C" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: baseDelay + 0.2, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
          Recommandé
        </motion.span>
      )}
      
      {/* Rotating border for popular card */}
      {plan.popular && (
        <div
          className="absolute -inset-[2px] pointer-events-none"
          style={{
            background: "conic-gradient(from var(--conic-angle, 0deg), transparent 40%, rgba(30,77,140,0.3) 50%, transparent 60%)",
            animation: "conic-rotate 10s linear infinite",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "2px",
            borderRadius: "2px",
          }}
        />
      )}

      <motion.h3
        className="font-heading text-2xl font-bold mb-2"
        style={{ color: "#0F172A" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: baseDelay + 0.1, duration: 0.4 }}
      >
        {plan.name}
      </motion.h3>
      
      <motion.div
        className="flex items-baseline gap-1 mb-1"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: baseDelay + 0.15, duration: 0.4 }}
      >
        <span className="font-heading text-4xl font-bold" style={{ color: "#1E4D8C" }}>
          <PriceCounter target={plan.price} delay={(baseDelay + 0.2) * 1000} />€
        </span>
        <span className="text-sm" style={{ color: "#64748B" }}>paiement unique</span>
      </motion.div>
      
      <motion.p
        className="text-xs mb-8"
        style={{ color: "#94A3B8" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: baseDelay + 0.2, duration: 0.3 }}
      >
        Bracelet offert · Paiement en une seule fois
      </motion.p>
      
      <ul className="space-y-3 mb-10">
        {plan.features.map((f, i) => (
          <FeatureRow key={f} text={f} delay={baseDelay + 0.25 + i * 0.06} />
        ))}
      </ul>

      {/* Payment buttons */}
      <div className="space-y-3">
        <motion.button
          onClick={() => onCardPayment(plan.key)}
          disabled={loadingPlan === plan.key}
          className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold tracking-wide uppercase transition-all disabled:opacity-60 relative overflow-hidden"
          style={{
            background: plan.popular ? "#1E4D8C" : "transparent",
            color: plan.popular ? "#fff" : "#1E4D8C",
            border: plan.popular ? "none" : "1px solid #1E4D8C",
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: baseDelay + 0.5, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Button shimmer on hover */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 35%, ${plan.popular ? 'rgba(255,255,255,0.15)' : 'rgba(30,77,140,0.08)'} 50%, transparent 65%)`,
              animation: "shimmer-sweep 3s ease-in-out infinite",
            }}
          />
          {loadingPlan === plan.key ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4" />
          )}
          <span className="relative z-10">Payer par carte</span>
        </motion.button>
        
        <motion.a
          href="#qrcode"
          className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold tracking-wide uppercase transition-all relative overflow-hidden"
          style={{
            background: plan.popular ? "transparent" : "#1E4D8C",
            color: plan.popular ? "#1E4D8C" : "#fff",
            border: plan.popular ? "1px solid #1E4D8C" : "none",
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: baseDelay + 0.55, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          whileHover={{ scale: 1.02 }}
        >
          <QrCode className="w-4 h-4" />
          <span className="relative z-10">Prélèvement SEPA</span>
        </motion.a>
      </div>

      <motion.p
        className="text-xs text-center mt-4"
        style={{ color: "#94A3B8" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: baseDelay + 0.65, duration: 0.3 }}
      >
        Paiement unique · Bracelet offert · Satisfait ou remboursé
      </motion.p>
    </motion.div>
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
  
  // Lock body scroll
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
  
  // Escape key
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
    
    // Small delay for the punch animation
    setTimeout(() => setIsOpen(true), prefersReduced ? 0 : 80);
  };
  
  return (
    <>
      <GooFilter />
      
      {/* Sparkle canvas — always mounted, full viewport */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[10000]"
        style={{ width: "100vw", height: "100vh" }}
      />
      
      {/* Shockwave rings */}
      <AnimatePresence>
        {showShockwave && (
          <>
            <Shockwave x={clickPos.x} y={clickPos.y} delay={0} />
            <Shockwave x={clickPos.x} y={clickPos.y} delay={0.08} />
          </>
        )}
      </AnimatePresence>
      
      {/* THE BUTTON — only visible when modal is closed */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <MagneticButton onClick={handleClick}>
            Précommander
          </MagneticButton>
        )}
      </AnimatePresence>
      
      {/* THE MODAL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[9990]"
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: prefersReduced ? 0.2 : 0.4 }}
              onClick={() => setIsOpen(false)}
              style={{ background: "rgba(0,0,0,0.65)" }}
            >
              {/* Vignette */}
              <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)"
              }} />
            </motion.div>
            
            {/* Aurora + particles */}
            {!prefersReduced && (
              <div className="fixed inset-0 z-[9991] pointer-events-none">
                <AuroraBackground />
              </div>
            )}
            
            {/* Modal */}
            <div className="fixed inset-0 z-[9995] flex items-center justify-center pointer-events-none px-4">
              <motion.div
                layoutId="precommander-portal"
                className="relative w-full max-w-[960px] max-h-[90vh] overflow-y-auto pointer-events-auto"
                style={{
                  background: "rgba(255,255,255,0.94)",
                  backdropFilter: "blur(40px)",
                  borderRadius: 20,
                  boxShadow: "0 40px 120px -20px rgba(0,0,0,0.5), 0 0 60px rgba(168,221,255,0.08)",
                }}
                initial={prefersReduced ? { opacity: 0, scale: 0.95 } : undefined}
                animate={prefersReduced ? { opacity: 1, scale: 1 } : undefined}
                exit={prefersReduced ? { opacity: 0, scale: 0.95 } : undefined}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 26,
                  mass: 1.1,
                }}
              >
                {/* Internal cyan light sweep */}
                {!prefersReduced && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none rounded-[20px] overflow-hidden"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "radial-gradient(circle at var(--light-x, 50%) var(--light-y, 50%), rgba(168,221,255,0.08) 0%, transparent 60%)",
                      }}
                      initial={{ "--light-x": "30%", "--light-y": "80%" } as any}
                      animate={{ "--light-x": "70%", "--light-y": "20%" } as any}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </motion.div>
                )}
                
                {/* Close button */}
                <motion.button
                  className="absolute top-5 right-5 z-50 w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                  style={{ background: "rgba(0,0,0,0.05)" }}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.1, background: "rgba(0,0,0,0.1)" }}
                >
                  <X className="w-4 h-4" style={{ color: "#64748B" }} />
                </motion.button>
                
                {/* Content */}
                <div className="p-8 md:p-12">
                  {/* Title */}
                  <div className="text-center mb-10">
                    <motion.p
                      className="text-xs font-semibold tracking-[0.3em] uppercase mb-4"
                      style={{ color: "#1E4D8C" }}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      Tarifs
                    </motion.p>
                    
                    <motion.h2
                      className="font-heading text-2xl sm:text-3xl font-bold mb-3"
                      style={{ color: "#0F172A" }}
                      initial={{ opacity: 0, y: 20, rotateX: -15 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      Bracelet offert, abonnement simple
                    </motion.h2>
                    
                    <motion.p
                      className="text-sm max-w-[420px] mx-auto"
                      style={{ color: "#64748B" }}
                      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                    >
                      Aucun frais d'achat. Choisissez votre formule et recevez votre Oreon gratuitement
                    </motion.p>
                    
                    {/* Accent line */}
                    <motion.div
                      className="mx-auto mt-5 h-px"
                      style={{ background: "rgba(168,221,255,0.5)", width: 80 }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  
                  {/* Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {plans.map((plan, i) => (
                      <PricingCard
                        key={plan.key}
                        plan={plan}
                        index={i}
                        onCardPayment={onCardPayment}
                        loadingPlan={loadingPlan}
                      />
                    ))}
                  </div>
                  
                  {/* Settle bounce */}
                  <motion.div
                    initial={{}}
                    animate={{ scale: [1, 1.005, 1] }}
                    transition={{ delay: 1.2, duration: 0.3, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      
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
        @keyframes conic-rotate {
          0% { --conic-angle: 0deg; }
          100% { --conic-angle: 360deg; }
        }
        @property --conic-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes aurora-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(3%, -2%) scale(1.02); }
          50% { transform: translate(-2%, 3%) scale(0.98); }
          75% { transform: translate(2%, 1%) scale(1.01); }
        }
        ${[...Array(8)].map((_, i) => `
          @keyframes ambient-float-${i} {
            0%, 100% { transform: translate(0, 0); opacity: ${0.1 + (i % 4) * 0.04}; }
            33% { transform: translate(${8 - i * 2}px, ${-12 + i * 3}px); opacity: ${0.2 + (i % 3) * 0.05}; }
            66% { transform: translate(${-6 + i}px, ${10 - i * 2}px); opacity: ${0.15 + (i % 5) * 0.03}; }
          }
        `).join("")}
      `}</style>
    </>
  );
}
