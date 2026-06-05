# Preflight — the pre-ship gate

Run this top to bottom before declaring any build done. It is mechanical on purpose: count, check, verify. If the dev server can render the work, verify in the browser too (screenshot, console, responsive resize) — never ask the user to check what you can check yourself. A failure here is shipping broken work, not a nitpick.

---

## 1. Intent & system
- [ ] The one-line **Design Read** was declared (page kind, audience, vibe, design language, 3D tier).
- [ ] One **design language** chosen and committed; not blended with another.
- [ ] **Palette locked:** OKLCH, ≤1 accent (<80% sat), one gray family, used consistently — no surprise off-palette CTA or badge anywhere on the page.
- [ ] **Type locked:** ≤3 families; display family has character (not default/Inter unless justified); ≤1 radius scale; spacing on one base grid.
- [ ] Theme is consistent — sections don't invert (no light section dropped into a dark page).

## 2. Anti-slop sweep (count the tells)
- [ ] No Inter-by-default · no AI purple-blue glow gradient · no pure `#000`/`#fff` · no emojis in UI · no gradient-clip text · no ghost-card (1px border + big soft shadow) · no `border-radius ≥24px` on cards · no sketchy hand-drawn SVG · no `repeating-linear-gradient` stripes.
- [ ] **Eyebrows ≤ ceil(sections / 3).** Count `uppercase tracking` labels above headings; if over, cut.
- [ ] **No repeated layout family**; ≤2 image+text zigzags in a row; ≥4 distinct families across an 8-section page.
- [ ] **Bento** has exactly N cells for N items (no blank tiles); ≥2–3 cells carry real visual variation.
- [ ] **Two-altitude slop test passes:** you can't guess the aesthetic from category alone, nor from category + obvious anti-reference.

## 3. Hero & layout discipline
- [ ] Hero fits the initial viewport; headline ≤2–3 lines; subtext ≤20 words; ≤4 text elements; top padding ≤`pt-24`; a real visual (not text + gradient blob).
- [ ] Nav on one line at desktop, ≤80px tall, active route marked.
- [ ] One CTA label per intent across nav + hero + footer.
- [ ] `min-h-[100dvh]` (not `h-screen`); max-width container; explicit `<768px` collapse per multi-column block; no horizontal scroll on mobile.

## 4. Color, contrast, accessibility
- [ ] **Contrast verified** on every text run, button, and placeholder: body 4.5:1, large 3:1, UI boundary 3:1. Placeholders are not muted-gray.
- [ ] Visible **focus-visible** rings; keyboard-navigable; `Escape` closes overlays and restores focus.
- [ ] 44px touch targets; `alt` on meaningful images; semantic HTML (`nav/main/section/article`); a "skip to content" link.
- [ ] Reduced-transparency fallback for any glass.

## 5. States & copy
- [ ] **Loading** (skeleton matching layout) / **empty** (composed) / **error** (inline, not `alert()`) exist wherever data loads.
- [ ] `:active` press feedback (`scale(0.97)`); hover gated behind `(hover:hover)`.
- [ ] **Copy self-audit:** re-read every visible string — no AI clichés, no fake-precise numbers, no broken grammar/referents, no generic names/Lorem, sentence case headers, button labels = verb + object.

## 6. Motion
- [ ] Every animation is **motivated** (one-sentence purpose); nothing animates "because it looked cool"; keyboard-triggered actions don't animate.
- [ ] Custom easing (no raw `linear`/`ease-in-out` default, no `transition: all`); enter ease-out, exit ease-in at 65–75%; durations in the element-type bands.
- [ ] **Only `transform`/`opacity`** animated; <20 animated elements/viewport; no animation from `scale(0)`; GSAP `start: "top top"` on pinned sections; `ctx.revert()` cleanup present.
- [ ] **`prefers-reduced-motion`** path exists and is a *transformation* (keep opacity, strip movement, kill loops, halve duration) — not missing, not a blanket kill of meaningful crossfades.
- [ ] ≤1 marquee; reveal animations enhance already-visible content (not gated visibility that ships blank in headless render).

## 7. Immersive 3D (Tier ≥ 1 only)
- [ ] Canvas is **code-split + lazy-mounted**; it is **not** the LCP element; LCP is an HTML/poster.
- [ ] Canvas box reserved (no CLS); `dpr` clamped `[1,2]`; `frameloop="demand"` unless continuously animating.
- [ ] Draw calls bounded (instancing/merging for repeated geometry); assets KTX2/Draco-compressed and payload-budgeted; postprocessing scales down on weak GPUs.
- [ ] **Reduced-motion pauses the frameloop** and shows the static poster; **mobile** is scaled-down or falls back to the poster (no unscaled desktop WebGL on phones).
- [ ] Selective bloom done on materials (`toneMapped={false}` + emissive >1), not globally.
- [ ] fps and Core Web Vitals (LCP <2.5s, INP <200ms, CLS <0.1) **measured on real mid-range hardware**.

## 8. Code & ship hygiene
- [ ] Every import verified against `package.json`; no hallucinated deps; library versions checked (they move fast).
- [ ] Motion/scroll/WebGL components isolated as `'use client'` leaves; continuous values off `useState`.
- [ ] Favicon, `<title>`, meta description, OG image present; privacy/terms + a "back" path + branded 404.
- [ ] No dead/commented code, no `z-index: 9999`, no inline-styles-mixed-with-system.

## 9. The award-criteria self-check (the unifying question)
Score the build against the rubric the way a jury would — **Design 40 · Usability 30 · Creativity 20 · Content 10**:
- [ ] **Would Usability survive the spectacle?** Could a first-time visitor navigate, read, and load this fast on a mid phone? If the 3D/motion costs navigability or load, it's a net negative — cut it or drop a tier.
- [ ] **Is the Design (40%) sound *without* the Creativity layer?** Strip the 3D/animation in your head: is the static interface still well-typed, well-spaced, well-color'd, hierarchically clear? If not, fix the foundation before the spectacle.
- [ ] **Does it pass the "AI made that" test?** If someone could say so without doubt, it failed — return to §2.

**Done means every box is checked.** Not "it renders." If you can't check a 3D box, drop the tier and re-run — a flawless flat site wins 70% of the rubric outright.
