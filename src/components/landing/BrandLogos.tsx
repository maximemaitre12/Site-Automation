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

export const StripeLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
  </svg>
);

export const ShopifyLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.756c-.022-.142-.153-.174-.198-.174s-1.439-.099-1.439-.099-.949-.949-1.078-1.078c-.039-.039-.086-.055-.131-.063v20.48l.255.251zM12.137 4.425l-.655 2.006s-.7-.376-1.527-.376c-1.236 0-1.298.775-1.298.97 0 1.065 2.776 1.475 2.776 3.975 0 1.965-1.247 3.23-2.93 3.23-2.019 0-3.053-1.257-3.053-1.257l.54-1.784s1.062.912 1.959.912c.584 0 .824-.46.824-.797 0-1.391-2.279-1.453-2.279-3.744 0-1.926 1.382-3.792 4.179-3.792.855 0 1.464.246 1.464.246zM14.285.904c.15.019.292.085.292.085l.005-.019s-1.147-.433-2.831.209c-.202.077-.416.167-.639.273.177-.061.362-.109.551-.147.656-.132 1.376-.141 1.798-.158.296-.005.568.019.824.057v-.3z"/>
  </svg>
);

export const AirtableLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6", className)} fill="currentColor">
    <path d="M11.992 1.966L2.47 5.435a.3.3 0 000 .566l9.51 3.465a.3.3 0 00.205 0l9.51-3.465a.3.3 0 000-.566l-9.51-3.469a.3.3 0 00-.193 0zM1.5 7.626v8.85a.3.3 0 00.192.28l9.51 3.564a.3.3 0 00.298-.028.3.3 0 00.124-.252V11.19a.3.3 0 00-.192-.28L1.922 7.346a.3.3 0 00-.422.28zm21 0a.3.3 0 00-.422-.28l-9.51 3.564a.3.3 0 00-.192.28v8.85a.3.3 0 00.422.28l9.51-3.564a.3.3 0 00.192-.28z"/>
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
  { name: "Slack", Logo: SlackLogo, color: "hsl(285, 40%, 45%)" },
  { name: "Gmail", Logo: GmailLogo, color: "hsl(350, 50%, 50%)" },
  { name: "Figma", Logo: FigmaLogo, color: "hsl(15, 55%, 52%)" },
  { name: "Notion", Logo: NotionLogo, color: "hsl(220, 25%, 30%)" },
  { name: "Salesforce", Logo: SalesforceLogo, color: "hsl(195, 55%, 45%)" },
  { name: "HubSpot", Logo: HubSpotLogo, color: "hsl(35, 60%, 50%)" },
  { name: "Jira", Logo: JiraLogo, color: "hsl(215, 65%, 50%)" },
  { name: "Zapier", Logo: ZapierLogo, color: "hsl(5, 55%, 50%)" },
  { name: "Teams", Logo: MicrosoftTeamsLogo, color: "hsl(255, 45%, 55%)" },
  { name: "Drive", Logo: GoogleDriveLogo, color: "hsl(145, 45%, 42%)" },
  { name: "Trello", Logo: TrelloLogo, color: "hsl(175, 50%, 40%)" },
  { name: "Asana", Logo: AsanaLogo, color: "hsl(320, 45%, 50%)" },
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

// Cloud-style layout positions - more centered for mobile
const cloudPositions = [
  { x: 50, y: 12, scale: 1.1, delay: 0 },
  { x: 25, y: 32, scale: 1, delay: 80 },
  { x: 75, y: 28, scale: 1, delay: 120 },
  { x: 38, y: 52, scale: 0.95, delay: 160 },
  { x: 62, y: 48, scale: 1.05, delay: 200 },
  { x: 20, y: 68, scale: 0.9, delay: 240 },
  { x: 80, y: 65, scale: 0.9, delay: 280 },
  { x: 50, y: 78, scale: 0.95, delay: 320 },
];

interface BrandLogosCloudProps {
  className?: string;
  maxItems?: number;
}

export function BrandLogosCloud({ className, maxItems = 8 }: BrandLogosCloudProps) {
  const logos = brandLogos.slice(0, Math.min(maxItems, cloudPositions.length));
  
  return (
    <div className={cn("relative w-full max-w-sm sm:max-w-md mx-auto h-44 sm:h-52", className)}>
      {/* Soft glow background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-3xl" />
      
      {logos.map((logo, i) => {
        const pos = cloudPositions[i];
        return (
          <div
            key={logo.name}
            className="absolute animate-cloud-fade-in"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) scale(${pos.scale})`,
              animationDelay: `${pos.delay}ms`,
              opacity: 0,
            }}
          >
            <div
              className="group relative w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style={{ backgroundColor: logo.color }}
              title={logo.name}
            >
              <logo.Logo className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              
              {/* Tooltip on hover */}
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground whitespace-nowrap bg-background/95 px-2 py-0.5 rounded shadow-sm border border-border/50">
                  {logo.name}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* "+more" indicator */}
      <div
        className="absolute animate-cloud-fade-in"
        style={{
          left: "50%",
          top: "92%",
          transform: "translate(-50%, -50%)",
          animationDelay: "450ms",
          opacity: 0,
        }}
      >
        <span className="text-xs text-muted-foreground font-medium bg-secondary/60 px-3 py-1 rounded-full border border-border/30">
          +100 integrations
        </span>
      </div>
    </div>
  );
}
