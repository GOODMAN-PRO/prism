# Verify — the browser driver (`driver.mjs`)

Prism's Preflight says "verify in the browser." `driver.mjs` (committed next to this skill) **is** that verifier — the harness that launches a built site in real headless Chromium and drives it through the prism checks, because a markdown checklist can't click a button or see a screenshot. Use it on every build before declaring done.

## Run it

```bash
node "<this-skill-dir>/driver.mjs" <url-or-path> [--out <dir>] [--shots N]
```

- `<url-or-path>` — a dev-server URL (`http://127.0.0.1:5173`) **or** a local path (a directory containing `index.html`, or an `.html` file → opened via `file://`). Single-file/static builds: pass the path. Anything needing a server (module fetch, same-origin): start the dev server and pass its URL.
- `--out` — screenshot directory (default `./prism-verify`).
- `--shots` — number of desktop scroll-depth captures (default 5).

Example invocation:

```bash
node ~/.claude/skills/prism/driver.mjs "http://127.0.0.1:5173/" --out ./prism-verify
```

## What it does (and what it saves)

| Check | Output | Pass condition |
|---|---|---|
| **Horizontal-overflow sweep** @ 360 / 768 / 1024 / 1440 / 1920 | console table | no width overflows (prism bans it) |
| **Uncaught page errors** | console line | zero `pageerror` (uncaught exceptions only — the driver does **not** capture `console.error`/warnings; check those yourself in DevTools) |
| **Desktop scroll-through** | `desktop-00..NN.png` | — (you look at them) |
| **Every GSAP ScrollTrigger pin** captured at its mid-range | `pin-1.png`, `pin-2.png`, … | the "hold / stop-and-read" beats render correctly |
| **Mobile** @ 390 | `mobile-00-top.png`, `mobile-50.png` | reframes, no errors |
| **`prefers-reduced-motion`** | `reduced-top.png` | content present (not gated behind animation) |

Prints `PASS` / `FAIL` and exits `0` (pass) / `1` (overflow, page error, or empty reduced-motion). Exits `2` for harness errors — bad args, target not found, or Playwright missing — distinct from a content `FAIL`.

## Build contract

In dev the build **must** expose two globals or `driver.mjs`'s pin + smooth-scroll checks silently fail: `window.__lenis = lenis` (right after `new Lenis(...)`) and `window.ScrollTrigger = ScrollTrigger` (after `gsap.registerPlugin(ScrollTrigger)`). Without them the driver degrades to native scroll and reports `0 pins` on a CORRECT page.

The driver waits for `networkidle` (60s cap) before each capture. If your build keeps a connection open (analytics polling, sockets), it may never idle and time out — disable that telemetry in dev, or the run will abort before screenshots.

## The one rule

**READ the screenshots.** `PASS` means no overflow, no errors, reduced-motion-safe — it does **not** mean the page looks good. Open `desktop-*.png` and the `pin-*.png` holds and judge them with your eyes. Every "looks fine to me, the user saw a bug" failure came from trusting a green console over the pixels. The driver finds the *technical* faults; you still have to look.

Prefer pointing the driver at a **production** build (`vite build && vite preview`), not the HMR dev server — dev bundles mask overflow, CLS, and load-order bugs that only appear in the real output you ship.

## Pins = the stop-and-read beats

`driver.mjs` enumerates `ScrollTrigger.getAll().filter(s => s.pin)` and screenshots each at 60% of its range. This is how you confirm a page **holds** the visitor where it should (see `reference/motion.md` and the `website-engineer` skill for pacing). If it reports `0 pins` on a page that's supposed to have stop-and-read moments, that almost always means `window.ScrollTrigger` was never exposed, **not** that pins are broken. The driver reads `ScrollTrigger.getAll()` off `window`, so your build MUST run `window.ScrollTrigger = ScrollTrigger` after `gsap.registerPlugin(ScrollTrigger)`. Only after confirming the global is set should you treat `0 pins` as the pins failing to fire. Dwell distance is printed per pin (`end − start` px); tune it to reading time.

## Playwright

The driver resolves Playwright from `cwd → $PRISM_PW → a sibling install`. On a clean machine:

```bash
npm i -D playwright && npx playwright install chromium
```

Or set `PRISM_PW` to any directory whose `node_modules` already has Playwright. Headless WebGL/canvas renders via the bundled launch args `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --no-sandbox`; `--enable-unsafe-swiftshader` is what lets recent Chromium run WebGL under SwiftShader, so 3D/canvas builds appear in the screenshots.
