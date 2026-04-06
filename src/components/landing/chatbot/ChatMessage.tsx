import { AetherMarkdownRenderer } from "./AetherMarkdownRenderer";
import { WidgetShimmer } from "./WidgetShimmer";
import { normalizeAetherMarkdown } from "./normalizeAetherMarkdown";

type Msg = { role: "user" | "assistant"; content: string };

interface ChatMessageProps {
  message: Msg;
  index: number;
  isStreaming?: boolean;
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

export function ChatMessage({ message, index, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div
        className="flex justify-end mt-5 first:mt-0"
        style={{
          animation: "aetherMsgIn 180ms ease-out both",
          animationDelay: `${Math.min(index * 30, 120)}ms`,
        }}
      >
        <div className="max-w-[85%] px-4 py-2.5 rounded-[18px] rounded-br-[6px] bg-[#0369A1] text-white text-[13.5px] leading-relaxed break-words">
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
        animation: "aetherMsgIn 180ms ease-out both",
        animationDelay: `${Math.min(index * 30, 120)}ms`,
      }}
    >
      {segments.map((segment, i) => {
        // During streaming, the last segment is still being written — show shimmer overlay
        const isLastSegment = i === segments.length - 1;
        const showShimmerOverlay = isStreaming && isLastSegment && segment.length < 40;

        return (
          <div
            key={i}
            className={`relative ${i > 0 ? "mt-4" : ""}`}
            style={{
              animation: "aetherWidgetIn 280ms ease-out both",
              animationDelay: `${i * 80}ms`,
            }}
          >
            {showShimmerOverlay ? (
              <WidgetShimmer />
            ) : (
              <AetherMarkdownRenderer content={segment} />
            )}
          </div>
        );
      })}

      {/* Trailing shimmer for the next widget that hasn't started yet */}
      {isStreaming && (
        <WidgetShimmer />
      )}
    </div>
  );
}
