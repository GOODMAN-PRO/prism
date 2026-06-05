# Craft — the 0%-slop, production-grade bible

This is the bar. Everything prism ships clears it or it isn't done. There are two ways to fail, and you must beat both:

- **Slop** — it *looks* like the AI default. A senior designer can spot it from a thumbnail.
- **Demo-ware** — it *looks* fine but doesn't **work**. Fake components, broken interactions, jank. A senior engineer rejects it on first click.

**Production-grade = neither.** It looks like nobody's template *and* behaves like a real product. Hold both at once.

---

## Part 1 — The anti-slop bible (looks like no template)

### The AI-default tells — ban these on sight

| Slop tell | Why it screams "AI" | The antidote |
|---|---|---|
| **Inter / Geist / Space Grotesk** as the only font; Instrument Serif for "elegant" | the literal defaults of every AI mock | a deliberate pairing — a distinctive display face + a clean workhorse (see `resources.md` fonts; Fontshare/OFL picks). Set with intent: optical sizes, real tracking, a **scale jump** (display ≫ body), not 3 sizes that look the same |
| **Purple→violet gradients**, cyan/lime glow on near-black, the "AI blue" | the default palette of generated UI | one committed palette, **one** accent earned by restraint (≤10% of surface). Color from content/photography, not chrome. OKLCH for even steps |
| Hero → **3 icon-tile feature cards** → testimonial carousel-with-dots → CTA, everything centered, equal-weight grid | the one layout the model reaches for | asymmetry, editorial **scale contrast**, a different layout family per section (**no family repeats**, max 2 zigzags in a row), structure driven by the content's real hierarchy |
| **Glow box-shadows everywhere**, glassmorphism on every surface, gradient text on everything, emoji as icons | decoration with no light logic | effects **earned and rare**; real icons (Lucide/Phosphor); depth from a single consistent light source, shadows tinted + layered (not one fat blur); glass only where it's purposeful + has a `prefers-reduced-transparency` fallback |
| **01 / 02 / 03** as the only rhythm; centered everything; perfectly even spacing | filler structure | real typographic hierarchy; deliberate asymmetric whitespace; a grid you can *feel* but didn't center-everything into |
| Copy: "Elevate your workflow," "Unlock the power of," "Seamlessly," "Supercharge," lorem | nobody talks like this | real, specific, opinionated copy. Name the thing. A point of view. Never lorem in a deliverable |
| Stock-y everything: same Unsplash hero, same abstract blob, same dashboard screenshot | interchangeable | art-directed, content-true imagery; if generic, at least *consistent* and intentional |

### The two-altitude test (run it before you commit)
- **Thumbnail test:** at 200px, could a designer guess "an AI made this"? If yes → slop.
- **Font-only test:** strip color and layout — does the *type alone* have a point of view? If it's Inter at three weights, no.
- **The "who" test:** could this be *any* brand? Production work feels like it could only be *this* one.

---

## Part 2 — The production-grade gate (works like a product)

Slop is half the battle. The other half is the thing this session proved over and over: **make components actually work.** A beautiful component that lies is demo-ware.

