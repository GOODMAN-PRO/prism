# Motion — the decision framework, timing, GSAP, Motion, reduced-motion

Motion is part of the build, not a coat of paint. Every animation answers "why does this move?" before it ships. This file merges the craft (when/how to animate) with the verified numbers (durations, easings) and the two engines (GSAP for scroll/timelines, Motion for component state).

---

## 1. The decision framework (run before writing any animation)

**1. Should this animate at all?** Frequency decides:

| Seen… | Decision |
|---|---|
| 100+×/day (shortcuts, command palette) | **No animation, ever.** Raycast has no open animation — that's correct. |
| tens×/day (hover, list nav) | Drastically reduce or remove |
| occasional (modal, drawer, toast) | Standard animation |
| rare/first-time (onboarding, success) | Can add delight |

Never animate keyboard-initiated actions.

**2. What's the purpose?** Valid: spatial continuity, state indication, feedback, explanation, preventing a jarring change. Invalid: "it looks cool" on something seen often. If you can't name the purpose in one sentence, drop it.

**3. What easing?** Entering/exiting → **ease-out**. Moving/morphing on screen → ease-in-out. Hover/color → ease. Constant (marquee, spinner) → linear. Default → ease-out. **Never `ease-in` for UI** (starts slow, feels sluggish at the moment the user is watching). **Never `transition: all`** — name the properties.

**4. How fast?** Under 300ms for UI. See the table.

---

## 2. Timing — duration by element type

Verified bands (LottieFiles motion-design-skill; aligns with Material 3). Use as defaults:

| Element | Duration |
|---|---|
| Tooltip / micro-feedback | 80–120ms |
| Button / toggle | 120–180ms |
| Icon transition | 150–250ms |
| Card enter/exit | 200–350ms |
| Modal / dialog | 300–400ms |
| Page transition | 400–600ms |
| Dramatic reveal | 600–1200ms |
| Ambient / loop | 2000–20000ms |

**Two scaling rules:**
- **Exit = 65–75% of enter.** Slow where the user decides, fast where the system responds. (Hold-to-delete press 2s linear; release 200ms ease-out.)
- **Scale duration with size and travel distance** — a large modal gets more time than a small toggle (Fluent 2). Bigger/further = longer.

---

## 3. Easing tokens

CSS built-in easings are too weak. Use these named curves:

```css
:root {
  /* Verified, directional */
  --ease-standard:   cubic-bezier(0.2, 0, 0, 1);          /* MD3 Standard — default UI */
  --ease-emphasized: cubic-bezier(0.05, 0.7, 0.1, 1);     /* MD3 Emphasized-Decelerate — hero entrances */
  --ease:            cubic-bezier(0.25, 0.1, 0.25, 1);    /* CSS 'ease' — hover/color */
  --ease-out-back:   cubic-bezier(0.175, 0.885, 0.32, 1.275); /* subtle settle/overshoot */
  /* Emil's strong curves */
  --ease-out:        cubic-bezier(0.23, 1, 0.32, 1);      /* strong ease-out — enter/exit */
  --ease-in-out:     cubic-bezier(0.77, 0, 0.175, 1);     /* strong — on-screen movement */
  --ease-drawer:     cubic-bezier(0.32, 0.72, 0, 1);      /* iOS-like drawer/sheet */
}
```

Direction: **enter → ease-out, exit → ease-in, on-screen → ease-in-out, loop → linear/sine.** No bounce/elastic in professional UI (reserve `--ease-out-back` for playful drag/settle). Carve-out: an overshoot on a *press* is permitted ONLY for explicitly playful/consumer briefs, and only via a Motion spring (velocity-based, interruptible) — never as a CSS overshoot curve set as the universal default. Don't hand-roll curves — these are the vetted set.

---

## 4. Micro-interactions (the unseen details that compound)

