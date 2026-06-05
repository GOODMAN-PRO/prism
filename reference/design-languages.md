# Design languages — presets + the variance engine

Pick **one** language in step 3 and commit. It sets palette, type, radius, motion intensity, and 3D usage as a coherent whole. Don't blend two. The goal is that someone could *not* guess the aesthetic from the category alone (the two-altitude slop test in `foundations.md`).

Committing to a language is not committing to a *look* — two sites in the same preset MUST differ in type pairing, accent hue, layout archetype, and density. Before reusing a preset, change at least the display face and the dominant layout archetype, or you are shipping a template.

---

## The variance engine

**Dials legend:** Dials = VARIANCE / MOTION / DENSITY, each 1–10 (defined in `SKILL.md` step 3); 3D Tier 0–3 = none → ambient accent → integrated scroll-3D → full immersive. Per-preset dials are starting points, not locks.

Before settling, roll two axes so you don't default to the same look twice. Choose deliberately from the Design Read — not randomly, but *variably*.

**Vibe archetype** (texture/mood) × **Layout archetype** (structure):

| Vibe | Signature |
|---|---|
| Ethereal Glass | OLED black, radial mesh orbs, frosted hairline cards, wide grotesk |
| Editorial Minimal | warm off-white or oxblood, high-contrast serif display, film-grain |
| Industrial Brutalist | near-black, mono, scanlines, single hazard accent |
| Soft Structural | silver/white, massive bold grotesk, diffused ambient shadows |
| Immersive Cinematic | one saturated color — or a dark WebGL world — *is* the surface |

| Layout | Signature |
|---|---|
| Asymmetric Bento | mixed-size grid cells, `grid-flow-dense` |
| Z-Axis Cascade | overlapping cards, slight rotation, depth-of-field |
| Editorial Split | massive type left, interactive asset right, huge negative space |
| Scroll Theater | pinned/scrubbed sections, horizontal pans, sticky stacks |
| Centered Manifesto | ONE oversized focal line, centered — permitted only as a single hero beat at VARIANCE ≤2, never a full page or repeated sections; every following section must break symmetry. Reach for it twice and you are slopping. |

Same category should not produce the same vibe×layout twice in a row.

---

## Preset 1 — Ethereal Glass
**For:** SaaS, AI, developer tools, fintech, modern B2B. **Dials:** V7 / M6 / D4. **3D Tier:** 1–2.

- **Surface:** OLED near-black `oklch(0.16 0.01 270)`; cards `oklch(0.20 0.02 270)` with `white/8` hairline borders and an inner top highlight (`inset 0 1px 0 rgba(255,255,255,0.08)`).
- **Accent:** one luminous hue (electric blue / emerald / violet) used *sparingly* — and only as real light (a glow that bloom can pick up in 3D), never as a flat purple button gradient.
- **Type:** wide geometric grotesk display (PP Neue Montreal, Geist), mono for metadata.
- **Radius:** 12–16px cards, full-pill buttons. **Glass** is purposeful (nav, overlays) with a `prefers-reduced-transparency` solid fallback — never decorative everywhere.
- **3D:** shader gradient backgrounds, a single floating hero object with subtle bloom (see `immersive-3d.md` selective-bloom). Dark scene = bloom reads beautifully.
- **Avoid:** the AI-purple-glow monoculture. Earn the glow with restraint.

## Preset 2 — Editorial Minimal
**For:** portfolios, agencies, writing, premium consumer, "document-style" tools. **Dials:** V6 / M3 / D3. **3D Tier:** 0–1.

- **Surface:** pure white or warm bone `oklch(0.98 0.005 90)`; secondary surface `oklch(0.97 0.006 90)`.
- **Borders:** ultra-light hairline `oklch(0.92 0 0)` / `rgba(0,0,0,0.06)`. Shadows near-absent (opacity <0.05) — depth via type and space, not elevation.
- **Type:** the star. High-contrast serif or confident grotesk display (tight tracking −0.02 to −0.04em, leading 1.1); body near-black tuned to the brand (e.g. `oklch(0.22 0.01 <brand-hue>)`, not pure `#000`), leading 1.6; mono for meta. Spot **muted pastels** for tags only — one desaturated family DERIVED from the accent (the `#FDEBEC` pale-bg / `#9F2F2D` saturated-text red is one example; generate your own pale-bg/saturated-text pair per project), pale blue, pale green, pale yellow.
- **Components:** flat bento (1px hairline, 8–12px radius, generous padding); `<kbd>` physical keys; FAQ as `border-bottom` rows, no boxes; faux-OS window chrome for product shots.
- **Motion:** invisible. Fade+`translateY(12px)` over 600ms `cubic-bezier(0.16,1,0.3,1)`; one slow ambient gradient drift behind hero (`opacity 0.02–0.04`, fixed layer).
- **Avoid:** gradients, neon, heavy shadows, pill-shaped large containers, `rounded-full` cards.

