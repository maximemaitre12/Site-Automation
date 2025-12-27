import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, Shield, Check, AlertTriangle, Search, FileCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const scanItems = [
  { name: "GDPR Compliance", status: "pass", icon: Shield },
  { name: "Data Encryption", status: "pass", icon: Lock },
  { name: "Access Controls", status: "pass", icon: FileCheck },
  { name: "PII Detection", status: "warning", icon: AlertTriangle },
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
    "contracts/2024/agreement.pdf",
    "sales/reports/Q4_2024.xlsx",
    "hr/employee_data.csv",
    "legal/compliance_policy.docx"
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
    const t2 = setTimeout(() => setPhase(2), 4000);
    const t3 = setTimeout(() => setPhase(3), 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isVisible]);

  // Scan progress animation
  useEffect(() => {
    if (phase >= 1) {
      let fileIndex = 0;
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          
          // Update current file
          const newIndex = Math.floor((prev / 100) * files.length);
          if (newIndex !== fileIndex && newIndex < files.length) {
            fileIndex = newIndex;
            setCurrentFile(files[newIndex]);
          }
          
          // Check items at certain progress points
          if (prev >= 25 && !checkedItems.includes(0)) {
            setCheckedItems(arr => [...arr, 0]);
          }
          if (prev >= 50 && !checkedItems.includes(1)) {
            setCheckedItems(arr => [...arr, 1]);
          }
          if (prev >= 75 && !checkedItems.includes(2)) {
            setCheckedItems(arr => [...arr, 2]);
          }
          if (prev >= 95 && !checkedItems.includes(3)) {
            setCheckedItems(arr => [...arr, 3]);
          }
          
          return prev + 1;
        });
      }, 35);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-rose-500/5 via-background to-red-500/5 border border-rose-500/20 overflow-hidden",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10">
        {/* Scanner header */}
        <div className={cn(
          "mb-6 transition-all duration-500",
          phase >= 1 ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground">Compliance Scanner</h4>
              <p className="text-sm text-muted-foreground">Real-time security analysis</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Scanning documents...</span>
              <span className="font-mono text-rose-500">{scanProgress}%</span>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-500 transition-all duration-100 relative"
                style={{ width: `${scanProgress}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30 animate-pulse" />
              </div>
            </div>
            {currentFile && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Search className="w-3 h-3 animate-pulse" />
                <span className="font-mono truncate">{currentFile}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scan results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {scanItems.map((item, i) => {
            const Icon = item.icon;
            const isChecked = checkedItems.includes(i);
            
            return (
              <div
                key={item.name}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-500",
                  isChecked
                    ? item.status === "pass"
                      ? "bg-emerald-500/5 border-emerald-500/30"
                      : "bg-amber-500/5 border-amber-500/30"
                    : "bg-secondary/50 border-border/50 opacity-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500",
                    isChecked
                      ? item.status === "pass"
                        ? "bg-emerald-500/20"
                        : "bg-amber-500/20"
                      : "bg-secondary"
                  )}>
                    {isChecked ? (
                      item.status === "pass" ? (
                        <Check className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      )
                    ) : (
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className={cn(
                      "text-xs",
                      isChecked
                        ? item.status === "pass"
                          ? "text-emerald-500"
                          : "text-amber-500"
                        : "text-muted-foreground"
                    )}>
                      {isChecked ? (item.status === "pass" ? "Verified" : "Action needed") : "Scanning..."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning alert */}
        <div className={cn(
          "p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6 transition-all duration-700",
          phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">PII Detected in: sales_report.xlsx</p>
              <p className="text-xs text-muted-foreground mt-1">
                Customer email addresses found in column D. Recommendation: Apply encryption or remove before sharing.
              </p>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className={cn(
          "grid grid-cols-3 gap-4 mb-6 transition-all duration-700",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <div className="text-center p-3 rounded-lg bg-emerald-500/10">
            <div className="text-2xl font-bold text-emerald-500">99%</div>
            <div className="text-xs text-muted-foreground">Risks Detected</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-rose-500/10">
            <div className="text-2xl font-bold text-rose-500">-90%</div>
            <div className="text-xs text-muted-foreground">Audit Time</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-emerald-500/10">
            <div className="text-2xl font-bold text-emerald-500">$0</div>
            <div className="text-xs text-muted-foreground">GDPR Fines</div>
          </div>
        </div>

        {/* CTA */}
        <div className={cn(
          "text-center transition-all duration-700",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-base font-medium text-foreground mb-4">
            Protect your business with automated compliance
          </p>
          <Link to="/signup" onClick={(e) => e.stopPropagation()}>
            <Button size="lg" className="shadow-lg shadow-rose-500/25 bg-rose-500 hover:bg-rose-600">
              Create Your Agent
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
