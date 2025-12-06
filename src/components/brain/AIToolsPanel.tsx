import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Wand2, BookOpen, Loader2, Copy, Check } from "lucide-react";

interface AIToolsPanelProps {
  onGenerateProcedure: (topic: string) => Promise<string | null>;
  onImproveText: (text: string, style: 'formal' | 'casual' | 'concise' | 'detailed') => Promise<string | null>;
}

export function AIToolsPanel({ onGenerateProcedure, onImproveText }: AIToolsPanelProps) {
  const [procedureTopic, setProcedureTopic] = useState("");
  const [procedureResult, setProcedureResult] = useState("");
  const [procedureLoading, setProcedureLoading] = useState(false);

  const [textToImprove, setTextToImprove] = useState("");
  const [improvedText, setImprovedText] = useState("");
  const [improveStyle, setImproveStyle] = useState<'formal' | 'casual' | 'concise' | 'detailed'>('formal');
  const [improveLoading, setImproveLoading] = useState(false);

  const [copied, setCopied] = useState<'procedure' | 'improve' | null>(null);

  const handleGenerateProcedure = async () => {
    if (!procedureTopic.trim()) return;
    setProcedureLoading(true);
    const result = await onGenerateProcedure(procedureTopic);
    if (result) setProcedureResult(result);
    setProcedureLoading(false);
  };

  const handleImproveText = async () => {
    if (!textToImprove.trim()) return;
    setImproveLoading(true);
    const result = await onImproveText(textToImprove, improveStyle);
    if (result) setImprovedText(result);
    setImproveLoading(false);
  };

  const copyToClipboard = async (text: string, type: 'procedure' | 'improve') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-primary" />
          Outils IA
        </CardTitle>
        <CardDescription>Génération et amélioration de contenu</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="procedure" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="procedure" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Procédure
            </TabsTrigger>
            <TabsTrigger value="improve" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Améliorer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="procedure" className="space-y-4">
            <div className="space-y-2">
              <Textarea
                value={procedureTopic}
                onChange={(e) => setProcedureTopic(e.target.value)}
                placeholder="Décrivez le sujet de la procédure à générer...&#10;Ex: Processus d'onboarding d'un nouvel employé"
                rows={3}
              />
              <Button 
                onClick={handleGenerateProcedure} 
                disabled={procedureLoading || !procedureTopic.trim()}
                className="w-full"
              >
                {procedureLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <BookOpen className="w-4 h-4 mr-2" />
                )}
                Générer la procédure
              </Button>
            </div>

            {procedureResult && (
              <div className="relative">
                <div className="p-4 bg-muted rounded-lg max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{procedureResult}</pre>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(procedureResult, 'procedure')}
                >
                  {copied === 'procedure' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="improve" className="space-y-4">
            <div className="space-y-2">
              <Textarea
                value={textToImprove}
                onChange={(e) => setTextToImprove(e.target.value)}
                placeholder="Collez le texte à améliorer..."
                rows={4}
              />
              <Select value={improveStyle} onValueChange={(v) => setImproveStyle(v as typeof improveStyle)}>
                <SelectTrigger>
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formel & Professionnel</SelectItem>
                  <SelectItem value="casual">Décontracté</SelectItem>
                  <SelectItem value="concise">Concis & Direct</SelectItem>
                  <SelectItem value="detailed">Détaillé & Explicatif</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleImproveText} 
                disabled={improveLoading || !textToImprove.trim()}
                className="w-full"
              >
                {improveLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="w-4 h-4 mr-2" />
                )}
                Améliorer le texte
              </Button>
            </div>

            {improvedText && (
              <div className="relative">
                <div className="p-4 bg-muted rounded-lg max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{improvedText}</pre>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(improvedText, 'improve')}
                >
                  {copied === 'improve' ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
