import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE_SYSTEM_PROMPT = `You are the AI assistant for Aether Connect — a consulting firm specializing in designing and deploying purpose-built AI agents for pharmaceutical and regulated industries. You appear as a floating chat widget on the company website. Be concise, professional, warm and helpful.

RESPONSE GUIDELINES:
- Be concise and professional. Answer in the language the user writes in.
- When asked about pricing: we provide custom quotes based on scope — suggest reaching out via email for a personalized proposal.
- When asked about timelines: typical deployment is under 6 weeks including system integration.
- When asked about competitors or comparisons: focus on our differentiators (human-in-the-loop, GxP-native, production-grade, no SaaS — custom agents).
- If the question is outside your knowledge, be honest and suggest contacting the team directly.
- Keep responses concise (2-4 sentences for simple questions, more for detailed ones).
- Never invent facts. Only use the information provided in the KNOWLEDGE BASE CONTEXT below.
- Be a sales-oriented assistant: highlight value, suggest booking an audit, and guide toward contact.`;

async function retrieveKnowledge(query: string): Promise<string> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Clean query for full-text search
  const searchTerms = query
    .toLowerCase()
    .replace(/[^\wàâäéèêëïîôùûüÿçæœ\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .slice(0, 8);

  if (searchTerms.length === 0) {
    // Return general overview if no specific terms
    const { data } = await supabase
      .from('chatbot_knowledge')
      .select('title, content, category, priority')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .limit(5);
    
    return (data || []).map(d => `[${d.category}] ${d.title}\n${d.content}`).join('\n\n---\n\n');
  }

  // Full-text search with French config
  const tsQuery = searchTerms.join(' | ');
  
  const { data: ftsResults } = await supabase
    .from('chatbot_knowledge')
    .select('title, content, category, priority')
    .eq('is_active', true)
    .textSearch('search_vector', tsQuery, { config: 'french' })
    .order('priority', { ascending: false })
    .limit(5);

  // Fallback: keyword matching if FTS returns nothing
  let results = ftsResults || [];
  
  if (results.length === 0) {
    const { data: keywordResults } = await supabase
      .from('chatbot_knowledge')
      .select('title, content, category, priority, keywords')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (keywordResults) {
      const queryLower = query.toLowerCase();
      results = keywordResults
        .map(doc => {
          let score = 0;
          const titleLower = doc.title.toLowerCase();
          const contentLower = doc.content.toLowerCase();
          const kws = (doc.keywords || []) as string[];

          if (titleLower.includes(queryLower)) score += 10;
          searchTerms.forEach(term => {
            if (titleLower.includes(term)) score += 5;
            if (contentLower.includes(term)) score += 2;
            if (kws.some((k: string) => k.toLowerCase().includes(term))) score += 3;
          });
          return { ...doc, score };
        })
        .filter(d => d.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    }
  }

  if (results.length === 0) {
    // Return top priority docs as general context
    const { data: fallback } = await supabase
      .from('chatbot_knowledge')
      .select('title, content, category, priority')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .limit(3);
    results = fallback || [];
  }

  return results.map(d => `[${d.category}] ${d.title}\n${d.content}`).join('\n\n---\n\n');
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // RAG: retrieve relevant knowledge based on the last user message
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user')?.content || '';
    console.log(`[RAG] Query: "${lastUserMessage}"`);
    
    const knowledgeContext = await retrieveKnowledge(lastUserMessage);
    console.log(`[RAG] Retrieved ${knowledgeContext.length} chars of context`);

    const fullSystemPrompt = `${BASE_SYSTEM_PROMPT}

═══════════════════════════════════════
KNOWLEDGE BASE CONTEXT (use this to answer)
═══════════════════════════════════════

${knowledgeContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: fullSystemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("public-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
