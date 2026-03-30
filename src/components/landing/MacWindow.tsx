import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MacWindowProps {
  title: string;
  variant?: "light" | "dark";
  toolbar?: ReactNode;
  statusBar?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function MacWindow({ title, variant = "light", toolbar, statusBar, className, children }: MacWindowProps) {
  const isDark = variant === "dark";

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden shadow-[0_8px_40px_hsl(220_20%_50%/0.10),0_0_0_1px_hsl(220_20%_80%/0.3)]",
      isDark ? "bg-slate-900 border-slate-700/60" : "bg-white border-slate-200",
      className
    )}>
      {/* Title bar */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-2.5 border-b",
        isDark ? "bg-slate-800/80 border-slate-700/60" : "bg-slate-50/80 border-slate-200"
      )}>
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.15)]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.15)]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.15)]" />
        </div>

        {/* Title */}
        <span className={cn(
          "font-mono text-[10px] sm:text-[11px] tracking-[0.15em] uppercase flex-1 text-center",
          isDark ? "text-slate-400" : "text-slate-400"
        )}>
          {title}
        </span>

        {/* Spacer for centering */}
        <div className="w-[52px]" />
      </div>

      {/* Optional toolbar */}
      {toolbar && (
        <div className={cn(
          "px-4 py-2 border-b",
          isDark ? "bg-slate-800/40 border-slate-700/40" : "bg-slate-50/50 border-slate-100"
        )}>
          {toolbar}
        </div>
      )}

      {/* Content */}
      <div className="relative">
        {children}
      </div>

      {/* Optional status bar */}
      {statusBar && (
        <div className={cn(
          "px-4 py-2 border-t",
          isDark ? "bg-slate-800/60 border-slate-700/40" : "bg-slate-50/60 border-slate-100"
        )}>
          {statusBar}
        </div>
      )}
    </div>
  );
}
