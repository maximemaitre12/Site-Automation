import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAetherDocs, AetherDocument, DocFolder } from "@/hooks/useAetherDocs";
import { DocSidebar, AccessLevel } from "@/components/doc/DocSidebar";
import { DocGrid } from "@/components/doc/DocGrid";
import { DocHeader } from "@/components/doc/DocHeader";
import { DocUploadDialog } from "@/components/doc/DocUploadDialog";
import { DocGenerateDialog } from "@/components/doc/DocGenerateDialog";
import { DocViewerDialog } from "@/components/doc/DocViewerDialog";
import { Loader2, FileText, Files, Wand2, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function DocPage() {
  const {
    documents,
    folders,
    templates,
    loading,
    currentFolder,
    searchQuery,
    setCurrentFolder,
    setSearchQuery,
    createFolder,
    deleteFolder,
    uploadDocument,
    createDocument,
    deleteDocument,
    generateDocument,
    analyzeDocument,
    rewriteDocument,
    moveDocument,
    updateDocument,
    toggleFavorite,
    toggleArchive,
    refreshDocuments
  } = useAetherDocs();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<AetherDocument | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [currentAccessLevel, setCurrentAccessLevel] = useState<AccessLevel>('personal');
  const [renameDocId, setRenameDocId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  // Filter documents by access level and folder/filter
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    // Filter by access level
    filtered = filtered.filter(doc => {
      const docAccess = doc.access_level || 'private';
      if (currentAccessLevel === 'personal') return docAccess === 'private';
      if (currentAccessLevel === 'team') return docAccess === 'team';
      if (currentAccessLevel === 'company') return docAccess === 'company';
      return true;
    });

    // Apply quick filters
    if (currentFolder?.startsWith('filter:')) {
      const filterType = currentFolder.replace('filter:', '');
      if (filterType === 'recent') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(d => new Date(d.updated_at) > weekAgo);
      } else if (filterType === 'starred') {
        filtered = filtered.filter(d => d.is_favorite);
      } else if (filterType === 'archived') {
        filtered = filtered.filter(d => d.is_archived);
      }
    } else {
      // Exclude archived by default
      filtered = filtered.filter(d => !d.is_archived);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(query) ||
        d.description?.toLowerCase().includes(query) ||
        d.ai_summary?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [documents, currentAccessLevel, currentFolder, searchQuery]);

  // Check if we're in a special filter view (not a real folder)
  const isSpecialFilter = !currentFolder || currentFolder.startsWith('filter:');

  const currentFolderData = currentFolder && !isSpecialFilter
    ? folders.find(f => f.id === currentFolder) 
    : null;

  // Generate breadcrumbs
  const breadcrumbs = useMemo(() => {
    const accessLabels = {
      personal: 'Mes documents',
      team: 'Équipe',
      company: 'Entreprise'
    };
    const crumbs: { id: string | null; name: string }[] = [
      { id: null, name: accessLabels[currentAccessLevel] }
    ];
    
    if (currentFolder?.startsWith('filter:')) {
      const filterType = currentFolder.replace('filter:', '');
      const filterLabels: Record<string, string> = { 
        recent: 'Récents', 
        starred: 'Favoris', 
        archived: 'Archivés' 
      };
      crumbs.push({ id: currentFolder, name: filterLabels[filterType] || filterType });
    } else if (currentFolderData) {
      crumbs.push({ id: currentFolderData.id, name: currentFolderData.name });
    }
    
    return crumbs;
  }, [currentAccessLevel, currentFolder, currentFolderData]);

  const handleDocumentClick = (doc: AetherDocument) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };

  const handleUpload = async (file: File, title: string, tags: string[]) => {
    await uploadDocument(file, title, currentFolder, tags);
    setUploadDialogOpen(false);
  };

  const handleCreateDocument = async (title: string, content: string, tags: string[]) => {
    await createDocument(title, content, currentFolder, null, tags);
    setUploadDialogOpen(false);
  };

  const handleGenerate = async (templateId: string, variables: Record<string, string>, title: string) => {
    const result = await generateDocument(templateId, variables, title);
    setGenerateDialogOpen(false);
    return result;
  };

  const handleRenameDocument = (docId: string, currentTitle: string) => {
    setRenameDocId(docId);
    setRenameTitle(currentTitle);
  };

  const handleRenameSubmit = async () => {
    if (renameDocId && renameTitle.trim() && !isRenaming) {
      setIsRenaming(true);
      const docId = renameDocId;
      const newTitle = renameTitle.trim();
      setRenameDocId(null);
      setRenameTitle('');
      
      await updateDocument(docId, { title: newTitle });
      setIsRenaming(false);
    }
  };

  const headerActions = (
    <>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setShowMobileSidebar(true)}
        className="md:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setUploadDialogOpen(true)}
        className="hidden sm:flex"
      >
        <Files className="w-4 h-4 mr-2" />
        Importer
      </Button>
      <Button 
        size="sm"
        onClick={() => setGenerateDialogOpen(true)}
      >
        <Wand2 className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">Générer</span>
      </Button>
    </>
  );

  if (loading) {
    return (
      <DashboardLayout headerActions={headerActions}>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout headerActions={headerActions}>
      <div className="flex h-full overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        {/* Sidebar - Enterprise Navigation */}
        <div className={cn(
          "fixed md:relative inset-y-0 left-0 z-40 md:z-auto transition-transform duration-300 ease-out",
          showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <DocSidebar
            folders={folders}
            currentFolder={currentFolder}
            currentAccessLevel={currentAccessLevel}
            onFolderSelect={(id) => { setCurrentFolder(id); setShowMobileSidebar(false); }}
            onAccessLevelChange={(level) => { setCurrentAccessLevel(level); setCurrentFolder(null); }}
            onCreateFolder={(name) => createFolder(name, currentFolder)}
            onDeleteFolder={deleteFolder}
          />
        </div>

        {/* Mobile overlay */}
        {showMobileSidebar && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Search and view controls */}
          <DocHeader
            breadcrumbs={breadcrumbs}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onBreadcrumbClick={(id) => setCurrentFolder(id)}
          />

          {/* Document grid */}
          <div className="flex-1 overflow-hidden">
            <DocGrid
              documents={filteredDocuments}
              folders={isSpecialFilter ? [] : folders.filter(f => f.parent_id === currentFolder)}
              viewMode={viewMode}
              currentAccessLevel={currentAccessLevel}
              onDocumentClick={handleDocumentClick}
              onFolderClick={(folder) => setCurrentFolder(folder.id)}
              onDeleteDocument={deleteDocument}
              onMoveDocument={moveDocument}
              onRenameDocument={handleRenameDocument}
              onToggleFavorite={toggleFavorite}
              onToggleArchive={toggleArchive}
            />
          </div>
        </div>

        {/* Mobile FAB */}
        <div className="md:hidden fixed bottom-20 right-4 z-50 flex flex-col gap-2">
          <Button
            onClick={() => setUploadDialogOpen(true)}
            variant="outline"
            className="w-12 h-12 rounded-full shadow-lg bg-background"
          >
            <Files className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setGenerateDialogOpen(true)}
            className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80"
          >
            <Wand2 className="w-5 h-5" />
          </Button>
        </div>

        <DocUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onUpload={handleUpload}
          onCreate={handleCreateDocument}
        />

        <DocGenerateDialog
          open={generateDialogOpen}
          onOpenChange={setGenerateDialogOpen}
          templates={templates}
          onGenerate={handleGenerate}
        />

        <DocViewerDialog
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          document={selectedDocument}
          onAnalyze={(docId) => analyzeDocument(docId, true)}
          onRewrite={rewriteDocument}
          onRefresh={() => {
            refreshDocuments();
            if (selectedDocument) {
              const updated = documents.find(d => d.id === selectedDocument.id);
              if (updated) setSelectedDocument(updated);
            }
          }}
        />

        {/* Rename Dialog */}
        <Dialog open={renameDocId !== null} onOpenChange={(open) => !open && setRenameDocId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Renommer le document</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                placeholder="Nouveau nom"
                onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenameDocId(null)}>
                Annuler
              </Button>
              <Button onClick={handleRenameSubmit} disabled={!renameTitle.trim()}>
                Renommer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
