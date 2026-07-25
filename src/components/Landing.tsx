"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Compass, ChevronDown } from "lucide-react";
import SonarCanvas from "./SonarCanvas";

interface RippleClick {
  id: number;
  x: number;
  y: number;
}

export default function Landing() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const [ripples, setRipples] = useState<RippleClick[]>([]);
  const [isTouch, setIsTouch] = useState(false);
  const [hasMovedMouse, setHasMovedMouse] = useState(false);
  const [currentDepth, setCurrentDepth] = useState(0);

  const shouldReduceMotion = useReducedMotion();

  // Mouse Coordinates tracking using Framer Motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Magnetic Button Offsets
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);

  // Spring settings for custom cursor and magnetic physics
  const cursorSpringConfig = { damping: 25, stiffness: 220, mass: 0.55 };
  const magneticSpringConfig = { damping: 14, stiffness: 100, mass: 0.65 };

  const smoothCursorX = useSpring(mouseX, cursorSpringConfig);
  const smoothCursorY = useSpring(mouseY, cursorSpringConfig);

  const smoothBtnX = useSpring(btnX, magneticSpringConfig);
  const smoothBtnY = useSpring(btnY, magneticSpringConfig);

  // Detect mobile/touch devices to adjust custom cursor and interaction settings
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    // Trigger cursor hiding on non-touch devices
    if (!isTouch) {
      document.body.classList.add("hide-cursor");
    }

    return () => {
      document.body.classList.remove("hide-cursor");
    };
  }, [isTouch]);

  // Track global mouse coordinates and compute magnetic field proximity to the CTA button
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!hasMovedMouse) setHasMovedMouse(true);

      const button = buttonRef.current;
      if (!button || isTouch) return;

      const rect = button.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - btnCenterX;
      const dy = e.clientY - btnCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const magneticRange = 100; // Pull radius

      if (distance < magneticRange) {
        setIsHoveringCTA(true);
        // Compute pull power scaling linearly with proximity
        const force = (magneticRange - distance) / magneticRange;
        btnX.set(dx * force * 0.42);
        btnY.set(dy * force * 0.42);
      } else {
        setIsHoveringCTA(false);
        btnX.set(0);
        btnY.set(0);
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [btnX, btnY, mouseX, mouseY, hasMovedMouse, isTouch]);

  // Animate minor scale readings on depth telemetry display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDepth((prev) => {
        // Subtle drift oscillation representing floating position (0m to 8m)
        const drift = Math.sin(Date.now() / 1500) * 2;
        const target = 4 + Math.round(drift);
        return Math.max(0, target);
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Spawn local CSS ripple element on button click
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: RippleClick = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Cleanup ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 850);
  };

  // Typography staggered texts
  const heroSentence = "You are about to enter the last unexplored world on Earth.";
  const words = heroSentence.split(" ");

  // Framer Motion Variants for Text Intro Sequences
  const textContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const wordVariants = {
    hidden: {
      filter: shouldReduceMotion ? "blur(0px)" : "blur(12px)",
      opacity: 0,
      y: shouldReduceMotion ? 0 : 30,
      letterSpacing: "0.08em",
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      letterSpacing: "0em",
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 0.65,
      y: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut" as const,
        delay: shouldReduceMotion ? 0 : 1.4,
      },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        ease: "easeOut" as const,
        delay: shouldReduceMotion ? 0 : 2.1,
      },
    },
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-deep-abyss flex flex-col justify-between items-center select-none">
      {/* ──────────────────────────────────────────────────────────────── */}
      {/* BACKGROUND LAYERS */}
      
      {/* Layer 1: Base ocean gradient gradient (Configured in custom tailwind utility .bg-deep-abyss) */}
      
      {/* Layer 2: Moving Caustics Overlays (Using hardware accelerated layers to match 60 FPS requirement) */}
      <div className="absolute inset-0 caustics-pattern animate-caustic-1 pointer-events-none" />
      <div className="absolute inset-0 caustics-pattern-secondary animate-caustic-2 pointer-events-none" />

      {/* Layer 3: Swaying Volumetric Light Rays */}
      <div className="absolute top-0 left-1/4 w-[160%] h-[150%] origin-top-left -translate-y-12 mix-blend-screen pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 volumetric-ray-1 animate-ray-1 transform-gpu" />
        <div className="absolute inset-0 volumetric-ray-2 animate-ray-2 transform-gpu" />
      </div>

      {/* Layers 4 & 5: Plankton Particles and Bubble Streams (Handled by the HTML5 Canvas) */}
      <SonarCanvas />

      {/* Layer 6: Atmospheric Underwater Fog (Provides deep attenuation towards bottom) */}
      <div className="absolute inset-0 underwater-fog z-10" />

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* BRANDING HEADER */}
      <header className="w-full max-w-7xl mx-auto px-8 py-6 flex items-center justify-between z-20 relative pointer-events-none">
        <div className="flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity">
          <Compass className="w-6 h-6 text-sonar-cyan animate-spin-[spin_12s_linear_infinite]" />
          <span className="font-display tracking-[0.3em] text-xs font-semibold text-white">
            ABYSS AI
          </span>
        </div>
        <div className="text-[10px] tracking-[0.2em] font-mono text-sonar-cyan/40">
          SYS_STATUS: READY
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* CINEMATIC TEXT CONTENT */}
      <section className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl px-6 z-20 relative pointer-events-none">
        {/* Title Heading - Staggered Words */}
        <motion.h1
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
          className="font-display font-medium text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem] leading-[1.15] text-white tracking-tight max-w-3xl"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              variants={wordVariants}
              className="inline-block mr-[0.25em] last:mr-0 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle - Fade in */}
        <motion.p
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 font-sans text-base md:text-lg font-light text-slate-300 leading-relaxed max-w-2xl text-balance"
        >
          Descend through the ocean's layers, uncover forgotten mysteries, and let{" "}
          <span className="text-sonar-cyan font-normal drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            POSEIDON
          </span>{" "}
          guide your expedition.
        </motion.p>

        {/* Magnetic CTA Button */}
        <motion.div
          variants={ctaVariants}
          initial="hidden"
          animate="visible"
          className="pointer-events-auto mt-10 relative"
          style={{
            x: smoothBtnX,
            y: smoothBtnY,
          }}
        >
          <button
            ref={buttonRef}
            onClick={handleButtonClick}
            aria-label="Start Expedition"
            className="light-sweep-btn relative px-8 py-4 bg-sonar-cyan/10 hover:bg-sonar-cyan/20 border border-sonar-cyan/40 hover:border-sonar-cyan/80 text-sonar-cyan hover:text-white rounded-none font-display tracking-[0.25em] text-xs font-semibold overflow-hidden transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.35)] focus:outline-none focus:ring-2 focus:ring-sonar-cyan/80 active:scale-95 transform-gpu cursor-none"
          >
            {/* Inner Glow lines */}
            <span className="absolute inset-y-0 left-0 w-[2px] bg-sonar-cyan" />
            <span className="absolute inset-y-0 right-0 w-[2px] bg-sonar-cyan" />
            
            <span className="relative z-10">START EXPEDITION</span>

            {/* Click Ripple overlays */}
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                style={{
                  top: ripple.y,
                  left: ripple.x,
                  transform: "translate(-50%, -50%) scale(0)",
                }}
                className="absolute w-2 h-2 bg-sonar-cyan/40 rounded-full animate-[ping_0.8s_ease-out_forwards] pointer-events-none"
              />
            ))}
          </button>
        </motion.div>
      </section>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* SCROLL INDICATOR & INSTRUMENTATION DIALS */}
      <footer className="w-full px-8 pb-8 flex flex-col items-center justify-end z-20 relative pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          {/* Depth Telemetry Box */}
          <div className="flex items-center gap-8 border border-white/10 px-4 py-2 bg-black/40 backdrop-blur-md rounded-none font-mono text-[10px]">
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-white/40 text-[8px] tracking-wider uppercase">DIVE_SYS</span>
              <span className="text-sonar-cyan uppercase">ACTIVE</span>
            </div>
            <div className="w-[1px] h-6 bg-white/15" />
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-white/40 text-[8px] tracking-wider uppercase">TELEM_DEPTH</span>
              <span className="text-white tracking-widest font-semibold">
                {String(currentDepth).padStart(4, "0")}m
              </span>
            </div>
            <div className="w-[1px] h-6 bg-white/15" />
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-white/40 text-[8px] tracking-wider uppercase">TEMP_AMBIENT</span>
              <span className="text-white">16.4°C</span>
            </div>
          </div>

          {/* Submarine Gauge Visual */}
          <div className="flex flex-col items-center gap-1.5 mt-2">
            <span className="text-[8px] tracking-[0.3em] font-mono text-white/30 uppercase">
              Descend to Begin
            </span>
            <div className="relative w-28 h-6 flex items-center justify-center">
              {/* Metric grid tick lines */}
              <div className="absolute inset-x-0 bottom-1/2 h-[1px] bg-white/10" />
              <div className="absolute left-0 w-1 h-3 border-l border-white/20" />
              <div className="absolute left-4 w-[1px] h-1.5 bg-white/15" />
              <div className="absolute left-8 w-[1px] h-1.5 bg-white/15" />
              <div className="absolute left-12 w-[1px] h-2 bg-white/20" />
              <div className="absolute left-16 w-[1px] h-1.5 bg-white/15" />
              <div className="absolute left-20 w-[1px] h-1.5 bg-white/15" />
              <div className="absolute right-0 w-1 h-3 border-r border-white/20" />

              {/* Scanning center line */}
              <div className="absolute w-[2px] h-4 bg-sonar-cyan animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.7)]" />
            </div>
            <ChevronDown className="w-4 h-4 text-sonar-cyan/60 animate-indicator-bounce mt-0.5" />
          </div>
        </div>
      </footer>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* CUSTOM SONAR CURSOR */}
      {!isTouch && hasMovedMouse && (
        <motion.div
          style={{
            x: smoothCursorX,
            y: smoothCursorY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 mix-blend-screen flex items-center justify-center transform-gpu"
        >
          {/* Inner core dot */}
          <div
            className={`rounded-full transition-all duration-300 ${
              isHoveringCTA
                ? "w-2.5 h-2.5 bg-white shadow-[0_0_12px_rgba(255,255,255,1)]"
                : "w-1.5 h-1.5 bg-sonar-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]"
            }`}
          />

          {/* Concentric outer ring */}
          <motion.div
            animate={{
              width: isHoveringCTA ? 58 : 30,
              height: isHoveringCTA ? 58 : 30,
              borderColor: isHoveringCTA ? "rgba(0, 240, 255, 0.8)" : "rgba(0, 240, 255, 0.35)",
              borderStyle: isHoveringCTA ? "dashed" : "solid",
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
            }}
            className="absolute rounded-full border"
          />
        </motion.div>
      )}
    </main>
  );
}
