"use client";

import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Compass, ChevronDown, Volume2, VolumeX, ArrowUp, Sparkles } from "lucide-react";
import SonarCanvas from "./SonarCanvas";
import DepthHUD from "./DepthHUD";
import ZoneTransitionOverlay from "./ZoneTransitionOverlay";
import DiscoveryPanel from "./DiscoveryPanel";
import DiveLaunchOverlay from "./DiveLaunchOverlay";
import { DISCOVERIES, Discovery } from "@/data/discoveries";
import { calculateDepthFromProgress, calculateTemperatureFromDepth } from "@/lib/oceanUtils";
import { oceanAudio } from "@/lib/oceanAudio";
import { OCEAN_CREATURES_50, OceanCreature } from "@/data/oceanCreatures";

interface RippleClick {
  id: number;
  x: number;
  y: number;
}

interface DepthMilestone {
  id: string;
  depth: number;
  label: string;
  subtitle: string;
}

const HISTORIC_MILESTONES: DepthMilestone[] = [
  { id: "scuba_record", depth: 332, label: "332m // DEEPEST HUMAN SCUBA DIVE RECORD", subtitle: "Ahmed Gabr (2014) · 34 ATM Pressure" },
  { id: "burj_khalifa", depth: 828, label: "828m // BURJ KHALIFA HEIGHT BENCHMARK", subtitle: "World's Tallest Skyscraper Height Equivalent" },
  { id: "titanic", depth: 3780, label: "3,780m // R.M.S. TITANIC WRECK SITE", subtitle: "Resting Depth in North Atlantic Ocean" },
  { id: "uss_johnston", depth: 6460, label: "6,460m // USS JOHNSTON DEEPEST SHIPWRECK", subtitle: "WWII Destroyer Wreckage (Samar Trench)" },
  { id: "trieste_lander", depth: 10700, label: "10,700m // BATHYSCAPHE TRIESTE RECORD", subtitle: "Piccard & Walsh Historic First Dive (1960)" },
  { id: "challenger_deep", depth: 10928, label: "10,928m // CHALLENGER DEEP FLOOR", subtitle: "Lowest Point on Earth (Mariana Trench)" },
];

