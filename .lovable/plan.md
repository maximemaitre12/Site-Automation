
## Bracelet Oreon — New Product Page

### Overview
Create a complete `/bracelet` page for the "Oreon" smart bracelet product. The bracelet is free; the user commits to a monthly SEPA subscription (2.99€ or 3.99€). A QR code triggers the SEPA mandate. The page matches the existing site design (Royal Blue #1E4D8C, Inter/Montserrat fonts, clean editorial style).

### What will be built

**1. New page: `src/pages/Bracelet.tsx`**
Full product landing page with the following sections:
- **Hero** — Dark Royal Blue gradient background (same as PharmaHero), product name "Oreon", tagline about biometric tracking + AI automations, CTA to scroll to pricing
- **Product Image** — AI-generated image of a sleek smart bracelet (generated via Lovable AI, saved as asset)
- **Features Grid** — 4-6 feature cards: biometric capture, real-time health tracking, AI automation workflows, app integration, data privacy, battery life
- **Pricing Section** — Two plan cards (2.99€/month and 3.99€/month), bracelet marked as "Offert" (free), SEPA direct debit mention
- **QR Code Section** — Placeholder QR code image with instructions: "Scan to activate your SEPA mandate". You'll replace the QR before publishing
- **How It Works** — 3-step flow: Receive bracelet → Scan QR code → Start tracking
- **FAQ** — Common questions about the bracelet, subscription, SEPA, cancellation

**2. New legal page: `src/pages/legal/BraceletCGU.tsx`**
Dedicated Terms & Conditions for the Oreon bracelet subscription covering:
- Subscription terms (monthly SEPA debit, 2.99€ or 3.99€)
- Free bracelet conditions (commitment to subscription)
- SEPA mandate details and cancellation policy
- Biometric data collection and privacy (GDPR)
- Return/refund policy
- Warranty and liability

**3. Navigation updates**
- Add "Bracelet" link in `LandingHeader.tsx` nav items
- Add "Bracelet" link in `LandingFooter.tsx`
- Add routes in `App.tsx`: `/bracelet` (public, inside PublicLayout) and `/legal/bracelet-cgu`

**4. AI-generated product image**
- Generate a premium product photo of a sleek black/dark smart bracelet using Lovable AI image generation
- Save as `src/assets/oreon-bracelet.png`
- Used in hero and product sections

**5. Placeholder QR code**
- Create or embed a simple placeholder QR code image (pointing to example.com)
- You replace it before publishing

### Design Details
- Same Royal Blue (#1E4D8C) gradient hero as landing page
- White sections with subtle borders for features/pricing
- Cards with slight shadows matching existing component style
- Typography: Montserrat headings, Inter body
- Responsive layout matching existing pages
- All text in French

### Files created/modified
- `src/pages/Bracelet.tsx` (new)
- `src/pages/legal/BraceletCGU.tsx` (new)
- `src/components/landing/LandingHeader.tsx` (add nav item)
- `src/components/landing/LandingFooter.tsx` (add link)
- `src/App.tsx` (add routes)
- `src/assets/oreon-bracelet.png` (AI-generated image)
