import { useState } from "react";
import { 
  Zap, Brain, Sparkles, ScanSearch, ShieldCheck, LineChart,
  ChevronDown, Workflow, MessageSquare, FileText, Target, Users,
  BarChart3, Mail, Calendar, Shield, AlertTriangle, TrendingUp,
  Phone, FileCheck, Database, ArrowRight, CheckCircle2, Clock,
  Bot, Search, PieChart, FileSpreadsheet, Upload, GitBranch,
  Mic, Star, Building2, Euro, FileWarning, Scale, Handshake
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface WorkflowStep {
  label: string;
  icon: LucideIcon;
}

interface Tool {
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  color: string;
  colorClass: string;
  features: Feature[];
  workflow: WorkflowStep[];
  stats: { value: string; label: string }[];
  useCases: string[];
}

const tools: Tool[] = [
  {
    name: "Flow",
    tagline: "Automatisation prédictive",
    description: "L'IA anticipe vos besoins et déclenche des workflows avant même que vous y pensiez.",
    icon: Zap,
    color: "bg-blue-500",
    colorClass: "text-blue-500",
    features: [
      { icon: Workflow, title: "Builder visuel no-code", description: "Créez des workflows complexes par glisser-déposer. Conditions, boucles, branchements sans une ligne de code." },
      { icon: GitBranch, title: "Déclencheurs intelligents", description: "Détection automatique d'événements : nouveau lead, email reçu, seuil atteint, horaire, webhook externe." },
      { icon: Mail, title: "Actions multi-canaux", description: "Envoi d'emails, SMS, notifications Slack, appels API, mise à jour CRM, génération de documents." },
      { icon: Bot, title: "IA dans le workflow", description: "Intégrez l'analyse IA : classification, extraction, génération de contenu à chaque étape." },
    ],
    workflow: [
      { label: "Trigger", icon: Zap },
      { label: "Condition", icon: GitBranch },
      { label: "Action IA", icon: Brain },
      { label: "Notification", icon: Mail },
    ],
    stats: [
      { value: "80%", label: "Temps gagné" },
      { value: "0", label: "Code requis" },
      { value: "∞", label: "Workflows possibles" },
    ],
    useCases: [
      "Onboarding client automatisé",
      "Relance intelligente des leads",
      "Alertes seuil de stock",
      "Rapports hebdo auto-générés",
    ],
  },
  {
    name: "Brain",
    tagline: "Intelligence contextuelle",
    description: "Une IA qui comprend le contexte de votre entreprise et répond avec précision.",
    icon: Brain,
    color: "bg-violet-500",
    colorClass: "text-violet-500",
    features: [
      { icon: MessageSquare, title: "Chat conversationnel", description: "Posez des questions en langage naturel. L'IA comprend le contexte et fournit des réponses précises." },
      { icon: Upload, title: "Import de documents", description: "Uploadez PDF, Word, Excel. L'IA analyse, indexe et rend le contenu interrogeable instantanément." },
      { icon: Search, title: "Recherche sémantique", description: "Trouvez l'information pertinente même avec des termes différents. Comprend le sens, pas juste les mots." },
      { icon: FileText, title: "Génération de contenu", description: "Créez emails, rapports, résumés basés sur vos données et le contexte de votre entreprise." },
    ],
    workflow: [
      { label: "Upload", icon: Upload },
      { label: "Analyse IA", icon: Brain },
      { label: "Indexation", icon: Database },
      { label: "Requête", icon: Search },
    ],
    stats: [
      { value: "95%", label: "Précision réponses" },
      { value: "<2s", label: "Temps de réponse" },
      { value: "100+", label: "Formats supportés" },
    ],
    useCases: [
      "Assistant juridique interne",
      "Base de connaissance produit",
      "FAQ intelligente employés",
      "Analyse de contrats",
    ],
  },
  {
    name: "Support",
    tagline: "IA conversationnelle",
    description: "Résolution autonome des tickets avec apprentissage continu. Réduction significative du temps.",
    icon: Sparkles,
    color: "bg-emerald-500",
    colorClass: "text-emerald-500",
    features: [
      { icon: Bot, title: "Réponses automatiques 24/7", description: "L'IA résout 70% des demandes sans intervention humaine. Disponible nuit et week-end." },
      { icon: Target, title: "Routage intelligent", description: "Analyse du contenu et de l'urgence pour diriger vers le bon agent avec le contexte complet." },
      { icon: Clock, title: "SLA prédictif", description: "Anticipation des délais de réponse, alertes avant dépassement, priorisation automatique." },
      { icon: BarChart3, title: "Analytics temps réel", description: "Satisfaction client, temps de résolution, sujets récurrents, performance agents." },
    ],
    workflow: [
      { label: "Ticket reçu", icon: Mail },
      { label: "Classification IA", icon: Brain },
      { label: "Réponse auto", icon: Bot },
      { label: "Escalade si besoin", icon: Users },
    ],
    stats: [
      { value: "70%", label: "Résolution auto" },
      { value: "-60%", label: "Temps réponse" },
      { value: "4.8/5", label: "Satisfaction" },
    ],
    useCases: [
      "Support client e-commerce",
      "Help desk IT interne",
      "SAV produits techniques",
      "Gestion des réclamations",
    ],
  },
  {
    name: "HR",
    tagline: "Matching prédictif",
    description: "L'IA prédit la compatibilité candidat-poste et accélère votre processus de recrutement.",
    icon: ScanSearch,
    color: "bg-orange-500",
    colorClass: "text-orange-500",
    features: [
      { icon: FileSpreadsheet, title: "Parsing CV intelligent", description: "Extraction automatique : compétences, expériences, formations, langues. Standardisation des profils." },
      { icon: Target, title: "Score de matching", description: "Algorithme IA comparant profil et exigences du poste. Score de compatibilité expliqué." },
      { icon: Mic, title: "Analyse d'entretien", description: "Transcription, analyse du discours, détection soft skills, rapport objectif post-entretien." },
      { icon: Calendar, title: "Planification intelligente", description: "Proposition de créneaux, relances automatiques, synchronisation calendriers, rappels." },
    ],
    workflow: [
      { label: "CV reçu", icon: FileText },
      { label: "Parsing IA", icon: Brain },
      { label: "Matching", icon: Target },
      { label: "Entretien", icon: Mic },
    ],
    stats: [
      { value: "-75%", label: "Temps screening" },
      { value: "92%", label: "Précision matching" },
      { value: "2x", label: "Plus de recrutements" },
    ],
    useCases: [
      "Recrutement volume",
      "Chasse de profils tech",
      "Mobilité interne",
      "Gestion des talents",
    ],
  },
  {
    name: "Compliance",
    tagline: "Détection proactive",
    description: "Anticipez les risques avant qu'ils ne surviennent. Conformité RGPD automatisée.",
    icon: ShieldCheck,
    color: "bg-rose-500",
    colorClass: "text-rose-500",
    features: [
      { icon: Search, title: "Scan automatique", description: "Analyse continue de vos documents, emails, bases de données. Détection des données sensibles." },
      { icon: AlertTriangle, title: "Alertes en temps réel", description: "Notification immédiate en cas de risque détecté : donnée exposée, clause non-conforme, deadline approchant." },
      { icon: FileCheck, title: "Rapports de conformité", description: "Génération automatique de rapports RGPD, audits, registres de traitement, preuves de conformité." },
      { icon: Scale, title: "Veille réglementaire", description: "Suivi des évolutions légales, impact sur vos process, recommandations de mise en conformité." },
    ],
    workflow: [
      { label: "Scan données", icon: Search },
      { label: "Détection risque", icon: AlertTriangle },
      { label: "Alerte", icon: Mail },
      { label: "Rapport", icon: FileCheck },
    ],
    stats: [
      { value: "99%", label: "Risques détectés" },
      { value: "-90%", label: "Temps audit" },
      { value: "0€", label: "Amendes RGPD" },
    ],
    useCases: [
      "Conformité RGPD",
      "Audit contractuel",
      "Protection données santé",
      "Due diligence M&A",
    ],
  },
  {
    name: "Sales",
    tagline: "Prévision intelligente",
    description: "Prévisionnez le chiffre d'affaires, analysez le sentiment et générez des propositions gagnantes.",
    icon: LineChart,
    color: "bg-cyan-500",
    colorClass: "text-cyan-500",
    features: [
      { icon: TrendingUp, title: "Forecasting IA", description: "Prédiction du CA à 30/60/90 jours. Analyse des deals en cours, probabilités de closing, alertes sur deals à risque." },
      { icon: Phone, title: "Analyse des appels", description: "Transcription, analyse du sentiment, objections détectées, points clés, coaching personnalisé." },
      { icon: FileText, title: "Propositions auto-générées", description: "Création de devis et propositions commerciales personnalisées basées sur le contexte client." },
      { icon: Handshake, title: "Fiches de négociation", description: "Brief complet avant RDV : historique, enjeux, concurrence, arguments clés, prix plancher." },
    ],
    workflow: [
      { label: "Appel client", icon: Phone },
      { label: "Transcription", icon: FileText },
      { label: "Analyse IA", icon: Brain },
      { label: "Actions", icon: CheckCircle2 },
    ],
    stats: [
      { value: "+35%", label: "Taux conversion" },
      { value: "95%", label: "Précision forecast" },
      { value: "-50%", label: "Temps proposition" },
    ],
    useCases: [
      "Équipe commerciale B2B",
      "Inside sales",
      "Account management",
      "Business development",
    ],
  },
];

export function PainPointsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="product" className="py-16 sm:py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
            Six agents IA. Une révolution.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            Chaque agent résout un problème métier spécifique. Ensemble, ils transforment vos opérations.
          </p>
        </div>
        
        {/* Tools grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {tools.map((tool, i) => {
            const IconComponent = tool.icon;
            const isExpanded = expandedIndex === i;
            
            return (
              <div 
                key={i} 
                className={cn(
                  "group rounded-2xl bg-background border transition-all duration-500 cursor-pointer overflow-hidden",
                  isExpanded 
                    ? "border-primary shadow-xl shadow-primary/10 lg:col-span-2" 
                    : "border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                )}
                onClick={() => handleToggle(i)}
              >
                {/* Header - always visible */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl ${tool.color} flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-7 h-7 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className={cn("text-xs font-semibold uppercase tracking-wider mb-1", tool.colorClass)}>
                          {tool.tagline}
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          AETHER {tool.name}
                        </h3>
                      </div>
                    </div>
                    <div className={cn(
                      "w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-all duration-300",
                      isExpanded && "rotate-180 bg-primary/10"
                    )}>
                      <ChevronDown className={cn("w-5 h-5", isExpanded ? "text-primary" : "text-muted-foreground")} />
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mt-4">
                    {tool.description}
                  </p>

                  {/* Quick stats preview when collapsed */}
                  {!isExpanded && (
                    <div className="flex gap-6 mt-4 pt-4 border-t border-border/50">
                      {tool.stats.slice(0, 3).map((stat, j) => (
                        <div key={j} className="text-center">
                          <div className={cn("text-lg font-bold", tool.colorClass)}>{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expanded content */}
                <div className={cn(
                  "grid transition-all duration-500 ease-in-out",
                  isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 border-t border-border/50">
                      
                      {/* Workflow visualization */}
                      <div className="mt-6 mb-8">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                          Comment ça fonctionne
                        </div>
                        <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-4 overflow-x-auto">
                          {tool.workflow.map((step, j) => {
                            const StepIcon = step.icon;
                            return (
                              <div key={j} className="flex items-center">
                                <div className="flex flex-col items-center gap-2">
                                  <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center",
                                    tool.color + "/20"
                                  )}>
                                    <StepIcon className={cn("w-6 h-6", tool.colorClass)} strokeWidth={1.5} />
                                  </div>
                                  <span className="text-xs font-medium text-foreground whitespace-nowrap">
                                    {step.label}
                                  </span>
                                </div>
                                {j < tool.workflow.length - 1 && (
                                  <ArrowRight className="w-5 h-5 text-muted-foreground mx-3 shrink-0" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Features grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {tool.features.map((feature, j) => {
                          const FeatureIcon = feature.icon;
                          return (
                            <div 
                              key={j}
                              className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/20 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                  tool.color + "/20"
                                )}>
                                  <FeatureIcon className={cn("w-5 h-5", tool.colorClass)} strokeWidth={1.5} />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-foreground mb-1">
                                    {feature.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground leading-relaxed">
                                    {feature.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Stats and use cases */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Stats */}
                        <div className="bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-xl p-5">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                            Résultats mesurés
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            {tool.stats.map((stat, j) => (
                              <div key={j} className="text-center">
                                <div className={cn("text-2xl font-bold", tool.colorClass)}>{stat.value}</div>
                                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Use cases */}
                        <div className="bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-xl p-5">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                            Cas d'usage
                          </div>
                          <div className="space-y-2">
                            {tool.useCases.map((useCase, j) => (
                              <div key={j} className="flex items-center gap-2">
                                <CheckCircle2 className={cn("w-4 h-4 shrink-0", tool.colorClass)} />
                                <span className="text-sm text-foreground">{useCase}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
