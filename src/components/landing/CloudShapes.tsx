import { cn } from "@/lib/utils";

interface CloudBlobProps {
  className?: string;
  variant?: "blue" | "purple" | "mixed";
  size?: "sm" | "md" | "lg" | "xl";
  intensity?: "subtle" | "medium" | "strong";
  animate?: boolean;
}

const sizeClasses = {
  sm: "w-24 h-16",
  md: "w-40 h-28",
  lg: "w-64 h-44",
  xl: "w-96 h-64",
};

const variantGradients = {
  blue: "from-[hsl(210_30%_75%/0.3)] to-[hsl(190_40%_80%/0.2)]",
  purple: "from-[hsl(190_40%_75%/0.3)] to-[hsl(210_30%_80%/0.2)]",
  mixed: "from-[hsl(210_30%_75%/0.25)] via-[hsl(200_35%_78%/0.2)] to-[hsl(190_40%_80%/0.25)]",
};

const intensityOpacity = {
  subtle: "opacity-30",
  medium: "opacity-50",
  strong: "opacity-70",
};

export function CloudBlob({
  className,
  variant = "mixed",
  size = "md",
  intensity = "medium",
  animate = true,
}: CloudBlobProps) {
  return (
    <div
      className={cn(
        "absolute bg-gradient-to-br blur-2xl pointer-events-none",
        sizeClasses[size],
        variantGradients[variant],
        intensityOpacity[intensity],
        animate && "animate-cloud-morph animate-cloud-float",
        "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]",
        className
      )}
      style={{
        animationDuration: animate ? `${10 + Math.random() * 8}s` : undefined,
      }}
    />
  );
}

interface CloudBackgroundProps {
  children: React.ReactNode;
  className?: string;
  showClouds?: boolean;
}

export function CloudBackground({ children, className, showClouds = true }: CloudBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {showClouds && (
        <>
          <CloudBlob
            variant="blue"
            size="xl"
            intensity="subtle"
            className="top-0 right-0 -translate-y-1/3 translate-x-1/4"
          />
          <CloudBlob
            variant="purple"
            size="lg"
            intensity="subtle"
            className="bottom-0 left-0 translate-y-1/3 -translate-x-1/4"
          />
          <CloudBlob
            variant="mixed"
            size="md"
            intensity="subtle"
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface WidgetCloudWrapperProps {
  children: React.ReactNode;
  className?: string;
  variant?: "blue" | "purple" | "mixed";
}

export function WidgetCloudWrapper({ children, className, variant = "mixed" }: WidgetCloudWrapperProps) {
  const bgVariants = {
    blue: "before:bg-gradient-to-br before:from-[hsl(210_30%_85%/0.3)] before:to-[hsl(190_40%_90%/0.2)]",
    purple: "before:bg-gradient-to-br before:from-[hsl(190_40%_85%/0.3)] before:to-[hsl(210_30%_90%/0.2)]",
    mixed: "before:bg-gradient-to-br before:from-[hsl(210_30%_85%/0.25)] before:via-[hsl(200_35%_88%/0.2)] before:to-[hsl(190_40%_85%/0.25)]",
  };

  return (
    <div
      className={cn(
        "relative",
        "before:content-[''] before:absolute before:inset-[-20px] before:rounded-[60%_40%_30%_70%/60%_30%_70%_40%]",
        "before:animate-cloud-morph before:blur-xl before:z-[-1]",
        bgVariants[variant],
        "dark:before:opacity-30",
        className
      )}
    >
      {children}
    </div>
  );
}

// Floating cloud decoration for hero sections
export function FloatingClouds({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Large subtle cloud top-right - Aether blue tones */}
      <div
        className="absolute top-10 right-[10%] w-80 h-48 bg-gradient-to-br from-[hsl(210_30%_80%/0.2)] to-[hsl(190_40%_85%/0.15)] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-3xl animate-cloud-float"
        style={{ animationDuration: "12s" }}
      />
      
      {/* Medium subtle cloud left */}
      <div
        className="absolute top-1/3 left-[5%] w-52 h-36 bg-gradient-to-br from-[hsl(190_35%_80%/0.18)] to-[hsl(210_30%_85%/0.12)] rounded-[40%_60%_70%_30%/50%_40%_60%_50%] blur-3xl animate-cloud-drift"
        style={{ animationDuration: "10s", animationDelay: "-3s" }}
      />
      
      {/* Small subtle cloud bottom-right */}
      <div
        className="absolute bottom-20 right-[15%] w-40 h-28 bg-gradient-to-br from-[hsl(200_35%_82%/0.15)] to-[hsl(190_30%_85%/0.1)] rounded-[50%_50%_40%_60%/40%_60%_50%_50%] blur-2xl animate-cloud-pulse"
        style={{ animationDuration: "8s", animationDelay: "-5s" }}
      />
    </div>
  );
}
