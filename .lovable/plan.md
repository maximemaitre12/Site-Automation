

## Plan: Update System Prompt for Modular Response Engine

### What changes

**Single file edit**: `supabase/functions/public-chat/index.ts`

Replace the `BASE_SYSTEM_PROMPT` constant (lines 9–55) with the new comprehensive prompt that defines Aether Assistant as a "modular response engine" with 13 building blocks, structure intelligence, and strict formatting rules.

### Prompt content

The new prompt will include:
1. **Core principle**: "You BUILD responses using visual and structural components"
2. **13 response building blocks**: Sections, bold, bullets, tables, flows, structured blocks, insight blocks, comparison modules, step-by-step modules, summary blocks, key takeaways, inline labels, multi-part layouts
3. **Structure intelligence**: Decide component combination before answering
4. **Composition examples**: Section→Table→Insight, Context→Flow→Recommendations, etc.
5. **Mandatory behavior rules**: No unstructured paragraphs, always hierarchy/readability
6. **Concrete examples**: Structured block, table, process flow, insight block, step-by-step module
7. **Tone/goal constraints**: Professional, analytical, no hype, no emojis
8. **Existing sales/knowledge guidelines preserved** (pricing, timelines, competitors, honesty)

### Technical details

- Only the `BASE_SYSTEM_PROMPT` string is replaced; all other logic (RAG retrieval, streaming, error handling) remains unchanged
- The edge function will be auto-deployed after the edit

