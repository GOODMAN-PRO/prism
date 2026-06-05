# Asset & component resources — license-aware sourcing for prism builds

Where to pull high-quality, **commercially-licensable** assets, components, and tooling when building sites — especially **paid client work**. Every entry carries a license + commercial flag. Researched 2025–2026. **Re-verify the license at the source URL for any ❌/🟡 asset before each client delivery, and for any AI-generation tool (terms change often)** — the stable ✅ CC0/MIT/Apache rows don't need re-checking.

## The one rule (paid/client work)

You're shipping these to a paying client. Only use what's cleared for **commercial use** — read the **Comm.** column:

- ✅ **Yes** — safe, no attribution (CC0 / MIT / Apache / ISC / Unlicense). **Default to these.**
- 🟡 **Credit** — commercial OK but you **must** attribute (CC-BY, many OFL fonts, some illustration). Keep a `CREDITS.md`.
- 🟡 **Check** — mixed/per-asset or unclear; verify the *specific* asset before shipping. **Source-available licenses (PolyForm, Commons Clause) are 🟡** — fine *inside* a delivered site, but they forbid building a **competing product**.
- ❌ **No/paid** — personal-only, non-commercial, or free-to-try. Do **not** ship without buying the license.

**Second rule:** even when commercial use is allowed, almost every "free" license forbids **redistributing/reselling the raw asset itself**. Using it *inside* the delivered site = fine. Shipping it as a standalone file, or bundling it into a template/theme you sell = usually **not**.

---

## Default safe stack (grab-first — all ✅ CC0/MIT/Apache, zero attribution)

| Need | Go-to (all ✅) |
|---|---|
| 3D models | **Poly Haven** · **Quaternius** · **Kenney** · **Poly Pizza** (filter CC0) |
| HDRI lighting | **Poly Haven → Studio** · **Open HDRI → Softbox** · **ambientCG** |
| PBR textures | **Poly Haven** · **ambientCG** · **cgbookcase** |
| React components | **shadcn/ui** · **Magic UI** · **Cult UI** · **Origin UI** · **Motion Primitives** · **Kibo UI** |
| Motion | **GSAP** (now 100% free) · **Motion** · **Lenis** |
| Icons | **Lucide** · **Phosphor** · **Tabler** · **Heroicons** · **Iconoir** |
| Fonts | **Fontshare** (Clash Display, General Sans, Switzer) · **UNCUT.wtf** · **Velvetyne** — pick a **distinctive display + clean workhorse** pairing. Inter/Geist only as a deliberate workhorse **under** a display face, never the whole identity (see `craft.md` font-only test). |
| Stock & illustration | **Unsplash** · **Pexels** · **unDraw** · **Open Peeps** · **Humaaans** |
| 3D web pipeline | **Blender** · **glTF-Transform** · **gltfpack** |
| WebGL / shaders | **three.js** · **R3F + drei** · **OGL** · **Paper Shaders** |

---

## ⚠️ Traps — these LOOK free but are NOT safe for paid work

- **Pangram Pangram fonts** (Editorial New, PP Neue Montreal, Right Grotesk) — the free download is **personal-use-only**. Buy a license (~$40+/font) before shipping. Ubiquitous on Dribbble → very common mistake.
- **Shadertoy** shaders — **CC BY-NC-SA by default** (non-commercial). Only reuse if the shader's header comment grants commercial rights (MIT/CC0), else ask the author.
- **LYGIA** shader library — non-commercial by default; needs a sponsor/commercial license to ship.
- **Tripo AI free tier** — labeled CC-BY but its ToS **forbids commercial use** on free. Use a **paid** plan for any client mesh.
- **Hunyuan3D 2.0** = non-commercial. Use **2.1+** (commercial under <1M MAU) — and note it **excludes EU/UK/KR** and needs a "Powered by Tencent Hunyuan" credit.
- **Luma, Stable Fast 3D, Sloyd, Meshy** — commercial rights are **plan-gated**: generate on a **paid** plan (Meshy free = CC-BY/attribution; Luma/Sloyd/SF3D free = no commercial). Rights often vest only for assets made *while* on the paid plan.
- **Rive** — shipping a `.riv` to production needs a **paid** plan (unlike Lottie, which is free).
- **FreePBR.com** free tier = **non-commercial**; buy the one-time VIP license.
- **Font Awesome Free · Solar Icons · Hero Patterns · Storyset/Icons8 free · Coverr** — commercial OK **with attribution** (CC-BY / credit-link). Awkward for white-label client work → consider the paid tier to drop the credit.
- **Remix Icon** (relicensed Jan 2026) — fine inside products, but not as a resold icon pack / logo / brand identity.
- **Pixabay / DrawKit / ManyPixels / Lummi** — fine *in* a bespoke site; the license forbids bundling them into **templates/builders you resell**.

