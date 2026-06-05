# Immersive 3D — React Three Fiber, shaders, scroll-driven scenes, postprocessing

The layer the other design skills never had. Everything here is **Tier ≥ 1** (see SKILL.md). Before writing a scene, re-read the one rule: 3D is the **20% Creativity** slice and is *penalized* under Usability when it costs load or navigation. So every pattern below ships with the fallback obligation in `performance.md`. A crisp static hero beats a janky WebGL one.

---

## 1. The R3F mental model + Canvas

React Three Fiber renders a Three.js scene as JSX. Every three.js class is a lowercase JSX element (`<mesh>`, `<meshStandardMaterial>`); constructor args go in `args={[...]}`; properties are props. `useFrame((state, delta) => …)` is the render-loop hook; `useThree()` reads camera/gl/size.

```jsx
"use client";
import { Canvas } from "@react-three/fiber";

<Canvas
  camera={{ position: [0, 0, 5], fov: 45 }}
  dpr={[1, 2]}                 // clamp pixel ratio — never raw devicePixelRatio (retina = 4× the pixels)
  gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
  frameloop="demand"           // render only on change/invalidate for static scenes — huge battery/CPU win
>
  <Scene />
</Canvas>
```

- **`frameloop="demand"`** for scenes that aren't continuously animating — call `invalidate()` to render a frame. Use `"always"` only when something moves every frame.
- The Canvas is **always** a lazy-mounted, code-split leaf (`reference/performance.md`). It never blocks LCP.

## 2. Scene essentials — light it like a studio, not a tech demo

Cheap 3D reads as cheap mostly because of lighting and materials. Use PBR materials + image-based lighting.

```jsx
import { Environment, Lightformer, ContactShadows, Float } from "@react-three/drei";

<>
  {/* Image-based lighting does 80% of the work — an HDRI or a custom studio rig */}
  <Environment preset="studio" />           {/* or: <Environment files="/hdr/studio.hdr" /> */}
  {/* Key + fill + rim instead of one flat ambient */}
  <directionalLight position={[4, 6, 3]} intensity={2.2} castShadow />
  <ambientLight intensity={0.3} />

  <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
    <mesh castShadow>
      <icosahedronGeometry args={[1, 4]} />
      <meshStandardMaterial color="#c9d1d9" metalness={0.9} roughness={0.15} envMapIntensity={1.2} />
    </mesh>
  </Float>
  <ContactShadows position={[0, -1.4, 0]} opacity={0.5} blur={2.5} />
</>
```

- Custom studio: place `<Lightformer>` planes inside `<Environment>` for art-directed reflections (the "cinematic studio" look).
- Material intent: `metalness`/`roughness` tell the story (chrome = high metal, low rough; matte = low metal, high rough). `envMapIntensity` controls how much the environment shows.
- `<meshTransmissionMaterial>` (drei) for glass; `<MeshDistortMaterial>`/`<MeshWobbleMaterial>` for organic blobs without writing a shader.

### drei essentials worth knowing
`Environment`, `Lightformer`, `ContactShadows`, `AccumulativeShadows` (lighting) · `Float`, `PresentationControls`, `OrbitControls` (motion/control) · `Instances`/`Instance`, `Merged`, `Detail` (perf) · `useGLTF`, `useTexture`, `useKTX2` (assets) · `Text`, `Text3D`, `Html` (typography in 3D) · `ScrollControls`, `useScroll` (scroll) · `shaderMaterial` (custom GLSL) · `MeshDistortMaterial`, `MeshTransmissionMaterial`, `Sparkles`, `Cloud`, `Stars` (effects).

## 3. Custom GLSL shaders

drei's `shaderMaterial(uniforms, vertexShader, fragmentShader)` builds a `THREE.ShaderMaterial` whose uniforms become auto getter/setters and constructor args. Register with `extend()`, then use it as a lowercase JSX element with uniforms as props.

