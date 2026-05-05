import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BROWSER_HEADERS: Record<string, string> = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "uk-UA,uk;q=0.9,en;q=0.8",
  "Connection": "keep-alive",
};

const CITY_MAP_WORK: Record<string, string> = {
  Kyiv: "1", Kharkiv: "2", Lviv: "3", Odesa: "4",
  Dnipro: "7", Zaporizhzhia: "8", Vinnytsia: "10",
  Poltava: "16", Cherkasy: "18", Zhytomyr: "24",
};

const GOOGLE_API_KEY = "AIzaSyDspjTotGPjixzYBsHkvhylzOgecDuTDlk";
const GOOGLE_CSE_ID = "977f1bf44ff6542f5";
const GOOGLE_CSE_URL = "https://www.googleapis.com/customsearch/v1";

interface ScrapedCandidate {
  role: string;
  salary_text: string;
  salary_expectation: number;
  location_text: string;
  experience_text: string;
  experience_years: number;
  profile_url: string;
  source_platform: string;
  initials: string;
  tags: string[];
  profile_data?: { education?: string; skills?: string[]; employment?: string } | null;
  age?: number;
  education?: string;
}

function generateInitials(): string {
  const a = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const b = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${a}.${b}.`;
}

function extractRoleFromTitle(title: string): string {
  return title.replace(/,?\s*резюме від .*/i, "").trim();
}

async function enrichWorkUaProfile(candidate: ScrapedCandidate): Promise<ScrapedCandidate> {
  try {
    const resp = await fetch(candidate.profile_url, { headers: BROWSER_HEADERS });
    if (!resp.ok) return candidate;
    const html = await resp.text();
    const $ = cheerio.load(html);

    const fields: Record<string, string> = {};
    $("dl dt").each((_: number, dt: cheerio.Element) => {
      const key = $(dt).text().replace(/\u00a0/g, " ").trim();
      const val = $(dt).next("dd").text().replace(/\u00a0/g, " ").trim();
      if (key && val) fields[key] = val;
    });

    const city = fields["Місто:"] || candidate.location_text;
    const employment = fields["Вид зайнятості:"] || "";
    const age = fields["Вік:"] ? parseInt(fields["Вік:"]) : undefined;

    const allH2s = $("h2").toArray();
    const sectionIdx = (re: RegExp) => allH2s.findIndex((h: cheerio.Element) => re.test($(h).text().trim()));
    const expStart = sectionIdx(/досвід роботи/i);
    const skillsIdx = sectionIdx(/навичк/i);
    const eduIdx = sectionIdx(/^Освіта$/i);
    const addIdx = sectionIdx(/додаткова/i);

    let totalMonths = candidate.experience_years > 0 ? candidate.experience_years * 12 : 0;
    if (totalMonths === 0 && expStart > -1) {
      const endCandidates = [skillsIdx, eduIdx, addIdx].filter((i) => i > expStart && i > -1);
      const expEnd = endCandidates.length ? Math.min(...endCandidates) : allH2s.length;
      for (let i = expStart + 1; i < expEnd; i++) {
        const pText = $(allH2s[i]).next("p").text().replace(/\u00a0/g, " ");
        const dur = pText.match(/\((\d+)\s*(?:рік|роки|років)(?:[^\d]*(\d+)\s*місяц[ьів]+)?\)/);
        if (dur) totalMonths += parseInt(dur[1]) * 12 + (dur[2] ? parseInt(dur[2]) : 0);
      }
    }
    const experienceYears = totalMonths > 0 ? Math.round(totalMonths / 12) : candidate.experience_years;

    let skills: string[] = [];
    if (skillsIdx > -1) {
      let el = $(allH2s[skillsIdx]).next();
      while (el.length) {
        if (el.prop("tagName") === "H2") break;
        const spans = el.find("span").map((_: number, s: cheerio.Element) => $(s).text().replace(/\u00a0/g, " ").trim()).get()
          .filter((t: string) => t.length > 2 && t.length < 60);
        if (spans.length) {
          skills = skills.concat(spans);
        } else {
          const raw = el.text().replace(/\u00a0/g, " ").trim();
          if (raw) skills = skills.concat(raw.split(/[,\n]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 2 && s.length < 50));
        }
        el = el.next();
      }
      skills = [...new Set(skills)].slice(0, 8);
    }

    let education = "";
    if (eduIdx > -1) {
      const eduH2El = $(allH2s[eduIdx]);
      const eduParent = eduH2El.parent();
      const parts: string[] = [];
      let sibling = eduH2El.next();
      while (sibling.length) {
        const tag = sibling.prop("tagName");
        if (tag === "H2") {
          const sibText = sibling.text().replace(/\u00a0/g, " ").trim();
          if (/Схожі|Інші|Кандидат|Додаткова|Знання|Контакт/i.test(sibText)) break;
          if (sibling.parent().attr("class") !== eduParent.attr("class")) break;
          const pText = sibling.next("p").text().replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
          const levelMatch = pText.match(/Вища|Середня спец[іа]+льна|Середня|Бакалавр|Магістр|PhD/i);
          if (sibText) parts.push(levelMatch ? levelMatch[0] + " – " + sibText : sibText);
        }
        sibling = sibling.next();
      }
      education = parts.join(", ");
    }

    const tags = skills.length > 0 ? skills : candidate.tags;

    return {
      ...candidate,
      location_text: city,
      experience_text: employment ? employment.slice(0, 300) : candidate.experience_text,
      experience_years: experienceYears,
      education: education || undefined,
      age,
      tags,
      profile_data: {
        employment: employment || undefined,
        skills: skills.length > 0 ? skills : undefined,
        education: education || undefined,
      },
    };
  } catch {
    return candidate;
  }
}

async function scrapeWorkUa(queryUk: string, location: string, count: number): Promise<ScrapedCandidate[]> {
  const cityId = CITY_MAP_WORK[location] || "1";
  const seen = new Set<string>();
  const results: ScrapedCandidate[] = [];
  let page = 1;

  while (results.length < count) {
    const url = `https://www.work.ua/resumes/?search=${encodeURIComponent(queryUk)}&city=${cityId}&page=${page}`;
    console.log(`[work.ua] GET ${url}`);

    try {
      const resp = await fetch(url, { headers: BROWSER_HEADERS });
      if (!resp.ok) break;
      const html = await resp.text();
      const $ = cheerio.load(html);
      let addedThisPage = 0;

      $(".resume-link").each((_: number, card: cheerio.Element) => {
        if (results.length >= count) return false;
        const link = $(card).find("h2 a").first();
        const href = link.attr("href") || "";
        if (!/\/resumes\/\d+\/?$/.test(href)) return;
        const title = link.text().trim();
        if (!title) return;
        const profileUrl = `https://www.work.ua${href.replace(/\/$/, "")}/`;
        if (seen.has(profileUrl)) return;
        seen.add(profileUrl);
        const role = extractRoleFromTitle(title);

        let totalMonths = 0;
        const expItems: string[] = [];
        $(card).find("ul li").each((_: number, li: cheerio.Element) => {
          const liText = $(li).text().replace(/\u00a0/g, " ").trim();
          const durMatch = liText.match(/(\d+)\s*(?:рік|роки|років)(?:[^\d]*(\d+)\s*місяц[ьів]+)?/);
          if (durMatch) {
            totalMonths += parseInt(durMatch[1]) * 12 + (durMatch[2] ? parseInt(durMatch[2]) : 0);
            expItems.push(liText.slice(0, 60));
          }
        });

        results.push({
          role,
          salary_text: "",
          salary_expectation: 0,
          location_text: location,
          experience_text: expItems.join(" | ").slice(0, 300),
          experience_years: Math.round(totalMonths / 12),
          profile_url: profileUrl,
          source_platform: "work.ua",
          initials: generateInitials(),
          tags: [],
        });
        addedThisPage++;
      });

      const hasNextPage = $(`a[href*="page=${page + 1}"]`).length > 0;
      if (addedThisPage === 0 || !hasNextPage) break;
      page++;
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error("[work.ua] HTTP error:", (err as Error).message);
      break;
    }
  }

  console.log(`[work.ua] Found ${results.length} profiles across ${page} page(s), enriching...`);
  const enriched: ScrapedCandidate[] = [];
  for (const c of results) {
    const rich = await enrichWorkUaProfile(c);
    enriched.push(rich);
    await new Promise((r) => setTimeout(r, 300));
  }
  console.log(`[work.ua] Enrichment done`);
  return enriched;
}

