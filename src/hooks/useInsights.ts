import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { callAI } from '@/lib/ai';

export interface Dataset {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  file_url: string | null;
  row_count: number | null;
  column_count: number | null;
  columns_info: any;
  ai_summary: string | null;
  ai_insights: any;
  anomalies: any;
  recommendations: any;
  created_at: string;
}

export function useInsights() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDatasets = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setDatasets(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDatasets();
  }, [user]);

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return { headers: [], rows: [], rowCount: 0 };
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] || ''; });
      return row;
    });
    
    return { headers, rows, rowCount: rows.length };
  };

  const createDataset = async (name: string, csvContent: string): Promise<Dataset | null> => {
    if (!user) return null;

    try {
      const { headers, rows, rowCount } = parseCSV(csvContent);
      
      const columnsInfo = headers.map(h => ({
        name: h,
        sampleValues: rows.slice(0, 5).map(r => r[h])
      }));

      const { data: dataset, error } = await supabase
        .from('datasets')
        .insert({
          user_id: user.id,
          name,
          row_count: rowCount,
          column_count: headers.length,
          columns_info: columnsInfo
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchDatasets();
      toast({ title: 'Succès', description: 'Dataset importé' });
      return dataset;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'import', variant: 'destructive' });
      return null;
    }
  };

  const analyzeDataset = async (datasetId: string, csvContent: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { headers, rows } = parseCSV(csvContent);
      
      // Create a summary of the data for AI analysis
      const dataSummary = {
        columns: headers,
        rowCount: rows.length,
        sampleData: rows.slice(0, 10),
        columnStats: headers.map(h => {
          const values = rows.map(r => r[h]).filter(v => v);
          const numericValues = values.map(Number).filter(n => !isNaN(n));
          return {
            name: h,
            uniqueValues: [...new Set(values)].length,
            nullCount: rows.length - values.length,
            isNumeric: numericValues.length > values.length * 0.5,
            min: numericValues.length > 0 ? Math.min(...numericValues) : null,
            max: numericValues.length > 0 ? Math.max(...numericValues) : null,
            avg: numericValues.length > 0 ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length : null
          };
        })
      };

      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Analyse ce dataset et fournis des insights business en JSON:
{
  "summary": "résumé exécutif en 2-3 phrases",
  "key_metrics": [{"name": "métrique", "value": "valeur", "trend": "up|down|stable"}],
  "insights": ["insight actionnable 1", "insight 2"],
  "anomalies": [{"description": "anomalie détectée", "severity": "low|medium|high"}],
  "recommendations": ["recommandation 1", "recommandation 2"],
  "predictions": ["prédiction ou tendance anticipée"]
}

Dataset:
${JSON.stringify(dataSummary, null, 2)}`
        }],
        type: 'analyze'
      });

      let analysis: any = {};
      try {
        analysis = JSON.parse(response.content);
      } catch {
        analysis = { summary: response.content, insights: [], anomalies: [], recommendations: [] };
      }

      await supabase
        .from('datasets')
        .update({
          ai_summary: analysis.summary,
          ai_insights: analysis.insights || [],
          anomalies: analysis.anomalies || [],
          recommendations: analysis.recommendations || []
        })
        .eq('id', datasetId);

      await fetchDatasets();
      toast({ title: 'Succès', description: 'Analyse terminée' });
      return true;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'analyse', variant: 'destructive' });
      return false;
    }
  };

  const askQuestion = async (datasetId: string, question: string, csvContent: string): Promise<string | null> => {
    if (!user) return null;

    const dataset = datasets.find(d => d.id === datasetId);
    if (!dataset) return null;

    try {
      const { headers, rows } = parseCSV(csvContent);
      
      const response = await callAI({
        messages: [{
          role: 'user',
          content: `Réponds à cette question sur le dataset:

Question: ${question}

Dataset info:
- Colonnes: ${headers.join(', ')}
- Nombre de lignes: ${rows.length}
- Échantillon: ${JSON.stringify(rows.slice(0, 20))}

Donne une réponse claire et actionnable basée sur les données.`
        }],
        type: 'analyze'
      });

      return response.content;
    } catch (err) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'analyse', variant: 'destructive' });
      return null;
    }
  };

  const deleteDataset = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('datasets').delete().eq('id', id);
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return false;
    }
    await fetchDatasets();
    toast({ title: 'Succès', description: 'Dataset supprimé' });
    return true;
  };

  return {
    datasets,
    loading,
    createDataset,
    analyzeDataset,
    askQuestion,
    deleteDataset,
    parseCSV,
    refreshDatasets: fetchDatasets
  };
}
