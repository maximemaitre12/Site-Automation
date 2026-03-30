import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { MacWindow } from "../MacWindow";
import { useState, useEffect } from "react";

const files = [
  { name: "data.src", icon: "📄" },
  { name: "engine.ai", icon: "🧠", active: true },
  { name: "output.opt", icon: "📊" },
];

const sidebarFiles = [
  { name: "src/", indent: 0, isDir: true },
  { name: "connectors/", indent: 1, isDir: true },
  { name: "crm.ts", indent: 2, isDir: false },
  { name: "erp.ts", indent: 2, isDir: false },
  { name: "iot.ts", indent: 2, isDir: false },
  { name: "engine/", indent: 1, isDir: true },
  { name: "nlp.model", indent: 2, isDir: false },
  { name: "ml.pipeline", indent: 2, isDir: false },
  { name: "predict.ai", indent: 2, isDir: false },
  { name: "output/", indent: 1, isDir: true },
  { name: "dashboard.tsx", indent: 2, isDir: false },
  { name: "actions.json", indent: 2, isDir: false },
];

const codeBlocks: Record<string, { lines: string[]; highlights: number[] }> = {
  "data.src": {
    lines: [
      "// ═══ AETHER DATA CONNECTOR ═══",
      "",
      "import { CRM, ERP, IoT } from '@aether/sources'",
      "",
      "const pipeline = new DataPipeline({",
      "  sources: [CRM.salesforce, ERP.sap, IoT.sensors],",
      "  refresh: '5min',",
      "  dedup: true,",
      "  quality_score: 0.94,",
      "})",
      "",
      "// Collected: 2.4M records",
      "// Quality: ████████░░ 94%",
      "// Status: ● STREAMING",
    ],
    highlights: [4, 5, 6, 7, 8, 9],
  },
  "engine.ai": {
    lines: [
      "// ═══ AETHER AI ENGINE v2.8 ═══",
      "",
      "class IntelligenceEngine {",
      "  models = ['NLP', 'DeepLearning', 'LLM']",
      "",
      "  async analyze(data: Stream) {",
      "    const patterns = await this.detect(data)",
      "    const correlations = this.crossRef(patterns)",
      "    const predictions = this.forecast(correlations)",
      "",
      "    return {",
      "      insights: patterns.length,    // → 847",
      "      accuracy: correlations.score,  // → 96.2%",
      "      actions: predictions.items,    // → 23",
      "    }",
      "  }",
      "}",
      "",
      "// Processing: ████████████ 100%",
      "// Confidence: 96.2%",
    ],
    highlights: [5, 6, 7, 8, 11, 12, 13],
  },
  "output.opt": {
    lines: [
      "// ═══ AETHER DECISION OUTPUT ═══",
      "",
      "const results = await engine.optimize({",
      "  target: 'operational_efficiency',",
      "  constraints: ['budget', 'timeline'],",
      "})",
      "",
      "// ┌─────────────────────────────┐",
      "// │ RESULTATS OPTIMISATION      │",
      "// ├─────────────────────────────┤",
      "// │ Marge:     +12%             │",
      "// │ Coûts:     −40%             │",
      "// │ Vitesse:   ×2               │",
      "// │ Précision: 96.2%            │",
      "// └─────────────────────────────┘",
      "",
      "export { results }",
      "// Status: ● DEPLOYED",
    ],
    highlights: [10, 11, 12, 13],
  },
};