async function searchViaGoogle(queryUk: string, location: string, count: number, siteFilter: string, platform: string): Promise<ScrapedCandidate[]> {
  try {
    const params = new URLSearchParams({
      key: GOOGLE_API_KEY,
      cx: GOOGLE_CSE_ID,
      q: `${queryUk} ${location}`,
      siteSearch: siteFilter,
      siteSearchFilter: "i",
      num: String(Math.min(count, 10)),
      hl: "uk",
    });
    const resp = await fetch(`${GOOGLE_CSE_URL}?${params}`);
    if (!resp.ok) {
      if (resp.status === 403) console.log(`[${platform}] Google CSE billing not active yet — skipped`);
      return [];
    }
    const data = await resp.json();
    if (!data.items) return [];

    const profilePattern: Record<string, RegExp> = {
      "work.ua": /work\.ua\/resumes\/\d+/,
      "robota.ua": /robota\.ua\/candidates\/\d+/,
      "hh.ua": /hh\.ua\/resume\/[a-zA-Z0-9_-]+/,
    };

    const results: ScrapedCandidate[] = [];
    for (const item of data.items as { link: string; title: string; snippet?: string }[]) {
      if (!profilePattern[platform]?.test(item.link)) continue;
      const role = item.title.replace(/\s*[–\-|]\s*(Work\.ua|robota\.ua|hh\.ua).*/i, "").replace(/^(Резюме|CV)[:\s]*/i, "").trim();
      results.push({
        role,
        salary_text: "",
        salary_expectation: 0,
        location_text: location,
        experience_text: (item.snippet || "").replace(/\n/g, " ").trim(),
        experience_years: 0,
        profile_url: item.link,
        source_platform: platform,
        initials: generateInitials(),
        tags: [],
      });
    }
    console.log(`[${platform}] Google CSE found ${results.length} profiles`);
    return results;
  } catch (err) {
    console.error(`[${platform}] Google CSE error:`, (err as Error).message);
    return [];
  }
}

