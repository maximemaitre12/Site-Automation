import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BLOCK_DEFINITIONS, BlockType } from '@/types/workflow';
import { cn } from '@/lib/utils';
import { 
  Search, X, Zap, Brain, Sparkles, GitBranch, Settings2,
  FileUp, Globe, Mail, Send, Database, Clock, 
  Languages, Braces, Filter, ArrowRightLeft, Combine, 
  Timer, GitFork, Bell, FileText, MessageSquare, MessageCircle, 
  Phone, Table, Image, Volume2, Mic, Users, Cloud, TrendingUp, 
  Calendar, Columns, CheckSquare, Bug, HardDrive, Box, CreditCard, 
  ShoppingCart, Calculator, Linkedin, Facebook, Instagram, Youtube, 
  Video, Github, Gitlab, Triangle, Flame, BarChart3, BarChart2, 
  Activity, LineChart, Workflow, Headphones, Webhook, Code2,
  Cpu, Wand2, Eye, Heart, Tags, ClipboardList, Repeat,
  PenTool, Bot, MessageCircleMore, Megaphone, Store, Package,
  Server, Puzzle, Layers, ChevronRight
} from 'lucide-react';

// Icon mapping for block definitions
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Type: FileText, FileUp, Globe, ClipboardList, Sparkles, FileSearch: Search,
  Tags, Wand2, GitBranch, Mail, Send, Database, Clock, Eye,
  Heart, Languages, Braces, Filter, ArrowRightLeft, Combine,
  Repeat, Timer, GitFork, Bell, FileText, MessageSquare, MessageCircle, 
  Phone, Table, Brain, Image, Volume2, Mic, Users, Cloud, TrendingUp,
  Calendar, Columns, CheckSquare, Bug, Zap, HardDrive, Box, CreditCard,
  ShoppingCart, Calculator, Twitter: MessageCircle, Linkedin, Facebook, Instagram,
  Youtube, Video, Github, Gitlab, Triangle, Flame, BarChart3, BarChart2,
  Activity, LineChart, Workflow, Play: Zap, Headphones
};

