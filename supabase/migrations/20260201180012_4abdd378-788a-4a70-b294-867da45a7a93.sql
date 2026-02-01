-- Système de Queue pour l'exécution distribuée des workflows
-- Job Queue pour distribuer les tâches entre workers virtuels
CREATE TABLE IF NOT EXISTS public.workflow_job_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  run_id uuid REFERENCES workflow_runs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  
  -- Job details
  block_id text NOT NULL,
  block_type text NOT NULL,
  block_config jsonb DEFAULT '{}',
  input_data jsonb DEFAULT '{}',
  
  -- Execution control
  priority integer DEFAULT 5, -- 1=highest, 10=lowest
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'running', 'completed', 'failed', 'timeout')),
  worker_id text, -- Virtual worker identifier
  chunk_index integer DEFAULT 0,
  total_chunks integer DEFAULT 1,
  
  -- Retry & timing
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 3,
  timeout_seconds integer DEFAULT 60,
  
  -- Results
  output_data jsonb,
  error_message text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  claimed_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  
  -- Indexing for fast queue operations
  CONSTRAINT valid_priority CHECK (priority >= 1 AND priority <= 10)
);

-- Worker registry for tracking virtual workers
CREATE TABLE IF NOT EXISTS public.workflow_workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id text UNIQUE NOT NULL,
  user_id uuid NOT NULL,
  
  -- Worker status
  status text DEFAULT 'idle' CHECK (status IN ('idle', 'busy', 'offline')),
  current_job_id uuid REFERENCES workflow_job_queue(id),
  
  -- Statistics
  jobs_completed integer DEFAULT 0,
  jobs_failed integer DEFAULT 0,
  total_execution_ms bigint DEFAULT 0,
  avg_execution_ms integer DEFAULT 0,
  
  -- Health
  last_heartbeat timestamptz DEFAULT now(),
  last_job_at timestamptz,
  created_at timestamptz DEFAULT now(),
  
  -- Capabilities
  max_concurrent_jobs integer DEFAULT 3,
  supported_block_types text[] DEFAULT ARRAY['*']
);

-- Distributed execution metrics
CREATE TABLE IF NOT EXISTS public.workflow_distributed_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES workflow_runs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  
  -- Metrics
  total_jobs integer DEFAULT 0,
  parallel_jobs integer DEFAULT 0,
  sequential_jobs integer DEFAULT 0,
  
  -- Performance
  total_execution_ms bigint DEFAULT 0,
  parallel_execution_ms bigint DEFAULT 0,
  sequential_execution_ms bigint DEFAULT 0,
  speedup_factor numeric(5,2) DEFAULT 1.0,
  
  -- Workers used
  workers_used integer DEFAULT 1,
  peak_concurrent_jobs integer DEFAULT 1,
  
  -- Chunks
  total_chunks integer DEFAULT 0,
  avg_chunk_size integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now()
);

-- Indexes for queue performance
CREATE INDEX IF NOT EXISTS idx_job_queue_status ON workflow_job_queue(status) WHERE status IN ('pending', 'claimed');
CREATE INDEX IF NOT EXISTS idx_job_queue_priority ON workflow_job_queue(priority, created_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_job_queue_run ON workflow_job_queue(run_id);
CREATE INDEX IF NOT EXISTS idx_workers_status ON workflow_workers(status);
CREATE INDEX IF NOT EXISTS idx_workers_heartbeat ON workflow_workers(last_heartbeat);

-- Enable RLS
ALTER TABLE workflow_job_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_distributed_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their job queue" ON workflow_job_queue
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their workers" ON workflow_workers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their distributed metrics" ON workflow_distributed_metrics
  FOR ALL USING (auth.uid() = user_id);

-- Enable realtime for queue updates
ALTER PUBLICATION supabase_realtime ADD TABLE workflow_job_queue;