import { useState } from 'react';
import { BLOCK_DEFINITIONS, BlockType, BlockCategory, CATEGORY_INFO } from '@/types/workflow';
import { 
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch, 
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, Search, ChevronDown,
  ChevronRight, Plus, MessageSquare, MessageCircle, Phone, Table,
  Brain, Image, Volume2, Mic, Users, Cloud, TrendingUp, Calendar,
  Columns, CheckSquare, Bug, Zap, HardDrive, Box, CreditCard,
  ShoppingCart, Calculator, Twitter, Linkedin, Facebook, Instagram,
  Youtube, Video, Github, Gitlab, Triangle, Flame, BarChart3,
  BarChart2, Activity, LineChart, Workflow, Play, Headphones
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type, FileUp, Globe, ClipboardList, Sparkles, FileSearch,
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, MessageSquare, MessageCircle, 
  Phone, Table, Brain, Image, Volume2, Mic, Users, Cloud, TrendingUp,
  Calendar, Columns, CheckSquare, Bug, Zap, HardDrive, Box, CreditCard,
  ShoppingCart, Calculator, Twitter, Linkedin, Facebook, Instagram,
  Youtube, Video, Github, Gitlab, Triangle, Flame, BarChart3, BarChart2,
  Activity, LineChart, Workflow, Play, Headphones
};

// Integration subcategories for better organization
const INTEGRATION_SUBCATEGORIES: Record<string, { 
  name: string; 
  icon: string; 
  color: string;
  blocks: BlockType[] 
}> = {
  communication: {
    name: '💬 Communication',
    icon: 'MessageSquare',
    color: 'bg-blue-500',
    blocks: ['integration_telegram', 'integration_slack', 'integration_discord', 'integration_whatsapp', 'integration_teams', 'integration_intercom', 'integration_zendesk', 'integration_freshdesk', 'integration_crisp']
  },
  email: {
    name: '📧 Email Marketing',
    icon: 'Mail',
    color: 'bg-rose-500',
    blocks: ['integration_sendgrid', 'integration_mailchimp', 'integration_brevo', 'integration_mailgun', 'integration_resend', 'integration_convertkit']
  },
  sms: {
    name: '📱 SMS & Téléphone',
    icon: 'Phone',
    color: 'bg-green-500',
    blocks: ['integration_twilio_sms', 'integration_twilio_voice']
  },
  ai_providers: {
    name: '🤖 IA & Machine Learning',
    icon: 'Brain',
    color: 'bg-purple-500',
    blocks: ['integration_openai', 'integration_anthropic', 'integration_google_ai', 'integration_mistral', 'integration_huggingface', 'integration_replicate', 'integration_stability', 'integration_elevenlabs', 'integration_deepgram', 'integration_assemblyai']
  },
  crm: {
    name: '👥 CRM & Ventes',
    icon: 'Users',
    color: 'bg-orange-500',
    blocks: ['integration_hubspot', 'integration_salesforce', 'integration_pipedrive', 'integration_zoho']
  },
  productivity: {
    name: '📋 Productivité',
    icon: 'CheckSquare',
    color: 'bg-indigo-500',
    blocks: ['integration_notion', 'integration_airtable', 'integration_google_sheets', 'integration_google_calendar', 'integration_trello', 'integration_asana', 'integration_monday', 'integration_clickup', 'integration_jira', 'integration_linear', 'integration_calendly']
  },
  storage: {
    name: '💾 Stockage & Fichiers',
    icon: 'HardDrive',
    color: 'bg-cyan-500',
    blocks: ['integration_google_drive', 'integration_dropbox', 'integration_onedrive', 'integration_box', 'integration_aws_s3']
  },
  payments: {
    name: '💳 Paiements & Finance',
    icon: 'CreditCard',
    color: 'bg-emerald-500',
    blocks: ['integration_stripe', 'integration_paypal', 'integration_shopify', 'integration_quickbooks']
  },
  social: {
    name: '📱 Réseaux Sociaux',
    icon: 'Instagram',
    color: 'bg-pink-500',
    blocks: ['integration_twitter', 'integration_linkedin', 'integration_facebook', 'integration_instagram', 'integration_youtube', 'integration_tiktok']
  },
  dev: {
    name: '💻 Développement',
    icon: 'Github',
    color: 'bg-gray-600',
    blocks: ['integration_github', 'integration_gitlab', 'integration_vercel', 'integration_supabase', 'integration_firebase']
  },
  analytics: {
    name: '📊 Analytics',
    icon: 'BarChart3',
    color: 'bg-amber-500',
    blocks: ['integration_google_analytics', 'integration_mixpanel', 'integration_segment', 'integration_amplitude']
  },
  automation: {
    name: '⚡ Automatisation',
    icon: 'Zap',
    color: 'bg-yellow-500',
    blocks: ['integration_zapier', 'integration_make', 'integration_n8n']
  },
  video: {
    name: '🎥 Vidéo & Réunions',
    icon: 'Video',
    color: 'bg-red-500',
    blocks: ['integration_zoom', 'integration_loom']
  },
  http: {
    name: '🌐 HTTP & Webhooks',
    icon: 'Globe',
    color: 'bg-slate-500',
    blocks: ['http_request', 'http_webhook']
  }
};

