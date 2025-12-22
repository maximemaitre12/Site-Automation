import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailMessage {
  from_email: string;
  from_name: string;
  subject: string;
  body_text: string;
  body_html: string;
  email_date: string;
  attachments: Array<{
    filename: string;
    content_type: string;
    size: number;
    content?: string;
  }>;
}

interface CandidateAnalysis {
  is_candidature: boolean;
  confidence: number;
  candidate_name: string | null;
  candidate_email: string | null;
  candidate_phone: string | null;
  job_title_applied: string | null;
  skills_mentioned: string[];
  experience_years: number | null;
  motivation_summary: string | null;
  has_cv_attachment: boolean;
  cv_filename: string | null;
}

async function analyzeEmailWithAI(email: EmailMessage): Promise<CandidateAnalysis> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.log("No LOVABLE_API_KEY, using heuristic analysis");
    return heuristicAnalysis(email);
  }

  const systemPrompt = `Tu es un expert RH qui analyse les emails pour détecter les candidatures.
Analyse l'email fourni et détermine s'il s'agit d'une candidature spontanée ou en réponse à une offre d'emploi.

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "is_candidature": boolean,
  "confidence": number (0-100),
  "candidate_name": string ou null,
  "candidate_email": string ou null,
  "candidate_phone": string ou null,
  "job_title_applied": string ou null,
  "skills_mentioned": string[],
  "experience_years": number ou null,
  "motivation_summary": string court ou null,
  "has_cv_attachment": boolean,
  "cv_filename": string ou null
}`;

  const emailContent = `
De: ${email.from_name} <${email.from_email}>
Sujet: ${email.subject}
Date: ${email.email_date}

Contenu:
${email.body_text || ""}

Pièces jointes: ${email.attachments.map(a => a.filename).join(", ") || "Aucune"}
`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: emailContent }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error("AI API error:", response.status);
      return heuristicAnalysis(email);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        is_candidature: parsed.is_candidature ?? false,
        confidence: parsed.confidence ?? 0,
        candidate_name: parsed.candidate_name || email.from_name,
        candidate_email: parsed.candidate_email || email.from_email,
        candidate_phone: parsed.candidate_phone,
        job_title_applied: parsed.job_title_applied,
        skills_mentioned: parsed.skills_mentioned || [],
        experience_years: parsed.experience_years,
        motivation_summary: parsed.motivation_summary,
        has_cv_attachment: parsed.has_cv_attachment ?? false,
        cv_filename: parsed.cv_filename,
      };
    }
  } catch (error) {
    console.error("AI analysis error:", error);
  }

  return heuristicAnalysis(email);
}

