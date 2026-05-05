export default function OceanWaveDivider() {
  return (
    <div className="relative w-full" style={{ marginTop: -2, marginBottom: -2, zIndex: 5 }}>
      <div className="relative w-full h-[120px] md:h-[120px]" style={{ height: "clamp(70px, 10vw, 120px)" }}>
        {/* Back wave — subtle, deepest */}
        <svg
          className="absolute inset-0 w-[200%] h-full"
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          style={{ animation: "wave-drift-back 60s linear infinite" }}
        >
          <path
            d="M0,45 C200,15 400,70 600,40 C800,10 1000,65 1200,45 C1400,25 1600,55 1800,35 C2000,15 2200,60 2400,45 L2400,120 L0,120 Z"
            fill="#14225C"
            opacity="0.5"
          />
        </svg>

        {/* Mid wave — main body */}
        <svg
          className="absolute inset-0 w-[200%] h-full"
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          style={{ animation: "wave-drift-mid 40s linear infinite reverse" }}
        >
          <path
            d="M0,55 C150,25 350,80 550,45 C750,10 950,75 1200,55 C1450,35 1600,80 1800,50 C2000,20 2200,70 2400,55 L2400,120 L0,120 Z"
            fill="#1A3FB8"
            opacity="0.85"
          />
        </svg>

        {/* Front wave — defining boundary + highlight */}
        <svg
          className="absolute inset-0 w-[200%] h-full"
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          style={{ animation: "wave-drift-front 25s linear infinite, wave-bob 6s ease-in-out infinite" }}
        >
          {/* Light highlight on wave surface */}
          <path
            d="M0,60 C100,42 250,72 400,52 C550,32 700,68 900,58 C1100,48 1250,75 1400,55 C1550,35 1700,65 1900,50 C2050,38 2200,62 2400,60"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
          {/* Solid front wave */}
          <path
            d="M0,60 C100,42 250,72 400,52 C550,32 700,68 900,58 C1100,48 1250,75 1400,55 C1550,35 1700,65 1900,50 C2050,38 2200,62 2400,60 L2400,120 L0,120 Z"
            fill="#0a2d6e"
          />
          {/* Micro-ripples */}
          <path
            d="M300,54 C310,52 320,53 330,51 M800,60 C812,57 824,59 836,56 M1500,48 C1512,46 1524,47 1536,45"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />
        </svg>

        {/* Caustic glow below front wave */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(100,200,255,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Rising bubbles */}
        {[
          { left: "12%", size: 3, dur: 8, delay: 0, op: 0.3 },
          { left: "28%", size: 2, dur: 10, delay: 2, op: 0.4 },
          { left: "55%", size: 2.5, dur: 9, delay: 4, op: 0.35 },
          { left: "72%", size: 2, dur: 11, delay: 1, op: 0.3 },
          { left: "88%", size: 3, dur: 7, delay: 3, op: 0.5 },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: b.left,
              bottom: "10%",
              width: b.size,
              height: b.size,
              background: `rgba(255,255,255,${b.op})`,
              animation: `bubble-rise ${b.dur}s ease-in infinite ${b.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes wave-drift-back {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes wave-drift-mid {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes wave-drift-front {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes wave-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes bubble-rise {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-60px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
