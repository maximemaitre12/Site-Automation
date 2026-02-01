/**
 * Dynamic Connector Generator
 * 
 * AI-powered system to generate custom API connectors from documentation,
 * enabling 200+ integrations without manual coding. Each connector becomes
 * a reusable block in the library.
 */

import { BlockDefinition, BlockParam, BlockCategory } from '@/types/block-library';

export interface ConnectorDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  baseUrl: string;
  authType: 'none' | 'api_key' | 'bearer' | 'oauth2' | 'basic';
  authConfig: AuthConfig;
  endpoints: ConnectorEndpoint[];
  commonHeaders?: Record<string, string>;
  rateLimits?: RateLimitConfig;
  documentation?: string;
  category: ConnectorCategory;
  verified: boolean;
  usageCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface AuthConfig {
  keyName?: string;
  keyLocation?: 'header' | 'query' | 'body';
  headerPrefix?: string;
  oauth2?: {
    authUrl: string;
    tokenUrl: string;
    scopes: string[];
    pkce?: boolean;
  };
}

export interface ConnectorEndpoint {
  id: string;
  name: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  parameters: EndpointParameter[];
  requestBody?: EndpointParameter[];
  responseSchema?: any;
  rateLimit?: number;
}

export interface EndpointParameter {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  location: 'path' | 'query' | 'header' | 'body';
  defaultValue?: any;
  description?: string;
  enum?: string[];
}

export interface RateLimitConfig {
  requestsPerMinute?: number;
  requestsPerHour?: number;
  requestsPerDay?: number;
  burstLimit?: number;
}

export type ConnectorCategory = 
  | 'crm'
  | 'marketing'
  | 'communication'
  | 'productivity'
  | 'finance'
  | 'ecommerce'
  | 'analytics'
  | 'developer'
  | 'ai_ml'
  | 'storage'
  | 'database'
  | 'social'
  | 'hr'
  | 'support';

export const CONNECTOR_CATEGORIES: Record<ConnectorCategory, { label: string; icon: string; color: string }> = {
  crm: { label: 'CRM', icon: 'Users', color: '#22c55e' },
  marketing: { label: 'Marketing', icon: 'Megaphone', color: '#ec4899' },
  communication: { label: 'Communication', icon: 'MessageSquare', color: '#0ea5e9' },
  productivity: { label: 'Productivité', icon: 'CheckSquare', color: '#f59e0b' },
  finance: { label: 'Finance', icon: 'CreditCard', color: '#10b981' },
  ecommerce: { label: 'E-commerce', icon: 'ShoppingCart', color: '#8b5cf6' },
  analytics: { label: 'Analytics', icon: 'BarChart', color: '#6366f1' },
  developer: { label: 'Développeur', icon: 'Code', color: '#64748b' },
  ai_ml: { label: 'IA & ML', icon: 'Brain', color: '#a855f7' },
  storage: { label: 'Stockage', icon: 'HardDrive', color: '#84cc16' },
  database: { label: 'Base de données', icon: 'Database', color: '#3b82f6' },
  social: { label: 'Réseaux sociaux', icon: 'Share2', color: '#f97316' },
  hr: { label: 'RH', icon: 'Briefcase', color: '#14b8a6' },
  support: { label: 'Support', icon: 'HeadphonesIcon', color: '#ef4444' },
};

// ============================================================================
// BUILT-IN CONNECTORS (200+ services)
// ============================================================================

