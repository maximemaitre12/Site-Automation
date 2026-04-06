import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AetherMarkdownRendererProps {
  content: string;
}

export function AetherMarkdownRenderer({ content }: AetherMarkdownRendererProps) {
  return (
    <div className="aether-md text-[13.5px] leading-[1.7] text-[#0F172A]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#94A3B8] mt-7 mb-3 first:mt-0">
              {children}
            </div>
          ),
          h2: ({ children }) => (
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#94A3B8] mt-6 mb-2 first:mt-0">
              {children}
            </div>
          ),
          h3: ({ children }) => (
            <div className="text-[12.5px] font-semibold text-[#0F172A] mt-4 mb-1.5 first:mt-0">
              {children}
            </div>
          ),
          p: ({ children }) => (
            <p className="my-2 first:mt-0 last:mb-0 text-[13px] leading-[1.75]">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[#0F172A]">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="my-2.5 space-y-1.5 pl-0 list-none">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2.5 space-y-1.5 pl-4 list-decimal marker:text-[#94A3B8] marker:text-[11px]">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-[13px] leading-[1.65]">
              <span className="w-1 h-1 rounded-full bg-[#94A3B8] mt-[9px] shrink-0" />
              <span className="flex-1">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <div className="my-4 px-4 py-3.5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl">
              <div className="text-[12.5px] text-[#334155] leading-[1.7]">{children}</div>
            </div>
          ),
          code: ({ className, children }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <div className="my-4 rounded-xl bg-[#0F172A] text-[#E2E8F0] text-[12px] font-mono p-4 overflow-x-auto">
                  <code>{children}</code>
                </div>
              );
            }
            return (
              <code className="text-[12px] font-mono bg-[#F1F5F9] text-[#0369A1] px-1.5 py-0.5 rounded-md">
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="my-4 rounded-xl border border-[#F1F5F9] overflow-hidden">
              <table className="w-full text-[12px]">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#F8FAFC]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="text-left px-4 py-2.5 text-[10px] font-bold tracking-[0.1em] uppercase text-[#94A3B8] border-b border-[#F1F5F9]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-[12.5px] text-[#334155] border-b border-[#F8FAFC] last:border-0">
              {children}
            </td>
          ),
          hr: () => (
            <div className="my-5 h-px bg-[#F1F5F9]" />
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0369A1] underline decoration-[#0369A1]/20 underline-offset-2 hover:decoration-[#0369A1]/50 transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
