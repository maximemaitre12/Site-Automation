import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocuments, Document, DocBlock, Template } from "@/hooks/useDocuments";
import { DocEditor } from "@/components/docs/DocEditor";
import { DocGenerateModal } from "@/components/docs/DocGenerateModal";
import { DocTemplates } from "@/components/docs/DocTemplates";
import { DocExport } from "@/components/docs/DocExport";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  FileText, Plus, Upload, Sparkles, Download, Trash2, Save, Search,
  FolderOpen, Clock, ChevronLeft, LayoutTemplate, FileSearch, Loader2,
  PanelLeftClose, PanelLeft
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type ViewMode = 'list' | 'editor';

export default function Docs() {
  const {
    documents,
    templates,
    loading,
    processing,
    createDocument,
    updateDocument,
    deleteDocument,
    generateDocument,
    analyzeDocument,
    improveText,
    createTemplate,
    deleteTemplate,
    exportDocument,
  } = useDocuments();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [docBlocks, setDocBlocks] = useState<DocBlock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGenerate, setShowGenerate] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  // Filter documents
  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open document for editing
  const openDocument = (doc: Document) => {
    setCurrentDoc(doc);
    setDocTitle(doc.title);
    setDocBlocks(doc.content || []);
    setViewMode('editor');
  };

  // Create new document
  const handleNewDocument = async () => {
    const newDoc = await createDocument('Nouveau document', []);
    if (newDoc) {
      openDocument(newDoc);
    }
  };

  // Save document
  const handleSave = async () => {
    if (!currentDoc) return;
    setSaving(true);
    await updateDocument(currentDoc.id, {
      title: docTitle,
      content: docBlocks,
      status: 'draft'
    });
    setSaving(false);
    toast({ title: 'Document sauvegardé' });
  };

  // Generate document with AI
  const handleGenerate = async (params: { type: string; subject: string; target: string; tone: string; detailLevel: string }) => {
    const blocks = await generateDocument(params);
    if (blocks) {
      const newDoc = await createDocument(params.subject, blocks, params.type);
      if (newDoc) {
        openDocument(newDoc);
        setShowGenerate(false);
      }
    }
  };

  // Use template
  const handleUseTemplate = async (template: Template) => {
    const newDoc = await createDocument(`${template.title} - ${new Date().toLocaleDateString()}`, template.content, template.type, template.id);
    if (newDoc) {
      openDocument(newDoc);
    }
  };

  // Import and analyze text
  const handleImport = async () => {
    if (!importText.trim()) return;
    
    const newDoc = await createDocument('Document importé', [
      { id: crypto.randomUUID(), type: 'paragraph', content: importText }
    ]);
    
    if (newDoc) {
      await analyzeDocument(newDoc.id, importText);
      setImportText('');
      setShowImport(false);
    }
  };

  // Delete document
  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    if (currentDoc?.id === id) {
      setViewMode('list');
      setCurrentDoc(null);
    }
  };

  // Back to list
  const handleBack = () => {
    setViewMode('list');
    setCurrentDoc(null);
    setDocBlocks([]);
  };

  // Auto-save effect
  useEffect(() => {
    if (!currentDoc || docBlocks.length === 0) return;
    
    const timer = setTimeout(() => {
      updateDocument(currentDoc.id, { content: docBlocks, title: docTitle });
    }, 2000);

    return () => clearTimeout(timer);
  }, [docBlocks, docTitle]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {viewMode === 'editor' && (
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  AETHER Doc
                </h1>
                <p className="text-muted-foreground mt-1">
                  Générateur & gestionnaire de documents IA
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {viewMode === 'list' ? (
                <>
                  <Button variant="outline" onClick={() => setShowImport(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Importer
                  </Button>
                  <Button variant="outline" onClick={() => setShowGenerate(true)}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer avec IA
                  </Button>
                  <Button onClick={handleNewDocument}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau document
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="icon" onClick={() => setShowSidebar(!showSidebar)}>
                    {showSidebar ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                  </Button>
                  <Button variant="outline" onClick={() => setShowExport(true)}>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Sauvegarder
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        {viewMode === 'list' ? (
          <div className="flex-1 flex">
            {/* Documents List */}
            <div className="flex-1 p-8">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un document..."
                  className="pl-10"
                />
              </div>

              {/* Documents Grid */}
              {filteredDocs.length === 0 ? (
                <div className="text-center py-16">
                  <FolderOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">Aucun document</h3>
                  <p className="text-muted-foreground mb-6">Créez votre premier document ou utilisez un modèle</p>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" onClick={() => setShowGenerate(true)}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer avec IA
                    </Button>
                    <Button onClick={handleNewDocument}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau document
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => openDocument(doc)}
                      className="p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-400/20 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {new Date(doc.updated_at).toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                            {doc.type && <span className="text-xs px-2 py-0.5 rounded bg-secondary">{doc.type}</span>}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {doc.summary && (
                            <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success">
                              Analysé
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(doc.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {doc.summary && (
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2 pl-16">
                          {doc.summary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Templates Sidebar */}
            <aside className="w-80 border-l border-border p-6 bg-card/30">
              <DocTemplates
                templates={templates}
                onCreateTemplate={async (title, desc, content, type) => {
                  await createTemplate(title, desc, content, type);
                }}
                onDeleteTemplate={deleteTemplate}
                onUseTemplate={handleUseTemplate}
              />
            </aside>
          </div>
        ) : (
          /* Editor View */
          <div className="flex-1 flex overflow-hidden">
            {/* Editor */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Title */}
              <div className="px-8 py-4 border-b border-border">
                <Input
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Titre du document..."
                  className="text-xl font-semibold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                />
              </div>

              {/* Editor Content */}
              <div className="flex-1 overflow-auto px-8">
                <div className="max-w-3xl mx-auto">
                  <DocEditor
                    blocks={docBlocks}
                    onChange={setDocBlocks}
                    onImproveText={improveText}
                    processing={processing}
                  />
                </div>
              </div>
            </div>

            {/* Properties Sidebar */}
            {showSidebar && currentDoc && (
              <aside className="w-80 border-l border-border bg-card/30 overflow-auto">
                <Tabs defaultValue="properties" className="h-full">
                  <TabsList className="w-full rounded-none border-b border-border bg-transparent h-12">
                    <TabsTrigger value="properties" className="flex-1">Propriétés</TabsTrigger>
                    <TabsTrigger value="ai" className="flex-1">IA</TabsTrigger>
                  </TabsList>

                  <TabsContent value="properties" className="p-4 space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Type</p>
                      <p className="text-sm font-medium text-foreground capitalize">{currentDoc.type || 'Libre'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Créé le</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(currentDoc.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Modifié le</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(currentDoc.updated_at).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Blocs</p>
                      <p className="text-sm font-medium text-foreground">{docBlocks.length}</p>
                    </div>

                    {/* Structure overview */}
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Structure</p>
                      <div className="space-y-1">
                        {docBlocks.filter(b => b.type === 'heading').map((block, i) => (
                          <p 
                            key={block.id}
                            className="text-sm text-foreground truncate"
                            style={{ paddingLeft: `${((block.level || 1) - 1) * 12}px` }}
                          >
                            {block.content || `Titre ${i + 1}`}
                          </p>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="ai" className="p-4 space-y-4">
                    {currentDoc.summary ? (
                      <>
                        <div>
                          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Résumé IA
                          </p>
                          <p className="text-sm text-foreground leading-relaxed">
                            {currentDoc.summary}
                          </p>
                        </div>

                        {currentDoc.analysis && (
                          <div className="pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-2">Analyse</p>
                            {currentDoc.analysis.themes && (
                              <div className="mb-3">
                                <p className="text-xs text-muted-foreground mb-1">Thèmes</p>
                                <div className="flex flex-wrap gap-1">
                                  {currentDoc.analysis.themes.map((theme: string, i: number) => (
                                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                                      {theme}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {currentDoc.analysis.points_cles && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Points clés</p>
                                <ul className="text-sm text-foreground space-y-1">
                                  {currentDoc.analysis.points_cles.map((point: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-primary">•</span>
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <FileSearch className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Pas encore analysé par l'IA
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={processing || docBlocks.length === 0}
                          onClick={async () => {
                            const content = docBlocks.map(b => b.content || (b.items || []).join(' ')).join('\n');
                            if (content.trim()) {
                              await analyzeDocument(currentDoc.id, content);
                            }
                          }}
                        >
                          {processing ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4 mr-2" />
                          )}
                          Analyser
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </aside>
            )}
          </div>
        )}

        {/* Import Modal */}
        {showImport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl mx-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Importer un document
              </h3>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Collez le contenu de votre document ici pour l'analyser avec l'IA..."
                className="w-full h-64 p-4 rounded-lg bg-secondary border border-border text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowImport(false)}>
                  Annuler
                </Button>
                <Button onClick={handleImport} disabled={processing || !importText.trim()}>
                  {processing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileSearch className="h-4 w-4 mr-2" />
                  )}
                  Importer & Analyser
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Generate Modal */}
        <DocGenerateModal
          open={showGenerate}
          onClose={() => setShowGenerate(false)}
          onGenerate={handleGenerate}
          processing={processing}
        />

        {/* Export Modal */}
        <DocExport
          document={currentDoc}
          open={showExport}
          onClose={() => setShowExport(false)}
          onExport={exportDocument}
        />
      </div>
    </DashboardLayout>
  );
}