// N8N-style categories - grouped by function, not by brand
const BLOCK_CATEGORIES = [
  {
    id: 'triggers',
    name: 'Déclencheurs',
    description: 'Démarrer un workflow',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    blocks: [
      { type: 'trigger_text' as BlockType, name: 'Texte', description: 'Démarrer avec du texte', icon: FileText },
      { type: 'trigger_file' as BlockType, name: 'Fichier', description: 'Démarrer avec un fichier', icon: FileUp },
      { type: 'trigger_webhook' as BlockType, name: 'Webhook', description: 'Déclenché par une API', icon: Webhook },
      { type: 'trigger_form' as BlockType, name: 'Formulaire', description: 'Déclenché par un formulaire', icon: ClipboardList },
      { type: 'trigger_schedule' as BlockType, name: 'Planification', description: 'Exécution programmée', icon: Clock },
      { type: 'trigger_email' as BlockType, name: 'Email', description: 'Déclenché par email', icon: Mail },
    ]
  },
  {
    id: 'ai',
    name: 'Intelligence Artificielle',
    description: 'Modèles IA et traitement',
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    blocks: [
      { type: 'ai_generate' as BlockType, name: 'Générer du texte', description: 'Créer du contenu avec l\'IA', icon: Wand2 },
      { type: 'ai_summary' as BlockType, name: 'Résumer', description: 'Condensez du contenu', icon: FileText },
      { type: 'ai_extract' as BlockType, name: 'Extraire', description: 'Extraire des données structurées', icon: Tags },
      { type: 'ai_classify' as BlockType, name: 'Classifier', description: 'Catégoriser du contenu', icon: Layers },
      { type: 'ai_decision' as BlockType, name: 'Décision IA', description: 'Choix intelligent', icon: GitFork },
      { type: 'ai_translate' as BlockType, name: 'Traduire', description: 'Traduction multilingue', icon: Languages },
      { type: 'ai_sentiment' as BlockType, name: 'Sentiment', description: 'Analyser les émotions', icon: Heart },
      { type: 'ai_vision' as BlockType, name: 'Vision', description: 'Analyser des images', icon: Eye },
    ]
  },
  {
    id: 'ai_providers',
    name: 'Fournisseurs IA',
    description: 'Modèles IA externes',
    icon: Cpu,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    blocks: [
      { type: 'integration_openai' as BlockType, name: 'OpenAI GPT', description: 'GPT-4, ChatGPT', icon: Bot },
      { type: 'integration_anthropic' as BlockType, name: 'Claude', description: 'Anthropic Claude', icon: MessageCircleMore },
      { type: 'integration_google_ai' as BlockType, name: 'Gemini', description: 'Google AI', icon: Sparkles },
      { type: 'integration_mistral' as BlockType, name: 'Mistral', description: 'Mistral AI', icon: Flame },
      { type: 'integration_huggingface' as BlockType, name: 'Hugging Face', description: 'Modèles open-source', icon: Brain },
      { type: 'integration_replicate' as BlockType, name: 'Replicate', description: 'Modèles ML', icon: Cpu },
    ]
  },
  {
    id: 'media_ai',
    name: 'IA Média',
    description: 'Audio, image, vidéo',
    icon: Image,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    blocks: [
      { type: 'integration_stability' as BlockType, name: 'Stability AI', description: 'Génération d\'images', icon: Image },
      { type: 'integration_elevenlabs' as BlockType, name: 'ElevenLabs', description: 'Synthèse vocale', icon: Volume2 },
      { type: 'integration_deepgram' as BlockType, name: 'Deepgram', description: 'Transcription audio', icon: Mic },
      { type: 'integration_assemblyai' as BlockType, name: 'AssemblyAI', description: 'Analyse audio', icon: Headphones },
    ]
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Chat, email, SMS',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    blocks: [
      { type: 'integration_slack' as BlockType, name: 'Slack', description: 'Messages Slack', icon: MessageSquare },
      { type: 'integration_discord' as BlockType, name: 'Discord', description: 'Bot Discord', icon: MessageCircle },
      { type: 'integration_telegram' as BlockType, name: 'Telegram', description: 'Bot Telegram', icon: Send },
      { type: 'integration_whatsapp' as BlockType, name: 'WhatsApp', description: 'API WhatsApp', icon: Phone },
      { type: 'integration_teams' as BlockType, name: 'MS Teams', description: 'Microsoft Teams', icon: Users },
      { type: 'integration_twilio_sms' as BlockType, name: 'SMS (Twilio)', description: 'Envoyer des SMS', icon: MessageCircle },
      { type: 'integration_twilio_voice' as BlockType, name: 'Appel (Twilio)', description: 'Appels vocaux', icon: Phone },
    ]
  },
  {
    id: 'email',
    name: 'Email Marketing',
    description: 'Campagnes et newsletters',
    icon: Mail,
    color: 'from-sky-500 to-blue-500',
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
    blocks: [
      { type: 'integration_sendgrid' as BlockType, name: 'SendGrid', description: 'Emails transactionnels', icon: Mail },
      { type: 'integration_mailchimp' as BlockType, name: 'Mailchimp', description: 'Newsletters', icon: Megaphone },
      { type: 'integration_brevo' as BlockType, name: 'Brevo', description: 'Ex-Sendinblue', icon: Mail },
      { type: 'integration_resend' as BlockType, name: 'Resend', description: 'Emails modernes', icon: Send },
      { type: 'integration_mailgun' as BlockType, name: 'Mailgun', description: 'API email', icon: Mail },
      { type: 'integration_convertkit' as BlockType, name: 'ConvertKit', description: 'Créateurs', icon: PenTool },
    ]
  },
  {
    id: 'support',
    name: 'Support Client',
    description: 'Helpdesk et chat',
    icon: Headphones,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    blocks: [
      { type: 'integration_intercom' as BlockType, name: 'Intercom', description: 'Chat et support', icon: MessageCircle },
      { type: 'integration_zendesk' as BlockType, name: 'Zendesk', description: 'Helpdesk', icon: Headphones },
      { type: 'integration_freshdesk' as BlockType, name: 'Freshdesk', description: 'Support tickets', icon: Headphones },
      { type: 'integration_crisp' as BlockType, name: 'Crisp', description: 'Chat en direct', icon: MessageCircle },
    ]
  },
  {
    id: 'crm',
    name: 'CRM & Ventes',
    description: 'Gestion des clients',
    icon: Users,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    blocks: [
      { type: 'integration_hubspot' as BlockType, name: 'HubSpot', description: 'CRM complet', icon: TrendingUp },
      { type: 'integration_salesforce' as BlockType, name: 'Salesforce', description: 'Enterprise CRM', icon: Cloud },
      { type: 'integration_pipedrive' as BlockType, name: 'Pipedrive', description: 'Pipeline ventes', icon: TrendingUp },
      { type: 'integration_zoho' as BlockType, name: 'Zoho CRM', description: 'Suite Zoho', icon: Users },
    ]
  },
  {
    id: 'productivity',
    name: 'Productivité',
    description: 'Gestion de projet',
    icon: CheckSquare,
    color: 'from-indigo-500 to-violet-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    blocks: [
      { type: 'integration_notion' as BlockType, name: 'Notion', description: 'Docs et bases', icon: FileText },
      { type: 'integration_airtable' as BlockType, name: 'Airtable', description: 'Base de données', icon: Table },
      { type: 'integration_google_sheets' as BlockType, name: 'Google Sheets', description: 'Tableur', icon: Table },
      { type: 'integration_trello' as BlockType, name: 'Trello', description: 'Kanban', icon: Columns },
      { type: 'integration_asana' as BlockType, name: 'Asana', description: 'Gestion projet', icon: CheckSquare },
      { type: 'integration_monday' as BlockType, name: 'Monday', description: 'Work OS', icon: Columns },
      { type: 'integration_clickup' as BlockType, name: 'ClickUp', description: 'Tout-en-un', icon: CheckSquare },
      { type: 'integration_jira' as BlockType, name: 'Jira', description: 'Suivi bugs', icon: Bug },
      { type: 'integration_linear' as BlockType, name: 'Linear', description: 'Issue tracking', icon: Zap },
    ]
  },
  {
    id: 'calendar',
    name: 'Calendrier',
    description: 'Planification et RDV',
    icon: Calendar,
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    blocks: [
      { type: 'integration_google_calendar' as BlockType, name: 'Google Calendar', description: 'Agenda Google', icon: Calendar },
      { type: 'integration_calendly' as BlockType, name: 'Calendly', description: 'Prise de RDV', icon: Clock },
      { type: 'integration_zoom' as BlockType, name: 'Zoom', description: 'Visioconférence', icon: Video },
      { type: 'integration_loom' as BlockType, name: 'Loom', description: 'Vidéos asynchrones', icon: Video },
    ]
  },
  {
    id: 'storage',
    name: 'Stockage',
    description: 'Fichiers et cloud',
    icon: HardDrive,
    color: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-50 dark:bg-slate-900/30',
    blocks: [
      { type: 'integration_google_drive' as BlockType, name: 'Google Drive', description: 'Stockage Google', icon: HardDrive },
      { type: 'integration_dropbox' as BlockType, name: 'Dropbox', description: 'Partage fichiers', icon: Box },
      { type: 'integration_onedrive' as BlockType, name: 'OneDrive', description: 'Microsoft Cloud', icon: Cloud },
      { type: 'integration_box' as BlockType, name: 'Box', description: 'Enterprise files', icon: Box },
      { type: 'integration_aws_s3' as BlockType, name: 'AWS S3', description: 'Object storage', icon: Database },
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Boutiques et paiements',
    icon: ShoppingCart,
    color: 'from-lime-500 to-green-500',
    bgColor: 'bg-lime-50 dark:bg-lime-950/30',
    blocks: [
      { type: 'integration_stripe' as BlockType, name: 'Stripe', description: 'Paiements', icon: CreditCard },
      { type: 'integration_paypal' as BlockType, name: 'PayPal', description: 'Paiements PayPal', icon: CreditCard },
      { type: 'integration_shopify' as BlockType, name: 'Shopify', description: 'E-commerce', icon: Store },
      { type: 'integration_quickbooks' as BlockType, name: 'QuickBooks', description: 'Comptabilité', icon: Calculator },
    ]
  },
  {
    id: 'social',
    name: 'Réseaux Sociaux',
    description: 'Publication et analytics',
    icon: Instagram,
    color: 'from-fuchsia-500 to-pink-500',
    bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/30',
    blocks: [
      { type: 'integration_twitter' as BlockType, name: 'X (Twitter)', description: 'Posts et mentions', icon: MessageCircle },
      { type: 'integration_linkedin' as BlockType, name: 'LinkedIn', description: 'Réseau pro', icon: Linkedin },
      { type: 'integration_facebook' as BlockType, name: 'Facebook', description: 'Meta pages', icon: Facebook },
      { type: 'integration_instagram' as BlockType, name: 'Instagram', description: 'Photos et reels', icon: Instagram },
      { type: 'integration_youtube' as BlockType, name: 'YouTube', description: 'Vidéos', icon: Youtube },
      { type: 'integration_tiktok' as BlockType, name: 'TikTok', description: 'Vidéos courtes', icon: Video },
    ]
  },
  {
    id: 'developer',
    name: 'Développement',
    description: 'Git, CI/CD, APIs',
    icon: Code2,
    color: 'from-gray-600 to-gray-800',
    bgColor: 'bg-gray-50 dark:bg-gray-900/30',
    blocks: [
      { type: 'integration_github' as BlockType, name: 'GitHub', description: 'Repos et actions', icon: Github },
      { type: 'integration_gitlab' as BlockType, name: 'GitLab', description: 'DevOps', icon: Gitlab },
      { type: 'integration_vercel' as BlockType, name: 'Vercel', description: 'Déploiement', icon: Triangle },
      { type: 'integration_supabase' as BlockType, name: 'Supabase', description: 'Backend', icon: Database },
      { type: 'integration_firebase' as BlockType, name: 'Firebase', description: 'Google Cloud', icon: Flame },
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Données et métriques',
    icon: BarChart3,
    color: 'from-cyan-500 to-teal-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
    blocks: [
      { type: 'integration_google_analytics' as BlockType, name: 'Google Analytics', description: 'Web analytics', icon: BarChart3 },
      { type: 'integration_mixpanel' as BlockType, name: 'Mixpanel', description: 'Product analytics', icon: BarChart2 },
      { type: 'integration_segment' as BlockType, name: 'Segment', description: 'CDP', icon: Activity },
      { type: 'integration_amplitude' as BlockType, name: 'Amplitude', description: 'Comportement', icon: LineChart },
    ]
  },
  {
    id: 'automation',
    name: 'Automatisation',
    description: 'Connexion à d\'autres outils',
    icon: Workflow,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    blocks: [
      { type: 'integration_zapier' as BlockType, name: 'Zapier', description: 'Connexions', icon: Zap },
      { type: 'integration_make' as BlockType, name: 'Make', description: 'Ex-Integromat', icon: Workflow },
      { type: 'integration_n8n' as BlockType, name: 'n8n', description: 'Open-source', icon: GitBranch },
    ]
  },
  {
    id: 'http',
    name: 'HTTP & API',
    description: 'Requêtes personnalisées',
    icon: Globe,
    color: 'from-slate-600 to-slate-700',
    bgColor: 'bg-slate-50 dark:bg-slate-900/30',
    blocks: [
      { type: 'http_request' as BlockType, name: 'Requête HTTP', description: 'GET, POST, PUT...', icon: Globe },
      { type: 'http_webhook' as BlockType, name: 'Webhook sortant', description: 'Envoyer des données', icon: Webhook },
    ]
  },
  {
    id: 'transform',
    name: 'Transformation',
    description: 'Modifier les données',
    icon: Braces,
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    blocks: [
      { type: 'transform_json' as BlockType, name: 'JSON', description: 'Parser/formater JSON', icon: Braces },
      { type: 'transform_filter' as BlockType, name: 'Filtrer', description: 'Filtrer des éléments', icon: Filter },
      { type: 'transform_map' as BlockType, name: 'Mapper', description: 'Transformer les données', icon: ArrowRightLeft },
      { type: 'transform_merge' as BlockType, name: 'Fusionner', description: 'Combiner des sources', icon: Combine },
    ]
  },
  {
    id: 'control',
    name: 'Contrôle de Flux',
    description: 'Logique et branches',
    icon: GitBranch,
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    blocks: [
      { type: 'control_condition' as BlockType, name: 'Condition', description: 'Si/Alors/Sinon', icon: GitFork },
      { type: 'control_loop' as BlockType, name: 'Boucle', description: 'Répéter des actions', icon: Repeat },
      { type: 'control_delay' as BlockType, name: 'Délai', description: 'Attendre un temps', icon: Timer },
      { type: 'control_parallel' as BlockType, name: 'Parallèle', description: 'Exécution simultanée', icon: Columns },
      { type: 'control_branch' as BlockType, name: 'Branche', description: 'Diviser le flux', icon: GitBranch },
      { type: 'control_merge' as BlockType, name: 'Merge', description: 'Rejoindre les flux', icon: Combine },
      { type: 'workflow_call' as BlockType, name: 'Sub-workflow', description: 'Appeler un workflow', icon: Workflow },
    ]
  },
  {
    id: 'system',
    name: 'Actions Système',
    description: 'Notifications et logs',
    icon: Settings2,
    color: 'from-gray-500 to-slate-600',
    bgColor: 'bg-gray-50 dark:bg-gray-900/30',
    blocks: [
      { type: 'system_email' as BlockType, name: 'Envoyer email', description: 'Email système', icon: Mail },
      { type: 'system_webhook' as BlockType, name: 'Webhook', description: 'Appel HTTP', icon: Webhook },
      { type: 'system_save' as BlockType, name: 'Sauvegarder', description: 'Enregistrer données', icon: Database },
      { type: 'system_notify' as BlockType, name: 'Notifier', description: 'Notification', icon: Bell },
      { type: 'system_log' as BlockType, name: 'Log', description: 'Journal d\'exécution', icon: FileText },
    ]
  },
];

// Quick filter tabs
const QUICK_FILTERS = [
  { id: 'all', name: 'Tous', icon: Layers },
  { id: 'triggers', name: 'Déclencheurs', icon: Zap },
  { id: 'ai', name: 'IA', icon: Brain },
  { id: 'communication', name: 'Communication', icon: MessageSquare },
  { id: 'productivity', name: 'Productivité', icon: CheckSquare },
  { id: 'data', name: 'Données', icon: Database },
];

const FILTER_MAPPING: Record<string, string[]> = {
  triggers: ['triggers'],
  ai: ['ai', 'ai_providers', 'media_ai'],
  communication: ['communication', 'email', 'support'],
  productivity: ['productivity', 'calendar', 'crm'],
  data: ['storage', 'analytics', 'transform', 'http'],
};

interface BlockPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (type: BlockType) => void;
}

