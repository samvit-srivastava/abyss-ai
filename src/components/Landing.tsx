"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Compass, ChevronDown, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import SonarCanvas from "./SonarCanvas";
import DepthHUD from "./DepthHUD";
import ZoneTransitionOverlay from "./ZoneTransitionOverlay";
import DiscoveryNode from "./DiscoveryNode";
import DiscoveryPanel from "./DiscoveryPanel";
import { DISCOVERIES, Discovery } from "@/data/discoveries";
import { calculateDepthFromProgress, calculateTemperatureFromDepth } from "@/lib/oceanUtils";
import { oceanAudio } from "@/lib/oceanAudio";
import { OCEAN_CREATURES_50, OceanCreature } from "@/data/oceanCreatures";

interface RippleClick {
  id: number;
  x: number;
  y: number;
}

export default function Landing() {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const [ripples, setRipples] = useState<RippleClick[]>([]);
  const [isTouch, setIsTouch] = useState(false);
  const [hasMovedMouse, setHasMovedMouse] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [hoveredDiscovery, setHoveredDiscovery] = useState<Discovery | null>(null);
  const [selectedDiscovery, setSelectedDiscovery] = useState<Discovery | null>(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (!isTouch) document.body.classList.add("hide-cursor");
    return () => { document.body.classList.remove("hide-cursor"); };
  }, [isTouch]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { setMousePos({ x: e.clientX, y: e.clientY }); if (!hasMovedMouse) setHasMovedMouse(true); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [hasMovedMouse]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.max(0, Math.min(1, y / max)) : 0;
      setScrollProgress(p);
      const depth = calculateDepthFromProgress(p);
      setCurrentDepth(depth);
      oceanAudio.setDepth(depth);
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
    setTimeout(() => setRipples(prev => prev.filter(rip => rip.id !== Date.now())), 850);
    window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" });
  };

  const toggleAudio = () => {
    const playing = oceanAudio.toggle();
    setIsAudioPlaying(playing);
  };

  const heroOpacity = Math.max(0, 1 - scrollProgress * 28);
  const isHeroVisible = heroOpacity > 0.01;

  const bg1 = Math.max(0, 1 - scrollProgress * 10);
  const bg2 = scrollProgress <= 0.06 ? 0 : scrollProgress <= 0.22 ? Math.min(1, (scrollProgress - 0.06) * 8) : Math.max(0, 1 - (scrollProgress - 0.22) * 8);
  const bg3 = scrollProgress <= 0.22 ? 0 : scrollProgress <= 0.50 ? Math.min(1, (scrollProgress - 0.22) * 5) : Math.max(0, 1 - (scrollProgress - 0.50) * 5);
  const bg4 = scrollProgress <= 0.50 ? 0 : scrollProgress <= 0.78 ? Math.min(1, (scrollProgress - 0.50) * 5) : Math.max(0, 1 - (scrollProgress - 0.78) * 5);
  const bg5 = scrollProgress <= 0.78 ? 0 : Math.min(1, (scrollProgress - 0.78) * 5);

  const vig = 0.15 + scrollProgress * 0.7;
  const temp = calculateTemperatureFromDepth(currentDepth);

  const getCreatureOpacity = (c: OceanCreature): number => {
    if (currentDepth < c.depthMin || currentDepth > c.depthMax) return 0;
    const range = c.depthMax - c.depthMin;
    const fadeZone = range * 0.15;
    let opacity = 0.75;
    if (currentDepth < c.depthMin + fadeZone) {
      opacity *= (currentDepth - c.depthMin) / fadeZone;
    } else if (currentDepth > c.depthMax - fadeZone) {
      opacity *= (c.depthMax - currentDepth) / fadeZone;
    }
    return Math.max(0, Math.min(0.75, opacity));
  };

  return (
    <div className="relative w-full h-[1200vh] bg-black">
      {/* FIXED VIEWPORT STACK */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">

        {/* Film Grain Texture Overlay */}
        <div className="absolute inset-0 bg-film-grain z-[2] opacity-40" />

        {/* Zone Gradients */}
        <div style={{ opacity: bg1 }} className="absolute inset-0 bg-gradient-to-b from-[#004d73] via-[#011c2e] to-[#000a12]" />
        <div style={{ opacity: bg2 }} className="absolute inset-0 bg-gradient-to-b from-[#180b3d] via-[#0b0421] to-[#020108]" />
        <div style={{ opacity: bg3 }} className="absolute inset-0 bg-gradient-to-b from-[#060812] via-[#010206] to-[#000000]" />
        <div style={{ opacity: bg4 }} className="absolute inset-0 bg-gradient-to-b from-[#160903] via-[#060201] to-[#000000]" />
        <div style={{ opacity: bg5 }} className="absolute inset-0 bg-black" />

        {/* Volumetric Light Rays (Surface Layer) */}
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

        {/* 50 POPULATED CSS-ANIMATED OCEAN CREATURES */}
        {OCEAN_CREATURES_50.map((c) => {
          const opacity = getCreatureOpacity(c);
          if (opacity <= 0.01) return null;

          const animClassName =
            c.animationType === "swim-left"
              ? "animate-swim-left"
              : c.animationType === "swim-right"
              ? "animate-swim-right"
              : "animate-float-sine";

          const hasImageError = failedImages[c.id];

          return (
            <div
              key={c.id}
              style={{
                top: `${c.topPercent}%`,
                left: c.leftPercent ? `${c.leftPercent}%` : undefined,
                opacity,
                transition: "opacity 1.2s ease-in-out",
                animationDuration: `${c.durationSeconds}s`,
              }}
              className={`absolute z-[6] ${animClassName} transform-gpu pointer-events-none flex flex-col items-center`}
            >
              <div
                style={{
                  width: `${c.widthPx}px`,
                  height: `${c.heightPx}px`,
                  maskImage: "radial-gradient(ellipse at 50% 50%, black 35%, transparent 78%)",
                  WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 35%, transparent 78%)",
                  filter: `drop-shadow(0 0 35px ${c.glowColor})`,
                }}
                className="relative flex items-center justify-center overflow-hidden"
              >
                {!hasImageError ? (
                  <Image
                    src={`/images/${c.imageFilename}`}
                    alt={c.name}
                    fill
                    sizes={`${c.widthPx}px`}
                    className="object-cover"
                    onError={() => setFailedImages((prev) => ({ ...prev, [c.id]: true }))}
                  />
                ) : (
                  /* Glowing Bioluminescent Graphic Silhouette Fallback */
                  <div className="w-full h-full flex items-center justify-center bg-black/40 border border-sonar-cyan/30 rounded-full p-4">
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-3/4 h-3/4 text-sonar-cyan animate-pulse">
                      <path d="M20,50 Q40,20 80,50 Q40,80 20,50 Z" />
                      <circle cx="65" cy="45" r="4" fill="currentColor" />
                    </svg>
                  </div>
                )}
              </div>

              {opacity > 0.3 && (
                <div
                  className="mt-1 flex flex-col items-center text-center font-mono"
                  style={{ opacity: Math.min(1, (opacity - 0.3) * 3) }}
                >
                  <span className="text-[7.5px] tracking-[0.25em] text-white/40 uppercase">
                    {c.scientificName}
                  </span>
                  <span className="text-[11px] font-display font-medium tracking-wide text-white/70">
                    {c.name}
                  </span>
                </div>
              )}
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
            style={{ opacity: heroOpacity, transform: `translateY(${-scrollProgress * 3000}px)` }}
            className="absolute inset-0 flex flex-col justify-between items-center h-full w-full z-20 pointer-events-auto"
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
                className="flex items-center gap-2 px-3 py-1.5 border border-white/15 hover:border-sonar-cyan/50 bg-black/40 backdrop-blur-md font-mono text-[9px] text-white/70 hover:text-sonar-cyan transition-all duration-300 cursor-none"
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
                  className="group relative px-10 py-4 border border-white/20 hover:border-sonar-cyan/60 text-white/80 hover:text-sonar-cyan font-display tracking-[0.3em] text-[11px] font-medium overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,240,255,0.15)] focus:outline-none cursor-none bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm"
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
      </div>

      {/* DISCOVERY NODES */}
      <AnimatePresence>
        {DISCOVERIES.map((d) => {
          const inRange = currentDepth >= d.minimumDepth && currentDepth <= d.maximumDepth;
          return inRange && (
            <DiscoveryNode
              key={d.id}
              discovery={d}
              onHoverStart={() => setHoveredDiscovery(d)}
              onHoverEnd={() => setHoveredDiscovery(null)}
              onClick={() => setSelectedDiscovery(d)}
            />
          );
        })}
      </AnimatePresence>

      <DepthHUD />
      <ZoneTransitionOverlay />

      <AnimatePresence>
        {selectedDiscovery && (
          <DiscoveryPanel discovery={selectedDiscovery} onClose={() => setSelectedDiscovery(null)} />
        )}
      </AnimatePresence>

      {/* MINIMAL CURSOR */}
      {!isTouch && hasMovedMouse && (
        <div
          style={{ left: mousePos.x, top: mousePos.y, transform: "translate(-50%,-50%)" }}
          className="fixed pointer-events-none z-50 flex items-center justify-center"
        >
          <div className={`rounded-full transition-all duration-300 ${
            hoveredDiscovery
              ? "w-3.5 h-3.5 bg-sonar-cyan/90 shadow-[0_0_15px_rgba(0,240,255,0.8)]"
              : isHoveringCTA
              ? "w-3 h-3 bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
              : "w-1.5 h-1.5 bg-white/60 shadow-[0_0_6px_rgba(255,255,255,0.3)]"
          }`} />
        </div>
      )}
    </div>
  );
}
