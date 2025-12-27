import { cn } from "@/lib/utils";

// Real SVG brand logos
export const SlackLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
);

export const GmailLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
  </svg>
);

export const FigmaLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zM8.148 24c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.588 4.539zm-.001-7.509a3.023 3.023 0 0 0-3.019 3.019 3.023 3.023 0 0 0 3.019 3.019c1.673 0 3.019-1.319 3.019-2.973v-3.065H8.147zM8.148 8.981c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981H8.148zm-.001-7.51a3.023 3.023 0 0 0-3.019 3.019 3.023 3.023 0 0 0 3.019 3.019h3.117V1.471H8.147zM8.148 15.02c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.981H8.148zm-.001-7.51a3.023 3.023 0 0 0-3.019 3.019 3.023 3.023 0 0 0 3.019 3.019h3.117V7.51H8.147zM15.852 15.02c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49 4.49 2.014 4.49 4.49-2.014 4.49-4.49 4.49zm0-7.51a3.023 3.023 0 0 0-3.019 3.019 3.023 3.023 0 0 0 3.019 3.019 3.023 3.023 0 0 0 3.019-3.019 3.023 3.023 0 0 0-3.019-3.019z"/>
  </svg>
);

export const NotionLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.886l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
  </svg>
);

export const SalesforceLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M10.006 5.415a4.195 4.195 0 0 1 3.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.045-1.02-.105a3.75 3.75 0 0 1-3.3 1.95c-.6 0-1.17-.135-1.68-.39a4.83 4.83 0 0 1-4.32 2.685c-2.37 0-4.38-1.695-4.86-3.93-.21.03-.42.045-.63.045C1.275 16.559 0 15.269 0 13.674c0-1.095.6-2.055 1.5-2.55a4.01 4.01 0 0 1-.345-1.635c0-2.28 1.815-4.11 4.05-4.11 1.02 0 1.95.39 2.67 1.005a4.17 4.17 0 0 1 2.131-1.029z"/>
  </svg>
);

export const HubSpotLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M18.164 7.93V5.084a2.198 2.198 0 0 0 1.267-1.978v-.067a2.2 2.2 0 0 0-2.196-2.196h-.067a2.2 2.2 0 0 0-2.195 2.196v.067c0 .858.496 1.597 1.212 1.956v2.868a5.67 5.67 0 0 0-2.748 1.263l-7.16-5.576a2.505 2.505 0 0 0 .083-.614 2.534 2.534 0 0 0-2.529-2.531A2.535 2.535 0 0 0 1.3 3.004a2.534 2.534 0 0 0 2.53 2.529c.322 0 .627-.063.91-.174l7.04 5.481a5.71 5.71 0 0 0-.745 2.82c0 1.066.296 2.063.808 2.918L9.14 19.28a2.278 2.278 0 0 0-.673-.106 2.297 2.297 0 1 0 2.296 2.296c0-.227-.036-.446-.098-.653l2.619-2.622a5.705 5.705 0 0 0 3.386 1.109 5.731 5.731 0 0 0 5.728-5.73 5.73 5.73 0 0 0-4.234-5.524zm-1.453 8.132a2.61 2.61 0 0 1-2.608-2.608 2.61 2.61 0 0 1 2.608-2.608 2.61 2.61 0 0 1 2.608 2.608 2.61 2.61 0 0 1-2.608 2.608z"/>
  </svg>
);

export const MicrosoftTeamsLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M20.625 8.073h-1.27V5.628A1.627 1.627 0 0 0 17.73 4H9.92a1.627 1.627 0 0 0-1.625 1.628v6.27A1.627 1.627 0 0 0 9.92 13.52h5.905l.054 2.882-3.036 1.678v1.74l4.033-2.26.056 2.972h2.424a1.32 1.32 0 0 0 1.319-1.32V9.392a1.32 1.32 0 0 0-1.32-1.32h-.73zM17.23 5.5a1.23 1.23 0 1 1 0 2.461 1.23 1.23 0 0 1 0-2.461zM22.5 10.56a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    <path d="M8.333 14.583V7.833H2.5A1.5 1.5 0 0 0 1 9.333v9.334A1.5 1.5 0 0 0 2.5 20.167h9.333a1.5 1.5 0 0 0 1.5-1.5v-4.084zm-1.166 2.334H4.5v-1.167h2.667zm1.5-3.5H4.5V12.25h4.167z"/>
  </svg>
);

