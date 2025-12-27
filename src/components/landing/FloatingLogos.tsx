import { cn } from "@/lib/utils";

const integrations = [
  { name: "Slack", color: "#E01E5A", icon: "S" },
  { name: "Gmail", color: "#EA4335", icon: "G" },
  { name: "Figma", color: "#A259FF", icon: "F" },
  { name: "Notion", color: "#000000", icon: "N" },
  { name: "Salesforce", color: "#00A1E0", icon: "S" },
  { name: "HubSpot", color: "#FF7A59", icon: "H" },
  { name: "Jira", color: "#0052CC", icon: "J" },
  { name: "Zapier", color: "#FF4A00", icon: "Z" },
];

interface FloatingLogosProps {
  className?: string;
  animate?: boolean;
}

export function FloatingLogos({ className, animate = true }: FloatingLogosProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      {integrations.map((integration, i) => (
        <div
          key={integration.name}
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg transition-all duration-500",
            animate && "animate-float"
          )}
          style={{
            backgroundColor: integration.color,
            animationDelay: `${i * 200}ms`,
          }}
          title={integration.name}
        >
          {integration.icon}
        </div>
      ))}
    </div>
  );
}
