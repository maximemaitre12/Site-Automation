-- Table pour les entretiens planifiés
CREATE TABLE public.candidate_interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  candidate_id uuid NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  
  -- Créneau
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  
  -- Type et lieu
  interview_type text DEFAULT 'video',
  location text,
  
  -- Intervieweur(s)
  interviewers jsonb DEFAULT '[]'::jsonb,
  
  -- Questions IA suggérées
  ai_suggested_questions jsonb DEFAULT '[]'::jsonb,
  
  -- Notes et résultat
  notes text,
  outcome text,
  
  -- Statut
  status text DEFAULT 'scheduled',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.candidate_interviews ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can manage their interviews" 
ON public.candidate_interviews 
FOR ALL 
USING (auth.uid() = user_id);

-- Index pour performance
CREATE INDEX idx_interviews_scheduled ON public.candidate_interviews(scheduled_at);
CREATE INDEX idx_interviews_candidate ON public.candidate_interviews(candidate_id);
CREATE INDEX idx_interviews_user ON public.candidate_interviews(user_id);