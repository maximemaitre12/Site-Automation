import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Shield, Check, AlertTriangle, Search, FileCheck, Lock } from "lucide-react";

const scanItems = [
  { name: "GDPR", status: "pass", icon: Shield },
  { name: "Encryption", status: "pass", icon: Lock },
  { name: "Access", status: "pass", icon: FileCheck },
  { name: "PII", status: "warning", icon: AlertTriangle },
];

interface AgentComplianceDemoProps {
  className?: string;
}

export function AgentComplianceDemo({ className }: AgentComplianceDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [phase, setPhase] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const files = [
    "contracts/agreement.pdf",
    "sales/Q4_report.xlsx",
    "hr/employee_data.csv",
  ];

  useEffect(() => {
    if (!isVisible) {
      setPhase(0);
      setScanProgress(0);
      setCurrentFile("");
      setCheckedItems([]);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 3500);
    const t3 = setTimeout(() => setPhase(3), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isVisible]);

  useEffect(() => {
    if (phase >= 1) {
      let fileIndex = 0;
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          
          const newIndex = Math.floor((prev / 100) * files.length);
          if (newIndex !== fileIndex && newIndex < files.length) {
            fileIndex = newIndex;
            setCurrentFile(files[newIndex]);
          }
          
          if (prev >= 25 && !checkedItems.includes(0)) setCheckedItems(arr => [...arr, 0]);
          if (prev >= 50 && !checkedItems.includes(1)) setCheckedItems(arr => [...arr, 1]);
          if (prev >= 75 && !checkedItems.includes(2)) setCheckedItems(arr => [...arr, 2]);
          if (prev >= 95 && !checkedItems.includes(3)) setCheckedItems(arr => [...arr, 3]);
          
          return prev + 1.5;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-4 rounded-xl bg-gradient-to-br from-violet-500/5 via-background to-purple-500/5 border border-violet-500/20 overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 right-1/4 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10">
        {/* Scanner header */}
        <div className={cn(
          "mb-3 transition-all duration-500",
          phase >= 1 ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Compliance Scanner</h4>
              <p className="text-[10px] text-muted-foreground">Real-time analysis</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">Scanning...</span>
              <span className="font-mono text-violet-500">{scanProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-100 relative"
                style={{ width: `${scanProgress}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-white/30 animate-pulse" />
              </div>
            </div>
            {currentFile && (
              <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <Search className="w-2.5 h-2.5 animate-pulse" />
                <span className="font-mono truncate">{currentFile}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scan results - compact grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {scanItems.map((item, i) => {
            const Icon = item.icon;
            const isChecked = checkedItems.includes(i);
            
            return (
              <div
                key={item.name}
                className={cn(
                  "p-2 rounded-lg border transition-all duration-500",
                  isChecked
                    ? item.status === "pass"
                      ? "bg-primary/5 border-primary/30"
                      : "bg-violet-500/5 border-violet-500/30"
                    : "bg-secondary/50 border-border/50 opacity-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center transition-all duration-500",
                    isChecked
                      ? item.status === "pass" ? "bg-primary/20" : "bg-violet-500/20"
                      : "bg-secondary"
                  )}>
                    {isChecked ? (
                      item.status === "pass" ? (
                        <Check className="w-3 h-3 text-primary" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-violet-500" />
                      )
                    ) : (
                      <Icon className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-foreground">{item.name}</p>
                    <p className={cn(
                      "text-[8px]",
                      isChecked
                        ? item.status === "pass" ? "text-primary" : "text-violet-500"
                        : "text-muted-foreground"
                    )}>
                      {isChecked ? (item.status === "pass" ? "OK" : "Action") : "..."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning alert - compact */}
        <div className={cn(
          "p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 mb-3 transition-all duration-500",
          phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-medium text-violet-600 dark:text-violet-400">PII Detected</p>
              <p className="text-[9px] text-muted-foreground">
                Emails found in sales_report.xlsx - Apply encryption
              </p>
            </div>
          </div>
        </div>

        {/* Stats - compact */}
        <div className={cn(
          "grid grid-cols-3 gap-2 mb-3 transition-all duration-500",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <div className="text-center p-1.5 rounded bg-primary/10">
            <div className="text-sm font-bold text-primary">99%</div>
            <div className="text-[8px] text-muted-foreground">Detected</div>
          </div>
          <div className="text-center p-1.5 rounded bg-violet-500/10">
            <div className="text-sm font-bold text-violet-500">-90%</div>
            <div className="text-[8px] text-muted-foreground">Audit Time</div>
          </div>
          <div className="text-center p-1.5 rounded bg-primary/10">
            <div className="text-sm font-bold text-primary">$0</div>
            <div className="text-[8px] text-muted-foreground">Fines</div>
          </div>
        </div>

        {/* CTA */}
        <div className={cn(
          "text-center transition-all duration-500",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-xs font-medium text-foreground">
            Protect your business with automated compliance
          </p>
        </div>
      </div>
    </div>
  );
}