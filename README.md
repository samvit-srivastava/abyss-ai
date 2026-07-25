# 🌊 POSEIDON AI — Deep Ocean Expedition & AI Intel Platform

**POSEIDON AI** is an interactive, web-based deep-sea exploration platform powered by **Google Gemini AI**. Users descend through the five oceanic zones—from the surface Sunlight Zone down to Challenger Deep at **10,928 meters**—encountering 50+ marine species, historic shipwrecks, hydrothermal vents, and real-time AI telemetry.

---

## ✨ Features

### 1. 🦑 50 Marine Species & Historic Milestones
* **5 Ocean Zones**: Sunlight (0–200m), Twilight (200–1,000m), Midnight (1,000–4,000m), Abyssal (4,000–6,000m), Hadal (6,000–10,928m).
* **52 Real Specimen Images**: High-resolution imagery for species including *Ocellaris Clownfish*, *Giant Manta Ray*, *Sloane's Viperfish*, *Vampire Squid*, *Pelican Gulper Eel*, *RMS Titanic Wreck*, *Hydrothermal Black Smokers*, and *Mariana Snailfish*.
* **Bioluminescent Glass Capsules**: Specimens are framed in glowing glass orbs with radial vignetting that dissolves photo edges into the surrounding dark ocean water.

### 2. 🚀 Submarine Dive Launch Animation
* **Tactical Launch Overlay**: Pressing **BEGIN DESCENT** triggers a radial hydro-shockwave ring, 360-degree rotating sonar compass reticle, real-time Web Audio sonar ping, and upward bubble rush particles.

### 3. 🤖 POSEIDON Gemini AI Specimen Intel
* **Interactive AI Chat**: Click on any marine creature or landmark to open its Discovery Panel.
* **Crisp AI Responses**: Powered by `gemini-flash-lite-latest` (with automatic fallback candidates), returning concise 2–3 sentence scientific telemetry reports.

### 4. 🎛️ Interactive Depth Scrubbing HUD
* **Scrubbable Depth Slider**: Drag or click the right-hand vertical HUD track to instantly jump across depths (`0m`, `200m`, `1k`, `4k`, `6k`, `11k`).
* **Telemetry Gauge**: Real-time atmospheric pressure (ATM), water temperature (°C), and depth readout.

### 5. 🎯 Zero-Collision 5-Quadrant Layout
* **Generous Spatial Separation**: Species are mapped to 5 distinct screen quadrants (Top-Left, Bottom-Right, Top-Center, Bottom-Left, Top-Right) with custom vertical offsets to guarantee zero circle or text collisions.

### 6. 🎧 Synthesized Web Audio Hydrophone
* **Real-time Underwater Ambience**: Web Audio API lowpass-filtered sub-bass rumble (45Hz) and resonance drone (68Hz) that muffles dynamically as depth increases.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS, Tailwind CSS, Framer Motion |
| **AI Intelligence** | Google Gemini API (`gemini-flash-lite-latest`) |
| **Audio Engine** | Web Audio API (Synthesized Hydrophone & Sonar Pings) |
| **Performance** | Direct-DOM 120FPS Mouse Tracking (`requestAnimationFrame`) |

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js 18.x or higher
* npm or yarn

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/samvit-srivastava/abyss-ai.git
cd abyss-ai
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Directory Structure

```
abyss-ai/
├── public/
│   └── images/              # 52 specimen JPG images
├── src/
│   ├── app/
│   │   ├── api/chat/        # Gemini AI API route handler
│   │   ├── globals.css      # Custom ocean gradients & animations
│   │   ├── layout.tsx       # Root layout & meta tags
│   │   └── page.tsx         # Main entry page
│   ├── components/
│   │   ├── DepthHUD.tsx     # Scrubbable vertical depth track & telemetry
│   │   ├── DiscoveryPanel.tsx# Specimen hero header & POSEIDON AI chat
│   │   ├── DiveLaunchOverlay.tsx # Tactical submarine dive launch animation
│   │   ├── Landing.tsx      # Main ocean scroll canvas & creature mapping
│   │   ├── SonarCanvas.tsx  # HTML5 Canvas particle sonar grid
│   │   └── ZoneTransitionOverlay.tsx # Zone boundary alerts
│   ├── data/
│   │   ├── discoveries.ts   # Detailed specimen intel & scientific data
│   │   └── oceanCreatures.ts# 50 creature coordinates & depth mappings
│   └── lib/
│       ├── gemini.ts        # Gemini AI client & model fallbacks
│       ├── oceanAudio.ts    # Web Audio API hydrophone & sonar synthesizer
│       ├── oceanUtils.ts    # Temperature & pressure mathematical formulas
│       └── promptBuilder.ts # POSEIDON AI system prompt builder
├── README.md                # Project documentation
└── ARCHITECTURE.md          # Technical architecture overview
```

---

## 📄 License

This project is open-source under the MIT License.
