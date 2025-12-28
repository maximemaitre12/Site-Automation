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
  blue: "from-[hsl(200_80%_75%/0.35)] to-[hsl(220_70%_85%/0.25)]",
  purple: "from-[hsl(260_70%_75%/0.35)] to-[hsl(280_60%_85%/0.25)]",
  mixed: "from-[hsl(260_70%_75%/0.3)] via-[hsl(230_60%_78%/0.25)] to-[hsl(200_80%_80%/0.3)]",
};

const intensityOpacity = {
  subtle: "opacity-40",
  medium: "opacity-60",
  strong: "opacity-75",
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
    blue: "before:bg-gradient-to-br before:from-[hsl(200_80%_85%/0.4)] before:to-[hsl(220_70%_90%/0.3)]",
    purple: "before:bg-gradient-to-br before:from-[hsl(260_70%_85%/0.4)] before:to-[hsl(280_60%_90%/0.3)]",
    mixed: "before:bg-gradient-to-br before:from-[hsl(260_70%_85%/0.35)] before:via-[hsl(230_60%_88%/0.25)] before:to-[hsl(200_80%_85%/0.35)]",
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
      {/* Large violet-blue cloud top-right */}
      <div
        className="absolute top-10 right-[10%] w-80 h-48 bg-gradient-to-br from-[hsl(260_70%_80%/0.25)] to-[hsl(200_80%_85%/0.2)] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-3xl animate-cloud-float"
        style={{ animationDuration: "12s" }}
      />
      
      {/* Medium purple cloud left */}
      <div
        className="absolute top-1/3 left-[5%] w-52 h-36 bg-gradient-to-br from-[hsl(270_65%_78%/0.22)] to-[hsl(230_60%_85%/0.18)] rounded-[40%_60%_70%_30%/50%_40%_60%_50%] blur-3xl animate-cloud-drift"
        style={{ animationDuration: "10s", animationDelay: "-3s" }}
      />
      
      {/* Small blue cloud bottom-right */}
      <div
        className="absolute bottom-20 right-[15%] w-40 h-28 bg-gradient-to-br from-[hsl(200_80%_80%/0.2)] to-[hsl(220_70%_85%/0.15)] rounded-[50%_50%_40%_60%/40%_60%_50%_50%] blur-2xl animate-cloud-pulse"
        style={{ animationDuration: "8s", animationDelay: "-5s" }}
      />
      
      {/* Tiny violet accent cloud */}
      <div
        className="absolute top-[60%] left-[20%] w-28 h-20 bg-gradient-to-br from-[hsl(255_70%_82%/0.18)] to-[hsl(200_75%_85%/0.12)] rounded-[60%_40%_50%_50%/50%_60%_40%_50%] blur-xl animate-cloud-float"
        style={{ animationDuration: "14s", animationDelay: "-7s" }}
      />
    </div>
  );
}
