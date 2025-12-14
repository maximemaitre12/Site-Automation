import { cn } from "@/lib/utils";
import { AetherDocument, DocFolder } from "@/hooks/useAetherDocs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Move,
  Star,
  Clock
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
  if (!fileType) return File;
  if (fileType.includes('pdf')) return FileText;
  if (fileType.includes('image')) return FileImage;
  if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) return FileSpreadsheet;
  return File;
};

const getFileIconColor = (fileType: string | null) => {
  if (!fileType) return 'text-muted-foreground';
  if (fileType.includes('pdf')) return 'text-red-500';
  if (fileType.includes('image')) return 'text-blue-500';
  if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) return 'text-green-500';
  return 'text-muted-foreground';
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Helper to safely parse tags (can be JSON string, array, or null)
const parseTags = (tags: any): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
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
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Aucun document</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Importez vos premiers documents ou générez-en à partir de templates pour commencer.
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-1">
          {/* Folders first */}
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => onFolderClick(folder)}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
            >
              <Folder className="w-5 h-5" style={{ color: folder.color }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{folder.name}</p>
              </div>
              <span className="text-sm text-muted-foreground">Dossier</span>
            </div>
          ))}

          {/* Documents */}
          {documents.map((doc) => {
            const FileIcon = getFileIcon(doc.file_type);
            return (
              <div
                key={doc.id}
                onClick={() => onDocumentClick(doc)}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors group"
              >
                <FileIcon className={cn("w-5 h-5", getFileIconColor(doc.file_type))} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.title}</p>
                  {doc.ai_summary && (
                    <p className="text-sm text-muted-foreground truncate">{doc.ai_summary}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {doc.embedding_status === 'pending' && (
                    <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 bg-amber-50">
                      Analyse...
                    </Badge>
                  )}
                  {doc.embedding_status === 'completed' && doc.ai_summary && (
                    <Badge variant="outline" className="text-xs text-primary border-primary/30 bg-primary/5">
                      ✨ IA
                    </Badge>
                  )}
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex gap-1">
                      {doc.tags.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <span>{formatFileSize(doc.file_size)}</span>
                  <span>{format(new Date(doc.updated_at), 'dd MMM yyyy', { locale: fr })}</span>
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
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Folders first */}
        {folders.map((folder) => (
          <Card
            key={folder.id}
            onClick={() => onFolderClick(folder)}
            className="p-4 cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Folder className="w-8 h-8" style={{ color: folder.color }} />
              </div>
              <p className="font-medium truncate w-full">{folder.name}</p>
              <p className="text-xs text-muted-foreground">Dossier</p>
            </div>
          </Card>
        ))}

        {/* Documents */}
        {documents.map((doc) => {
          const FileIcon = getFileIcon(doc.file_type);
          return (
            <Card
              key={doc.id}
              onClick={() => onDocumentClick(doc)}
              className="p-4 cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group relative"
            >
              {/* Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
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

              <div className="flex flex-col items-center text-center">
                {/* Preview/Icon */}
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileIcon className={cn("w-8 h-8", getFileIconColor(doc.file_type))} />
                </div>

                {/* Title */}
                <p className="font-medium truncate w-full text-sm">{doc.title}</p>
                
                {/* Meta */}
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {format(new Date(doc.updated_at), 'dd MMM', { locale: fr })}
                  {doc.file_size && (
                    <>
                      <span>•</span>
                      <span>{formatFileSize(doc.file_size)}</span>
                    </>
                  )}
                </div>

                {/* Tags */}
                {(() => {
                  const tagsArray = parseTags(doc.tags);
                  return tagsArray.length > 0 ? (
                    <div className="flex gap-1 mt-2 flex-wrap justify-center">
                      {tagsArray.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null;
                })()}

                {/* AI Status */}
                {doc.embedding_status === 'pending' && (
                  <Badge variant="outline" className="mt-2 text-xs text-amber-600 border-amber-300 bg-amber-50">
                    Analyse en cours...
                  </Badge>
                )}
                {doc.embedding_status === 'completed' && doc.ai_summary && (
                  <Badge variant="outline" className="mt-2 text-xs text-primary border-primary/30 bg-primary/5">
                    ✨ IA analysé
                  </Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
