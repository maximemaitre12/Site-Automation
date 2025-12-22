-- Table pour stocker les comptes email connectés
CREATE TABLE public.hr_email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook', 'manual')),
  email_address TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  sync_folder TEXT DEFAULT 'INBOX',
  sync_keywords JSONB DEFAULT '["CV", "candidature", "poste", "emploi", "recrutement"]',
  auto_parse_cv BOOLEAN DEFAULT true,
  auto_create_candidate BOOLEAN DEFAULT true,
  sender_name TEXT DEFAULT 'Service RH',
  signature_html TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour stocker les emails HR
CREATE TABLE public.hr_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  account_id UUID REFERENCES public.hr_email_accounts(id) ON DELETE SET NULL,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE SET NULL,
  
  -- Métadonnées email
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  to_name TEXT,
  subject TEXT NOT NULL,
  body_html TEXT,
  body_text TEXT,
  
  -- Pièces jointes
  attachments JSONB DEFAULT '[]',
  
  -- Analyse IA
  ai_analysis JSONB DEFAULT '{}',
  ai_suggested_response TEXT,
  ai_improvements JSONB DEFAULT '[]',
  
  -- Status et threading
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  parent_email_id UUID REFERENCES public.hr_emails(id) ON DELETE SET NULL,
  thread_id TEXT,
  external_id TEXT,
  provider TEXT,
  
  -- Timestamps
  email_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ
);

-- Index pour performance
CREATE INDEX idx_hr_emails_user_id ON public.hr_emails(user_id);
CREATE INDEX idx_hr_emails_candidate_id ON public.hr_emails(candidate_id);
CREATE INDEX idx_hr_emails_status ON public.hr_emails(status);
CREATE INDEX idx_hr_emails_direction ON public.hr_emails(direction);
CREATE INDEX idx_hr_email_accounts_user_id ON public.hr_email_accounts(user_id);

-- Enable RLS
ALTER TABLE public.hr_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_email_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their HR emails" 
ON public.hr_emails FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their email accounts" 
ON public.hr_email_accounts FOR ALL 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_hr_email_accounts_updated_at
  BEFORE UPDATE ON public.hr_email_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();