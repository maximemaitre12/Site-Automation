import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAetherDocs, AetherDocument, DocFolder } from "@/hooks/useAetherDocs";
import { DocSidebar } from "@/components/doc/DocSidebar";
import { DocGrid } from "@/components/doc/DocGrid";
import { DocHeader } from "@/components/doc/DocHeader";
import { DocUploadDialog } from "@/components/doc/DocUploadDialog";
import { DocGenerateDialog } from "@/components/doc/DocGenerateDialog";
import { DocViewerDialog } from "@/components/doc/DocViewerDialog";
import { Loader2, Menu, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

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
    refreshDocuments
  } = useAetherDocs();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<AetherDocument | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="px-3 md:px-6 py-3 md:py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-muted shrink-0"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              {showMobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-foreground truncate">AETHER Doc</h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden md:block">Gestion intelligente de documents</p>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile toggle button */}
          <button
            className="md:hidden fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          >
            {showMobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Sidebar - Folders */}
          <div className={cn(
            "fixed md:relative inset-0 z-40 md:z-auto transition-transform",
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
              className="fixed inset-0 bg-black/20 z-30 md:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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

            <DocGrid
              documents={documents}
              folders={folders.filter(f => f.parent_id === currentFolder)}
              viewMode={viewMode}
              onDocumentClick={handleDocumentClick}
              onFolderClick={(folder) => setCurrentFolder(folder.id)}
              onDeleteDocument={deleteDocument}
              onMoveDocument={moveDocument}
            />
          </div>
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
          onAnalyze={analyzeDocument}
          onRewrite={rewriteDocument}
          onRefresh={() => {
            refreshDocuments();
            if (selectedDocument) {
              // Refresh the selected document data
              const updated = documents.find(d => d.id === selectedDocument.id);
              if (updated) setSelectedDocument(updated);
            }
          }}
        />
      </div>
    </DashboardLayout>
  );
}
