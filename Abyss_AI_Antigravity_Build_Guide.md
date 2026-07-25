# Abyss AI -- Hackathon Build Guide (Antigravity)

## Project

**Name:** Abyss AI

**Theme:** Beneath the Water

**Tagline:** Explore the Unknown. Talk to the Ocean.

------------------------------------------------------------------------

# Vision

A cinematic infinite-scroll ocean exploration experience inspired by
Neal.fun, enhanced with Gemini AI.

Users descend through ocean layers, discover underwater objects, and ask
Gemini anything about what they find.

The AI is the expedition guide, not just a chatbot.

------------------------------------------------------------------------

# Core User Flow

``` text
Landing Page
    ↓
Start Expedition
    ↓
Infinite Dive
    ↓
Discover Objects
    ↓
Talk with Gemini
```

This is the MVP. Do not add authentication, databases, XP, leaderboards,
or extra features unless time remains.

------------------------------------------------------------------------

# Tech Stack

-   Next.js
-   Tailwind CSS
-   Framer Motion (or GSAP)
-   Gemini 2.5 Flash
-   Static JSON for ocean data

------------------------------------------------------------------------

# Team

## Samvit

Owns: - Gemini Integration - Prompt Engineering - Ocean Data - AI Chat -
Integration - Final Demo

Deliverables:

### Gemini Wrapper

Create a reusable Gemini client.

### Ocean Data

Example:

``` json
{
  "depth": 1000,
  "zone": "Midnight Zone",
  "objects":[
    {
      "name":"Giant Squid",
      "description":"...",
      "image":"..."
    }
  ]
}
```

### AI Prompt

System Prompt:

"You are an expert marine biologist and deep ocean explorer.

Current Depth: {depth}

Current Zone: {zone}

Selected Object: {object}

Answer scientifically, clearly and conversationally. Always use the
current object and depth as context."

### Chat

Every object opens an AI conversation.

Questions like:

-   Why does it glow?
-   Could humans survive here?
-   Why is there no sunlight?
-   What would happen if it reached the surface?

------------------------------------------------------------------------

## Krishna

Owns:

Everything visual.

Deliverables

### Landing Page

Create an immersive hero.

Heading:

95% of the ocean remains unexplored.

CTA:

Start Expedition

Visuals:

-   Waves
-   Bubbles
-   Ocean gradient
-   Cinematic typography

------------------------------------------------------------------------

### Infinite Dive

Create full-screen sections.

Suggested order:

Surface

↓

Sunlight Zone

↓

Twilight Zone

↓

Midnight Zone

↓

Abyssal Zone

↓

Hadal Zone

Each section should become darker.

------------------------------------------------------------------------

### Discover Objects

Each section contains clickable objects.

Examples:

-   Coral
-   Jellyfish
-   Anglerfish
-   Giant Squid
-   Titanic
-   Hydrothermal Vent
-   Whale Fall

------------------------------------------------------------------------

### Object Modal

Contains:

-   Image
-   Name
-   Small description
-   "Ask Gemini" button

------------------------------------------------------------------------

### UI Polish

-   Smooth scrolling
-   Floating particles
-   Fade transitions
-   Sticky depth indicator
-   Responsive layout

------------------------------------------------------------------------

# Integration

When an object is clicked:

Frontend sends

    depth
    zone
    object
    question

Gemini returns

    answer

Display response in a clean side panel or modal.

------------------------------------------------------------------------

# Folder Structure

    src/
      app/
      components/
        Landing.tsx
        OceanSection.tsx
        ObjectCard.tsx
        ChatPanel.tsx
        DepthIndicator.tsx

      data/
        ocean.json

      lib/
        gemini.ts

------------------------------------------------------------------------

# Timeline

## Hour 1

Samvit - Gemini setup - Ocean JSON

Krishna - Landing Page - Scroll Layout

------------------------------------------------------------------------

## Hour 2

Samvit - Chat - Prompt

Krishna - Ocean Sections - Object Cards

------------------------------------------------------------------------

## Hour 3

Samvit - Context-aware AI - Error handling

Krishna - Animations - Modal

------------------------------------------------------------------------

## Hour 4

Together

-   Integration
-   Testing
-   Deployment
-   Demo practice

------------------------------------------------------------------------

# Definition of Done

The project is complete if:

-   Landing page looks polished.
-   Infinite scrolling works.
-   Ocean objects are clickable.
-   Gemini answers using object + depth context.
-   UI feels cinematic.
-   Entire flow works without bugs.

Ignore every non-essential feature until this is complete.

------------------------------------------------------------------------

# Build Philosophy

Quality over quantity.

One unforgettable experience beats twenty unfinished features.

The goal is that judges say:

"I've never experienced ocean exploration like this before."