export default function Landing() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const [ripples, setRipples] = useState<RippleClick[]>([]);
  const [isTouch, setIsTouch] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [selectedDiscovery, setSelectedDiscovery] = useState<Discovery | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [isLaunchingDive, setIsLaunchingDive] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (!isTouch) {
      document.documentElement.classList.add("hide-cursor");
      document.body.classList.add("hide-cursor");
    }
    return () => {
      document.documentElement.classList.remove("hide-cursor");
      document.body.classList.remove("hide-cursor");
    };
  }, [isTouch]);

  // Zero-lag 120FPS mouse tracking via direct DOM mutations (no React re-renders)
  useEffect(() => {
    if (isTouch) return;

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
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isTouch]);

  // Handle scroll state safely with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const p = max > 0 ? Math.max(0, Math.min(1, y / max)) : 0;
          setScrollProgress(p);
          const depth = calculateDepthFromProgress(p);
          setCurrentDepth(depth);
          oceanAudio.setDepth(depth);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setRipples(prev => [...prev, { id: Date.now(), x: e.clientX - r.left, y: e.clientY - r.top }]);
    oceanAudio.playSonarPing();
    setIsLaunchingDive(true);
  };

  const handleDiveComplete = () => {
    setIsLaunchingDive(false);
    // Smoothly scroll to ~50m depth where Creature 1 (Ocellaris Clownfish) emerges
    window.scrollTo({ top: window.innerHeight * 0.18, behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleAudio = () => {
    const playing = oceanAudio.toggle();
    setIsAudioPlaying(playing);
  };

  const openCreaturePanel = (c: OceanCreature) => {
    const mapped: Discovery = {
      id: c.id,
      name: c.name,
      scientificName: c.scientificName,
      minimumDepth: c.depthMin,
      maximumDepth: c.depthMax,
      targetDepth: Math.round((c.depthMin + c.depthMax) / 2),
      rarity: c.depthMin > 6000 ? "Legendary" : c.depthMin > 1000 ? "Epic" : c.depthMin > 200 ? "Rare" : "Common",
      description: `Specimen ${c.name} (${c.scientificName}) stationed in the ${c.zone} zone. Adapted to high hydrostatic pressure and low light levels.`,
      xPercent: 50,
      yPercent: 50,
      symbol: "squid",
    };
    setSelectedDiscovery(mapped);
  };

  const openMilestonePanel = (m: DepthMilestone) => {
    const existing = DISCOVERIES.find((d) => d.id === m.id);
    if (existing) {
      setSelectedDiscovery(existing);
    } else {
      const mapped: Discovery = {
        id: m.id,
        name: m.label.split("//")[1]?.trim() || m.label,
        scientificName: m.subtitle,
        minimumDepth: m.depth - 150,
        maximumDepth: m.depth + 150,
        targetDepth: m.depth,
        rarity: m.depth > 6000 ? "Legendary" : "Epic",
        description: `Historic underwater landmark recorded at ${m.depth} meters depth. ${m.subtitle}.`,
        xPercent: 50,
        yPercent: 50,
        symbol: "probe",
      };
      setSelectedDiscovery(mapped);
    }
  };

  const heroOpacity = Math.max(0, 1 - scrollProgress * 300);
  const isHeroVisible = heroOpacity > 0.01;

  const isTrenchFloorReached = currentDepth > 10750;
  const trenchFloorOpacity = Math.min(1, (currentDepth - 10750) / 150);

  const bg1 = Math.max(0, 1 - scrollProgress * 10);
  const bg2 = scrollProgress <= 0.06 ? 0 : scrollProgress <= 0.22 ? Math.min(1, (scrollProgress - 0.06) * 8) : Math.max(0, 1 - (scrollProgress - 0.22) * 8);
  const bg3 = scrollProgress <= 0.22 ? 0 : scrollProgress <= 0.50 ? Math.min(1, (scrollProgress - 0.22) * 5) : Math.max(0, 1 - (scrollProgress - 0.50) * 5);
  const bg4 = scrollProgress <= 0.50 ? 0 : scrollProgress <= 0.78 ? Math.min(1, (scrollProgress - 0.50) * 5) : Math.max(0, 1 - (scrollProgress - 0.78) * 5);
  const bg5 = scrollProgress <= 0.78 ? 0 : Math.min(1, (scrollProgress - 0.78) * 5);

  const vig = 0.15 + scrollProgress * 0.7;
  const temp = calculateTemperatureFromDepth(currentDepth);

  /**
   * Eye-Level Viewport Emergence System:
   * Computes opacity, scale, AND vertical viewport position (viewportTopVh).
   * Guarantees creatures emerge in the comfortable eye-level middle of the viewport (35vh to 65vh).
   */
  const getCreatureAppearance = (c: OceanCreature): { opacity: number; scale: number; viewportTopVh: number } => {
    if (currentDepth < c.depthMin || currentDepth > c.depthMax) {
      return { opacity: 0, scale: 0.75, viewportTopVh: 50 };
    }
    const mid = (c.depthMin + c.depthMax) / 2;
    const radius = (c.depthMax - c.depthMin) / 2;
    const dist = currentDepth - mid;
    const absDist = Math.abs(dist);
    const normalized = Math.max(0, 1 - absDist / radius);
    const factor = Math.sin((normalized * Math.PI) / 2);
    
    const opacity = Math.min(0.95, factor * 1.1);
    const scale = 0.85 + factor * 0.2;
    
    // Base viewport position incorporates c.vOffsetVh for zero vertical collision
    const baseVh = 50 + (c.vOffsetVh || 0);
    const driftRatio = radius > 0 ? dist / radius : 0;
    const viewportTopVh = baseVh - driftRatio * 10;
    
    return { opacity, scale, viewportTopVh };
  };

  return (
    <div className="relative w-full h-[1200vh] bg-black">
      {/* FIXED VIEWPORT STACK */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">

        {/* Film Grain Texture Overlay */}
        <div className="absolute inset-0 bg-film-grain z-[2] opacity-35" />

        {/* Direct-DOM Submarine Searchlight Beam */}
        {!isTouch && (
          <div
            ref={spotlightRef}
            className="absolute inset-0 z-[3] pointer-events-none transition-opacity duration-300"
          />
        )}

        {/* Zone Gradients */}
        <div style={{ opacity: bg1 }} className="absolute inset-0 bg-gradient-to-b from-[#004d73] via-[#011c2e] to-[#000a12]" />
        <div style={{ opacity: bg2 }} className="absolute inset-0 bg-gradient-to-b from-[#180b3d] via-[#0b0421] to-[#020108]" />
        <div style={{ opacity: bg3 }} className="absolute inset-0 bg-gradient-to-b from-[#060812] via-[#010206] to-[#000000]" />
        <div style={{ opacity: bg4 }} className="absolute inset-0 bg-gradient-to-b from-[#160903] via-[#060201] to-[#000000]" />
        <div style={{ opacity: bg5 }} className="absolute inset-0 bg-black" />

        {/* Volumetric Light Rays */}
        {scrollProgress < 0.25 && (
          <div
            style={{ opacity: Math.max(0, (0.25 - scrollProgress) * 4) }}
            className="absolute top-0 left-1/4 w-[600px] h-[900px] bg-gradient-to-b from-sonar-cyan/15 via-sonar-cyan/5 to-transparent blur-3xl animate-god-rays pointer-events-none z-[4]"
          />
        )}

        {/* Pressure Vignette */}
        <div style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,2,4,${vig}) 100%)` }} className="absolute inset-0 z-[5]" />

        {/* Caustics */}
        {scrollProgress < 0.2 && (
          <>
            <div className="absolute inset-0 caustics-pattern animate-caustic-1" style={{ opacity: Math.max(0, 1 - scrollProgress * 5) }} />
            <div className="absolute inset-0 caustics-pattern-secondary animate-caustic-2" style={{ opacity: Math.max(0, 1 - scrollProgress * 5) }} />
          </>
        )}

        {/* Sonar Particle Canvas */}
        <SonarCanvas />

        {/* BOTTOM INTERACTIVE INSTRUCTION BADGE */}
        {scrollProgress > 0.015 && !isTrenchFloorReached && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[40] pointer-events-none select-none transition-all duration-500">
            <div className="px-6 py-2 bg-black/95 border border-sonar-cyan/60 backdrop-blur-2xl text-center flex items-center gap-2.5 shadow-[0_0_30px_rgba(0,240,255,0.3)] rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-sonar-cyan animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-sonar-cyan uppercase font-semibold">
                Click on any specimen to inspect intel & chat with POSEIDON AI
              </span>
            </div>
          </div>
        )}

        {/* TOP HISTORIC MILESTONE BANNER */}
        {currentDepth > 150 && !isTrenchFloorReached && HISTORIC_MILESTONES.map((m) => {
          const depthDiff = Math.abs(currentDepth - m.depth);
          if (depthDiff > 100) return null;
          const milestoneOpacity = Math.max(0, 1 - depthDiff / 100);

          return (
            <div
              key={m.depth}
              style={{ opacity: milestoneOpacity }}
              onClick={() => openMilestonePanel(m)}
              onMouseEnter={() => setHoveredEntity(m.id)}
              onMouseLeave={() => setHoveredEntity(null)}
              className="fixed top-14 left-1/2 -translate-x-1/2 z-[35] flex flex-col items-center pointer-events-auto transition-all duration-300 select-none group"
            >
              <div className="px-6 py-2.5 bg-black/90 border border-sonar-cyan/50 hover:border-sonar-cyan backdrop-blur-2xl text-center flex flex-col items-center gap-0.5 shadow-[0_0_35px_rgba(0,240,255,0.3)] group-hover:scale-105 transition-transform">
                <span className="text-[10px] font-mono tracking-[0.3em] text-sonar-cyan font-bold uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sonar-cyan animate-ping" />
                  {m.label}
                </span>
                <span className="text-xs font-sans font-light text-white/90">
                  {m.subtitle} — <span className="text-sonar-cyan underline">Click to inspect intel</span>
                </span>
              </div>
            </div>
          );
        })}

        {/* 50 CREATURES (EYE-LEVEL CENTERED VIEWPORT POSITIONING) */}
        {OCEAN_CREATURES_50.map((c) => {
          const { opacity, scale, viewportTopVh } = getCreatureAppearance(c);
          if (opacity <= 0.01) return null;

          const hasImageError = failedImages[c.id];
          const isHovered = hoveredEntity === c.id;
          const finalScale = isHovered ? scale * 1.08 : scale;

          return (
            <div
              key={c.id}
              style={{
                top: `${viewportTopVh}vh`,
                left: `${c.leftPercent || 50}%`,
                transform: `translate(-50%, -50%) scale(${finalScale})`,
                opacity,
                willChange: "transform, opacity",
                transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), top 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onClick={() => openCreaturePanel(c)}
              onMouseEnter={() => setHoveredEntity(c.id)}
              onMouseLeave={() => setHoveredEntity(null)}
              className="fixed z-[25] pointer-events-auto flex flex-col items-center group cursor-none"
            >
              {/* Bioluminescent Glass Capsule Orb */}
              <div
                style={{
                  width: `${c.widthPx}px`,
                  height: `${c.heightPx}px`,
                  boxShadow: isHovered
                    ? `0 0 45px ${c.glowColor}, inset 0 0 20px rgba(0, 240, 255, 0.6)`
                    : `0 0 25px ${c.glowColor}, inset 0 0 12px rgba(0, 0, 0, 0.7)`,
                }}
                className={`relative rounded-full border p-1.5 backdrop-blur-xl overflow-hidden transition-all duration-300 ${
                  isHovered
                    ? "border-sonar-cyan scale-105"
                    : "border-white/20 hover:border-sonar-cyan/70 bg-black/60"
                }`}
              >
                <div
                  style={{
                    maskImage: "radial-gradient(circle at 50% 50%, black 50%, transparent 95%)",
                    WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 50%, transparent 95%)",
                  }}
                  className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-black/70"
                >
                  {!hasImageError ? (
                    <img
                      src={`/images/${c.imageFilename}`}
                      alt={c.name}
                      className="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition-transform duration-500"
                      onError={() => setFailedImages((prev) => ({ ...prev, [c.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/40 border border-sonar-cyan/40 rounded-full p-4">
                      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-3/4 h-3/4 text-sonar-cyan animate-pulse">
                        <path d="M20,50 Q40,20 80,50 Q40,80 20,50 Z" />
                        <circle cx="65" cy="45" r="4" fill="currentColor" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Pulse Ring Effect on Hover */}
                {isHovered && (
                  <span className="absolute inset-0 rounded-full border border-sonar-cyan animate-ping opacity-60 pointer-events-none" />
                )}
              </div>

              {/* Specimen Tag */}
              <div
                className={`mt-2.5 px-4 py-1.5 bg-black/90 border backdrop-blur-2xl text-center transition-all duration-200 shadow-xl ${
                  isHovered ? "border-sonar-cyan scale-105 shadow-[0_0_25px_rgba(0,240,255,0.7)]" : "border-white/20 opacity-85"
                }`}
              >
                <span className="text-[8px] font-mono tracking-[0.25em] text-sonar-cyan/90 uppercase block">
                  {c.scientificName}
                </span>
                <span className="text-[12px] font-display font-semibold tracking-wide text-white block mt-0.5">
                  {c.name}
                </span>
              </div>
            </div>
          );
        })}

        {/* Viewport Corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-white/15 z-20" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-white/15 z-20" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-white/15 z-20" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-white/15 z-20" />

        {/* HERO SCREEN */}
        {isHeroVisible && (
          <div
            style={{ opacity: heroOpacity, transform: `translateY(${-scrollProgress * 6000}px)` }}
            className="absolute inset-0 flex flex-col justify-between items-center h-full w-full z-20 pointer-events-auto transition-opacity duration-200"
          >
            <header className="w-full max-w-7xl mx-auto px-8 py-8 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-sonar-cyan/80 animate-spin-[spin_16s_linear_infinite]" />
                <span className="font-display tracking-[0.4em] text-[11px] font-semibold text-white/90 uppercase">
                  Abyss AI
                </span>
              </div>

              <button
                type="button"
                onClick={toggleAudio}
                className="flex items-center gap-2 px-3 py-1.5 border border-white/15 hover:border-sonar-cyan/50 bg-black/40 backdrop-blur-md font-mono text-[9px] text-white/70 hover:text-sonar-cyan transition-all duration-300"
              >
                {isAudioPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-sonar-cyan animate-pulse" />
                    <span className="text-sonar-cyan tracking-wider">HYDROPHONE: ACTIVE</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-white/40" />
                    <span className="tracking-wider">HYDROPHONE: MUTED</span>
                  </>
                )}
              </button>
            </header>

            <section className="flex-grow flex flex-col items-center justify-center text-center max-w-3xl px-6">
              <div className="mb-8 flex items-center gap-3">
                <span className="h-[1px] w-12 bg-sonar-cyan/40" />
                <span className="text-[10px] font-mono tracking-[0.4em] text-sonar-cyan/70 uppercase">Deep Ocean Expedition</span>
                <span className="h-[1px] w-12 bg-sonar-cyan/40" />
              </div>

              <h1 className="font-display font-light text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.1] text-white/95 tracking-tight">
                The last unexplored
                <br />
                <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-sonar-cyan via-white to-sonar-cyan">
                  world on Earth
                </span>
              </h1>

              <p className="mt-8 font-sans text-sm md:text-base font-light text-white/50 leading-relaxed max-w-xl tracking-wide">
                Descend through the ocean&apos;s layers. Uncover forgotten mysteries.
                <br className="hidden md:block" />
                Let <span className="text-sonar-cyan/90 font-medium">POSEIDON</span> guide your expedition.
              </p>

              <div className="mt-12">
                <button
                  ref={buttonRef}
                  onClick={handleButtonClick}
                  onMouseEnter={() => setIsHoveringCTA(true)}
                  onMouseLeave={() => setIsHoveringCTA(false)}
                  aria-label="Start Expedition"
                  className="group relative px-10 py-4 border border-white/20 hover:border-sonar-cyan/60 text-white/80 hover:text-sonar-cyan font-display tracking-[0.3em] text-[11px] font-medium overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,240,255,0.15)] focus:outline-none bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm"
                >
                  <span className="relative z-10">BEGIN DESCENT</span>
                  <span className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full bg-sonar-cyan/60 transition-all duration-700" />
                  {ripples.map((rip) => (
                    <span key={rip.id} style={{ top: rip.y, left: rip.x, transform: "translate(-50%,-50%) scale(0)" }}
                      className="absolute w-2 h-2 bg-sonar-cyan/40 rounded-full animate-[ping_0.8s_ease-out_forwards] pointer-events-none" />
                  ))}
                </button>
              </div>
            </section>

            <footer className="w-full px-8 pb-10 flex flex-col items-center justify-end pointer-events-none">
              <div className="flex items-center gap-6 font-mono text-[9px] text-white/25 tracking-wider">
                <span>DEPTH: {currentDepth.toString().padStart(5,'0')}m</span>
                <span className="h-3 w-[1px] bg-white/10" />
                <span>TEMP: {temp.toFixed(1)}°C</span>
                <span className="h-3 w-[1px] bg-white/10" />
                <span className="text-sonar-cyan/50">SYS READY</span>
              </div>
              <div className="flex flex-col items-center mt-5 gap-2">
                <span className="text-[8px] tracking-[0.35em] font-mono text-white/20 uppercase">scroll to descend</span>
                <ChevronDown className="w-4 h-4 text-white/20 animate-indicator-bounce" />
              </div>
            </footer>
          </div>
        )}

        {/* CHALLENGER DEEP TRENCH FLOOR ENDING SCREEN */}
        {isTrenchFloorReached && (
          <div
            style={{ opacity: trenchFloorOpacity }}
            className="absolute inset-0 flex flex-col justify-center items-center h-full w-full z-30 pointer-events-auto transition-opacity duration-500 bg-black/80 backdrop-blur-md px-6 text-center"
          >
            <div className="max-w-2xl flex flex-col items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1 border border-sonar-cyan/40 bg-sonar-cyan/10 font-mono text-[10px] text-sonar-cyan uppercase tracking-[0.3em]">
                <Sparkles className="w-3.5 h-3.5 text-sonar-cyan animate-pulse" />
                <span>EXPEDITION COMPLETE // BOTTOM OF EARTH REACHED</span>
              </div>

              <h2 className="font-display font-light text-3xl md:text-5xl text-white tracking-tight leading-tight">
                Thank you for exploring the <br />
                <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-sonar-cyan via-white to-sonar-cyan">
                  deepest abyss on Earth
                </span>
              </h2>

              <p className="font-sans text-sm md:text-base font-light text-white/70 max-w-lg leading-relaxed">
                You have reached Challenger Deep (10,928m beneath the surface), where water pressure exceeds 1,100 atmospheres.
              </p>

              {/* Stats Summary Grid */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-md border border-white/10 bg-black/60 p-4 font-mono text-center my-2">
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/40 uppercase tracking-widest">FINAL DEPTH</span>
                  <span className="text-base font-bold text-white mt-1">10,928m</span>
                </div>
                <div className="flex flex-col border-l border-r border-white/10 px-2">
                  <span className="text-[8px] text-white/40 uppercase tracking-widest">PRESSURE</span>
                  <span className="text-base font-bold text-sonar-cyan mt-1">1,101 ATM</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-white/40 uppercase tracking-widest">SPECIES</span>
                  <span className="text-base font-bold text-white/90 mt-1">50 RECORDED</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="px-8 py-3.5 border border-sonar-cyan bg-sonar-cyan/15 hover:bg-sonar-cyan/30 text-sonar-cyan font-mono text-xs font-semibold flex items-center gap-2 transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>ASCEND TO SURFACE</span>
                </button>
              </div>

              <footer className="mt-8 font-mono text-[9px] text-white/30 tracking-widest uppercase">
                ABYSS AI // POSEIDON EXPEDITION SYSTEMS v2.0
              </footer>
            </div>
          </div>
        )}
      </div>

      <DepthHUD />
      <ZoneTransitionOverlay />

      <AnimatePresence>
        {isLaunchingDive && (
          <DiveLaunchOverlay onComplete={handleDiveComplete} />
        )}
        {selectedDiscovery && (
          <DiscoveryPanel discovery={selectedDiscovery} onClose={() => setSelectedDiscovery(null)} />
        )}
      </AnimatePresence>

      {/* ZERO-LAG NATIVE DIRECT DOM CURSOR SPOTLIGHT */}
      {!isTouch && (
        <div
          ref={cursorRef}
          style={{ transform: "translate3d(-100px, -100px, 0)", opacity: 0 }}
          className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center -ml-2 -mt-2 transition-opacity duration-200"
        >
          <div
            ref={cursorDotRef}
            className={`rounded-full transition-all duration-150 ease-out ${
              hoveredEntity
                ? "w-5 h-5 bg-sonar-cyan shadow-[0_0_25px_rgba(0,240,255,1)]"
                : isHoveringCTA
                ? "w-4 h-4 bg-white shadow-[0_0_18px_rgba(255,255,255,0.9)]"
                : "w-2.5 h-2.5 bg-sonar-cyan/90 shadow-[0_0_12px_rgba(0,240,255,0.85)]"
            }`}
          />
        </div>
      )}
    </div>
  );
}