## Preset 3 — Industrial Brutalist
**For:** data-heavy dashboards, technical portfolios, editorial that wants to feel like declassified blueprints. **Dials:** V7 / M4 / D8. **3D Tier:** 0–1. **Pick ONE substrate and commit.**

- **Swiss Print (light):** bg `#F4F4F0`, ink `#0A0A0A`, the ONLY accent hazard red `#E61919`. **OR Tactical CRT (dark):** bg `#0A0A0A`, phosphor `#EAEAEA`, same red; optional single terminal-green readout `#4AF626`.
- **Type:** heavy neo-grotesk macro headers at huge clamp, tracking −0.03 to −0.06em, leading 0.85–0.95, UPPERCASE. **Cap the fluid max so the longest word fits 360px** — prefer `clamp(2.5rem,10vw,9rem)` for multi-word headers, reserve 12–15rem only for short single words, set `overflow-wrap:anywhere` on macro headers, and verify no overflow at 360px. Mono micro-type for all metadata (10–14px, tracking +0.05–0.1em, uppercase).
- **Geometry:** zero `border-radius`. Visible compartmentalization with 1–2px solid borders; razor-thin hairlines via `display:grid; gap:1px` over a contrasting bg. ASCII framing (`[ SYSTEM ]`, `>>>`), `®/©/™` as structural glyphs.
- **Texture:** halftone/1-bit dither on images, CRT scanlines (`repeating-linear-gradient`), a global low-opacity noise layer (fixed, `pointer-events:none`).
- **Avoid:** gradients, soft shadows, translucency, rounded corners, mixing the two substrates.

## Preset 4 — Soft Structural
**For:** consumer, health, wellness, lifestyle, friendly product. **Dials:** V7 / M6 / D3. **3D Tier:** 1–2.

- **Surface:** white or silver-grey; large airy floating components. Color carried by photography and one warm accent, not by chrome.
- **Type:** massive bold grotesk display; relaxed, rounded, human. Sentence case.
- **Materiality:** the **double-bezel** (nested hardware): outer shell `bg-black/5` + `ring-1 ring-black/5` + `p-1.5` + `rounded-[2rem]`; inner core with its own bg, inner highlight, and concentric smaller radius `rounded-[calc(2rem-0.375rem)]`. Unbelievably soft, highly diffused ambient shadows (large blur, very low opacity, tinted).
- **3D:** soft, rounded, pastel 3D objects; gentle float; light studio lighting (no harsh contrast). Great for product/feature hero objects.
- **Avoid:** harsh contrast, sharp corners everywhere, cold sterile flatness.

## Preset 5 — Immersive Cinematic
**For:** experiential brand sites, launches, SOTD ambitions. **Dials:** V8 / M8 / D3. **3D Tier:** 2–3. **The highest-risk language — only with the full fallback obligation met.**

- **Structure:** the page *is* a scroll-driven 3D narrative. One shared `GlobalCanvas` (r3f-scroll-rig) tracks DOM sections; camera flies on a Theatre.js timeline or GSAP scrub (see `immersive-3d.md`). HTML content rides on top for the 70% that is Design+Usability.
- **Surface:** usually dark to let WebGL light and bloom dominate; minimal chrome; type appears in cinematic reveals (mask/clip, scrub-in).
- **Motion:** Lenis smooth scroll is mandatory (the spine). Everything choreographed, nothing incidental.
- **The obligation (non-negotiable):** static poster fallback per scene; mobile gets a scaled or fully flat version; canvas lazy-mounts after LCP; `prefers-reduced-motion` pauses the 3D and presents a clean static/opacity experience; Core Web Vitals budget holds. Per the Awwwards rubric, a beautiful-but-unusable immersive site loses to a crisp flat one — Usability is 30%, Creativity only 20%.
- **Avoid:** spectacle that buries the message; autoplaying motion with no off-switch; shipping the desktop WebGL to mobile unscaled.

---

## Choosing fast

| Brief signal | Language |
|---|---|
| AI / SaaS / dev-tool / "dark, techy" | Ethereal Glass |
| portfolio / writing / "clean, premium, calm" | Editorial Minimal |
| data / technical / "raw, blueprint, terminal" | Industrial Brutalist |
| consumer / health / "friendly, soft, approachable" | Soft Structural |
| launch / brand / "wow, immersive, award" | Immersive Cinematic (verify the obligation first) |

When two fit, ask the one Design-Read question. When the brief is trust-first / public-sector / accessibility-critical, drop motion and 3D hard regardless of language.
