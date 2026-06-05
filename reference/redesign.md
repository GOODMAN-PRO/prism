# Redesign — upgrading existing projects

When the surface already exists, the rule changes: **audit first, then fix in place.** Work with the current stack — do not migrate frameworks or rewrite from scratch. Small, targeted, reviewable improvements that don't break functionality.

---

## Flow

1. **Scan.** Read the codebase. Identify framework, styling system (Tailwind v3/v4, vanilla, CSS-in-JS), existing tokens, and the current patterns. Check `package.json` before proposing any new dependency.
2. **Diagnose.** Run the audit below. List every generic pattern, weak point, and missing state — name files and lines. Run `craft.md`'s two-altitude test on the current site first (thumbnail / font-only / who) to fix the overall slop verdict, then rank every finding high/med/low by visual impact so the fix-priority order targets the worst offenders first.
3. **Fix.** Apply upgrades in priority order; after each change run the project and screenshot via `driver.mjs` (`verify.md`) at 360/768/1440 — judge the pixels, not just a clean console, and confirm no functional or layout regression before the next change. Preserve identity where committed brand colors/fonts exist (identity-preservation wins over taste).

## Fix priority (max impact, min risk)

1. **Font swap** — biggest instant lift, lowest risk (kill default/Inter; install a display family with character).
2. **Color cleanup** — remove clashing/oversaturated colors; one accent; one gray family; kill the AI purple-blue gradient; off-black instead of `#000`.
3. **Hover/active/focus states** — makes it feel alive: bg shift + `scale(0.97)` active press at ~120ms (snappy, never 200ms+) + visible focus ring + 200–300ms on hover/color transitions.
4. **Layout & spacing** — real grid, max-width container, consistent rhythm, `min-h-[100dvh]`, break the 3-equal-card row.
5. **Replace generic components** — swap clichés (3-tower pricing, dot-carousel testimonials, Lucide-everywhere) for the patterns in `components.md`.
6. **Loading / empty / error states** — the "finished" signal.
7. **Typography polish** — scale, tracking, measure, balance — the premium final touch.

## Audit checklist (the high-frequency AI tells)

**Typography:** default/Inter everywhere → family with character; flat scale → ≥1.25 ratio + tighter display tracking + lower leading; body too wide → 65ch; only 400/700 weights → add 500/600; proportional figures in data → tabular-nums; Title Case headers → sentence case; orphans → `text-wrap: balance/pretty`.

**Color & surface:** pure `#000`/`#fff` → tinted off-black/off-white; >1 accent → pick one; warm+cool grays mixed → one family; AI purple gradient → neutral base + one considered accent; black box-shadows → tinted to bg hue; flat/sterile → subtle noise/grain, OR a low-contrast ambient gradient derived from the page's own accent (never a fresh purple/blue/cyan glow); a lone dark section in a light page → commit to one theme.

**Layout:** everything centered → break symmetry; `100vh` → `100dvh`; flex `calc()` math → Grid; no container → max-width ~1400px; uniform radius → one deliberate scale; missing whitespace → double it; cards not bottom-aligned → pin CTAs; misaligned baselines across columns → align shared elements.

**Interactivity:** no hover/active → add; instant transitions → 200–300ms; missing focus ring → add (a11y, not optional); spinner-only loading → skeletons; dead `#` links → real or disabled; no active-nav indicator → style it; layout-property animation → `transform`/`opacity`; motion with no reduced-motion fallback → gate it.

**Content:** "John Doe"/"Acme"/Lorem → realistic contextual content; fake round numbers (99.99%) → organic; AI clichés (Elevate/Seamless/Unleash/Delve) → plain specific language; "Oops!"/exclamation → direct, confident copy; identical dates/avatars → vary them.

**Components:** generic border+shadow+white card → remove border or use space only; always filled+ghost button pair → add tertiary/text; pill "New/Beta" badges → vary; 3-tower pricing → emphasize recommended with color; modal-for-everything → inline/slide-over.

**Iconography:** Lucide/Feather exclusively → Phosphor/Tabler/Radix or custom; cliché metaphors (rocket=launch, shield=security) → less obvious; inconsistent stroke widths → standardize; missing favicon → add branded one.

**Code quality:** div soup → semantic HTML; inline styles → the styling system; hardcoded px → relative units; missing `alt` → describe; `z-index: 9999` → semantic scale; dead/commented code → remove; import hallucinations → verify against deps; missing meta/OG tags → add.

**Strategic omissions (what AI forgets):** privacy/terms links, a "back" path, a branded 404, form validation, a "skip to content" link, cookie consent where required.

## Upgrade techniques (pull from these to replace generic patterns)

- **Type:** variable-font weight/width interpolation on scroll/hover; outline→fill on entry; text-mask reveals over video/imagery.
- **Layout:** broken-grid asymmetry; whitespace maximization; parallax card stacks; split-screen counter-scroll.
- **Motion:** Lenis smooth scroll with inertia; staggered entry; spring physics on interactive elements; scroll-driven mask/wipe/draw-on reveals (`motion.md`).
- **Surface:** true glassmorphism (inner border + inner shadow, with fallback); cursor-tracked spotlight borders; fixed grain overlay; tinted shadows.
- **Dimension (if the brief wants "wow"):** introduce a Tier-1 accent 3D layer per `immersive-3d.md` — one shader background or hero object, lazy-loaded — rather than a full rebuild.
- **Rules:** every motion/3D upgrade you add (Lenis, parallax, counter-scroll, draw-on, the 3D layer) is gated behind `prefers-reduced-motion: reduce` — content fully visible, no transforms/pins/parallax/autoplay in that mode. A redesign that ADDS motion to a static site must now ship a reduced-motion path that did not exist before.

## Rules

Work with the existing stack. Don't break functionality — test after every change. Check the dependency file before importing. Check Tailwind version before touching config. Confirm the host can actually run a proposed technique before adding it — if there's no bundler for Lenis/GSAP, or the surface is a CMS/no-JS context, fall back to CSS-only upgrades (scroll-driven-animations, scroll-snap, `@media prefers-reduced-motion`) rather than forcing the dependency. Keep changes focused and reviewable. When done, run `preflight.md`.
