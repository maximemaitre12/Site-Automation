import { AetherMarkdownRenderer } from "./AetherMarkdownRenderer";

type Msg = { role: "user" | "assistant"; content: string };

interface ChatMessageProps {
  message: Msg;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className="flex"
      style={{
        justifyContent: isUser ? "flex-end" : "flex-start",
        animation: "aetherMsgIn 180ms ease-out both",
        animationDelay: `${Math.min(index * 30, 120)}ms`,
      }}
    >
      <div
        className={
          isUser
            ? "max-w-[85%] px-4 py-2.5 rounded-[18px] rounded-br-[6px] bg-[#0369A1] text-white text-[13.5px] leading-relaxed"
            : "max-w-[92%] px-4 py-3 rounded-[18px] rounded-bl-[6px] bg-[#F8FAFC] border border-[#F1F5F9]"
        }
      >
        {isUser ? (
          message.content
        ) : (
          <AetherMarkdownRenderer content={message.content} />
        )}
      </div>
    </div>
  );
}
