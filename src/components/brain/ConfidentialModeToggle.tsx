import { Shield, ShieldAlert, Lock, Eye, EyeOff, Trash2, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ConfidentialModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onWipe?: () => void;
  sessionTimeRemaining?: number;
  compact?: boolean;
}

export function ConfidentialModeToggle({ 
  enabled, 
  onToggle, 
  onWipe,
  sessionTimeRemaining,
  compact = false 
}: ConfidentialModeToggleProps) {
  const [timeLeft, setTimeLeft] = useState(sessionTimeRemaining || 0);

  useEffect(() => {
    if (!enabled || !sessionTimeRemaining) return;
    
    setTimeLeft(sessionTimeRemaining);
    
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [enabled, sessionTimeRemaining]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onToggle(!enabled)}
              className={cn(
                "p-2 rounded-lg transition-all relative",
                enabled 
                  ? "bg-red-500/10 text-red-500 ring-1 ring-red-500/30" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {enabled ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
              {enabled && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {enabled ? "Mode Confidentiel ACTIVÉ" : "Activer le mode confidentiel"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div 
      className={cn(
        "p-4 rounded-xl border transition-all",
        enabled 
          ? "bg-red-500/5 border-red-500/30 shadow-lg shadow-red-500/5" 
          : "bg-secondary/50 border-border"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2.5 rounded-xl relative",
            enabled ? "bg-red-500/10 text-red-500" : "bg-muted text-muted-foreground"
          )}>
            {enabled ? <ShieldAlert className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
            {enabled && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Mode Ultra-Confidentiel</span>
              {enabled && (
                <Badge className="text-[10px] px-1.5 py-0 h-4 bg-red-500 text-white border-0">
                  ACTIF
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {enabled 
                ? 'Données 100% en mémoire, aucun stockage externe'
                : 'Activez pour une protection maximale'}
            </p>
          </div>
        </div>
        <Switch 
          checked={enabled} 
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-red-500"
        />
      </div>
      
      {enabled && (
        <div className="mt-4 pt-3 border-t border-red-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Session expire dans</span>
            </div>
            <span className={cn(
              "font-mono font-medium",
              timeLeft < 120000 ? "text-red-500" : "text-foreground"
            )}>
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <EyeOff className="w-3.5 h-3.5 text-emerald-500" />
              <span>Pas de stockage DB</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Pas de cache navigateur</span>
            </div>
          </div>
          
          {onWipe && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onWipe}
              className="w-full mt-2 text-red-500 border-red-500/30 hover:bg-red-500/10 hover:text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" />
              Effacer la mémoire maintenant
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Security warning banner
export function ConfidentialBanner({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  
  return (
    <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-2 flex items-center justify-center gap-2">
      <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
      <span className="text-xs font-medium text-red-500">
        🔒 MODE ULTRA-CONFIDENTIEL ACTIVÉ — Aucune donnée n'est stockée
      </span>
      <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
    </div>
  );
}
