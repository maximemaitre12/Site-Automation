import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAetherDocs, AetherDocument, DocFolder } from "@/hooks/useAetherDocs";
import { DocSidebar } from "@/components/doc/DocSidebar";
import { DocGrid } from "@/components/doc/DocGrid";
import { DocHeader } from "@/components/doc/DocHeader";
import { DocStats } from "@/components/doc/DocStats";
import { DocCategoryTabs, DocCategory } from "@/components/doc/DocCategoryTabs";
import { DocUploadDialog } from "@/components/doc/DocUploadDialog";
import { DocGenerateDialog } from "@/components/doc/DocGenerateDialog";
import { DocViewerDialog } from "@/components/doc/DocViewerDialog";
import { Loader2, FileText, Files, Wand2 } from "lucide-react";
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

// Map template categories to document categories
const templateCategoryMap: Record<string, DocCategory> = {
  'hr': 'hr',
  'sales': 'sales',
  'compliance': 'compliance',
  'report': 'report',
  'project': 'project',
  'proposal': 'sales',
  'contract': 'hr',
  'procedure': 'compliance',
  'general': 'all'
};

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
    refreshDocuments
  } = useAetherDocs();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<AetherDocument | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeCategory, setActiveCategory] = useState<DocCategory>('all');
  const [renameDocId, setRenameDocId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  // Filter documents by category
  const filteredDocuments = useMemo(() => {
    if (activeCategory === 'all') return documents;
    if (activeCategory === 'ai') return documents.filter(d => d.ai_summary);
    
    // Filter by template category
    return documents.filter(doc => {
      if (!doc.template_id) return false;
      const template = templates.find(t => t.id === doc.template_id);
      if (!template) return false;
      const mappedCategory = templateCategoryMap[template.category] || 'all';
      return mappedCategory === activeCategory;
    });
  }, [documents, activeCategory, templates]);

  // Count documents per category
  const categoryCounts = useMemo(() => {
    const counts: Record<DocCategory, number> = {
      all: documents.length,
      hr: 0,
      sales: 0,
      compliance: 0,
      report: 0,
      project: 0,
      ai: documents.filter(d => d.ai_summary).length
    };

    documents.forEach(doc => {
      if (doc.template_id) {
        const template = templates.find(t => t.id === doc.template_id);
        if (template) {
          const mappedCategory = templateCategoryMap[template.category];
          if (mappedCategory && mappedCategory !== 'all') {
            counts[mappedCategory]++;
          }
        }
      }
    });

    return counts;
  }, [documents, templates]);

  // Filter templates by active category for generation dialog
  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all' || activeCategory === 'ai') return templates;
    return templates.filter(t => {
      const mappedCategory = templateCategoryMap[t.category];
      return mappedCategory === activeCategory;
    });
  }, [templates, activeCategory]);

  const currentFolderData = currentFolder 
    ? folders.find(f => f.id === currentFolder) 
    : null;

  const breadcrumbs = (() => {
    const crumbs: { id: string | null; name: string }[] = [{ id: null, name: 'Tous les documents' }];
    if (currentFolderData) {
      crumbs.push({ id: currentFolderData.id, name: currentFolderData.name });
    }
    return crumbs;
  })();

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
    await generateDocument(templateId, variables, title);
    setGenerateDialogOpen(false);
  };

  const handleRenameDocument = (docId: string, currentTitle: string) => {
    setRenameDocId(docId);
    setRenameTitle(currentTitle);
  };

  const handleRenameSubmit = async () => {
    if (renameDocId && renameTitle.trim() && !isRenaming) {
      setIsRenaming(true);
      // Fermer immédiatement pour une UX réactive
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
      <DashboardLayout
        toolName="Document Hub"
        toolDescription="Génération et gestion intelligente de documents"
        toolIcon={<FileText className="w-5 h-5 text-primary" />}
        showAIBadge
        headerActions={headerActions}
      >
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      toolName="Document Hub"
      toolDescription="Génération et gestion intelligente de documents"
      toolIcon={<FileText className="w-5 h-5 text-primary" />}
      showAIBadge
      headerActions={headerActions}
    >
      <div className="flex flex-col h-full overflow-y-auto bg-gradient-to-b from-background to-background/95">
        {/* Main content area */}
        <div className="flex flex-1 relative px-4 md:px-8 pb-24 pt-4">
          <div className="max-w-7xl mx-auto w-full flex">
            {/* Sidebar - Folders */}
            <div className={cn(
              "fixed md:relative inset-0 z-40 md:z-auto transition-transform md:w-64 shrink-0",
              showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
              <DocSidebar
                folders={folders}
                currentFolder={currentFolder}
                onFolderSelect={(id) => { setCurrentFolder(id); setShowMobileSidebar(false); }}
                onCreateFolder={(name) => createFolder(name, currentFolder)}
                onDeleteFolder={deleteFolder}
              />
            </div>

            {/* Mobile overlay */}
            {showMobileSidebar && (
              <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                onClick={() => setShowMobileSidebar(false)}
              />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 md:pl-6 min-h-0">
              <DocHeader
                breadcrumbs={breadcrumbs}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onUploadClick={() => setUploadDialogOpen(true)}
                onGenerateClick={() => setGenerateDialogOpen(true)}
                onBreadcrumbClick={(id) => setCurrentFolder(id)}
              />

              <div className="flex-1 min-h-0 flex flex-col">
                <DocGrid
                  documents={filteredDocuments}
                  folders={folders.filter(f => f.parent_id === currentFolder)}
                  viewMode={viewMode}
                  onDocumentClick={handleDocumentClick}
                  onFolderClick={(folder) => setCurrentFolder(folder.id)}
                  onDeleteDocument={deleteDocument}
                  onMoveDocument={moveDocument}
                  onRenameDocument={handleRenameDocument}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile FAB */}
        <div className="md:hidden fixed bottom-20 right-4 z-50 flex flex-col gap-2">
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
          templates={filteredTemplates}
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
