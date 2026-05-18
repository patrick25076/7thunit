# 7th Unit Website

## Project context
Marketing website for 7th Unit, a pre-seed humanoid robotics company.
Audiences: investors (first-look due diligence), manufacturing operators
in Kazakhstan and Poland (considering pilots), robotics engineers
(recruiting).

The site must look investor-ready. Aesthetic reference: "Apple product
film meets industrial photography. Dark, confident, minimal." Execution
quality reference: Linear, Anduril, Vercel, Anthropic, 1X (for layout
restraint, NOT for color — 1X is light, we are dark).

## Stack — keep it strict
- Plain HTML, CSS, JavaScript only. No build step.
- No frameworks (no React, Vue, Astro, Next, Eleventy)
- No npm install of UI libraries
- Tailwind via CDN is acceptable, no PostCSS build
- Vanilla JS only. Intersection Observer for scroll triggers.
- Motion One via CDN is acceptable if needed for complex motion
- Deployment: Cloudflare Pages, connect-to-git, no build command

If a task seems to require a framework, push back and propose a vanilla
solution instead.

## Pages and routes
- index.html — homepage (the most-changed page)
- product.html — early-access form (route: /product)
- os.html — operating system page (route: /os, NOT in nav)
- about.html — long-form editorial about-the-company
- film-en.html — data collection landing, English (route: /film-en, NOT in nav)
- film.html — Russian version of film-en (route: /film, NOT in nav)
- careers.html — open roles list (route: /join, NOT in primary nav, link from footer)

## Navigation
Primary nav: Home | Product | About
OS is reachable only via homepage Section 3 "Explore the OS" button.
Film pages are reachable only via direct link (operator outreach).
Careers reachable via footer link.

## Homepage — copy is locked, visuals are partial

SECTION 1 — HERO
- Headline: "Humanoid robots that automate entire shifts of work."
- Subtext: "Built for industrial environments."
- CTA: "Request Early Access" → /product
- Eventually: 10-second cinematic video reveal (dark factory, lights
  flicker on, robot revealed, slow zoom, blackout, logo). Until that
  video exists, use the V1 concept hero image (assets/images/hero-v1.jpg)
  with subtle entrance animation — lights fading up effect via CSS.

SECTION 2 — THE ROBOT AT WORK
- Headline: "20+ hours/day of continuous operation."
- Subtext: "One robot. Multiple tasks. No shift breaks."
- No button.
- Eventually: warehouse aisle render, wheeled humanoid in motion,
  industrial lighting, dramatic depth. Until that render exists, use
  assets/images/robot-seated.jpg as placeholder, composited or framed
  on dark background.

SECTION 3 — INTELLIGENCE LAYER
- Headline: "Give instructions the way you would give them to a person."
- Subtext: "Every robot in the fleet is controlled through Unit OS —
  plain language commands, executed precisely."
- CTA: "Explore the OS" → /os
- Layout: text left, phone mockup right (10–15° tilt, dark frame,
  custom dark-mode chat UI). Build the chat UI as actual HTML/CSS
  inside an SVG/CSS iPhone frame — do NOT use an image. Conversation:
    Header: "Fleet · 3 units active"
    Operator: "Unit 1 — go to dock 11 at 1 PM. Truck arriving. Unload to shelf B-5."
    Unit 1: "Understood. Rolling out. ETA dock 11: 12:50."
  Small unit identifier on each message. Subtle glow under phone.

## Product page
Mirror structure of edenrobotics.ai/about/contact. Short description
of the product, then early-access form.
Form fields: Name, Company, Role, Country, Use case (textarea), Submit.
Form endpoint: https://formspree.io/f/xvzleeyw
Use fetch() with inline success/error states. Do not redirect.

## OS page
Mirror structure of edenrobotics.ai/theta-os. Final copy is pending —
use placeholder text everywhere. Section structure: hero with one-line
headline, 3–4 capability sections with icons + short descriptions,
a code/terminal-style snippet block, CTA "Request Early Access" → /product.
NOT linked in primary nav.

## About page
Move existing homepage longform copy here (the founder story + market
stats from current 7thunit.com). Long-form editorial column, max-width
640px, serif body, stat callouts (85M, $8.5T, 80%) as inline display
elements. Founder portrait + bio at the bottom.

## Film pages (English and Russian)
Text is final, do not modify. Improve layout, spacing, hierarchy.
Add subtle animations. Mobile-first — most operator traffic is mobile.
Form endpoint: same as product for now (placeholder until founder
provides film-specific endpoint).
Build English first, then mirror identical layout for Russian
(film.html), dropping the existing Russian text into the same positions.

## Careers page
Content stays as-is. Form endpoint: https://formspree.io/f/xgopddpz

## Frontend aesthetics — hard rules

Avoid generic AI aesthetics. Make creative, distinctive choices.

Read this block before writing any new page. Push back on any
request that would violate it.

### Typography (banned defaults)
- Never use Inter, Roboto, Open Sans, Lato, Arial, or system-ui as a
  primary typeface. These are signals of AI slop.
