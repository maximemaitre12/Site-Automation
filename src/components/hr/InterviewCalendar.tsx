import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Video, Phone, Building, Clock, User 
} from 'lucide-react';
import { Interview } from '@/hooks/useInterviews';
import { InterviewProposal } from '@/hooks/useInterviewProposals';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InterviewCalendarProps {
  interviews: Interview[];
  candidates?: Array<{ id: string; name: string }>;
  proposals?: InterviewProposal[];
  onInterviewClick?: (interview: Interview) => void;
  onProposalClick?: (proposal: InterviewProposal) => void;
  onUpdateInterview?: (id: string, updates: Partial<Interview>) => Promise<void>;
}

export function InterviewCalendar({ interviews, candidates, proposals = [], onInterviewClick, onProposalClick, onUpdateInterview }: InterviewCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week (Monday = 0)
  const firstDayOfWeek = (monthStart.getDay() + 6) % 7;
  const leadingDays = Array(firstDayOfWeek).fill(null);

  const getInterviewsForDay = (date: Date) => {
    return interviews.filter(interview => 
      isSameDay(new Date(interview.scheduled_at), date)
    );
  };

  const getProposalsForDay = (date: Date) => {
    return proposals.filter(proposal => 
      proposal.proposed_slots.some(slot => 
        isSameDay(new Date(slot.date), date)
      )
    );
  };

  const selectedDayInterviews = selectedDate ? getInterviewsForDay(selectedDate) : [];
  const selectedDayProposals = selectedDate ? getProposalsForDay(selectedDate) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'confirmed': return 'bg-green-500';
      case 'completed': return 'bg-purple-500';
      case 'cancelled': return 'bg-muted';
      default: return 'bg-primary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-3 w-3" />;
      case 'phone': return <Phone className="h-3 w-3" />;
      case 'in_person': return <Building className="h-3 w-3" />;
      default: return <Video className="h-3 w-3" />;
    }
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </CardTitle>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Aujourd'hui
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {leadingDays.map((_, index) => (
              <div key={`leading-${index}`} className="aspect-square" />
            ))}
            {daysInMonth.map(day => {
              const dayInterviews = getInterviewsForDay(day);
              const dayProposals = getProposalsForDay(day);
              const hasEvents = dayInterviews.length > 0 || dayProposals.length > 0;
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    aspect-square p-1 rounded-lg text-sm relative transition-all
                    ${isToday(day) ? 'ring-2 ring-primary ring-offset-1' : ''}
                    ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                    ${!isSameMonth(day, currentDate) ? 'text-muted-foreground' : ''}
                  `}
                >
                  <span className="block">{format(day, 'd')}</span>
                  {hasEvents && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayInterviews.slice(0, 3).map((interview, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 w-1.5 rounded-full ${getStatusColor(interview.status)}`}
                        />
                      ))}
                      {dayProposals.length > 0 && (
                        <div className="h-1.5 w-1.5 rounded-full bg-warning" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Planifié</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Confirmé</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Terminé</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span>Proposition en attente</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            {selectedDate 
              ? format(selectedDate, 'EEEE d MMMM', { locale: fr })
              : 'Sélectionnez un jour'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {selectedDate ? (
              <div className="space-y-4">
                {/* Interviews */}
                {selectedDayInterviews.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Entretiens</h4>
                    {selectedDayInterviews.map(interview => (
                      <div 
                        key={interview.id}
                        onClick={() => onInterviewClick?.(interview)}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(interview.interview_type)}
                          <span className="font-medium text-sm">
                            {interview.candidate?.name || 'Candidat'}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              interview.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                              interview.status === 'completed' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                              'bg-muted'
                            }`}
                          >
                            {interview.status === 'scheduled' ? 'Planifié' :
                             interview.status === 'confirmed' ? 'Confirmé' :
                             interview.status === 'completed' ? 'Terminé' : 'Annulé'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(interview.scheduled_at), 'HH:mm')} - {interview.duration_minutes} min
                        </div>
                        {interview.interviewers.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <User className="h-3 w-3" />
                            {interview.interviewers.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Pending Proposals */}
                {selectedDayProposals.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Propositions en attente</h4>
                    {selectedDayProposals.map(proposal => (
                      <div 
                        key={proposal.id}
                        onClick={() => onProposalClick?.(proposal)}
                        className="p-3 border border-warning/30 bg-warning/5 rounded-lg hover:bg-warning/10 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="bg-warning/20 text-warning-foreground text-xs">
                            En attente
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {proposal.proposed_slots.length} créneau(x) proposé(s)
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedDayInterviews.length === 0 && selectedDayProposals.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun entretien ce jour</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Cliquez sur un jour pour voir les détails</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