function CodeLine({ line, number, isHighlighted, isVisible, delay }: {
  line: string; number: number; isHighlighted: boolean; isVisible: boolean; delay: number;
}) {
  const colorize = (text: string) => {
    if (text.startsWith("//")) return <span className="text-slate-500">{text}</span>;
    if (text.startsWith("import")) return <><span className="text-purple-400">import</span><span className="text-slate-300">{text.slice(6)}</span></>;

    return text.split(/(\b(?:const|class|async|await|new|return|from|export)\b|'[^']*'|\b(?:true|false)\b|\/\/.*$|\d+\.?\d*%?)/g).map((part, i) => {
      if (/^(const|class|async|await|new|return|from|export)$/.test(part)) return <span key={i} className="text-purple-400">{part}</span>;
      if (/^'[^']*'$/.test(part)) return <span key={i} className="text-[hsl(200,80%,65%)]">{part}</span>;
      if (/^(true|false)$/.test(part)) return <span key={i} className="text-[hsl(260,70%,70%)]">{part}</span>;
      if (/^\d+\.?\d*%?$/.test(part)) return <span key={i} className="text-[hsl(200,80%,70%)]">{part}</span>;
      return <span key={i} className="text-slate-300">{part}</span>;
    });
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-3 py-[1px] font-mono text-[11px] leading-5 transition-all duration-300",
        isHighlighted && "bg-primary/10 border-l-2 border-primary/40",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="text-slate-600 select-none w-5 text-right shrink-0 text-[10px]">{number}</span>
      <span className="whitespace-pre">{colorize(line)}</span>
    </div>
  );
}

export function PositioningSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [activeFile, setActiveFile] = useState("engine.ai");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const code = codeBlocks[activeFile];

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(239_84%_67%/0.03),transparent_60%)]" />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn(
          "text-center mb-14 sm:mb-18 transition-all duration-600",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-3">Architecture</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            De la donnée brute à la décision optimisée
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Notre IA transforme vos données opérationnelles en leviers d'action concrets, couche par couche.
          </p>
        </div>

        <div className={cn(
          "transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        )}>
          <MacWindow
            title="AETHER PIPELINE EDITOR v1.8"
            variant="dark"
            toolbar={
              <div className="flex items-center gap-1">
                {files.map(f => (
                  <button
                    key={f.name}
                    onClick={() => setActiveFile(f.name)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono transition-all",
                      activeFile === f.name
                        ? "bg-slate-700 text-white border border-slate-600"
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <span className="text-xs">{f.icon}</span>
                    {f.name}
                  </button>
                ))}
              </div>
            }
            statusBar={
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500">UTF-8 · TypeScript</span>
                <span className="font-mono text-[10px] text-emerald-500">● Pipeline Active</span>
                <span className="font-mono text-[10px] text-slate-500">Ln {code.lines.length}, Col 1</span>
              </div>
            }
          >
            <div className="flex min-h-[300px] sm:min-h-[380px]">
              {/* Sidebar file tree — hidden on small screens */}
              <div className="hidden sm:block w-44 border-r border-slate-700/40 bg-slate-900/60 py-2 overflow-hidden">
                <div className="px-3 mb-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Explorer</span>
                </div>
                {sidebarFiles.map((f, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-0.5 text-[11px] font-mono cursor-default transition-all duration-300",
                      f.isDir ? "text-slate-400 font-semibold" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50",
                      isVisible ? "opacity-100" : "opacity-0"
                    )}
                    style={{ paddingLeft: `${f.indent * 12 + 12}px`, transitionDelay: `${i * 40}ms` }}
                  >
                    <span className="text-[10px]">{f.isDir ? "📁" : "📄"}</span>
                    {f.name}
                  </div>
                ))}
              </div>

              {/* Code editor */}
              <div className="flex-1 py-3 overflow-hidden bg-slate-900">
                {code.lines.map((line, i) => (
                  <CodeLine
                    key={`${activeFile}-${i}`}
                    line={line}
                    number={i + 1}
                    isHighlighted={code.highlights.includes(i)}
                    isVisible={isVisible}
                    delay={i * 30 + 200}
                  />
                ))}
                {/* Blinking cursor */}
                <div className="flex items-center gap-3 px-3 py-[1px]">
                  <span className="text-slate-600 w-5 text-right text-[10px] font-mono">{code.lines.length + 1}</span>
                  <span className={cn(
                    "w-[2px] h-4 bg-primary transition-opacity duration-100",
                    cursorVisible ? "opacity-100" : "opacity-0"
                  )} />
                </div>
              </div>
            </div>
          </MacWindow>
        </div>
      </div>
    </section>
  );
}
