import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Sparkles, Loader2, Copy, CheckCircle, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobPostGeneratorProps {
  onGeneratePost: (requirements: string) => Promise<string | null>;
  onCreateJob: (data: {
    title: string;
    description?: string;
    department?: string;
    salaryRange?: string;
    skills?: string[];
    requirements?: string[];
  }) => Promise<any>;
}

export function JobPostGenerator({ onGeneratePost, onCreateJob }: JobPostGeneratorProps) {
  const [requirements, setRequirements] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Job form
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    salaryRange: '',
    skills: '',
    requirements: ''
  });

  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!requirements.trim()) {
      toast({ title: 'Requis', description: 'Décrivez vos besoins pour le poste', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    const result = await onGeneratePost(requirements);
    if (result) {
      setGeneratedPost(result);
    }
    setIsGenerating(false);
  };

  const handleSaveJob = async () => {
    if (!jobForm.title.trim()) {
      toast({ title: 'Titre requis', description: 'Veuillez saisir un titre de poste', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    const result = await onCreateJob({
      title: jobForm.title,
      description: generatedPost || jobForm.requirements,
      department: jobForm.department || undefined,
      salaryRange: jobForm.salaryRange || undefined,
      skills: jobForm.skills ? jobForm.skills.split(',').map(s => s.trim()) : undefined,
      requirements: jobForm.requirements ? jobForm.requirements.split('\n').filter(r => r.trim()) : undefined
    });
    if (result) {
      setJobForm({ title: '', department: '', salaryRange: '', skills: '', requirements: '' });
      setGeneratedPost(null);
      setRequirements('');
    }
    setIsSaving(false);
  };

  const copyToClipboard = async () => {
    if (!generatedPost) return;
    await navigator.clipboard.writeText(generatedPost);
    toast({ title: 'Copié', description: 'Offre copiée dans le presse-papiers' });
  };

  return (
    <div className="space-y-6">
      {/* Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Générateur d'offres IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Décrivez le poste et vos besoins</Label>
            <Textarea 
              placeholder="Ex: Nous recherchons un développeur senior React/Node.js avec 5 ans d'expérience, capable de gérer une équipe de 3 personnes. Environnement startup dynamique, full remote possible..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Générer l'offre
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Result */}
      {generatedPost && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Offre générée
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {generatedPost}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Manual Job Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Enregistrer un poste
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Titre du poste *</Label>
              <Input 
                id="jobTitle"
                placeholder="Développeur Full Stack Senior"
                value={jobForm.title}
                onChange={(e) => setJobForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Input 
                id="department"
                placeholder="Tech / Engineering"
                value={jobForm.department}
                onChange={(e) => setJobForm(f => ({ ...f, department: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Fourchette salariale</Label>
            <Input 
              id="salary"
              placeholder="55 000€ - 75 000€"
              value={jobForm.salaryRange}
              onChange={(e) => setJobForm(f => ({ ...f, salaryRange: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Compétences requises</Label>
            <Input 
              id="skills"
              placeholder="React, Node.js, TypeScript, PostgreSQL (séparées par des virgules)"
              value={jobForm.skills}
              onChange={(e) => setJobForm(f => ({ ...f, skills: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reqs">Exigences (une par ligne)</Label>
            <Textarea 
              id="reqs"
              placeholder="5 ans d'expérience minimum&#10;Anglais courant&#10;Capacité à travailler en équipe"
              value={jobForm.requirements}
              onChange={(e) => setJobForm(f => ({ ...f, requirements: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={handleSaveJob} disabled={isSaving} variant="hero" className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Enregistrer le poste
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
