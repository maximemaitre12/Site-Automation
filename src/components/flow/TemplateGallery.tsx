import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkflowBlock, WorkflowTemplate, WORKFLOW_TEMPLATES, BLOCK_DEFINITIONS, BlockType } from '@/types/workflow';
import { 
  LayoutTemplate, Search, Receipt, Users, Headphones, FileText, 
  Database, Clock, Star, TrendingUp, Zap, ChevronRight
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Receipt, Users, Headphones, FileText, Database
};

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (blocks: WorkflowBlock[], name: string, description: string) => void;
}

export function TemplateGallery({ isOpen, onClose, onSelect }: TemplateGalleryProps) {
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(WORKFLOW_TEMPLATES.map(t => t.category))];

  const filteredTemplates = WORKFLOW_TEMPLATES.filter(template => {
    const matchesSearch = !search || 
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: WorkflowTemplate) => {
    onSelect(template.blocks, template.name, template.description);
    onClose();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-amber-500/20 text-amber-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5 text-white" />
            </div>
            Template Gallery
          </DialogTitle>
          <DialogDescription>
            Start with a pre-built workflow template and customize it for your needs
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Search and filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={!selectedCategory ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Template grid or detail view */}
          <div className="flex-1 overflow-y-auto">
            {selectedTemplate ? (
              // Template detail view
              <div className="space-y-6">
                <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                  ← Back to templates
                </Button>

                <div className="grid grid-cols-2 gap-6">
                  {/* Left: Info */}
                  <div className="space-y-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedTemplate.color} flex items-center justify-center shadow-lg`}>
                      {iconMap[selectedTemplate.icon] ? 
                        (() => { const Icon = iconMap[selectedTemplate.icon]; return <Icon className="w-8 h-8 text-white" />; })() :
                        <Zap className="w-8 h-8 text-white" />
                      }
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{selectedTemplate.name}</h3>
                      <p className="text-muted-foreground mt-1">{selectedTemplate.description}</p>
                    </div>

                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                        {selectedTemplate.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedTemplate.estimatedTime}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Use Cases</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.useCases.map(uc => (
                          <span key={uc} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {uc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button variant="hero" className="w-full" onClick={() => handleUseTemplate(selectedTemplate)}>
                      <Zap className="w-4 h-4 mr-2" />
                      Use This Template
                    </Button>
                  </div>

                  {/* Right: Blocks preview */}
                  <div className="bg-muted/30 rounded-xl p-4 max-h-96 overflow-y-auto">
                    <h4 className="text-sm font-medium text-foreground mb-4">
                      Workflow Steps ({selectedTemplate.blocks.length})
                    </h4>
                    <div className="space-y-3">
                      {selectedTemplate.blocks.map((block, index) => {
                        const def = BLOCK_DEFINITIONS[block.type as BlockType];
                        return (
                          <div key={block.id} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${def?.color || 'from-gray-500 to-gray-400'} flex items-center justify-center text-white text-xs font-bold`}>
                                {index + 1}
                              </div>
                              {index < selectedTemplate.blocks.length - 1 && (
                                <div className="w-0.5 h-4 bg-border mt-1" />
                              )}
                            </div>
                            <div className="flex-1 pb-2">
                              <span className="font-medium text-sm text-foreground">{block.name}</span>
                              <p className="text-xs text-muted-foreground">{def?.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Template grid
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredTemplates.map(template => {
                  const Icon = iconMap[template.icon] || Zap;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>

                      <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {template.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-full ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.estimatedTime}
                        </span>
                        <span className="text-muted-foreground">
                          {template.blocks.length} blocks
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <LayoutTemplate className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No templates found</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
