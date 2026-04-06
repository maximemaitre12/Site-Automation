import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import type { Components } from "react-markdown";
import React from "react";

interface AetherMarkdownRendererProps {
  content: string;
  onSendMessage?: (message: string) => void;
}

/** Recursively extract all text from React children (including nested <strong>, <em>, etc.) */
function extractText(children: React.ReactNode): string {
  let text = "";
  React.Children.forEach(children, (child) => {
    if (typeof child === "string") {
      text += child;
    } else if (typeof child === "number") {
      text += String(child);
    } else if (React.isValidElement(child) && child.props?.children) {
      text += extractText(child.props.children);
    }
  });
  return text;
}

/** Render a clickable action button for → lines */
function ActionButton({ text, onSend }: { text: string; onSend: (msg: string) => void }) {
  return (
    <button
      onClick={() => onSend(text)}
      className="group w-full text-left flex items-center gap-2.5 px-3.5 py-3 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
      style={{
        background: "linear-gradient(135deg, rgba(3,105,161,0.06) 0%, rgba(56,189,248,0.04) 100%)",
        border: "1px solid rgba(3,105,161,0.12)",
      }}
    >
      <span
        className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
        style={{ background: "linear-gradient(135deg, #0369A1, #38BDF8)", color: "white" }}
      >
        →
      </span>
      <span className="flex-1 text-[12px] font-medium text-[#0369A1] group-hover:text-[#0284C7] transition-colors">
        {text}
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#0369A1]/40 group-hover:text-[#0369A1]/70 transition-colors shrink-0">
        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

/** Check if children represent a → action line, return cleaned text or null */
function getActionText(children: React.ReactNode): string | null {
  const text = extractText(children).trim();
  if (text.startsWith("→")) {
    const actionText = text.replace(/^→\s*/, "").trim();
    return actionText || null;
  }
  return null;
}

function buildComponents(onSendMessage?: (msg: string) => void): Components {
  return {
    h1: ({ children }) => (
      <div className="text-[9.5px] font-bold tracking-[0.16em] uppercase mt-7 mb-3 first:mt-0"
        style={{ color: "#0369A1" }}
      >
        {children}
      </div>
    ),
    h2: ({ children }) => (
      <div className="flex items-center gap-2.5 mt-6 mb-3 first:mt-0">
        <div
          className="w-[3px] h-[16px] rounded-full shrink-0"
          style={{ background: "linear-gradient(180deg, #0369A1 0%, #38BDF8 100%)" }}
        />
        <span className="text-[9.5px] font-bold tracking-[0.16em] uppercase" style={{ color: "#0369A1" }}>
          {children}
        </span>
      </div>
    ),
    h3: ({ children }) => (
      <div className="text-[12.5px] font-semibold text-[#0F172A] mt-4 mb-1.5 first:mt-0">
        {children}
      </div>
    ),
    p: ({ children }) => {
      const actionText = onSendMessage ? getActionText(children) : null;
      if (actionText) {
        return <ActionButton text={actionText} onSend={onSendMessage!} />;
      }
      return (
        <p className="my-2 first:mt-0 last:mb-0 text-[12.5px] leading-[1.8] break-words whitespace-pre-line text-[#475569]">
          {children}
        </p>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-[#0F172A]">{children}</strong>
    ),
    ul: ({ children }) => (
      <ul className="my-2.5 space-y-2 pl-0 list-none">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-2.5 space-y-2 pl-4 list-decimal marker:text-[#94A3B8] marker:text-[11px]">{children}</ol>
    ),
    li: ({ children }) => {
      const actionText = onSendMessage ? getActionText(children) : null;
      if (actionText) {
        return (
          <li className="list-none pl-0">
            <ActionButton text={actionText} onSend={onSendMessage!} />
          </li>
        );
      }
      return (
        <li className="flex items-start gap-2.5 text-[12.5px] leading-[1.7]">
          <span
            className="w-[5px] h-[5px] rounded-full mt-[8px] shrink-0"
            style={{ background: "linear-gradient(135deg, #0369A1, #38BDF8)" }}
          />
          <span className="flex-1 min-w-0 break-words whitespace-pre-line text-[#475569]">{children}</span>
        </li>
      );
    },
    blockquote: ({ children }) => {
      // Check if ALL children inside are → actions — if so, render as action group
      const childArray = React.Children.toArray(children);
      const actionChildren: { text: string; key: string | number }[] = [];
      let hasNonAction = false;

      childArray.forEach((child, i) => {
        if (React.isValidElement(child)) {
          const text = getActionText(child.props?.children);
          if (text) {
            actionChildren.push({ text, key: i });
          } else {
            // Check if it's an empty/whitespace-only element
            const t = extractText(child.props?.children).trim();
            if (t.length > 0) hasNonAction = true;
          }
        } else if (typeof child === "string" && child.trim()) {
          const t = child.trim();
          if (t.startsWith("→")) {
            actionChildren.push({ text: t.replace(/^→\s*/, "").trim(), key: i });
          } else {
            hasNonAction = true;
          }
        }
      });

      // If blockquote is purely actions, render as action group
      if (actionChildren.length > 0 && !hasNonAction && onSendMessage) {
        return (
          <div className="my-4 space-y-1.5">
            {actionChildren.map((a) => (
              <ActionButton key={a.key} text={a.text} onSend={onSendMessage} />
            ))}
          </div>
        );
      }

      return (
        <div
          className="my-4 rounded-xl overflow-hidden flex"
          style={{
            background: "linear-gradient(135deg, rgba(248,250,252,0.95) 0%, rgba(241,245,249,0.7) 100%)",
            border: "1px solid rgba(226,232,240,0.6)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.02), 0 4px 16px rgba(3,105,161,0.03)",
          }}
        >
          <div
            className="w-[3px] shrink-0 rounded-l-xl"
            style={{ background: "linear-gradient(180deg, #0369A1 0%, #38BDF8 60%, #7DD3FC 100%)" }}
          />
          <div className="px-4 py-3.5 flex-1 min-w-0">
            <div className="text-[12px] text-[#334155] leading-[1.85] whitespace-pre-line">{children}</div>
          </div>
        </div>
      );
    },
    pre: ({ children }) => (
      <div
        className="my-4 rounded-xl text-[11.5px] font-mono p-4 overflow-x-auto max-w-full relative"
        style={{
          background: "linear-gradient(145deg, #0F172A 0%, #1E293B 100%)",
          color: "#E2E8F0",
          boxShadow: "0 4px 20px rgba(15,23,42,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <div
          className="absolute top-0 left-4 right-4 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.2), transparent)" }}
        />
        {children}
      </div>
    ),
    code: ({ className, children }) => {
      const isBlock = className?.includes("language-");
      if (isBlock) {
        return <code className="whitespace-pre-wrap break-all">{children}</code>;
      }
      return (
        <code
          className="text-[11.5px] font-mono px-1.5 py-0.5 rounded-md break-all"
          style={{
            background: "linear-gradient(135deg, #F1F5F9, #E8F4F8)",
            color: "#0369A1",
            boxShadow: "inset 0 0 0 1px rgba(3,105,161,0.08)",
          }}
        >
          {children}
        </code>
      );
    },
    table: ({ children }) => (
      <div
        className="my-4 rounded-xl overflow-hidden max-w-full"
        style={{
          border: "1px solid rgba(226,232,240,0.6)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.02), 0 4px 16px rgba(3,105,161,0.02)",
        }}
      >
        <table className="w-full text-[11.5px] table-fixed min-w-[280px]">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead
        style={{
          background: "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th
        className="text-left px-3.5 py-2.5 text-[9px] font-bold tracking-[0.14em] uppercase break-words"
        style={{ color: "#0369A1" }}
      >
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-3.5 py-2.5 text-[11.5px] text-[#475569] border-b border-[#F8FAFC] last:border-0 break-words">
        {children}
      </td>
    ),
    hr: () => (
      <div className="my-5 flex items-center justify-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />
        <div
          className="w-1 h-1 rounded-full shrink-0"
          style={{ background: "linear-gradient(135deg, #0369A1, #38BDF8)" }}
        />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />
      </div>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#0369A1] underline decoration-[#0369A1]/20 underline-offset-2 hover:decoration-[#0369A1]/50 transition-colors font-medium"
      >
        {children}
      </a>
    ),
  };
}

export function AetherMarkdownRenderer({ content, onSendMessage }: AetherMarkdownRendererProps) {
  const components = React.useMemo(() => buildComponents(onSendMessage), [onSendMessage]);

  return (
    <div className="aether-md text-[12.5px] leading-[1.8] text-[#475569] min-w-0 overflow-hidden break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
