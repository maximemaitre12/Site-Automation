-- Create interview_date_proposals table for multiple date proposals
CREATE TABLE public.interview_date_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  interview_id UUID REFERENCES public.candidate_interviews(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  proposed_slots JSONB NOT NULL DEFAULT '[]',
  selected_slot_index INTEGER,
  candidate_response TEXT DEFAULT 'pending' CHECK (candidate_response IN ('pending', 'accepted', 'rejected', 'counter_proposed')),
  candidate_counter_proposal TIMESTAMP WITH TIME ZONE,
  message_to_candidate TEXT,
  candidate_email_sent_at TIMESTAMP WITH TIME ZONE,
  confirmation_email_sent_at TIMESTAMP WITH TIME ZONE,
  confirmation_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.interview_date_proposals ENABLE ROW LEVEL SECURITY;

-- RLS policy
CREATE POLICY "Users can manage their interview proposals"
ON public.interview_date_proposals
FOR ALL
USING (auth.uid() = user_id);

-- Add new columns to candidate_interviews for comprehensive analysis
ALTER TABLE public.candidate_interviews 
ADD COLUMN IF NOT EXISTS audio_recording_url TEXT,
ADD COLUMN IF NOT EXISTS audio_duration_seconds INTEGER,
ADD COLUMN IF NOT EXISTS transcript TEXT,
ADD COLUMN IF NOT EXISTS voice_analysis JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS technical_evaluation JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS behavioral_evaluation JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cultural_fit_evaluation JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS match_score NUMERIC,
ADD COLUMN IF NOT EXISTS match_breakdown JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ai_report JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS recruiter_feedback TEXT,
ADD COLUMN IF NOT EXISTS feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE;

-- Create index for confirmation token lookup (public access)
CREATE INDEX IF NOT EXISTS idx_interview_proposals_token ON public.interview_date_proposals(confirmation_token);

-- Trigger for updated_at
CREATE TRIGGER update_interview_date_proposals_updated_at
BEFORE UPDATE ON public.interview_date_proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();