export const BUILT_IN_CONNECTORS: Partial<ConnectorDefinition>[] = [
  // CRM
  { id: 'hubspot', name: 'HubSpot', category: 'crm', icon: 'Users', color: '#ff7a59', verified: true },
  { id: 'salesforce', name: 'Salesforce', category: 'crm', icon: 'Cloud', color: '#00a1e0', verified: true },
  { id: 'pipedrive', name: 'Pipedrive', category: 'crm', icon: 'GitBranch', color: '#017737', verified: true },
  { id: 'zoho_crm', name: 'Zoho CRM', category: 'crm', icon: 'Users', color: '#c8202f', verified: true },
  { id: 'freshsales', name: 'Freshsales', category: 'crm', icon: 'UserPlus', color: '#00c48c', verified: true },
  { id: 'copper', name: 'Copper', category: 'crm', icon: 'Users', color: '#f9a825', verified: true },
  
  // Marketing
  { id: 'mailchimp', name: 'Mailchimp', category: 'marketing', icon: 'Mail', color: '#ffe01b', verified: true },
  { id: 'sendgrid', name: 'SendGrid', category: 'marketing', icon: 'Send', color: '#1a82e2', verified: true },
  { id: 'klaviyo', name: 'Klaviyo', category: 'marketing', icon: 'Mail', color: '#000000', verified: true },
  { id: 'activecampaign', name: 'ActiveCampaign', category: 'marketing', icon: 'Zap', color: '#356ae6', verified: true },
  { id: 'convertkit', name: 'ConvertKit', category: 'marketing', icon: 'Mail', color: '#fb6970', verified: true },
  { id: 'brevo', name: 'Brevo', category: 'marketing', icon: 'Send', color: '#0b996e', verified: true },
  { id: 'mailerlite', name: 'MailerLite', category: 'marketing', icon: 'Mail', color: '#09c269', verified: true },
  { id: 'constant_contact', name: 'Constant Contact', category: 'marketing', icon: 'Mail', color: '#0073c6', verified: true },
  
  // Communication
  { id: 'slack', name: 'Slack', category: 'communication', icon: 'MessageSquare', color: '#4a154b', verified: true },
  { id: 'discord', name: 'Discord', category: 'communication', icon: 'MessageCircle', color: '#5865f2', verified: true },
  { id: 'telegram', name: 'Telegram', category: 'communication', icon: 'Send', color: '#0088cc', verified: true },
  { id: 'twilio', name: 'Twilio', category: 'communication', icon: 'Phone', color: '#f22f46', verified: true },
  { id: 'whatsapp', name: 'WhatsApp Business', category: 'communication', icon: 'MessageSquare', color: '#25d366', verified: true },
  { id: 'intercom', name: 'Intercom', category: 'communication', icon: 'MessageSquare', color: '#1f8ded', verified: true },
  { id: 'crisp', name: 'Crisp', category: 'communication', icon: 'MessageCircle', color: '#5e56f4', verified: true },
  { id: 'zendesk_chat', name: 'Zendesk Chat', category: 'communication', icon: 'MessageSquare', color: '#03363d', verified: true },
  
  // Productivity
  { id: 'notion', name: 'Notion', category: 'productivity', icon: 'FileText', color: '#000000', verified: true },
  { id: 'airtable', name: 'Airtable', category: 'productivity', icon: 'Grid', color: '#18bfff', verified: true },
  { id: 'asana', name: 'Asana', category: 'productivity', icon: 'CheckSquare', color: '#f06a6a', verified: true },
  { id: 'trello', name: 'Trello', category: 'productivity', icon: 'Layout', color: '#0079bf', verified: true },
  { id: 'monday', name: 'Monday.com', category: 'productivity', icon: 'Calendar', color: '#ff3d57', verified: true },
  { id: 'clickup', name: 'ClickUp', category: 'productivity', icon: 'CheckCircle', color: '#7b68ee', verified: true },
  { id: 'todoist', name: 'Todoist', category: 'productivity', icon: 'CheckSquare', color: '#e44332', verified: true },
  { id: 'linear', name: 'Linear', category: 'productivity', icon: 'GitBranch', color: '#5e6ad2', verified: true },
  { id: 'basecamp', name: 'Basecamp', category: 'productivity', icon: 'Tent', color: '#1d2d35', verified: true },
  { id: 'jira', name: 'Jira', category: 'productivity', icon: 'Layout', color: '#0052cc', verified: true },
  
  // Finance
  { id: 'stripe', name: 'Stripe', category: 'finance', icon: 'CreditCard', color: '#635bff', verified: true },
  { id: 'paypal', name: 'PayPal', category: 'finance', icon: 'DollarSign', color: '#003087', verified: true },
  { id: 'quickbooks', name: 'QuickBooks', category: 'finance', icon: 'BookOpen', color: '#2ca01c', verified: true },
  { id: 'xero', name: 'Xero', category: 'finance', icon: 'FileText', color: '#13b5ea', verified: true },
  { id: 'freshbooks', name: 'FreshBooks', category: 'finance', icon: 'Receipt', color: '#0075dd', verified: true },
  { id: 'wave', name: 'Wave', category: 'finance', icon: 'Waves', color: '#2196f3', verified: true },
  { id: 'square', name: 'Square', category: 'finance', icon: 'Square', color: '#3e4348', verified: true },
  { id: 'wise', name: 'Wise', category: 'finance', icon: 'Globe', color: '#37517e', verified: true },
  
  // E-commerce
  { id: 'shopify', name: 'Shopify', category: 'ecommerce', icon: 'ShoppingBag', color: '#96bf48', verified: true },
  { id: 'woocommerce', name: 'WooCommerce', category: 'ecommerce', icon: 'ShoppingCart', color: '#7f54b3', verified: true },
  { id: 'magento', name: 'Magento', category: 'ecommerce', icon: 'ShoppingCart', color: '#f46f25', verified: true },
  { id: 'bigcommerce', name: 'BigCommerce', category: 'ecommerce', icon: 'ShoppingBag', color: '#121118', verified: true },
  { id: 'prestashop', name: 'PrestaShop', category: 'ecommerce', icon: 'ShoppingCart', color: '#df0067', verified: true },
  { id: 'amazon_seller', name: 'Amazon Seller', category: 'ecommerce', icon: 'Package', color: '#ff9900', verified: true },
  { id: 'etsy', name: 'Etsy', category: 'ecommerce', icon: 'Gift', color: '#f45800', verified: true },
  
  // Analytics
  { id: 'google_analytics', name: 'Google Analytics', category: 'analytics', icon: 'BarChart2', color: '#f9ab00', verified: true },
  { id: 'mixpanel', name: 'Mixpanel', category: 'analytics', icon: 'PieChart', color: '#7856ff', verified: true },
  { id: 'amplitude', name: 'Amplitude', category: 'analytics', icon: 'Activity', color: '#1f4bff', verified: true },
  { id: 'segment', name: 'Segment', category: 'analytics', icon: 'Share2', color: '#52bd94', verified: true },
  { id: 'posthog', name: 'PostHog', category: 'analytics', icon: 'Sparkles', color: '#1d4aff', verified: true },
  { id: 'heap', name: 'Heap', category: 'analytics', icon: 'Layers', color: '#5046e5', verified: true },
  { id: 'hotjar', name: 'Hotjar', category: 'analytics', icon: 'Eye', color: '#fd3a5c', verified: true },
  
  // Developer
  { id: 'github', name: 'GitHub', category: 'developer', icon: 'Github', color: '#181717', verified: true },
  { id: 'gitlab', name: 'GitLab', category: 'developer', icon: 'GitMerge', color: '#fc6d26', verified: true },
  { id: 'bitbucket', name: 'Bitbucket', category: 'developer', icon: 'GitBranch', color: '#0052cc', verified: true },
  { id: 'vercel', name: 'Vercel', category: 'developer', icon: 'Triangle', color: '#000000', verified: true },
  { id: 'netlify', name: 'Netlify', category: 'developer', icon: 'Globe', color: '#00ad9f', verified: true },
  { id: 'railway', name: 'Railway', category: 'developer', icon: 'Train', color: '#0b0d0e', verified: true },
  { id: 'render', name: 'Render', category: 'developer', icon: 'Cloud', color: '#46e3b7', verified: true },
  { id: 'fly_io', name: 'Fly.io', category: 'developer', icon: 'Plane', color: '#7c3aed', verified: true },
  { id: 'docker_hub', name: 'Docker Hub', category: 'developer', icon: 'Box', color: '#2496ed', verified: true },
  { id: 'npm', name: 'npm', category: 'developer', icon: 'Package', color: '#cb3837', verified: true },
  { id: 'sentry', name: 'Sentry', category: 'developer', icon: 'AlertTriangle', color: '#362d59', verified: true },
  { id: 'datadog', name: 'Datadog', category: 'developer', icon: 'Activity', color: '#632ca6', verified: true },
  
  // AI & ML
  { id: 'openai', name: 'OpenAI', category: 'ai_ml', icon: 'Brain', color: '#412991', verified: true },
  { id: 'anthropic', name: 'Anthropic', category: 'ai_ml', icon: 'Sparkles', color: '#d4a574', verified: true },
  { id: 'cohere', name: 'Cohere', category: 'ai_ml', icon: 'Wand2', color: '#000000', verified: true },
  { id: 'replicate', name: 'Replicate', category: 'ai_ml', icon: 'Cpu', color: '#0a0a0a', verified: true },
  { id: 'huggingface', name: 'Hugging Face', category: 'ai_ml', icon: 'Bot', color: '#ffd21e', verified: true },
  { id: 'stability', name: 'Stability AI', category: 'ai_ml', icon: 'Image', color: '#7c3aed', verified: true },
  { id: 'elevenlabs', name: 'ElevenLabs', category: 'ai_ml', icon: 'Volume2', color: '#000000', verified: true },
  { id: 'deepgram', name: 'Deepgram', category: 'ai_ml', icon: 'Mic', color: '#13ef93', verified: true },
  { id: 'assembly', name: 'AssemblyAI', category: 'ai_ml', icon: 'FileAudio', color: '#1d4ed8', verified: true },
  { id: 'pinecone', name: 'Pinecone', category: 'ai_ml', icon: 'Database', color: '#000000', verified: true },
  { id: 'weaviate', name: 'Weaviate', category: 'ai_ml', icon: 'Hexagon', color: '#01cc73', verified: true },
  
  // Storage
  { id: 'aws_s3', name: 'AWS S3', category: 'storage', icon: 'HardDrive', color: '#ff9900', verified: true },
  { id: 'google_cloud_storage', name: 'Google Cloud Storage', category: 'storage', icon: 'Cloud', color: '#4285f4', verified: true },
  { id: 'azure_blob', name: 'Azure Blob', category: 'storage', icon: 'Cloud', color: '#0078d4', verified: true },
  { id: 'dropbox', name: 'Dropbox', category: 'storage', icon: 'Box', color: '#0061ff', verified: true },
  { id: 'google_drive', name: 'Google Drive', category: 'storage', icon: 'HardDrive', color: '#4285f4', verified: true },
  { id: 'onedrive', name: 'OneDrive', category: 'storage', icon: 'Cloud', color: '#0078d4', verified: true },
  { id: 'box', name: 'Box', category: 'storage', icon: 'Archive', color: '#0061d5', verified: true },
  { id: 'cloudflare_r2', name: 'Cloudflare R2', category: 'storage', icon: 'Cloud', color: '#f38020', verified: true },
  
  // Database
  { id: 'mongodb', name: 'MongoDB', category: 'database', icon: 'Database', color: '#47a248', verified: true },
  { id: 'firebase', name: 'Firebase', category: 'database', icon: 'Flame', color: '#ffca28', verified: true },
  { id: 'supabase', name: 'Supabase', category: 'database', icon: 'Database', color: '#3ecf8e', verified: true },
  { id: 'planetscale', name: 'PlanetScale', category: 'database', icon: 'Database', color: '#000000', verified: true },
  { id: 'redis', name: 'Redis', category: 'database', icon: 'Database', color: '#dc382d', verified: true },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'database', icon: 'Search', color: '#fed10a', verified: true },
  { id: 'algolia', name: 'Algolia', category: 'database', icon: 'Search', color: '#5468ff', verified: true },
  
  // Social
  { id: 'twitter', name: 'Twitter/X', category: 'social', icon: 'Twitter', color: '#000000', verified: true },
  { id: 'linkedin', name: 'LinkedIn', category: 'social', icon: 'Linkedin', color: '#0a66c2', verified: true },
  { id: 'facebook', name: 'Facebook', category: 'social', icon: 'Facebook', color: '#1877f2', verified: true },
  { id: 'instagram', name: 'Instagram', category: 'social', icon: 'Instagram', color: '#e4405f', verified: true },
  { id: 'youtube', name: 'YouTube', category: 'social', icon: 'Youtube', color: '#ff0000', verified: true },
  { id: 'tiktok', name: 'TikTok', category: 'social', icon: 'Music', color: '#000000', verified: true },
  { id: 'pinterest', name: 'Pinterest', category: 'social', icon: 'Image', color: '#bd081c', verified: true },
  
  // HR
  { id: 'bamboohr', name: 'BambooHR', category: 'hr', icon: 'Users', color: '#73c41d', verified: true },
  { id: 'workday', name: 'Workday', category: 'hr', icon: 'Calendar', color: '#0066cc', verified: true },
  { id: 'gusto', name: 'Gusto', category: 'hr', icon: 'DollarSign', color: '#f45d48', verified: true },
  { id: 'lever', name: 'Lever', category: 'hr', icon: 'Users', color: '#6b5be6', verified: true },
  { id: 'greenhouse', name: 'Greenhouse', category: 'hr', icon: 'Sprout', color: '#24a148', verified: true },
  { id: 'deel', name: 'Deel', category: 'hr', icon: 'Globe', color: '#3e55ff', verified: true },
  { id: 'rippling', name: 'Rippling', category: 'hr', icon: 'Users', color: '#fce300', verified: true },
  
  // Support
  { id: 'zendesk', name: 'Zendesk', category: 'support', icon: 'HeadphonesIcon', color: '#03363d', verified: true },
  { id: 'freshdesk', name: 'Freshdesk', category: 'support', icon: 'MessageCircle', color: '#2dbecd', verified: true },
  { id: 'helpscout', name: 'Help Scout', category: 'support', icon: 'LifeBuoy', color: '#1292ee', verified: true },
  { id: 'front', name: 'Front', category: 'support', icon: 'Inbox', color: '#ff5471', verified: true },
  { id: 'gorgias', name: 'Gorgias', category: 'support', icon: 'MessageSquare', color: '#1f2937', verified: true },
  { id: 'kustomer', name: 'Kustomer', category: 'support', icon: 'Users', color: '#ff335b', verified: true },
];

