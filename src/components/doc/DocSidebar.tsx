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
  FileText,
  FileImage,
  FileSpreadsheet,
  Files,
  Clock,
  Star,
  Archive
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface DocSidebarProps {
  folders: DocFolder[];
  currentFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

const quickAccess = [
  { id: 'all', name: 'Tous les documents', icon: Files, value: null },
  { id: 'recent', name: 'Récents', icon: Clock, value: 'recent' },
  { id: 'starred', name: 'Favoris', icon: Star, value: 'starred' },
  { id: 'archived', name: 'Archivés', icon: Archive, value: 'archived' },
];

const fileTypes = [
  { id: 'pdf', name: 'PDF', icon: FileText, color: 'text-red-500' },
  { id: 'images', name: 'Images', icon: FileImage, color: 'text-blue-500' },
  { id: 'spreadsheets', name: 'Tableurs', icon: FileSpreadsheet, color: 'text-green-500' },
];

export function DocSidebar({
  folders,
  currentFolder,
  onFolderSelect,
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
    <div className="w-64 border-r border-border bg-secondary flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          AETHER Doc
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-6">
          {/* Quick Access */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Accès rapide
            </p>
            <div className="space-y-1">
              {quickAccess.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onFolderSelect(item.value as string | null)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    currentFolder === item.value
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* File Types */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Par type
            </p>
            <div className="space-y-1">
              {fileTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => onFolderSelect(`type:${type.id}`)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    currentFolder === `type:${type.id}`
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <type.icon className={cn("w-4 h-4", type.color)} />
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Folders */}
          <div>
            <div className="flex items-center justify-between mb-2 px-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Dossiers
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {isCreating && (
              <div className="px-2 mb-2">
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
                  className="h-8 text-sm"
                />
              </div>
            )}

            <div className="space-y-1">
              {rootFolders.map((folder) => (
                <ContextMenu key={folder.id}>
                  <ContextMenuTrigger>
                    <button
                      onClick={() => onFolderSelect(folder.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        currentFolder === folder.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {currentFolder === folder.id ? (
                        <FolderOpen className="w-4 h-4" style={{ color: folder.color }} />
                      ) : (
                        <Folder className="w-4 h-4" style={{ color: folder.color }} />
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
              ))}

              {rootFolders.length === 0 && !isCreating && (
                <p className="text-xs text-muted-foreground px-3 py-2">
                  Aucun dossier créé
                </p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
