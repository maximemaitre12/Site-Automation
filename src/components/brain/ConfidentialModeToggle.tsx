import { Shield, ShieldOff, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConfidentialModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  compact?: boolean;
}

export function ConfidentialModeToggle({ enabled, onToggle, compact = false }: ConfidentialModeToggleProps) {
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onToggle(!enabled)}
              className={cn(
                "p-2 rounded-lg transition-all",
                enabled 
                  ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {enabled ? <Shield className="w-5 h-5" /> : <ShieldOff className="w-5 h-5" />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="font-medium">Mode Confidentiel {enabled ? 'activé' : 'désactivé'}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {enabled 
                ? 'Vos données ne sont PAS envoyées aux serveurs IA externes. Réponses basées uniquement sur vos documents internes.'
                : 'L\'IA utilise des services externes pour enrichir les réponses (recherche web, actualités).'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div 
      className={cn(
        "p-3 rounded-xl border transition-all",
        enabled 
          ? "bg-emerald-500/5 border-emerald-500/30" 
          : "bg-secondary/50 border-border"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            enabled ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
          )}>
            {enabled ? <Shield className="w-5 h-5" /> : <ShieldOff className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Mode Confidentiel</span>
              {enabled && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-emerald-500/50 text-emerald-500">
                  ACTIVÉ
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {enabled 
                ? 'Données 100% privées, pas d\'envoi externe'
                : 'L\'IA peut utiliser des services externes'}
            </p>
          </div>
        </div>
        <Switch 
          checked={enabled} 
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-emerald-500"
        />
      </div>
    </div>
  );
}
