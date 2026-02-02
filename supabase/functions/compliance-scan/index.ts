import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PIIPattern {
  name: string;
  regex: RegExp;
  severity: 'critical' | 'high' | 'medium' | 'low';
  rgpdArticle: string;
}

// Patterns de données personnelles sensibles
const piiPatterns: PIIPattern[] = [
  { name: 'email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, severity: 'medium', rgpdArticle: 'Art. 4' },
  { name: 'phone_fr', regex: /(?:\+33|0033|0)[1-9](?:[\s.-]?\d{2}){4}/g, severity: 'medium', rgpdArticle: 'Art. 4' },
  { name: 'ssn_fr', regex: /[12]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{3}\s?\d{3}\s?\d{2}/g, severity: 'critical', rgpdArticle: 'Art. 9' },
  { name: 'iban', regex: /[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}/g, severity: 'high', rgpdArticle: 'Art. 4' },
  { name: 'credit_card', regex: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g, severity: 'critical', rgpdArticle: 'Art. 9' },
];

// Vérifications de conformité RGPD
interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  rgpdArticle: string;
  check: (data: any[], tableName: string) => ComplianceIssue[];
}

interface ComplianceIssue {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedRecords: number;
  table: string;
  rgpdReference: string;
  remediation: string[];
}

const complianceChecks: ComplianceCheck[] = [
  {
    id: 'data_retention',
    name: 'Durée de conservation',
    description: 'Vérifie si des données anciennes sont conservées au-delà des durées légales',
    rgpdArticle: 'Art. 5.1.e',
    check: (data, tableName) => {
      const issues: ComplianceIssue[] = [];
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
      
      const oldRecords = data.filter(r => {
        const date = r.created_at ? new Date(r.created_at) : null;
        return date && date < threeYearsAgo;
      });
      
      if (oldRecords.length > 0) {
        issues.push({
          type: 'retention_exceeded',
          severity: 'high',
          title: 'Données conservées au-delà de 3 ans',
          description: `${oldRecords.length} enregistrements dans ${tableName} datent de plus de 3 ans`,
          affectedRecords: oldRecords.length,
          table: tableName,
          rgpdReference: 'RGPD Art. 5.1.e - Limitation de la conservation',
          remediation: [
            'Définir une politique de rétention des données',
            'Supprimer ou anonymiser les données obsolètes',
            'Documenter les durées de conservation'
          ]
        });
      }
      return issues;
    }
  },
  {
    id: 'pii_detection',
    name: 'Données personnelles identifiables',
    description: 'Détecte les PII dans les champs texte',
    rgpdArticle: 'Art. 4',
    check: (data, tableName) => {
      const issues: ComplianceIssue[] = [];
      const piiFindings: Record<string, number> = {};
      
      data.forEach(record => {
        Object.values(record).forEach(value => {
          if (typeof value === 'string') {
            piiPatterns.forEach(pattern => {
              const matches = value.match(pattern.regex);
              if (matches) {
                piiFindings[pattern.name] = (piiFindings[pattern.name] || 0) + matches.length;
              }
            });
          }
        });
      });
      
      Object.entries(piiFindings).forEach(([piiType, count]) => {
        const pattern = piiPatterns.find(p => p.name === piiType);
        if (pattern && count > 0) {
          issues.push({
            type: 'pii_detected',
            severity: pattern.severity,
            title: `${piiType.toUpperCase()} détectés`,
            description: `${count} instances de ${piiType} trouvées dans ${tableName}`,
            affectedRecords: count,
            table: tableName,
            rgpdReference: `RGPD ${pattern.rgpdArticle}`,
            remediation: [
              'Vérifier la base légale du traitement',
              'Documenter dans le registre des traitements',
              'Chiffrer les données sensibles'
            ]
          });
        }
      });
      
      return issues;
    }
  },
  {
    id: 'consent_check',
    name: 'Consentement documenté',
    description: 'Vérifie la présence de preuves de consentement',
    rgpdArticle: 'Art. 7',
    check: (data, tableName) => {
      const issues: ComplianceIssue[] = [];
      
      // Vérifier si la table devrait avoir un champ de consentement
      if (['candidates', 'crm_contacts', 'employees'].includes(tableName)) {
        const hasConsentField = data.length > 0 && data[0].hasOwnProperty('consent_given');
        
        if (!hasConsentField) {
          issues.push({
            type: 'no_consent_tracking',
            severity: 'critical',
            title: 'Pas de suivi du consentement',
            description: `La table ${tableName} ne contient pas de champ de consentement`,
            affectedRecords: data.length,
            table: tableName,
            rgpdReference: 'RGPD Art. 7 - Conditions du consentement',
            remediation: [
              'Ajouter un champ consent_given (boolean)',
              'Ajouter un champ consent_date (timestamp)',
              'Documenter le mode de collecte du consentement'
            ]
          });
        } else {
          const withoutConsent = data.filter(r => !r.consent_given);
          if (withoutConsent.length > 0) {
            issues.push({
              type: 'missing_consent',
              severity: 'high',
              title: 'Consentement manquant',
              description: `${withoutConsent.length} enregistrements sans consentement documenté`,
              affectedRecords: withoutConsent.length,
              table: tableName,
              rgpdReference: 'RGPD Art. 7 - Conditions du consentement',
              remediation: [
                'Recueillir le consentement des personnes concernées',
                'Ou identifier une autre base légale (contrat, intérêt légitime)'
              ]
            });
          }
        }
      }
      
      return issues;
    }
  }
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Vérifier l'utilisateur
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { scanType = 'full' } = await req.json().catch(() => ({}));

    console.log(`Starting compliance scan for user ${user.id}, type: ${scanType}`);

    // Créer l'entrée de scan
    const { data: scan, error: scanError } = await supabase
      .from('compliance_scans')
      .insert({
        user_id: user.id,
        scan_type: scanType,
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (scanError) {
      console.error('Error creating scan:', scanError);
      throw new Error('Failed to create scan record');
    }

    const allIssues: ComplianceIssue[] = [];
    const dataSourcesScanned: string[] = [];
    let totalRecords = 0;

    // Tables à scanner
    const tablesToScan = [
      { name: 'candidates', userIdField: 'user_id' },
      { name: 'crm_contacts', userIdField: 'user_id' },
      { name: 'crm_companies', userIdField: 'user_id' },
      { name: 'employees', userIdField: 'user_id' },
    ];

    for (const table of tablesToScan) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table.name)
          .select('*')
          .eq(table.userIdField, user.id)
          .limit(1000);

        if (tableError) {
          console.log(`Skipping ${table.name}: ${tableError.message}`);
          continue;
        }

        if (tableData && tableData.length > 0) {
          dataSourcesScanned.push(table.name);
          totalRecords += tableData.length;

          // Appliquer chaque vérification
          for (const check of complianceChecks) {
            const issues = check.check(tableData, table.name);
            allIssues.push(...issues);
          }
        }
      } catch (e) {
        console.error(`Error scanning ${table.name}:`, e);
      }
    }

    // Calculer le score
    const criticalCount = allIssues.filter(i => i.severity === 'critical').length;
    const highCount = allIssues.filter(i => i.severity === 'high').length;
    const mediumCount = allIssues.filter(i => i.severity === 'medium').length;
    
    let score = 100;
    score -= criticalCount * 20;
    score -= highCount * 10;
    score -= mediumCount * 5;
    score = Math.max(0, score);

    // Générer les recommandations
    const recommendations = [];
    if (criticalCount > 0) {
      recommendations.push({
        priority: 'urgent',
        title: 'Problèmes critiques à traiter immédiatement',
        description: `${criticalCount} problèmes critiques détectés nécessitant une action immédiate`
      });
    }
    if (allIssues.some(i => i.type === 'retention_exceeded')) {
      recommendations.push({
        priority: 'high',
        title: 'Définir une politique de rétention',
        description: 'Mettre en place une politique de conservation des données conforme au RGPD'
      });
    }
    if (allIssues.some(i => i.type === 'no_consent_tracking')) {
      recommendations.push({
        priority: 'high',
        title: 'Implémenter le suivi du consentement',
        description: 'Ajouter des champs de consentement aux tables concernées'
      });
    }

    // Mettre à jour le scan
    const { error: updateError } = await supabase
      .from('compliance_scans')
      .update({
        status: 'completed',
        overall_score: score,
        data_sources_scanned: dataSourcesScanned,
        findings: allIssues,
        recommendations,
        records_analyzed: totalRecords,
        issues_found: allIssues.length,
        critical_issues: criticalCount,
        completed_at: new Date().toISOString()
      })
      .eq('id', scan.id);

    if (updateError) {
      console.error('Error updating scan:', updateError);
    }

    // Créer des alertes pour les problèmes critiques
    for (const issue of allIssues.filter(i => i.severity === 'critical' || i.severity === 'high')) {
      await supabase
        .from('compliance_alerts')
        .insert({
          user_id: user.id,
          scan_id: scan.id,
          alert_type: issue.type,
          severity: issue.severity,
          title: issue.title,
          description: issue.description,
          affected_table: issue.table,
          affected_records: issue.affectedRecords,
          regulation_reference: issue.rgpdReference,
          remediation_steps: issue.remediation
        });
    }

    console.log(`Scan completed: score=${score}, issues=${allIssues.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        scanId: scan.id,
        score,
        issuesCount: allIssues.length,
        criticalCount,
        dataSourcesScanned,
        findings: allIssues,
        recommendations
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Compliance scan error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
