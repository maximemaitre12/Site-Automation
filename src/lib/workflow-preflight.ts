/**
 * Workflow Preflight Validation
 * 
 * Validates workflow prerequisites BEFORE execution:
 * - OAuth connections (Google, etc.)
 * - API keys (OpenAI, Stripe, etc.)
 * - Required block configurations
 * 
 * Returns blocking errors that prevent execution.
 */

import { WorkflowBlock } from '@/types/workflow';
import { getBlockByType } from '@/types/block-library';
import { supabase } from '@/integrations/supabase/client';

export interface PreflightIssue {
  blockId: string;
  blockName: string;
  blockType: string;
  severity: 'error' | 'warning';
  code: string;
  message: string;
  fix: string;
  /** If true, opens the block properties panel */
  requiresBlockConfig?: boolean;
  /** If true, requires OAuth connection */
  requiresOAuth?: boolean;
  /** OAuth provider if applicable */
  oauthProvider?: string;
}

export interface PreflightResult {
  valid: boolean;
  issues: PreflightIssue[];
  canProceed: boolean; // true if only warnings, false if errors
}

// Block types that require Google OAuth
const GOOGLE_OAUTH_BLOCKS = [
  'email_trigger',
  'email_oauth',
  'trigger_gmail',
  'gmail_trigger',
  'send_email', // When using Gmail
  'gmail_search',
  'gmail_read',
  'google_sheets',
  'google_drive',
  'google_calendar',
];

// Block types that require API keys
const API_KEY_REQUIREMENTS: Record<string, { key: string; label: string }> = {
  'openai_chat_model': { key: 'OPENAI_API_KEY', label: 'OpenAI API Key' },
  'openai_chat': { key: 'OPENAI_API_KEY', label: 'OpenAI API Key' },
  'anthropic_chat_model': { key: 'ANTHROPIC_API_KEY', label: 'Anthropic API Key' },
  'stripe_charge': { key: 'STRIPE_SECRET_KEY', label: 'Stripe Secret Key' },
  'stripe_customer': { key: 'STRIPE_SECRET_KEY', label: 'Stripe Secret Key' },
  'github_api': { key: 'GITHUB_TOKEN', label: 'GitHub Token' },
  'slack_message': { key: 'SLACK_TOKEN', label: 'Slack Token' },
  'notion_api': { key: 'NOTION_API_KEY', label: 'Notion API Key' },
  'airtable_api': { key: 'AIRTABLE_API_KEY', label: 'Airtable API Key' },
};

/**
 * Check if Google OAuth is connected for the current user
 */
async function checkGoogleOAuthStatus(): Promise<{ connected: boolean; email: string | null; expired: boolean }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { connected: false, email: null, expired: false };
    }

    const response = await supabase.functions.invoke('google-oauth-status');
    
    if (response.error || !response.data) {
      return { connected: false, email: null, expired: false };
    }

    return {
      connected: response.data.connected === true,
      email: response.data.email || null,
      expired: response.data.expired === true,
    };
  } catch (error) {
    console.warn('Preflight: Could not check Google OAuth status', error);
    return { connected: false, email: null, expired: false };
  }
}

/**
 * Check if a block has its required parameters configured
 */
function checkBlockConfig(block: WorkflowBlock): PreflightIssue[] {
  const issues: PreflightIssue[] = [];
  const def = getBlockByType(block.type);
  
  if (!def) return issues;

  const requiredParams = def.params?.filter(p => p.required) || [];
  
  for (const param of requiredParams) {
    const value = block.config?.[param.key];

    // Missing required value (unless the block is expected to fill it dynamically via an expression)
    if (value === undefined || value === null || value === '') {
      issues.push({
        blockId: block.id,
        blockName: block.name,
        blockType: block.type,
        severity: 'error',
        code: 'MISSING_REQUIRED_PARAM',
        message: `Le champ obligatoire "${param.label}" est manquant`,
        fix: `Renseignez le champ "${param.label}" dans les propriétés du bloc`,
        requiresBlockConfig: true,
      });
      continue;
    }

    // If it's a template/expression, we can't validate it statically
    const raw = typeof value === 'string' ? value.trim() : '';
    if (raw && raw.includes('{{') && raw.includes('}}')) {
      continue;
    }
    
    // Check for email fields with invalid values
    if (param.key === 'to' || param.key === 'recipient' || param.key === 'email') {
      const emailValue = String(value).trim();
      // Basic email validation
      if (emailValue && !emailValue.includes('@') && emailValue.length > 0) {
        issues.push({
          blockId: block.id,
          blockName: block.name,
          blockType: block.type,
          severity: 'warning',
          code: 'INVALID_EMAIL_FORMAT',
          message: `L'adresse email "${emailValue}" semble invalide`,
          fix: `Vérifiez le champ "${param.label}" dans les propriétés du bloc`,
          requiresBlockConfig: true,
        });
      }
    }
  }

  return issues;
}

/**
 * Determine if a send_email block uses Gmail (OAuth) or Resend
 */
