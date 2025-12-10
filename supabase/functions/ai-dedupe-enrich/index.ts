import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple fuzzy matching function
function similarity(s1: string, s2: string): number {
  if (!s1 || !s2) return 0;
  s1 = s1.toLowerCase().trim();
  s2 = s2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  if (s1.length < 2 || s2.length < 2) return 0;
  
  // Levenshtein distance-based similarity
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  const longerLength = longer.length;
  if (longerLength === 0) return 1;
  
  // Simple containment check
  if (longer.includes(shorter) || shorter.includes(longer)) {
    return shorter.length / longer.length + 0.2;
  }
  
  // Word overlap
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const commonWords = words1.filter(w => words2.some(w2 => w2.includes(w) || w.includes(w2)));
  
  return Math.min(1, commonWords.length / Math.max(words1.length, words2.length));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, entity_type = 'company', entity_id } = await req.json();

    if (action === 'detect_duplicates') {
      // Fetch entities based on type
      let entities: any[] = [];
      
      if (entity_type === 'company') {
        const { data } = await supabaseClient
          .from('enriched_companies')
          .select('*')
          .eq('user_id', user.id);
        entities = data || [];
      } else if (entity_type === 'deal') {
        const { data } = await supabaseClient
          .from('sales_deals')
          .select('*')
          .eq('user_id', user.id);
        entities = data || [];
      }

      const duplicateCandidates: any[] = [];
      const processed = new Set<string>();

      // Compare all pairs
      for (let i = 0; i < entities.length; i++) {
        for (let j = i + 1; j < entities.length; j++) {
          const e1 = entities[i];
          const e2 = entities[j];
          
          const pairKey = [e1.id, e2.id].sort().join('-');
          if (processed.has(pairKey)) continue;
          processed.add(pairKey);

          const matchingFields: string[] = [];
          let totalScore = 0;
          let fieldCount = 0;

          if (entity_type === 'company') {
            // Check SIREN/SIRET exact match
            if (e1.siren && e2.siren && e1.siren === e2.siren) {
              matchingFields.push('siren');
              totalScore += 1;
              fieldCount++;
            }
            
            // Name similarity
            const nameScore = similarity(e1.name, e2.name);
            if (nameScore > 0.7) {
              matchingFields.push('name');
              totalScore += nameScore;
              fieldCount++;
            }

            // Website match
            if (e1.website && e2.website) {
              const w1 = e1.website.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
              const w2 = e2.website.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
              if (w1 === w2) {
                matchingFields.push('website');
                totalScore += 1;
                fieldCount++;
              }
            }

            // City match
            if (e1.city && e2.city && e1.city.toLowerCase() === e2.city.toLowerCase()) {
              matchingFields.push('city');
              totalScore += 0.5;
              fieldCount++;
            }
          } else if (entity_type === 'deal') {
            // Email match
            if (e1.contact_email && e2.contact_email && e1.contact_email.toLowerCase() === e2.contact_email.toLowerCase()) {
              matchingFields.push('email');
              totalScore += 1;
              fieldCount++;
            }

            // Title similarity
            const titleScore = similarity(e1.title, e2.title);
            if (titleScore > 0.8) {
              matchingFields.push('title');
              totalScore += titleScore;
              fieldCount++;
            }

            // Contact name similarity
            const contactScore = similarity(e1.contact_name, e2.contact_name);
            if (contactScore > 0.8) {
              matchingFields.push('contact_name');
              totalScore += contactScore;
              fieldCount++;
            }
          }

          if (fieldCount > 0) {
            const avgScore = totalScore / fieldCount;
            if (avgScore > 0.6) {
              duplicateCandidates.push({
                entity_1_id: e1.id,
                entity_2_id: e2.id,
                entity_1_name: e1.name || e1.title,
                entity_2_name: e2.name || e2.title,
                similarity_score: avgScore,
                matching_fields: matchingFields,
              });
            }
          }
        }
      }

      // Save candidates to database
      for (const candidate of duplicateCandidates) {
        await supabaseClient.from('dedupe_candidates').upsert({
          user_id: user.id,
          entity_type,
          entity_1_id: candidate.entity_1_id,
          entity_2_id: candidate.entity_2_id,
          similarity_score: candidate.similarity_score,
          matching_fields: candidate.matching_fields,
          status: 'pending',
        }, {
          onConflict: 'entity_1_id,entity_2_id',
        });
      }

      return new Response(JSON.stringify({
        duplicates: duplicateCandidates.sort((a, b) => b.similarity_score - a.similarity_score),
        total_found: duplicateCandidates.length,
        entities_scanned: entities.length,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'enrich') {
      // Intelligent enrichment using AI
      if (!entity_id) {
        return new Response(JSON.stringify({ error: 'entity_id required for enrichment' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let entity: any = null;
      
      if (entity_type === 'company') {
        const { data } = await supabaseClient
          .from('enriched_companies')
          .select('*')
          .eq('id', entity_id)
          .eq('user_id', user.id)
          .single();
        entity = data;
      } else if (entity_type === 'deal') {
        const { data } = await supabaseClient
          .from('sales_deals')
          .select('*')
          .eq('id', entity_id)
          .eq('user_id', user.id)
          .single();
        entity = data;
      }

      if (!entity) {
        return new Response(JSON.stringify({ error: 'Entity not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Use AI to suggest enrichments
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      
      const enrichPrompt = `Analyze this ${entity_type} and suggest missing information to enrich:

Current data:
${JSON.stringify(entity, null, 2)}

Identify what information is missing and could be inferred or needs to be researched.
Suggest values based on context when possible.

Respond with JSON:
{
  "missing_fields": ["field1", "field2"],
  "suggested_values": {
    "field_name": {"value": "suggested value", "confidence": 0.8, "source": "inferred|research_needed"}
  },
  "enrichment_quality": number (0-100 current data completeness),
  "recommendations": ["string"]
}`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are a data enrichment specialist. Respond with valid JSON only.' },
            { role: 'user', content: enrichPrompt }
          ],
        }),
      });

      let enrichmentResult = {
        missing_fields: [],
        suggested_values: {},
        enrichment_quality: 50,
        recommendations: [],
      };

      if (aiResponse.ok) {
        try {
          const aiData = await aiResponse.json();
          const content = aiData.choices?.[0]?.message?.content || '';
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            enrichmentResult = JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          console.error('Error parsing AI response:', e);
        }
      }

      return new Response(JSON.stringify({
        entity_id,
        entity_type,
        current_data: entity,
        enrichment: enrichmentResult,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'merge') {
      // Merge two duplicate entities
      const { entity_1_id, entity_2_id, keep_id } = await req.json();
      
      if (!entity_1_id || !entity_2_id || !keep_id) {
        return new Response(JSON.stringify({ error: 'entity_1_id, entity_2_id, and keep_id required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const deleteId = keep_id === entity_1_id ? entity_2_id : entity_1_id;
      const tableName = entity_type === 'company' ? 'enriched_companies' : 'sales_deals';

      // Delete the duplicate
      const { error: deleteError } = await supabaseClient
        .from(tableName)
        .delete()
        .eq('id', deleteId)
        .eq('user_id', user.id);

      if (deleteError) {
        return new Response(JSON.stringify({ error: 'Failed to merge entities' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update dedupe candidate status
      await supabaseClient
        .from('dedupe_candidates')
        .update({ status: 'merged', merged_at: new Date().toISOString() })
        .eq('entity_1_id', entity_1_id)
        .eq('entity_2_id', entity_2_id);

      return new Response(JSON.stringify({
        success: true,
        kept_id: keep_id,
        deleted_id: deleteId,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Dedupe/Enrich error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});