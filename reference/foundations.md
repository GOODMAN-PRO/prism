# Foundations — type, color, space, grid, hierarchy

The visual system. Lock these once per project (step 4 of the procedure) and never let them drift between sections. Lock these from a deliberate read of the brief — then hold them rigid across sections. The mechanisms are fixed; the specific faces, hues, and ratios are chosen per brief, never defaulted to. If you could guess your choice from the category alone, you defaulted — rework.

---

## 1. Typography

### Font selection

Cap at **3 families**: display + body (+ optional mono). Pair on a contrast axis (serif × sans, geometric × humanist) or use one family across weights. Never pair two similar sans.

| Role | Pool (rotate; don't reuse across consecutive projects) |
|---|---|
| **Display** (sans) | Satoshi, Cabinet Grotesk, Clash Display, PP Neue Montreal, General Sans, GT Walsheim, Söhne Breit |
| **Display** (serif — only if genuinely editorial/luxury/heritage) | PP Editorial New, Reckless Neue, GT Sectra, Tiempos Headline, Canela, Domaine Display |
| **Body** | Satoshi, General Sans, Switzer, system-ui (for true minimal) — Inter Tight only for neutral/Linear-style or accessibility-first briefs, not a default |
| **Mono** | Geist Mono, JetBrains Mono, IBM Plex Mono, Söhne Mono (mono is a weak tell) |

- **Inter is discouraged as a *default*** (it's the AI tell) — acceptable when the brief explicitly wants neutral/Linear-style or is accessibility-first. **Geist (and Inter/Geist generally) is the same AI-default tell** — never the identity; permit it only as a deliberate neutral workhorse *under* a distinctive display face, or for Linear-clean / accessibility-first briefs. Geist Mono is fine in mono roles.
- **Serif is discouraged as a default.** "Feels creative" is not a reason. Banned-as-default display serifs: Fraunces, Instrument Serif (the two LLM favorites).
- Load with `next/font` or self-host `@font-face` + `font-display: swap`. Never a `<link>` to Google Fonts in production.

### Scale — modular + fluid

Use a modular ratio between steps (≥1.25; 1.25 major-third for product, 1.333–1.5 for expressive/editorial). Make it **fluid** with `clamp()` so it scales between a min and max viewport without breakpoints (the Utopia method):

```css
/* clamp(min, preferred = base + vw slope, max) */
--step--1: clamp(0.83rem, 0.80rem + 0.15vw, 0.94rem);
--step-0:  clamp(1.00rem, 0.95rem + 0.25vw, 1.13rem);   /* body */
--step-1:  clamp(1.25rem, 1.15rem + 0.50vw, 1.50rem);
--step-2:  clamp(1.56rem, 1.40rem + 0.80vw, 2.00rem);
--step-3:  clamp(1.95rem, 1.70rem + 1.25vw, 2.66rem);
--step-4:  clamp(2.44rem, 2.05rem + 1.95vw, 3.55rem);
--step-5:  clamp(3.05rem, 2.45rem + 3.00vw, 4.74rem);   /* display */
```

- **Hero ceiling:** `clamp()` max ≈ **6rem** (~96px). 8–11rem reads as shouting, not bold.
- **Headline:** ≤2–3 lines. A 4-line hero headline is a font-size/container error, not a copy problem — widen the container (`max-w-5xl`/`max-w-6xl`) and/or drop the scale.

### Tuning

- **Measure:** body **65–75ch** (`max-width: 68ch`). Wider is unreadable.
- **Leading:** display `1.0–1.1` (tight), body `1.5–1.65`.
- **Tracking:** display **≥ −0.04em** (floor — tighter and glyphs touch); labels/eyebrows `+0.05em` to `+0.2em` uppercase.
- **`text-wrap: balance`** on h1–h3, **`text-wrap: pretty`** on long prose (kills orphans).
- **Hierarchy through weight + color + space**, not size alone. Body never pure black: off-black `oklch(0.22 0 0)` ≈ `#1a1a1a`. Tabular figures (`font-variant-numeric: tabular-nums`) for any aligned numbers.
- No ALL-CAPS body. Uppercase only for short labels (≤4 words).

---

## 2. Spacing

One base unit, everything a multiple. Use a **4px base** (8px rhythm) — it aligns to the grid and to most icon sets.

```css
--space-1: 0.25rem;  /* 4  */   --space-7:  2.5rem;  /* 40 */
--space-2: 0.5rem;   /* 8  */   --space-8:  3rem;    /* 48 */
--space-3: 0.75rem;  /* 12 */   --space-10: 4rem;    /* 64 */
--space-4: 1rem;     /* 16 */   --space-11: 5rem;    /* 80 */
--space-5: 1.5rem;   /* 24 */   --space-12: 6rem;    /* 96 — section */
--space-6: 2rem;     /* 32 */
```

- Gaps between 48 and 96 use **64/80** (`--space-10`/`--space-11`), not arbitrary in-between values.

- **Section rhythm:** `py-24` to `py-40` (`clamp(4rem, 8vw, 10rem)`). Sections are cinematic chapters; let them breathe. Vary spacing for rhythm — don't apply one uniform gap everywhere.
- **Optical, not mechanical:** bottom padding often needs a touch more than top; icons next to text need 1–2px nudges. Math-centered ≠ eye-centered.
- **Container:** `max-w-[1400px] mx-auto px-6` (or `max-w-7xl`). Content never stretches edge-to-edge on wide screens.

---

## 3. Color — OKLCH

Work in **OKLCH** (`oklch(L C H)`): perceptually uniform, predictable lightness, wide gamut. L = 0–1 lightness, C = chroma, H = hue 0–360.

### Pick a strategy before picking colors

| Strategy | Recipe | For |
|---|---|---|
| **Restrained** | Tinted neutrals + one accent ≤10% of surface | Product, dashboards, brand minimalism |
| **Committed** | One saturated color carries 30–60% of the surface | Identity-driven landing pages |
| **Full palette** | 3–4 named roles, each deliberate | Campaigns, data viz |
| **Drenched** | The surface *is* the color | Brand heroes, experiential |

### Rules

- **One accent**, kept off maximal chroma — `C` around **0.10–0.16** for most hues (max displayable C is hue-dependent: ~0.21 for yellow, lower for blue/purple; clamp to your target sRGB/P3 gamut). Pushing C to the gamut edge bands and reads neon. One gray family — never mix warm and cool grays in one project. Lock the accent across the whole page (no surprise blue CTA on a warm-grey site).
- **Gamut:** author in OKLCH but target **sRGB** unless the brief is P3-aware. Validate every accent renders inside sRGB (high-C hues clip); supply a hex/rgb fallback *before* the `oklch()` declaration for old webviews, and use `@media (color-gamut: p3)` to opt richer chroma in.
- **Never pure `#000`.** Use `oklch(0.18 0 0)` or a hue-tinted dark. **Never pure `#fff`** as the only surface in premium work — tint it 0.005–0.015 chroma toward the brand hue.
- **Tinted neutrals:** add small chroma toward the brand hue, not "warm/cool by default" (that's the monoculture move). The cream/sand/beige band (`L 0.84–0.97, C<0.06, H 40–100`) is the saturated AI default — avoid unless the brand literally names it.
- **Shadows** carry the background's hue at low opacity, never pure black. No harsh `shadow-md`/`rgba(0,0,0,0.3)` on light surfaces — diffuse and tinted.
- **Dark vs light is never a default.** Write one sentence of physical scene (who, where, what ambient light, what mood); if it doesn't force the answer, add detail until it does. One theme per page — sections don't invert.

### Theming / dark mode

One **semantic-token system** drives both modes (`--bg`, `--surface`, `--text`, `--accent`…), never raw hex per component. Dark mode is **near-black tinted to the brand hue, never `#000`** (`oklch(0.16–0.20 0.01–0.03 H)`). Build **elevation by lightness, not glow** — a raised surface steps lighter, it doesn't gain a colored bloom. Re-verify **AA in both modes**; a pair that passes on light routinely fails inverted.

### Contrast (verify every text run, button, placeholder)

| Pair | WCAG AA | AAA |
|---|---|---|
| Body text (<18px) | **4.5:1** | 7:1 |
| Large text (≥18px or bold ≥14px) | **3:1** | 4.5:1 |
| UI/icon/focus boundary | **3:1** | — |

The #1 failure is muted gray body text on a tinted near-white. If it's even close, push the body toward ink. Placeholders need the full 4.5:1, not the muted-gray default. White-on-white CTAs and ghost buttons over photos (without a scrim) are banned.

---

## 4. Grid & layout

- **Grid for 2D, flex for 1D.** Never `w-[calc(33%-1rem)]` — use `grid grid-cols-3 gap-6`. Responsive grids without breakpoints: `repeat(auto-fit, minmax(280px, 1fr))`.
- **Breakpoints:** sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536. Declare the `<768px` collapse for every multi-column block explicitly — no "Tailwind handles it" assumptions.
- **Mobile-first:** design the **360px** breakpoint as its own layout — no horizontal overflow at 360/768/1024/1440/1920, `overflow: clip` on decor, fluid `clamp()` type, 44px targets, and an intentional small-screen order (not a default centered single column).
- **Full-height:** `min-h-[100dvh]`, never `h-screen` (iOS Safari address-bar jump).
- **Asymmetry** when `VARIANCE > 4`: split-screen, left-content/right-asset, offset whitespace, scroll-pinned. Centered is for manifesto/launch moments.
- **No repeated layout family.** A page of 8 sections uses ≥4 different families. Max 2 image+text zigzags in a row before breaking the pattern.
- **Bento:** exactly N cells for N items (no blank tiles); `grid-auto-flow: dense` to interlock; vary cell sizes for rhythm; ≥2–3 cells carry real visual variation (image, gradient, pattern), not text-on-white.
- **z-index is a semantic scale**, never `9999`: `--z-dropdown:10; --z-sticky:20; --z-modal-backdrop:30; --z-modal:40; --z-toast:50; --z-tooltip:60`.

---

## 5. Visual hierarchy

Every section has **one** focal point. Establish it with, in order: **size → weight → color/contrast → space → motion** — motion is the lever of last resort and only on interaction or scroll-entry (never auto-looping to grab attention); if size/weight/color/space can carry the focal point, do not add motion. Don't fight a hierarchy with four competing emphases.

- Group with proximity and dividers (`border-t`, `divide-y`, negative space) before reaching for cards.
- One idea per section. If you need a headline *and* an explainer, stack them (headline, then ≤65ch body) — don't default to the left-big / right-small split-header (banned as default).
- Content density: short headline (≤8 words) + sub-paragraph (≤25 words) + one asset or one CTA. Long lists (>5 items) get a different component (grouped chunks, card grid, scroll-snap, marquee), never a longer `<ul>` with a hairline under every row.

---

## 6. The anti-slop ban list (match and refuse)

If you're about to write any of these, restructure instead.

- **Side-stripe borders** (`border-left >1px` as a colored accent). → full border, bg tint, or nothing.
- **Gradient-clip text** (`background-clip: text` + gradient). → one solid color; emphasis via weight/size.
- **Glassmorphism by default.** → rare and purposeful, with a real inner border + inner shadow, and a `prefers-reduced-transparency` solid fallback.
- **Ghost-card:** `border: 1px solid` + `box-shadow ≥16px blur` on the same element. → pick one.
- **Over-rounding:** `border-radius ≥24px` on cards. → cards 12–16px; full-pill only for tags/buttons. Lock ONE radius scale.
- **The hero-metric template** (big number, small label, gradient accent). **Identical 3-card grids.**
- **Eyebrow on every section** (tiny uppercase tracked kicker). → ≤1 per 3 sections; usually drop it.
- **Numbered section markers (01/02/03)** as default scaffolding. → only when the section truly is an ordered sequence.
- **Hand-drawn / sketchy SVG** (`feTurbulence` "paper grain", crude path illustrations). → real assets or none.
- **`repeating-linear-gradient` stripes**, **AI purple-blue glow gradients**, **custom mouse cursors**, **emojis in UI**.
- **AI copy:** "Elevate / Seamless / Unleash / Supercharge / Next-Gen / Game-changer / Delve / In the world of…", "X theater", "not just X, it's Y", exclamation-mark success, "Oops!" errors, em-dashes as flourish, generic names (John Doe / Acme), fake-round numbers (99.99%, 50%), Title Case On Every Header (use sentence case).

**The two-altitude slop test.** First order: if you could guess the theme+palette from the *category* alone, it's the first reflex — rework. Second order: if you could guess it from category-plus-anti-reference ("fintech that's *not* navy → terminal-dark"), it's the trap one tier deeper — rework until neither is obvious.
