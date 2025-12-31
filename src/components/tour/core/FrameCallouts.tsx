import React from "react";
import { cn } from "@/lib/utils";

export type FrameCalloutTarget = {
  id: string;
  x: number; // % (0-100)
  y: number; // % (0-100)
  w: number; // % (0-100)
  h: number; // % (0-100)
  title: string;
  body: string;
};

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function rectToSafe(target: FrameCalloutTarget) {
  const x = clamp(target.x);
  const y = clamp(target.y);
  const w = clamp(target.w, 0, 100 - x);
  const h = clamp(target.h, 0, 100 - y);
  return { ...target, x, y, w, h };
}

export function FrameCallouts({
  target,
  isVisible = true,
  className,
}: {
  target: FrameCalloutTarget | null;
  isVisible?: boolean;
  className?: string;
}) {
  if (!target) return null;

  const t = rectToSafe(target);
  const cursorX = clamp(t.x + t.w + 1, 2, 98);
  const cursorY = clamp(t.y + t.h + 1, 2, 98);

  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 z-[60] pointer-events-none transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {/* Spotlight (container-relative, never overflows the 16:9 frame) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <mask id={`frame-spotlight-${t.id}`}>
            <rect width="100" height="100" fill="white" />
            <rect x={t.x} y={t.y} width={t.w} height={t.h} rx={2} fill="black" />
          </mask>
          <filter id={`frame-glow-${t.id}`}>
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          width="100"
          height="100"
          fill="hsl(var(--background) / 0.72)"
          mask={`url(#frame-spotlight-${t.id})`}
        />

        <rect
          x={t.x}
          y={t.y}
          width={t.w}
          height={t.h}
          rx={2}
          fill="none"
          stroke="hsl(var(--primary) / 0.9)"
          strokeWidth={0.55}
          filter={`url(#frame-glow-${t.id})`}
        />
      </svg>

      {/* Cursor */}
      <div className="absolute" style={{ left: `${cursorX}%`, top: `${cursorY}%` }}>
        <div className="relative" style={{ transform: "translate(-30%, -30%)" }}>
          <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping" />
          <div
            className="h-6 w-6 rounded-full border border-primary/70 bg-background/10 backdrop-blur-sm"
            style={{ boxShadow: "0 0 18px hsl(var(--primary) / 0.35)" }}
          />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
        </div>
      </div>

      {/* Tooltip */}
      <div
        className="absolute"
        style={{
          left: `${clamp(t.x + t.w / 2, 6, 94)}%`,
          top: `${clamp(t.y - 2, 6, 94)}%`,
          transform: "translate(-50%, -100%)",
        }}
      >
        <div
          className="max-w-[340px] rounded-xl border border-border/60 bg-background/70 px-4 py-3 shadow-2xl"
          style={{ boxShadow: "0 24px 50px hsl(var(--foreground) / 0.12)" }}
        >
          <div className="text-xs font-semibold text-primary">{t.title}</div>
          <div className="mt-1 text-xs leading-relaxed text-foreground/80">{t.body}</div>
        </div>
      </div>
    </div>
  );
}
