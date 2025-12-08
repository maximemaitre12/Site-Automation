import { useState, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BLOCK_DEFINITIONS, BlockType } from '@/types/workflow';
import { cn } from '@/lib/utils';
import { 
  Search, X, Zap, Brain, Sparkles, GitBranch, Settings2, Layers,
  Type, FileUp, Globe, ClipboardList, FileSearch, Tags, Wand2, Mail, 
  Send, Database, Clock, Eye, Heart, Languages, Braces, Filter, 
  ArrowRightLeft, Combine, Repeat, Timer, GitFork, Bell, FileText, 
  MessageSquare, MessageCircle, Phone, Table, Image, Volume2, Mic, 
  Users, Cloud, TrendingUp, Calendar, Columns, CheckSquare, Bug, 
  HardDrive, Box, CreditCard, ShoppingCart, Calculator, Twitter, 
  Linkedin, Facebook, Instagram, Youtube, Video, Github, Gitlab, 
  Triangle, Flame, BarChart3, BarChart2, Activity, LineChart, 
  Workflow, Play, Headphones
} from 'lucide-react';

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

// Categories organized by service/company name
const BLOCK_CATEGORIES = [
  {
    id: 'triggers',
    name: 'Déclencheurs',
    icon: Zap,
    color: 'bg-blue-500',
    blocks: ['trigger_text', 'trigger_file', 'trigger_webhook', 'trigger_form', 'trigger_schedule', 'trigger_email'] as BlockType[]
  },
  {
    id: 'ai_builtin',
    name: 'IA AETHER',
    icon: Sparkles,
    color: 'bg-violet-500',
    blocks: ['ai_summary', 'ai_extract', 'ai_classify', 'ai_generate', 'ai_decision', 'ai_translate', 'ai_sentiment', 'ai_vision'] as BlockType[]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: Brain,
    color: 'bg-emerald-600',
    blocks: ['integration_openai'] as BlockType[]
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: Brain,
    color: 'bg-orange-500',
    blocks: ['integration_anthropic'] as BlockType[]
  },
  {
    id: 'google_ai',
    name: 'Google AI',
    icon: Brain,
    color: 'bg-blue-500',
    blocks: ['integration_google_ai'] as BlockType[]
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    icon: Brain,
    color: 'bg-orange-600',
    blocks: ['integration_mistral'] as BlockType[]
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: Brain,
    color: 'bg-yellow-500',
    blocks: ['integration_huggingface'] as BlockType[]
  },
  {
    id: 'replicate',
    name: 'Replicate',
    icon: Brain,
    color: 'bg-gray-700',
    blocks: ['integration_replicate'] as BlockType[]
  },
  {
    id: 'stability',
    name: 'Stability AI',
    icon: Image,
    color: 'bg-purple-600',
    blocks: ['integration_stability'] as BlockType[]
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    icon: Volume2,
    color: 'bg-gray-800',
    blocks: ['integration_elevenlabs'] as BlockType[]
  },
  {
    id: 'deepgram',
    name: 'Deepgram',
    icon: Mic,
    color: 'bg-green-600',
    blocks: ['integration_deepgram'] as BlockType[]
  },
  {
    id: 'assemblyai',
    name: 'AssemblyAI',
    icon: Mic,
    color: 'bg-blue-700',
    blocks: ['integration_assemblyai'] as BlockType[]
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: MessageSquare,
    color: 'bg-purple-500',
    blocks: ['integration_slack'] as BlockType[]
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: MessageCircle,
    color: 'bg-indigo-500',
    blocks: ['integration_discord'] as BlockType[]
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: Send,
    color: 'bg-sky-500',
    blocks: ['integration_telegram'] as BlockType[]
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-500',
    blocks: ['integration_whatsapp'] as BlockType[]
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    icon: MessageSquare,
    color: 'bg-violet-600',
    blocks: ['integration_teams'] as BlockType[]
  },
  {
    id: 'intercom',
    name: 'Intercom',
    icon: MessageSquare,
    color: 'bg-blue-500',
    blocks: ['integration_intercom'] as BlockType[]
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    icon: Headphones,
    color: 'bg-green-600',
    blocks: ['integration_zendesk'] as BlockType[]
  },
  {
    id: 'freshdesk',
    name: 'Freshdesk',
    icon: Headphones,
    color: 'bg-green-500',
    blocks: ['integration_freshdesk'] as BlockType[]
  },
  {
    id: 'crisp',
    name: 'Crisp',
    icon: MessageCircle,
    color: 'bg-purple-600',
    blocks: ['integration_crisp'] as BlockType[]
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    icon: Mail,
    color: 'bg-blue-500',
    blocks: ['integration_sendgrid'] as BlockType[]
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    icon: Mail,
    color: 'bg-yellow-500',
    blocks: ['integration_mailchimp'] as BlockType[]
  },
  {
    id: 'brevo',
    name: 'Brevo',
    icon: Mail,
    color: 'bg-blue-600',
    blocks: ['integration_brevo'] as BlockType[]
  },
  {
    id: 'mailgun',
    name: 'Mailgun',
    icon: Mail,
    color: 'bg-red-600',
    blocks: ['integration_mailgun'] as BlockType[]
  },
  {
    id: 'resend',
    name: 'Resend',
    icon: Mail,
    color: 'bg-gray-800',
    blocks: ['integration_resend'] as BlockType[]
  },
  {
    id: 'convertkit',
    name: 'ConvertKit',
    icon: Mail,
    color: 'bg-rose-500',
    blocks: ['integration_convertkit'] as BlockType[]
  },
  {
    id: 'twilio',
    name: 'Twilio',
    icon: Phone,
    color: 'bg-red-500',
    blocks: ['integration_twilio_sms', 'integration_twilio_voice'] as BlockType[]
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: Users,
    color: 'bg-orange-500',
    blocks: ['integration_hubspot'] as BlockType[]
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    icon: Cloud,
    color: 'bg-blue-600',
    blocks: ['integration_salesforce'] as BlockType[]
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    icon: TrendingUp,
    color: 'bg-green-600',
    blocks: ['integration_pipedrive'] as BlockType[]
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    icon: Users,
    color: 'bg-red-600',
    blocks: ['integration_zoho'] as BlockType[]
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: FileText,
    color: 'bg-gray-800',
    blocks: ['integration_notion'] as BlockType[]
  },
  {
    id: 'airtable',
    name: 'Airtable',
    icon: Table,
    color: 'bg-yellow-500',
    blocks: ['integration_airtable'] as BlockType[]
  },
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    icon: Table,
    color: 'bg-green-500',
    blocks: ['integration_google_sheets'] as BlockType[]
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    icon: Calendar,
    color: 'bg-blue-500',
    blocks: ['integration_google_calendar'] as BlockType[]
  },
  {
    id: 'trello',
    name: 'Trello',
    icon: Columns,
    color: 'bg-blue-500',
    blocks: ['integration_trello'] as BlockType[]
  },
  {
    id: 'asana',
    name: 'Asana',
    icon: CheckSquare,
    color: 'bg-rose-500',
    blocks: ['integration_asana'] as BlockType[]
  },
  {
    id: 'monday',
    name: 'Monday.com',
    icon: Columns,
    color: 'bg-red-500',
    blocks: ['integration_monday'] as BlockType[]
  },
  {
    id: 'clickup',
    name: 'ClickUp',
    icon: CheckSquare,
    color: 'bg-purple-600',
    blocks: ['integration_clickup'] as BlockType[]
  },
  {
    id: 'jira',
    name: 'Jira',
    icon: Bug,
    color: 'bg-blue-600',
    blocks: ['integration_jira'] as BlockType[]
  },
  {
    id: 'linear',
    name: 'Linear',
    icon: Zap,
    color: 'bg-purple-700',
    blocks: ['integration_linear'] as BlockType[]
  },
  {
    id: 'calendly',
    name: 'Calendly',
    icon: Calendar,
    color: 'bg-blue-500',
    blocks: ['integration_calendly'] as BlockType[]
  },
  {
    id: 'google_drive',
    name: 'Google Drive',
    icon: HardDrive,
    color: 'bg-yellow-500',
    blocks: ['integration_google_drive'] as BlockType[]
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: HardDrive,
    color: 'bg-blue-500',
    blocks: ['integration_dropbox'] as BlockType[]
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: Cloud,
    color: 'bg-blue-600',
    blocks: ['integration_onedrive'] as BlockType[]
  },
  {
    id: 'box',
    name: 'Box',
    icon: Box,
    color: 'bg-blue-700',
    blocks: ['integration_box'] as BlockType[]
  },
  {
    id: 'aws_s3',
    name: 'AWS S3',
    icon: Database,
    color: 'bg-orange-500',
    blocks: ['integration_aws_s3'] as BlockType[]
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: CreditCard,
    color: 'bg-purple-600',
    blocks: ['integration_stripe'] as BlockType[]
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: CreditCard,
    color: 'bg-blue-700',
    blocks: ['integration_paypal'] as BlockType[]
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: ShoppingCart,
    color: 'bg-green-600',
    blocks: ['integration_shopify'] as BlockType[]
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    icon: Calculator,
    color: 'bg-green-700',
    blocks: ['integration_quickbooks'] as BlockType[]
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: Twitter,
    color: 'bg-gray-800',
    blocks: ['integration_twitter'] as BlockType[]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700',
    blocks: ['integration_linkedin'] as BlockType[]
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    blocks: ['integration_facebook'] as BlockType[]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'bg-pink-500',
    blocks: ['integration_instagram'] as BlockType[]
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: 'bg-red-600',
    blocks: ['integration_youtube'] as BlockType[]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: Video,
    color: 'bg-gray-900',
    blocks: ['integration_tiktok'] as BlockType[]
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    color: 'bg-gray-800',
    blocks: ['integration_github'] as BlockType[]
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    icon: Gitlab,
    color: 'bg-orange-600',
    blocks: ['integration_gitlab'] as BlockType[]
  },
  {
    id: 'vercel',
    name: 'Vercel',
    icon: Triangle,
    color: 'bg-gray-900',
    blocks: ['integration_vercel'] as BlockType[]
  },
  {
    id: 'supabase',
    name: 'Supabase',
    icon: Database,
    color: 'bg-emerald-600',
    blocks: ['integration_supabase'] as BlockType[]
  },
  {
    id: 'firebase',
    name: 'Firebase',
    icon: Flame,
    color: 'bg-yellow-500',
    blocks: ['integration_firebase'] as BlockType[]
  },
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    icon: BarChart3,
    color: 'bg-orange-500',
    blocks: ['integration_google_analytics'] as BlockType[]
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    icon: BarChart2,
    color: 'bg-purple-600',
    blocks: ['integration_mixpanel'] as BlockType[]
  },
  {
    id: 'segment',
    name: 'Segment',
    icon: Activity,
    color: 'bg-green-600',
    blocks: ['integration_segment'] as BlockType[]
  },
  {
    id: 'amplitude',
    name: 'Amplitude',
    icon: LineChart,
    color: 'bg-blue-600',
    blocks: ['integration_amplitude'] as BlockType[]
  },
  {
    id: 'zapier',
    name: 'Zapier',
    icon: Zap,
    color: 'bg-orange-500',
    blocks: ['integration_zapier'] as BlockType[]
  },
  {
    id: 'make',
    name: 'Make',
    icon: Workflow,
    color: 'bg-purple-600',
    blocks: ['integration_make'] as BlockType[]
  },
  {
    id: 'n8n',
    name: 'n8n',
    icon: GitBranch,
    color: 'bg-red-600',
    blocks: ['integration_n8n'] as BlockType[]
  },
  {
    id: 'zoom',
    name: 'Zoom',
    icon: Video,
    color: 'bg-blue-500',
    blocks: ['integration_zoom'] as BlockType[]
  },
  {
    id: 'loom',
    name: 'Loom',
    icon: Video,
    color: 'bg-purple-500',
    blocks: ['integration_loom'] as BlockType[]
  },
  {
    id: 'http',
    name: 'HTTP / API',
    icon: Globe,
    color: 'bg-slate-600',
    blocks: ['http_request', 'http_webhook'] as BlockType[]
  },
  {
    id: 'transform',
    name: 'Transformation',
    icon: Braces,
    color: 'bg-emerald-500',
    blocks: ['transform_json', 'transform_filter', 'transform_map', 'transform_merge'] as BlockType[]
  },
  {
    id: 'control',
    name: 'Contrôle de flux',
    icon: GitBranch,
    color: 'bg-amber-500',
    blocks: ['control_condition', 'control_loop', 'control_delay', 'control_parallel', 'control_branch', 'control_merge', 'workflow_call'] as BlockType[]
  },
  {
    id: 'system',
    name: 'Actions système',
    icon: Settings2,
    color: 'bg-slate-500',
    blocks: ['system_email', 'system_webhook', 'system_save', 'system_notify', 'system_log'] as BlockType[]
  },
];

