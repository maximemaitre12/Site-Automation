

## Chatbot Premium Redesign

Upgrade the floating chatbot to an ultra-premium, enterprise-grade aesthetic aligned with Aether Connect's brand identity.

### Changes (single file: `FloatingChatbot.tsx`)

**1. Floating trigger button**
- Replace simple circle with a refined pill-shaped button: icon + "Ask Aether" label
- Subtle glassmorphism effect with `backdrop-blur`, refined shadow
- Smooth scale + glow animation on hover

**2. Header redesign**
- Use the Aether logo icon (stylized "A" via SVG inline or Sparkles icon) instead of MessageCircle
- Title: "Aether Intelligence" (more premium than "Aether Connect")
- Subtitle: "Enterprise AI Assistant" with a refined green dot
- Add a subtle animated gradient mesh background pattern
- Minimalist close button with hover state

**3. Empty state (welcome screen)**
- Replace the generic icon with a sophisticated radial gradient orb with animated shimmer
- Headline: "What can we solve for you?"
- Subtitle: "Powered by our proprietary RAG knowledge base"
- Quick prompts styled as glass cards with subtle left border accent in brand blue, hover lift effect

**4. Message bubbles**
- User messages: clean solid blue with subtle inner shadow, no gradient
- Assistant messages: white with a very thin left blue accent bar (3px), cleaner shadow
- Assistant avatar: smaller, circular, with a pulsing ring when streaming
- Typography: Inter-like spacing, 13.5px size

**5. Input area**
- Refined input with inner shadow instead of border
- Send button: circular with smooth icon rotation on hover
- Footer: "Aether Intelligence" with a small sparkle icon, more subtle

**6. Animations**
- Panel entrance: spring animation with slight blur-in
- Messages: fade-in + slide-up micro-animation
- Typing indicator: smoother wave animation instead of bounce

### Technical details
- Single file edit: `src/components/landing/FloatingChatbot.tsx`
- Replace `MessageCircle` with `Sparkles` from lucide-react for brand differentiation
- Add CSS keyframes for shimmer, message fade-in, and wave animations
- All inline styles/Tailwind, no external dependencies needed