---

## 1 · 3D models (web-ready / convertible to glTF·GLB)

| Source | What | License | Comm. | Get it |
|---|---|---|---|---|
| [Poly Haven](https://polyhaven.com/models) | Photoreal PBR props/scans, gold-standard | CC0 | ✅ | Free DL, glTF/FBX. Mid-high poly → decimate |
| [Quaternius](https://quaternius.com/) | ~2,000 stylized **low-poly** packs, many animated | CC0 | ✅ | Free, glTF/FBX/OBJ — clean web meshes |
| [Kenney](https://kenney.nl/assets/category:3D) | Uniform low-poly kits, tiny files | CC0 | ✅ | Free, glTF/GLB — perfect modular web 3D |
| [KayKit](https://kaylousberg.itch.io/) | Stylized low-poly game kits w/ animation | CC0 | ✅ | itch.io name-your-price ($0) |
| [Poly Pizza](https://poly.pizza/) | Thousands of low-poly (ex-Google Poly) + API | CC0 **or** CC-BY per asset | ✅/🟡 | Filter CC0 for zero-attribution |
| [Sketchfab](https://sketchfab.com/3d-models?features=downloadable) | 800k+ downloadable, auto-glTF | Mixed per asset | 🟡 Check | **Set License filter to commercial-allowed; avoid any `-NC`** |
| [Khronos glTF Samples](https://github.com/KhronosGroup/glTF-Sample-Assets) | Born-glTF reference models (DamagedHelmet…) | CC0 / CC-BY per model | ✅/🟡 | GitHub raw — great hero placeholders |
| [Fab (free section)](https://www.fab.com/) | Epic marketplace free kits + Megascans starter | Fab Standard / CC per asset | 🟡 Check | Often UE/FBX → heavier; export glTF |
| [ambientCG](https://ambientcg.com/list?type=3DModel) | CC0 props/scans, pairs w/ its textures | CC0 | ✅ | Free, no login |
| [Smithsonian 3D](https://3d.si.edu/cc0) | 2,000+ museum scans — unique hero pieces | CC0 | ✅ | Heavy scans → retopo/decimate |
| [Poly Pizza / os3a](https://opensource3dassets.com/) | Curated CC0 **GLB** discovery for web/three.js | CC0 (verify at source) | ✅ | GLB, already web-targeted |

## 2 · HDRI lighting (IBL) — 1–2K is plenty for reflections

| Source | What | License | Comm. | Get it |
|---|---|---|---|---|
| [Poly Haven → Studio](https://polyhaven.com/hdris) | The staple; dedicated **Studio/softbox** set flatters chrome/metal | CC0 | ✅ | 1K–16K .hdr/.exr, no login |
| [Open HDRI → Softbox](https://openhdri.org/) | 2025 newcomer, **Softbox/Studio** categories, ultra-hi-res | CC0 | ✅ | `openhdri.org/t/softbox` |
| [ambientCG](https://ambientcg.com/list?type=HDRI) | CC0, studio + sky maps, bulk/API | CC0 | ✅ | Pairs w/ Poly Haven for full-CC0 pipeline |
| [Lightmap 25 Free Studio](https://www.lightmap.co.uk/hdrlightstudio/freestudiohdrimaps/) | Purpose-built **softbox/window/rim** studio maps | Lightmap free (commercial OK) | ✅ | Email signup; don't resell the maps |
| [Superhive 33 Studio HDRIs](https://superhivemarket.com/products/33-free-studio-hdri-maps) | Softbox/rim/white-cyc studio set | Free, personal+commercial | ✅ | $0 checkout |
| [CGEES](https://cgees.com/) | Fresh CC0 interior/exterior, 1K–24K | CC0 | ✅ | Good neutral product lighting |
| [sIBL Archive](http://www.hdrlabs.com/sibl/archive.html) | Classic staple | many **CC BY-NC-SA** | 🟡 Check | **Many are non-commercial — verify each** |

## 3 · PBR textures & materials (full map stacks)

| Source | What | License | Comm. | Get it |
|---|---|---|---|---|
| [Poly Haven](https://polyhaven.com/textures) | Photoscanned seamless, up to 8K, full maps | CC0 | ✅ | No login |
| [ambientCG](https://ambientcg.com/) | 2,800+ materials/decals, well-tagged, API | CC0 | ✅ | Bulk-download friendly |
| [cgbookcase](https://www.cgbookcase.com/textures) | Curated high-quality CC0 sets | CC0 | ✅ | No sign-up |
| [3DTextures.me](https://3dtextures.me/) | Big, frequent, stylized variety | CC0 | ✅ | 1K free; 4K/SBSAR via Patreon |
| [TextureCan](https://www.texturecan.com/) | 4K+ w/ SBSAR procedural source | CC0 | ✅ | No account |
| [LotPixel](https://www.lotpixel.com/) | 1,500+ scan-based up to 8K | Proprietary free (commercial cleared) | ✅ | Account required |
| [Material Maker](https://github.com/RodZill4/material-maker) | **Make your own** procedural materials (free Substance alt) | MIT (app) | ✅ | Output is yours |
| [FreePBR.com](https://freepbr.com/) | 600+ sets | **free = non-commercial** | ❌ | **Buy ~$16 VIP for commercial** |

## 4 · React / Tailwind component registries (shadcn ecosystem)

> Pull via shadcn CLI: `npx shadcn@latest add @<registry>/<name>` or a JSON URL `npx shadcn add https://host/r/item.json`. Each component page shows its exact command.

| Source | What | License | Comm. | Get it |
|---|---|---|---|---|
| [shadcn/ui](https://ui.shadcn.com) | The base system + CLI standard everything plugs into | MIT | ✅ | `npx shadcn@latest add button` |
| [21st.dev](https://21st.dev) | Largest community marketplace of shadcn components | core MIT; **components per-author** | 🟡 Check | Copy each page's `npx shadcn add` cmd |
| [21st.dev Magic MCP](https://21st.dev/magic) | AI "v0-in-editor" MCP; you own the output | output = yours | ✅ | MCP; free 100 credits/mo |
| [Aceternity UI](https://ui.aceternity.com) | Flashy Framer-Motion hero/effect blocks | free = MIT; Pro proprietary | ✅ | Copy-paste; Pro = sell client sites, not the components |
| [Magic UI](https://magicui.design) | 150+ free animated (marquee, particles, beams) | MIT | ✅ | shadcn CLI / copy |
| [React Bits](https://www.reactbits.dev) | Animated bits (GSAP/Three.js) | MIT + Commons Clause | 🟡 Check | Use in sites OK; **can't sell the bits themselves / no competing product** |
| [Cult UI](https://www.cult-ui.com) | Polished animated shadcn components | MIT | ✅ | shadcn CLI |
| [Origin UI](https://originui.com) | Big refined Radix/shadcn set | MIT | ✅ | Copy-paste |
| [Motion Primitives](https://motion-primitives.com) | Motion-based animated primitives | MIT | ✅ | shadcn CLI |
| [Kibo UI](https://www.kibo-ui.com) | Higher-order shadcn (AI chat, kanban, gantt) | MIT | ✅ | `@kibo-ui/<c>` |
| [Kokonut UI](https://www.kokonutui.com) | 100+ creative Tailwind/shadcn blocks | MIT | ✅ | `@kokonutui/<c>` |
| [Skiper UI](https://skiper-ui.com) | "Un-common" animated React/Motion blocks — card carousels, marquees, AI chat input, theme toggles | free 24+ = **credit required**; Pro $129 one-time = no credit, ~100 more | 🟡 Credit | `@skiper-ui/<c>` |
| [Tremor](https://tremor.so) | Best-in-class dashboard/data-viz | Apache-2.0 | ✅ | npm |
| [Hover.dev](https://www.hover.dev) | High-polish animated sections/templates | proprietary freemium | ✅ | Free subset; paid Pro; don't redistribute |
| [Animate UI](https://animate-ui.com) · [Eldora](https://www.eldoraui.site) · [Fancy](https://fancycomponents.dev) · [Animata](https://animata.design) | More MIT animated sets | MIT | ✅ | shadcn CLI / copy |
| [Awesome shadcn/ui](https://github.com/birobirobiro/awesome-shadcn-ui) · [registry.directory](https://registry.directory) | **The discovery hub** for every other registry | index | 🟡 | Find more, check each license |

## 5 · Motion & animation

> **GSAP is now 100% free** (all former Club plugins included) since Apr 2025.

| Source | What | License | Comm. | Get it |
|---|---|---|---|---|
| [GSAP](https://gsap.com/) | Industry-standard engine: ScrollTrigger, SplitText, MorphSVG, Flip… | free (Webflow) | ✅ | `npm i gsap` |
| [Motion](https://motion.dev/) | Declarative React/JS animation (ex-Framer Motion) | MIT | ✅ | `npm i motion` |
| [Lenis](https://lenis.darkroom.engineering/) | The smooth-scroll standard, pairs w/ ScrollTrigger | MIT | ✅ | `npm i lenis` |
| [Theatre.js](https://www.theatrejs.com/) | Visual timeline for Three.js/R3F cinematics | core Apache-2.0 (editor dev-only) | ✅ | `@theatre/core` |
| [Lottie / dotLottie](https://github.com/LottieFiles/dotlottie-web) | Play AE/JSON animations (player code) | MIT | ✅ | Files have own license ↓ |
| [LottieFiles](https://lottiefiles.com/) | Marketplace of animations | free = Lottie Simple (commercial, no credit); premium per-asset | 🟡 Check | Verify the badge |
| [Rive](https://rive.app/) | Interactive state-machine vector animation | runtimes open; **ship needs paid plan** | ❌→paid | Budget Cadet $9/mo+ for production |
| [Codrops](https://tympanus.net/codrops/) | Cutting-edge WebGL/GSAP demos + tutorials | demo code MIT | ✅/🟡 | **Swap out demo images/fonts/models** (own license) |
| [Easings.net](https://easings.net/) · [cubic-bezier.com](https://cubic-bezier.com/) · [linear() gen](https://linear-easing-generator.netlify.app/) | Easing curves / spring→CSS `linear()` | values are yours | ✅ | Copy the value |
| [css-loaders.com](https://css-loaders.com/) | 600+ pure-CSS single-element loaders | free copy-paste | ✅ | Zero deps |
| [Haikei](https://haikei.app/) · [fffuel](https://www.fffuel.co/) | SVG blob/wave/mesh/grain/noise generators | free personal+commercial | ✅ | Don't build a competing generator |
| [SVGator](https://www.svgator.com/) | No-code animated-SVG (self-draw, motion-path) | freemium | ✅→plan | Paid unlocks full export |

## 6 · Icons & fonts

| Source | What | License | Comm. | Get it |
|---|---|---|---|---|
| [Lucide](https://lucide.dev/license) | 1500+ clean stroke; the React default | ISC | ✅ | `lucide-react` |
| [Phosphor](https://phosphoricons.com/) | 9000+, 6 weights | MIT | ✅ | `@phosphor-icons/react` |
| [Tabler](https://tabler.io/icons) | 6100+ 24px, great for dashboards | MIT | ✅ | `@tabler/icons-react` |
| [Heroicons](https://heroicons.com/) | Tailwind team's UI set | MIT | ✅ | `@heroicons/react` |
| [Iconoir](https://iconoir.com/) | 1600+, **no pro paywall** | MIT | ✅ | `iconoir-react` |
| [Material Symbols](https://fonts.google.com/icons) | 3000+ variable-font icons | Apache-2.0 | ✅ | Google Fonts CDN |
| [Solar Icons](https://github.com/480-Design/Solar-Icon-Set) | 7400+, premium-app look | **CC-BY 4.0** | 🟡 Credit | Credit 480 Design |
| [Font Awesome Free](https://fontawesome.com/license/free) | Big brand-logo coverage | **CC-BY 4.0** (icons) | 🟡 Credit | Attribution embedded — keep it |
| [Remix Icon](https://remixicon.com/) | 2800+ neutral line/fill | custom v1.0 (Jan 2026) | 🟡 | Fine in products, not as resold pack/logo |
| [Google Fonts](https://fonts.google.com/) | 1800+ families, the workhorse | mostly OFL | ✅ | `@fontsource/*` or self-host |
| [Fontshare](https://www.fontshare.com/) | Premium display (Satoshi, Clash Display, General Sans…) | ITF free | ✅ | Self-host; award-style hero type |
| Geist · Inter · Cal Sans | Workhorse UI faces — use **under** a display face, never as the identity (see Default safe stack) | OFL | ✅ | `@fontsource` |
| Satoshi | Fontshare display/UI face | **ITF FFL** | ✅ | Free commercial; **don't redistribute the raw font / bundle into a resold template**. Fontshare self-host |
| [UNCUT.wtf](https://uncut.wtf/) · [Velvetyne](https://velvetyne.fr/) | Distinctive non-generic typefaces | OFL (some need credit) | ✅/🟡 | Self-host |
| **Pangram Pangram** | Editorial New, PP Neue Montreal… | **personal-only free** | ❌ | **BUY before shipping (~$40+)** |

## 7 · WebGL / three.js / shaders

| Source | What | License | Comm. | Get it |
|---|---|---|---|---|
| [three.js](https://github.com/mrdoob/three.js) | Core WebGL library | MIT | ✅ | `npm i three` |
| [R3F](https://github.com/pmndrs/react-three-fiber) + [drei](https://github.com/pmndrs/drei) | React renderer + huge helper kit (Environment, MeshTransmission…) | MIT | ✅ | `@react-three/fiber` `@react-three/drei` |
| [postprocessing](https://github.com/pmndrs/react-postprocessing) | Bloom / DOF / chromatic-aberration effect chains | MIT / Zlib | ✅ | `@react-three/postprocessing` |
| [OGL](https://github.com/oframe/ogl) | ~8kb bare-metal WebGL for bespoke shaders | Unlicense | ✅ | `npm i ogl` |
| [Paper Shaders](https://github.com/paper-design/shaders) | Drop-in animated mesh-gradient/grain/swirl React shaders | PolyForm Shield | 🟡 Check | `@paper-design/shaders-react` — fine inside a delivered site; **forbids building a competing product** (don't clone Paper) |
| [Shadertoy](https://www.shadertoy.com/) | Largest live-shader gallery (reference/learning) | **CC BY-NC-SA default** | ❌ default | **Reuse only if header grants it** |
| [LYGIA](https://github.com/patriciogonzalezvivo/lygia) | Multi-lang shader function library | non-commercial default | ❌→license | Needs sponsor/commercial license |
| [Spline](https://spline.design/) | Browser 3D authoring → React/web export | proprietary tiered | ✅→plan | Code export needs Pro; free export has watermark |
| [Better Gradient](https://better-gradient.com/) · [ColorFlow](https://colorflow.ls.graphics/) | Mesh-gradient makers (PNG/SVG/CSS) | free commercial, no credit | ✅ | Copy output |
| [Hero Patterns](https://heropatterns.com/) | Tileable SVG bg patterns | **CC-BY 4.0** | 🟡 Credit | Copy SVG/CSS |

## 8 · AI 3D generation (mind the commercial terms!)

> For a **selling** studio: generate client meshes on a **paid** plan so output is private + owned + credit-free. Free tiers are usually CC-BY (attribution) or non-commercial.

| Tool | Best free→commercial path | Notes |
|---|---|---|
| [Meshy](https://www.meshy.ai/) | free = CC-BY (credit); **paid = owned, no credit** | Market leader; use paid for client work |
| [Tripo](https://www.tripo3d.ai/) | **free = NO commercial** (ToS); paid = owned | Don't sell free output despite CC label |
| [Rodin / Hyper3D](https://hyper3d.ai/) | **commercial even on free** (standout) | ChatAvatar faces need Business tier |
| [Luma Genie](https://lumalabs.ai/) | **free = personal only**; Plus+ = commercial | Rights vest only while on paid plan |
| [Spline AI](https://spline.design/ai-generate) | you own output; AI gen needs Pro+add-on | Best when deliverable is an interactive 3D web scene |
| [Hunyuan3D **2.1**](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1) | **commercial <1M MAU** (self-host, free) | NOT 2.0 (non-commercial); excludes EU/UK/KR; needs credit |
| [TRELLIS / TRELLIS.2](https://github.com/microsoft/TRELLIS) | **MIT — cleanest open license** | Self-host; no revenue cap, no attribution |
| [Stable Fast 3D](https://huggingface.co/stabilityai/stable-fast-3d) | commercial **only if ≤ $1M revenue** | Self-host; buy enterprise above $1M |

## 9 · Stock media & illustration

| Source | What | License | Comm. | Get it |
|---|---|---|---|---|
| [Unsplash](https://unsplash.com/license) | High-end photos | Unsplash (CC0-like) | ✅ | Free API |
| [Pexels](https://www.pexels.com/license/) | Photos **and** video | Pexels (CC0-like) | ✅ | Free API |
| [Pixabay](https://pixabay.com/) | Photos/illustration/video/music | Pixabay License | ✅ | Don't ship inside resold templates |
| [Mixkit](https://mixkit.co/license/) | 4K stock video, music, AE templates | Mixkit free (some Restricted=NC) | 🟡 Check | Avoid "Restricted License" clips |
| [Coverr](https://coverr.co/license) | Designer hero-video loops | free **needs credit** (Coverr+ removes) | 🟡 Credit | Not for resold builders/templates |
| [unDraw](https://undraw.co/license) | Recolorable open SVG illustration | MIT-style | ✅ | Brand-color picker |
| [Open Peeps](https://www.openpeeps.com/) · [Humaaans](https://www.humaaans.com/) · [Open Doodles](https://www.opendoodles.com/) | Mix-and-match character art | CC0 | ✅ | Figma/SVG |
| [DrawKit](https://www.drawkit.com/) · [ManyPixels](https://www.manypixels.co/gallery) · [IRA Design](https://iradesign.io/) | Polished illustration packs | custom free / MIT | ✅ | Don't bundle into resold templates |
| [Storyset](https://storyset.com/) · [Icons8 Ouch](https://icons8.com/illustrations) | Animatable illustration systems | free = **credit**; paid = none | 🟡 Credit | Buy to drop the credit for client work |
| [Iconduck](https://iconduck.com/) | Aggregator (icons + illustration), per-asset labels | mixed | 🟡 Check | Read each badge |

### AI image generation (terms shift — re-check before each delivery)

| Tool | What | Comm. | Notes |
|---|---|---|---|
| [Adobe Firefly](https://www.adobe.com/products/firefly.html) | Trained on licensed/owned data; **IP-indemnified** | ✅ plan-gated | Commercially safe on paid plans — the low-risk default for client hero art |
| [Midjourney](https://www.midjourney.com/) | Highest-fidelity general gen | ✅ paid tiers | Commercial OK on paid tiers; **check member-gallery visibility** (default plans make prompts/images public) |
| [OpenAI gpt-image / DALL·E](https://openai.com/) | API + ChatGPT image gen | ✅ | You own the output; commercial use allowed |
| [Flux](https://blackforestlabs.ai/) / [SDXL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) | Open-weights, self-host/fine-tune | 🟡 Check | **Per-checkpoint** — some weights are non-commercial (e.g. Flux `[dev]`); verify the *specific* model before shipping |

> Even with commercial rights, treat AI images like any other asset: don't ship them as standalone files or bundle them into a resold template.

### Audio (music & SFX)

| Source | What | Comm. | Notes |
|---|---|---|---|
| [Pixabay Audio](https://pixabay.com/music/) | Music + SFX | ✅ | Pixabay License; don't ship inside resold templates |
| [Mixkit](https://mixkit.co/free-stock-music/) | Music + SFX | 🟡 Check | Mixkit free OK; **avoid "Restricted License"** tracks |
| [Uppbeat](https://uppbeat.io/) | Curated creator music | 🟡 Credit | Free tier **needs credit**; paid removes it |
| [Freesound](https://freesound.org/) | Huge SFX library | 🟡 Check | **Per-clip** CC0 / CC-BY / **CC-NC** — read each clip's badge |

> Most "free music" licenses cover use *in a finished site*, not resale — **never bundle audio into a template/theme you sell**.

## 10 · Blender → web 3D pipeline (free)

> GPL on Blender/addons covers the **tool**, not your models — your commercial output is unrestricted.

| Tool | What | License | Comm. | Headless? |
|---|---|---|---|---|
| [Blender](https://www.blender.org/) | Model/bake/UV + official glTF exporter (Draco built in) | GPL-3.0 | ✅ | `blender -b f.blend --python export.py` |
| [glTF-Transform](https://gltf-transform.dev/) | **The** web-3D optimizer: `optimize` = Draco/meshopt + KTX2 + dedup/prune | MIT | ✅ | CLI + SDK, CI-friendly |
| [gltfpack](https://meshoptimizer.org/gltf/) | Aggressive meshopt compression, quantize, instancing, simplify | MIT | ✅ | Single-binary CLI |
| [Draco](https://github.com/google/draco) | Geometry codec (~90% smaller) | Apache-2.0 | ✅ | Encoder/decoder CLI |
| [KTX-Software / toktx](https://github.com/KhronosGroup/KTX-Software) | KTX2/Basis GPU textures (less VRAM) | Apache-2.0 | ✅ | `toktx` / `ktx create` |
| [gltf.report](https://gltf.report/) | Audit a model's size/draw-calls/textures + run gltf-transform in-page | open core | ✅ | Web (local) |
| [glTF Validator](https://github.khronos.org/glTF-Validator/) | Spec-conformance gate before delivery | Apache-2.0 | ✅ | npm CLI |
| [CAD Assistant](https://www.opencascade.com/products/cad-assistant/) / [step2gltf](https://github.com/s1mb1o/step2gltf) | STEP/IGES → glTF (turn client CAD into web 3D) | freeware / OCCT-LGPL | ✅ | step2gltf = headless CLI |
| [MACHIN3tools](https://github.com/machin3io/MACHIN3tools) · [ND](https://github.com/hugemenace/nd) · [JMesh](https://github.com/JoseConseco/jmesh_tools) | Free hard-surface boolean/bevel workflow addons | GPL-3.0 | ✅ | In-Blender |
| [Sverchok](https://github.com/nortikin/sverchok) · [Sorcar](https://github.com/aachman98/Sorcar) | Houdini-style procedural/parametric node modeling | GPL-3.0 | ✅ | In-Blender (scriptable) |

---

## How prism uses this

When a build needs an asset (3D model, HDRI, texture, component, icon, font, illustration, stock):

1. **Default to the "safe stack"** above (CC0/MIT/Apache) — no attribution headaches.
2. If you reach past it, **read the Comm. column** and obey it. For *paid/client* work, never ship ❌ or unverified 🟡 assets. Honor 🟡 Credit with a `CREDITS.md` in the project.
3. **Optimize every 3D asset** through glTF-Transform/gltfpack before shipping (see `performance.md` + `verify.md`).
4. **Never redistribute the raw asset** as a standalone file or inside a resold template — embed it in the delivered experience.
5. When in doubt, pick the CC0 equivalent. There's almost always one here.
</content>