export function BlockPickerDialog({ isOpen, onClose, onAddBlock }: BlockPickerDialogProps) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    let categories = BLOCK_CATEGORIES;

    // Filter by quick filter
    if (activeFilter !== 'all' && FILTER_MAPPING[activeFilter]) {
      categories = categories.filter(cat => FILTER_MAPPING[activeFilter].includes(cat.id));
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      categories = categories.map(cat => {
        const matchingBlocks = cat.blocks.filter(block => 
          block.name.toLowerCase().includes(searchLower) ||
          block.description.toLowerCase().includes(searchLower) ||
          cat.name.toLowerCase().includes(searchLower)
        );
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
    setExpandedCategory(null);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] p-0 gap-0 overflow-hidden bg-background">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b border-border space-y-3">
          <DialogTitle className="text-lg font-semibold">Ajouter un bloc</DialogTitle>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-10 pr-8 h-10 bg-muted/50"
              autoFocus
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
          
          {/* Quick Filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {QUICK_FILTERS.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {filter.name}
                </button>
              );
            })}
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {filteredCategories.map((category) => {
              const CategoryIcon = category.icon;
              const isExpanded = expandedCategory === category.id || search.length > 0;
              
              return (
                <div key={category.id} className="rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                      "hover:bg-muted/50",
                      isExpanded && category.bgColor
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-sm",
                      category.color
                    )}>
                      <CategoryIcon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{category.name}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {category.blocks.length}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{category.description}</span>
                    </div>
                    <ChevronRight className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      isExpanded && "rotate-90"
                    )} />
                  </button>
                  
                  {/* Category Blocks */}
                  {isExpanded && (
                    <div className={cn("pl-12 pr-3 pb-3 space-y-1", category.bgColor)}>
                      {category.blocks.map((block) => {
                        const BlockIcon = block.icon;
                        return (
                          <button
                            key={block.type}
                            onClick={() => handleSelect(block.type)}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-background/80 hover:bg-background border border-transparent hover:border-border transition-all text-left group"
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-md bg-gradient-to-br flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform",
                              category.color
                            )}>
                              <BlockIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-foreground block">
                                {block.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {block.description}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-muted-foreground">Aucun bloc trouvé</p>
                <p className="text-xs text-muted-foreground mt-1">Essayez un autre terme</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {search && totalResults > 0 && (
          <div className="px-4 py-2 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">
              {totalResults} résultat{totalResults > 1 ? 's' : ''} pour "{search}"
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
