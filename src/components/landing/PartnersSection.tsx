import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const partners = [
  {
    name: "AWS",
    logo: (
      <svg viewBox="0 0 120 40" className="h-8 w-auto">
        <text x="10" y="30" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="28" fill="currentColor" letterSpacing="-1">
          aws
        </text>
      </svg>
    ),
  },
  {
    name: "Microsoft",
    logo: (
      <div className="flex items-center gap-2">
        <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
          <div className="bg-[#f25022] rounded-[1px]" />
          <div className="bg-[#7fba00] rounded-[1px]" />
          <div className="bg-[#00a4ef] rounded-[1px]" />
          <div className="bg-[#ffb900] rounded-[1px]" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-slate-700">Microsoft</span>
      </div>
    ),
  },
  {
    name: "Google Cloud",
    logo: (
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-lg font-semibold tracking-tight text-slate-700">Google Cloud</span>
      </div>
    ),
  },
  {
    name: "Confluent",
    logo: (
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-3.07c-2.02-.25-3.74-1.35-4.84-2.93l2.1-1.54c.7.97 1.72 1.66 2.74 1.84V8.2c-2.13-.46-4-1.97-4-4.2h2.5c0 1.08.93 1.93 1.5 2.24V2h2.5v4.24c.57-.31 1.5-1.16 1.5-2.24H17c0 2.23-1.87 3.74-4 4.2v3.6c1.02-.18 2.04-.87 2.74-1.84l2.1 1.54c-1.1 1.58-2.82 2.68-4.84 2.93v3.07H11z" fill="currentColor"/>
        </svg>
        <span className="text-lg font-semibold tracking-tight text-slate-700">Confluent</span>
      </div>
    ),
  },
];

export function PartnersSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
      {/* Subtle top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div
        ref={ref}
        className={cn(
          "max-w-5xl mx-auto px-4 sm:px-6 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Nos partenaires
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Nous collaborons avec les leaders du cloud et de la data pour déployer des solutions fiables à grande échelle.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {partners.map((partner, i) => (
            <div
              key={partner.name}
              className="group flex flex-col items-center gap-4 p-6 sm:p-8 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="h-10 flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors duration-300">
                {partner.logo}
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