function heuristicAnalysis(email: EmailMessage): CandidateAnalysis {
  const subjectLower = email.subject.toLowerCase();
  const bodyLower = (email.body_text || "").toLowerCase();
  const combined = subjectLower + " " + bodyLower;
  
  // Keywords indicating a job application
  const candidatureKeywords = [
    "candidature", "cv", "curriculum", "poste", "emploi", "offre",
    "postuler", "postule", "motivation", "lettre de motivation",
    "experience", "profil", "recrutement", "job", "apply", "application",
    "stage", "alternance", "cdi", "cdd", "contrat"
  ];
  
  const matchCount = candidatureKeywords.filter(kw => combined.includes(kw)).length;
  const hasCV = email.attachments.some(a => 
    a.filename.toLowerCase().includes("cv") || 
    a.filename.toLowerCase().includes("resume") ||
    a.content_type === "application/pdf" ||
    a.filename.endsWith(".pdf") ||
    a.filename.endsWith(".docx")
  );
  
  const cvAttachment = email.attachments.find(a => 
    a.filename.toLowerCase().includes("cv") || 
    a.content_type === "application/pdf"
  );

  const isCandidature = matchCount >= 2 || (matchCount >= 1 && hasCV);
  const confidence = Math.min(100, matchCount * 20 + (hasCV ? 30 : 0));

  // Try to extract phone from body
  const phoneMatch = (email.body_text || "").match(/(?:\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/);

  return {
    is_candidature: isCandidature,
    confidence,
    candidate_name: email.from_name || null,
    candidate_email: email.from_email,
    candidate_phone: phoneMatch ? phoneMatch[0].replace(/[\s.-]/g, "") : null,
    job_title_applied: null,
    skills_mentioned: [],
    experience_years: null,
    motivation_summary: null,
    has_cv_attachment: hasCV,
    cv_filename: cvAttachment?.filename || null,
  };
}

// Simulated IMAP fetch (in production, use a proper IMAP library or email API)
async function fetchEmailsFromProvider(
  provider: string,
  email: string,
  _password: string,
  _imapHost: string,
  _imapPort: number,
  limit: number = 50
): Promise<EmailMessage[]> {
  // In production, this would connect to IMAP server
  // For now, we return simulated recent emails for demo
  console.log(`Fetching emails from ${provider} for ${email}, limit: ${limit}`);
  
  // This is a placeholder - in real implementation:
  // 1. Use an IMAP library like 'imap' or 'imapflow'
  // 2. Or use provider APIs (Gmail API, Microsoft Graph)
  // 3. Or use a service like Nylas, Mailgun, etc.
  
  return [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Utilisateur non trouvé" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, emails, accountId } = await req.json();

    if (action === "analyze") {
      // Analyze provided emails (from manual paste or import)
      if (!emails || !Array.isArray(emails)) {
        return new Response(
          JSON.stringify({ error: "Emails requis pour l'analyse" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Analyzing ${emails.length} emails for user ${user.id}`);

      const results = [];
      let candidatesCreated = 0;
      let emailsImported = 0;

      for (const email of emails) {
        const analysis = await analyzeEmailWithAI(email);
        
        // Store email in hr_emails
        const { data: savedEmail, error: emailError } = await supabase
          .from("hr_emails")
          .insert({
            user_id: user.id,
            account_id: accountId || null,
            from_email: email.from_email,
            from_name: email.from_name || "",
            to_email: email.to_email || "",
            subject: email.subject,
            body_text: email.body_text,
            body_html: email.body_html,
            email_date: email.email_date || new Date().toISOString(),
            direction: "inbound",
            status: analysis.is_candidature ? "candidature" : "other",
            ai_analysis: analysis,
            attachments: email.attachments || [],
          })
          .select()
          .single();

        if (emailError) {
          console.error("Error saving email:", emailError);
          continue;
        }

        emailsImported++;

        // If it's a candidature, create candidate
        if (analysis.is_candidature && analysis.confidence >= 50) {
          const { data: existingCandidate } = await supabase
            .from("candidates")
            .select("id")
            .eq("user_id", user.id)
            .eq("email", analysis.candidate_email)
            .single();

          if (!existingCandidate) {
            const { error: candidateError } = await supabase
              .from("candidates")
              .insert({
                user_id: user.id,
                name: analysis.candidate_name || email.from_name || "Candidat",
                email: analysis.candidate_email || email.from_email,
                phone: analysis.candidate_phone,
                status: "new",
                skills: analysis.skills_mentioned.length > 0 ? analysis.skills_mentioned : null,
                experience_years: analysis.experience_years,
                ai_analysis: {
                  source: "email_extraction",
                  job_applied: analysis.job_title_applied,
                  motivation: analysis.motivation_summary,
                  cv_attached: analysis.has_cv_attachment,
                  extraction_date: new Date().toISOString(),
                },
              });

            if (!candidateError) {
              candidatesCreated++;
            }
          }

          // Link email to candidate
          if (savedEmail && analysis.candidate_email) {
            const { data: candidate } = await supabase
              .from("candidates")
              .select("id")
              .eq("user_id", user.id)
              .eq("email", analysis.candidate_email)
              .single();

            if (candidate) {
              await supabase
                .from("hr_emails")
                .update({ candidate_id: candidate.id })
                .eq("id", savedEmail.id);
            }
          }
        }

        results.push({
          email_id: savedEmail?.id,
          subject: email.subject,
          from: email.from_email,
          analysis,
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `${emailsImported} email(s) importé(s), ${candidatesCreated} candidat(s) créé(s)`,
          results,
          stats: {
            total: emails.length,
            imported: emailsImported,
            candidates_created: candidatesCreated,
            candidatures_detected: results.filter(r => r.analysis.is_candidature).length,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "fetch") {
      // Fetch from connected email account
      const { data: account, error: accountError } = await supabase
        .from("hr_email_accounts")
        .select("*")
        .eq("id", accountId)
        .eq("user_id", user.id)
        .single();

      if (accountError || !account) {
        return new Response(
          JSON.stringify({ error: "Compte email non trouvé" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // In production, decrypt password and connect to IMAP
      // For now, return a message about the limitation
      return new Response(
        JSON.stringify({
          success: false,
          message: "La connexion IMAP directe nécessite une configuration serveur. Utilisez l'import manuel ou connectez via OAuth.",
          requires_oauth: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Action non reconnue" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Email extraction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
