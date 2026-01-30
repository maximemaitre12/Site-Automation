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
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DocGridProps {
  documents: AetherDocument[];
  folders: DocFolder[];
  viewMode: 'grid' | 'list';
  onDocumentClick: (doc: AetherDocument) => void;
  onFolderClick: (folder: DocFolder) => void;
  onDeleteDocument: (docId: string) => void;
  onMoveDocument: (docId: string, folderId: string | null) => void;
}

const getFileIcon = (fileType: string | null) => {
  if (!fileType) return FileText;
  if (fileType.includes('pdf')) return FileText;
  if (fileType.includes('image')) return FileImage;
  if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) return FileSpreadsheet;
  return FileText;
};

const getFileColor = (fileType: string | null) => {
  if (!fileType) return { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' };
  if (fileType.includes('pdf')) return { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-200' };
  if (fileType.includes('image')) return { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-200' };
  if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) 
    return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-200' };
  return { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' };
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
  onDocumentClick,
  onFolderClick,
  onDeleteDocument,
  onMoveDocument
}: DocGridProps) {
  if (documents.length === 0 && folders.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h3 className="font-semibold text-xl mb-3">Aucun document</h3>
          <p className="text-muted-foreground">
            Importez vos premiers documents ou générez-en automatiquement avec l'IA.
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
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-200 flex items-center justify-center">
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
            
            return (
              <div
                key={doc.id}
                onClick={() => onDocumentClick(doc)}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 cursor-pointer transition-colors group"
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl border flex items-center justify-center relative",
                  colors.bg, colors.border
                )}>
                  <FileIcon className={cn("w-5 h-5", colors.text)} />
                  {hasAI && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(doc.updated_at), 'dd MMMM yyyy', { locale: fr })}
                    {doc.file_size && ` • ${formatFileSize(doc.file_size)}`}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDocumentClick(doc); }}>
                      <Eye className="w-4 h-4 mr-2" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
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

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Folders first */}
        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => onFolderClick(folder)}
            className="group cursor-pointer"
          >
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:border-amber-300 transition-all">
              <Folder className="w-12 h-12 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="font-medium text-sm truncate px-1">{folder.name}</p>
            <p className="text-xs text-muted-foreground px-1">Dossier</p>
          </div>
        ))}

        {/* Documents */}
        {documents.map((doc) => {
          const FileIcon = getFileIcon(doc.file_type);
          const colors = getFileColor(doc.file_type);
          const hasAI = doc.ai_summary;
          
          return (
            <div
              key={doc.id}
              onClick={() => onDocumentClick(doc)}
              className="group cursor-pointer relative"
            >
              {/* Document Card */}
              <div className={cn(
                "aspect-[4/3] rounded-xl border flex flex-col items-center justify-center mb-3 transition-all relative",
                "bg-muted/30",
                "group-hover:shadow-lg group-hover:border-primary/40 group-hover:-translate-y-0.5",
                colors.border
              )}>
                {/* File Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  colors.bg
                )}>
                  <FileIcon className={cn("w-6 h-6", colors.text)} />
                </div>
                
                {/* AI Badge */}
                {hasAI && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}

                {/* Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 left-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDocumentClick(doc); }}>
                      <Eye className="w-4 h-4 mr-2" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
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