function emailBlockUsesGmail(block: WorkflowBlock): boolean {
  // If the block has gmail_oauth explicitly set
  if (block.config?.use_gmail === true || block.config?.provider === 'gmail') {
    return true;
  }
  // If explicitly using a non-OAuth provider, do not require Google OAuth
  if (block.config?.use_gmail === false || block.config?.provider === 'resend') {
    return false;
  }
  // By default, send_email prefers Gmail if connected
  // We'll check OAuth status to determine
  return true; // Assume Gmail by default
}

/**
 * Run all preflight checks for a workflow
 */
export async function runPreflightValidation(blocks: WorkflowBlock[]): Promise<PreflightResult> {
  const issues: PreflightIssue[] = [];
  
  // Identify which checks are needed based on block types
  const needsGoogleOAuth = blocks.some(b => {
    const bt = b.type as string;
    if (GOOGLE_OAUTH_BLOCKS.includes(bt)) return true;
    if (bt === 'send_email' && emailBlockUsesGmail(b)) return true;
    return false;
  });

  // Check Google OAuth if needed
  let googleOAuthStatus: { connected: boolean; email: string | null; expired: boolean } | null = null;
  if (needsGoogleOAuth) {
    googleOAuthStatus = await checkGoogleOAuthStatus();
    
    // Find all blocks that need OAuth
    for (const block of blocks) {
      const blockType = block.type as string;
      const needsOAuth = GOOGLE_OAUTH_BLOCKS.includes(blockType) || 
        (blockType === 'send_email' && emailBlockUsesGmail(block));
      
      if (!needsOAuth) continue;

      if (!googleOAuthStatus.connected) {
        issues.push({
          blockId: block.id,
          blockName: block.name,
          blockType: blockType,
          severity: 'error',
          code: 'GOOGLE_OAUTH_NOT_CONNECTED',
          message: 'Connexion Google requise pour ce bloc',
          fix: 'Double-cliquez sur le bloc et connectez votre compte Google via le bouton "Se connecter à Google"',
          requiresBlockConfig: true,
          requiresOAuth: true,
          oauthProvider: 'google',
        });
      } else if (googleOAuthStatus.expired) {
        issues.push({
          blockId: block.id,
          blockName: block.name,
          blockType: block.type,
          severity: 'error',
          code: 'GOOGLE_OAUTH_EXPIRED',
          message: `Le token Google a expiré (${googleOAuthStatus.email})`,
          fix: 'Reconnectez votre compte Google pour rafraîchir le token',
          requiresBlockConfig: true,
          requiresOAuth: true,
          oauthProvider: 'google',
        });
      }
    }
  }

  // Check API key requirements
  for (const block of blocks) {
    const apiReq = API_KEY_REQUIREMENTS[block.type];
    if (apiReq) {
      // Check if block has the API key configured (in block config)
      const hasBlockApiKey = block.config?.apiKey || block.config?.api_key;
      
      if (!hasBlockApiKey) {
        issues.push({
          blockId: block.id,
          blockName: block.name,
          blockType: block.type,
          severity: 'error',
          code: 'MISSING_API_KEY',
          message: `${apiReq.label} requis pour "${block.name}"`,
          fix: `Ajoutez votre ${apiReq.label} dans les propriétés du bloc, ou utilisez un modèle Gemini (pas de clé requise)`,
          requiresBlockConfig: true,
        });
      }
    }
  }

  // Check individual block configurations
  for (const block of blocks) {
    const configIssues = checkBlockConfig(block);
    issues.push(...configIssues);
  }

  // Determine if we can proceed
  const hasErrors = issues.some(i => i.severity === 'error');
  
  return {
    valid: issues.length === 0,
    issues,
    canProceed: !hasErrors,
  };
}

/**
 * Format preflight issues as a user-friendly message
 */
export function formatPreflightMessage(result: PreflightResult): string {
  if (result.valid) {
    return 'Toutes les configurations sont valides.';
  }

  const errors = result.issues.filter(i => i.severity === 'error');
  const warnings = result.issues.filter(i => i.severity === 'warning');

  const lines: string[] = [];

  if (errors.length > 0) {
    lines.push(`${errors.length} problème(s) bloquant(s) détecté(s) :`);
    for (const err of errors) {
      lines.push(`• ${err.blockName}: ${err.message}`);
      lines.push(`  → ${err.fix}`);
    }
  }

  if (warnings.length > 0) {
    if (lines.length > 0) lines.push('');
    lines.push(`${warnings.length} avertissement(s) :`);
    for (const warn of warnings) {
      lines.push(`• ${warn.blockName}: ${warn.message}`);
    }
  }

  return lines.join('\n');
}

/**
 * Get a summary for the AI assistant
 */
export function getPreflightSummaryForAI(result: PreflightResult): string {
  if (result.valid) {
    return 'Preflight OK: all blocks are properly configured.';
  }

  const summary: string[] = ['PREFLIGHT FAILED:'];
  
  for (const issue of result.issues) {
    const prefix = issue.severity === 'error' ? '❌' : '⚠️';
    summary.push(`${prefix} [${issue.blockName}] ${issue.code}: ${issue.message}`);
    if (issue.requiresOAuth) {
      summary.push(`   → OAuth required: ${issue.oauthProvider}`);
    }
  }

  return summary.join('\n');
}
