import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'no-cache',
  'Content-Type': 'text/event-stream',
  'Connection': 'keep-alive',
};

interface WorkflowEvent {
  type: string;
  runId: string;
  blockId?: string;
  timestamp: string;
  data?: any;
  duration?: number;
  error?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }});
  }

  const url = new URL(req.url);
  const runId = url.searchParams.get('runId');

  if (!runId) {
    return new Response(JSON.stringify({ error: 'runId required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Verify the run exists
  const { data: run, error: runError } = await supabase
    .from('workflow_runs')
    .select('*')
    .eq('id', runId)
    .single();

  if (runError || !run) {
    return new Response(JSON.stringify({ error: 'Run not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Create SSE stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let lastStatus = JSON.stringify(run.blocks_status || {});
      let pollCount = 0;
      const maxPolls = 300; // 5 minutes max (1 second intervals)

      const sendEvent = (event: WorkflowEvent) => {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      // Send initial status
      sendEvent({
        type: 'workflow_started',
        runId,
        timestamp: new Date().toISOString(),
        data: {
          status: run.status,
          blocksStatus: run.blocks_status,
        },
      });

      // Poll for updates
      const pollInterval = setInterval(async () => {
        try {
          pollCount++;
          
          if (pollCount >= maxPolls) {
            sendEvent({
              type: 'workflow_timeout',
              runId,
              timestamp: new Date().toISOString(),
              error: 'Stream timeout reached',
            });
            clearInterval(pollInterval);
            controller.close();
            return;
          }

          const { data: currentRun, error } = await supabase
            .from('workflow_runs')
            .select('*')
            .eq('id', runId)
            .single();

          if (error) {
            console.error('Poll error:', error);
            return;
          }

          const currentStatus = JSON.stringify(currentRun.blocks_status || {});

          // Check if blocks_status changed
          if (currentStatus !== lastStatus) {
            const prevStatus = JSON.parse(lastStatus);
            const newStatus = currentRun.blocks_status || {};

            // Find changed blocks and emit events
            Object.entries(newStatus).forEach(([blockId, status]: [string, any]) => {
              const prevBlockStatus = prevStatus[blockId];
              
              if (!prevBlockStatus || prevBlockStatus.status !== status.status) {
                let eventType = 'block_started';
                
                if (status.status === 'running') {
                  eventType = 'block_started';
                } else if (status.status === 'success') {
                  eventType = 'block_completed';
                } else if (status.status === 'error') {
                  eventType = 'block_error';
                } else if (status.status === 'skipped') {
                  eventType = 'block_skipped';
                }

                sendEvent({
                  type: eventType,
                  runId,
                  blockId,
                  timestamp: new Date().toISOString(),
                  data: {
                    status: status.status,
                    output: status.output,
                    retryCount: status.retryCount,
                  },
                  duration: status.duration,
                  error: status.error,
                });
              }
            });

            lastStatus = currentStatus;
          }

          // Check if workflow completed or failed
          if (currentRun.status === 'completed') {
            sendEvent({
              type: 'workflow_completed',
              runId,
              timestamp: new Date().toISOString(),
              data: {
                output: currentRun.output_data,
                blocksStatus: currentRun.blocks_status,
              },
              duration: currentRun.completed_at && currentRun.started_at
                ? new Date(currentRun.completed_at).getTime() - new Date(currentRun.started_at).getTime()
                : undefined,
            });
            clearInterval(pollInterval);
            controller.close();
          } else if (currentRun.status === 'failed') {
            sendEvent({
              type: 'workflow_failed',
              runId,
              timestamp: new Date().toISOString(),
              error: currentRun.error_message,
              data: {
                blocksStatus: currentRun.blocks_status,
              },
            });
            clearInterval(pollInterval);
            controller.close();
          }
        } catch (err) {
          console.error('Poll error:', err);
        }
      }, 1000);

      // Handle client disconnect
      req.signal.addEventListener('abort', () => {
        clearInterval(pollInterval);
        controller.close();
      });
    },
  });

  return new Response(stream, { headers: corsHeaders });
});
