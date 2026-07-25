# ⚙️ POSEIDON AI — Technical Architecture Documentation

This document outlines the architectural design principles, performance optimizations, and subsystem implementations powering **POSEIDON AI**.

---

## 1. 🎯 Zero-Lag 120FPS Direct-DOM Cursor Spotlight Architecture

### Problem
In React applications, binding mouse movement listeners (`onMouseMove`) to React `useState` triggers component tree re-renders on every mouse movement frame, resulting in high CPU usage and noticeable cursor lag.

### Solution
Abyss AI bypasses React state updates during mouse movement by mutating the DOM directly via React `useRef` handles coupled with browser `window.requestAnimationFrame`:

```typescript
useEffect(() => {
  let rafId: number | null = null;
  let mouseX = -100;
  let mouseY = -100;

  const updateCursorDOM = () => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      cursorRef.current.style.opacity = "1";
    }
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(circle 380px at ${mouseX}px ${mouseY}px, rgba(0, 240, 255, 0.14) 0%, rgba(0, 240, 255, 0.04) 50%, transparent 100%)`;
    }
    rafId = null;
  };

  const onMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) {
      rafId = window.requestAnimationFrame(updateCursorDOM);
    }
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  return () => window.removeEventListener("mousemove", onMove);
}, []);
```

---

## 2. 🗺️ 5-Quadrant Zero-Collision Spatial Distribution

To prevent marine creatures and landmark labels from overlapping across the viewport during descent, creatures are mapped using a 5-point alternating quadrant cycle:

```typescript
const QUADRANTS = [
  { left: 15, vOffset: -22 }, // 0. Top-Left
  { left: 82, vOffset: 22 },  // 1. Bottom-Right
  { left: 48, vOffset: -22 }, // 2. Top-Center
  { left: 20, vOffset: 22 },  // 3. Bottom-Left
  { left: 78, vOffset: -22 }, // 4. Top-Right
];
```

### Depth Visibility Math
Each creature's opacity, scale, and vertical position inside the viewport are computed continuously:

$$\text{factor} = \sin\left(\frac{(1 - \frac{|d - \text{mid}|}{\text{radius}}) \cdot \pi}{2}\right)$$

$$\text{viewportTopVh} = (50 + vOffsetVh) - \text{driftRatio} \cdot 10$$

---

## 3. 🤖 Resilient Gemini AI Integration & Fallback Strategy

The AI chat route uses `GoogleGenerativeAI` with a prioritized list of active models:

1. `gemini-flash-lite-latest` (Primary model)
2. `gemini-flash-latest` (Secondary model)
3. `gemini-2.0-flash-lite` (Tertiary model)

### Short & Crisp Prompt Engineering
System prompts in `src/lib/promptBuilder.ts` strictly enforce concise scientific telemetry answers:

```typescript
export function buildPoseidonSystemPrompt(specimenName: string, depth: number): string {
  return `You are POSEIDON, an advanced deep-sea AI oceanographic intelligence system aboard an abyssal research submersible.
The user is inspecting specimen: ${specimenName} at depth ${depth}m.
STRICT RESPONSE RULES:
- Keep your answer under 60 words (maximum 2 to 3 concise sentences).
- Adopt a sleek, scientific, tactical oceanographic tone.
- Do not use markdown bullet points or lengthy preamble.`;
}
```

---

## 4. 🎧 Web Audio API Hydrophone & Sonar Synthesizer

Abyss AI synthesizes ambient underwater sounds client-side without external audio MP3 dependencies:

* **Sub-Bass Oscillator**: 45Hz sine wave for deep ocean pressure.
* **Resonance Oscillator**: 68Hz triangle wave for metallic submersible resonance.
* **Biquad Lowpass Filter**: Dynamic cutoff frequency calculated based on current depth:

$$\text{cutoff} = \max\left(60, 180 - \frac{\text{depth}}{11000} \cdot 120\right) \text{ Hz}$$

* **Synthesized Sonar Ping**: 880Hz → 440Hz exponential frequency sweep with a 0.6s exponential gain decay.
