# DK Studio Growth Engine

PROJECT: DK Studio site. Single landing page, English, React + Tailwind.
I am attaching my design mockups. They set layout, spacing, and mood.
The text and tokens below OVERRIDE the images. The images contain a few
copy errors that are corrected here. Do not copy text from images.

DESIGN TOKENS
- Background cream #F4EEE4, card surface #FAF6ED, ink #171310,
  muted text #6B6459, accent orange #E8541D, hairlines rgba(23,19,16,0.12)
- Footer: background #171310, text #F2EDE2
- Filled buttons use #CC4310 with white text (contrast), outlined buttons ink on cream
- Display font: Fraunces (Google Fonts), tight leading, used for headlines,
  tier names, prices, big numerals. Body and UI font: Inter.
- Wordmark: "DK STUDIO" in Fraunces caps, letterspacing 0.3em. No logo image in nav.
- Recurring motif: hand-drawn orange underline stroke (SVG) under one key word
  per major headline, draws on when scrolled into view.
- Section labels: small orange dot + "01 — About" style, Inter 13px.
- All photography muted/warm-toned EXCEPT portfolio hover previews (full color).
- Mockups are visual reference only, never crop images out of them. Where a real
  photo is not yet supplied, use a flat warm-tone placeholder block. Never use
  stock photos. Never generate substitute content.

PAGE ORDER: Nav / Hero with audit demo / 01 About / 02 Work / 03 Pricing /
04 Contact / Footer. Smooth-scroll anchors. Sticky nav.

NAV
DK STUDIO left. Links: Work, Pricing, About, Contact. Right: filled button
"Book a free audit →" scrolling to contact.

HERO
Eyebrow: Audit. Insight. Redesign. Launch.
H1: We audit. We redesign. We build what performs.
(orange underline under "performs")
Sub: Our system turns guesswork into growth. A clear audit, honest insight,
and design that converts.
Button: Start your free audit → (to contact). Microline: Free. Nothing to buy.
Right/below: THE AUDIT DEMO PANEL, built as real coded UI, not an image.
Rounded frame, subtle shadow, max 2 side cards per tab. Pinned badge visible
on every tab, top corner: "Sample audit · demo data".
Tab bar: 01 Audit / 02 Insight / 03 Redesign / 04 Launch. Crossfade 200ms.
Demo subject is a fictional skincare shop "VERDE": mini page preview with nav
(Shop, Philosophy, Journal, About, Cart), headline "Plant-based skincare,
made for real life.", sub "High-performance formulas with ingredients you can
trust.", dark "Shop now" button, product area approximated with type and
neutral shapes. No featured-in logo row. No real brand or magazine names.
- Tab 01 Audit: score card 62/100 (Clarity 64, Trust 58, Conversion 52,
  Performance 46) + friction points list (Unclear value proposition, Low trust
  signal visibility, Generic imagery, Weak CTA hierarchy). Pulsing orange
  hotspot dots with % labels on the preview.
- Tab 02 Insight: heatmap dots on preview + tooltip "High attention. 42% of
  users focus here for ~2.8s" + quote card "I like the brand, but I'm not sure
  what makes it different." attributed "28% of users".
- Tab 03 Redesign: cleaned preview variant + uplift card (+42% conversion,
  +28% engagement, -35% bounce) + summary checklist (Cleaner layout, Improved
  hierarchy, Stronger messaging, Better CTA placement).
- Tab 04 Launch: process checklist all 100% + QA card (48+ tests passed,
  0 critical issues) + vitals (LCP 1.3s, CLS 0.02, INP 120ms).
Panel tilts up to 2 degrees toward cursor on desktop.

01 ABOUT
Label: 01 — About. H2: Design with purpose. Built to perform.
(underline under "perform")
Body: We help businesses turn their websites into real growth engines.
Strategy, design, and development, handled in one place.
Second paragraph: No bloated process. No outsourcing gaps. Clarity, execution,
and results you can measure.
Left: photo slot (warm muted treatment; placeholder block until supplied).
Three columns: Strategy first / We start with your goals and build every
decision around them. — Bilingual EN·KR / Natural communication in English and
Korean. Built for global reach. — One workflow / Design and development under
one roof. Faster. Smoother. Better.

