import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Shield, 
  ClipboardList,
  FolderKanban,
  Sparkles
} from "lucide-react";

export type DocCategory = 'all' | 'hr' | 'sales' | 'compliance' | 'report' | 'project' | 'ai';

interface DocCategoryTabsProps {
  activeCategory: DocCategory;
  onCategoryChange: (category: DocCategory) => void;
  counts?: Record<DocCategory, number>;
}

const categories: { id: DocCategory; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'all', label: 'Tous', icon: FileText, color: 'text-foreground' },
  { id: 'hr', label: 'RH', icon: Users, color: 'text-blue-500' },
  { id: 'sales', label: 'Sales', icon: TrendingUp, color: 'text-emerald-500' },
  { id: 'compliance', label: 'Compliance', icon: Shield, color: 'text-amber-500' },
  { id: 'report', label: 'Rapports', icon: ClipboardList, color: 'text-violet-500' },
  { id: 'project', label: 'Projets', icon: FolderKanban, color: 'text-rose-500' },
  { id: 'ai', label: 'IA', icon: Sparkles, color: 'text-primary' },
];

export function DocCategoryTabs({ activeCategory, onCategoryChange, counts }: DocCategoryTabsProps) {
  return (
    <div className="flex items-center gap-1 px-4 md:px-6 py-2 border-b border-border overflow-x-auto scrollbar-hide">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = counts?.[cat.id] || 0;
        
        return (
          <Button
            key={cat.id}
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "flex items-center gap-2 shrink-0 transition-all",
              isActive && "shadow-sm"
            )}
          >
            <cat.icon className={cn("w-4 h-4", isActive ? cat.color : "text-muted-foreground")} />
            <span className={isActive ? "font-medium" : ""}>{cat.label}</span>
            {counts && count > 0 && (
              <Badge 
                variant={isActive ? "default" : "secondary"} 
                className="ml-1 text-xs px-1.5 py-0"
              >
                {count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}