export const GoogleDriveLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="m7.71 3.5 1.23 2.05L7.05 8.8.32 8.8l1.89-3.15zM16.29 3.5l5.39 9.09-1.89 3.15-5.39-9.09zM8.7 8.13l5.39 9.09-1.89 3.15L6.81 11.28z"/>
  </svg>
);

export const TrelloLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.656 1.343 3 3 3h18c1.656 0 3-1.344 3-3V3c0-1.657-1.344-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44zm10.44-6c0 .794-.645 1.44-1.44 1.44H15c-.795 0-1.44-.646-1.44-1.44V4.56c0-.795.646-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44z"/>
  </svg>
);

export const JiraLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.006 1.006 0 0 0 23.013 0z"/>
  </svg>
);

export const ZapierLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M15.088 12.004l4.326-4.338-1.414-1.413-4.326 4.338V5.3h-2.002v5.29L7.346 6.254 5.932 7.667l4.326 4.337H4.939v2.003h5.32l-4.327 4.337 1.414 1.414 4.327-4.338v5.29h2.002v-5.29l4.326 4.337 1.414-1.413-4.326-4.337h5.319v-2.003z"/>
  </svg>
);

export const AsanaLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M18.78 12.653a5.22 5.22 0 1 0 0 10.44 5.22 5.22 0 0 0 0-10.44zm-13.56 0a5.22 5.22 0 1 0 0 10.44 5.22 5.22 0 0 0 0-10.44zM12 .907a5.22 5.22 0 1 0 0 10.44 5.22 5.22 0 0 0 0-10.44z"/>
  </svg>
);

export const DropboxLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M6 1.807 0 5.629l6 3.822 6.008-3.822L6 1.807zM18.008 1.807 12 5.629l6.008 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.008-3.822L6 9.452 0 13.274zM18.008 9.452l-6.008 3.822 6.008 3.822 6-3.822-6-3.822zM6 18.371l6.008 3.822 6-3.822-6-3.822L6 18.371z"/>
  </svg>
);

interface BrandLogoItemProps {
  name: string;
  Logo: React.ComponentType<{ className?: string }>;
  color: string;
  className?: string;
  delay?: number;
}

export function BrandLogoItem({ name, Logo, color, className, delay = 0 }: BrandLogoItemProps) {
  return (
    <div
      className={cn(
        "group relative w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl",
        className
      )}
      style={{ 
        backgroundColor: color,
        animationDelay: `${delay}ms`
      }}
      title={name}
    >
      <Logo className="w-6 h-6 md:w-7 md:h-7 text-white" />
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap bg-background/90 px-2 py-1 rounded shadow-sm">
          {name}
        </span>
      </div>
    </div>
  );
}

export const brandLogos = [
  { name: "Slack", Logo: SlackLogo, color: "#4A154B" },
  { name: "Gmail", Logo: GmailLogo, color: "#EA4335" },
  { name: "Figma", Logo: FigmaLogo, color: "#F24E1E" },
  { name: "Notion", Logo: NotionLogo, color: "#000000" },
  { name: "Salesforce", Logo: SalesforceLogo, color: "#00A1E0" },
  { name: "HubSpot", Logo: HubSpotLogo, color: "#FF7A59" },
  { name: "Jira", Logo: JiraLogo, color: "#0052CC" },
  { name: "Zapier", Logo: ZapierLogo, color: "#FF4A00" },
  { name: "Teams", Logo: MicrosoftTeamsLogo, color: "#6264A7" },
  { name: "Drive", Logo: GoogleDriveLogo, color: "#4285F4" },
  { name: "Trello", Logo: TrelloLogo, color: "#0079BF" },
  { name: "Asana", Logo: AsanaLogo, color: "#F06A6A" },
];

interface BrandLogosGridProps {
  className?: string;
  maxItems?: number;
  animate?: boolean;
}

export function BrandLogosGrid({ className, maxItems = 8, animate = true }: BrandLogosGridProps) {
  const logos = brandLogos.slice(0, maxItems);
  
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3 md:gap-4", className)}>
      {logos.map((logo, i) => (
        <BrandLogoItem
          key={logo.name}
          {...logo}
          delay={animate ? i * 100 : 0}
          className={animate ? "animate-fade-up" : ""}
        />
      ))}
    </div>
  );
}
