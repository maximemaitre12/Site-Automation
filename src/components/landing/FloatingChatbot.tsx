import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Loader2, ArrowRight, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/public-chat`;

const QUICK_PROMPTS = [
  "What AI agents do you build?",
  "How does GxP compliance work?",
  "Tell me about your methodology",
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
      {/* Floating trigger — pill button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 group"
          aria-label="Open chat"
        >
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-[#0369A1]/15 shadow-[0_8px_40px_rgba(3,105,161,0.15)] transition-all duration-300 group-hover:shadow-[0_12px_48px_rgba(3,105,161,0.25)] group-hover:scale-[1.03] group-hover:border-[#0369A1]/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0369A1] to-[#0c4a6e] flex items-center justify-center shadow-[0_2px_8px_rgba(3,105,161,0.3)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[13px] font-semibold text-[#0c4a6e] tracking-tight pr-0.5">
              Ask Aether
            </span>
          </div>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-50 flex flex-col overflow-hidden
            bottom-0 right-0 w-full h-[100dvh]
            sm:bottom-5 sm:right-5 sm:w-[400px] sm:h-[580px] sm:rounded-2xl
            bg-white shadow-[0_32px_80px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]"
          style={{ animation: "chatPanelIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}
        >
          {/* Header */}
          <div className="relative shrink-0 px-5 py-4 bg-gradient-to-br from-[#0369A1] via-[#075985] to-[#0c4a6e] overflow-hidden">
            {/* Mesh decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/[0.04] blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/[0.03] blur-xl" />
            <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-white/20 animate-pulse" />
            <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 rounded-full bg-white/30 animate-pulse [animation-delay:1s]" />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-white tracking-[-0.01em]">
                    Aether Intelligence
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                    </span>
                    <p className="text-[11px] text-white/60 font-medium tracking-wide uppercase">
                      Enterprise AI Assistant
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[#f8fafb]">
            {messages.length === 0 && (
              <div className="flex flex-col items-center pt-6 pb-2">
                {/* Animated orb */}
                <div className="relative w-16 h-16 mb-5">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0369A1]/20 to-[#0369A1]/5 animate-pulse" />
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#0369A1]/10 to-transparent" style={{ animation: "shimmerOrb 3s ease-in-out infinite" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-[#0369A1]" />
                  </div>
                </div>
                <p className="text-[16px] font-semibold text-[#0f172a] mb-1 tracking-[-0.01em]">
                  What can we solve for you?
                </p>
                <p className="text-[12px] text-[#64748b] text-center max-w-[240px] leading-relaxed">
                  Powered by our proprietary RAG knowledge base
                </p>
                
                {/* Quick prompts */}
                <div className="w-full mt-6 space-y-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => send(prompt)}
                      className="w-full text-left px-4 py-3 rounded-xl bg-white border border-[#e8ecf0] text-[13px] text-[#334155] transition-all duration-200 flex items-center justify-between group
                        border-l-[3px] border-l-[#0369A1]/30 hover:border-l-[#0369A1]
                        hover:bg-[#f0f7fc] hover:shadow-[0_2px_12px_rgba(3,105,161,0.08)] hover:-translate-y-px"
                    >
                      <span className="font-medium">{prompt}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#94a3b8] group-hover:text-[#0369A1] group-hover:translate-x-0.5 transition-all duration-200 shrink-0 ml-2" />
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
                  animation: "msgFadeIn 0.3s ease-out both",
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {msg.role === "assistant" && (
                  <div className={`relative w-6 h-6 rounded-full bg-gradient-to-br from-[#0369A1] to-[#0c4a6e] flex items-center justify-center shrink-0 mr-2.5 mt-0.5 ${isLoading && i === messages.length - 1 ? 'ring-2 ring-[#0369A1]/20 ring-offset-1' : ''}`}>
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 text-[13.5px] leading-[1.6] ${
                    msg.role === "user"
                      ? "rounded-2xl rounded-br-md bg-[#0369A1] text-white shadow-[0_2px_8px_rgba(3,105,161,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]"
                      : "rounded-2xl rounded-bl-md bg-white text-[#1e293b] shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-[#f0f2f5] border-l-[3px] border-l-[#0369A1]/20"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none [&>p]:m-0 [&>p+p]:mt-2 [&>ul]:mt-1 [&>ul]:mb-0 [&>ol]:mt-1 [&>ol]:mb-0 [&>ul>li]:text-[13.5px] [&>ol>li]:text-[13.5px]">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start" style={{ animation: "msgFadeIn 0.3s ease-out" }}>
                <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-[#0369A1] to-[#0c4a6e] flex items-center justify-center shrink-0 mr-2.5 mt-0.5 ring-2 ring-[#0369A1]/20 ring-offset-1">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-[#f0f2f5] border-l-[3px] border-l-[#0369A1]/20">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0369A1]/60" style={{ animation: "wave 1.4s ease-in-out infinite" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0369A1]/60" style={{ animation: "wave 1.4s ease-in-out 0.2s infinite" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0369A1]/60" style={{ animation: "wave 1.4s ease-in-out 0.4s infinite" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="shrink-0 px-4 py-3 border-t border-[#eef0f3] bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask us anything..."
                className="flex-1 text-[13px] px-4 py-2.5 rounded-xl bg-[#f4f6f8] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] outline-none focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.04),0_0_0_2px_rgba(3,105,161,0.12)] transition-all placeholder:text-[#94a3b8]"
                style={{ color: "#0f172a" }}
                disabled={isLoading}
              />
              <button
                onClick={() => send()}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-25 bg-gradient-to-br from-[#0369A1] to-[#0c4a6e] hover:shadow-[0_4px_16px_rgba(3,105,161,0.3)] active:scale-95 group"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Sparkles className="w-2.5 h-2.5 text-[#c0c8d4]" />
              <p className="text-[10px] text-[#b0b8c4] font-medium tracking-wide">
                Aether Intelligence
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatPanelIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes shimmerOrb {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wave {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
