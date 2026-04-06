

## Plan: Shimmer Widgets + Structure Enforcement

### What changes

Two areas: (1) front-end shimmer/progressive widget loading during streaming, and (2) system prompt update with shimmer generation + structure enforcement rules.

### 1. Front-end: Progressive shimmer widgets during streaming

**File: `src/components/landing/chatbot/ChatMessage.tsx`**

During streaming (content still arriving), split the assistant's streamed content by widget boundaries (double newlines / section headers). Widgets whose content is complete get rendered normally. The "next" widget that hasn't arrived yet shows as a shimmer skeleton placeholder. This creates the progressive build effect.

Logic:
- Parse streamed markdown into segments (split on `## ` headers or `---` or double blank lines)
- Fully received segments → render via `AetherMarkdownRenderer`
- If still streaming → append 1 shimmer skeleton block after the last real segment
- Each segment fades in with a staggered animation

**File: `src/components/landing/chatbot/WidgetShimmer.tsx`** (new)

A small component rendering 3-4 animated skeleton lines with a pulse animation, styled to match the widget card aesthetic (rounded corners, `#F8FAFC` background, subtle border).

**File: `src/components/landing/FloatingChatbot.tsx`**

Pass `isStreaming` prop to `ChatMessage` for the last assistant message so it knows when to show the trailing shimmer.

### 2. System prompt: Shimmer + Structure enforcement

**File: `supabase/functions/public-chat/index.ts`**

Append to `BASE_SYSTEM_PROMPT`:

- **SHIMMER GENERATION RULE**: Instruct the model to separate widgets with `---` (horizontal rule) so the front-end can reliably split segments. Each widget block must be self-contained between separators.

- **STRUCTURE ENFORCEMENT RULE**: 
  - Each data point on its own line
  - Key-value format: Label on one line, value on next line
  - Bullets always on separate lines
  - Bold as visual anchor only, never inline decoration
  - Cards: title → spacing → content (max 4-5 items) → spacing
  - Max density: split into multiple cards if >5 items

- **PROGRESSIVE BUILD RULE**: Order widgets from most important to least important so the progressive reveal feels intentional.

### Technical details

- The shimmer component uses Tailwind's `animate-pulse` on rounded bars
- Widget segmentation uses a simple regex split on `\n---\n` or `\n## ` patterns
- Each rendered segment gets a `fade-in` animation with staggered delay
- The trailing shimmer disappears when streaming ends (no layout jump — it's simply removed)
- `isStreaming` is determined by checking if the current message is the last one and `isLoading` is true

### Files

| File | Action |
|------|--------|
| `src/components/landing/chatbot/WidgetShimmer.tsx` | Create |
| `src/components/landing/chatbot/ChatMessage.tsx` | Edit — add streaming segmentation + shimmer |
| `src/components/landing/FloatingChatbot.tsx` | Edit — pass `isStreaming` to last assistant message |
| `supabase/functions/public-chat/index.ts` | Edit — add shimmer/structure rules to prompt |

