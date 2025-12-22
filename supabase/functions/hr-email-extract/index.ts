import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MSGraphEmail {
  id: string;
  subject: string;
  bodyPreview: string;
  body: { content: string; contentType: string };
  from: { emailAddress: { name: string; address: string } };
  toRecipients: Array<{ emailAddress: { name: string; address: string } }>;
  receivedDateTime: string;
  hasAttachments: boolean;
}

interface MSGraphAttachment {
  id: string;
  name: string;
  contentType: string;
  size: number;
  contentBytes?: string;
}

// Refresh Microsoft OAuth token
async function refreshMicrosoftToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresAt: Date } | null> {
  const clientId = Deno.env.get("MICROSOFT_CLIENT_ID");
  const clientSecret = Deno.env.get("MICROSOFT_CLIENT_SECRET");
  
  if (!clientId || !clientSecret) {
    console.error("Microsoft OAuth credentials not configured");
    return null;
  }

  try {
    const response = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
        scope: "https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.ReadBasic offline_access",
      }),
    });

    if (!response.ok) {
      console.error("Token refresh failed:", await response.text());
      return null;
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

// Fetch recent emails from Microsoft Graph
async function fetchRecentEmails(accessToken: string, limit: number = 20): Promise<MSGraphEmail[]> {
  const url = `https://graph.microsoft.com/v1.0/me/messages?$top=${limit}&$orderby=receivedDateTime desc&$filter=isRead eq false or receivedDateTime ge ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}&$select=id,subject,bodyPreview,body,from,toRecipients,receivedDateTime,hasAttachments`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error("Graph API error:", response.status, await response.text());
    return [];
  }

  const data = await response.json();
  return data.value || [];
}

// Fetch email attachments
async function fetchAttachments(accessToken: string, messageId: string): Promise<MSGraphAttachment[]> {
  const url = `https://graph.microsoft.com/v1.0/me/messages/${messageId}/attachments`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error("Attachments fetch error:", response.status);
    return [];
  }

  const data = await response.json();
  return data.value || [];
}

// Parse PDF using Gemini Vision
async function parsePDFContent(base64Content: string, filename: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) return "";

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: `Extrais TOUT le texte de ce CV (${filename}) de manière structurée.\nInclus: nom complet, email, téléphone, adresse, profil LinkedIn,\ntoutes les expériences professionnelles avec dates et descriptions,\ntoutes les formations, compétences techniques et soft skills,\nlangues parlées, certifications. Retourne le texte brut complet.`
            },
            {
              type: "image_url",
              image_url: { url: `data:application/pdf;base64,${base64Content}` }
            }
          ]
        }],
      }),
    });

    if (!response.ok) return "";
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("PDF parsing error:", error);
    return "";
  }
}

// Analyze email + CV content with AI
async function analyzeEmailContent(
  subject: string, body: string, fromEmail: string, fromName: string,
  cvContent: string | null, attachmentNames: string[]
): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    return heuristicAnalysis(subject, body, fromEmail, fromName, attachmentNames);
  }

  const systemPrompt = `Tu es un expert RH. Analyse l'email et le CV pour extraire les informations du candidat.\nRetourne UNIQUEMENT un JSON valide:\n{\n  "is_candidature": boolean,\n  "confidence": number (0-100),\n  "candidate_name": string,\n  "candidate_email": string,\n  "candidate_phone": string ou null,\n  "job_title_applied": string ou null,\n  "skills_mentioned": string[],\n  "experience_years": number ou null,\n  "motivation_summary": string (max 200 chars),\n  "has_cv_attachment": boolean,\n  "cv_summary": string (résumé du CV, max 500 chars)\n}`;

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
          { role: "user", content: `EXPÉDITEUR: ${fromName} <${fromEmail}>\nSUJET: ${subject}\nCONTENU: ${body}\nPIÈCES JOINTES: ${attachmentNames.join(", ") || "Aucune"}\n${cvContent ? `\nCV EXTRAIT:\n${cvContent}` : ""}` }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
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
        has_cv_attachment: parsed.has_cv_attachment ?? attachmentNames.some(n => n.toLowerCase().includes("cv") || n.endsWith(".pdf")),
        cv_summary: parsed.cv_summary,
      };
    }
  } catch (error) {
    console.error("AI analysis error:", error);
  }

  return heuristicAnalysis(subject, body, fromEmail, fromName, attachmentNames);
}

