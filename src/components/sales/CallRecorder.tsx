import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Square, Upload, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface CallRecorderProps {
  onTranscriptReady: (transcript: string) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

export function CallRecorder({ onTranscriptReady, onRecordingStateChange }: CallRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'success' | 'error'>('idle');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setStatus('recording');
      onRecordingStateChange?.(true);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Erreur microphone',
        description: 'Impossible d\'accéder au microphone. Vérifiez les permissions.',
        variant: 'destructive'
      });
    }
  }, [onRecordingStateChange, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onRecordingStateChange?.(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording, onRecordingStateChange]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast({
          title: 'Format invalide',
          description: 'Veuillez sélectionner un fichier audio (MP3, WAV, M4A, etc.)',
          variant: 'destructive'
        });
        return;
      }
      setAudioBlob(file);
      setStatus('idle');
    }
  }, [toast]);

  const processAudio = useCallback(async () => {
    if (!audioBlob) return;

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (audioBlob.size > maxSize) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'L\'audio ne doit pas dépasser 5 MB. Utilisez un enregistrement plus court.',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    setStatus('processing');

    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);
      
      const base64Audio = await base64Promise;
      console.log('Audio size (base64):', base64Audio.length, 'bytes');

      // Create timeout promise (2 minutes)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 120000);
      });

      // Call transcription edge function with timeout
      const transcriptionPromise = supabase.functions.invoke('transcribe-audio', {
        body: { 
          audio: base64Audio,
          mimeType: audioBlob.type || 'audio/webm'
        }
      });

      const result = await Promise.race([transcriptionPromise, timeoutPromise]) as { data: any; error: any };
      const { data, error } = result;

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        toast({
          title: 'Transcription échouée',
          description: data.error,
          variant: 'destructive'
        });
        setStatus('error');
        return;
      }

      if (data?.fallback) {
        toast({
          title: 'Transcription manuelle requise',
          description: data.error || 'La transcription automatique n\'est pas disponible.',
          variant: 'destructive'
        });
        setStatus('error');
        return;
      }

      if (data?.text) {
        onTranscriptReady(data.text);
        setStatus('success');
        toast({
          title: 'Transcription terminée',
          description: 'L\'enregistrement a été transcrit avec succès.'
        });
      } else {
        throw new Error('Aucune transcription retournée');
      }

    } catch (error) {
      console.error('Processing error:', error);
      setStatus('error');
      
      const errorMessage = error instanceof Error && error.message === 'Timeout'
        ? 'La transcription a pris trop de temps. Utilisez un audio plus court ou collez le texte manuellement.'
        : 'Impossible de transcrire l\'audio. Vérifiez votre connexion ou collez le transcript manuellement.';
      
      toast({
        title: 'Erreur de traitement',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [audioBlob, onTranscriptReady, toast]);

  const resetRecorder = useCallback(() => {
    setAudioBlob(null);
    setRecordingTime(0);
    setStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border-border bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Mic className="w-4 h-4" />
          Enregistrement d'appel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording Controls */}
        <div className="flex items-center gap-3">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={isProcessing}
              variant="default"
              className="gap-2"
            >
              <Mic className="w-4 h-4" />
              Démarrer l'enregistrement
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="gap-2 animate-pulse"
            >
              <Square className="w-4 h-4" />
              Arrêter ({formatTime(recordingTime)})
            </Button>
          )}

          <span className="text-muted-foreground">ou</span>

          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isRecording || isProcessing}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Importer un fichier audio
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
            <span className="text-sm text-destructive font-medium">
              Enregistrement en cours... {formatTime(recordingTime)}
            </span>
          </div>
        )}

        {/* Audio ready for processing */}
        {audioBlob && !isRecording && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">
                Audio prêt ({(audioBlob.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetRecorder}
                className="ml-auto"
              >
                Réinitialiser
              </Button>
            </div>

            <Button
              onClick={processAudio}
              disabled={isProcessing}
              variant="hero"
              className="w-full gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Transcription en cours...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Transcrire et analyser
                </>
              )}
            </Button>
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="space-y-2">
            <Progress value={undefined} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Transcription de l'audio en cours... Cela peut prendre quelques instants.
            </p>
          </div>
        )}

        {/* Status messages */}
        {status === 'success' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm text-success">Transcription réussie!</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">
              Erreur de transcription. Vous pouvez coller le transcript manuellement ci-dessous.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
