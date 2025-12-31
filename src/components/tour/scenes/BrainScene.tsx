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
    <div 
      className="absolute inset-0 bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 overflow-hidden"
      style={{ fontSize: 'clamp(8px, 1.2vw, 14px)' }}
    >
      {/* Neural network background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={`${10 + (i % 5) * 20}%`}
              cy={`${10 + Math.floor(i / 5) * 25}%`}
              r="0.3%"
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
      <div className="absolute top-1/4 left-1/4 w-[35%] aspect-square rounded-full bg-agent-brain/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[30%] aspect-square rounded-full bg-violet-500/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="absolute inset-[2%] flex gap-[1.5%]">
        {/* Left - Knowledge Base */}
        <div 
          className={cn(
            "w-[24%] bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-[1em] transition-all duration-700 flex flex-col",
            showInterface ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}
        >
          <div className="flex items-center gap-[0.6em] mb-[1em]">
            <div className="w-[2.2em] h-[2.2em] rounded-xl bg-agent-brain/30 flex items-center justify-center">
              <Brain className="w-[1.1em] h-[1.1em] text-agent-brain" />
            </div>
            <div>
              <h2 className="font-bold text-white text-[1em]">Brain</h2>
              <p className="text-[0.65em] text-white/50">Intelligence collective</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-[0.5em] p-[0.6em] rounded-xl bg-white/5 border border-white/10 mb-[1em]">
            <Search className="w-[1em] h-[1em] text-white/50" />
            <span className="text-white/40 text-[0.8em]">Rechercher...</span>
          </div>

          {/* Documents */}
          <div className="flex items-center gap-[0.5em] mb-[0.6em]">
            <Database className="w-[1em] h-[1em] text-agent-brain" />
            <span className="text-white/80 text-[0.8em] font-medium">Base de connaissances</span>
          </div>

          <div className="flex-1 flex flex-col gap-[0.4em] overflow-hidden">
            {[
              { name: 'Politique RH.pdf', pages: 45, type: 'pdf' },
              { name: 'Contrats types.docx', pages: 28, type: 'doc' },
              { name: 'FAQ Produit.pdf', pages: 62, type: 'pdf' },
              { name: 'Guide technique.md', pages: 120, type: 'md' },
              { name: 'Procédures.pdf', pages: 34, type: 'pdf' },
            ].map((doc, i) => (
              <div 
                key={doc.name}
                className="p-[0.6em] rounded-xl bg-white/5 border border-white/10 transition-all duration-500"
                style={{ 
                  transitionDelay: `${i * 80}ms`,
                  opacity: showDocs ? 1 : 0,
                  transform: showDocs ? 'translateX(0)' : 'translateX(-15px)'
                }}
              >
                <div className="flex items-center gap-[0.4em]">
                  <FileText className="w-[0.9em] h-[0.9em] text-agent-brain/70" />
                  <span className="text-white/80 text-[0.75em] truncate flex-1">{doc.name}</span>
                </div>
                <div className="text-white/40 text-[0.6em] mt-[0.2em]">{doc.pages} pages indexées</div>
              </div>
            ))}
          </div>

          <div 
            className={cn(
              "mt-[0.8em] p-[0.7em] rounded-xl bg-agent-brain/20 border border-agent-brain/30 transition-all duration-700",
              showDocs ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="text-agent-brain font-bold text-[1.1em]">5 docs</div>
            <div className="text-agent-brain/70 text-[0.65em]">indexés dans la base</div>
          </div>
        </div>

        {/* Center - Chat */}
        <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 p-[1.2em] overflow-auto flex flex-col">
            {/* Welcome */}
            <div 
              className={cn(
                "text-center mb-[1.5em] transition-all duration-700",
                showQuestion ? "opacity-30 scale-90" : "opacity-100 scale-100"
              )}
            >
              <Brain className="w-[3em] h-[3em] mx-auto mb-[0.5em] text-agent-brain/40" />
              <p className="text-white/50 text-[0.85em]">Posez n'importe quelle question</p>
            </div>

            {/* User question */}
            <div 
              className={cn(
                "flex justify-end mb-[1em] transition-all duration-700",
                showQuestion ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <div className="max-w-[70%] p-[0.8em] rounded-2xl rounded-br-sm bg-agent-brain text-white">
                <p className="text-[0.85em]">Quelle est notre politique de remboursement pour les clients entreprise ?</p>
              </div>
            </div>

            {/* AI Thinking */}
            {showThinking && !showResponse && (
              <div className="flex gap-[0.6em] mb-[1em] animate-fade-in">
                <div className="w-[2em] h-[2em] rounded-full bg-agent-brain/30 flex items-center justify-center">
                  <Brain className="w-[1em] h-[1em] text-agent-brain animate-pulse" />
                </div>
                <div className="p-[0.8em] rounded-2xl rounded-bl-sm bg-white/5 border border-white/10">
                  <div className="flex items-center gap-[0.6em]">
                    <div className="flex gap-[0.2em]">
                      <span className="w-[0.4em] h-[0.4em] rounded-full bg-agent-brain animate-bounce" />
                      <span className="w-[0.4em] h-[0.4em] rounded-full bg-agent-brain animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-[0.4em] h-[0.4em] rounded-full bg-agent-brain animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-white/60 text-[0.75em]">Recherche dans 5 documents...</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Response */}
            <div 
              className={cn(
                "flex gap-[0.6em] transition-all duration-700",
                showResponse ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <div className="w-[2em] h-[2em] rounded-full bg-agent-brain/30 flex items-center justify-center shrink-0">
                <Brain className="w-[1em] h-[1em] text-agent-brain" />
              </div>
              <div className="flex-1 max-w-[85%]">
                <div className="p-[0.8em] rounded-2xl rounded-bl-sm bg-white/5 border border-white/10 mb-[0.6em]">
                  <p className="text-white/90 text-[0.8em] leading-relaxed">
                    Selon notre <span className="text-agent-brain font-medium">Politique RH (section 4.2)</span>, les remboursements pour clients entreprise suivent ces règles :
                  </p>
                  <ul className="mt-[0.5em] space-y-[0.3em] text-white/70 text-[0.75em]">
                    <li className="flex items-start gap-[0.4em]">
                      <span className="text-agent-brain">•</span>
                      <span>Remboursement intégral dans les <strong className="text-white">30 premiers jours</strong></span>
                    </li>
                    <li className="flex items-start gap-[0.4em]">
                      <span className="text-agent-brain">•</span>
                      <span>Au prorata pour les contrats annuels pendant les <strong className="text-white">3 premiers mois</strong></span>
                    </li>
                    <li className="flex items-start gap-[0.4em]">
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
                  <div className="flex items-center gap-[0.4em] mb-[0.4em]">
                    <Link2 className="w-[0.9em] h-[0.9em] text-white/50" />
                    <span className="text-white/50 text-[0.65em]">Sources</span>
                  </div>
                  <div className="flex flex-wrap gap-[0.3em]">
                    {[
                      { doc: 'Politique RH.pdf', page: 'p.12-14' },
                      { doc: 'Contrats types.docx', page: 'p.8' },
                      { doc: 'FAQ Produit.pdf', page: 'p.23' },
                    ].map((source, i) => (
                      <span 
                        key={source.doc}
                        className="px-[0.5em] py-[0.25em] rounded-lg bg-agent-brain/20 border border-agent-brain/30 text-agent-brain text-[0.6em] transition-all duration-500"
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
          <div className="p-[0.8em] border-t border-white/10">
            <div className="flex items-center gap-[0.6em] p-[0.6em] rounded-xl bg-white/5 border border-white/10">
              <MessageSquare className="w-[1.1em] h-[1.1em] text-white/40" />
              <span className="flex-1 text-white/40 text-[0.8em]">Posez votre question...</span>
              <button className="p-[0.4em] rounded-lg bg-agent-brain text-white">
                <Zap className="w-[0.9em] h-[0.9em]" />
              </button>
            </div>
          </div>
        </div>

        {/* Right - AI Tools */}
        <div 
          className={cn(
            "w-[22%] bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-[1em] transition-all duration-700 flex flex-col",
            showTools ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          )}
        >
          <div className="flex items-center gap-[0.5em] mb-[1em]">
            <Sparkles className="w-[1.1em] h-[1.1em] text-amber-400" />
            <span className="text-white font-semibold text-[0.95em]">Outils IA</span>
          </div>

          <div className="flex-1 flex flex-col gap-[0.4em]">
            {[
              { name: 'Recherche web', icon: Globe, color: 'text-blue-400', active: true },
              { name: 'Analyse image', icon: ImageIcon, color: 'text-pink-400' },
              { name: 'Génération code', icon: Code, color: 'text-green-400' },
              { name: 'Résumé document', icon: BookOpen, color: 'text-amber-400' },
            ].map((tool, i) => (
              <div 
                key={tool.name}
                className={cn(
                  "p-[0.6em] rounded-xl border transition-all duration-500",
                  tool.active 
                    ? "bg-white/10 border-white/20" 
                    : "bg-white/5 border-white/10"
                )}
                style={{ 
                  transitionDelay: `${i * 100 + 200}ms`,
                  opacity: showTools ? 1 : 0
                }}
              >
                <div className="flex items-center gap-[0.4em]">
                  <tool.icon className={cn("w-[0.9em] h-[0.9em]", tool.color)} />
                  <span className="text-white/80 text-[0.8em]">{tool.name}</span>
                </div>
                {tool.active && (
                  <div className="mt-[0.3em] text-[0.6em] text-white/50">Activé pour cette session</div>
                )}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div 
            className={cn(
              "mt-[0.8em] p-[0.7em] rounded-xl bg-gradient-to-br from-agent-brain/30 to-violet-500/20 border border-agent-brain/30 transition-all duration-700",
              showFinal ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="grid grid-cols-2 gap-[0.5em] text-center">
              <div>
                <div className="text-[1.1em] font-bold text-white">4</div>
                <div className="text-white/50 text-[0.6em]">Outils IA</div>
              </div>
              <div>
                <div className="text-[1.1em] font-bold text-agent-brain">RAG</div>
                <div className="text-white/50 text-[0.6em]">Précision</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