function heuristicAnalysis(subject: string, body: string, fromEmail: string, fromName: string, attachmentNames: string[]): any {
  const combined = (subject + " " + body).toLowerCase();
  const keywords = ["candidature", "cv", "curriculum", "poste", "emploi", "postuler", "motivation", "stage", "alternance", "cdi", "cdd"];
  const matchCount = keywords.filter(kw => combined.includes(kw)).length;
  const hasCV = attachmentNames.some(a => a.toLowerCase().includes("cv") || a.endsWith(".pdf"));
  const phoneMatch = body.match(/(?:\+33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/);
  
  return {
    is_candidature: matchCount >= 2 || hasCV,
    confidence: Math.min(100, matchCount * 20 + (hasCV ? 40 : 0)),
    candidate_name: fromName || null,
    candidate_email: fromEmail,
    candidate_phone: phoneMatch ? phoneMatch[0].replace(/[\s.-]/g, "") : null,
    job_title_applied: null,
    skills_mentioned: [],
    experience_years: null,
    motivation_summary: null,
    has_cv_attachment: hasCV,
    cv_summary: null,
  };
}

// Store CV file in Supabase Storage
async function storeCVFile(
  supabase: any, userId: string, candidateId: string, 
  filename: string, contentBytes: string, contentType: string
): Promise<string | null> {
  try {
    const filePath = `${userId}/${candidateId}/${filename}`;
    const fileData = Uint8Array.from(atob(contentBytes), c => c.charCodeAt(0));
    
    const { error } = await supabase.storage
      .from("cv-files")
      .upload(filePath, fileData, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return null;
    }

    const { data: urlData } = supabase.storage.from("cv-files").getPublicUrl(filePath);
    return urlData?.publicUrl || null;
  } catch (error) {
    console.error("CV storage error:", error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    // Check if it's an authenticated request or a cron job
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
      }
    }

    const body = await req.json();
    const { action, accountId } = body;

    // ACTION: Fetch and analyze emails from Outlook
    if (action === "fetch_outlook_emails") {
      if (!userId && !accountId) {
        return new Response(
          JSON.stringify({ error: "Authentification requise" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get email account with OAuth tokens
      let query = supabase.from("hr_email_accounts").select("*").eq("provider", "outlook");
      
      if (userId) {
        query = query.eq("user_id", userId);
      }
      if (accountId) {
        query = query.eq("id", accountId);
      }

      const { data: accounts, error: accountError } = await query.limit(10);

      if (accountError || !accounts?.length) {
        return new Response(
          JSON.stringify({ error: "Aucun compte Outlook configuré", details: accountError?.message }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const results: any[] = [];

      for (const account of accounts) {
        if (!account.oauth_refresh_token) {
          results.push({ account: account.email_address, error: "OAuth non configuré" });
          continue;
        }

        // Refresh token if needed
        let accessToken = account.oauth_access_token;
        const tokenExpired = !account.oauth_token_expires_at || 
          new Date(account.oauth_token_expires_at) < new Date();

        if (tokenExpired) {
          const newTokens = await refreshMicrosoftToken(account.oauth_refresh_token);
          if (!newTokens) {
            results.push({ account: account.email_address, error: "Token refresh failed" });
            continue;
          }

          accessToken = newTokens.accessToken;
          
          // Update tokens in database
          await supabase.from("hr_email_accounts").update({
            oauth_access_token: newTokens.accessToken,
            oauth_refresh_token: newTokens.refreshToken,
            oauth_token_expires_at: newTokens.expiresAt.toISOString(),
          }).eq("id", account.id);
        }

        // Fetch recent emails
        console.log(`Fetching emails for ${account.email_address}`);
        const emails = await fetchRecentEmails(accessToken, 20);
        console.log(`Found ${emails.length} emails`);

        let emailsImported = 0;
        let candidatesCreated = 0;
        let cvsStored = 0;

        for (const email of emails) {
          // Check if email already imported
          const { data: existing } = await supabase
            .from("hr_emails")
            .select("id")
            .eq("external_id", email.id)
            .eq("user_id", account.user_id)
            .single();

          if (existing) continue;

          // Fetch attachments
          let attachments: MSGraphAttachment[] = [];
          let cvContent: string | null = null;
          let cvAttachment: MSGraphAttachment | null = null;

          if (email.hasAttachments) {
            attachments = await fetchAttachments(accessToken, email.id);
            
            // Find and parse CV
            for (const att of attachments) {
              if (att.contentBytes && (
                att.name.toLowerCase().includes("cv") ||
                att.contentType === "application/pdf" ||
                att.name.endsWith(".pdf")
              )) {
                cvAttachment = att;
                cvContent = await parsePDFContent(att.contentBytes, att.name);
                break;
              }
            }
          }

          // Analyze email + CV
          const analysis = await analyzeEmailContent(
            email.subject,
            email.body.content.replace(/<[^>]*>/g, ""),
            email.from.emailAddress.address,
            email.from.emailAddress.name,
            cvContent,
            attachments.map(a => a.name)
          );

          // Store email
          const { data: savedEmail, error: emailError } = await supabase
            .from("hr_emails")
            .insert({
              user_id: account.user_id,
              account_id: account.id,
              external_id: email.id,
              from_email: email.from.emailAddress.address,
              from_name: email.from.emailAddress.name,
              to_email: email.toRecipients[0]?.emailAddress.address || "",
              subject: email.subject,
              body_text: email.body.content.replace(/<[^>]*>/g, ""),
              body_html: email.body.contentType === "html" ? email.body.content : null,
              email_date: email.receivedDateTime,
              direction: "inbound",
              status: analysis.is_candidature ? "candidature" : "other",
              ai_analysis: { ...analysis, cv_parsed: !!cvContent },
              attachments: attachments.map(a => ({
                filename: a.name,
                content_type: a.contentType,
                size: a.size,
              })),
            })
            .select()
            .single();

          if (emailError) {
            console.error("Email save error:", emailError);
            continue;
          }

          emailsImported++;

          // Create candidate if candidature detected
          if (analysis.is_candidature && analysis.confidence >= 40) {
            const { data: existingCandidate } = await supabase
              .from("candidates")
              .select("id")
              .eq("user_id", account.user_id)
              .eq("email", analysis.candidate_email)
              .maybeSingle();

            let candidateId = existingCandidate?.id;

            if (!existingCandidate) {
              const { data: newCandidate, error: candidateError } = await supabase
                .from("candidates")
                .insert({
                  user_id: account.user_id,
                  name: analysis.candidate_name || email.from.emailAddress.name,
                  email: analysis.candidate_email || email.from.emailAddress.address,
                  phone: analysis.candidate_phone,
                  status: "new",
                  skills: analysis.skills_mentioned.length > 0 ? analysis.skills_mentioned : null,
                  experience_years: analysis.experience_years,
                  cv_text: cvContent || analysis.cv_summary,
                  ai_analysis: {
                    source: "outlook_extraction",
                    job_applied: analysis.job_title_applied,
                    motivation: analysis.motivation_summary,
                    cv_parsed: !!cvContent,
                    extraction_date: new Date().toISOString(),
                    confidence: analysis.confidence,
                  },
                })
                .select()
                .single();

              if (!candidateError && newCandidate) {
                candidatesCreated++;
                candidateId = newCandidate.id;
              }
            }

            // Store CV file
            if (candidateId && cvAttachment?.contentBytes) {
              const cvUrl = await storeCVFile(
                supabase,
                account.user_id,
                candidateId,
                cvAttachment.name,
                cvAttachment.contentBytes,
                cvAttachment.contentType
              );

              if (cvUrl) {
                await supabase.from("candidates").update({ cv_file_url: cvUrl }).eq("id", candidateId);
                cvsStored++;
              }
            }

            // Link email to candidate
            if (candidateId && savedEmail) {
              await supabase.from("hr_emails").update({ candidate_id: candidateId }).eq("id", savedEmail.id);
            }
          }
        }

        // Update last extraction time
        await supabase.from("hr_email_accounts").update({
          last_extraction_at: new Date().toISOString(),
        }).eq("id", account.id);

        results.push({
          account: account.email_address,
          emails_fetched: emails.length,
          emails_imported: emailsImported,
          candidates_created: candidatesCreated,
          cvs_stored: cvsStored,
        });
      }

      return new Response(
        JSON.stringify({ success: true, results }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ACTION: Manual analyze (existing functionality)
    if (action === "analyze") {
      const { emails } = body;
      
      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return new Response(
          JSON.stringify({ error: "Emails requis" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const results = [];
      let candidatesCreated = 0;
      let emailsImported = 0;

      for (const email of emails) {
        let cvContent: string | null = null;
        const emailAttachments = email.attachments || [];
        
        for (const att of emailAttachments) {
          if (att.content && (att.filename?.toLowerCase().includes("cv") || att.filename?.endsWith(".pdf"))) {
            cvContent = await parsePDFContent(att.content, att.filename);
            break;
          }
        }

        const analysis = await analyzeEmailContent(
          email.subject,
          email.body_text || email.body_html?.replace(/<[^>]*>/g, '') || "",
          email.from_email,
          email.from_name || "",
          cvContent,
          emailAttachments.map((a: any) => a.filename || "")
        );

        const { data: savedEmail, error: emailError } = await supabase
          .from("hr_emails")
          .insert({
            user_id: userId,
            from_email: email.from_email,
            from_name: email.from_name || "",
            to_email: email.to_email || "",
            subject: email.subject,
            body_text: email.body_text,
            body_html: email.body_html,
            email_date: email.email_date || new Date().toISOString(),
            direction: "inbound",
            status: analysis.is_candidature ? "candidature" : "other",
            ai_analysis: { ...analysis, cv_parsed: !!cvContent },
            attachments: emailAttachments.map((a: any) => ({
              filename: a.filename,
              content_type: a.content_type,
              size: a.size,
            })),
          })
          .select()
          .single();

        if (emailError) continue;
        emailsImported++;

        if (analysis.is_candidature && analysis.confidence >= 40) {
          const { data: existing } = await supabase
            .from("candidates")
            .select("id")
            .eq("user_id", userId)
            .eq("email", analysis.candidate_email)
            .maybeSingle();

          if (!existing) {
            const { error: candidateError } = await supabase
              .from("candidates")
              .insert({
                user_id: userId,
                name: analysis.candidate_name || email.from_name,
                email: analysis.candidate_email || email.from_email,
                phone: analysis.candidate_phone,
                status: "new",
                skills: analysis.skills_mentioned.length > 0 ? analysis.skills_mentioned : null,
                experience_years: analysis.experience_years,
                cv_text: cvContent || analysis.cv_summary,
                ai_analysis: {
                  source: "manual_import",
                  extraction_date: new Date().toISOString(),
                  confidence: analysis.confidence,
                },
              });

            if (!candidateError) candidatesCreated++;
          }
        }

        results.push({
          email_id: savedEmail?.id,
          subject: email.subject,
          from: `${email.from_name || ""} <${email.from_email}>`,
          analysis: { ...analysis, cv_parsed: !!cvContent },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `${emailsImported} email(s), ${candidatesCreated} candidat(s)`,
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

    return new Response(
      JSON.stringify({ error: "Action non reconnue" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur interne" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
