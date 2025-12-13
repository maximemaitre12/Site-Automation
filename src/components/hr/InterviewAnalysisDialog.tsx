import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Interview } from '@/hooks/useInterviews';
import { InterviewAnalysisView } from './analysis/InterviewAnalysisView';

interface InterviewAnalysisDialogProps {
  interview: Interview | null;
  candidateName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InterviewAnalysisDialog({ 
  interview, 
  candidateName, 
  open, 
  onOpenChange 
}: InterviewAnalysisDialogProps) {
  if (!interview) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
        <InterviewAnalysisView 
          interview={interview}
          candidateName={candidateName}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
