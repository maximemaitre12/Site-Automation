import { AetherMarkdownRenderer } from "./AetherMarkdownRenderer";

type Msg = { role: "user" | "assistant"; content: string };

interface ChatMessageProps {
  message: Msg;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div
        className="flex justify-end mt-6 first:mt-0"
        style={{
          animation: "aetherMsgIn 180ms ease-out both",
          animationDelay: `${Math.min(index * 30, 120)}ms`,
        }}
      >
        <div className="max-w-[85%] px-4 py-2.5 rounded-[18px] rounded-br-[6px] bg-[#0369A1] text-white text-[13.5px] leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  // Assistant: no bubble wrapper, just content with spacing
  return (
    <div
      className="mt-6 first:mt-0"
      style={{
        animation: "aetherMsgIn 180ms ease-out both",
        animationDelay: `${Math.min(index * 30, 120)}ms`,
      }}
    >
      <AetherMarkdownRenderer content={message.content} />
    </div>
  );
}
