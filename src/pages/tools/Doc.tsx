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
import { Loader2, Menu, X, FileText, Sparkles, FolderOpen, Files, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    refreshDocuments
  } = useAetherDocs();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<AetherDocument | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeCategory, setActiveCategory] = useState<DocCategory>('all');

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
      <div className="flex flex-col h-full overflow-hidden bg-gradient-to-b from-background to-background/95">
        {/* Modern Header */}
        <header className="px-4 md:px-8 py-4 md:py-6 shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                className="md:hidden p-2 -ml-2 rounded-xl hover:bg-muted shrink-0"
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              >
                {showMobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
                <FileText className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">Document Hub</h1>
                  <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    IA intégrée
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-0.5 hidden md:block">
                  Génération et gestion intelligente de documents
                </p>
              </div>
              
              {/* Action buttons */}
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setUploadDialogOpen(true)}
                  className="rounded-xl"
                >
                  <Files className="w-4 h-4 mr-2" />
                  Importer
                </Button>
                <Button 
                  onClick={() => setGenerateDialogOpen(true)}
                  className="rounded-xl bg-gradient-to-r from-primary to-primary/80"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Générer
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Files className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{documents.length}</p>
                    <p className="text-xs text-muted-foreground">Documents</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-agent-hr/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-agent-hr/10 flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-agent-hr" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{folders.length}</p>
                    <p className="text-xs text-muted-foreground">Dossiers</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-agent-compliance/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-agent-compliance/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-agent-compliance" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{templates.length}</p>
                    <p className="text-xs text-muted-foreground">Templates</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-agent-sales/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-agent-sales/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-agent-sales" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{categoryCounts.ai}</p>
                    <p className="text-xs text-muted-foreground">Analysés IA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Tabs */}
            <DocCategoryTabs 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory}
              counts={categoryCounts}
            />
          </div>
        </header>

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden relative px-4 md:px-8">
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
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:pl-6">
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
                documents={filteredDocuments}
                folders={folders.filter(f => f.parent_id === currentFolder)}
                viewMode={viewMode}
                onDocumentClick={handleDocumentClick}
                onFolderClick={(folder) => setCurrentFolder(folder.id)}
                onDeleteDocument={deleteDocument}
                onMoveDocument={moveDocument}
              />
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
          onAnalyze={analyzeDocument}
          onRewrite={rewriteDocument}
          onRefresh={() => {
            refreshDocuments();
            if (selectedDocument) {
              const updated = documents.find(d => d.id === selectedDocument.id);
              if (updated) setSelectedDocument(updated);
            }
          }}
        />
      </div>
    </DashboardLayout>
  );
}
