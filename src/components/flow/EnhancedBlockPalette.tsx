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
  BarChart2, Activity, LineChart, Workflow, Play, Headphones,
  Cpu, Layers, Settings2, Star, X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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

// Tab categories with icons
const TABS = [
  { id: 'all', name: 'Tous', icon: Layers },
  { id: 'trigger', name: 'Triggers', icon: Zap },
  { id: 'ai', name: 'IA', icon: Brain },
  { id: 'integration', name: 'Apps', icon: Cpu },
  { id: 'transform', name: 'Data', icon: Braces },
  { id: 'control', name: 'Flow', icon: GitBranch },
  { id: 'system', name: 'Actions', icon: Settings2 },
] as const;

// Integration subcategories
const INTEGRATION_SUBCATEGORIES: Record<string, { 
  name: string; 
  emoji: string;
  color: string;
  blocks: BlockType[] 
}> = {
  communication: {
    name: 'Communication',
    emoji: '💬',
    color: 'bg-blue-500',
    blocks: ['integration_telegram', 'integration_slack', 'integration_discord', 'integration_whatsapp', 'integration_teams', 'integration_intercom', 'integration_zendesk', 'integration_freshdesk', 'integration_crisp']
  },
  email: {
    name: 'Email',
    emoji: '📧',
    color: 'bg-rose-500',
    blocks: ['integration_sendgrid', 'integration_mailchimp', 'integration_brevo', 'integration_mailgun', 'integration_resend', 'integration_convertkit']
  },
  sms: {
    name: 'SMS & Téléphone',
    emoji: '📱',
    color: 'bg-green-500',
    blocks: ['integration_twilio_sms', 'integration_twilio_voice']
  },
  ai_providers: {
    name: 'IA & ML',
    emoji: '🤖',
    color: 'bg-purple-500',
    blocks: ['integration_openai', 'integration_anthropic', 'integration_google_ai', 'integration_mistral', 'integration_huggingface', 'integration_replicate', 'integration_stability', 'integration_elevenlabs', 'integration_deepgram', 'integration_assemblyai']
  },
  crm: {
    name: 'CRM & Ventes',
    emoji: '👥',
    color: 'bg-orange-500',
    blocks: ['integration_hubspot', 'integration_salesforce', 'integration_pipedrive', 'integration_zoho']
  },
  productivity: {
    name: 'Productivité',
    emoji: '📋',
    color: 'bg-indigo-500',
    blocks: ['integration_notion', 'integration_airtable', 'integration_google_sheets', 'integration_google_calendar', 'integration_trello', 'integration_asana', 'integration_monday', 'integration_clickup', 'integration_jira', 'integration_linear', 'integration_calendly']
  },
  storage: {
    name: 'Stockage',
    emoji: '💾',
    color: 'bg-cyan-500',
    blocks: ['integration_google_drive', 'integration_dropbox', 'integration_onedrive', 'integration_box', 'integration_aws_s3']
  },
  payments: {
    name: 'Paiements',
    emoji: '💳',
    color: 'bg-emerald-500',
    blocks: ['integration_stripe', 'integration_paypal', 'integration_shopify', 'integration_quickbooks']
  },
  social: {
    name: 'Réseaux Sociaux',
    emoji: '📱',
    color: 'bg-pink-500',
    blocks: ['integration_twitter', 'integration_linkedin', 'integration_facebook', 'integration_instagram', 'integration_youtube', 'integration_tiktok']
  },
  dev: {
    name: 'Développement',
    emoji: '💻',
    color: 'bg-gray-600',
    blocks: ['integration_github', 'integration_gitlab', 'integration_vercel', 'integration_supabase', 'integration_firebase']
  },
  analytics: {
    name: 'Analytics',
    emoji: '📊',
    color: 'bg-amber-500',
    blocks: ['integration_google_analytics', 'integration_mixpanel', 'integration_segment', 'integration_amplitude']
  },
  automation: {
    name: 'Automatisation',
    emoji: '⚡',
    color: 'bg-yellow-500',
    blocks: ['integration_zapier', 'integration_make', 'integration_n8n']
  },
  video: {
    name: 'Vidéo',
    emoji: '🎥',
    color: 'bg-red-500',
    blocks: ['integration_zoom', 'integration_loom']
  },
  http: {
    name: 'HTTP',
    emoji: '🌐',
    color: 'bg-slate-500',
    blocks: ['http_request', 'http_webhook']
  }
};

interface EnhancedBlockPaletteProps {
  onAddBlock: (type: BlockType) => void;
}