- **Press feedback:** every pressable gets `:active { transform: scale(0.97) }`, `transition: transform ~0.12s var(--ease-out)`. Subtle (0.95–0.98; smaller travel on larger surfaces). This snappy decelerate stays on `var(--ease-out)` by default — no overshoot/bounce. An overshoot/spring press is the sanctioned exception ONLY for explicitly playful briefs (implemented as a Motion spring, never a CSS overshoot curve), so Section 3's "no bounce/elastic in UI" law does not forbid it there. Never a .25s+ ease on a press (reads laggy/cheap).
- **Never animate from `scale(0)`.** Nothing appears from nothing. Start `scale(0.95)` + `opacity:0`.
- **Origin-aware popovers:** `transform-origin: var(--radix-popover-content-transform-origin)` (scale from the trigger). **Exception: modals stay `center`.**
- **Tooltips:** delay the first, then instant (no delay/animation) on adjacent ones (`[data-instant]{transition-duration:0ms}`).
- **Blur to mask imperfect crossfades:** add `filter: blur(2px)` mid-transition so two states read as one. Keep <20px (expensive in Safari).
- **`@starting-style`** for JS-free entrance:
  ```css
  .toast { opacity:1; transform:translateY(0); transition:opacity 400ms, transform 400ms;
    @starting-style { opacity:0; transform:translateY(100%); } }
  ```
- **Transitions, not keyframes, for rapidly-retriggered UI** (toasts, toggles) — transitions retarget mid-flight; keyframes restart from zero.
- **Stagger** grouped entrances 30–80ms apart (never mount all at once); stagger is decorative, never block interaction on it.
- **`clip-path` reveals:** `inset(0 100% 0 0)` → `inset(0 0 0 0)` for wipes, hold-to-delete fills, image reveals on scroll, comparison sliders — fully GPU-accelerated.

---

## 5. Springs (Motion)

Springs feel alive and survive interruption (CSS keyframes restart; springs keep velocity). Use for drag/momentum, gestures, "alive" elements, decorative mouse-tracking.

```jsx
// Apple model (easier to reason about)
{ type: "spring", duration: 0.5, bounce: 0.2 }   // keep bounce 0.1–0.3, mostly avoid in UI
// Traditional
{ type: "spring", stiffness: 100, damping: 20 }
```

Magnetic / mouse-tracked motion: interpolate with `useSpring`, never raw mouse value, and never `useState` (re-renders every frame):

```jsx
const x = useSpring(useMotionValue(0), { stiffness: 100, damping: 10 });
```

---

## 6. GSAP — scroll, pinning, timelines

GSAP owns scroll-driven and choreographed sequences. **Lenis** is the smooth-scroll spine underneath. Register once; always clean up with `gsap.context` + `ctx.revert()`; gate on reduced motion.

**Prefer `useGSAP()` (from `@gsap/react`) over raw `useEffect`/`useLayoutEffect`.** It's a drop-in for `useLayoutEffect` that auto-reverts every animation and ScrollTrigger it creates (via `gsap.context`) on unmount, is SSR-safe, and exposes `contextSafe()` to wrap event handlers that create animations after mount. Pass `{ scope: ref, dependencies: [...] }` instead of hand-writing the context + revert.

### Lenis + ScrollTrigger sync

```jsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
if (process.env.NODE_ENV !== "production") window.ScrollTrigger = ScrollTrigger; // dev-only: driver.mjs needs this global

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    if (process.env.NODE_ENV !== "production") window.__lenis = lenis; // dev-only: driver.mjs needs this global
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t) => { lenis.raf(t * 1000); };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); lenis.destroy(); };
  }, []);
}
```

> **Driver build contract:** the dev-only `window.__lenis` and `window.ScrollTrigger` globals above are required — without them `driver.mjs`'s pin + smooth-scroll checks silently fail, the driver degrades to native scroll and reports "0 pins" on a *correct* page.

### Sticky-stack (cards pin and shrink as the next arrives)

```jsx
const { contextSafe } = useGSAP(() => {
  if (reduce) return;
  const cards = gsap.utils.toArray(".stack-card");
  cards.forEach((card, i) => {
    if (i === cards.length - 1) return;
    ScrollTrigger.create({ trigger: card, start: "top top",
      endTrigger: cards[cards.length - 1], end: "top top", pin: true, pinSpacing: false });
    gsap.to(card, { scale: 0.92, opacity: 0.55, ease: "none",
      scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true } });
  });
}, { scope: ref, dependencies: [reduce] });
```

### Horizontal pan (pin a section, scrub the track sideways)

```jsx
const distance = track.current.scrollWidth - window.innerWidth;
gsap.to(track.current, { x: -distance, ease: "none",
  scrollTrigger: { trigger: wrap.current, start: "top top",
    end: () => `+=${distance}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
