import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarPlus, Clock, Trash2, Plus, Send, Loader2, Mail } from 'lucide-react';
import { useInterviewProposals, ProposedSlot } from '@/hooks/useInterviewProposals';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Candidate {
  id: string;
  name: string;
  email: string | null;
}

interface ProposeDatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate;
  onSuccess?: () => void;
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
];

const durationOptions = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 heure' },
  { value: 90, label: '1h30' },
];

export function ProposeDatesDialog({ open, onOpenChange, candidate, onSuccess }: ProposeDatesDialogProps) {
  const { createProposal } = useInterviewProposals();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [duration, setDuration] = useState(60);
  const [slots, setSlots] = useState<ProposedSlot[]>([]);
  const [message, setMessage] = useState(
    `Bonjour ${candidate.name},\n\nNous souhaitons vous proposer un entretien. Veuillez sélectionner le créneau qui vous convient le mieux parmi les options suivantes.\n\nCordialement,\nL'équipe RH`
  );
  const [saving, setSaving] = useState(false);

  const handleAddSlot = () => {
    if (!selectedDate) return;

    const newSlot: ProposedSlot = {
      date: selectedDate.toISOString(),
      time: selectedTime,
      duration,
    };

    // Check if slot already exists
    const exists = slots.some(
      s => s.date === newSlot.date && s.time === newSlot.time
    );

    if (!exists) {
      setSlots([...slots, newSlot]);
    }
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (slots.length === 0) return;

    setSaving(true);
    try {
      await createProposal({
        candidate_id: candidate.id,
        proposed_slots: slots,
        message_to_candidate: message,
      });
      
      onOpenChange(false);
      onSuccess?.();
      
      // Reset form
      setSlots([]);
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Error creating proposal:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-primary" />
            Proposer des créneaux à {candidate.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 pb-4">
            {/* Slot selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Sélectionner une date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                  locale={fr}
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
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

                <Button 
                  onClick={handleAddSlot} 
                  disabled={!selectedDate}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter ce créneau
                </Button>

                {/* Added slots */}
                <div className="space-y-2">
                  <Label>Créneaux proposés ({slots.length}/3)</Label>
                  {slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Ajoutez au moins un créneau
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {slots.map((slot, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{index + 1}</Badge>
                            <span className="text-sm">
                              {format(new Date(slot.date), 'EEEE d MMMM', { locale: fr })}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              à {slot.time} ({slot.duration} min)
                            </span>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleRemoveSlot(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message to candidate */}
            <div>
              <Label className="mb-2 block flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Message au candidat
              </Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Message personnalisé pour le candidat..."
              />
              {!candidate.email && (
                <p className="text-xs text-warning mt-1">
                  ⚠️ Le candidat n'a pas d'adresse email. La proposition sera enregistrée mais non envoyée.
                </p>
              )}
            </div>

            {/* Email preview */}
            {candidate.email && slots.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <h4 className="text-sm font-medium mb-2">Aperçu de l'email</h4>
                <div className="text-sm space-y-2">
                  <p><strong>À:</strong> {candidate.email}</p>
                  <p><strong>Objet:</strong> Proposition d'entretien - {candidate.name}</p>
                  <div className="border-t pt-2 mt-2 whitespace-pre-wrap text-muted-foreground">
                    {message}
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <p className="font-medium">Créneaux proposés :</p>
                    <ul className="list-disc list-inside">
                      {slots.map((slot, i) => (
                        <li key={i}>
                          {format(new Date(slot.date), 'EEEE d MMMM yyyy', { locale: fr })} à {slot.time} ({slot.duration} min)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={slots.length === 0 || saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer la proposition
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
