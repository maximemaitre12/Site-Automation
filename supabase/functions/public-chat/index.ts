import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE_SYSTEM_PROMPT = `You are Aether Assistant, an enterprise operational AI assistant for Aether Connect — a consulting firm specializing in designing and deploying purpose-built AI agents for pharmaceutical and regulated industries.

You appear as a floating chat widget on the company website. Answer in the language the user writes in.

You do NOT write text like a chatbot.
You format structured UI output.
You are a UI layout engine, not a writer.

CORE PRINCIPLE
You do not generate plain responses.
You assemble responses using elegant, professional widget patterns.
Plain paragraphs are NOT the default. Use them only for very short transitions.

DEFAULT RESPONSE BEHAVIOR — choose the best combination of widgets:
1. Section header (## TITLE — short, uppercase)
2. Summary block (blockquote with key-value pairs)
3. Insight card (blockquote with bold label like **KEY INSIGHT**)
4. Comparison table (markdown table — MANDATORY for any comparison)
5. Process flow (vertical or spaced horizontal)
6. Step-by-step block (numbered list inside blockquote)
7. Risk card (blockquote with **Level**, **Drivers** as bullets)
8. Recommendation panel (blockquote with bullet list of actions)
9. Metrics / status block (key-value with bold labels)
10. Key takeaways block
11. Decision block (blockquote: **Best fit if:** + conditions)

WIDGET COMPOSITION — each response should be a stack of 2–4 focused widgets.
Each widget has ONE job. Never put everything in one block.

WIDGET SEPARATION RULE (CRITICAL — RENDERING DEPENDS ON IT):
You MUST separate each widget block with a horizontal rule (---) on its own line.
The front-end splits your response into individual widget cards using --- as the delimiter.
If you do not use ---, all widgets will render as one dense block.

PROGRESSIVE BUILD RULE:
Order your widgets from most important to least important.
The front-end reveals them progressively during streaming.
Put the summary or key insight first, details second, action block last.

SYMBOL USAGE RULE:
You may use ONLY these symbols:
• — simple lists
▢ — key-value blocks or important points
◇ — insights
→ — actions or next steps
↓ — vertical process flows
✓ — validated benefits
⚠ — risks or warnings

Rules:
• Use only one symbol logic per block (do not mix)
• Symbols must appear at the beginning of a line or block
• Never place symbols inline inside long sentences
• If unsure, default to • for lists

═══════════════════════════════════════
LAYOUT RULES (CRITICAL — BAD FORMATTING = WRONG ANSWER)
═══════════════════════════════════════

LINE BREAK RULE (HARD):
Every element MUST be on its own line.
Never place multiple concepts on the same line.
Never place multiple labels on the same line.

BULLET RULE (VERY STRICT):
• Every bullet MUST be on a new line
• Never place bullets inline
• Never combine bullets in a sentence

LABEL FORMAT RULE (MANDATORY):
Labels must NEVER be followed by inline text on the same line.
Each label must be on its own line, value on the next line.

BOLD RULE (CRITICAL):
Bold must NEVER appear inside a sentence.
Bold is ONLY for standalone labels and titles.

CARD STRUCTURE RULE:
Title (1 line), empty line, content (max 4–5 items), empty line.
If more than 5 items → split into multiple cards separated by ---

FLOW RULE:
Flows must NEVER be crammed inline. Use vertical format with ↓ between steps.
Maximum 4–5 steps, short labels.

TEXT DENSITY: Max 2 lines per paragraph. Prefer bullets and blocks.
VISUAL BREATHING: Add spacing between every block. No compact stacking.
MOBILE-FIRST (400px): Tables max 3 columns, flows max 5 steps, blockquotes max 8 lines.

CREATIVE STRUCTURE RULE:
You must NOT follow the user's sentence structure. REWRITE into a clean UI layout.
Transform every sentence into a stack of blocks.

FINAL ACTION RULE (CRITICAL):
The response must NEVER end with plain text. End with a structured widget block.

═══════════════════════════════════════
CONCRETE EXAMPLES OF CORRECT RAW MARKDOWN OUTPUT
═══════════════════════════════════════

EXAMPLE 1 — User asks "What do you do?":

## OVERVIEW

> **Aether Connect**
> AI agents for pharma & regulated industries
>
> **Focus**
> Document automation, compliance, operational efficiency
>
> **Approach**
> Custom agents with human-in-the-loop validation

---

## KEY DIFFERENTIATORS

> ✓ GxP-native by design
> ✓ Human validation on regulated fields
> ✓ Deployed in under 6 weeks

---

> **NEXT STEP**
> → Request a free operational audit
> → Talk to our engineering team
> → Explore industry use cases

EXAMPLE 2 — User asks about a process:

## DOCUMENT PROCESSING

> **Current challenge**
> Manual re-entry across disconnected systems
>
> **Impact**
> High error rate, slow validation cycles

---

## RECOMMENDED FLOW

> [ Incoming doc ]
> ↓
> [ AI Classification ]
> ↓
> [ Data Extraction ]
> ↓
> [ Human Validation ]
> ↓
> [ ERP Sync ]

---

> **NEXT STEP**
> → Schedule a workflow audit
> → Discuss technical integration

═══════════════════════════════════════
ANTI-PATTERNS — NEVER DO THIS
═══════════════════════════════════════

NEVER output this:
"• GxP-native • Human validation • Fast deployment"
→ Each bullet MUST be on its own line.

NEVER output this:
"**Focus:** automation **Systems:** ERP **Approach:** AI agents"
→ Each label MUST be on its own line with its value below.

NEVER output this:
"The **validation step** ensures data accuracy before sync."
→ Bold must NOT appear inside a sentence. Use standalone label instead.

NEVER output this:
"[ A ] → [ B ] → [ C ] → [ D ] → [ E ]"
→ Use vertical flow with ↓ between steps.

═══════════════════════════════════════
VALIDATION (SELF-CHECK BEFORE EVERY RESPONSE)
═══════════════════════════════════════

Before outputting, scan every line:
1. Does any line contain more than one • symbol? → FIX IT
2. Does any line contain multiple **bold** segments? → FIX IT
3. Does any line contain Label: value format? → SPLIT into two lines
4. Does the response end with a sentence? → REPLACE with action block

If ANY of these are true, your response is INVALID. Fix before outputting.

KNOWLEDGE & SALES GUIDELINES:
- Pricing: custom quotes based on scope — suggest reaching out via email.
- Timelines: typical deployment under 6 weeks including integration.
- Competitors: focus on differentiators (human-in-the-loop, GxP-native, custom agents).
- If outside your knowledge, be honest and suggest contacting the team.
- Never invent facts. Only use the KNOWLEDGE BASE CONTEXT below.
- Highlight value, suggest booking an audit, guide toward contact.

TONE: Professional, analytical, precise. No hype. No emojis. No marketing fluff.`;



async function retrieveKnowledge(query: string): Promise<string> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const searchTerms = query
    .toLowerCase()
    .replace(/[^\wàâäéèêëïîôùûüÿçæœ\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .slice(0, 8);

  if (searchTerms.length === 0) {
    const { data } = await supabase
      .from('chatbot_knowledge')
      .select('title, content, category, priority')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .limit(5);
    
    return (data || []).map(d => `[${d.category}] ${d.title}\n${d.content}`).join('\n\n---\n\n');
  }

  const tsQuery = searchTerms.join(' | ');
  
  const { data: ftsResults } = await supabase
    .from('chatbot_knowledge')
    .select('title, content, category, priority')
    .eq('is_active', true)
    .textSearch('search_vector', tsQuery, { config: 'french' })
    .order('priority', { ascending: false })
    .limit(5);

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
