import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Presentation, Sparkles, Loader2, Download, Eye, Trash2,
  Building, Target, FileText, Palette, ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, XCircle
} from 'lucide-react';
import { usePresentationGenerator, type Presentation as PresentationType } from '@/hooks/usePresentationGenerator';
import { useSalesCompliance } from '@/hooks/useSalesCompliance';
import { DealSelector } from './DealSelector';
import { SalesDeal } from '@/hooks/useAIIntelligence';

interface PresentationPreviewProps {
  presentation: PresentationType;
  onDownload: () => void;
  onDelete: () => void;
  complianceStatus?: string;
  complianceScore?: number;
}

function PresentationPreview({ presentation, onDownload, onDelete, complianceStatus, complianceScore }: PresentationPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = presentation.presentation_json?.slides || [];

  const getStatusBadge = () => {
    switch (complianceStatus) {
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Conforme</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Bloqué</Badge>;
      case 'review':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20"><AlertTriangle className="w-3 h-3 mr-1" /> À réviser</Badge>;
      default:
        return <Badge variant="secondary">En attente</Badge>;
    }
  };

  const getSlideTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      title: 'Titre',
      agenda: 'Agenda',
      problem: 'Problématique',
      solution: 'Solution',
      benefits: 'Bénéfices',
      proof: 'Preuves',
      pricing: 'Tarification',
      cta: 'Appel à l\'action',
      contact: 'Contact'
    };
    return labels[type] || type;
  };

  return (
    <Card className="border-agent-sales/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-agent-sales/10 flex items-center justify-center">
              <Presentation className="w-5 h-5 text-agent-sales" />
            </div>
            <div>
              <CardTitle className="text-base">{presentation.title}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {presentation.client_name} • {slides.length} slides
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {complianceScore !== undefined && (
              <Badge variant="outline">{complianceScore}%</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Slide Preview - Enhanced to show sections/stats/timeline */}
        {slides.length > 0 && (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 min-h-[220px] text-white">
              <Badge variant="outline" className="mb-2 text-xs border-agent-sales/50 text-agent-sales">
                {getSlideTypeLabel(slides[currentSlide]?.type)}
              </Badge>
              <h3 className="text-lg font-semibold mb-2">{slides[currentSlide]?.title}</h3>
              
              {/* Subtitle */}
              {slides[currentSlide]?.subtitle && (
                <p className="text-sm text-slate-400 mb-3 italic">{slides[currentSlide].subtitle}</p>
              )}
              
              {/* Content */}
              {slides[currentSlide]?.content && (
                <p className="text-sm text-slate-300 mb-3">{slides[currentSlide].content}</p>
              )}
              
              {/* Sections - multi-column layout */}
              {slides[currentSlide]?.sections && slides[currentSlide].sections!.length > 0 && (
                <div className={`grid gap-3 mb-3 ${slides[currentSlide].sections!.length === 1 ? 'grid-cols-1' : slides[currentSlide].sections!.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                  {slides[currentSlide].sections!.slice(0, 3).map((section, sIdx) => (
                    <div key={sIdx} className="bg-slate-800/50 rounded p-2">
                      <p className="text-xs font-bold text-agent-sales uppercase mb-1 truncate">{section.heading}</p>
                      <ul className="text-xs space-y-0.5">
                        {section.points.slice(0, 3).map((point, pIdx) => (
                          <li key={pIdx} className="text-slate-300 truncate">• {point}</li>
                        ))}
                        {section.points.length > 3 && (
                          <li className="text-slate-500 text-xs">+{section.points.length - 3} autres...</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Stats grid */}
              {slides[currentSlide]?.stats && slides[currentSlide].stats!.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {slides[currentSlide].stats!.slice(0, 4).map((stat, sIdx) => (
                    <div key={sIdx} className="bg-slate-800/60 border border-agent-sales/30 rounded p-2 text-center">
                      <p className="text-lg font-bold text-agent-sales">{stat.value}</p>
                      <p className="text-xs text-slate-300 truncate">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Timeline */}
              {slides[currentSlide]?.timeline && slides[currentSlide].timeline!.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto">
                  {slides[currentSlide].timeline!.slice(0, 4).map((phase, tIdx) => (
                    <div key={tIdx} className="bg-slate-800/60 border border-agent-sales/30 rounded p-2 min-w-[120px]">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="w-5 h-5 rounded-full bg-agent-sales text-white text-xs flex items-center justify-center font-bold">{tIdx + 1}</span>
                        <span className="text-xs text-amber-400">{phase.duration}</span>
                      </div>
                      <p className="text-xs font-medium truncate">{phase.phase}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Bullets fallback */}
              {slides[currentSlide]?.bullets && slides[currentSlide].bullets!.length > 0 && !slides[currentSlide]?.sections && (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {slides[currentSlide].bullets!.slice(0, 5).map((bullet, i) => (
                    <li key={i} className="text-slate-300">{bullet}</li>
                  ))}
                </ul>
              )}
              
              {/* Key message */}
              {slides[currentSlide]?.keyMessage && (
                <div className="mt-3 p-2 bg-agent-sales/20 border-l-2 border-agent-sales rounded-r">
                  <p className="text-xs text-slate-200">→ {slides[currentSlide].keyMessage}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide(c => c - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {currentSlide + 1} / {slides.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentSlide === slides.length - 1}
                onClick={() => setCurrentSlide(c => c + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Slide thumbnails */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {slides.map((slide, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`shrink-0 p-2 rounded border text-xs w-24 h-16 flex flex-col items-center justify-center transition-colors ${
                  currentSlide === i 
                    ? 'border-agent-sales bg-agent-sales/10 text-agent-sales' 
                    : 'border-border hover:bg-secondary/50'
                }`}
              >
                <span className="font-medium truncate w-full text-center">{i + 1}</span>
                <span className="truncate w-full text-center text-muted-foreground">
                  {getSlideTypeLabel(slide.type)}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={onDownload} 
            className="flex-1 bg-agent-sales hover:bg-agent-sales/90"
            disabled={complianceStatus === 'blocked'}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger .pptx
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        {complianceStatus === 'blocked' && (
          <p className="text-xs text-red-500 text-center">
            Téléchargement bloqué - corrigez les problèmes de conformité
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function PresentationGenerator() {
  const { 
    presentations, 
    generating, 
    generatePresentation, 
    downloadPPTX, 
    deletePresentation,
    updatePresentationCompliance 
  } = usePresentationGenerator();
  
  const { checkCompliance, checking } = useSalesCompliance();

  const [selectedDeal, setSelectedDeal] = useState<SalesDeal | null>(null);
  const [generatedPresentation, setGeneratedPresentation] = useState<PresentationType | null>(null);
  const [complianceResult, setComplianceResult] = useState<any>(null);
  
  const [form, setForm] = useState({
    clientName: '',
    productName: '',
    objective: 'closing',
    keyPoints: '',
    slideCount: 8,
    style: 'professional'
  });

  const handleGenerate = async () => {
    const result = await generatePresentation({
      clientName: form.clientName || selectedDeal?.contact_name || 'Client',
      productName: form.productName,
      objective: form.objective,
      keyPoints: form.keyPoints,
      slideCount: form.slideCount,
      style: form.style,
      dealId: selectedDeal?.id
    });

    if (result) {
      setGeneratedPresentation(result);
      
      // Auto-check compliance
      if (result.presentation_json) {
        const contentToCheck = JSON.stringify(result.presentation_json);
        const compliance = await checkCompliance(contentToCheck, 'presentation', result.id);
        setComplianceResult(compliance);
        
        // Update presentation with compliance status
        await updatePresentationCompliance(
          result.id,
          compliance.status,
          compliance.score,
          compliance.issues
        );
        
        // Update local state
        setGeneratedPresentation(prev => prev ? {
          ...prev,
          compliance_status: compliance.status,
          compliance_score: compliance.score,
          compliance_issues: compliance.issues
        } : null);
      }
    }
  };

  const handleDownload = async () => {
    if (generatedPresentation) {
      await downloadPPTX(generatedPresentation);
    }
  };

  const handleDelete = async () => {
    if (generatedPresentation) {
      await deletePresentation(generatedPresentation.id);
      setGeneratedPresentation(null);
      setComplianceResult(null);
    }
  };

  const objectives = [
    { value: 'discovery', label: 'Découverte' },
    { value: 'demo', label: 'Démo produit' },
    { value: 'proposal', label: 'Proposition' },
    { value: 'closing', label: 'Closing' },
    { value: 'upsell', label: 'Upsell' }
  ];

  const styles = [
    { value: 'professional', label: 'Professionnel' },
    { value: 'dynamic', label: 'Dynamique' },
    { value: 'startup', label: 'Startup' },
    { value: 'corporate', label: 'Corporate' }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-agent-sales" />
            Générer une présentation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Deal Selector */}
          <DealSelector
            selectedDealId={selectedDeal?.id || null}
            onSelectDeal={(deal) => {
              setSelectedDeal(deal);
              if (deal) {
                setForm(f => ({
                  ...f,
                  clientName: deal.contact_name || '',
                  productName: deal.title || ''
                }));
              }
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nom du client *</Label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="clientName"
                  placeholder="Entreprise cliente"
                  className="pl-10"
                  value={form.clientName}
                  onChange={(e) => setForm(f => ({ ...f, clientName: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productName">Produit / Service *</Label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="productName"
                  placeholder="Ce que vous proposez"
                  className="pl-10"
                  value={form.productName}
                  onChange={(e) => setForm(f => ({ ...f, productName: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Objectif</Label>
              <div className="relative">
                <Target className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <select
                  className="w-full h-10 rounded-lg bg-secondary border border-border pl-10 pr-3 text-foreground text-sm"
                  value={form.objective}
                  onChange={(e) => setForm(f => ({ ...f, objective: e.target.value }))}
                >
                  {objectives.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <div className="relative">
                <Palette className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <select
                  className="w-full h-10 rounded-lg bg-secondary border border-border pl-10 pr-3 text-foreground text-sm"
                  value={form.style}
                  onChange={(e) => setForm(f => ({ ...f, style: e.target.value }))}
                >
                  {styles.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keyPoints">Points clés à inclure</Label>
            <Textarea
              id="keyPoints"
              placeholder="Arguments principaux, fonctionnalités à mettre en avant, preuves sociales..."
              className="min-h-[100px]"
              value={form.keyPoints}
              onChange={(e) => setForm(f => ({ ...f, keyPoints: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Nombre de slides</Label>
              <Badge variant="outline">{form.slideCount} slides</Badge>
            </div>
            <Slider
              value={[form.slideCount]}
              onValueChange={([value]) => setForm(f => ({ ...f, slideCount: value }))}
              min={5}
              max={15}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 (court)</span>
              <span>15 (détaillé)</span>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !form.productName}
            className="w-full bg-agent-sales hover:bg-agent-sales/90"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Générer la présentation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Compliance check loading */}
      {checking && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-sm">Vérification de conformité en cours...</span>
          </CardContent>
        </Card>
      )}

      {/* Generated presentation preview */}
      {generatedPresentation && (
        <PresentationPreview
          presentation={generatedPresentation}
          onDownload={handleDownload}
          onDelete={handleDelete}
          complianceStatus={generatedPresentation.compliance_status}
          complianceScore={generatedPresentation.compliance_score}
        />
      )}

      {/* Compliance issues */}
      {complianceResult && complianceResult.issues.length > 0 && (
        <Card className="border-amber-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Problèmes de conformité ({complianceResult.issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {complianceResult.issues.map((issue: any, i: number) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-lg border ${
                    issue.severity === 'blocker' 
                      ? 'bg-red-500/5 border-red-500/20' 
                      : issue.severity === 'warning'
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : 'bg-blue-500/5 border-blue-500/20'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {issue.severity === 'blocker' && <XCircle className="w-4 h-4 text-red-500 mt-0.5" />}
                    {issue.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />}
                    {issue.severity === 'info' && <Eye className="w-4 h-4 text-blue-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-xs text-muted-foreground mt-1">{issue.suggestion}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {issue.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent presentations */}
      {presentations.length > 0 && !generatedPresentation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Présentations récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {presentations.slice(0, 5).map(p => (
                <div 
                  key={p.id}
                  className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer flex items-center justify-between"
                  onClick={() => setGeneratedPresentation(p)}
                >
                  <div className="flex items-center gap-3">
                    <Presentation className="w-4 h-4 text-agent-sales" />
                    <div>
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.client_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={
                        p.compliance_status === 'approved' ? 'text-green-600' :
                        p.compliance_status === 'blocked' ? 'text-red-600' :
                        p.compliance_status === 'review' ? 'text-amber-600' : ''
                      }
                    >
                      {p.compliance_score || 0}%
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
