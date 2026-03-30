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
    <section className="py-20 sm:py-28 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_1px_at_center,hsl(220_20%_80%/0.2)_1px,transparent_1px)] bg-[length:32px_32px]" />
      
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-10 sm:mb-14 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Diagnostic</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Identifier les freins à la performance
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Notre moteur d'analyse détecte les points de friction dans vos opérations.
          </p>
        </div>

        {/* Terminal-style dashboard */}
        <div className={cn(
          "rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )} style={{ transitionDelay: "200ms" }}>
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-slate-400 ml-2 tracking-wider">
              AETHER DIAGNOSTIC ENGINE v2.4
            </span>
          </div>

          {/* Process scan lines */}
          <div className="p-4 sm:p-6 space-y-3">
            {processes.map((proc, i) => {
              const scanned = i < scannedCount;
              const statusColor = proc.status === "critical"
                ? "bg-red-500 text-white"
                : proc.status === "warning"
                ? "bg-yellow-500 text-white"
                : "bg-emerald-500 text-white";

              const barColor = proc.status === "critical"
                ? "bg-red-400/60"
                : proc.status === "warning"
                ? "bg-yellow-400/60"
                : "bg-emerald-400/60";

              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 sm:gap-4 transition-all duration-500",
                    scanned ? "opacity-100" : "opacity-20"
                  )}
                >
                  <span className="text-xs sm:text-sm text-slate-600 font-medium w-[45%] sm:w-[40%] truncate">{proc.name}</span>
                  
                  {/* Progress bar */}
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700 ease-out", barColor)}
                      style={{ width: scanned ? `${proc.score}%` : "0%", transitionDelay: `${i * 100}ms` }}
                    />
                  </div>

                  {/* Score */}
                  <span className={cn(
                    "text-xs font-mono tabular-nums w-8 text-right transition-all duration-300",
                    scanned ? "opacity-100" : "opacity-0",
                    proc.status === "critical" ? "text-red-500" : proc.status === "warning" ? "text-yellow-600" : "text-emerald-500"
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
            "px-4 sm:px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-all duration-500",
            scannedCount >= processes.length ? "opacity-100" : "opacity-0"
          )}>
            <span className="text-xs sm:text-sm text-slate-500">
              <span className="text-red-500 font-semibold">{criticalCount} points de friction</span> identifiés
            </span>
            <span className="text-xs sm:text-sm text-slate-500">
              Potentiel d'optimisation : <span className="text-primary font-bold">{potential}/an</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