// Quick filter tabs
const QUICK_FILTERS = [
  { id: 'all', name: 'Tous', icon: Layers },
  { id: 'ai', name: 'IA', icon: Brain },
  { id: 'communication', name: 'Chat', icon: MessageSquare },
  { id: 'crm', name: 'CRM', icon: Users },
  { id: 'productivity', name: 'Productivité', icon: CheckSquare },
  { id: 'social', name: 'Social', icon: Instagram },
];

const FILTER_CATEGORIES: Record<string, string[]> = {
  ai: ['ai_builtin', 'openai', 'anthropic', 'google_ai', 'mistral', 'huggingface', 'replicate', 'stability', 'elevenlabs', 'deepgram', 'assemblyai'],
  communication: ['slack', 'discord', 'telegram', 'whatsapp', 'teams', 'intercom', 'zendesk', 'freshdesk', 'crisp'],
  crm: ['hubspot', 'salesforce', 'pipedrive', 'zoho'],
  productivity: ['notion', 'airtable', 'google_sheets', 'google_calendar', 'trello', 'asana', 'monday', 'clickup', 'jira', 'linear', 'calendly'],
  social: ['twitter', 'linkedin', 'facebook', 'instagram', 'youtube', 'tiktok'],
};

interface BlockPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (type: BlockType) => void;
}

