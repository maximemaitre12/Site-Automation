import { cn } from "@/lib/utils";

interface TechBackgroundProps {
  className?: string;
  variant?: "grid" | "circuit" | "dots" | "combined";
  intensity?: "subtle" | "medium" | "strong";
}

export function TechBackground({ 
  className, 
  variant = "combined",
  intensity = "subtle" 
}: TechBackgroundProps) {
  const opacityMap = {
    subtle: "opacity-[0.03]",
    medium: "opacity-[0.06]",
    strong: "opacity-[0.1]"
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Grid pattern */}
      {(variant === "grid" || variant === "combined") && (
        <div 
          className={cn("absolute inset-0", opacityMap[intensity])}
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px"
          }}
        />
      )}

      {/* Dot pattern */}
      {(variant === "dots" || variant === "combined") && (
        <div 
          className={cn("absolute inset-0", opacityMap[intensity])}
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "30px 30px"
          }}
        />
      )}

      {/* Circuit lines decoration */}
      {(variant === "circuit" || variant === "combined") && (
        <svg 
          className={cn("absolute inset-0 w-full h-full", opacityMap[intensity])} 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="circuit-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Horizontal lines */}
              <line x1="0" y1="50" x2="80" y2="50" stroke="hsl(var(--primary))" strokeWidth="1" />
              <line x1="120" y1="50" x2="200" y2="50" stroke="hsl(var(--primary))" strokeWidth="1" />
              <line x1="0" y1="150" x2="60" y2="150" stroke="hsl(var(--primary))" strokeWidth="1" />
              <line x1="140" y1="150" x2="200" y2="150" stroke="hsl(var(--primary))" strokeWidth="1" />
              
              {/* Vertical lines */}
              <line x1="50" y1="0" x2="50" y2="40" stroke="hsl(var(--primary))" strokeWidth="1" />
              <line x1="50" y1="60" x2="50" y2="100" stroke="hsl(var(--primary))" strokeWidth="1" />
              <line x1="150" y1="100" x2="150" y2="140" stroke="hsl(var(--primary))" strokeWidth="1" />
              <line x1="150" y1="160" x2="150" y2="200" stroke="hsl(var(--primary))" strokeWidth="1" />
              
              {/* Connection nodes */}
              <circle cx="50" cy="50" r="4" fill="hsl(var(--primary))" />
              <circle cx="150" cy="150" r="4" fill="hsl(var(--primary))" />
              <circle cx="100" cy="100" r="3" fill="hsl(var(--primary))" />
              
              {/* Corner pieces */}
              <path d="M 80 50 L 100 50 L 100 70" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
              <path d="M 100 130 L 100 150 L 120 150" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      )}

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
    </div>
  );
}

interface DataParticlesProps {
  className?: string;
  count?: number;
}

export function DataParticles({ className, count = 20 }: DataParticlesProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );
}

interface GlowOrbProps {
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  position?: { top?: string; left?: string; right?: string; bottom?: string };
}

export function GlowOrb({ 
  className, 
  color = "primary", 
  size = "md",
  position 
}: GlowOrbProps) {
  const sizeMap = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96"
  };

  return (
    <div 
      className={cn(
        "absolute rounded-full blur-3xl animate-pulse-glow pointer-events-none",
        sizeMap[size],
        color === "primary" ? "bg-primary/10" : `bg-${color}/10`,
        className
      )}
      style={position}
    />
  );
}