- Use Google Fonts. Pair a confident editorial serif with a real mono.
- Specific picks for this project (Stitch-aligned):
  - Display + Headlines: **Literata**, weight 300, off-white on dark
  - Short body / lede / sub: **JetBrains Mono**, 14–16px
  - Long-form prose (About): **Literata**, 21px, weight 300
  - Labels / eyebrows / nav: **JetBrains Mono** uppercase, 11px
- Use weight extremes within the family: 300 vs 500, not 400 across.
- Use size jumps of 3x or more between hierarchy levels, not 1.5x.

### Color discipline
- One dominant color. One sharp accent. That's it.
- Dominant: #0A0A0A (near-black). Text: **#e5e2de** (warm off-white).
- Muted text: #bdc9cb (cool muted).
- Accent: **Industrial Cyan #5DC5D9** — only on focus rings, the active
  nav underline, link arrows, hover underlines, and the chat-bubble
  accent in the homepage phone mockup. Never as a button background.
- No gradients on backgrounds. No glassmorphism. No soft drop shadows.
- A single accent flash beats fifteen tasteful tints.

### Layout patterns to avoid (AI slop signals)
- Three-column feature grids with icons + headline + body
- Pricing cards
- "Trusted by" logo strips
- Floating cards over gradient blobs
- Centered hero with two buttons side by side and a fade-up subtitle
- Tabs that switch a hero image
- Carousels of any kind
- Testimonial cards with avatar + name + role
- Stat counters that animate up on scroll
- Background patterns of dots or grids

If any of the above pattern is implied by the design or copy, push
back and propose something more distinctive instead.

### Layout patterns to prefer
- Full-bleed editorial hero, image dominant, type asymmetric
- Long-form single column for prose (max 640px)
- Stat callouts as large display numerals inline with prose, not
  separated into cards
- Nav as small monospace labels, generous spacing, no background bar
  until scroll past viewport
- Buttons as outlined text with an arrow, not filled rectangles
- Mono labels for section identifiers ("01 — Hero")

### Motion
- Subtle, earned. Not decorative.
- Fade-up on Intersection Observer threshold 0.15 is the default.
- Honor prefers-reduced-motion absolutely.
- No parallax. No autoplay. No spinning. No bouncing.

### When in doubt
- Reduce, don't add. White space is the design.
- Reference quality bar: Anduril, Linear, Anthropic, Vercel.

### Nav
- 7TH UNIT serif wordmark left. Mono uppercase links right.
- NO filled CTA button in the nav. The active page gets a thin cyan
  underline. That's it. Stay minimal.
- Links: Product · About · Careers (Home is the wordmark click).

### Supporting design system

Concrete tokens:

- Background: #0A0A0A (near-black). Lifted surface: #131311.
- Text: #e5e2de primary (warm off-white), #bdc9cb muted, #879396 dim.
- Border: rgba(255, 255, 255, 0.08). Outline-variant: #3e494b.
- Accent: #5DC5D9 (industrial cyan). Strong: #7be1f6.
- Layout: max content width 1280px desktop, full-bleed for hero
  sections. Section vertical padding 120px desktop, 80px tablet,
  60px mobile.

## Animations
- Subtle. Fade-up on scroll (Intersection Observer, threshold 0.15).
- Hero: lights-fading-up effect on image entrance (CSS opacity +
  filter brightness transition over 1.2s)
- No parallax, no autoplay video sound, no spinning loaders
- Honor prefers-reduced-motion (use @media query, disable transforms)

## Forms
- All forms: fetch() POST to Formspree endpoint, inline success message,
  inline field-level errors, disabled submit during request
- No redirects, no page reloads

## Code conventions
- Semantic HTML5: header, nav, main, section, article, footer
- BEM-ish CSS: .hero, .hero__title, .hero__cta
- Mobile-first CSS, desktop overrides via @media (min-width: 768px) etc.
- One styles.css, one main.js — no module splitting
- Heavy comments at the top of each CSS section
- Asset paths: /assets/css/, /assets/js/, /assets/images/

## Assets available now
- /assets/images/hero-v1.jpg — V1 robot concept, dark studio shot
  (use as homepage hero until video is ready)
- /assets/images/robot-seated.jpg — wheeled humanoid concept, light bg
  (use as Section 2 placeholder; may need dark-bg compositing)
- /designs/ — Stitch screenshots and notes per page

## Assets pending from founder
- 10-second cinematic hero video (homepage Section 1)
- Warehouse aisle render with wheeled humanoid (homepage Section 2)
- Updated head-mount photograph for Film pages
- Final OS page copy

When these arrive, swap them in via the same file paths above so the
templating doesn't need to change.

## Out of scope
- Video upload backend (planned phase 2, R2 + Workers)
- CMS, analytics beyond a single Plausible script
- Multilingual switching logic (Russian is a separate static file)

## Before making changes
- Read this file first
- Mirror the nav/footer markup exactly across pages
- Ask before adding any external dependency
- For new visual patterns, propose before adding