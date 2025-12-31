import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TechnicalDiagramsProps {
  sceneId: string;
  progress: number;
}

// HR Agent - Neural Network Style
function HRDiagram({ progress }: { progress: number }) {
  const activePhase = Math.floor((progress / 100) * 6);
  
  return (
    <div className="relative h-28 bg-gradient-to-br from-rose-50 to-pink-50/50 rounded-xl border border-rose-200/30 overflow-hidden p-3">
      {/* Neural network layers */}
      <div className="absolute inset-0 flex items-center justify-between px-6">
        {/* Input layer - CV features */}
        <div className="flex flex-col gap-1">
          {['Skills', 'Exp.', 'Edu.', 'Lang.'].map((label, i) => (
            <div
              key={i}
              className={cn(
                "w-12 h-5 rounded-md flex items-center justify-center text-[7px] font-mono transition-all duration-500",
                activePhase > 0 ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30" : "bg-rose-200 text-rose-600"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Hidden layer 1 - Feature extraction */}
        <div className="flex flex-col gap-0.5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                activePhase > 1 ? "bg-gradient-to-br from-rose-400 to-pink-500 shadow-md" : "bg-rose-200"
              )}
              style={{ transitionDelay: `${i * 50}ms` }}
            />
          ))}
        </div>

        {/* Hidden layer 2 - Embedding */}
        <div className="flex flex-col gap-0.5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activePhase > 2 ? "bg-gradient-to-br from-pink-400 to-purple-500" : "bg-pink-200"
              )}
              style={{ transitionDelay: `${i * 40}ms` }}
            />
          ))}
        </div>

        {/* Attention layer */}
        <div className="relative">
          <div className={cn(
            "w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all duration-500",
            activePhase > 3 ? "border-purple-500 bg-purple-500/10" : "border-purple-200"
          )}>
            <div className="text-[8px] font-mono text-purple-600 text-center leading-tight">
              Attention<br/>768D
            </div>
          </div>
          {activePhase > 3 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>

        {/* Output - Similarity scores */}
        <div className="flex flex-col gap-1">
          {[
            { score: '94%', color: 'bg-emerald-500' },
            { score: '87%', color: 'bg-emerald-400' },
            { score: '72%', color: 'bg-yellow-500' },
          ].map((item, i) => (
            <div
              key={i}
              className={cn(
                "h-6 rounded-md flex items-center gap-1 px-2 transition-all duration-500",
                activePhase > 4 ? `${item.color} text-white shadow-lg` : "bg-gray-200"
              )}
              style={{ 
                width: activePhase > 4 ? `${parseInt(item.score) * 0.5 + 20}px` : '40px',
                transitionDelay: `${i * 100}ms` 
              }}
            >
              <span className="text-[8px] font-bold">{activePhase > 4 ? item.score : '...'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <linearGradient id="hrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {activePhase > 1 && [...Array(20)].map((_, i) => (
          <line
            key={i}
            x1={`${15 + Math.random() * 10}%`}
            y1={`${20 + (i % 4) * 20}%`}
            x2={`${85 - Math.random() * 10}%`}
            y2={`${20 + Math.random() * 60}%`}
            stroke="url(#hrGrad)"
            strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* Metrics overlay */}
      <div className="absolute bottom-1 right-2 flex gap-2">
        {[
          { label: 'Precision', value: '95.2%' },
          { label: 'F1', value: '0.94' },
          { label: 'Latency', value: '120ms' },
        ].map((m, i) => (
          <div key={i} className={cn(
            "text-[8px] font-mono transition-opacity duration-500",
            activePhase > 4 ? "opacity-100" : "opacity-0"
          )} style={{ transitionDelay: `${i * 150}ms` }}>
            <span className="text-rose-600">{m.value}</span>
            <span className="text-rose-400 ml-0.5">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sales Agent - Pipeline/Funnel Style
function SalesDiagram({ progress }: { progress: number }) {
  const activePhase = Math.floor((progress / 100) * 5);
  
  return (
    <div className="relative h-28 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-xl border border-amber-200/30 overflow-hidden p-2">
      {/* Funnel visualization */}
      <div className="flex h-full gap-1">
        {/* Data ingestion column */}
        <div className="w-16 flex flex-col gap-0.5 justify-center">
          {['CRM', 'Calls', 'Email', 'Web'].map((src, i) => (
            <div
              key={i}
              className={cn(
                "h-5 rounded text-[7px] font-mono flex items-center justify-center transition-all duration-400",
                activePhase > 0 ? "bg-amber-500 text-white" : "bg-amber-200 text-amber-700"
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {src}
            </div>
          ))}
        </div>

        {/* Feature engineering */}
        <div className="flex-1 flex flex-col justify-center relative">
          <div className={cn(
            "absolute inset-2 rounded-lg border-2 border-dashed transition-all duration-500",
            activePhase > 1 ? "border-orange-400 bg-orange-100/50" : "border-orange-200"
          )}>
            <div className="absolute top-1 left-2 text-[7px] font-mono text-orange-600">Feature Engineering</div>
            <div className="flex flex-wrap gap-1 p-1 pt-4 justify-center">
              {['recency', 'frequency', 'monetary', 'engagement', 'sentiment', 'velocity'].map((f, i) => (
                <div
                  key={i}
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[6px] font-mono transition-all duration-300",
                    activePhase > 1 ? "bg-orange-400 text-white" : "bg-orange-200 text-orange-600"
                  )}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ML Model block */}
        <div className="w-20 flex flex-col justify-center">
          <div className={cn(
            "relative rounded-xl p-2 transition-all duration-500",
            activePhase > 2 ? "bg-gradient-to-br from-orange-500 to-red-500 shadow-xl shadow-orange-500/30" : "bg-orange-200"
          )}>
            <div className="text-[8px] font-bold text-white text-center">XGBoost</div>
            <div className="text-[6px] text-white/80 text-center">147 features</div>
            <div className="mt-1 flex gap-0.5 justify-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1.5 h-4 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="w-full bg-white transition-all duration-500"
                    style={{ height: activePhase > 2 ? `${60 + Math.random() * 40}%` : '0%' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Output predictions */}
        <div className="w-24 flex flex-col gap-1 justify-center">
          {[
            { deal: 'Acme Corp', prob: 92, trend: '↑' },
            { deal: 'TechStart', prob: 78, trend: '→' },
            { deal: 'BigRetail', prob: 45, trend: '↓' },
          ].map((d, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-1 p-1 rounded transition-all duration-500",
                activePhase > 3 ? "bg-white shadow-md" : "bg-amber-100"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={cn(
                "w-8 h-1.5 rounded-full overflow-hidden bg-gray-200"
              )}>
                <div 
                  className={cn(
                    "h-full transition-all duration-700",
                    d.prob > 80 ? "bg-emerald-500" : d.prob > 60 ? "bg-amber-500" : "bg-red-400"
                  )}
                  style={{ width: activePhase > 3 ? `${d.prob}%` : '0%' }}
                />
              </div>
              <span className="text-[7px] font-mono text-gray-600 truncate">{d.deal}</span>
              <span className={cn(
                "text-[8px]",
                d.trend === '↑' ? 'text-emerald-500' : d.trend === '↓' ? 'text-red-400' : 'text-gray-400'
              )}>{d.trend}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance badge */}
      {activePhase > 3 && (
        <div className="absolute top-1 right-2 px-2 py-0.5 bg-emerald-500 text-white text-[7px] font-bold rounded-full animate-pulse">
          AUC: 0.94
        </div>
      )}
    </div>
  );
}

// Support Agent - Decision Tree Style
function SupportDiagram({ progress }: { progress: number }) {
  const activePhase = Math.floor((progress / 100) * 5);
  
  return (
    <div className="relative h-28 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-xl border border-emerald-200/30 overflow-hidden p-2">
      {/* Tree structure */}
      <div className="relative h-full">
        {/* Root node */}
        <div className={cn(
          "absolute left-1/2 top-1 -translate-x-1/2 px-3 py-1 rounded-lg text-[8px] font-mono transition-all duration-500",
          activePhase > 0 ? "bg-emerald-500 text-white shadow-lg" : "bg-emerald-200"
        )}>
          Ticket Input
        </div>

        {/* Level 1 - Intent classification */}
        <div className="absolute top-8 left-0 right-0 flex justify-around px-4">
          {['Technical', 'Billing', 'Feature', 'Account'].map((intent, i) => (
            <div
              key={i}
              className={cn(
                "px-2 py-0.5 rounded text-[7px] font-mono transition-all duration-400",
                activePhase > 1 
                  ? i === 0 ? "bg-teal-500 text-white ring-2 ring-teal-300" : "bg-teal-200 text-teal-700"
                  : "bg-gray-200"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {intent}
            </div>
          ))}
        </div>

        {/* Level 2 - Knowledge retrieval */}
        <div className={cn(
          "absolute top-16 left-4 right-4 h-8 rounded-lg border transition-all duration-500 flex items-center gap-2 px-2",
          activePhase > 2 ? "border-teal-400 bg-teal-50" : "border-gray-200"
        )}>
          <div className="text-[7px] text-teal-600 font-mono">KB Search:</div>
          <div className="flex gap-1 flex-1 overflow-hidden">
            {['doc_auth_reset', 'kb_2fa_setup', 'faq_password'].map((doc, i) => (
              <div
                key={i}
                className={cn(
                  "px-1.5 py-0.5 rounded text-[6px] font-mono whitespace-nowrap transition-all duration-300",
                  activePhase > 2 ? "bg-teal-400 text-white" : "bg-gray-200"
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {doc}
              </div>
            ))}
          </div>
          {activePhase > 2 && (
            <div className="text-[8px] text-emerald-600 font-bold">0.94 sim</div>
          )}
        </div>

        {/* Output nodes */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-around px-2">
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-500",
            activePhase > 3 ? "bg-emerald-500 text-white shadow-lg" : "bg-gray-200"
          )}>
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <span className="text-[7px] font-mono">Auto-resolve</span>
            <span className="text-[8px] font-bold">72%</span>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-500",
            activePhase > 3 ? "bg-amber-500 text-white" : "bg-gray-200"
          )}>
            <span className="text-[7px] font-mono">Escalate</span>
            <span className="text-[8px] font-bold">28%</span>
          </div>
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {activePhase > 0 && (
            <>
              <line x1="50%" y1="20" x2="20%" y2="32" stroke="#10b981" strokeWidth="1" opacity="0.4" />
              <line x1="50%" y1="20" x2="40%" y2="32" stroke="#10b981" strokeWidth="1" opacity="0.4" />
              <line x1="50%" y1="20" x2="60%" y2="32" stroke="#10b981" strokeWidth="1" opacity="0.4" />
              <line x1="50%" y1="20" x2="80%" y2="32" stroke="#10b981" strokeWidth="1" opacity="0.4" />
            </>
          )}
        </svg>
      </div>

      {/* Response time badge */}
      {activePhase > 3 && (
        <div className="absolute top-1 right-2 flex items-center gap-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-mono text-emerald-600">12s avg</span>
        </div>
      )}
    </div>
  );
}

// Brain Agent - RAG Architecture
function BrainDiagram({ progress }: { progress: number }) {
  const activePhase = Math.floor((progress / 100) * 6);
  
  return (
    <div className="relative h-28 bg-gradient-to-br from-violet-50 to-purple-50/50 rounded-xl border border-violet-200/30 overflow-hidden p-2">
      <div className="flex h-full gap-2">
        {/* Document ingestion */}
        <div className="w-14 flex flex-col gap-0.5 justify-center">
          {['📄 PDF', '📝 Doc', '📊 CSV', '🔗 URL'].map((doc, i) => (
            <div
              key={i}
              className={cn(
                "px-1 py-0.5 rounded text-[7px] transition-all duration-400",
                activePhase > 0 ? "bg-violet-100 border border-violet-300" : "bg-gray-100"
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {doc}
            </div>
          ))}
        </div>

        {/* Chunking visualization */}
        <div className={cn(
          "w-12 rounded-lg border-2 border-dashed flex flex-col gap-0.5 p-1 justify-center transition-all duration-500",
          activePhase > 1 ? "border-purple-400" : "border-gray-200"
        )}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                activePhase > 1 ? "bg-purple-400" : "bg-gray-200"
              )}
              style={{ 
                width: `${60 + Math.random() * 40}%`,
                transitionDelay: `${i * 40}ms` 
              }}
            />
          ))}
          <div className="text-[6px] text-purple-500 text-center mt-1">512 tok</div>
        </div>

        {/* Vector DB */}
        <div className={cn(
          "w-16 rounded-xl p-1 flex flex-col items-center justify-center transition-all duration-500",
          activePhase > 2 ? "bg-gradient-to-br from-purple-500 to-violet-600 shadow-xl" : "bg-gray-200"
        )}>
          <div className="grid grid-cols-4 gap-0.5 mb-1">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-sm transition-all duration-200",
                  activePhase > 2 ? "bg-white/60" : "bg-gray-300"
                )}
                style={{ transitionDelay: `${i * 20}ms` }}
              />
            ))}
          </div>
          <div className="text-[7px] font-mono text-white">VectorDB</div>
          <div className="text-[6px] text-white/70">1536D</div>
        </div>

        {/* Semantic search */}
        <div className="flex-1 flex flex-col justify-center">
          <div className={cn(
            "relative p-2 rounded-lg transition-all duration-500",
            activePhase > 3 ? "bg-violet-100 border border-violet-300" : "bg-gray-100"
          )}>
            <div className="text-[7px] font-mono text-violet-600 mb-1">Semantic Search</div>
            <div className="flex gap-1">
              {[0.94, 0.89, 0.82, 0.78, 0.71].map((score, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded overflow-hidden bg-gray-200 h-3"
                  )}
                >
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      i < 2 ? "bg-violet-500" : "bg-violet-300"
                    )}
                    style={{ 
                      height: activePhase > 3 ? `${score * 100}%` : '0%',
                      transitionDelay: `${i * 80}ms`
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="text-[6px] text-violet-500 mt-1">Top-K: 5</div>
          </div>
        </div>

        {/* LLM output */}
        <div className="w-16 flex flex-col justify-center">
          <div className={cn(
            "rounded-xl p-2 transition-all duration-500",
            activePhase > 4 ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl" : "bg-gray-200"
          )}>
            <div className="text-[7px] font-bold text-white text-center">LLM</div>
            <div className="text-[6px] text-white/80 text-center">Gemini Pro</div>
            {activePhase > 4 && (
              <div className="mt-1 flex justify-center">
                <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Latency indicator */}
      {activePhase > 4 && (
        <div className="absolute bottom-1 right-2 text-[8px] font-mono">
          <span className="text-violet-600">~800ms</span>
          <span className="text-violet-400 ml-1">e2e</span>
        </div>
      )}
    </div>
  );
}

// Compliance Agent - Scanning Grid
function ComplianceDiagram({ progress }: { progress: number }) {
  const activePhase = Math.floor((progress / 100) * 5);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (activePhase > 1) {
      setScanProgress(Math.min((progress - 20) * 1.5, 100));
    }
  }, [progress, activePhase]);
  
  return (
    <div className="relative h-28 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-200/30 overflow-hidden p-2">
      <div className="flex h-full gap-2">
        {/* Document scanner */}
        <div className="w-20 relative">
          <div className={cn(
            "absolute inset-0 rounded-lg border-2 transition-all duration-500",
            activePhase > 0 ? "border-blue-400 bg-blue-50" : "border-gray-200"
          )}>
            {/* Scan lines */}
            {activePhase > 1 && (
              <div 
                className="absolute left-0 right-0 h-0.5 bg-blue-500 opacity-70"
                style={{ 
                  top: `${scanProgress}%`,
                  boxShadow: '0 0 10px #3b82f6'
                }}
              />
            )}
            {/* Detected items */}
            <div className="p-1.5 flex flex-col gap-1">
              {[
                { type: 'email', pos: 15, found: activePhase > 2 },
                { type: 'phone', pos: 35, found: activePhase > 2 },
                { type: 'SSN', pos: 55, found: activePhase > 3 },
                { type: 'IBAN', pos: 75, found: activePhase > 3 },
              ].map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2 rounded transition-all duration-300",
                    item.found ? "bg-red-400" : "bg-gray-200"
                  )}
                  style={{ 
                    width: `${40 + Math.random() * 50}%`,
                    opacity: item.found ? 1 : 0.3
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Detection types */}
        <div className="flex-1 flex flex-col justify-center gap-1">
          <div className="text-[7px] font-mono text-blue-600 mb-1">PII Detection Engine</div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { type: 'Email', count: 12, color: 'bg-red-400' },
              { type: 'Phone', count: 8, color: 'bg-orange-400' },
              { type: 'SSN', count: 3, color: 'bg-red-600' },
              { type: 'IBAN', count: 2, color: 'bg-red-500' },
              { type: 'Address', count: 15, color: 'bg-yellow-500' },
              { type: 'Name', count: 24, color: 'bg-amber-400' },
            ].map((item, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-1 px-1 py-0.5 rounded text-[7px] transition-all duration-400",
                  activePhase > 2 ? "bg-white shadow-sm border border-gray-200" : "bg-gray-100"
                )}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className={cn("w-2 h-2 rounded-sm", item.color)} />
                <span className="font-mono">{item.type}</span>
                {activePhase > 3 && <span className="text-gray-500 ml-auto">{item.count}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Risk score output */}
        <div className="w-20 flex flex-col justify-center items-center">
          <div className={cn(
            "relative w-16 h-16 rounded-full border-4 transition-all duration-500",
            activePhase > 3 ? "border-red-400" : "border-gray-200"
          )}>
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke={activePhase > 3 ? "#f87171" : "#e5e7eb"}
                strokeWidth="4"
                strokeDasharray={`${activePhase > 3 ? 72 : 0} 100`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn(
                "text-lg font-bold transition-all duration-500",
                activePhase > 3 ? "text-red-500" : "text-gray-400"
              )}>
                {activePhase > 3 ? '72' : '--'}
              </span>
              <span className="text-[6px] text-gray-500">Risk Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance status */}
      {activePhase > 3 && (
        <div className="absolute top-1 right-2 flex items-center gap-1 px-2 py-0.5 bg-red-100 border border-red-300 rounded-full">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[7px] font-mono text-red-600">GDPR Risk Detected</span>
        </div>
      )}
    </div>
  );
}

// Flow Agent - Event Stream
function FlowDiagram({ progress }: { progress: number }) {
  const activePhase = Math.floor((progress / 100) * 5);
  
  return (
    <div className="relative h-28 bg-gradient-to-br from-cyan-50 to-sky-50/50 rounded-xl border border-cyan-200/30 overflow-hidden p-2">
      <div className="flex h-full gap-1">
        {/* Event sources */}
        <div className="w-14 flex flex-col gap-0.5 justify-center">
          {['Webhook', 'Schedule', 'DB Event', 'API Call'].map((src, i) => (
            <div
              key={i}
              className={cn(
                "px-1 py-0.5 rounded text-[7px] font-mono text-center transition-all duration-400",
                activePhase > 0 ? "bg-cyan-500 text-white" : "bg-cyan-200"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {src}
            </div>
          ))}
        </div>

        {/* Message queue visualization */}
        <div className="flex-1 relative">
          <div className={cn(
            "absolute inset-1 rounded-lg border-2 transition-all duration-500",
            activePhase > 1 ? "border-sky-400 bg-sky-50" : "border-gray-200"
          )}>
            <div className="absolute top-0.5 left-1 text-[6px] text-sky-600 font-mono">Message Queue</div>
            <div className="absolute top-4 left-1 right-1 bottom-1 flex gap-0.5 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded transition-all duration-200",
                    activePhase > 1 && i < 8 ? "bg-gradient-to-b from-sky-400 to-cyan-500" : "bg-gray-200"
                  )}
                  style={{ 
                    height: `${30 + Math.random() * 60}%`,
                    alignSelf: 'flex-end',
                    transitionDelay: `${i * 40}ms`
                  }}
                />
              ))}
            </div>
          </div>
          {/* Throughput indicator */}
          {activePhase > 2 && (
            <div className="absolute bottom-0 left-1 text-[7px] font-mono text-sky-600">
              10.2K msg/s
            </div>
          )}
        </div>

        {/* Orchestrator */}
        <div className="w-18 flex flex-col justify-center">
          <div className={cn(
            "rounded-xl p-1.5 transition-all duration-500",
            activePhase > 2 ? "bg-gradient-to-br from-sky-500 to-blue-600 shadow-xl" : "bg-gray-200"
          )}>
            <div className="text-[7px] font-bold text-white text-center">Orchestrator</div>
            <div className="mt-1 grid grid-cols-2 gap-0.5">
              {['Route', 'Filter', 'Transform', 'Merge'].map((op, i) => (
                <div
                  key={i}
                  className="px-1 py-0.5 bg-white/20 rounded text-[5px] text-white text-center"
                >
                  {op}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent triggers */}
        <div className="w-16 flex flex-col gap-0.5 justify-center">
          {[
            { agent: 'HR', color: 'bg-rose-400' },
            { agent: 'Sales', color: 'bg-amber-400' },
            { agent: 'Support', color: 'bg-emerald-400' },
            { agent: 'Brain', color: 'bg-violet-400' },
          ].map((a, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-1 px-1 py-0.5 rounded transition-all duration-400",
                activePhase > 3 ? `${a.color} text-white shadow-sm` : "bg-gray-200"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <span className="text-[7px] font-mono">{a.agent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      {activePhase > 3 && (
        <div className="absolute top-1 right-2 flex gap-2">
          <div className="text-[7px] font-mono">
            <span className="text-cyan-600">P99:</span>
            <span className="text-cyan-500 ml-0.5">45ms</span>
          </div>
          <div className="text-[7px] font-mono">
            <span className="text-emerald-600">Uptime:</span>
            <span className="text-emerald-500 ml-0.5">99.9%</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Data Agent - ETL Pipeline
function DataDiagram({ progress }: { progress: number }) {
  const activePhase = Math.floor((progress / 100) * 5);
  
  return (
    <div className="relative h-28 bg-gradient-to-br from-slate-50 to-zinc-50/50 rounded-xl border border-slate-200/30 overflow-hidden p-2">
      <div className="flex h-full">
        {/* External sources */}
        <div className="w-16 flex flex-col gap-0.5 justify-center pr-1">
          {[
            { name: 'LinkedIn', icon: '🔗' },
            { name: 'Crunchbase', icon: '📊' },
            { name: 'SEC Filings', icon: '📑' },
            { name: 'News API', icon: '📰' },
          ].map((src, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-1 px-1 py-0.5 rounded text-[7px] transition-all duration-400",
                activePhase > 0 ? "bg-slate-600 text-white" : "bg-slate-200"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span>{src.icon}</span>
              <span className="font-mono truncate">{src.name}</span>
            </div>
          ))}
        </div>

        {/* ETL Pipeline stages */}
        <div className="flex-1 flex items-center gap-1 px-2">
          {[
            { stage: 'Extract', records: '1.2M' },
            { stage: 'Transform', records: '890K' },
            { stage: 'Enrich', records: '890K' },
            { stage: 'Load', records: '890K' },
          ].map((s, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center"
            >
              <div
                className={cn(
                  "w-full aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-500",
                  activePhase > i ? "bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg" : "bg-slate-200"
                )}
              >
                <span className="text-[7px] font-mono text-white">{s.stage}</span>
                {activePhase > i && (
                  <span className="text-[6px] text-slate-300">{s.records}</span>
                )}
              </div>
              {i < 3 && (
                <div className={cn(
                  "w-4 h-0.5 mt-1 transition-all duration-300",
                  activePhase > i ? "bg-emerald-400" : "bg-gray-300"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Output storage */}
        <div className="w-20 flex flex-col justify-center pl-1">
          <div className={cn(
            "rounded-xl p-2 transition-all duration-500",
            activePhase > 3 ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl" : "bg-slate-200"
          )}>
            <div className="text-[7px] font-bold text-white text-center">Data Lake</div>
            <div className="mt-1 text-center">
              <div className="text-[10px] font-bold text-white">2.4TB</div>
              <div className="text-[6px] text-white/70">50+ sources</div>
            </div>
          </div>
          {activePhase > 3 && (
            <div className="mt-1 text-[6px] font-mono text-center text-emerald-600">
              Refreshes: 5min
            </div>
          )}
        </div>
      </div>

      {/* Data freshness indicator */}
      {activePhase > 3 && (
        <div className="absolute top-1 right-2 flex items-center gap-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[7px] font-mono text-emerald-600">Live Sync</span>
        </div>
      )}
    </div>
  );
}

// Default/Intro diagram
function DefaultDiagram() {
  return (
    <div className="h-28 flex items-center justify-center">
      <div className="text-xs text-muted-foreground/50 font-mono">
        Technical architecture diagrams
      </div>
    </div>
  );
}

export function TechnicalDiagrams({ sceneId, progress }: TechnicalDiagramsProps) {
  switch (sceneId) {
    case 'hr': return <HRDiagram progress={progress} />;
    case 'sales': return <SalesDiagram progress={progress} />;
    case 'support': return <SupportDiagram progress={progress} />;
    case 'brain': return <BrainDiagram progress={progress} />;
    case 'compliance': return <ComplianceDiagram progress={progress} />;
    case 'flow': return <FlowDiagram progress={progress} />;
    case 'data': return <DataDiagram progress={progress} />;
    default: return <DefaultDiagram />;
  }
}
