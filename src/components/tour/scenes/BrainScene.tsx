import React from 'react';
import { Brain, Search, FileText, MessageSquare, Sparkles, Link2, Database, Zap, Globe, ImageIcon, Code, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrainSceneProps {
  isActive: boolean;
  progress: number;
}

export function BrainScene({ isActive, progress }: BrainSceneProps) {
  const showInterface = progress >= 0;
  const showDocs = progress >= 8;
  const showQuestion = progress >= 18;
  const showThinking = progress >= 30;
  const showResponse = progress >= 45;
  const showSources = progress >= 60;
  const showTools = progress >= 75;
  const showFinal = progress >= 90;

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 overflow-hidden">
      {/* Neural network background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={`${10 + (i % 5) * 20}%`}
              cy={`${10 + Math.floor(i / 5) * 25}%`}
              r="3"
              fill="hsl(var(--agent-brain))"
              opacity={0.5}
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur={`${2 + i * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </div>

      {/* Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-agent-brain/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-500/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="absolute inset-4 flex gap-4">
        {/* Left - Knowledge Base */}
        <div 
          className={cn(
            "w-72 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
            showInterface ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-agent-brain/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-agent-brain" />
            </div>
            <div>
              <h2 className="font-bold text-white">Brain</h2>
              <p className="text-xs text-white/50">Intelligence collective</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 mb-4">
            <Search className="w-4 h-4 text-white/50" />
            <span className="text-white/40 text-sm">Rechercher...</span>
          </div>

          {/* Documents */}
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-agent-brain" />
            <span className="text-white/80 text-sm font-medium">Base de connaissances</span>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Politique RH.pdf', pages: 45, type: 'pdf' },
              { name: 'Contrats types.docx', pages: 28, type: 'doc' },
              { name: 'FAQ Produit.pdf', pages: 62, type: 'pdf' },
              { name: 'Guide technique.md', pages: 120, type: 'md' },
              { name: 'Procédures.pdf', pages: 34, type: 'pdf' },
            ].map((doc, i) => (
              <div 
                key={doc.name}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 transition-all duration-500"
                style={{ 
                  transitionDelay: `${i * 80}ms`,
                  opacity: showDocs ? 1 : 0,
                  transform: showDocs ? 'translateX(0)' : 'translateX(-15px)'
                }}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-agent-brain/70" />
                  <span className="text-white/80 text-sm truncate flex-1">{doc.name}</span>
                </div>
                <div className="text-white/40 text-xs mt-1">{doc.pages} pages indexées</div>
              </div>
            ))}
          </div>

          <div 
            className={cn(
              "mt-4 p-3 rounded-xl bg-agent-brain/20 border border-agent-brain/30 transition-all duration-700",
              showDocs ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="text-agent-brain font-bold text-lg">5 docs</div>
            <div className="text-agent-brain/70 text-xs">indexés dans la base</div>
          </div>
        </div>

        {/* Center - Chat */}
        <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 p-6 overflow-auto">
            {/* Welcome */}
            <div 
              className={cn(
                "text-center mb-8 transition-all duration-700",
                showQuestion ? "opacity-30 scale-90" : "opacity-100 scale-100"
              )}
            >
              <Brain className="w-16 h-16 mx-auto mb-3 text-agent-brain/40" />
              <p className="text-white/50">Posez n'importe quelle question</p>
            </div>

            {/* User question */}
            <div 
              className={cn(
                "flex justify-end mb-6 transition-all duration-700",
                showQuestion ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <div className="max-w-lg p-4 rounded-2xl rounded-br-sm bg-agent-brain text-white">
                <p>Quelle est notre politique de remboursement pour les clients entreprise ?</p>
              </div>
            </div>

            {/* AI Thinking */}
            {showThinking && !showResponse && (
              <div className="flex gap-3 mb-6 animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-agent-brain/30 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-agent-brain animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl rounded-bl-sm bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-agent-brain animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-agent-brain animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-2 h-2 rounded-full bg-agent-brain animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-white/60 text-sm">Recherche dans 5 documents...</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Response */}
            <div 
              className={cn(
                "flex gap-3 transition-all duration-700",
                showResponse ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-agent-brain/30 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-agent-brain" />
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="p-4 rounded-2xl rounded-bl-sm bg-white/5 border border-white/10 mb-3">
                  <p className="text-white/90 leading-relaxed">
                    Selon notre <span className="text-agent-brain font-medium">Politique RH (section 4.2)</span>, les remboursements pour clients entreprise suivent ces règles :
                  </p>
                  <ul className="mt-3 space-y-2 text-white/70 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-agent-brain">•</span>
                      <span>Remboursement intégral dans les <strong className="text-white">30 premiers jours</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-agent-brain">•</span>
                      <span>Au prorata pour les contrats annuels pendant les <strong className="text-white">3 premiers mois</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-agent-brain">•</span>
                      <span>Exception : les licences serveur ne sont pas remboursables après activation</span>
                    </li>
                  </ul>
                </div>

                {/* Sources */}
                <div 
                  className={cn(
                    "transition-all duration-700",
                    showSources ? "opacity-100" : "opacity-0"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 className="w-4 h-4 text-white/50" />
                    <span className="text-white/50 text-xs">Sources</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { doc: 'Politique RH.pdf', page: 'p.12-14' },
                      { doc: 'Contrats types.docx', page: 'p.8' },
                      { doc: 'FAQ Produit.pdf', page: 'p.23' },
                    ].map((source, i) => (
                      <span 
                        key={source.doc}
                        className="px-2.5 py-1 rounded-lg bg-agent-brain/20 border border-agent-brain/30 text-agent-brain text-xs transition-all duration-500"
                        style={{ 
                          transitionDelay: `${i * 100}ms`,
                          opacity: showSources ? 1 : 0
                        }}
                      >
                        📄 {source.doc} - {source.page}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <MessageSquare className="w-5 h-5 text-white/40" />
              <span className="flex-1 text-white/40 text-sm">Posez votre question...</span>
              <button className="p-2 rounded-lg bg-agent-brain text-white">
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right - AI Tools */}
        <div 
          className={cn(
            "w-64 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
            showTools ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-white font-semibold">Outils IA</span>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Recherche web', icon: Globe, color: 'text-blue-400', active: true },
              { name: 'Analyse image', icon: ImageIcon, color: 'text-pink-400' },
              { name: 'Génération code', icon: Code, color: 'text-green-400' },
              { name: 'Résumé document', icon: BookOpen, color: 'text-amber-400' },
            ].map((tool, i) => (
              <div 
                key={tool.name}
                className={cn(
                  "p-3 rounded-xl border transition-all duration-500",
                  tool.active 
                    ? "bg-white/10 border-white/20" 
                    : "bg-white/5 border-white/10"
                )}
                style={{ 
                  transitionDelay: `${i * 100 + 200}ms`,
                  opacity: showTools ? 1 : 0
                }}
              >
                <div className="flex items-center gap-2">
                  <tool.icon className={cn("w-4 h-4", tool.color)} />
                  <span className="text-white/80 text-sm">{tool.name}</span>
                </div>
                {tool.active && (
                  <div className="mt-2 text-xs text-white/50">Activé pour cette session</div>
                )}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div 
            className={cn(
              "mt-4 p-3 rounded-xl bg-gradient-to-br from-agent-brain/30 to-violet-500/20 border border-agent-brain/30 transition-all duration-700",
              showFinal ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-xl font-bold text-white">4</div>
                <div className="text-white/50 text-xs">Outils IA</div>
              </div>
              <div>
                <div className="text-xl font-bold text-agent-brain">RAG</div>
                <div className="text-white/50 text-xs">Précision</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