```jsx
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const GradientMaterial = shaderMaterial(
  { uTime: 0, uColorA: new THREE.Color("#1a0b2e"), uColorB: new THREE.Color("#0ea5e9") },
  /* glsl vertex */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  /* glsl fragment */ `
    uniform float uTime; uniform vec3 uColorA; uniform vec3 uColorB; varying vec2 vUv;
    void main() {
      float w = 0.5 + 0.5 * sin(vUv.x * 3.0 + uTime);
      gl_FragColor = vec4(mix(uColorA, uColorB, w * vUv.y), 1.0);
    }`
);
extend({ GradientMaterial });

function Backdrop() {
  const ref = useRef();
  useFrame((_, dt) => { ref.current.uTime += dt; });      // imperative uniform write — no re-render
  return (
    <mesh scale={[10, 6, 1]} position={[0, 0, -2]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <gradientMaterial ref={ref} uColorA="#1a0b2e" uColorB="#0ea5e9" />
    </mesh>
  );
}
```

- Drive `uTime` in `useFrame` by mutating the ref — never via React state.
- Newer drei also accepts pierce-notation props (`uniforms-uColorA-value`) and an optional 4th `onInit` callback.
- **Effects to reach for in fragment shaders:** fresnel rim (`pow(1.0 - dot(normal, viewDir), p)`) for glowing edges; simplex/curl noise for flowing gradients and displacement; UV distortion for liquid/heat. For shader-heavy *backgrounds* without a full R3F tree, `ogl` is the lightweight path (React Bits' Aurora uses it).

## 4. Scroll-driven 3D — pick the path by tier

### Path A — in-canvas scroll (Tier 1, self-contained)
drei `ScrollControls` gives a normalized `scroll.offset` (0→1). Read it in `useFrame`:

```jsx
import { ScrollControls, useScroll, Scroll } from "@react-three/drei";
<ScrollControls pages={3} damping={0.2}>
  <Model />                                    {/* reads useScroll() in useFrame */}
  <Scroll html> {/* HTML that scrolls with the 3D */} </Scroll>
</ScrollControls>
// inside Model: const s = useScroll(); useFrame(() => { mesh.current.rotation.y = s.offset * Math.PI * 2; });
```

### Path B — shared canvas tracking DOM (Tier 2, the production pattern)
The browser limits active WebGL contexts, so **never mount many `<Canvas>`es**. Use **r3f-scroll-rig**: one persistent `<GlobalCanvas>` that survives navigations and draws Three.js meshes in the place of "proxy" DOM elements at matching scale/position. Normal HTML owns layout; WebGL is tunneled in where you mark it.

```jsx
import { GlobalCanvas, SmoothScrollbar, UseCanvas, ScrollScene } from "@14islands/r3f-scroll-rig";

// once, app root:
<><GlobalCanvas /><SmoothScrollbar /> {children} </>

// per section — track a DOM element, render 3D in its box:
function WebGLImage({ src }) {
  const el = useRef();
  return (
    <>
      <img ref={el} src={src} alt="" style={{ opacity: 0 }} />          {/* proxy = layout + fallback */}
      <UseCanvas>
        <ScrollScene track={el}>
          {(props) => <ImagePlane texture={src} {...props} />}          {/* drawn at the img's scale/position */}
        </ScrollScene>
      </UseCanvas>
    </>
  );
}
```

The proxy `<img>` *is* the reduced-motion / no-WebGL fallback — make it visible when WebGL is off.

### Path C — cinematic camera on a timeline (Tier 3)
**Theatre.js** is a keyframe motion editor for the web. `@theatre/core` (runtime, ships to prod), `@theatre/studio` (dev-only visual editor), `@theatre/r3f`. Map normalized scroll to the sequence playhead each frame:

```jsx
import { val } from "@theatre/core";
useFrame(() => {
  const len = val(sheet.sequence.pointer.length);
  sheet.sequence.position = scroll.offset * len;     // scroll.offset from drei useScroll, 0→1
});
```

Objects you want to animate must be **explicitly wrapped** with `editable.*` (e.g. `<editable.perspectiveCamera theatreKey="camera" />`) — `SheetProvider` does **not** auto-discover them. Author keyframes in Studio, ship `@theatre/core` only.

### Path D — GSAP ScrollTrigger driving the scene
When the page already runs GSAP+Lenis (`motion.md`), drive scene values from a ScrollTrigger and let `useFrame` read them — keep GSAP and R3F's loops decoupled by animating a plain proxy object, not React state:

```jsx
const proxy = useRef({ progress: 0 }).current;
useEffect(() => {
  const st = ScrollTrigger.create({ trigger: "#scene", start: "top top", end: "+=2000",
    scrub: 1, onUpdate: (self) => { proxy.progress = self.progress; } });
  return () => st.kill();
}, []);
useFrame(() => { group.current.rotation.y = proxy.progress * Math.PI; });
```

---

## 5. Postprocessing — `@react-three/postprocessing`

Effects make 3D feel filmic, but they cost fill-rate — budget them (`performance.md`) and disable on low-end/mobile.

```jsx
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Vignette, Noise } from "@react-three/postprocessing";
<EffectComposer disableNormalPass>
  <Bloom mipmapBlur luminanceThreshold={1} intensity={0.8} />
  <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} />
  <ChromaticAberration offset={[0.0005, 0.0005]} />
  <Vignette eskil={false} offset={0.1} darkness={0.7} />
</EffectComposer>
```

**Selective bloom (the key technique — control it on the *material*, not the pass):** lift the material's color **out of the 0–1 range** *and* set **`toneMapped={false}`**. R3F defaults to ACES tone mapping, which otherwise clamps emissive back into 0–1 and kills the glow. The `Bloom` `luminanceThreshold` then decides what blooms.

```jsx
{/* glows — equivalent to RGB [2,0,0] */}
<meshStandardMaterial emissive="red" emissiveIntensity={2} toneMapped={false} />
```
Set `luminanceThreshold={1}` so only >1 colors bloom; everything tone-mapped (≤1) stays crisp.

---

## 6. Particles, instancing, distortion

- **Many identical objects → one draw call** with `InstancedMesh` / drei `<Instances>`/`<Instance>`. Mandatory for fields of geometry (see `performance.md`).
  ```jsx
  <Instances limit={1000}><sphereGeometry args={[0.05]} /><meshStandardMaterial />
    {data.map((d,i)=><Instance key={i} position={d.pos} />)}
  </Instances>
  ```
- **Points/particles:** `<points>` with a `<bufferGeometry>` position attribute + a `<pointsMaterial>` or a custom shader; animate in `useFrame` by mutating the position buffer (`geometry.attributes.position.needsUpdate = true`). drei `<Sparkles>` for an instant tasteful field.
- **Distortion/displacement:** displace vertices in a vertex shader by a noise field sampled from `uTime` + position (liquid, terrain, audio-reactive), or use drei `<MeshDistortMaterial distort={0.4} speed={2}>` for an organic blob with zero GLSL.

## 7. Model pipeline (brief — budgets in `performance.md`)

`useGLTF('/model.glb')` loads glTF. Always optimize the asset: **Draco** or **meshopt** for geometry, **KTX2/Basis** for GPU-native compressed textures (smaller on disk *and* in VRAM). `npx gltfjsx model.glb` generates a typed component. Preload with `useGLTF.preload(url)`; wrap loaders in `<Suspense fallback={<Poster/>}>`.

## 8. WebGPU / TSL (progressive enhancement, not default)

Three.js ships a WebGPU renderer and **TSL** (Three Shading Language — write shader logic in JS, compiled to WGSL/GLSL). It's maturing and not universally supported; treat it as opt-in for cutting-edge work with a WebGL fallback. Default to WebGL (`@react-three/fiber`'s standard Canvas) for production reach today; reach for WebGPU when a project specifically needs compute shaders or very high particle counts and can tolerate the support matrix.

---

## The fallback obligation (repeat, because it's the difference between award and reject)

For **every** scene: a static poster (rendered server-side or a pre-captured image) shows before/instead of WebGL; `prefers-reduced-motion` pauses the frameloop and shows that poster; mobile gets a scaled scene or the poster; the canvas is code-split and mounted after first paint; postprocessing and particle counts scale down on weak GPUs. Wire these as you build, not after. → `reference/performance.md`.