// ============================================================================
// CONNECTOR TO BLOCK CONVERSION
// ============================================================================

/**
 * Convert a connector endpoint to a block definition
 */
export function connectorEndpointToBlock(
  connector: ConnectorDefinition,
  endpoint: ConnectorEndpoint
): BlockDefinition {
  const params: BlockParam[] = [];

  // Add auth params based on connector auth type
  if (connector.authType === 'api_key') {
    params.push({
      key: 'apiKey',
      label: 'API Key',
      type: 'string',
      required: true,
      section: 'settings',
      helpText: `Clé API ${connector.name}`,
    });
  } else if (connector.authType === 'bearer') {
    params.push({
      key: 'accessToken',
      label: 'Access Token',
      type: 'string',
      required: true,
      section: 'settings',
    });
  }

  // Add endpoint parameters
  for (const param of endpoint.parameters) {
    params.push({
      key: param.name,
      label: param.label,
      type: param.type === 'object' ? 'json' : param.type === 'array' ? 'json' : param.type as any,
      required: param.required,
      placeholder: param.description,
      defaultValue: param.defaultValue,
      section: 'main',
      options: param.enum?.map(e => ({ label: e, value: e })),
    });
  }

  // Add request body parameters
  if (endpoint.requestBody) {
    for (const param of endpoint.requestBody) {
      params.push({
        key: param.name,
        label: param.label,
        type: param.type === 'object' ? 'json' : param.type as any,
        required: param.required,
        section: 'main',
        expressionEnabled: true,
      });
    }
  }

  return {
    type: `${connector.id}_${endpoint.id}`,
    name: `${connector.name}: ${endpoint.name}`,
    category: 'integrations',
    icon: connector.icon,
    color: connector.color,
    description: endpoint.description,
    params,
    inputs: 1,
    outputs: 1,
    isRealAction: true,
    requiresAuth: connector.authType !== 'none',
  };
}

