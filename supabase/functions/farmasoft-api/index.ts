import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);
    const userId = claimsData.claims.sub;

    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/farmasoft-api/, "").replace(/\/$/, "") || "/";
    const method = req.method;

    // Parse body for POST/PUT
    let body: Record<string, unknown> = {};
    if (method === "POST" || method === "PUT") {
      try { body = await req.json(); } catch { /* empty body */ }
    }

    // ─── JOBS ───
    if (path === "/jobs" && method === "GET") {
      const { data, error } = await supabase
        .from("farmasoft_jobs")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", 1)
        .order("created_at", { ascending: false });
      if (error) return json({ error: error.message });
      return json({ data });
    }

    if (path === "/jobs" && method === "POST") {
      const { title, location, salary_min, salary_max, salary_currency, experience_years, skills, description, requirements } = body;
      if (!title) return json({ error: "Le titre est requis" });
      const { data, error } = await supabase
        .from("farmasoft_jobs")
        .insert({
          title, location: location || null,
          salary_min: salary_min || 0, salary_max: salary_max || 0,
          salary_currency: salary_currency || "UAH",
          experience_years: experience_years || 0,
          skills: typeof skills === "object" ? JSON.stringify(skills) : (skills || "[]"),
          description: description || "", requirements: requirements || "",
          user_id: userId,
        })
        .select()
        .single();
      if (error) return json({ error: error.message });
      return json({ data });
    }

    const jobMatch = path.match(/^\/jobs\/(\d+)$/);
    if (jobMatch && method === "PUT") {
      const id = parseInt(jobMatch[1]);
      const { title, location, salary_min, salary_max, salary_currency, experience_years, skills, description, requirements } = body;
      const { data, error } = await supabase
        .from("farmasoft_jobs")
        .update({
          title, location: location || null,
          salary_min: salary_min || 0, salary_max: salary_max || 0,
          salary_currency: salary_currency || "UAH",
          experience_years: experience_years || 0,
          skills: typeof skills === "object" ? JSON.stringify(skills) : (skills || "[]"),
          description: description || "", requirements: requirements || "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) return json({ error: error.message });
      return json({ data });
    }

    if (jobMatch && method === "DELETE") {
      const id = parseInt(jobMatch[1]);
      const { error } = await supabase
        .from("farmasoft_jobs")
        .update({ is_active: 0, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", userId);
      if (error) return json({ error: error.message });
      return json({ data: { success: true } });
    }

    // ─── CANDIDATES ───
    if (path === "/candidates" && method === "GET") {
      const jobId = url.searchParams.get("jobId");
      let query = supabase.from("farmasoft_candidates").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (jobId) query = query.eq("job_id", parseInt(jobId));
      const { data, error } = await query;
      if (error) return json({ error: error.message });
      return json({ data });
    }

    const candStatusMatch = path.match(/^\/candidates\/(\d+)\/status$/);
    if (candStatusMatch && method === "PUT") {
      const id = parseInt(candStatusMatch[1]);
      const { status } = body;
      const updates: Record<string, unknown> = { status };
      if (status === "viewed") updates.viewed_at = new Date().toISOString();
      if (status === "contacted") updates.contacted_at = new Date().toISOString();
      const { data, error } = await supabase
        .from("farmasoft_candidates")
        .update(updates)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) return json({ error: error.message });
      return json({ data });
    }

    const candStageMatch = path.match(/^\/candidates\/(\d+)\/stage$/);
    if (candStageMatch && method === "PUT") {
      const id = parseInt(candStageMatch[1]);
      const { stage } = body;
      const { data, error } = await supabase
        .from("farmasoft_candidates")
        .update({ stage })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) return json({ error: error.message });
      return json({ data });
    }

    const candQualifyMatch = path.match(/^\/candidates\/(\d+)\/qualify$/);
    if (candQualifyMatch && method === "POST") {
      const id = parseInt(candQualifyMatch[1]);
      const { data: candidate } = await supabase
        .from("farmasoft_candidates")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .single();
      if (!candidate) return json({ error: "Candidat introuvable" });

      let job = null;
      if (candidate.job_id) {
        const { data: j } = await supabase
          .from("farmasoft_jobs")
          .select("*")
          .eq("id", candidate.job_id)
          .single();
        job = j;
      }

      const profile = (() => { try { return candidate.profile_data ? JSON.parse(candidate.profile_data) : null; } catch { return null; } })();
      const expLine = [candidate.experience_years ? `${candidate.experience_years} ans` : null, candidate.experience_text].filter(Boolean).join(" — ") || "Non précisée";

      const candidateLines = [
        `- Titre du profil : ${candidate.role || "Non précisé"}`,
        `- Expérience : ${expLine}`,
        `- Localisation : ${candidate.location || "Non précisée"}`,
        `- Plateforme source : ${candidate.source_platform || "inconnue"}`,
        profile?.skills?.length ? `- Compétences : ${profile.skills.join(", ")}` : null,
        profile?.education ? `- Formation : ${profile.education}` : null,
        profile?.languages?.length ? `- Langues : ${profile.languages.join(", ")}` : null,
        candidate.cv_text ? `- Extrait CV : ${String(candidate.cv_text).substring(0, 2000)}` : null,
      ].filter(Boolean).join("\n");

      const prompt = `Tu es un expert RH chez Farmasoft UA. Évalue ce candidat par rapport au poste et donne un score de 0 à 100.
RÈGLE CRITIQUE : tu DOIS toujours répondre avec le JSON demandé, même si les informations sont limitées.

POSTE RECHERCHÉ : ${job?.title ?? "Non spécifié"}
Compétences requises : ${job?.skills ?? "Non spécifiées"}
Expérience requise : ${job?.experience_years ?? 0} ans minimum
Description : ${job?.description ?? ""}
Exigences : ${job?.requirements ?? ""}

CANDIDAT :
${candidateLines}

Réponds UNIQUEMENT en JSON valide sans markdown :
{"score": <entier 0-100>, "notes": "<2-3 points clés concis>"}`;

      const aiResult = await callAI(prompt);
      const cleaned = aiResult.replace(/```json|```/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return json({ error: "Réponse IA invalide. Réessayez." });
      const parsed = JSON.parse(jsonMatch[0]) as { score: number; notes: string };

      const { data: updated, error } = await supabase
        .from("farmasoft_candidates")
        .update({ qualification_score: parsed.score, qualification_notes: parsed.notes, stage: "prequalification" })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) return json({ error: error.message });
      return json({ data: updated });
    }

    const candDeleteMatch = path.match(/^\/candidates\/(\d+)$/);
    if (candDeleteMatch && method === "DELETE") {
      const id = parseInt(candDeleteMatch[1]);
      const { error } = await supabase
        .from("farmasoft_candidates")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) return json({ error: error.message });
      return json({ success: true });
    }

    // ─── INTERVIEWS ───
    if (path === "/interviews" && method === "GET") {
      const jobId = url.searchParams.get("jobId");
      let q = supabase.from("farmasoft_interviews").select(`
        *, 
        farmasoft_candidates(initials, role, source_platform),
        farmasoft_jobs(title)
      `).eq("user_id", userId).order("scheduled_at", { ascending: true });
      if (jobId) q = q.eq("job_id", parseInt(jobId));
      const { data, error } = await q;
      if (error) return json({ error: error.message });
      // Flatten joined fields
      const flat = (data || []).map((i: Record<string, unknown>) => {
        const c = i.farmasoft_candidates as Record<string, unknown> | null;
        const j = i.farmasoft_jobs as Record<string, unknown> | null;
        return {
          ...i,
          initials: c?.initials || "",
          role: c?.role || "",
          source_platform: c?.source_platform || "",
          job_title: j?.title || "",
          farmasoft_candidates: undefined,
          farmasoft_jobs: undefined,
        };
      });
      return json({ data: flat });
    }

    if (path === "/interviews" && method === "POST") {
      const { candidate_id, job_id, scheduled_at, type, interviewer, notes } = body;
      const { data, error } = await supabase
        .from("farmasoft_interviews")
        .insert({ candidate_id, job_id, scheduled_at, type: type || "phone", interviewer: interviewer || "", notes: notes || "", user_id: userId })
        .select()
        .single();
      if (error) return json({ error: error.message });
      return json({ data });
    }

    const ivMatch = path.match(/^\/interviews\/(\d+)$/);
    if (ivMatch && method === "PUT") {
      const id = parseInt(ivMatch[1]);
      const { data, error } = await supabase
        .from("farmasoft_interviews")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) return json({ error: error.message });
      return json({ data });
    }
    if (ivMatch && method === "DELETE") {
      const id = parseInt(ivMatch[1]);
      const { error } = await supabase
        .from("farmasoft_interviews")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) return json({ error: error.message });
      return json({ data: { success: true } });
    }

    // ─── CV PARSE ───
    if (path === "/cv/parse" && method === "POST") {
      const { filename, content, mimeType, jobId } = body as { filename: string; content: string; mimeType: string; jobId?: number };
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) return json({ error: "AI service not configured" });

      const dataUrl = `data:${mimeType || "application/pdf"};base64,${content}`;
      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{
            role: "user",
            content: [
              { type: "text", text: `Analyse ce CV et extrais les informations. Réponds UNIQUEMENT en JSON valide sans markdown :
{"initials":"XX","role":"titre du poste","location":"ville","experience_years":N,"experience_text":"résumé expérience","salary_expectation":0,"tags":["compétence1","compétence2"],"profile_data":{"skills":["s1","s2"],"education":"formation","languages":["langue1"],"summary":"résumé"}}` },
              { type: "image_url", image_url: { url: dataUrl } }
            ]
          }],
        }),
      });

      if (!aiResp.ok) {
        if (aiResp.status === 429) return json({ error: "Rate limits exceeded, please try again later." }, 429);
        if (aiResp.status === 402) return json({ error: "Payment required." }, 402);
        return json({ error: "AI service error" });
      }

      const aiData = await aiResp.json();
      const text = aiData.choices?.[0]?.message?.content || "";
      const cleaned = text.replace(/```json|```/g, "").trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) return json({ error: "Could not parse CV" });
      const parsed = JSON.parse(match[0]);

      const { data: candidate, error } = await supabase
        .from("farmasoft_candidates")
        .insert({
          job_id: jobId || null,
          initials: parsed.initials || "??",
          role: parsed.role || "Candidat",
          location: parsed.location || "",
          experience_years: parsed.experience_years || 0,
          experience_text: parsed.experience_text || "",
          salary_expectation: parsed.salary_expectation || 0,
          tags: JSON.stringify(parsed.tags || []),
          profile_data: JSON.stringify(parsed.profile_data || null),
          source_type: "upload",
          cv_filename: filename,
          cv_text: text.substring(0, 5000),
          user_id: userId,
        })
        .select()
        .single();
      if (error) return json({ error: error.message });
      return json({ data: candidate });
    }

    // ─── AI GENERATE JOB ───
    if (path === "/ai/generate-job" && method === "POST") {
      const { title } = body;
      if (!title) return json({ error: "Le titre est requis" });
      const prompt = `Tu travailles pour Farmasoft UA, entreprise ukrainienne.
Génère une fiche de poste complète pour : "${title}"
IMPORTANT : Tout le contenu doit être en ukrainien.
Réponds UNIQUEMENT en JSON valide sans markdown :
{"title":"назва","location":"місто","salary_min":N,"salary_max":N,"experience_years":N,"skills":["навичка1","навичка2"],"description":"опис","requirements":"вимоги"}`;
      const text = await callAI(prompt);
      const cleaned = text.replace(/```json|```/g, "").trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) return json({ error: "Réponse IA invalide. Réessayez." });
      return json({ data: JSON.parse(match[0]) });
    }

    // ─── AI GENERATE MESSAGE ───
    if (path === "/ai/generate-message" && method === "POST") {
      const { job, candidate, language = "uk" } = body as { job: Record<string, unknown>; candidate: Record<string, unknown>; language: string };
      const langInstr = language === "uk"
        ? 'Write the message ONLY in Ukrainian. Start with "Вітаю!".'
        : "Write the message in English.";
      const prompt = `You work for Farmasoft UA. ${langInstr}
Write a short professional outreach message.
Candidate: ${candidate?.role}, ${candidate?.experience_years || 0} years exp, ${candidate?.location}.
Position: ${job?.title}, ${job?.location}, ${job?.salary_min}–${job?.salary_max} UAH/month.
Keep under 8 lines. Sign as "Команда Farmasoft UA". Reply with ONLY the message text.`;
      const text = await callAI(prompt);
      return json({ data: text.trim() });
    }

    // ─── SCRAPER ───
    if (path === "/scraper/search" && method === "POST") {
      return json({ error: "Le scraping n'est pas disponible en mode cloud. Utilisez l'import CV à la place." });
    }

    // ─── ANALYTICS ───
    if (path === "/analytics/kpis" && method === "GET") {
      const { data: jobs } = await supabase.from("farmasoft_jobs").select("id, title").eq("user_id", userId).eq("is_active", 1);
      const { count: activeJobs } = await supabase.from("farmasoft_jobs").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("is_active", 1);

      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const today = new Date().toISOString().split("T")[0];

      const { count: totalSearches } = await supabase.from("farmasoft_events").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("type", "search_launched");
      const { count: weekSearches } = await supabase.from("farmasoft_events").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("type", "search_launched").gte("created_at", weekAgo);
      const { count: totalViewed } = await supabase.from("farmasoft_events").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("type", "profile_viewed");
      const { count: todayViewed } = await supabase.from("farmasoft_events").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("type", "profile_viewed").gte("created_at", today);
      const { count: totalContacted } = await supabase.from("farmasoft_events").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("type", "message_copied");

      const contactRate = (totalViewed || 0) > 0 ? Math.round(((totalContacted || 0) / (totalViewed || 1)) * 100) : 0;

      // Candidates per job
      const byJob: { title: string; count: number }[] = [];
      for (const j of (jobs || [])) {
        const { count } = await supabase.from("farmasoft_candidates").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("job_id", j.id);
        byJob.push({ title: j.title, count: count || 0 });
      }

      return json({
        data: {
          totalSearches: totalSearches || 0, weekSearches: weekSearches || 0,
          totalViewed: totalViewed || 0, todayViewed: todayViewed || 0,
          totalContacted: totalContacted || 0, contactRate,
          activeJobs: activeJobs || 0, byJob,
        },
      });
    }

    if (path === "/analytics/weekly" && method === "GET") {
      const eightWeeksAgo = new Date(Date.now() - 56 * 86400000).toISOString();
      const { data: events } = await supabase
        .from("farmasoft_events")
        .select("created_at")
        .eq("user_id", userId)
        .eq("type", "profile_viewed")
        .gte("created_at", eightWeeksAgo);

      // Group by week
      const weeks: Record<string, { count: number; start: string }> = {};
      for (const e of (events || [])) {
        const d = new Date(e.created_at);
        const weekNum = getWeekNumber(d);
        const key = `${weekNum}-${d.getFullYear()}`;
        if (!weeks[key]) weeks[key] = { count: 0, start: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) };
        weeks[key].count++;
      }
      const data = Object.entries(weeks).map(([week, v]) => ({ week, week_start: v.start, count: v.count }));
      return json({ data });
    }

    if (path === "/analytics/recent" && method === "GET") {
      const { data: events } = await supabase
        .from("farmasoft_events")
        .select("*")
        .eq("user_id", userId)
        .in("type", ["profile_viewed", "message_copied", "search_launched"])
        .order("created_at", { ascending: false })
        .limit(15);
      return json({ data: events || [] });
    }

    if (path === "/analytics/log" && method === "POST") {
      const { type, metadata } = body;
      const meta = (metadata as Record<string, unknown>) || {};
      const { error } = await supabase.from("farmasoft_events").insert({
        type, job_id: meta.jobId || null, candidate_id: meta.candidateId || null,
        metadata: JSON.stringify(metadata || {}), user_id: userId,
      });
      if (error) return json({ error: error.message });
      return json({ data: { success: true } });
    }

    // ─── SETTINGS ───
    const settingsMatch = path.match(/^\/settings\/(.+)$/);
    if (settingsMatch && method === "GET") {
      const key = settingsMatch[1];
      const { data } = await supabase.from("farmasoft_settings").select("value").eq("key", key).eq("user_id", userId).single();
      return json({ data: data?.value || "" });
    }
    if (settingsMatch && method === "PUT") {
      const key = settingsMatch[1];
      const { value } = body;
      const { error } = await supabase.from("farmasoft_settings").upsert({ key, value, user_id: userId }, { onConflict: "key" });
      if (error) return json({ error: error.message });
      return json({ data: { success: true } });
    }

    return json({ error: `Route not found: ${method} ${path}` }, 404);

  } catch (err) {
    console.error("farmasoft-api error:", err);
    return json({ error: err instanceof Error ? err.message : "Unknown error" }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getWeekNumber(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}

async function callAI(prompt: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("AI service not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    if (response.status === 429) throw new Error("Rate limits exceeded, please try again later.");
    if (response.status === 402) throw new Error("Payment required.");
    throw new Error(`AI gateway error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}
