import { useState } from "react";
import { cn } from "@/lib/utils";
import { DocFolder } from "@/hooks/useAetherDocs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  User,
  Users,
  Building2,
  Clock,
  Star,
  Archive,
  FolderPlus
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export type AccessLevel = 'personal' | 'team' | 'company';

interface DocSidebarProps {
  folders: DocFolder[];
  currentFolder: string | null;
  currentAccessLevel: AccessLevel;
  onFolderSelect: (folderId: string | null) => void;
  onAccessLevelChange: (level: AccessLevel) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

const accessLevels = [
  { 
    id: 'personal' as AccessLevel, 
    name: 'Mes documents', 
    icon: User, 
    description: 'Documents privés',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-200'
  },
  { 
    id: 'team' as AccessLevel, 
    name: 'Équipe', 
    icon: Users, 
    description: 'Partagés avec mon équipe',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-200'
  },
  { 
    id: 'company' as AccessLevel, 
    name: 'Entreprise', 
    icon: Building2, 
    description: 'Accessibles à tous',
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-200'
  },
];

const quickFilters = [
  { id: 'recent', name: 'Récents', icon: Clock },
  { id: 'starred', name: 'Favoris', icon: Star },
  { id: 'archived', name: 'Archivés', icon: Archive },
];

export function DocSidebar({
  folders,
  currentFolder,
  currentAccessLevel,
  onFolderSelect,
  onAccessLevelChange,
  onCreateFolder,
  onDeleteFolder
}: DocSidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreate = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName("");
      setIsCreating(false);
    }
  };

  const rootFolders = folders.filter(f => !f.parent_id);

  return (
    <div className="w-64 border-r border-border bg-card/50 flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Access Levels - Main Navigation */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-1">
              Espace
            </p>
            <div className="space-y-1">
              {accessLevels.map((level) => {
                const isActive = currentAccessLevel === level.id && !currentFolder?.startsWith('filter:');
                return (
                  <button
                    key={level.id}
                    onClick={() => {
                      onAccessLevelChange(level.id);
                      onFolderSelect(null);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                      isActive
                        ? cn("bg-primary text-primary-foreground shadow-sm")
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      isActive ? "bg-primary-foreground/20" : level.bgColor
                    )}>
                      <level.icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : level.color)} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium truncate">{level.name}</p>
                      <p className={cn(
                        "text-[10px] truncate",
                        isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {level.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-border" />

          {/* Quick Filters */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">
              Filtres rapides
            </p>
            <div className="space-y-0.5">
              {quickFilters.map((filter) => {
                const isActive = currentFolder === `filter:${filter.id}`;
                return (
                  <button
                    key={filter.id}
                    onClick={() => onFolderSelect(`filter:${filter.id}`)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <filter.icon className="w-4 h-4" />
                    <span>{filter.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-border" />

          {/* Folders */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Dossiers
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-primary/10"
                onClick={() => setIsCreating(true)}
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {isCreating && (
              <div className="mb-2">
                <Input
                  placeholder="Nom du dossier..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') setIsCreating(false);
                  }}
                  onBlur={handleCreate}
                  autoFocus
                  className="h-8 text-sm bg-background"
                />
              </div>
            )}

            <div className="space-y-0.5">
              {rootFolders.map((folder) => {
                const isActive = currentFolder === folder.id;
                return (
                  <ContextMenu key={folder.id}>
                    <ContextMenuTrigger>
                      <button
                        onClick={() => onFolderSelect(folder.id)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        {isActive ? (
                          <FolderOpen className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Folder className="w-4 h-4 text-amber-500/70" />
                        )}
                        <span className="truncate">{folder.name}</span>
                      </button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        className="text-destructive"
                        onClick={() => onDeleteFolder(folder.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })}

              {rootFolders.length === 0 && !isCreating && (
                <p className="text-xs text-muted-foreground px-3 py-2 italic">
                  Aucun dossier
                </p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
