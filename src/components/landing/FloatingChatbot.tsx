import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, ArrowRight } from "lucide-react";
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
      {/* Floating trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 group"
          aria-label="Open chat"
        >
          <div className="relative">
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#0369A1] animate-ping opacity-20" />
            <div className="relative w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-gradient-to-br from-[#0369A1] to-[#0c4a6e] flex items-center justify-center shadow-[0_8px_32px_rgba(3,105,161,0.4)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_40px_rgba(3,105,161,0.5)]">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-50 flex flex-col overflow-hidden
            bottom-0 right-0 w-full h-[100dvh]
            sm:bottom-5 sm:right-5 sm:w-[400px] sm:h-[560px] sm:rounded-2xl
            bg-white shadow-[0_24px_80px_rgba(0,0,0,0.15)] sm:border sm:border-[#e2e8f0]"
          style={{ animation: "chatSlideUp 0.3s cubic-bezier(0.16,1,0.3,1)" }}
        >
          {/* Header */}
          <div className="relative shrink-0 px-5 py-4 bg-gradient-to-br from-[#0369A1] to-[#0c4a6e] overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-white tracking-tight">
                    Aether Connect
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[11px] text-white/70 font-medium">
                      AI Assistant — Online
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-[#fafbfc]">
            {messages.length === 0 && (
              <div className="flex flex-col items-center pt-4 pb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0369A1]/10 to-[#0369A1]/5 flex items-center justify-center mb-4 border border-[#0369A1]/10">
                  <MessageCircle className="w-7 h-7 text-[#0369A1]" />
                </div>
                <p className="text-[15px] font-semibold text-[#0f172a] mb-1">
                  How can we help?
                </p>
                <p className="text-[13px] text-[#64748b] text-center max-w-[260px] leading-relaxed">
                  Ask about our AI agents, services, or methodology
                </p>
                
                {/* Quick prompts */}
                <div className="w-full mt-5 space-y-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => send(prompt)}
                      className="w-full text-left px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white text-[13px] text-[#334155] hover:border-[#0369A1]/30 hover:bg-[#f0f9ff] transition-all duration-200 flex items-center justify-between group"
                    >
                      <span>{prompt}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#94a3b8] group-hover:text-[#0369A1] transition-colors shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0369A1] to-[#0c4a6e] flex items-center justify-center shrink-0 mr-2 mt-0.5 shadow-sm">
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-2xl rounded-br-md bg-gradient-to-br from-[#0369A1] to-[#0c4a6e] text-white shadow-sm"
                      : "rounded-2xl rounded-bl-md bg-white text-[#1e293b] shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none [&>p]:m-0 [&>p+p]:mt-2 [&>ul]:mt-1 [&>ul]:mb-0 [&>ol]:mt-1 [&>ol]:mb-0 [&>ul>li]:text-[13px] [&>ol>li]:text-[13px]">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0369A1] to-[#0c4a6e] flex items-center justify-center shrink-0 mr-2 mt-0.5 shadow-sm">
                  <MessageCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#f1f5f9]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0369A1] animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0369A1] animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0369A1] animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="shrink-0 px-4 py-3 border-t border-[#e2e8f0] bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask us anything..."
                className="flex-1 text-[13px] px-4 py-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] outline-none focus:border-[#0369A1]/40 focus:ring-2 focus:ring-[#0369A1]/10 transition-all placeholder:text-[#94a3b8]"
                style={{ color: "#0f172a" }}
                disabled={isLoading}
              />
              <button
                onClick={() => send()}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-30 bg-gradient-to-br from-[#0369A1] to-[#0c4a6e] hover:shadow-md active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-[#94a3b8] text-center mt-2 font-medium">
              Powered by Aether AI
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
