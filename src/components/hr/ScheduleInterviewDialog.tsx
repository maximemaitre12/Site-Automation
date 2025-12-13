import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Phone, Building, Loader2, X, Plus } from 'lucide-react';
import { useInterviews, CreateInterviewData, Interview } from '@/hooks/useInterviews';
import { InterviewQuestionsDisplay } from './InterviewQuestionsDisplay';
import { callAI } from '@/lib/ai';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Candidate {
  id: string;
  name: string;
  skills?: string[] | null;
  experience_years?: number | null;
  ai_analysis?: {
    summary?: string;
    strengths?: string[];
    concerns?: string[];
  } | null;
  job_id?: string | null;
}

interface Job {
  id: string;
  title: string;
  description?: string | null;
  skills?: string[] | null;
}

interface ScheduleInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate;
  job?: Job | null;
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00'
];

const durationOptions = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 heure' },
  { value: 90, label: '1h30' },
];

export function ScheduleInterviewDialog({ open, onOpenChange, candidate, job }: ScheduleInterviewDialogProps) {
  const { createInterview } = useInterviews();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [duration, setDuration] = useState(60);
  const [interviewType, setInterviewType] = useState<'video' | 'phone' | 'in_person'>('video');
  const [location, setLocation] = useState('');
  const [interviewers, setInterviewers] = useState<string[]>([]);
  const [newInterviewer, setNewInterviewer] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Interview['ai_suggested_questions'] | null>(null);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGenerateQuestions = async () => {
    setGeneratingQuestions(true);
    try {
      const candidateSkills = Array.isArray(candidate.skills) ? candidate.skills.join(', ') : 'Non spécifiées';
      const jobSkills = Array.isArray(job?.skills) ? job.skills.join(', ') : '';
      
      const prompt = `Tu es un expert RH. Génère 8-10 questions d'entretien pertinentes pour ce candidat.

CANDIDAT:
- Nom: ${candidate.name}
- Compétences: ${candidateSkills}
- Expérience: ${candidate.experience_years || 'Non spécifiée'} ans
${candidate.ai_analysis?.summary ? `- Résumé CV: ${candidate.ai_analysis.summary}` : ''}
${candidate.ai_analysis?.strengths?.length ? `- Forces: ${candidate.ai_analysis.strengths.join(', ')}` : ''}
${candidate.ai_analysis?.concerns?.length ? `- Points d'attention: ${candidate.ai_analysis.concerns.join(', ')}` : ''}

${job ? `POSTE:
- Titre: ${job.title}
- Description: ${job.description || 'Non spécifiée'}
- Compétences requises: ${jobSkills || 'Non spécifiées'}` : ''}

Génère des questions en JSON STRICT (pas de markdown):
{
  "technical": ["Question technique 1", "Question technique 2", "Question technique 3"],
  "behavioral": ["Question comportementale 1", "Question comportementale 2"],
  "experience": ["Question sur l'expérience 1", "Question sur l'expérience 2"],
  "motivation": ["Question de motivation 1"],
  "specific": ["Question spécifique au profil 1", "Question spécifique 2"]
}

Les questions doivent être:
- Précises et basées sur le parcours du candidat
- Adaptées au niveau d'expérience
- Orientées vers des exemples concrets (méthode STAR)
- En français`;

      const response = await callAI({
        messages: [{ role: 'user', content: prompt }],
        type: 'generate',
      });

      if (response.content) {
        try {
          // Try to extract JSON from the response
          let jsonStr = response.content;
          const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonStr = jsonMatch[0];
          }
          const questions = JSON.parse(jsonStr);
          setGeneratedQuestions(questions);
        } catch (parseError) {
          console.error('Error parsing questions:', parseError);
          // Generate fallback questions
          setGeneratedQuestions({
            technical: ["Parlez-moi de votre expérience technique la plus significative.", "Quel projet technique vous a le plus challengé ?"],
            behavioral: ["Décrivez une situation de conflit en équipe et comment vous l'avez gérée."],
            experience: ["Quelles sont vos principales réalisations professionnelles ?"],
            motivation: ["Pourquoi ce poste vous intéresse-t-il ?"],
            specific: ["Qu'est-ce qui vous différencie des autres candidats ?"]
          });
        }
      }
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const handleAddInterviewer = () => {
    if (newInterviewer.trim() && !interviewers.includes(newInterviewer.trim())) {
      setInterviewers([...interviewers, newInterviewer.trim()]);
      setNewInterviewer('');
    }
  };

  const handleRemoveInterviewer = (name: string) => {
    setInterviewers(interviewers.filter(i => i !== name));
  };

  const handleSubmit = async () => {
    if (!selectedDate) return;

    setSaving(true);
    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(hours, minutes, 0, 0);

      const data: CreateInterviewData = {
        candidate_id: candidate.id,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: duration,
        interview_type: interviewType,
        location: location || undefined,
        interviewers,
        ai_suggested_questions: generatedQuestions || undefined,
      };

      await createInterview(data);
      onOpenChange(false);
      
      // Reset form
      setSelectedDate(undefined);
      setSelectedTime('09:00');
      setDuration(60);
      setInterviewType('video');
      setLocation('');
      setInterviewers([]);
      setGeneratedQuestions(null);
    } catch (error) {
      console.error('Error scheduling interview:', error);
    } finally {
      setSaving(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in_person': return <Building className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Planifier un entretien - {candidate.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
            {/* Left column - Date & Time */}
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Date de l'entretien</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                  locale={fr}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Heure</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <Clock className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Durée</Label>
                  <Select value={duration.toString()} onValueChange={(v) => setDuration(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Type d'entretien</Label>
                <Select value={interviewType} onValueChange={(v) => setInterviewType(v as any)}>
                  <SelectTrigger>
                    {getTypeIcon(interviewType)}
                    <SelectValue className="ml-2" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" /> Visioconférence
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Téléphone
                      </div>
                    </SelectItem>
                    <SelectItem value="in_person">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" /> Présentiel
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  {interviewType === 'video' ? 'Lien visio' : interviewType === 'phone' ? 'Numéro de téléphone' : 'Adresse'}
                </Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={interviewType === 'video' ? 'https://meet.google.com/...' : interviewType === 'phone' ? '+33 1 23 45 67 89' : '123 rue de...'}
                />
              </div>

              <div>
                <Label className="mb-2 block">Intervieweur(s)</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newInterviewer}
                    onChange={(e) => setNewInterviewer(e.target.value)}
                    placeholder="Nom de l'intervieweur"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddInterviewer()}
                  />
                  <Button type="button" size="icon" variant="outline" onClick={handleAddInterviewer}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interviewers.map(name => (
                    <Badge key={name} variant="secondary" className="gap-1">
                      {name}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveInterviewer(name)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - AI Questions */}
            <div className="space-y-4">
              <InterviewQuestionsDisplay
                questions={generatedQuestions}
                candidateName={candidate.name}
                jobTitle={job?.title}
                matchScore={undefined}
                onRegenerate={handleGenerateQuestions}
                isGenerating={generatingQuestions}
              />
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t mt-4">
          <div className="text-sm text-muted-foreground">
            {selectedDate && (
              <span>
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })} à {selectedTime}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={!selectedDate || saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CalendarIcon className="h-4 w-4 mr-2" />}
              Planifier l'entretien
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
