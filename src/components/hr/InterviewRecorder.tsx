import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Upload, Play, Pause, Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InterviewRecorderProps {
  interviewId: string;
  onTranscriptReady: (transcript: string, audioUrl: string, duration: number) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

export function InterviewRecorder({ interviewId, onTranscriptReady, onRecordingStateChange }: InterviewRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      setStatus('recording');
      onRecordingStateChange?.(true);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onRecordingStateChange?.(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a'];
    if (!validTypes.some(type => file.type.includes(type.split('/')[1]))) {
      toast({
        title: "Format non supporté",
        description: "Veuillez utiliser un fichier audio (MP3, WAV, WebM, OGG, M4A)",
        variant: "destructive",
      });
      return;
    }

    setAudioBlob(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setStatus('idle');
  };

  const processAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    setStatus('processing');
    setErrorMessage(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);
      const base64Audio = await base64Promise;

      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Non authentifié');

      // Transcribe
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-audio`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            audio: base64Audio,
            mimeType: audioBlob.type || 'audio/webm',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de transcription');
      }

      const data = await response.json();
      
      if (data.text) {
        // Upload audio to storage
        const fileName = `interviews/${interviewId}/${Date.now()}.webm`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, audioBlob, { contentType: audioBlob.type });

        let storedUrl = '';
        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName);
          storedUrl = urlData.publicUrl;
        }

        setStatus('success');
        onTranscriptReady(data.text, storedUrl, recordingTime);
        toast({
          title: "Transcription terminée",
          description: "L'enregistrement a été transcrit avec succès",
        });
      }
    } catch (error: any) {
      console.error('Error processing audio:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Erreur lors du traitement');
      toast({
        title: "Erreur",
        description: error.message || "Impossible de transcrire l'audio",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetRecorder = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setStatus('idle');
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Mic className="h-4 w-4 text-primary" />
          Enregistrement d'entretien
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording controls */}
        <div className="flex items-center gap-3">
          {!isRecording && !audioBlob && (
            <>
              <Button onClick={startRecording} variant="default" className="gap-2">
                <Mic className="h-4 w-4" />
                Démarrer l'enregistrement
              </Button>
              <span className="text-sm text-muted-foreground">ou</span>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Importer un fichier
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </>
          )}

          {isRecording && (
            <div className="flex items-center gap-4 w-full">
              <Button 
                onClick={stopRecording} 
                variant="destructive"
                className="gap-2"
              >
                <MicOff className="h-4 w-4" />
                Arrêter
              </Button>
              <div className="flex items-center gap-2 flex-1">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
              </div>
            </div>
          )}

          {audioBlob && !isRecording && (
            <div className="flex items-center gap-3 w-full">
              <audio src={audioUrl!} controls className="flex-1 h-10" />
              <Button
                size="icon"
                variant="ghost"
                onClick={resetRecorder}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Status indicators */}
        {status === 'recording' && (
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              Enregistrement en cours
            </Badge>
            <span className="text-muted-foreground">
              Durée: {formatTime(recordingTime)}
            </span>
          </div>
        )}

        {status === 'processing' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Transcription en cours...</span>
            </div>
            <Progress value={undefined} className="h-2" />
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Transcription réussie</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <XCircle className="h-4 w-4" />
            <span>{errorMessage || 'Erreur de transcription'}</span>
          </div>
        )}

        {/* Process button */}
        {audioBlob && !isRecording && status !== 'success' && (
          <Button 
            onClick={processAudio} 
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Transcription...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Transcrire l'enregistrement
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
