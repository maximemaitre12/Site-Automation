-- Ajouter colonnes à workflows pour variables et settings
ALTER TABLE workflows ADD COLUMN IF NOT EXISTS variables jsonb DEFAULT '{}';
ALTER TABLE workflows ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}';

-- Nouvelle table pour secrets de workflow (chiffrés)
CREATE TABLE IF NOT EXISTS workflow_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  key text NOT NULL,
  encrypted_value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(workflow_id, key)
);

-- Ajouter colonnes détaillées aux runs pour tracking parallèle
ALTER TABLE workflow_runs ADD COLUMN IF NOT EXISTS blocks_status jsonb DEFAULT '{}';
ALTER TABLE workflow_runs ADD COLUMN IF NOT EXISTS parallel_branches jsonb DEFAULT '[]';

-- RLS pour workflow_secrets
ALTER TABLE workflow_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their workflow secrets" ON workflow_secrets
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);