import { Card } from "@/components/ui/card";
import { AetherDocument } from "@/hooks/useAetherDocs";
import { 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Clock,
  FolderOpen,
  FileCheck
} from "lucide-react";
import { format, subDays, isAfter } from "date-fns";
import { fr } from "date-fns/locale";

interface DocStatsProps {
  documents: AetherDocument[];
  foldersCount: number;
}

export function DocStats({ documents, foldersCount }: DocStatsProps) {
  const totalDocs = documents.length;
  const analyzedDocs = documents.filter(d => d.ai_summary).length;
  const analyzedPercent = totalDocs > 0 ? Math.round((analyzedDocs / totalDocs) * 100) : 0;
  
  // Documents created in last 7 days
  const sevenDaysAgo = subDays(new Date(), 7);
  const recentDocs = documents.filter(d => isAfter(new Date(d.created_at), sevenDaysAgo)).length;
  
  // Most recent document
  const latestDoc = documents[0];

  const stats = [
    {
      label: "Documents",
      value: totalDocs,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      label: "Analysés par IA",
      value: `${analyzedPercent}%`,
      subValue: `${analyzedDocs} sur ${totalDocs}`,
      icon: Sparkles,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10"
    },
    {
      label: "Cette semaine",
      value: `+${recentDocs}`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      label: "Dossiers",
      value: foldersCount,
      icon: FolderOpen,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    }
  ];

  return (
    <div className="px-4 md:px-6 py-4 border-b border-border bg-gradient-to-r from-background to-muted/30">
      <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 min-w-fit">
            <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground whitespace-nowrap">{stat.label}</p>
            </div>
          </div>
        ))}
        
        {/* Latest document */}
        {latestDoc && (
          <div className="flex items-center gap-3 min-w-fit pl-4 border-l border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="max-w-[180px]">
              <p className="text-sm font-medium text-foreground truncate">{latestDoc.title}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(latestDoc.updated_at), "dd MMM 'à' HH:mm", { locale: fr })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
