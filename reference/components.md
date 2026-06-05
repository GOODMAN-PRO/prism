# Components — the UI taxonomy

Best-in-class patterns for the components every site needs. Each entry: the discipline rules (what makes it not-slop) + a code-ready pattern. Source banks to copy from (not stack mandates): **React Bits** (matches our exact R3F+GSAP+motion stack), **Aceternity UI** (named patterns), **shadcn/ui** (`npx shadcn@latest add` — controllable base, ships Radix primitives for accessible behavior).

> Every interactive component below ships all states (default / hover / `:active` scale(0.97) / focus-visible ring / disabled) and, where it loads data, loading + empty + error. That is not optional.

---

## Navigation

**Rules:** single line on desktop (condense or hamburger at `lg`, never two rows); height ≤80px (default 64–72px); mark the active route; ONE label per intent across nav+hero+footer (no "Get started" + "Sign up" + "Try free" pointing at the same place).

- **Floating glass pill** (detached: `mt-6 mx-auto w-max rounded-full backdrop-blur` + hairline border + solid `prefers-reduced-transparency` fallback).
- **Resizable on scroll** (Aceternity pattern): full-width at top, condenses to a centered pill after a scroll threshold — drive width/padding with `useScroll`+`useTransform`, not `useState`.
- **Hide-on-scroll-down / show-on-scroll-up** for reading-heavy pages.
- **Mobile:** hamburger morphs to X (`rotate-45`/`-rotate-45`), full-screen overlay (`backdrop-blur-3xl`), links **stagger** in (`translateY(12px)→0`, 50ms apart).

## Hero

**Rules (hard):** fits the initial viewport; headline ≤2–3 lines in an ultra-wide container (`max-w-5xl/6xl`); subtext ≤20 words / ≤4 lines; max 4 text elements (eyebrow? / headline / subtext / CTAs = 1 primary +≤1 secondary); top padding ≤`pt-24`; a **real visual**, never text + gradient blob. **Banned in hero:** trust micro-strip, pricing teaser, feature bullets, avatar row, stat tiles — those go in sections below. "Used by" logo wall is its own section under the hero.

- **Layouts:** Cinematic Center (massive width, full-bleed bg with radial wash) · Editorial Split (type left, asset right, huge negative space) · Artistic Asymmetry (offset type, overlapping floating asset). Centered only for manifesto/launch.
- **3D hero (Tier ≥1):** floating object or shader gradient behind the type, lazy-mounted, with a static poster fallback (see `immersive-3d.md`). Type can reveal via clip/mask on load.
- **Signature move (optional):** inline image-in-heading — a small rounded image at type-height between words (`<span class="inline-block w-24 h-10 rounded-full bg-cover align-middle">`). Stacks below the headline on mobile. No overlap with text.

## Bento grid

**Rules:** exactly N cells for N items (no blank tiles); `grid-auto-flow: dense` so spans interlock; vary cell sizes for rhythm (not 6 identical); ≥2–3 cells carry real visual variation (image / brand gradient / pattern / 3D), not text-on-white; mobile collapses to single column, all `col-span` reset.

```jsx
<div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-4 [grid-auto-flow:dense]">
  <Cell className="md:col-span-2 md:row-span-2" media={<Visual/>} />
  <Cell className="md:col-span-2" />
  <Cell /><Cell />
</div>
```

## Cards

**Rules:** cards only when elevation communicates real hierarchy — otherwise group with `border-t`/`divide-y`/space. Nested cards never. One radius scale. Tint shadows to bg hue. Pin CTAs to the card bottom so they align across a row; align titles/prices/descriptions on a shared baseline.

- **Double-bezel** (premium hardware feel, Soft Structural / Ethereal Glass): outer shell `bg-white/5 ring-1 ring-black/5 p-1.5 rounded-[2rem]` → inner core with its own bg, inner highlight `shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]`, concentric radius `rounded-[calc(2rem-0.375rem)]`.
- **Spotlight border** on hover (cursor-tracked radial highlight) for dark themes — drive with a motion value, gate behind `(hover:hover)`.

## Forms

**Rules:** label **above** input; helper optional (present in markup); error **below**; `gap-2` blocks. **No placeholder-as-label, ever.** Focus ring in accent (3:1 contrast). Verify placeholder contrast (4.5:1 — not muted gray). Inline errors, never `alert()`. Validate on blur + submit. Button labels = verb + object ("Create account", not "Submit").

```jsx
<div className="flex flex-col gap-2">
  <label htmlFor="email" className="text-sm font-medium">Email</label>
  <input id="email" type="email" aria-describedby="email-err"
    className="rounded-lg border px-3 py-2 focus-visible:ring-2 focus-visible:ring-[--accent] outline-none" />
  <p id="email-err" role="alert" className="text-sm text-red-600 empty:hidden" />
</div>
```

## Modals & dialogs

**Rules:** use the native `<dialog>` or a portal — never `position:absolute` inside an `overflow:hidden`/`auto` container (it clips). Backdrop + focus trap + `Escape` + restore focus on close (shadcn/Radix Dialog handles this). Modals scale from **center** (`transform-origin: center`), 300–400ms. Prefer slide-overs or inline editing over modals for simple actions.

## Marquee

**Rules:** **≤1 per page.** For logos / "lots of things that don't need individual attention." Real SVG logos (Simple Icons), not text wordmarks; logo-only (no category labels). Pause on hover; duplicate the track for a seamless loop; `linear` easing.

## Pricing

**Rules:** highlight the recommended tier with color/emphasis, not just extra height. Feature lists start at the same Y across columns (fixed-height title/price blocks). No 20-row matrix on a marketing page — top differentiators + "full comparison" disclosure. One CTA intent.

## Testimonials

**Rules:** quote body ≤3 lines (cut the source quote); real typographic quotes (" ") or none; attribution = name + role + company (never "— Sarah"). Avoid the 3-card-carousel-with-dots default — try a masonry wall, a single rotating quote, or overlapping portraits + minimalist type. No em-dashes as flourish inside quotes.

## Accordion (FAQ)

**Rules:** strip container boxes — separate items with `border-bottom` only; sharp `+`/`−` toggle; animate height with opacity (trial-and-error the pairing); content visible by default for SEO/headless (don't gate visibility on a class-triggered transition). Radix/shadcn Accordion for accessible keyboard + `aria-expanded`.

## Footer

**Rules:** simplify — main paths + legally-required links, not a 4-column link farm. Include the legal links (privacy, terms), a real favicon reference, and a way back. One CTA intent matching the rest of the page.

---

## Component source decision

| Need | Reach for |
|---|---|
| Animated/3D/shader background or text effect on our stack | **React Bits** (copy in; same R3F+GSAP+motion deps) |
| A named premium pattern (resizable navbar, hero parallax, 3D marquee, animated modal) | **Aceternity UI** (adapt the pattern; don't assume its stack) |
| Accessible base primitives you'll restyle (dialog, accordion, dropdown, tabs) | **shadcn/ui** (`npx shadcn add` → owns the source; Radix under the hood) |
| Anything bespoke | Build it here against `foundations.md` + `motion.md` |

One component system per project. Don't mix Material into a shadcn tree. Verify every import against `package.json` first.
