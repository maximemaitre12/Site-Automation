import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, title: string, tags: string[]) => Promise<void>;
  onCreate: (title: string, content: string, tags: string[]) => Promise<void>;
}

export function DocUploadDialog({
  open,
  onOpenChange,
  onUpload,
  onCreate
}: DocUploadDialogProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  }, [title]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (activeTab === "upload" && file) {
      setLoading(true);
      await onUpload(file, title || file.name, tags);
      setLoading(false);
      reset();
    } else if (activeTab === "create" && title && content) {
      setLoading(true);
      await onCreate(title, content, tags);
      setLoading(false);
      reset();
    }
  };

  const reset = () => {
    setFile(null);
    setTitle("");
    setContent("");
    setTags([]);
    setTagInput("");
  };

  const isValid = activeTab === "upload" ? !!file : (!!title && !!content);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </TabsTrigger>
            <TabsTrigger value="create">
              <FileText className="w-4 h-4 mr-2" />
              Créer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : file
                  ? "border-green-500 bg-green-500/5"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.csv,.jpg,.jpeg,.png,.gif,.webp,.json,.xml"
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium">Glissez-déposez un fichier ici</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou cliquez pour sélectionner
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    PDF, Word, Excel, Images, etc.
                  </p>
                </>
              )}
            </div>

            {/* Title */}
            <div>
              <Label>Titre du document</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nom du document..."
                className="mt-1"
              />
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4 mt-4">
            <div>
              <Label>Titre</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du document..."
                className="mt-1"
              />
            </div>

            <div>
              <Label>Contenu</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Écrivez ou collez le contenu de votre document..."
                className="mt-1 min-h-[200px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Tags */}
        <div>
          <Label>Tags</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Ajouter un tag..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1"
            />
            <Button variant="outline" onClick={addTag}>
              Ajouter
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {activeTab === "upload" ? "Importer" : "Créer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
