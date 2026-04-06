import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import type { Components } from "react-markdown";

interface AetherMarkdownRendererProps {
  content: string;
}

const components: Components = {
  h1: ({ children }) => (
    <div className="text-[9.5px] font-bold tracking-[0.16em] uppercase mt-7 mb-3 first:mt-0"
      style={{ color: "#0369A1" }}
    >
      {children}
    </div>
  ),
  h2: ({ children }) => (
    <div className="flex items-center gap-2 mt-6 mb-2.5 first:mt-0">
      <div className="w-[3px] h-[14px] rounded-full" style={{ background: "linear-gradient(180deg, #0369A1 0%, #38BDF8 100%)" }} />
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
  p: ({ children }) => (
    <p className="my-2 first:mt-0 last:mb-0 text-[12.5px] leading-[1.8] break-words whitespace-pre-line text-[#475569]">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[#0F172A]">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="my-2.5 space-y-2 pl-0 list-none">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2.5 space-y-2 pl-4 list-decimal marker:text-[#94A3B8] marker:text-[11px]">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-2.5 text-[12.5px] leading-[1.7]">
      <span className="w-[5px] h-[5px] rounded-full mt-[8px] shrink-0" style={{ background: "linear-gradient(135deg, #0369A1, #38BDF8)" }} />
      <span className="flex-1 min-w-0 break-words whitespace-pre-line text-[#475569]">{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <div
      className="my-4 rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(248,250,252,0.9) 0%, rgba(241,245,249,0.6) 100%)",
        border: "1px solid #EFF3F8",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(3,105,161,0.02)",
      }}
    >
      <div className="px-4 py-3.5">
        <div className="text-[12px] text-[#334155] leading-[1.8] whitespace-pre-line">{children}</div>
      </div>
    </div>
  ),
  pre: ({ children }) => (
    <div
      className="my-4 rounded-xl text-[11.5px] font-mono p-4 overflow-x-auto max-w-full"
      style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        color: "#E2E8F0",
        boxShadow: "0 4px 16px rgba(15,23,42,0.15)",
      }}
    >
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
        }}
      >
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div
      className="my-4 rounded-xl overflow-x-auto max-w-full"
      style={{
        border: "1px solid #EFF3F8",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
      }}
    >
      <table className="w-full text-[11.5px] table-fixed min-w-[280px]">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: "linear-gradient(135deg, #F8FAFC, #F1F5F9)" }}>{children}</thead>
  ),
  th: ({ children }) => (
    <th className="text-left px-3 py-2.5 text-[9px] font-bold tracking-[0.12em] uppercase border-b border-[#EFF3F8] break-words"
      style={{ color: "#0369A1" }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2.5 text-[11.5px] text-[#475569] border-b border-[#F8FAFC] last:border-0 break-words">
      {children}
    </td>
  ),
  hr: () => (
    <div className="my-5 flex items-center gap-2">
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

export function AetherMarkdownRenderer({ content }: AetherMarkdownRendererProps) {
  return (
    <div className="aether-md text-[12.5px] leading-[1.8] text-[#475569] min-w-0 overflow-hidden break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