async function translateToUkrainian(query: string): Promise<string> {
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return query;
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "user", content: `Translate to Ukrainian (1-4 words, nominative case, no explanation): "${query}". Reply ONLY with Ukrainian. Examples: "driver"→"водій", "truck driver"→"водій вантажного автомобіля", "pharmacist"→"фармацевт"` }],
      }),
    });
    if (!resp.ok) return query;
    const data = await resp.json();
    return data.choices?.[0]?.message?.content?.trim() || query;
  } catch {
    return query;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    const ANON_UUID = "00000000-0000-0000-0000-000000000000";
    let userId = ANON_UUID;
    let supabase;

    if (authHeader?.startsWith("Bearer ") && authHeader.length > 20) {
      supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data: claimsData } = await supabase.auth.getUser(token);
        if (claimsData?.user?.id) userId = claimsData.user.id;
      } catch { /* use anonymous */ }
    }

    if (!supabase || userId === ANON_UUID) {
      supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      userId = ANON_UUID;
    }

    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/farmasoft-api/, "").replace(/\/$/, "") || "/";
    const method = req.method;

    let body: Record<string, unknown> = {};
    if (method === "POST" || method === "PUT") {
      try { body = await req.json(); } catch { /* empty body */ }
    }

    // ─── JOBS ───
    if (path === "/jobs" && method === "GET") {
      const { data, error } = await supabase.from("farmasoft_jobs").select("*").eq("user_id", userId).eq("is_active", 1).order("created_at", { ascending: false });
      if (error) return json({ error: error.message });
      return json({ data });
    }

    if (path === "/jobs/with-counts" && method === "GET") {
      const { data: jobs, error } = await supabase.from("farmasoft_jobs").select("*").eq("user_id", userId).eq("is_active", 1).order("created_at", { ascending: false });
      if (error) return json({ error: error.message });
      const withCounts = [];
      for (const job of jobs || []) {
        const { count } = await supabase.from("farmasoft_candidates").select("*", { count: "exact", head: true }).eq("job_id", job.id).eq("user_id", userId);
        withCounts.push({ ...job, candidate_count: count || 0 });
      }
      return json({ data: withCounts });
    }

    if (path === "/jobs" && method === "POST") {
      const { title, location, salary_min, salary_max, salary_currency, experience_years, skills, description, requirements } = body;
      if (!title) return json({ error: "Le titre est requis" });
      const { data, error } = await supabase.from("farmasoft_jobs").insert({
        title, location: location || null,
        salary_min: salary_min || 0, salary_max: salary_max || 0,
        salary_currency: salary_currency || "UAH",
        experience_years: experience_years || 0,
        skills: typeof skills === "object" ? JSON.stringify(skills) : (skills || "[]"),
        description: description || "", requirements: requirements || "",
        user_id: userId,
      }).select().single();
      if (error) return json({ error: error.message });
      return json({ data });
    }

    const jobMatch = path.match(/^\/jobs\/(\d+)$/);
    if (jobMatch && method === "PUT") {
      const id = parseInt(jobMatch[1]);
      const { title, location, salary_min, salary_max, salary_currency, experience_years, skills, description, requirements } = body;
      const { data, error } = await supabase.from("farmasoft_jobs").update({
        title, location: location || null,
        salary_min: salary_min || 0, salary_max: salary_max || 0,
        salary_currency: salary_currency || "UAH",
        experience_years: experience_years || 0,
        skills: typeof skills === "object" ? JSON.stringify(skills) : (skills || "[]"),
        description: description || "", requirements: requirements || "",
        updated_at: new Date().toISOString(),
      }).eq("id", id).eq("user_id", userId).select().single();
      if (error) return json({ error: error.message });
      return json({ data });
    }

    if (jobMatch && method === "DELETE") {
      const id = parseInt(jobMatch[1]);
      const { error } = await supabase.from("farmasoft_jobs").update({ is_active: 0, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId);
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
      const { data, error } = await supabase.from("farmasoft_candidates").update(updates).eq("id", id).eq("user_id", userId).select().single();
      if (error) return json({ error: error.message });
      return json({ data });
    }

    const candStageMatch = path.match(/^\/candidates\/(\d+)\/stage$/);
    if (candStageMatch && method === "PUT") {
      const id = parseInt(candStageMatch[1]);
      const { stage } = body;
      const { data, error } = await supabase.from("farmasoft_candidates").update({ stage }).eq("id", id).eq("user_id", userId).select().single();
      if (error) return json({ error: error.message });
      return json({ data });
    }

    const candQualifyMatch = path.match(/^\/candidates\/(\d+)\/qualify$/);
    if (candQualifyMatch && method === "POST") {
      const id = parseInt(candQualifyMatch[1]);
      const { data: candidate } = await supabase.from("farmasoft_candidates").select("*").eq("id", id).eq("user_id", userId).single();
      if (!candidate) return json({ error: "Candidate not found" });

      let job = null;
      if (candidate.job_id) {
        const { data: j } = await supabase.from("farmasoft_jobs").select("*").eq("id", candidate.job_id).single();
        job = j;
      }

      const profile = (() => { try { return candidate.profile_data ? JSON.parse(candidate.profile_data) : null; } catch { return null; } })();
      const expLine = [candidate.experience_years ? `${candidate.experience_years} years` : null, candidate.experience_text].filter(Boolean).join(" — ") || "Not specified";

      const candidateLines = [
        `- Profile title: ${candidate.role || "Not specified"}`,
        `- Experience: ${expLine}`,
        `- Location: ${candidate.location || "Not specified"}`,
        `- Source platform: ${candidate.source_platform || "unknown"}`,
        profile?.skills?.length ? `- Skills: ${profile.skills.join(", ")}` : null,
        profile?.education ? `- Education: ${profile.education}` : null,
        profile?.languages?.length ? `- Languages: ${profile.languages.join(", ")}` : null,
        candidate.cv_text ? `- CV extract: ${String(candidate.cv_text).substring(0, 2000)}` : null,
      ].filter(Boolean).join("\n");

      const prompt = `You are an HR expert at Farmasoft UA. Evaluate this candidate against the position and give a score from 0 to 100.
CRITICAL RULE: you MUST always respond with the requested JSON, even if information is limited.

POSITION: ${job?.title ?? "Not specified"}
Required skills: ${job?.skills ?? "Not specified"}
Required experience: ${job?.experience_years ?? 0} years minimum
Description: ${job?.description ?? ""}
Requirements: ${job?.requirements ?? ""}

CANDIDATE:
${candidateLines}

Respond ONLY in valid JSON without markdown. Write the notes in Ukrainian (українською мовою):
{"score": <integer 0-100>, "notes": "<2-3 concise key points in Ukrainian>"}`;

      const aiResult = await callAI(prompt);
      const cleaned = aiResult.replace(/```json|```/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return json({ error: "Invalid AI response. Please retry." });
      const parsed = JSON.parse(jsonMatch[0]) as { score: number; notes: string };

      const { data: updated, error } = await supabase.from("farmasoft_candidates").update({ qualification_score: parsed.score, qualification_notes: parsed.notes, stage: "prequalification" }).eq("id", id).eq("user_id", userId).select().single();
      if (error) return json({ error: error.message });
      return json({ data: updated });
    }

    const candDeleteMatch = path.match(/^\/candidates\/(\d+)$/);
    if (candDeleteMatch && method === "DELETE") {
      const id = parseInt(candDeleteMatch[1]);
      const { error } = await supabase.from("farmasoft_candidates").delete().eq("id", id).eq("user_id", userId);
      if (error) return json({ error: error.message });
      return json({ success: true });
    }

    // ─── INTERVIEWS ───
    if (path === "/interviews" && method === "GET") {
      const jobId = url.searchParams.get("jobId");
      let q = supabase.from("farmasoft_interviews").select(`*, farmasoft_candidates(initials, role, source_platform), farmasoft_jobs(title)`).eq("user_id", userId).order("scheduled_at", { ascending: true });
      if (jobId) q = q.eq("job_id", parseInt(jobId));
      const { data, error } = await q;
      if (error) return json({ error: error.message });
      const flat = (data || []).map((i: Record<string, unknown>) => {
        const c = i.farmasoft_candidates as Record<string, unknown> | null;
        const j = i.farmasoft_jobs as Record<string, unknown> | null;
        return { ...i, initials: c?.initials || "", role: c?.role || "", source_platform: c?.source_platform || "", job_title: j?.title || "", farmasoft_candidates: undefined, farmasoft_jobs: undefined };
      });
      return json({ data: flat });
    }

    if (path === "/interviews" && method === "POST") {
      const { candidate_id, job_id, scheduled_at, type, interviewer, notes } = body;
      const { data, error } = await supabase.from("farmasoft_interviews").insert({ candidate_id, job_id, scheduled_at, type: type || "phone", interviewer: interviewer || "", notes: notes || "", user_id: userId }).select().single();
      if (error) return json({ error: error.message });
      return json({ data });
    }

    const ivMatch = path.match(/^\/interviews\/(\d+)$/);
    if (ivMatch && method === "PUT") {
      const id = parseInt(ivMatch[1]);
      const { data, error } = await supabase.from("farmasoft_interviews").update({ ...body, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId).select().single();
      if (error) return json({ error: error.message });
      return json({ data });
    }
    if (ivMatch && method === "DELETE") {
      const id = parseInt(ivMatch[1]);
      const { error } = await supabase.from("farmasoft_interviews").delete().eq("id", id).eq("user_id", userId);
      if (error) return json({ error: error.message });
      return json({ data: { success: true } });
    }

    // ─── MESSAGES ───
    if (path === "/messages" && method === "GET") {
      const { data, error } = await supabase.from("farmasoft_messages").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (error) return json({ error: error.message });
      return json({ data });
    }

    if (path === "/messages" && method === "POST") {
      const { name, subject, body: msgBody, language, job_id, ai_generated } = body;
      const { data, error } = await supabase.from("farmasoft_messages").insert({
        name: name || "", subject: subject || "", body: msgBody || "",
        language: language || "uk", job_id: job_id || null, ai_generated: ai_generated || 0, user_id: userId,
      }).select().single();
      if (error) return json({ error: error.message });
      return json({ data });
    }

    const msgMatch = path.match(/^\/messages\/(\d+)$/);
    if (msgMatch && method === "PUT") {
      const id = parseInt(msgMatch[1]);
      const { data, error } = await supabase.from("farmasoft_messages").update({ ...body, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId).select().single();
      if (error) return json({ error: error.message });
      return json({ data });
    }
    if (msgMatch && method === "DELETE") {
      const id = parseInt(msgMatch[1]);
      const { error } = await supabase.from("farmasoft_messages").delete().eq("id", id).eq("user_id", userId);
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
              { type: "image_url", image_url: { url: dataUrl } },
            ],
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

      const { data: candidate, error } = await supabase.from("farmasoft_candidates").insert({
        job_id: jobId || null, initials: parsed.initials || "??", role: parsed.role || "Candidat",
        location: parsed.location || "", experience_years: parsed.experience_years || 0,
        experience_text: parsed.experience_text || "", salary_expectation: parsed.salary_expectation || 0,
        tags: JSON.stringify(parsed.tags || []), profile_data: JSON.stringify(parsed.profile_data || null),
        source_type: "upload", cv_filename: filename, cv_text: text.substring(0, 5000), user_id: userId,
      }).select().single();
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
      const langInstr = language === "uk" ? 'Write the message ONLY in Ukrainian. Start with "Вітаю!".' : language === "fr" ? "Write the message in French." : "Write the message in English.";
      const candidateRole = candidate?.role || candidate || "candidat";
      const candidateExp = candidate?.experience_years || 0;
      const candidateLocation = candidate?.location || "";
      const prompt = `You work for Farmasoft UA. ${langInstr}
Write a short professional outreach message.
Candidate: ${candidateRole}, ${candidateExp} years exp, ${candidateLocation}.
Position: ${job?.title}, ${job?.location}, ${job?.salary_min}–${job?.salary_max} UAH/month.
Keep under 8 lines. Sign as "Команда Farmasoft UA". Reply with ONLY the message text.`;
      const text = await callAI(prompt);
      return json({ data: text.trim() });
    }

    // ─── SCRAPER ───
    if (path === "/scraper/search" && method === "POST") {
      const { query, location, count, platforms, jobId, salaryMin, salaryMax } = body as {
        query: string; location: string; count: number; platforms: string[];
        jobId?: number; salaryMin?: number; salaryMax?: number;
      };

      if (!query || !platforms || !Array.isArray(platforms)) {
        return json({ error: "query et platforms sont requis" });
      }

      const hasCyrillic = /[\u0400-\u04FF]/.test(query);
      const queryUk = hasCyrillic ? query : await translateToUkrainian(query);
      console.log(`[search] "${query}" → UA: "${queryUk}" (${hasCyrillic ? "already UA" : "translated"})`);

      const perPlatform = Math.ceil(count / Math.max(platforms.length, 1));
      let allResults: ScrapedCandidate[] = [];

      for (const platform of platforms) {
        let results: ScrapedCandidate[] = [];
        if (platform === "work.ua") {
          results = await scrapeWorkUa(queryUk, location, perPlatform);
        } else if (platform === "robota.ua") {
          results = await searchViaGoogle(queryUk, location, perPlatform, "robota.ua/candidates", "robota.ua");
        } else if (platform === "hh.ua") {
          results = await searchViaGoogle(queryUk, location, perPlatform, "hh.ua/resume", "hh.ua");
        }
        allResults = [...allResults, ...results];
        await new Promise((r) => setTimeout(r, 300));
      }

      if (salaryMin && salaryMin > 0) allResults = allResults.filter((c) => c.salary_expectation === 0 || c.salary_expectation >= salaryMin);
      if (salaryMax && salaryMax > 0) allResults = allResults.filter((c) => c.salary_expectation === 0 || c.salary_expectation <= salaryMax);

      const finalResults = allResults.slice(0, count);
      const insertedIds: number[] = [];

      if (jobId && finalResults.length > 0) {
        for (const c of finalResults) {
          const { data: ins } = await supabase.from("farmasoft_candidates").insert({
            job_id: jobId, initials: c.initials, role: c.role, location: c.location_text,
            salary_expectation: c.salary_expectation, experience_years: c.experience_years || 0,
            source_platform: c.source_platform, profile_url: c.profile_url,
            tags: JSON.stringify(c.tags), status: "new", experience_text: c.experience_text || null,
            profile_data: c.profile_data ? JSON.stringify(c.profile_data) : null, user_id: userId,
          }).select("id").single();
          if (ins) insertedIds.push(ins.id);
        }
      }

      await supabase.from("farmasoft_events").insert({
        type: "search_launched", job_id: jobId || null,
        metadata: JSON.stringify({ jobId, platforms, count: finalResults.length, searchTerm: queryUk }),
        user_id: userId,
      });

      const responseData = finalResults.map((c, i) => ({
        ...c, location: c.location_text, experience_years: c.experience_years || 0,
        id: insertedIds[i] ?? Date.now() + i, job_id: jobId || null, status: "new" as const,
        tags: JSON.stringify(c.tags), profile_data: c.profile_data ? JSON.stringify(c.profile_data) : null,
        source_type: "scraped" as const, stage: "new" as const, qualification_score: null,
        qualification_notes: null, cv_filename: null, cv_text: null, rejection_reason: null,
        decision: null, viewed_at: null, contacted_at: null, created_at: new Date().toISOString(),
      }));

      // Auto-qualify in background
      if (jobId && insertedIds.length > 0) {
        autoQualifyCandidates(insertedIds, jobId, userId, supabase).catch(() => {});
      }

      return json({ data: responseData });
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
      const byJob: { title: string; count: number }[] = [];
      for (const j of jobs || []) {
        const { count } = await supabase.from("farmasoft_candidates").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("job_id", j.id);
        byJob.push({ title: j.title, count: count || 0 });
      }
      return json({
        data: { totalSearches: totalSearches || 0, weekSearches: weekSearches || 0, totalViewed: totalViewed || 0, todayViewed: todayViewed || 0, totalContacted: totalContacted || 0, contactRate, activeJobs: activeJobs || 0, byJob },
      });
    }

    if (path === "/analytics/weekly" && method === "GET") {
      const eightWeeksAgo = new Date(Date.now() - 56 * 86400000).toISOString();
      const { data: events } = await supabase.from("farmasoft_events").select("created_at").eq("user_id", userId).eq("type", "profile_viewed").gte("created_at", eightWeeksAgo);
      const weeks: Record<string, { count: number; start: string }> = {};
      for (const e of events || []) {
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
      const { data: events } = await supabase.from("farmasoft_events").select("*").eq("user_id", userId).in("type", ["profile_viewed", "message_copied", "search_launched"]).order("created_at", { ascending: false }).limit(15);
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
      const { error } = await supabase.from("farmasoft_settings").upsert({ key, value, user_id: userId }, { onConflict: "key,user_id" });
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
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages: [{ role: "user", content: prompt }] }),
  });
  if (!response.ok) {
    if (response.status === 429) throw new Error("Rate limits exceeded, please try again later.");
    if (response.status === 402) throw new Error("Payment required.");
    throw new Error(`AI gateway error: ${response.status}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// deno-lint-ignore no-explicit-any
async function autoQualifyCandidates(candidateIds: number[], jobId: number, userId: string, supabase: any): Promise<void> {
  const { data: job } = await supabase.from("farmasoft_jobs").select("*").eq("id", jobId).single();
  if (!job) return;

  const BATCH = 5;
  for (let i = 0; i < candidateIds.length; i += BATCH) {
    await Promise.all(candidateIds.slice(i, i + BATCH).map(async (id: number) => {
      try {
        const { data: candidate } = await supabase.from("farmasoft_candidates").select("*").eq("id", id).single();
        if (!candidate) return;

        const profile = (() => { try { return candidate.profile_data ? JSON.parse(candidate.profile_data) : null; } catch { return null; } })();
        const expLine = [candidate.experience_years ? `${candidate.experience_years} years` : null, candidate.experience_text].filter(Boolean).join(" — ") || "Not specified";
        const candidateLines = [
          `- Profile title: ${candidate.role || "Not specified"}`,
          `- Experience: ${expLine}`,
          `- Location: ${candidate.location || "Not specified"}`,
          profile?.skills?.length ? `- Skills: ${profile.skills.join(", ")}` : null,
          profile?.education ? `- Education: ${profile.education}` : null,
        ].filter(Boolean).join("\n");

        const prompt = `You are an HR expert. Evaluate this candidate against the position (score 0-100).
POSITION: ${job.title} | Skills: ${job.skills} | Required exp: ${job.experience_years} years
CANDIDATE:
${candidateLines}
Respond ONLY in JSON. Write the notes in Ukrainian (українською мовою): {"score": <0-100>, "notes": "<2-3 key points in Ukrainian>"}`;

        const text = await callAI(prompt);
        const cleaned = text.replace(/```json|```/g, "").trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return;
        const parsed = JSON.parse(jsonMatch[0]) as { score: number; notes: string };
        if (typeof parsed.score !== "number") return;

        await supabase.from("farmasoft_candidates").update({
          qualification_score: parsed.score, qualification_notes: parsed.notes, stage: "prequalification",
        }).eq("id", id).eq("user_id", userId);

        console.log(`[qualify] Candidate ${id} scored ${parsed.score}/100`);
      } catch {
        console.error(`[qualify] Failed for candidate ${id}`);
      }
    }));
  }
}
