-- Custom Block Definitions - AI-created and modified blocks
-- These blocks are shared across all users (is_global = true) or user-specific

CREATE TABLE public.custom_block_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Block definition fields (mirrors BlockDefinition type)
  type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'core',
  subcategory TEXT,
  icon TEXT NOT NULL DEFAULT 'Box',
  color TEXT NOT NULL DEFAULT '#64748b',
  description TEXT NOT NULL,
  params JSONB NOT NULL DEFAULT '[]'::jsonb,
  inputs INTEGER NOT NULL DEFAULT 1,
  outputs INTEGER NOT NULL DEFAULT 1,
  input_ports JSONB,
  output_ports JSONB,
  output_labels JSONB,
  is_real_action BOOLEAN DEFAULT false,
  requires_auth BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  is_sub_node BOOLEAN DEFAULT false,
  sub_node_type TEXT,
  
  -- Metadata
  is_global BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  source_block_type TEXT, -- If modified from an existing block
  modification_reason TEXT, -- AI's reasoning for the change
  usage_count INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_block_definitions ENABLE ROW LEVEL SECURITY;

-- Policies: Global blocks are readable by all authenticated users
CREATE POLICY "Global blocks are readable by all users"
ON public.custom_block_definitions
FOR SELECT
USING (is_global = true OR auth.uid() = created_by);

-- Only admins or creators can insert (for now, all authenticated users can create)
CREATE POLICY "Authenticated users can create blocks"
ON public.custom_block_definitions
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Only creators can update their own blocks
CREATE POLICY "Users can update their own blocks"
ON public.custom_block_definitions
FOR UPDATE
USING (auth.uid() = created_by OR is_global = true);

-- Only creators can delete their own blocks  
CREATE POLICY "Users can delete their own blocks"
ON public.custom_block_definitions
FOR DELETE
USING (auth.uid() = created_by);

-- Index for faster lookups
CREATE INDEX idx_custom_blocks_type ON public.custom_block_definitions(type);
CREATE INDEX idx_custom_blocks_category ON public.custom_block_definitions(category);
CREATE INDEX idx_custom_blocks_global ON public.custom_block_definitions(is_global) WHERE is_global = true;

-- Trigger for updated_at
CREATE TRIGGER update_custom_block_definitions_updated_at
BEFORE UPDATE ON public.custom_block_definitions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();