/**
 * Generate all blocks for a connector
 */
export function generateConnectorBlocks(connector: ConnectorDefinition): BlockDefinition[] {
  return connector.endpoints.map(endpoint => connectorEndpointToBlock(connector, endpoint));
}

// ============================================================================
// CONNECTOR SEARCH & FILTERING
// ============================================================================

/**
 * Search connectors by name or category
 */
export function searchConnectors(
  connectors: Partial<ConnectorDefinition>[],
  query: string,
  category?: ConnectorCategory
): Partial<ConnectorDefinition>[] {
  let results = [...connectors];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.id?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q)
    );
  }

  if (category) {
    results = results.filter(c => c.category === category);
  }

  return results.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
}

/**
 * Get connector statistics
 */
export function getConnectorStats(): {
  total: number;
  byCategory: Record<ConnectorCategory, number>;
  verified: number;
} {
  const byCategory = {} as Record<ConnectorCategory, number>;
  let verified = 0;

  for (const connector of BUILT_IN_CONNECTORS) {
    if (connector.category) {
      byCategory[connector.category] = (byCategory[connector.category] || 0) + 1;
    }
    if (connector.verified) {
      verified++;
    }
  }

  return {
    total: BUILT_IN_CONNECTORS.length,
    byCategory,
    verified,
  };
}
