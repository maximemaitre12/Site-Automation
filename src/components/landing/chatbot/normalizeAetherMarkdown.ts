const INLINE_LABEL_REGEX = /(\*\*[^*\n]{1,60}\*\*:?)|([A-ZÀ-ÿ][A-Za-zÀ-ÿ0-9/&()'’+\- ]{1,32}:)/g;

function formatLabel(raw: string) {
  const label = raw.replace(/\*\*/g, "").replace(/:\s*$/, "").trim();
  return `**${label}**`;
}

function splitInlineBullets(content: string, prefix = ""): string[] | null {
  const parts = content
    .split(/\s+(?=•\s+)/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 1 && parts.every((part) => part.startsWith("• "))) {
    return parts.map((part) => `${prefix}${part}`);
  }

  return null;
}

function splitInlineFlow(content: string, prefix = ""): string[] | null {
  if (!/(?:→|->)/.test(content)) return null;
  if (!/^\[[^\]]+\](?:\s*(?:→|->)\s*\[[^\]]+\])+$/.test(content)) return null;

  const steps = content
    .split(/\s*(?:→|->)\s*/)
    .map((step) => step.trim())
    .filter(Boolean);

  if (steps.length < 2) return null;

  return steps.flatMap((step, index) =>
    index < steps.length - 1 ? [`${prefix}${step}`, `${prefix}↓`] : [`${prefix}${step}`]
  );
}

function appendValue(lines: string[], value: string, prefix: string) {
  const bulletLines = splitInlineBullets(value, prefix);
  if (bulletLines) {
    lines.push(...bulletLines);
    return;
  }

  const flowLines = splitInlineFlow(value, prefix);
  if (flowLines) {
    lines.push(...flowLines);
    return;
  }

  lines.push(`${prefix}${value}`);
}

function splitInlineLabels(content: string, prefix = ""): string[] | null {
  if (/^(#{1,6}\s|•\s|\d+[.)]\s|[-*]\s)/.test(content)) return null;

  const matches = [...content.matchAll(INLINE_LABEL_REGEX)];
  if (!matches.length || matches[0].index !== 0) return null;

  const lines: string[] = [];
  const spacer = prefix ? prefix.trimEnd() : "";

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const token = match[0];
    const tokenStart = match.index ?? 0;
    const tokenEnd = tokenStart + token.length;
    const nextStart = matches[index + 1]?.index ?? content.length;
    const value = content.slice(tokenEnd, nextStart).trim();

    if (!value) continue;

    if (lines.length > 0) {
      lines.push(spacer);
    }

    lines.push(`${prefix}${formatLabel(token)}`);
    appendValue(lines, value, prefix);
  }

  return lines.length > 0 ? lines : null;
}

export function normalizeAetherMarkdown(content: string): string {
  const output: string[] = [];
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  let inFence = false;

  for (const rawLine of lines) {
    if (rawLine.trim().startsWith("```")) {
      inFence = !inFence;
      output.push(rawLine);
      continue;
    }

    if (inFence) {
      output.push(rawLine);
      continue;
    }

    const quotePrefix = rawLine.match(/^\s*>\s?/)?.[0] ?? "";
    const trimmed = rawLine.slice(quotePrefix.length).trim();

    if (!trimmed) {
      output.push(quotePrefix ? quotePrefix.trimEnd() : "");
      continue;
    }

    if (/^\|.*\|$/.test(trimmed) || /^[-|:\s]+$/.test(trimmed)) {
      output.push(rawLine);
      continue;
    }

    const contentLine = trimmed.replace(/^[-*]?\s*\[(?:x|X| )\]\s+/, "• ");

    const bulletLines = splitInlineBullets(contentLine, quotePrefix);
    if (bulletLines) {
      output.push(...bulletLines);
      continue;
    }

    const flowLines = splitInlineFlow(contentLine, quotePrefix);
    if (flowLines) {
      output.push(...flowLines);
      continue;
    }

    const labelLines = splitInlineLabels(contentLine, quotePrefix);
    if (labelLines) {
      output.push(...labelLines);
      continue;
    }

    output.push(`${quotePrefix}${contentLine}`);
  }

  return output
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n\s*---\s*\n/g, "\n\n---\n\n")
    .trim();
}
