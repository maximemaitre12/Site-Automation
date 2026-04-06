import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { ChatMessage } from "./chatbot/ChatMessage";
import { ThinkingIndicator } from "./chatbot/ThinkingIndicator";
import aetherWatermark from "@/assets/aether-watermark.png";
import aetherLogoIcon from "@/assets/aether-logo-icon.png";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/public-chat`;

const QUICK_ACTIONS = [
  { label: "Document processing", icon: "◇" },
  { label: "Logistics operations", icon: "→" },
  { label: "Recruitment workflows", icon: "▢" },
  { label: "Compliance & reporting", icon: "⚠" },
];

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
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

  const panelClasses = isFullscreen
    ? "fixed inset-0 z-50 flex flex-col overflow-hidden"
    : "fixed z-50 flex flex-col overflow-hidden bottom-0 right-0 w-full h-[100dvh] sm:bottom-5 sm:right-5 sm:w-[420px] sm:h-[640px] sm:rounded-2xl";

  return (
    <>
      {/* ── Trigger Button ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 group"
          aria-label="Open chat"
        >
          <div
            className="relative w-[54px] h-[54px] rounded-2xl flex items-center justify-center transition-all duration-300 ease-out hover:scale-[1.06] active:scale-[0.95]"
            style={{
              background: "linear-gradient(135deg, #0284C7 0%, #0891B2 100%)",
              boxShadow: "0 4px 20px -4px rgba(15,23,42,0.35), 0 8px 32px -8px rgba(3,105,161,0.2)",
            }}
          >
            {/* Pulse ring */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                border: "1.5px solid rgba(56,189,248,0.3)",
                animation: "aetherTriggerPulse 3s ease-in-out infinite",
              }}
            />
            {/* Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white relative z-10">
              <path d="M12 2C6.48 2 2 5.92 2 10.67c0 2.73 1.52 5.17 3.93 6.77-.1 1.4-.68 2.82-1.78 3.93a.5.5 0 00.35.85c2.17-.02 4.04-.83 5.3-1.73.7.13 1.43.2 2.2.2 5.52 0 10-3.92 10-8.69S17.52 2 12 2z" fill="currentColor" opacity="0.9"/>
              <circle cx="8" cy="11" r="1.2" fill="#38BDF8"/>
              <circle cx="12" cy="11" r="1.2" fill="#38BDF8"/>
              <circle cx="16" cy="11" r="1.2" fill="#38BDF8"/>
            </svg>
          </div>
        </button>
      )}

      {/* ── Panel ── */}
      {open && (
        <div
          className={panelClasses}
          style={{
            animation: "aetherPanelIn 320ms cubic-bezier(0.16, 1, 0.3, 1)",
            overscrollBehavior: "contain",
            background: "linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)",
            boxShadow: isFullscreen ? "none" : "0 0 0 1px rgba(0,0,0,0.04), 0 12px 48px -8px rgba(0,0,0,0.15), 0 24px 72px -16px rgba(3,105,161,0.08)",
          }}
        >
          {/* ── Header ── */}
          <div
            className="shrink-0 px-5 py-3.5 flex items-center justify-between"
            style={{
              background: "linear-gradient(160deg, rgba(3,132,199,0.95) 0%, rgba(8,145,178,0.92) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center gap-3">
              {/* Logo icon */}
              <img
                src={aetherLogoIcon}
                alt="Aether"
                className="w-7 h-7"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <div>
                <p className="text-[13.5px] font-semibold text-white tracking-[-0.01em]">
                  Aether Assistant
                </p>
                <p className="text-[10.5px] text-[#94A3B8] mt-0.5 tracking-wide uppercase font-medium">
                  Operational AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center hover:bg-white/10 transition-colors duration-150"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-[14px] h-[14px] text-[#94A3B8]" />
                ) : (
                  <Maximize2 className="w-[14px] h-[14px] text-[#94A3B8]" />
                )}
              </button>
              <button
                onClick={() => { setOpen(false); setIsFullscreen(false); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors duration-150"
              >
                <X className="w-[14px] h-[14px] text-[#94A3B8]" />
              </button>
            </div>
          </div>

          {/* ── Messages area ── */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative"
            ref={scrollRef}
            style={{
              overscrollBehavior: "contain",
              background: "linear-gradient(165deg, rgba(3,105,161,0.04) 0%, rgba(56,189,248,0.03) 30%, rgba(214,238,245,0.05) 60%, transparent 100%)",
            }}
          >
            {/* Watermark */}
            <div
              className="pointer-events-none absolute bottom-0 right-0 w-[260px] h-[260px] overflow-hidden"
              style={{
                opacity: isLoading ? 0.06 : 0.025,
                transition: "opacity 2s ease-in-out",
              }}
            >
              <img
                src={aetherWatermark}
                alt=""
                className="w-full h-full object-contain"
                style={{ filter: "grayscale(0.4) brightness(0.6)" }}
              />
            </div>

            <div className={`relative z-10 px-5 py-5 min-w-0 ${isFullscreen ? "max-w-3xl mx-auto" : ""}`}>
              {/* Session indicator */}
              {messages.length > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />
                  <span className="text-[9px] text-[#94A3B8] tracking-[0.15em] uppercase font-medium px-2">
                    Live session
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />
                </div>
              )}

              {/* ── Empty state ── */}
              {messages.length === 0 && (
                <div className="pt-12 pb-4">
                  {/* Greeting */}
                  <div className="mb-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F172A]/5 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                      <span className="text-[10px] text-[#64748B] tracking-wide uppercase font-medium">Online</span>
                    </div>
                    <h2 className="text-[20px] font-semibold text-[#0F172A] tracking-[-0.025em] leading-[1.3]">
                      What are you trying<br />to improve?
                    </h2>
                    <p className="text-[12.5px] text-[#64748B] mt-2 leading-relaxed">
                      Ask about AI agents, workflows, or compliance.
                    </p>
                  </div>

                  {/* Quick actions */}
                  <div className="space-y-2">
                    {QUICK_ACTIONS.map(({ label, icon }) => (
                      <button
                        key={label}
                        onClick={() => send(label)}
                        className="w-full text-left group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-[#F1F5F9] active:scale-[0.98]"
                        style={{
                          border: "1px solid #F1F5F9",
                          background: "linear-gradient(135deg, rgba(248,250,252,0.8) 0%, rgba(241,245,249,0.4) 100%)",
                        }}
                      >
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-[14px] shrink-0"
                          style={{ background: "linear-gradient(135deg, #0284C7 0%, #0891B2 100%)", color: "#fff" }}
                        >
                          {icon}
                        </span>
                        <span className="text-[12.5px] text-[#334155] font-medium group-hover:text-[#0F172A] transition-colors">
                          {label}
                        </span>
                        <span className="ml-auto text-[#CBD5E1] group-hover:text-[#94A3B8] transition-colors text-[12px]">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Messages ── */}
              <div className="min-w-0">
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    message={msg}
                    index={i}
                    isStreaming={isLoading && msg.role === "assistant" && i === messages.length - 1}
                    onSendMessage={send}
                  />
                ))}
              </div>

              <div ref={bottomRef} className="h-px" />
            </div>
          </div>

          {/* ── Thinking indicator ── */}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <ThinkingIndicator />
          )}

          {/* ── Input area ── */}
          <div
            className="shrink-0"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%)",
            }}
          >
            <div
              className="border-t border-[#F1F5F9] bg-white"
            >
              <div className={`px-4 py-3 ${isFullscreen ? "max-w-3xl mx-auto" : ""}`}>
                <div
                  className="flex items-center gap-2 rounded-xl px-1 py-1 transition-all duration-200"
                  style={{
                    border: "1px solid #E2E8F0",
                    background: "linear-gradient(135deg, #FAFBFC 0%, #F8FAFC 100%)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02), inset 0 1px 2px rgba(0,0,0,0.02)",
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                    placeholder="Ask anything…"
                    className="flex-1 min-w-0 text-[13px] px-3 py-2 bg-transparent outline-none placeholder:text-[#94A3B8] text-[#0F172A]"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => send()}
                    disabled={isLoading || !input.trim()}
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-20"
                    style={{
                      background: isLoading || !input.trim() ? "#E2E8F0" : "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                      boxShadow: isLoading || !input.trim() ? "none" : "0 2px 8px rgba(15,23,42,0.2)",
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 text-[#94A3B8] animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                </div>
              </div>
              {/* Trust footer */}
              <div className={`px-5 pb-3 pb-[max(12px,env(safe-area-inset-bottom))] ${isFullscreen ? "max-w-3xl mx-auto" : ""}`}>
                <p className="text-[8.5px] leading-[1.5] text-[#CBD5E1] text-center tracking-wide">
                  Outputs are indicative · Detailed audit required for precise assessment
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes aetherPanelIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes aetherMsgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes aetherWidgetIn {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes aetherPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes aetherDot {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes aetherShimmer {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.75; }
        }
        @keyframes aetherSweep {
          0% { transform: translateX(-100%); }
          60% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes aetherTriggerPulse {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes aetherStatusPing {
          0% { opacity: 1; transform: scale(1); }
          75%, 100% { opacity: 0; transform: scale(2.5); }
        }
      `}</style>
    </>
  );
}
