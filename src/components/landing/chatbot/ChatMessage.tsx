import { AetherMarkdownRenderer } from "./AetherMarkdownRenderer";
import { WidgetShimmer } from "./WidgetShimmer";
import { normalizeAetherMarkdown } from "./normalizeAetherMarkdown";

type Msg = { role: "user" | "assistant"; content: string };

interface ChatMessageProps {
  message: Msg;
  index: number;
  isStreaming?: boolean;
  onSendMessage?: (message: string) => void;
}

function splitWidgetSegments(content: string): string[] {
  const segments = content
    .split(/\n\s*---\s*\n/g)
    .flatMap((part) =>
      part
        .split(/(?=^##\s)/m)
        .map((segment) => segment.trim())
        .filter(Boolean)
    );

  return segments.length > 0 ? segments : [content.trim()];
}

export function ChatMessage({ message, index, isStreaming, onSendMessage }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div
        className="flex justify-end mt-5 first:mt-0"
        style={{
          animation: "aetherMsgIn 220ms ease-out both",
          animationDelay: `${Math.min(index * 30, 120)}ms`,
        }}
      >
        <div
          className="max-w-[85%] px-4 py-2.5 text-white text-[13px] leading-relaxed break-words relative overflow-hidden"
          style={{
            borderRadius: "18px 18px 6px 18px",
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            boxShadow: "0 2px 12px rgba(15,23,42,0.18), 0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {/* Subtle top shine */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }}
          />
          {message.content}
        </div>
      </div>
    );
  }

  const normalizedContent = normalizeAetherMarkdown(message.content);
  const segments = splitWidgetSegments(normalizedContent);

  return (
    <div
      className="mt-7 first:mt-0 min-w-0"
      style={{
        animation: "aetherMsgIn 220ms ease-out both",
        animationDelay: `${Math.min(index * 30, 120)}ms`,
      }}
    >
      {segments.map((segment, i) => {
        const isLastSegment = i === segments.length - 1;
        const showShimmerOverlay = isStreaming && isLastSegment && segment.length < 40;

        return (
          <div
            key={i}
            className={`relative ${i > 0 ? "mt-4" : ""}`}
            style={{
              animation: "aetherWidgetIn 300ms ease-out both",
              animationDelay: `${i * 90}ms`,
            }}
          >
            {showShimmerOverlay ? (
              <WidgetShimmer />
            ) : (
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.8) 100%)",
                  border: "1px solid rgba(226,232,240,0.5)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 4px 16px rgba(3,105,161,0.015)",
                  padding: "14px 16px",
                }}
              >
                <AetherMarkdownRenderer content={segment} onSendMessage={onSendMessage} />
              </div>
            )}
          </div>
        );
      })}

      {isStreaming && <WidgetShimmer />}
    </div>
  );
}