### Components must be real, not decorative
- A **progress / slider bar reflects real state and is seek-able** — driven by actual playback/position, click-and-drag to scrub. Never a CSS keyframe pretending to be progress.
- A **form** validates, shows errors inline, has disabled + loading states, and actually submits (or honestly says it's a demo).
- A **cart / counter / toggle** changes real state and persists within the session.
- **Async actions reconcile:** an optimistic update (toast, count bump, status flip) **must roll back and surface the error on failure** — never a permanent fake-success. Pending → success/error, every time.
- **Tabs, accordions, modals, menus** open, close, trap focus, and close on Escape + outside-click.
- If it implies an action, it **performs** it. No fake buttons.

### The state matrix — every interactive element has all of these
`:hover` · `:active` · `:focus-visible` · `:disabled` · plus `empty` / `loading` / `error` where data is involved. Missing `:focus-visible` alone fails the gate (keyboard users are invisible without it).

### Micro-interaction physics (the feel)
- **Press feedback is snappy and scales to the brief.** Default (professional/editorial/tools): `:active { transform: scale(0.97) }` (dip `0.95`–`0.98`; smaller travel on big surfaces), `transition: transform ~0.12s var(--ease-out)` — snappy decelerate, no overshoot. Playful/consumer briefs may use a deeper dip (~`scale(0.94)`) with a subtle spring on release — but as an explicit, vibe-justified exception via a Motion spring (velocity-based), never a CSS overshoot as the default. Universal: a press on a `.25s+ ease` feels laggy and cheap; never bounce a serious UI.
- **Zero layout shift on state change.** The classic slop bug: a label swap (`+ Add` → `✓ Added`) that **resizes the button**. Reserve the space — fixed `min-width`, or animate only transform/opacity/color. CLS must be 0.
- **Optical, not geometric, centering.** A play `▶` triangle centered by its box sits visually left — nudge it right by ~5–8% of its width, tuned by eye per icon; the exact offset is per-glyph, not a fixed constant. Icons in circles, glyphs in buttons: trust your eye, not the box. (This one bug makes a whole UI feel "off.")
- Hover transitions ~0.2–0.35s; **never** transition `all` (animate the named properties).

### Motion that doesn't betray
- **Motivated, not decorative.** Every animation earns its place or it's cut.
- **`prefers-reduced-motion` is mandatory** — content fully visible, no transforms/pins/parallax, no auto-playing motion. Gate every GSAP/scroll effect behind it.
- **No scroll-jank.** Never couple animation speed to *raw, unclamped* scroll velocity — it whips and reads as broken (a real bug we shipped and fixed). Keep ambient motion at a **constant calm** speed; clamp anything velocity-reactive hard.
- **Anchors smooth-scroll, never jump** — wire in-page `#links` through Lenis (with a nav-height offset); every link resolves to a real target, dead links don't yank to top.
- Animate **transform/opacity only** (GPU). Never animate `width`/`top`/`left`/`margin`. Hold 60fps; lazy-mount the WebGL canvas after LCP.

### Accessibility — non-negotiable for production
- **Semantic HTML:** `nav` / `main` / `section` / `header` / `footer`; a button is `<button>`, a link is `<a href>`. Don't `div onclick`.
- **Keyboard:** everything reachable and operable; **visible `:focus-visible`**; logical tab order; Escape closes overlays; focus trapped in modals and returned on close.
- **Contrast AA** (4.5:1 body text, 3:1 large). Don't ship gray-on-gray you can't read.
- **Honor** `prefers-reduced-motion` and `prefers-reduced-transparency`. Real `alt` text. `aria-*` only where native semantics fall short — don't sprinkle it.

### Performance & layout integrity
- **No horizontal overflow at 360 / 768 / 1024 / 1440 / 1920.** Prism's hard ban — clip marquees/decor (`overflow:clip`), watch `100vw` + scrollbars, fluid `clamp()` type.
- **CLS = 0:** every image/video has explicit `width`/`height` or `aspect-ratio`; reserve space for anything async. Fonts: `preconnect` + `display:swap` (+ `size-adjust` to kill the swap shift).
- Below-fold media `loading="lazy"`; responsive `srcset`; modern formats; optimize 3D assets (`resources.md` → glTF-Transform/Draco/KTX2).
- Budget INP and LCP; no long main-thread tasks; debounce scroll/resize work.

### The optical 1% (what separates "good" from "expensive")
- Consistent spacing scale; align to a real grid; kill orphan widths.
- Hairlines render at true 1px; borders that actually read; shadows with one light direction, tinted, **layered** (a tight contact shadow + a soft ambient one — never a single 40px blur).
- Typographer's quotes `" "` and dashes `— –`; **no widow** on a headline (balance it); **tabular numbers** for stats, timers, prices, so they don't jitter.
- Generous, *intentional* whitespace — premium is restraint + scale + letting the content breathe, not filling every pixel.

---

## Part 3 — The self-audit (run on YOUR OWN output before "done")

You are the senior reviewer. Be adversarial with your own work.

1. **Slop pass** — thumbnail test, font-only test, the "who" test. Default to *fail*; demand it earn the pass.
2. **Works pass** — click/tab/scroll **every** interactive thing. Does it do what it implies? Any layout shift? Keyboard-operable? Reduced-motion honored? Does the slider actually slide, the form actually validate, the link actually scroll?
3. **The pixels pass** — open the screenshots from `driver.mjs` (see `verify.md`) and the pin/mobile/reduced-motion shots and **judge them with your eyes.** `PASS` means no overflow/errors — it does **not** mean it looks good. Every "looked fine to me, the user found a bug" came from trusting a green console over the pixels.

## The bar
Production-grade = **a senior designer AND a senior engineer would both sign off.** If either would send it back — for looking templated, or for a component that doesn't truly work — it is not done. Ship to that bar or keep going.