02 WORK
Label: 02 — Work. H2: Selected work.
A vertical list of projects, one per row: large Fraunces name (clamp 40-64px),
thin divider between rows, small muted meta on the right (type + year).
Data lives in one editable array: { name, meta, image, url }.
Seed rows (I will rename and extend, do NOT add or invent entries):
- { name: "Greek Taverna", meta: "Concept site · 2026", image: null, url: null }
- { name: "Northern Café", meta: "Concept rebuild · 2026", image: null, url: null }
Hover behavior (desktop): row indents 12px, name gains orange dot prefix, and a
small preview image (~340x230, radius 10px, rotate -2deg) fades and scales in
near the cursor, following it with ~120ms ease lag.
COLOR RULE: preview images render in FULL ORIGINAL COLOR, no filter. They are
the only full-color imagery on the page.
If image is null, no preview appears (no empty frame). If url is null the row
is a plain list item, not a link, default cursor, nothing to click.
Under the list, small muted line: Case studies are added as they ship.
Mobile (<768px): no hover; show a 64px full-color thumbnail right-aligned in
the row when image exists; plain list otherwise.

03 PRICING
Label: 03 — Pricing. H2: Clear value, real outcomes.
Three cards, third featured (orange outline + "Featured" tag + filled button;
others outlined buttons). Checkmark list items. All buttons scroll to contact
and preselect the matching service in the dropdown.
Card 1 — Free Audit — $0
Scored audit report / Proof for every finding / Clear fix list / Nothing to buy
Button: Get started
Card 2 — Standard Landing Page Design — From $1,000
One page, done right / Your real photos, story / Reviews and hours upfront /
Tested phone and desktop
Button: Get started
Card 3 — Full Homepage Rebuild — From $5,000 [Featured]
3D and animation effects / Motion on every scroll / Custom graphics and icons /
A look only yours / Photos graded properly / Navigation, simplified /
Order and booking paths
Button: Get started

04 CONTACT
Label: 04 — Contact. H2: Your business deserves better. (underline under "better")
Left: Tell me about your goals and I'll show you how we can get there.
Then: Clear thinking. Thoughtful design. Work that moves your business forward.
Three mini rows: Strategy first / Every recommendation has a reason. —
Focused process / No handoffs. No fluff. Just focused work that drives results. —
Bilingual support / Native fluency in English and Korean. Global standard,
local understanding.
Right, the form: Name, Business name, Website (optional), Email,
"What do you need help with?" dropdown (Free audit / Standard landing page /
Full homepage rebuild / Something else), "Anything else?" textarea,
Preferred language: English / Korean / Both. Submit: Send message →
Wire submissions to email danielkimdesignco@gmail.com with success and error
states. If email sending is not configured yet, disable the button with a
visible "Form coming soon, email us directly" note and a mailto link.
Never ship a silent dead form.

FOOTER (dark)
Left: danielkimdesignco@gmail.com as a mailto link. No phone number.
Center: DK STUDIO. Right: © 2026 DK STUDIO. No language toggle.
Bottom row links: Work, Pricing, About, Contact (working anchors).

MOTION
Sections fade and rise 12-16px once on scroll, 400-500ms ease-out, children
staggered 60ms. Underline strokes draw on. Hotspot dots pulse slowly. Button
arrows nudge 4px right on hover. Respect prefers-reduced-motion: disable all.
No parallax, no cursor gimmicks beyond the Work list preview.

HARD RULES
- No invented content anywhere: no testimonials, client names, stats, or logos
  beyond what is written here. Demo metrics exist only inside the badged panel.
- Every anchor lands. Zero dead links, zero "#" placeholders.
- Clean at 390px and 1440px: no horizontal scroll, tap targets 44px+.
- No em-dashes in any rendered copy.
- Orange never used for body text on cream, accents and buttons only.

FINISH CHECK before you call it done: click every nav link and button at
desktop and mobile widths, confirm the form's disabled state note shows if
unwired, confirm footer year 2026, confirm the demo badge is visible on all
four tabs, confirm Work rows without url are not clickable.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7b1e1ac2-5553-4b09-8b38-1541074a099d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
