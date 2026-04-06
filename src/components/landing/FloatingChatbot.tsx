import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Loader2, MessageSquare, Maximize2, Minimize2 } from "lucide-react";
import { ChatMessage } from "./chatbot/ChatMessage";
import { ThinkingIndicator } from "./chatbot/ThinkingIndicator";
import aetherWatermark from "@/assets/aether-watermark.png";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/public-chat`;

const QUICK_ACTIONS = [
  "Document processing",
  "Logistics operations",
  "Recruitment workflows",
  "Compliance & reporting",
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

  // Scroll to bottom only on new messages, not every chunk
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  // Lock body scroll when panel is open on mobile
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
    ? "fixed inset-0 z-50 flex flex-col bg-white overflow-hidden"
    : "fixed z-50 flex flex-col overflow-hidden bottom-0 right-0 w-full h-[100dvh] sm:bottom-5 sm:right-5 sm:w-[420px] sm:h-[600px] sm:rounded-2xl bg-white sm:shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_8px_40px_-8px_rgba(0,0,0,0.12),0_20px_60px_-15px_rgba(0,0,0,0.06)]";

  return (
    <>
      {/* Trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center transition-all duration-200 ease-out hover:scale-[1.04] active:scale-[0.96]"
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 4px 16px -2px rgba(0,0,0,0.1), 0 8px 24px -4px rgba(0,0,0,0.06)",
          }}
          aria-label="Open chat"
        >
          <MessageSquare className="w-5 h-5 text-[#0369A1]" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          className={panelClasses}
          style={{
            animation: "aetherPanelIn 280ms cubic-bezier(0.16, 1, 0.3, 1)",
            overscrollBehavior: "contain",
          }}
        >
          {/* Header — FIXED */}
          <div
            className="shrink-0 px-5 py-3.5 flex items-center justify-between border-b border-[#F1F5F9]"
            style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
          >
            <div>
              <p className="text-[14px] font-semibold text-[#0F172A] tracking-[-0.01em]">
                Aether Assistant
              </p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Operational assistant
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center hover:bg-[#F8FAFC] transition-colors duration-150"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-[15px] h-[15px] text-[#94A3B8]" />
                ) : (
                  <Maximize2 className="w-[15px] h-[15px] text-[#94A3B8]" />
                )}
              </button>
              <button
                onClick={() => { setOpen(false); setIsFullscreen(false); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F8FAFC] transition-colors duration-150"
              >
                <X className="w-[15px] h-[15px] text-[#94A3B8]" />
              </button>
            </div>
          </div>

          {/* Messages area — SCROLLABLE, locked horizontal */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative"
            ref={scrollRef}
            style={{ overscrollBehavior: "contain" }}
          >
            {/* Watermark — clipped inside scroll area */}
            <div
              className="pointer-events-none absolute bottom-0 right-0 w-[280px] h-[280px] overflow-hidden"
              style={{
                opacity: isLoading ? 0.07 : 0.035,
                transition: "opacity 1.5s ease-in-out",
              }}
            >
              <img
                src={aetherWatermark}
                alt=""
                className="w-full h-full object-contain"
                style={{ filter: "grayscale(0.3) brightness(0.7)" }}
              />
            </div>

            <div className={`relative z-10 px-5 py-5 min-w-0 ${isFullscreen ? "max-w-3xl mx-auto" : ""}`}>
              {/* Assistant label */}
              {messages.length > 0 && (
                <p className="text-[10px] text-[#94A3B8] tracking-wide mb-5">
                  Aether Assistant • Live
                </p>
              )}

              {/* Empty state */}
              {messages.length === 0 && (
                <div className="pt-16 pb-4">
                  <p className="text-[18px] font-semibold text-[#0F172A] tracking-[-0.02em] mb-8">
                    What are you trying to improve?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_ACTIONS.map((text) => (
                      <button
                        key={text}
                        onClick={() => send(text)}
                        className="text-left px-3.5 py-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] text-[12.5px] text-[#334155] font-medium transition-all duration-150 hover:bg-[#F1F5F9] hover:border-[#E2E8F0] active:scale-[0.98]"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="min-w-0">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} index={i} />
                ))}
              </div>

              {/* Scroll anchor */}
              <div ref={bottomRef} className="h-px" />
            </div>
          </div>

          {/* Thinking overlay — ABSOLUTE over input, zero layout impact */}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <ThinkingIndicator />
          )}

          {/* Input — FIXED at bottom */}
          <div className="shrink-0 border-t border-[#F1F5F9] bg-white">
            <div className={`px-4 py-3 ${isFullscreen ? "max-w-3xl mx-auto" : ""}`}>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder="Ask anything…"
                  className="flex-1 min-w-0 text-[13px] px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] outline-none transition-all duration-150 placeholder:text-[#94A3B8] focus:border-[#0369A1]/25 focus:bg-white focus:shadow-[0_0_0_3px_rgba(3,105,161,0.06)] text-[#0F172A]"
                  disabled={isLoading}
                />
                <button
                  onClick={() => send()}
                  disabled={isLoading || !input.trim()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 disabled:opacity-25 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.95]"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-white" />
                  )}
                </button>
              </div>
            </div>
            {/* Trust footer */}
            <div className={`px-5 pb-3 pb-[max(12px,env(safe-area-inset-bottom))] ${isFullscreen ? "max-w-3xl mx-auto" : ""}`}>
              <p className="text-[9px] leading-[1.5] text-[#CBD5E1] text-center">
                Outputs are indicative and based on typical industry setups.
                Detailed audit required for precise assessment.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes aetherPanelIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes aetherMsgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes aetherPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes aetherDot {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </>
  );
}