export function EnhancedBlockPalette({ onAddBlock }: EnhancedBlockPaletteProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedSubcats, setExpandedSubcats] = useState<Set<string>>(new Set(['communication', 'ai_providers', 'productivity']));

  const toggleSubcat = (key: string) => {
    setExpandedSubcats(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const allBlocks = Object.entries(BLOCK_DEFINITIONS) as [BlockType, typeof BLOCK_DEFINITIONS[BlockType]][];
  
  // Filter by search
  const searchFiltered = search
    ? allBlocks.filter(([_, def]) => 
        def.name.toLowerCase().includes(search.toLowerCase()) ||
        def.description.toLowerCase().includes(search.toLowerCase())
      )
    : allBlocks;

  // Filter by active tab
  const tabFiltered = activeTab === 'all' 
    ? searchFiltered 
    : searchFiltered.filter(([_, def]) => def.category === activeTab);

  // Get blocks by subcategory for integrations
  const getIntegrationBlocks = () => {
    const integrationBlocks = tabFiltered.filter(([_, def]) => def.category === 'integration');
    const grouped: Record<string, [BlockType, typeof BLOCK_DEFINITIONS[BlockType]][]> = {};
    
    for (const [subcatKey, subcat] of Object.entries(INTEGRATION_SUBCATEGORIES)) {
      const blocks = integrationBlocks.filter(([type]) => subcat.blocks.includes(type));
      if (blocks.length > 0) {
        grouped[subcatKey] = blocks;
      }
    }
    return grouped;
  };

  // Get non-integration blocks
  const nonIntegrationBlocks = tabFiltered.filter(([_, def]) => def.category !== 'integration');

  const renderBlockButton = (type: BlockType, def: typeof BLOCK_DEFINITIONS[BlockType], compact = false) => {
    const Icon = iconMap[def.icon] || Sparkles;
    return (
      <button
        key={type}
        onClick={() => onAddBlock(type)}
        className={cn(
          "w-full rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left flex items-center gap-3",
          compact ? "p-2" : "p-3"
        )}
        title={def.description}
      >
        <div className={cn(
          "rounded-lg bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm",
          def.color,
          compact ? "w-8 h-8" : "w-10 h-10"
        )}>
          <Icon className={cn("text-white", compact ? "w-4 h-4" : "w-5 h-5")} />
        </div>
        <div className="flex-1 min-w-0">
          <span className={cn("font-medium text-foreground block truncate", compact ? "text-xs" : "text-sm")}>
            {def.name}
          </span>
          {!compact && (
            <span className="text-xs text-muted-foreground truncate block">
              {def.description}
            </span>
          )}
        </div>
        <Plus className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </button>
    );
  };

  const integrationGroups = activeTab === 'all' || activeTab === 'integration' ? getIntegrationBlocks() : {};
  const showIntegrations = Object.keys(integrationGroups).length > 0;

  return (
    <aside className="w-72 lg:w-80 border-l border-border bg-card flex flex-col overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un bloc..."
            className="pl-10 pr-8 h-10 bg-background"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {search && (
          <p className="text-xs text-muted-foreground mt-2">
            {tabFiltered.length} résultat{tabFiltered.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Blocks Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Popular blocks when showing all */}
          {activeTab === 'all' && !search && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  Populaires
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['trigger_text', 'trigger_file', 'ai_summary', 'ai_generate', 'system_email', 'system_save'] as BlockType[]).map((type) => {
                  const def = BLOCK_DEFINITIONS[type];
                  const Icon = iconMap[def.icon] || Sparkles;
                  return (
                    <button
                      key={type}
                      onClick={() => onAddBlock(type)}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${def.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-foreground truncate">
                        {def.name.replace('AI ', '').replace('Send ', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Non-integration blocks */}
          {nonIntegrationBlocks.length > 0 && (
            <div className="space-y-2">
              {(activeTab !== 'all' && activeTab !== 'integration') && (
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${CATEGORY_INFO[activeTab as BlockCategory]?.color || 'bg-primary'}`} />
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    {CATEGORY_INFO[activeTab as BlockCategory]?.name || activeTab}
                  </span>
                  <span className="text-xs text-muted-foreground">({nonIntegrationBlocks.length})</span>
                </div>
              )}
              {nonIntegrationBlocks.map(([type, def]) => renderBlockButton(type, def, search !== ''))}
            </div>
          )}

          {/* Integration blocks grouped by subcategory */}
          {showIntegrations && (
            <div className="space-y-3">
              {activeTab === 'all' && !search && (
                <div className="flex items-center gap-2 pt-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Applications
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({Object.values(integrationGroups).flat().length})
                  </span>
                </div>
              )}
              
              {Object.entries(integrationGroups).map(([subcatKey, blocks]) => {
                const subcat = INTEGRATION_SUBCATEGORIES[subcatKey];
                const isExpanded = expandedSubcats.has(subcatKey) || search !== '';
                
                return (
                  <div key={subcatKey} className="border border-border rounded-lg overflow-hidden bg-background/50">
                    <button
                      onClick={() => toggleSubcat(subcatKey)}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{subcat.emoji}</span>
                        <span className="text-sm font-medium text-foreground">
                          {subcat.name}
                        </span>
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {blocks.length}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="p-2 pt-0 space-y-1.5 border-t border-border">
                        {blocks.map(([type, def]) => renderBlockButton(type, def, true))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tabFiltered.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Aucun bloc trouvé</p>
              <p className="text-xs text-muted-foreground mt-1">Essayez un autre terme de recherche</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Tab Bar at Bottom */}
      <div className="border-t border-border bg-muted/30 p-2">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = tab.id === 'all' 
              ? allBlocks.length 
              : allBlocks.filter(([_, def]) => def.category === tab.id).length;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all flex-1 min-w-0",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-medium truncate">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
