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
node ~/.claude/skills/prism/driver.mjs "http://localhost:5173/" --out ./prism-verify
```

## What it does (and what it saves)

| Check | Output | Pass condition |
|---|---|---|
| **Horizontal-overflow sweep** @ 360 / 768 / 1024 / 1440 / 1920 | console table | no width overflows (prism bans it) |
| **Console + page errors** | console line | zero `pageerror` |
| **Desktop scroll-through** | `desktop-00..NN.png` | — (you look at them) |
| **Every GSAP ScrollTrigger pin** captured at its mid-range | `pin-1.png`, `pin-2.png`, … | the "hold / stop-and-read" beats render correctly |
| **Mobile** @ 390 | `mobile-00-top.png`, `mobile-50.png` | reframes, no errors |
| **`prefers-reduced-motion`** | `reduced-top.png` | content present (not gated behind animation) |

Prints `PASS` / `FAIL` and exits `0` / `1`.

## The one rule

**READ the screenshots.** `PASS` means no overflow, no errors, reduced-motion-safe — it does **not** mean the page looks good. Open `desktop-*.png` and the `pin-*.png` holds and judge them with your eyes. Every "looks fine to me, the user saw a bug" failure came from trusting a green console over the pixels. The driver finds the *technical* faults; you still have to look.

## Pins = the stop-and-read beats

`driver.mjs` enumerates `ScrollTrigger.getAll().filter(s => s.pin)` and screenshots each at 60% of its range. This is how you confirm a page **holds** the visitor where it should (see `reference/motion.md` and the `website-engineer` skill for pacing). If it reports `0 pins` on a page that's supposed to have stop-and-read moments, the pins aren't firing — a real bug, not a render quirk. Dwell distance is printed per pin (`end − start` px); tune it to reading time.

## Playwright

The driver resolves Playwright from `cwd → $PRISM_PW → a sibling install`. On a clean machine:

```bash
npm i -D playwright && npx playwright install chromium
```

Or set `PRISM_PW` to any directory whose `node_modules` already has Playwright. Headless WebGL/canvas works via the bundled `--use-angle=swiftshader` launch args, so 3D/canvas builds render in the screenshots.
