import { cn } from "@/lib/utils";
import { AetherDocument, DocFolder } from "@/hooks/useAetherDocs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  FileImage,
  FileSpreadsheet,
  File,
  Folder,
  MoreVertical,
  Trash2,
  Download,
  Eye,
  Sparkles,
  Pencil,
  Star,
  Archive,
  ArchiveRestore,
  User,
  Users,
  Building2,
  Share2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AccessLevel } from "./DocSidebar";

interface DocGridProps {
  documents: AetherDocument[];
  folders: DocFolder[];
  viewMode: 'grid' | 'list';
  currentAccessLevel: AccessLevel;
  onDocumentClick: (doc: AetherDocument) => void;
  onFolderClick: (folder: DocFolder) => void;
  onDeleteDocument: (docId: string) => void;
  onMoveDocument: (docId: string, folderId: string | null) => void;
  onRenameDocument: (docId: string, currentTitle: string) => void;
  onToggleFavorite: (docId: string) => void;
  onToggleArchive: (docId: string) => void;
}

const getFileIcon = (fileType: string | null) => {
  if (!fileType) return FileText;
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) return FileText;
  if (type.includes('image')) return FileImage;
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv') || type.includes('sheet')) return FileSpreadsheet;
  if (type.includes('word') || type.includes('document') || type.includes('msword')) return File;
  if (type.includes('markdown') || type.includes('text')) return FileText;
  return FileText;
};

const getFileColor = (fileType: string | null) => {
  if (!fileType) return { bg: 'bg-primary/10', text: 'text-primary', gradient: 'from-primary/20 to-primary/5' };
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) return { bg: 'bg-red-500/10', text: 'text-red-600', gradient: 'from-red-500/20 to-red-500/5' };
  if (type.includes('image')) return { bg: 'bg-blue-500/10', text: 'text-blue-600', gradient: 'from-blue-500/20 to-blue-500/5' };
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv') || type.includes('sheet')) 
    return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', gradient: 'from-emerald-500/20 to-emerald-500/5' };
  if (type.includes('word') || type.includes('document') || type.includes('msword'))
    return { bg: 'bg-blue-600/10', text: 'text-blue-700', gradient: 'from-blue-600/20 to-blue-600/5' };
  if (type.includes('markdown') || type.includes('text'))
    return { bg: 'bg-slate-500/10', text: 'text-slate-600', gradient: 'from-slate-500/20 to-slate-500/5' };
  return { bg: 'bg-primary/10', text: 'text-primary', gradient: 'from-primary/20 to-primary/5' };
};

const getAccessIcon = (accessLevel: string | null) => {
  switch (accessLevel) {
    case 'team': return Users;
    case 'company': return Building2;
    default: return User;
  }
};

const getAccessColor = (accessLevel: string | null) => {
  switch (accessLevel) {
    case 'team': return 'text-emerald-600 bg-emerald-500/10';
    case 'company': return 'text-purple-600 bg-purple-500/10';
    default: return 'text-blue-600 bg-blue-500/10';
  }
};