interface EnhancedBlockPaletteProps {
  onAddBlock: (type: BlockType) => void;
}

export function EnhancedBlockPalette({ onAddBlock }: EnhancedBlockPaletteProps) {
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['trigger', 'ai', 'system'])
  );
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const toggleSubcategory = (subcategory: string) => {
    setExpandedSubcategories(prev => {
      const next = new Set(prev);
      if (next.has(subcategory)) next.delete(subcategory);
      else next.add(subcategory);
      return next;
    });
  };

  const allBlocks = Object.entries(BLOCK_DEFINITIONS) as [BlockType, typeof BLOCK_DEFINITIONS[BlockType]][];
  
  const filteredBlocks = search
    ? allBlocks.filter(([_, def]) => 
        def.name.toLowerCase().includes(search.toLowerCase()) ||
        def.description.toLowerCase().includes(search.toLowerCase())
      )
    : allBlocks;

  // Group non-integration blocks by category
  const nonIntegrationBlocks = filteredBlocks.filter(([_, def]) => def.category !== 'integration');
  const blocksByCategory = nonIntegrationBlocks.reduce((acc, [type, def]) => {
    if (!acc[def.category]) acc[def.category] = [];
    acc[def.category].push([type, def] as const);
    return acc;
  }, {} as Record<BlockCategory, [BlockType, typeof BLOCK_DEFINITIONS[BlockType]][]>);

  // Get integration blocks organized by subcategory
  const integrationBlocks = filteredBlocks.filter(([_, def]) => def.category === 'integration');
  const getSubcategoryBlocks = (subcatKey: string) => {
    const subcat = INTEGRATION_SUBCATEGORIES[subcatKey];
    return integrationBlocks.filter(([type]) => subcat.blocks.includes(type));
  };

  const baseCategories: BlockCategory[] = ['trigger', 'ai', 'transform', 'control'];
  const quickBlocks: BlockType[] = ['trigger_text', 'trigger_file', 'ai_summary', 'ai_extract', 'system_email', 'system_save'];

  const renderBlockButton = (type: BlockType, def: typeof BLOCK_DEFINITIONS[BlockType]) => {
    const Icon = iconMap[def.icon] || Sparkles;
    return (
      <button
        key={type}
        onClick={() => onAddBlock(type)}
        className="w-full p-2 lg:p-2.5 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left flex items-center gap-2 lg:gap-3"
        title={def.description}
      >
        <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-md lg:rounded-lg bg-gradient-to-br ${def.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
          <Icon className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs lg:text-sm font-medium text-foreground block truncate">
            {def.name}
          </span>
          <span className="text-[10px] lg:text-xs text-muted-foreground truncate block hidden lg:block">
            {def.description}
          </span>
        </div>
        <Plus className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </button>
    );
  };

  return (
    <aside className="w-56 lg:w-72 border-l border-border bg-card/50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 lg:p-4 border-b border-border">
        <h3 className="text-xs lg:text-sm font-semibold text-foreground mb-2 lg:mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter des blocs
        </h3>
        <div className="relative">
          <Search className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="pl-8 lg:pl-9 h-8 lg:h-9 text-sm"
          />
        </div>
      </div>

      {/* Quick add section */}
      {!search && (
        <div className="p-3 lg:p-4 border-b border-border bg-primary/5">
          <h4 className="text-[10px] lg:text-xs font-medium text-primary mb-2 uppercase tracking-wide">
            ⚡ Blocs populaires
          </h4>
          <div className="grid grid-cols-2 gap-1.5">
            {quickBlocks.map((type) => {
              const def = BLOCK_DEFINITIONS[type];
              const Icon = iconMap[def.icon] || Sparkles;
              return (
                <button
                  key={type}
                  onClick={() => onAddBlock(type)}
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                >
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${def.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[10px] lg:text-xs font-medium text-foreground truncate">
                    {def.name.replace('AI ', '').replace('Entrée ', '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Blocks list */}
      <ScrollArea className="flex-1">
        <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
          {/* Base categories (trigger, ai, transform, control) */}
          {baseCategories.map(category => {
            const blocks = blocksByCategory[category] || [];
            const info = CATEGORY_INFO[category];
            const isExpanded = expandedCategories.has(category);

            if (blocks.length === 0) return null;

            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between py-1.5 lg:py-2 px-1 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-1.5 lg:gap-2">
                    <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${info.color}`} />
                    <span className="text-[10px] lg:text-xs font-medium text-foreground uppercase tracking-wide">
                      {info.name}
                    </span>
                    <span className="text-[10px] lg:text-xs text-muted-foreground">
                      ({blocks.length})
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="space-y-1 mt-1.5 lg:mt-2">
                    {blocks.map(([type, def]) => renderBlockButton(type, def))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Integrations section with subcategories */}
          {integrationBlocks.length > 0 && (
            <div>
              <button
                onClick={() => toggleCategory('integration')}
                className="w-full flex items-center justify-between py-1.5 lg:py-2 px-1 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-blue-600" />
                  <span className="text-[10px] lg:text-xs font-medium text-foreground uppercase tracking-wide">
                    🔌 Intégrations
                  </span>
                  <span className="text-[10px] lg:text-xs text-muted-foreground">
                    ({integrationBlocks.length})
                  </span>
                </div>
                {expandedCategories.has('integration') ? (
                  <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                )}
              </button>

              {expandedCategories.has('integration') && (
                <div className="mt-2 space-y-1">
                  {Object.entries(INTEGRATION_SUBCATEGORIES).map(([subcatKey, subcat]) => {
                    const subcatBlocks = getSubcategoryBlocks(subcatKey);
                    if (subcatBlocks.length === 0) return null;

                    const isSubcatExpanded = expandedSubcategories.has(subcatKey);

                    return (
                      <div key={subcatKey} className="ml-2">
                        <button
                          onClick={() => toggleSubcategory(subcatKey)}
                          className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-muted/30 rounded-md transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${subcat.color}`} />
                            <span className="text-[10px] lg:text-xs font-medium text-foreground">
                              {subcat.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              ({subcatBlocks.length})
                            </span>
                          </div>
                          {isSubcatExpanded ? (
                            <ChevronDown className="w-3 h-3 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-muted-foreground" />
                          )}
                        </button>

                        {isSubcatExpanded && (
                          <div className="space-y-1 mt-1 ml-2">
                            {subcatBlocks.map(([type, def]) => renderBlockButton(type, def))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* System category */}
          {blocksByCategory['system']?.length > 0 && (
            <div>
              <button
                onClick={() => toggleCategory('system')}
                className="w-full flex items-center justify-between py-1.5 lg:py-2 px-1 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${CATEGORY_INFO['system'].color}`} />
                  <span className="text-[10px] lg:text-xs font-medium text-foreground uppercase tracking-wide">
                    {CATEGORY_INFO['system'].name}
                  </span>
                  <span className="text-[10px] lg:text-xs text-muted-foreground">
                    ({blocksByCategory['system'].length})
                  </span>
                </div>
                {expandedCategories.has('system') ? (
                  <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
                )}
              </button>

              {expandedCategories.has('system') && (
                <div className="space-y-1 mt-1.5 lg:mt-2">
                  {blocksByCategory['system'].map(([type, def]) => renderBlockButton(type, def))}
                </div>
              )}
            </div>
          )}

          {filteredBlocks.length === 0 && (
            <div className="text-center py-6 lg:py-8">
              <Search className="w-6 h-6 lg:w-8 lg:h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs lg:text-sm text-muted-foreground">Aucun bloc trouvé</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick tip */}
      <div className="p-3 lg:p-4 border-t border-border bg-muted/30">
        <p className="text-[10px] lg:text-xs text-muted-foreground">
          💡 Cliquez pour ajouter, puis configurez le bloc sélectionné
        </p>
      </div>
    </aside>
  );
}
