import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Loader2, ArrowRight, Sparkles, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/public-chat`;

const QUICK_PROMPTS = [
  { text: "What AI agents do you build?", icon: Zap },
  { text: "How does GxP compliance work?", icon: Sparkles },
  { text: "Tell me about your methodology", icon: ArrowRight },
];

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const send = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;

    const userMsg: Msg = { role: "user", content: msg };
    if (!text) setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const allMessages = [...messages, userMsg];
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        upsertAssistant("Sorry, something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            /* ignore */
          }
        }
      }
    } catch (e) {
      console.error("Chat error:", e);
      upsertAssistant("Connection error. Please try again.");
    }

    setIsLoading(false);
  }, [input, isLoading, messages]);

  return (
    <>
      {/* ─── Floating Trigger ─── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 group"
          aria-label="Open chat"
        >
          <div className="relative flex items-center gap-3 pl-4 pr-5 py-3 rounded-full bg-[#0a1628]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_48px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-500 group-hover:shadow-[0_12px_56px_rgba(3,105,161,0.35),0_0_0_1px_rgba(3,105,161,0.2)] group-hover:scale-[1.02] group-hover:border-[#0369A1]/30">
            {/* Glow behind icon */}
            <div className="absolute left-3 w-10 h-10 rounded-full bg-[#0369A1]/20 blur-xl transition-all duration-500 group-hover:bg-[#0369A1]/40" />
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#0ea5e9] via-[#0369A1] to-[#0c4a6e] flex items-center justify-center shadow-[0_0_20px_rgba(3,105,161,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]" style={{ animation: "triggerPulse 3s ease-in-out infinite" }}>
              <Sparkles className="w-4.5 h-4.5 text-white drop-shadow-sm" />
            </div>
            <div className="relative flex flex-col">
              <span className="text-[13px] font-semibold text-white/95 tracking-[-0.01em] leading-none">
                Ask Aether
              </span>
              <span className="text-[9px] font-medium text-white/40 tracking-[0.08em] uppercase mt-0.5">
                AI Assistant
              </span>
            </div>
          </div>
        </button>
      )}

      {/* ─── Chat Panel ─── */}
      {open && (
        <div
          className="fixed z-50 flex flex-col overflow-hidden
            bottom-0 right-0 w-full h-[100dvh]
            sm:bottom-5 sm:right-5 sm:w-[420px] sm:h-[600px] sm:rounded-[20px]
            bg-[#0a0f1a] shadow-[0_40px_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)]"
          style={{ animation: "chatPanelIn 0.5s cubic-bezier(0.16,1,0.3,1)" }}
        >
          {/* ─── Header ─── */}
          <div className="relative shrink-0 px-5 py-5 overflow-hidden">
            {/* Ambient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0369A1]/8 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full bg-[#0369A1]/[0.06] blur-[80px]" />
            <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-[#0ea5e9]/[0.04] blur-[60px]" />
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }} />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0ea5e9] via-[#0369A1] to-[#0c4a6e] flex items-center justify-center shadow-[0_0_24px_rgba(3,105,161,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]">
                    <Sparkles className="w-5 h-5 text-white drop-shadow-sm" />
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0a0f1a] flex items-center justify-center">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-white tracking-[-0.02em]">
                    Aether Intelligence
                  </p>
                  <p className="text-[10px] text-white/35 font-medium tracking-[0.12em] uppercase mt-0.5">
                    Enterprise AI · Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-all duration-200 border border-transparent hover:border-white/[0.06]"
              >
                <X className="w-4 h-4 text-white/50 hover:text-white/80 transition-colors" />
              </button>
            </div>

            {/* Separator line */}
            <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          </div>

          {/* ─── Messages Area ─── */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5" style={{ background: "linear-gradient(180deg, #0a0f1a 0%, #0d1320 100%)" }}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center pt-8 pb-2">
                {/* Signature orb */}
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full bg-[#0369A1]/15" style={{ animation: "orbPulse 4s ease-in-out infinite" }} />
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#0ea5e9]/10 via-[#0369A1]/15 to-[#0c4a6e]/10" style={{ animation: "orbRotate 8s linear infinite" }} />
                  <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#0369A1]/20 to-transparent backdrop-blur-sm" style={{ animation: "shimmerOrb 3s ease-in-out infinite" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#0ea5e9]/80 drop-shadow-[0_0_12px_rgba(14,165,233,0.3)]" />
                  </div>
                </div>
                
                <p className="text-[18px] font-semibold text-white/90 mb-1.5 tracking-[-0.02em]">
                  How can we help?
                </p>
                <p className="text-[11px] text-white/30 text-center max-w-[260px] leading-relaxed font-medium tracking-wide">
                  Powered by Aether's proprietary knowledge engine
                </p>
                
                {/* Quick prompts */}
                <div className="w-full mt-8 space-y-2.5">
                  {QUICK_PROMPTS.map(({ text, icon: Icon }) => (
                    <button
                      key={text}
                      onClick={() => send(text)}
                      className="w-full text-left px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white/70 transition-all duration-300 flex items-center gap-3 group
                        hover:bg-white/[0.06] hover:border-[#0369A1]/20 hover:shadow-[0_4px_24px_rgba(3,105,161,0.08),inset_0_1px_0_rgba(255,255,255,0.04)] hover:-translate-y-px"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#0369A1]/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[#0369A1]/20 group-hover:shadow-[0_0_12px_rgba(3,105,161,0.15)]">
                        <Icon className="w-3.5 h-3.5 text-[#0ea5e9]/60 group-hover:text-[#0ea5e9] transition-colors duration-300" />
                      </div>
                      <span className="font-medium flex-1 group-hover:text-white/90 transition-colors duration-300">{text}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#0ea5e9]/60 group-hover:translate-x-0.5 transition-all duration-300 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className="chatMsg flex"
                style={{
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  animation: "msgFadeIn 0.35s ease-out both",
                  animationDelay: `${i * 0.04}s`,
                }}
              >
                {msg.role === "assistant" && (
                  <div className={`relative w-7 h-7 rounded-xl bg-gradient-to-br from-[#0ea5e9] via-[#0369A1] to-[#0c4a6e] flex items-center justify-center shrink-0 mr-2.5 mt-0.5 shadow-[0_0_12px_rgba(3,105,161,0.2)] ${isLoading && i === messages.length - 1 ? 'ring-2 ring-[#0369A1]/25 ring-offset-2 ring-offset-[#0a0f1a]' : ''}`}>
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 text-[13.5px] leading-[1.7] ${
                    msg.role === "user"
                      ? "rounded-2xl rounded-br-md bg-gradient-to-br from-[#0369A1] to-[#075985] text-white shadow-[0_4px_16px_rgba(3,105,161,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]"
                      : "rounded-2xl rounded-bl-md bg-white/[0.04] text-white/85 border border-white/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none [&>p]:m-0 [&>p+p]:mt-2 [&>ul]:mt-1 [&>ul]:mb-0 [&>ol]:mt-1 [&>ol]:mb-0 [&>ul>li]:text-[13.5px] [&>ol>li]:text-[13.5px] [&_a]:text-[#0ea5e9] [&_strong]:text-white/95 [&_code]:text-[#0ea5e9] [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start" style={{ animation: "msgFadeIn 0.35s ease-out" }}>
                <div className="relative w-7 h-7 rounded-xl bg-gradient-to-br from-[#0ea5e9] via-[#0369A1] to-[#0c4a6e] flex items-center justify-center shrink-0 mr-2.5 mt-0.5 shadow-[0_0_12px_rgba(3,105,161,0.2)] ring-2 ring-[#0369A1]/25 ring-offset-2 ring-offset-[#0a0f1a]">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="px-4 py-3.5 rounded-2xl rounded-bl-md bg-white/[0.04] border border-white/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]/50" style={{ animation: "wave 1.4s ease-in-out infinite" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]/50" style={{ animation: "wave 1.4s ease-in-out 0.15s infinite" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]/50" style={{ animation: "wave 1.4s ease-in-out 0.3s infinite" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── Input Area ─── */}
          <div className="shrink-0 px-4 py-3.5 bg-[#0a0f1a]">
            {/* Separator */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            
            <div className="flex items-center gap-2.5">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder="Ask anything..."
                  className="w-full text-[13px] px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.06] outline-none transition-all duration-300 placeholder:text-white/25 focus:bg-white/[0.07] focus:border-[#0369A1]/25 focus:shadow-[0_0_0_3px_rgba(3,105,161,0.08)]"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={() => send()}
                disabled={isLoading || !input.trim()}
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 disabled:opacity-20 bg-gradient-to-br from-[#0ea5e9] via-[#0369A1] to-[#075985] hover:shadow-[0_4px_20px_rgba(3,105,161,0.4),0_0_0_1px_rgba(14,165,233,0.2)] active:scale-95 group shadow-[0_2px_12px_rgba(3,105,161,0.25)]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-3 mb-0.5">
              <div className="w-1 h-1 rounded-full bg-[#0ea5e9]/30" />
              <p className="text-[9px] text-white/20 font-medium tracking-[0.15em] uppercase">
                Aether Intelligence
              </p>
              <div className="w-1 h-1 rounded-full bg-[#0ea5e9]/30" />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatPanelIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes triggerPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(3,105,161,0.4), inset 0 1px 0 rgba(255,255,255,0.15); }
          50% { box-shadow: 0 0 28px rgba(3,105,161,0.55), inset 0 1px 0 rgba(255,255,255,0.15); }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        @keyframes orbRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmerOrb {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wave {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