```

Critical for both: `start: "top top"`, `pin: true`. The #1 bug is `start: "top center"` so the animation fires before the section pins.

### Scrubbed text reveal (word-by-word fade tied to scroll)

Split with GSAP **SplitText** (now free) into words, then fade each up as it scrolls through:

```jsx
const { contextSafe } = useGSAP(() => {
  if (reduce) return; // reduced motion: leave text at full opacity, no split
  const split = new SplitText(ref.current, { type: "words" });
  gsap.fromTo(split.words, { opacity: 0.12 }, { opacity: 1, stagger: 0.08, ease: "none",
    scrollTrigger: { trigger: ref.current, start: "top 80%", end: "top 30%", scrub: true } });
  return () => split.revert(); // restore original DOM in cleanup
}, { scope: ref, dependencies: [reduce] });
```

---

## 7. Motion (motion/react) — component state & in-view

For entrance-on-scroll and component state, prefer Motion over GSAP (lighter, no ScrollTrigger). For pin/scrub, use GSAP.

```jsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function Reveal({ items }) {
  const reduce = useReducedMotion();
  return items.map((item, i) => (
    <motion.li key={item}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}>
      {item}
    </motion.li>
  ));
}
```

- `useReducedMotion()` is `null` on the first SSR render and resolves client-side — treat `null` as no-preference-yet and avoid divergent SSR/client markup (branch inside effects or guard the motion-only branch) to prevent a hydration flash.
- **Do NOT apply one uniform fade-up to every section** — identical fade-up-on-scroll across a page is a slop tell. Reserve entrance motion for content that benefits, vary the gesture (clip-path wipe, mask, scale-from-95, directional slide tied to layout), and let most below-fold content simply be present.
- Scroll-linked values: `useScroll` + `useTransform` (parallax, progress bars). Hardware-accel: Motion's `x`/`y`/`scale`/`rotate`/`opacity` shorthands ARE hardware-composited and skip layout — prefer them. Avoid driving layout props (`width`, `top`, `margin`) or layout animations on hot paths; use transform-based moves and FLIP only when measured.
- Exit animations: wrap in `<AnimatePresence>`.

---

## 8. Page & view transitions

- **View Transitions API** for same-document route changes: `document.startViewTransition(() => updateDOM())`; name shared elements with `view-transition-name` for morphing. Wrap in a `prefers-reduced-motion` guard.
- **Motion `<AnimatePresence>`** for component/route enter-exit where VT isn't available. Keep page transitions in the 400–600ms band; exits faster than enters.

---

## 9. Performance budgets (hard gates)

- **Animate only `transform` and `opacity`** (GPU, skip layout+paint — effectively unlimited). `color`/`clip-path` limited to ~10–15 elements. Keep **<20 animated elements per viewport**.
- **Target 60fps (16.67ms/frame); animation logic <10ms/frame.** Never animate `top/left/width/height/margin/padding`.
- **`will-change: transform`** only on actively-animating elements; remove after.
- **CSS variables inherit** — updating `--x` on a parent recalcs all children; set `transform` directly on the moving element instead.
- **CSS animations beat JS under load** (run off main thread). Use CSS/WAAPI for predetermined motion, JS for dynamic/interruptible. `backdrop-blur` only on fixed/sticky elements, never scrolling content. Noise/grain only on fixed `pointer-events:none` layers.
- **Mobile:** duration ×0.8, stagger budgets −30%, touch feedback <100ms, **avoid parallax** entirely.

---

## 10. prefers-reduced-motion — transform, don't disable

Reduced motion means *gentler*, not *none*. Keep opacity/color (they aid comprehension); remove movement.

| Default | Reduced-motion |
|---|---|
| Slide / translate entrance | Opacity fade only |
| Parallax | Static position |
| Bounce / spring | Instant or simple ease-out |
| Auto-playing loop | Paused, user-initiated |
| Scroll-driven 3D / scrub | **Paused — show a static frame** |

Halve durations, never auto-play loops. This is WCAG 2.3.3 (opacity/color are exempt from "motion").

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration:.01ms !important; animation-iteration-count:1 !important;
    transition-duration:.01ms !important; scroll-behavior:auto !important; }
}
```
…but prefer *targeted* fallbacks (keep meaningful crossfades) over the global kill-switch. In React, branch on `useReducedMotion()`; for R3F, it must pause the frameloop / scroll-driven camera and present a static composition.