export function BlockPickerDialog({ isOpen, onClose, onAddBlock }: BlockPickerDialogProps) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCategories = useMemo(() => {
    let categories = BLOCK_CATEGORIES;

    // Filter by quick filter
    if (activeFilter !== 'all' && FILTER_CATEGORIES[activeFilter]) {
      categories = categories.filter(cat => FILTER_CATEGORIES[activeFilter].includes(cat.id));
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      categories = categories.map(cat => {
        const matchingBlocks = cat.blocks.filter(blockType => {
          const def = BLOCK_DEFINITIONS[blockType];
          return def && (
            def.name.toLowerCase().includes(searchLower) ||
            def.description.toLowerCase().includes(searchLower) ||
            cat.name.toLowerCase().includes(searchLower)
          );
        });
        return { ...cat, blocks: matchingBlocks };
      }).filter(cat => cat.blocks.length > 0);
    }

    return categories;
  }, [search, activeFilter]);

  const totalResults = filteredCategories.reduce((acc, cat) => acc + cat.blocks.length, 0);

  const handleSelect = (type: BlockType) => {
    onAddBlock(type);
    onClose();
    setSearch('');
    setActiveFilter('all');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0 overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une application ou un bloc..."
              className="pl-12 pr-10 h-12 text-base bg-background"
              autoFocus
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Quick Filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {QUICK_FILTERS.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {filter.name}
                </button>
              );
            })}
          </div>
          
          {search && (
            <p className="text-sm text-muted-foreground mt-3">
              {totalResults} résultat{totalResults > 1 ? 's' : ''} pour "{search}"
            </p>
          )}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 h-[calc(85vh-140px)]">
          <div className="p-4 space-y-6">
            {filteredCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", category.color)}>
                      <CategoryIcon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {category.blocks.length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {category.blocks.map((blockType) => {
                      const def = BLOCK_DEFINITIONS[blockType];
                      if (!def) return null;
                      
                      const Icon = iconMap[def.icon] || Sparkles;
                      
                      return (
                        <button
                          key={blockType}
                          onClick={() => handleSelect(blockType)}
                          className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm",
                            def.color
                          )}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-foreground block truncate">
                              {def.name}
                            </span>
                            <span className="text-xs text-muted-foreground truncate block">
                              {def.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Aucun bloc trouvé</p>
                <p className="text-sm text-muted-foreground mt-1">Essayez un autre terme de recherche</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
