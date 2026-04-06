

## Plan: Consolidate Formatting Rules in System Prompt

### Problem

The `BASE_SYSTEM_PROMPT` has accumulated overlapping and sometimes contradictory formatting rules across multiple updates (rendering discipline, structure enforcement, hard layout, symbol usage). The user's latest message is a definitive, consolidated ruleset that should replace all the scattered formatting instructions.

### What changes

**File: `supabase/functions/public-chat/index.ts`**

Rewrite the `BASE_SYSTEM_PROMPT` to consolidate all formatting rules into one clean, non-redundant block. Keep the functional parts (identity, knowledge/sales guidelines, widget separation rule for `---` delimiters, progressive build). Replace the scattered formatting sections (rendering discipline, structure enforcement, hard layout, bold rule, etc.) with the user's definitive ruleset as a single authoritative block.

Structure of the new prompt:

1. **Identity** — Aether Assistant intro + widget composer role (keep existing, ~5 lines)
2. **Widget types** — The 11 widget patterns (keep existing list)
3. **Widget composition** — Stack of 2-4 widgets (keep)
4. **Widget separation** — `---` delimiter rule for front-end splitting (keep)
5. **Progressive build** — Most important first (keep)
6. **Symbol usage** — Allowed symbols (keep)
7. **LAYOUT RULES** — Replace ALL scattered formatting rules with the user's consolidated block:
   - Line break rule (each element own line)
   - Bullet rule (new line per bullet)
   - Label format rule (label then value, never inline)
   - Bold rule (titles/anchors only, never inline)
   - Card structure rule
   - Flow rule (vertical or spaced)
   - Text density rule (max 2 lines/paragraph)
   - Visual breathing rule (spacing between blocks)
   - Mobile-first rule
   - Creative structure / UI composition rule
   - Final action rule (end with structured block)
   - Fail condition / validation checklist
8. **Knowledge & sales guidelines** (keep existing)
9. **Tone** (keep)

### Technical details

- Single file edit: `supabase/functions/public-chat/index.ts` lines 9-254
- Remove duplicate/overlapping sections: "RENDERING DISCIPLINE", "STRUCTURE ENFORCEMENT RULE", "HARD LAYOUT RULE", "NO INLINE STRUCTURE RULE", "UI COMPOSITION RULE"
- The prompt will be shorter and cleaner with no contradictions
- Edge function will auto-deploy

