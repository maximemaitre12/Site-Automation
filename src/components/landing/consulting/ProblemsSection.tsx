import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const processes = [
  { name: "Gestion des flux logistiques", score: 34, status: "critical" as const },
  { name: "Processus de recrutement", score: 52, status: "warning" as const },
  { name: "Reporting financier", score: 28, status: "critical" as const },
  { name: "Conformité réglementaire", score: 61, status: "warning" as const },
  { name: "Allocation des ressources", score: 45, status: "critical" as const },
  { name: "Communication inter-équipes", score: 73, status: "optimal" as const },
];

export function ProblemsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.08 });
  const [scannedCount, setScannedCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const timers = processes.map((_, i) =>
      setTimeout(() => setScannedCount(i + 1), 400 + i * 350)
    );
    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  const criticalCount = processes.filter(p => p.status === "critical").length;
  const potential = "340K€";

  return (
    <section className="py-20 sm:py-28 bg-[#060918] relative overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(0_0%_100%/0.02)_1px,transparent_1px)] bg-[length:32px_32px]" />
      
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Diagnostic</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            Identifier les freins à la performance
          </h2>
          <p className="text-sm sm:text-base text-white/40 max-w-xl mx-auto">
            Notre moteur d'analyse détecte les points de friction dans vos opérations.
          </p>
        </div>

        {/* Terminal-style dashboard */}
        <div className={cn(
          "rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )} style={{ transitionDelay: "200ms" }}>
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-white/30 ml-2 tracking-wider">
              AETHER DIAGNOSTIC ENGINE v2.4
            </span>
          </div>

          {/* Process scan lines */}
          <div className="p-4 sm:p-6 space-y-3">
            {processes.map((proc, i) => {
              const scanned = i < scannedCount;
              const statusColor = proc.status === "critical"
                ? "bg-red-500/80 text-red-200"
                : proc.status === "warning"
                ? "bg-yellow-500/80 text-yellow-200"
                : "bg-emerald-500/80 text-emerald-200";

              const barColor = proc.status === "critical"
                ? "bg-red-500/40"
                : proc.status === "warning"
                ? "bg-yellow-500/40"
                : "bg-emerald-500/40";

              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 sm:gap-4 transition-all duration-500",
                    scanned ? "opacity-100" : "opacity-20"
                  )}
                >
                  <span className="text-xs sm:text-sm text-white/60 font-medium w-[45%] sm:w-[40%] truncate">{proc.name}</span>
                  
                  {/* Progress bar */}
                  <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700 ease-out", barColor)}
                      style={{ width: scanned ? `${proc.score}%` : "0%", transitionDelay: `${i * 100}ms` }}
                    />
                  </div>

                  {/* Score */}
                  <span className={cn(
                    "text-xs font-mono tabular-nums w-8 text-right transition-all duration-300",
                    scanned ? "opacity-100" : "opacity-0",
                    proc.status === "critical" ? "text-red-400/80" : proc.status === "warning" ? "text-yellow-400/80" : "text-emerald-400/80"
                  )}>
                    {scanned ? `${proc.score}%` : ""}
                  </span>

                  {/* Status badge */}
                  <div className={cn(
                    "px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap",
                    scanned ? "opacity-100 scale-100" : "opacity-0 scale-75",
                    statusColor
                  )}>
                    {proc.status === "critical" ? "Friction" : proc.status === "warning" ? "À risque" : "Optimal"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary bar */}
          <div className={cn(
            "px-4 sm:px-6 py-4 border-t border-white/[0.06] bg-white/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-all duration-500",
            scannedCount >= processes.length ? "opacity-100" : "opacity-0"
          )}>
            <span className="text-xs sm:text-sm text-white/50">
              <span className="text-red-400 font-semibold">{criticalCount} points de friction</span> identifiés
            </span>
            <span className="text-xs sm:text-sm text-white/50">
              Potentiel d'optimisation : <span className="text-primary font-bold">{potential}/an</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
