import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Briefcase, Building2, Banknote, ChevronDown, ChevronUp, 
  Users, Calendar, Trash2, Loader2
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { JobDescription } from '@/hooks/useHR';

interface JobCardProps {
  job: JobDescription;
  candidatesCount: number;
  onDelete?: (id: string) => Promise<boolean>;
}

export function JobCard({ job, candidatesCount, onDelete }: JobCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const skills = Array.isArray(job.skills) ? job.skills : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    await onDelete(job.id);
    setIsDeleting(false);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={`transition-all ${isOpen ? 'border-primary/50 shadow-lg' : 'hover:border-primary/30'}`}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {job.title}
                    <Badge variant={job.is_active ? "default" : "secondary"} className="ml-2">
                      {job.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                    {job.department && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {job.department}
                      </span>
                    )}
                    {job.salary_range && (
                      <span className="flex items-center gap-1">
                        <Banknote className="w-3 h-3" />
                        {job.salary_range}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {candidatesCount} candidat{candidatesCount !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(job.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-5">
            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Compétences requises</h4>
                <div className="flex flex-wrap gap-2">
                  {(skills as string[]).map((skill, i) => (
                    <Badge key={i} variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Exigences</h4>
                <ul className="space-y-1">
                  {(requirements as string[]).map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            {job.description && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Description du poste</h4>
                <ScrollArea className="max-h-60">
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap pr-4">
                    {job.description}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer ce poste ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Le poste "{job.title}" sera définitivement supprimé.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
