import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  cv_content: string | null;
}

// Parse PDF content using Gemini Vision
async function parsePDFContent(base64Content: string, filename: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.log("No LOVABLE_API_KEY for PDF parsing");
    return "";
  }

  try {
    const dataUrl = `data:application/pdf;base64,${base64Content}`;
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extrais TOUT le texte de ce CV (${filename}) de manière structurée.
Inclus: nom complet, email, téléphone, adresse, profil LinkedIn, 
toutes les expériences professionnelles avec dates et descriptions,
toutes les formations, toutes les compétences techniques et soft skills,
les langues parlées, les certifications, les centres d'intérêt.
Retourne le texte brut complet et bien organisé.`
              },
              {
                type: "image_url",
                image_url: { url: dataUrl }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error("PDF parsing error:", response.status);
      return "";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return "";
  }
}

// Analyze email + CV content with AI
async function analyzeEmailContent(
  subject: string,
  body: string,
  fromEmail: string,
  fromName: string,
  cvContent: string | null,
  attachmentNames: string[]
): Promise<CandidateAnalysis> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.log("No LOVABLE_API_KEY, using heuristic");
    return heuristicAnalysis(subject, body, fromEmail, fromName, attachmentNames);
  }

  const systemPrompt = `Tu es un expert RH qui analyse les emails de candidature.

Analyse l'email et le contenu du CV (si fourni) pour extraire toutes les informations pertinentes.

IMPORTANT: Extrais le maximum d'informations du CV joint si disponible.

Retourne UNIQUEMENT un JSON valide:
{
  "is_candidature": boolean (true si c'est une candidature ou CV),
  "confidence": number (0-100),
  "candidate_name": string (nom complet extrait du CV ou email),
  "candidate_email": string,
  "candidate_phone": string ou null (format: +33...),
  "job_title_applied": string ou null (poste visé),
  "skills_mentioned": string[] (TOUTES les compétences du CV),
  "experience_years": number ou null,
  "motivation_summary": string (résumé de la motivation, max 200 chars),
  "has_cv_attachment": boolean,
  "cv_content": string ou null (résumé structuré du CV en 500 chars max)
}`;

  const userContent = `
EXPÉDITEUR: ${fromName} <${fromEmail}>
SUJET: ${subject}

CONTENU DE L'EMAIL:
${body || "(vide)"}

PIÈCES JOINTES: ${attachmentNames.join(", ") || "Aucune"}

${cvContent ? `
CONTENU DU CV EXTRAIT:
${cvContent}
` : ""}
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
          { role: "user", content: userContent }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error("AI error:", response.status);
      return heuristicAnalysis(subject, body, fromEmail, fromName, attachmentNames);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        is_candidature: parsed.is_candidature ?? false,
        confidence: parsed.confidence ?? 0,
        candidate_name: parsed.candidate_name || fromName,
        candidate_email: parsed.candidate_email || fromEmail,
        candidate_phone: parsed.candidate_phone,
        job_title_applied: parsed.job_title_applied,
        skills_mentioned: parsed.skills_mentioned || [],
        experience_years: parsed.experience_years,
        motivation_summary: parsed.motivation_summary,
        has_cv_attachment: parsed.has_cv_attachment ?? attachmentNames.some(n => 
          n.toLowerCase().includes("cv") || n.endsWith(".pdf")
        ),
        cv_content: parsed.cv_content,
      };
    }
  } catch (error) {
    console.error("AI analysis error:", error);
  }

  return heuristicAnalysis(subject, body, fromEmail, fromName, attachmentNames);
}

