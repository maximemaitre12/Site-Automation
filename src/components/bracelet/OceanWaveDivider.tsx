interface WaveDividerProps {
  backColor?: string;
  midColor?: string;
  frontColor?: string;
  variant?: "a" | "b";
}

export default function OceanWaveDivider({
  backColor = "#14225C",
  midColor = "#1A3FB8",
  frontColor = "#0a2d6e",
  variant = "a",
}: WaveDividerProps) {
  const paths = variant === "a"
    ? {
        back: "M0,45 C200,15 400,70 600,40 C800,10 1000,65 1200,45 C1400,25 1600,55 1800,35 C2000,15 2200,60 2400,45 L2400,120 L0,120 Z",
        mid: "M0,55 C150,25 350,80 550,45 C750,10 950,75 1200,55 C1450,35 1600,80 1800,50 C2000,20 2200,70 2400,55 L2400,120 L0,120 Z",
        front: "M0,60 C100,42 250,72 400,52 C550,32 700,68 900,58 C1100,48 1250,75 1400,55 C1550,35 1700,65 1900,50 C2050,38 2200,62 2400,60",
      }
    : {
        back: "M0,40 C180,65 380,20 580,50 C780,75 980,25 1200,40 C1420,55 1620,18 1820,48 C2020,72 2200,30 2400,40 L2400,120 L0,120 Z",
        mid: "M0,50 C200,75 400,22 650,55 C900,80 1050,30 1200,50 C1350,70 1550,25 1800,55 C2050,78 2250,35 2400,50 L2400,120 L0,120 Z",
        front: "M0,58 C120,40 300,75 480,50 C660,28 850,70 1050,55 C1250,40 1400,72 1600,48 C1800,30 2000,68 2200,52 C2350,42 2400,58 2400,58",
      };

  return (
    <div className="relative w-full" style={{ marginTop: -2, marginBottom: -2, zIndex: 5 }}>
      <div className="relative w-full" style={{ height: "clamp(70px, 10vw, 120px)" }}>
        {/* Back wave */}
        <svg
          className="absolute inset-0 w-[200%] h-full"
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          style={{ animation: "wave-drift-back 60s linear infinite" }}
        >
          <path d={paths.back} fill={backColor} opacity="0.5" />
        </svg>

        {/* Mid wave */}
        <svg
          className="absolute inset-0 w-[200%] h-full"
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          style={{ animation: "wave-drift-mid 40s linear infinite reverse" }}
        >
          <path d={paths.mid} fill={midColor} opacity="0.85" />
        </svg>

        {/* Front wave + highlight */}
        <svg
          className="absolute inset-0 w-[200%] h-full"
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          style={{ animation: "wave-drift-front 25s linear infinite, wave-bob 6s ease-in-out infinite" }}
        >
          <path
            d={paths.front}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
          <path
            d={`${paths.front} L2400,120 L0,120 Z`}
            fill={frontColor}
          />
        </svg>

        {/* Caustic glow */}
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
