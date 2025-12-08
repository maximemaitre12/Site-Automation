import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Upload,
  Wand2,
  Grid3X3,
  List,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocHeaderProps {
  breadcrumbs: { id: string | null; name: string }[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onUploadClick: () => void;
  onGenerateClick: () => void;
  onBreadcrumbClick: (id: string | null) => void;
}

export function DocHeader({
  breadcrumbs,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onUploadClick,
  onGenerateClick,
  onBreadcrumbClick
}: DocHeaderProps) {
  return (
    <div className="border-b border-border bg-background">
      {/* Breadcrumbs */}
      <div className="px-6 py-3 flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.id || 'root'} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            <button
              onClick={() => onBreadcrumbClick(crumb.id)}
              className={cn(
                "hover:text-primary transition-colors",
                index === breadcrumbs.length - 1
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>

      {/* Actions bar */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center border border-border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => onViewModeChange('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Actions */}
          <Button variant="outline" onClick={onUploadClick}>
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button onClick={onGenerateClick}>
            <Wand2 className="w-4 h-4 mr-2" />
            Générer
          </Button>
        </div>
      </div>
    </div>
  );
}
