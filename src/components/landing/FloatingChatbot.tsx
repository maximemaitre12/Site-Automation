import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Loader2, MessageSquare, Maximize2, Minimize2 } from "lucide-react";
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
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  const panelClasses = isFullscreen
    ? "fixed inset-0 z-50 flex flex-col bg-white"
    : "fixed z-50 flex flex-col overflow-hidden bottom-0 right-0 w-full h-[100dvh] sm:bottom-5 sm:right-5 sm:w-[400px] sm:h-[560px] sm:rounded-2xl bg-white shadow-[0_25px_60px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)]";

  return (
    <>
      {/* Trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label="Open chat"
        >
          <MessageSquare className="w-6 h-6 text-[#0369A1]" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          className={panelClasses}
          style={{ animation: "chatPanelIn 0.3s ease-out" }}
        >
          {/* Header */}
          <div className="shrink-0 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0369A1] flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-gray-900 leading-tight">Aether</p>
                <p className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  AI Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-gray-400" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <button
                onClick={() => { setOpen(false); setIsFullscreen(false); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-5"
          >
            <div className={isFullscreen ? "max-w-3xl mx-auto space-y-4" : "space-y-4"}>
              {messages.length === 0 && (
                <div className="flex flex-col items-center pt-12 pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#0369A1]/10 flex items-center justify-center mb-5">
                    <MessageSquare className="w-7 h-7 text-[#0369A1]" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">How can we help?</p>
                  <p className="text-sm text-gray-400 text-center max-w-[280px] mb-8">
                    Ask about our AI agents, services, or methodology
                  </p>
                  <div className="w-full space-y-2">
                    {QUICK_PROMPTS.map((text) => (
                      <button
                        key={text}
                        onClick={() => send(text)}
                        className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-[13px] text-gray-600 font-medium transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className="flex"
                  style={{
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    animation: "msgFadeIn 0.25s ease-out both",
                  }}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-lg bg-[#0369A1] flex items-center justify-center shrink-0 mr-2 mt-0.5">
                      <span className="text-white text-[10px] font-semibold">A</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-[13.5px] leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-2xl rounded-br-md bg-[#0369A1] text-white"
                        : "rounded-2xl rounded-bl-md bg-[#f7f8fa] text-gray-800 border border-gray-100"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-slate max-w-none [&>p]:m-0 [&>p+p]:mt-2 [&>ul]:mt-1 [&>ul]:mb-0 [&>ol]:mt-1 [&>ol]:mb-0 [&_a]:text-[#0369A1] [&_strong]:text-gray-900 [&_code]:text-[#0369A1] [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex" style={{ animation: "msgFadeIn 0.25s ease-out" }}>
                  <div className="w-6 h-6 rounded-lg bg-[#0369A1] flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <span className="text-white text-[10px] font-semibold">A</span>
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-[#f7f8fa] border border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" style={{ animation: "wave 1.4s ease-in-out infinite" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" style={{ animation: "wave 1.4s ease-in-out 0.15s infinite" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" style={{ animation: "wave 1.4s ease-in-out 0.3s infinite" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
            <div className={isFullscreen ? "max-w-3xl mx-auto flex items-center gap-2" : "flex items-center gap-2"}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask anything..."
                className="flex-1 text-[13px] px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none transition-colors placeholder:text-gray-400 focus:border-[#0369A1]/40 focus:bg-white text-gray-900"
                disabled={isLoading}
              />
              <button
                onClick={() => send()}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150 disabled:opacity-30 bg-[#0369A1] hover:bg-[#035a87] active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            <p className="text-center text-[9px] text-gray-300 mt-2 tracking-wide">
              Powered by Aether
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatPanelIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
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
