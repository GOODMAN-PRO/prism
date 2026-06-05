# Performance — 3D budgets, Core Web Vitals, fallbacks

This file is why the immersive layer can win instead of lose. Recall the rubric: **Usability is 30%, Creativity 20%.** Load speed and responsiveness sit *inside* Usability, so a heavy scene that hurts them costs more than the spectacle earns. Performance is a design constraint, not a cleanup step.

---

## 1. Core Web Vitals — the gates a heavy site fails

| Metric | Target | What threatens it | Defense |
|---|---|---|---|
| **LCP** (largest paint) | <2.5s | A `<Canvas>` or huge hero asset as the largest element; render-blocking 3D bundle | The LCP element is **HTML/poster**, never the live canvas. Lazy-mount WebGL *after* first paint. |
| **INP** (interaction latency) | <200ms | Long main-thread tasks from physics/`useState`-per-frame/heavy hydration | Keep per-frame logic <10ms; continuous values off React state; code-split the 3D. |
| **CLS** (layout shift) | <0.1 | Canvas/media without reserved dimensions | Reserve the canvas box (aspect-ratio / fixed height) before mount. |
| **TBT/TTI** | low | Shipping Three.js + shaders in the initial bundle | Dynamic-import the whole 3D layer; it's not in the critical path. |

**Rule:** the WebGL canvas must never be the LCP element and never block it. Paint a static poster as the hero; swap in (or overlay) the canvas once it's mounted and the page is interactive.

## 2. Lazy-mount and code-split the canvas (always)

```jsx
// React: split the 3D bundle out of the initial load
import { lazy, Suspense } from "react";
const HeroScene = lazy(() => import("./HeroScene"));   // separate chunk

<div className="relative aspect-[16/9]">             {/* reserve space → no CLS */}
  <img src="/hero-poster.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
  <Suspense fallback={null}>
    <HeroScene />                                      {/* overlays/replaces the poster when ready */}
  </Suspense>
</div>
```

- **Next.js:** `dynamic(() => import("./HeroScene"), { ssr: false })` — WebGL can't render on the server.
- **Defer until in view / past LCP:** mount the scene on `IntersectionObserver` (when the hero nears the viewport) or after `requestIdleCallback` / first interaction, not on initial hydration.
- The **poster is also the no-WebGL and reduced-motion fallback** — one asset, three jobs.

## 3. Draw calls — the master 3D metric

Each unique geometry+material = one draw call; hundreds tank frame rate. Reduce them:

- **Instancing:** identical objects → one call. `InstancedMesh` or drei `<Instances>/<Instance>` (see `immersive-3d.md` §6). The single highest-leverage 3D optimization — a field of 1,000 instanced rocks is one draw call.
- **Merge** static geometry that shares a material (`BufferGeometryUtils.mergeGeometries`, or drei `<Merged>`).
- **Share materials/textures** across meshes; reuse one `meshStandardMaterial` instance rather than N identical ones.
- **Atlas textures** so multiple meshes sample one map.

## 4. LOD, culling, adaptive frameloop

- **LOD:** swap detail by camera distance with drei `<Detail>` (inside `<Lod>`)/`THREE.LOD` — high-poly up close, low-poly far. Essential for large scenes.
- **Frustum culling** is on by default; don't disable it. Keep bounding volumes correct so off-screen objects aren't drawn.
- **`frameloop="demand"`** for non-continuous scenes — render only on `invalidate()`. A static product viewer should not run 60fps forever.
- **Clamp DPR:** `dpr={[1, 2]}` — retina at raw `devicePixelRatio` (often 3) renders ~9× the pixels of DPR 1. Cap at 2, lower on weak GPUs.
- **Adaptive quality:** drei `<PerformanceMonitor>` to drop DPR/effects when fps falls; `<AdaptiveDpr pixelated />` and `<AdaptiveEvents>` to degrade gracefully under load.

## 5. Asset compression (disk *and* VRAM)

- **Textures → KTX2 / Basis** (GPU-native compressed): smaller download and smaller in video memory (unlike PNG/JPG which decompress to raw RGBA in VRAM). Load via `KTX2Loader` (drei `useKTX2`). Size textures to need — 2K rarely beats a well-authored 1K; power-of-two where mipmaps matter.
- **Geometry → Draco or meshopt** compression on glTF. `DRACOLoader` / `MeshoptDecoder`. `npx gltf-transform` or `gltfpack` to compress; `npx gltfjsx` to generate the component.
- **Audit the asset before shipping it:** a 40MB hero model is a Usability failure no shader can offset. Budget the whole 3D payload like an image budget.

## 6. Lights, shadows, postprocessing cost

- Real-time shadows are expensive; prefer **baked** lighting/AO, `<ContactShadows>`/`<AccumulativeShadows>` (baked once), or a baked shadow texture. Limit shadow-casting lights to 1.
- Image-based lighting (`<Environment>`) is cheaper and better-looking than many dynamic lights — lean on it.
- Postprocessing is fill-rate-bound (scales with pixels): every pass re-renders the frame. Budget passes, use `mipmapBlur` bloom, and **disable postprocessing on mobile/low-end**.

## 7. Mobile & capability strategy

- **Decide tier at runtime:** check viewport, `navigator.hardwareConcurrency`, `navigator.deviceMemory`, and a WebGL capability probe. Low-end or small screen → drop a tier or serve the poster.
- **On mobile:** scale the scene down (fewer instances, no postprocessing, lower DPR), animation duration ×0.8, stagger budgets −30%, touch feedback <100ms, and **no parallax**. Often the right mobile answer is the flat fallback — that's a feature, not a compromise.

## 8. Motion/GPU budgets (verified gates)

- Animate **only `transform` and `opacity`** — GPU, effectively unlimited. `color`/`clip-path` ≤10–15 elements. **<20 animated elements per viewport.**
- **60fps = 16.67ms/frame; keep animation logic <10ms/frame.** Never animate layout properties.
- Continuous values (scroll, pointer) via `useMotionValue`/`useFrame`, never `useState`. Motion's `x`/`y`/`scale` shorthands aren't GPU-accelerated under load — use the full `transform` string.

## 9. Measure, don't guess

- **drei `<Perf />`** (`r3f-perf`) in dev: draw calls, triangles, fps, VRAM, GPU time — the fastest 3D feedback loop.
- **`renderer.info`** (`gl.info.render.calls`, `.triangles`) for raw draw-call counts.
- **Chrome DevTools** Performance panel (long tasks, frame drops) + **Lighthouse** / **PageSpeed** for Core Web Vitals; the **Web Vitals** extension for field INP/LCP/CLS.
- Profile on a **real mid-range phone**, not just the dev machine. The desktop frame rate is a lie about the median visitor.

---

## Definition of "performant enough"

Tier ≥1 ships only when: LCP element is HTML/poster (canvas lazy + code-split); reserved canvas box (no CLS); draw calls bounded by instancing/merging; DPR clamped; `prefers-reduced-motion` pauses the loop to the poster; mobile is scaled or flat; assets are KTX2/Draco-compressed and budgeted; postprocessing scales down on weak devices; and you've measured fps + Core Web Vitals on real hardware. If any is missing, drop a tier — a flawless flat site outscores a heavy 3D one on 70% of the rubric.
