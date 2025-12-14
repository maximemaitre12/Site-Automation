-- Add deal_id to call_analyses for linking calls to deals
ALTER TABLE public.call_analyses 
ADD COLUMN IF NOT EXISTS deal_id uuid REFERENCES public.sales_deals(id) ON DELETE SET NULL;

-- Create negotiation_sheets table for deal preparation
CREATE TABLE IF NOT EXISTS public.negotiation_sheets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  deal_id uuid REFERENCES public.sales_deals(id) ON DELETE CASCADE,
  title text NOT NULL,
  
  -- Context
  company_context text,
  contact_context text,
  current_situation text,
  
  -- AI-generated content
  key_arguments jsonb DEFAULT '[]'::jsonb,
  anticipated_objections jsonb DEFAULT '[]'::jsonb,
  counter_arguments jsonb DEFAULT '[]'::jsonb,
  price_justification text,
  competitive_advantages jsonb DEFAULT '[]'::jsonb,
  closing_strategies jsonb DEFAULT '[]'::jsonb,
  next_steps jsonb DEFAULT '[]'::jsonb,
  
  -- Follow-up tracking
  follow_up_date date,
  follow_up_notes text,
  negotiation_status text DEFAULT 'preparation',
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.negotiation_sheets ENABLE ROW LEVEL SECURITY;

-- RLS policies for negotiation_sheets
CREATE POLICY "Users can CRUD own negotiation sheets" 
ON public.negotiation_sheets 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_call_analyses_deal_id ON public.call_analyses(deal_id);
CREATE INDEX IF NOT EXISTS idx_negotiation_sheets_deal_id ON public.negotiation_sheets(deal_id);
CREATE INDEX IF NOT EXISTS idx_negotiation_sheets_user_id ON public.negotiation_sheets(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_negotiation_sheets_updated_at
BEFORE UPDATE ON public.negotiation_sheets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();