function heuristicAnalysis(
  subject: string,
  body: string,
  fromEmail: string,
  fromName: string,
  attachmentNames: string[]
): CandidateAnalysis {
  const combined = (subject + " " + body).toLowerCase();
  
  const keywords = [
    "candidature", "cv", "curriculum", "poste", "emploi", "offre",
    "postuler", "motivation", "expérience", "profil", "recrutement",
    "stage", "alternance", "cdi", "cdd", "contrat"
  ];
  
  const matchCount = keywords.filter(kw => combined.includes(kw)).length;
  const hasCV = attachmentNames.some(a => 
    a.toLowerCase().includes("cv") || 
    a.endsWith(".pdf") ||
    a.endsWith(".docx")
  );
  
  const phoneMatch = body.match(/(?:\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/);
  const isCandidature = matchCount >= 2 || (matchCount >= 1 && hasCV) || hasCV;
  
  return {
    is_candidature: isCandidature,
    confidence: Math.min(100, matchCount * 20 + (hasCV ? 40 : 0)),
    candidate_name: fromName || null,
    candidate_email: fromEmail,
    candidate_phone: phoneMatch ? phoneMatch[0].replace(/[\s.-]/g, "") : null,
    job_title_applied: null,
    skills_mentioned: [],
    experience_years: null,
    motivation_summary: null,
    has_cv_attachment: hasCV,
    cv_content: null,
  };
}

// Simulate IMAP fetch - in production, use a proper email API service
// For MVP, we'll use a webhook/manual trigger approach with stored emails
async function simulateEmailFetch(accountEmail: string, _limit: number = 20): Promise<any[]> {
  // In a real implementation, you would:
  // 1. Use an email API like Nylas, Mailgun, or SendGrid Inbound
  // 2. Or set up IMAP connection using a Deno-compatible library
  // 3. Or use Microsoft Graph API / Gmail API
  
  console.log(`Simulating email fetch for ${accountEmail}`);
  
  // Return empty - the actual emails should come from a webhook or manual input
  // This is a placeholder for the production implementation
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

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Utilisateur non trouvé" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, emails, accountId, rawEmailContent, attachments } = await req.json();

    // ACTION: Analyze emails with full CV parsing
    if (action === "analyze") {
      if (!emails || !Array.isArray(emails) || emails.length === 0) {
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
        // Parse CV attachments if present
        let cvContent: string | null = null;
        const emailAttachments = email.attachments || [];
        
        for (const attachment of emailAttachments) {
          if (attachment.content && (
            attachment.filename?.toLowerCase().includes("cv") ||
            attachment.filename?.endsWith(".pdf") ||
            attachment.content_type === "application/pdf"
          )) {
            console.log(`Parsing CV: ${attachment.filename}`);
            cvContent = await parsePDFContent(attachment.content, attachment.filename);
            break; // Parse first CV found
          }
        }

        // Analyze email + CV content
        const analysis = await analyzeEmailContent(
          email.subject,
          email.body_text || email.body_html?.replace(/<[^>]*>/g, '') || "",
          email.from_email,
          email.from_name || "",
          cvContent,
          emailAttachments.map((a: any) => a.filename || "")
        );

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
            ai_analysis: {
              ...analysis,
              cv_parsed: !!cvContent,
              cv_length: cvContent?.length || 0,
            },
            attachments: emailAttachments.map((a: any) => ({
              filename: a.filename,
              content_type: a.content_type,
              size: a.size,
            })),
          })
          .select()
          .single();

        if (emailError) {
          console.error("Error saving email:", emailError);
          continue;
        }

        emailsImported++;

        // Create candidate if candidature detected
        if (analysis.is_candidature && analysis.confidence >= 40) {
          const { data: existingCandidate } = await supabase
            .from("candidates")
            .select("id")
            .eq("user_id", user.id)
            .eq("email", analysis.candidate_email)
            .maybeSingle();

          if (!existingCandidate) {
            const { data: newCandidate, error: candidateError } = await supabase
              .from("candidates")
              .insert({
                user_id: user.id,
                name: analysis.candidate_name || email.from_name || "Candidat",
                email: analysis.candidate_email || email.from_email,
                phone: analysis.candidate_phone,
                status: "new",
                skills: analysis.skills_mentioned.length > 0 ? analysis.skills_mentioned : null,
                experience_years: analysis.experience_years,
                cv_text: cvContent || analysis.cv_content,
                ai_analysis: {
                  source: "email_extraction",
                  job_applied: analysis.job_title_applied,
                  motivation: analysis.motivation_summary,
                  cv_attached: analysis.has_cv_attachment,
                  cv_parsed: !!cvContent,
                  extraction_date: new Date().toISOString(),
                  confidence: analysis.confidence,
                },
              })
              .select()
              .single();

            if (!candidateError && newCandidate) {
              candidatesCreated++;
              
              // Link email to candidate
              await supabase
                .from("hr_emails")
                .update({ candidate_id: newCandidate.id })
                .eq("id", savedEmail.id);
            }
          } else {
            // Link to existing candidate
            await supabase
              .from("hr_emails")
              .update({ candidate_id: existingCandidate.id })
              .eq("id", savedEmail.id);
          }
        }

        results.push({
          email_id: savedEmail?.id,
          subject: email.subject,
          from: `${email.from_name || ""} <${email.from_email}>`,
          analysis: {
            ...analysis,
            cv_parsed: !!cvContent,
          },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `${emailsImported} email(s) analysé(s), ${candidatesCreated} candidat(s) créé(s)`,
          results,
          stats: {
            total: emails.length,
            imported: emailsImported,
            candidates_created: candidatesCreated,
            candidatures_detected: results.filter(r => r.analysis.is_candidature).length,
            cvs_parsed: results.filter(r => r.analysis.cv_parsed).length,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION: Fetch from connected account (placeholder for production)
    if (action === "fetch_from_account") {
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

      // In production, this would connect to the email provider
      // For now, return instruction message
      return new Response(
        JSON.stringify({
          success: false,
          message: `Pour connecter ${account.email_address}, utilisez l'import manuel ou configurez un webhook email.`,
          account: {
            email: account.email_address,
            provider: account.provider,
          },
          instructions: [
            "1. Transférez vos emails de candidature vers cette interface",
            "2. Ou configurez une règle de transfert automatique dans votre messagerie",
            "3. L'IA analysera automatiquement chaque email et CV joint",
          ],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION: Parse single email with attachments
    if (action === "parse_single") {
      if (!rawEmailContent) {
        return new Response(
          JSON.stringify({ error: "Contenu email requis" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Parse raw email content
      const lines = rawEmailContent.split('\n');
      let from = '', subject = '', date = '', body = '';
      let inBody = false;
      
      for (const line of lines) {
        if (!inBody) {
          if (line.match(/^(De|From|Expéditeur)\s*:/i)) {
            from = line.replace(/^(De|From|Expéditeur)\s*:\s*/i, '').trim();
          } else if (line.match(/^(Sujet|Subject|Objet)\s*:/i)) {
            subject = line.replace(/^(Sujet|Subject|Objet)\s*:\s*/i, '').trim();
          } else if (line.match(/^(Date|Reçu|Received)\s*:/i)) {
            date = line.replace(/^(Date|Reçu|Received)\s*:\s*/i, '').trim();
          } else if (line.trim() === '') {
            inBody = true;
          }
        } else {
          body += line + '\n';
        }
      }

      // Extract email from "From" field
      let fromEmail = '';
      let fromName = '';
      const emailMatch = from.match(/<(.+@.+)>/);
      if (emailMatch) {
        fromEmail = emailMatch[1];
        fromName = from.replace(/<.+>/, '').trim();
      } else if (from.includes('@')) {
        fromEmail = from.split(/\s/)[0];
        fromName = from.replace(fromEmail, '').trim();
      } else {
        const anyEmail = body.match(/[\w.-]+@[\w.-]+\.\w+/);
        fromEmail = anyEmail ? anyEmail[0] : 'inconnu@email.com';
        fromName = from || 'Candidat';
      }

      // Parse PDF attachments if provided
      let cvContent: string | null = null;
      if (attachments && Array.isArray(attachments)) {
        for (const att of attachments) {
          if (att.content && (att.filename?.endsWith('.pdf') || att.type?.includes('pdf'))) {
            cvContent = await parsePDFContent(att.content, att.filename);
            break;
          }
        }
      }

      const analysis = await analyzeEmailContent(
        subject,
        body,
        fromEmail,
        fromName,
        cvContent,
        attachments?.map((a: any) => a.filename) || []
      );

      return new Response(
        JSON.stringify({
          success: true,
          parsed: {
            from_email: fromEmail,
            from_name: fromName,
            subject: subject || 'Sans sujet',
            body_text: body.trim(),
            email_date: date || new Date().toISOString(),
          },
          analysis: {
            ...analysis,
            cv_parsed: !!cvContent,
          },
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
