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
      <div className="px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs sm:text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.id || 'root'} className="flex items-center gap-1 min-w-0">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            <button
              onClick={() => onBreadcrumbClick(crumb.id)}
              className={cn(
                "min-w-0 text-left whitespace-normal break-words hover:text-primary transition-colors",
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
      <div className="px-3 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative w-full sm:flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* View toggle */}
          <div className="flex items-center border border-border rounded-lg p-1 shrink-0">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 sm:h-8 sm:w-8"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 sm:h-8 sm:w-8"
              onClick={() => onViewModeChange('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={onUploadClick}
            className="flex-1 sm:flex-none justify-center text-xs sm:text-sm"
          >
            <Upload className="w-4 h-4 sm:mr-2" />
            <span className="sm:hidden">Import</span>
            <span className="hidden sm:inline">Importer</span>
          </Button>
          <Button
            size="sm"
            onClick={onGenerateClick}
            className="flex-1 sm:flex-none justify-center text-xs sm:text-sm"
          >
            <Wand2 className="w-4 h-4 sm:mr-2" />
            Générer
          </Button>
        </div>
      </div>
    </div>
  );
}