const getAccessLabel = (accessLevel: string | null) => {
  switch (accessLevel) {
    case 'team': return 'Équipe';
    case 'company': return 'Entreprise';
    default: return 'Privé';
  }
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function DocGrid({
  documents,
  folders,
  viewMode,
  currentAccessLevel,
  onDocumentClick,
  onFolderClick,
  onDeleteDocument,
  onMoveDocument,
  onRenameDocument,
  onToggleFavorite,
  onToggleArchive
}: DocGridProps) {
  if (documents.length === 0 && folders.length === 0) {
    const accessLabels = {
      personal: { title: 'Aucun document personnel', desc: 'Vos documents privés apparaîtront ici' },
      team: { title: 'Aucun document d\'équipe', desc: 'Les documents partagés avec votre équipe apparaîtront ici' },
      company: { title: 'Aucun document entreprise', desc: 'Les documents accessibles à toute l\'entreprise apparaîtront ici' }
    };
    const labels = accessLabels[currentAccessLevel];

    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-muted to-muted/50 border border-border flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold text-xl mb-2">{labels.title}</h3>
          <p className="text-muted-foreground text-sm">
            {labels.desc}
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex-1 overflow-auto">
        <div className="divide-y divide-border">
          {/* Folders first */}
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => onFolderClick(folder)}
              className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-200/50 flex items-center justify-center">
                <Folder className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{folder.name}</p>
                <p className="text-sm text-muted-foreground">Dossier</p>
              </div>
            </div>
          ))}

          {/* Documents */}
          {documents.map((doc) => {
            const FileIcon = getFileIcon(doc.file_type);
            const colors = getFileColor(doc.file_type);
            const hasAI = doc.ai_summary;
            const AccessIcon = getAccessIcon(doc.access_level);
            const accessColors = getAccessColor(doc.access_level);
            
            return (
              <div
                key={doc.id}
                onClick={() => onDocumentClick(doc)}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 cursor-pointer transition-colors group"
              >
                <div className={cn(
                  "w-11 h-11 rounded-xl border border-border/50 flex items-center justify-center relative bg-gradient-to-br",
                  colors.gradient
                )}>
                  <FileIcon className={cn("w-5 h-5", colors.text)} />
                  {hasAI && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                      <Sparkles className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{doc.title}</p>
                    {doc.is_favorite && (
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium", accessColors)}>
                      <AccessIcon className="w-2.5 h-2.5" />
                      {getAccessLabel(doc.access_level)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(doc.updated_at), 'dd MMM yyyy', { locale: fr })}
                    </span>
                    {doc.file_size && (
                      <span className="text-xs text-muted-foreground">
                        • {formatFileSize(doc.file_size)}
                      </span>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDocumentClick(doc); }}>
                      <Eye className="w-4 h-4 mr-2" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRenameDocument(doc.id, doc.title); }}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Renommer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleFavorite(doc.id); }}>
                      <Star className={cn("w-4 h-4 mr-2", doc.is_favorite && "fill-amber-400 text-amber-400")} />
                      {doc.is_favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleArchive(doc.id); }}>
                      {doc.is_archived ? (
                        <>
                          <ArchiveRestore className="w-4 h-4 mr-2" />
                          Restaurer
                        </>
                      ) : (
                        <>
                          <Archive className="w-4 h-4 mr-2" />
                          Archiver
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.id); }}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Grid View - Modern Cards
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
        {/* Folders first */}
        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => onFolderClick(folder)}
            className="group cursor-pointer"
          >
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/50 flex items-center justify-center mb-3 group-hover:shadow-xl group-hover:border-amber-300 group-hover:scale-[1.02] transition-all duration-200">
              <Folder className="w-14 h-14 text-amber-500 group-hover:scale-105 transition-transform" />
            </div>
            <p className="font-medium text-sm truncate px-1">{folder.name}</p>
            <p className="text-xs text-muted-foreground px-1">Dossier</p>
          </div>
        ))}

        {/* Documents - Modern Cards */}
        {documents.map((doc) => {
          const FileIcon = getFileIcon(doc.file_type);
          const colors = getFileColor(doc.file_type);
          const hasAI = doc.ai_summary;
          const AccessIcon = getAccessIcon(doc.access_level);
          const accessColors = getAccessColor(doc.access_level);
          
          return (
            <div
              key={doc.id}
              onClick={() => onDocumentClick(doc)}
              className="group cursor-pointer"
            >
              {/* Document Card */}
              <div className={cn(
                "aspect-[4/3] rounded-2xl border border-border/60 flex flex-col items-center justify-center mb-3 transition-all duration-200 relative overflow-hidden",
                "bg-gradient-to-br from-card to-muted/30",
                "group-hover:shadow-xl group-hover:border-primary/30 group-hover:scale-[1.02]"
              )}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />

                {/* File Icon Container */}
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm",
                  "bg-gradient-to-br",
                  colors.gradient
                )}>
                  <FileIcon className={cn("w-8 h-8", colors.text)} />
                </div>
                
                {/* AI Badge */}
                {hasAI && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                    <Sparkles className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}

                {/* Access Level Badge */}
                <div className={cn(
                  "absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium shadow-sm",
                  accessColors
                )}>
                  <AccessIcon className="w-3 h-3" />
                </div>

                {/* Favorite */}
                {doc.is_favorite && (
                  <div className="absolute bottom-3 right-3">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow" />
                  </div>
                )}

                {/* Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-3 left-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-background border shadow-lg z-50">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDocumentClick(doc); }}>
                      <Eye className="w-4 h-4 mr-2" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRenameDocument(doc.id, doc.title); }}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Renommer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleFavorite(doc.id); }}>
                      <Star className={cn("w-4 h-4 mr-2", doc.is_favorite && "fill-amber-400 text-amber-400")} />
                      {doc.is_favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleArchive(doc.id); }}>
                      {doc.is_archived ? (
                        <>
                          <ArchiveRestore className="w-4 h-4 mr-2" />
                          Restaurer
                        </>
                      ) : (
                        <>
                          <Archive className="w-4 h-4 mr-2" />
                          Archiver
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); onDeleteDocument(doc.id); }}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Document Info */}
              <div className="px-1">
                <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                  {doc.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(doc.updated_at), 'dd MMM yyyy', { locale: fr })}
                  {doc.file_size && ` • ${formatFileSize(doc.file_size)}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
