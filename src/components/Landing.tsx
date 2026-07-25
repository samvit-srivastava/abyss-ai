"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Compass, ChevronDown } from "lucide-react";
import SonarCanvas from "./SonarCanvas";
import DepthHUD from "./DepthHUD";
import ZoneTransitionOverlay from "./ZoneTransitionOverlay";

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

  const shouldReduceMotion = useReducedMotion();

  // Scroll Progress calculations for continuous dive mapping (0 to 1 progress mapped across 1200vh height)
  const { scrollYProgress } = useScroll();

  // --- BACKGROUND GRADIENT LAYER CROSS-FADES (Composited for GPU performance) ---
  const bg1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.16], [1, 1, 0]); // Surface/Sunlight
  const bg2Opacity = useTransform(scrollYProgress, [0.08, 0.16, 0.28, 0.36], [0, 1, 1, 0]); // Twilight
  const bg3Opacity = useTransform(scrollYProgress, [0.28, 0.36, 0.54, 0.64], [0, 1, 1, 0]); // Midnight
  const bg4Opacity = useTransform(scrollYProgress, [0.54, 0.64, 0.82, 0.90], [0, 1, 1, 0]); // Abyssal
  const bg5Opacity = useTransform(scrollYProgress, [0.82, 0.90], [0, 1]); // Hadal

  // --- ATMOSPHERIC TELEMETRY SCALING ---
  const cameraScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const raysOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12], [1, 0.65, 0]); // Sunlight fades in Twilight
  const fogOpacity = useTransform(scrollYProgress, [0, 0.1, 0.4, 0.8, 1], [0.15, 0.35, 0.55, 0.72, 0.85]);

  // --- HERO PORTION TRANSITIONS (Slides up and fades away on scroll start) ---
  const landingY = useTransform(scrollYProgress, [0, 0.06], [0, -150]);
  const landingOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  const headerOpacity = useTransform(scrollYProgress, [0, 0.04], [0.8, 0]);
  const footerOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  // --- SEA CREATURE PARALLAX MATH ---
  const fishY = useTransform(scrollYProgress, [0.05, 0.16], [90, -90]);
  const turtleY = useTransform(scrollYProgress, [0.09, 0.20], [60, -60]);
  const jellyY = useTransform(scrollYProgress, [0.18, 0.32], [120, -120]);
  const squidY = useTransform(scrollYProgress, [0.30, 0.45], [80, -80]);
  const anglerY = useTransform(scrollYProgress, [0.46, 0.62], [100, -100]);
  const ventsY = useTransform(scrollYProgress, [0.65, 0.82], [50, -50]);
  const krakenY = useTransform(scrollYProgress, [0.76, 0.94], [150, -150]);

  // Mouse coordinates tracking using Framer Motion values
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

  // Detect mobile/touch devices
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    if (!isTouch) {
      document.body.classList.add("hide-cursor");
    }

    return () => {
      document.body.classList.remove("hide-cursor");
    };
  }, [isTouch]);

  // Track global mouse coordinates & compute magnetic proximity for the CTA
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

      const magneticRange = 100;

      if (distance < magneticRange) {
        setIsHoveringCTA(true);
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

  // Spawn local click ripple
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
    <div className="relative w-full h-[1200vh] bg-black">
      {/* ──────────────────────────────────────────────────────────────── */}
      {/* VIEWPORT GRAPHICS STACK */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        
        {/* Layer 1: Animated Background Gradients Cross-fading on scroll */}
        {/* 1A. Surface & Sunlight (Blue-Teal) */}
        <motion.div
          style={{ opacity: bg1Opacity }}
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#004d7a] via-[#011424] to-[#000305]"
        />
        {/* 1B. Twilight (Teal-Navy) */}
        <motion.div
          style={{ opacity: bg2Opacity }}
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#011d33] via-[#010a11] to-[#000204]"
        />
        {/* 1C. Midnight (Dark Navy-Abyss) */}
        <motion.div
          style={{ opacity: bg3Opacity }}
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#010d1a] via-[#00050a] to-[#000000]"
        />
        {/* 1D. Abyssal (Dark Abyss-Black) */}
        <motion.div
          style={{ opacity: bg4Opacity }}
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#00050b] via-[#000103] to-[#000000]"
        />
        {/* 1E. Hadal (Pitch Black) */}
        <motion.div
          style={{ opacity: bg5Opacity }}
          className="absolute inset-0 w-full h-full bg-black"
        />

        {/* Camera Zoom Container (Applies subtle scale relative to depth progress) */}
        <motion.div style={{ scale: cameraScale }} className="absolute inset-0 w-full h-full">
          
          {/* Layer 2: Moving Caustics Overlays */}
          <div className="absolute inset-0 caustics-pattern animate-caustic-1" />
          <div className="absolute inset-0 caustics-pattern-secondary animate-caustic-2" />

          {/* Layer 3: Swaying Volumetric Light Rays (Fades out by Mesopelagic boundary) */}
          <motion.div 
            style={{ opacity: raysOpacity }} 
            className="absolute top-0 left-1/4 w-[160%] h-[150%] origin-top-left -translate-y-12 mix-blend-screen overflow-hidden"
          >
            <div className="absolute inset-0 volumetric-ray-1 animate-ray-1 transform-gpu" />
            <div className="absolute inset-0 volumetric-ray-2 animate-ray-2 transform-gpu" />
          </motion.div>

          {/* Layers 4 & 5: Particle/Bubbles Engine (HTML5 Canvas) */}
          <SonarCanvas />

          {/* ──────────────────────────────────────────────────────────── */}
          {/* SILHOUETTED DECORATIVE SEA CREATURES */}
          
          {/* Sunlight: School of Fish */}
          <motion.div 
            style={{ y: fishY }} 
            className="absolute top-[12%] left-[15%] opacity-[0.28] animate-drift-slow transform-gpu"
          >
            <svg viewBox="0 0 120 60" fill="currentColor" className="text-slate-900 w-36 h-20">
              <path d="M10,20 Q20,15 30,20 T50,20 Q55,22 50,25 T30,22 Z" />
              <path d="M30,35 Q40,30 50,35 T70,35 Q75,37 70,40 T50,37 Z" />
              <path d="M60,15 Q70,10 80,15 T100,15 Q105,17 100,20 T80,17 Z" />
            </svg>
          </motion.div>

          {/* Sunlight: Sea Turtle */}
          <motion.div 
            style={{ y: turtleY }} 
            className="absolute top-[18%] right-[18%] opacity-[0.24] animate-drift-slow transform-gpu"
          >
            <svg viewBox="0 0 100 80" fill="currentColor" className="text-slate-900 w-24 h-20">
              <path d="M 50,15 C 35,15 25,25 25,40 C 25,55 35,65 50,65 C 65,65 75,55 75,40 C 75,25 65,15 50,15 Z" />
              <path d="M 30,25 C 10,20 0,35 15,45 C 25,50 30,35 30,25 Z" />
              <path d="M 70,25 C 90,20 100,35 85,45 C 75,50 70,35 70,25 Z" />
              <path d="M 50,15 C 50,5 55,0 50,0 C 45,0 50,5 50,15 Z" />
              <path d="M 35,60 C 25,75 30,80 38,70 Z" />
              <path d="M 65,60 C 75,75 70,80 62,70 Z" />
            </svg>
          </motion.div>

          {/* Twilight: Floating Jellyfish */}
          <motion.div 
            style={{ y: jellyY }} 
            className="absolute top-[28%] left-[25%] opacity-[0.38] animate-swim-jelly transform-gpu"
          >
            <svg viewBox="0 0 60 100" fill="currentColor" className="text-sonar-cyan/35 w-14 h-24">
              <path d="M10,35 C10,15 50,15 50,35 C50,42 10,42 10,35 Z" />
              <path d="M18,38 Q15,60 20,85" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M30,38 Q35,65 28,95" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M42,38 Q45,60 38,88" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          </motion.div>

          {/* Twilight: Giant Squid Silhouette */}
          <motion.div 
            style={{ y: squidY }} 
            className="absolute top-[40%] right-[22%] opacity-[0.26] animate-swim-squid transform-gpu"
          >
            <svg viewBox="0 0 80 150" fill="currentColor" className="text-slate-900 w-24 h-40">
              <path d="M40,10 C25,30 25,70 38,90 C38,94 42,94 42,90 C55,70 55,30 40,10 Z" />
              <path d="M25,30 C20,25 30,10 40,20 C50,10 60,25 55,30 Z" />
              <path d="M35,90 Q30,120 38,150" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <path d="M40,90 Q40,125 43,148" stroke="currentColor" strokeWidth="0.8" fill="none" />
              <path d="M45,90 Q50,118 42,150" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <path d="M38,90 Q20,120 32,150" stroke="currentColor" strokeWidth="0.8" fill="none" />
              <path d="M42,90 Q60,120 48,150" stroke="currentColor" strokeWidth="0.8" fill="none" />
            </svg>
          </motion.div>

          {/* Midnight: Anglerfish with Bioluminescent lure */}
          <motion.div 
            style={{ y: anglerY }} 
            className="absolute top-[55%] left-[20%] opacity-[0.6] transform-gpu"
          >
            <svg viewBox="0 0 100 80" fill="currentColor" className="text-black w-28 h-24">
              <path d="M10,40 C10,15 65,10 80,35 C82,38 78,55 72,60 C55,70 15,65 10,40 Z" />
              <path d="M40,40 L45,45 L50,40 L55,48 L60,40 L65,48 L70,42 L72,52 L40,52 Z" fill="#000" />
              <path d="M38,40 C28,42 30,55 45,55 L43,50 L48,55 L53,49 L58,55 Z" fill="#000" stroke="currentColor" strokeWidth="1" />
              <path d="M80,35 C88,25 95,20 90,40 C95,60 88,55 80,45 Z" />
              <path d="M35,22 C30,10 15,10 18,22" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="18" cy="22" r="3.5" className="text-sonar-cyan animate-pulse-bio" fill="currentColor" />
            </svg>
          </motion.div>

          {/* Abyss: Hydrothermal Vents */}
          <motion.div 
            style={{ y: ventsY }} 
            className="absolute bottom-[20%] right-[15%] opacity-[0.72] animate-sway-vent transform-gpu"
          >
            <svg viewBox="0 0 100 150" fill="currentColor" className="text-slate-950 w-36 h-56">
              <path d="M20,150 L35,60 L45,60 L38,150 Z" />
              <path d="M45,150 L52,80 L58,80 L54,150 Z" />
              <path d="M55,150 L65,40 L78,40 L68,150 Z" />
              <path d="M60,40 Q55,20 62,0 Q72,15 70,40 Z" className="text-sonar-cyan/5 animate-pulse" />
              <path d="M30,60 Q25,35 32,10 Q42,30 40,60 Z" className="text-sonar-cyan/5 animate-pulse" />
            </svg>
          </motion.div>

          {/* Hadal: Colossal Shadow (Whale/Kraken silhouette in dark fog) */}
          <motion.div 
            style={{ y: krakenY }} 
            className="absolute bottom-[10%] left-[10%] opacity-[0.24] animate-drift-slow transform-gpu"
          >
            <svg viewBox="0 0 200 80" fill="currentColor" className="text-black w-[400px] h-[160px]">
              <path d="M10,40 C20,30 50,20 100,25 C150,30 180,15 190,40 C180,65 150,60 100,55 C50,50 20,50 10,40 Z" />
              <path d="M185,38 C195,35 200,45 195,43 Z" />
            </svg>
          </motion.div>

        </motion.div>

        {/* Layer 6: Atmospheric Underwater Fog (Denses linearly based on depth) */}
        <motion.div style={{ opacity: fogOpacity }} className="absolute inset-0 underwater-fog z-10" />

        {/* ──────────────────────────────────────────────────────────── */}
        {/* FIXED POSITION LANDING SCREEN PORTION */}
        <div className="absolute inset-0 flex flex-col justify-between items-center h-full w-full z-20">
          
          {/* Branding Header */}
          <motion.header
            style={{ opacity: headerOpacity }}
            className="w-full max-w-7xl mx-auto px-8 py-6 flex items-center justify-between pointer-events-none"
          >
            <div className="flex items-center gap-2.5 opacity-80">
              <Compass className="w-6 h-6 text-sonar-cyan animate-spin-[spin_12s_linear_infinite]" />
              <span className="font-display tracking-[0.3em] text-xs font-semibold text-white">
                ABYSS AI
              </span>
            </div>
            <div className="text-[10px] tracking-[0.2em] font-mono text-sonar-cyan/40">
              SYS_STATUS: READY
            </div>
          </motion.header>

          {/* Cinematic Text Content */}
          <motion.section
            style={{
              y: landingY,
              opacity: landingOpacity,
            }}
            className="flex-grow flex flex-col items-center justify-center text-center max-w-4xl px-6 pointer-events-none"
          >
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

            <motion.p
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 font-sans text-base md:text-lg font-light text-slate-300 leading-relaxed max-w-2xl text-balance"
            >
              Descend through the ocean&apos;s layers, uncover forgotten mysteries, and let{" "}
              <span className="text-sonar-cyan font-normal drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                POSEIDON
              </span>{" "}
              guide your expedition.
            </motion.p>

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
                <span className="absolute inset-y-0 left-0 w-[2px] bg-sonar-cyan" />
                <span className="absolute inset-y-0 right-0 w-[2px] bg-sonar-cyan" />
                
                <span className="relative z-10">START EXPEDITION</span>

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
          </motion.section>

          {/* Landing Footer / Scroll indicator */}
          <motion.footer
            style={{ opacity: footerOpacity }}
            className="w-full px-8 pb-8 flex flex-col items-center justify-end pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-8 border border-white/10 px-4 py-2 bg-black/40 backdrop-blur-md rounded-none font-mono text-[10px]">
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-white/40 text-[8px] tracking-wider uppercase">DIVE_SYS</span>
                  <span className="text-sonar-cyan uppercase">ACTIVE</span>
                </div>
                <div className="w-[1px] h-6 bg-white/15" />
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-white/40 text-[8px] tracking-wider uppercase">TELEM_DEPTH</span>
                  <span className="text-white tracking-widest font-semibold">0000m</span>
                </div>
                <div className="w-[1px] h-6 bg-white/15" />
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-white/40 text-[8px] tracking-wider uppercase">TEMP_AMBIENT</span>
                  <span className="text-white">20.0°C</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1.5 mt-2">
                <span className="text-[8px] tracking-[0.3em] font-mono text-white/30 uppercase">
                  Scroll to Begin Descent
                </span>
                <div className="relative w-28 h-6 flex items-center justify-center">
                  <div className="absolute inset-x-0 bottom-1/2 h-[1px] bg-white/10" />
                  <div className="absolute left-0 w-1 h-3 border-l border-white/20" />
                  <div className="absolute left-4 w-[1px] h-1.5 bg-white/15" />
                  <div className="absolute left-8 w-[1px] h-1.5 bg-white/15" />
                  <div className="absolute left-12 w-[1px] h-2 bg-white/20" />
                  <div className="absolute left-16 w-[1px] h-1.5 bg-white/15" />
                  <div className="absolute left-20 w-[1px] h-1.5 bg-white/15" />
                  <div className="right-0 w-1 h-3 border-r border-white/20 absolute" />
                  <div className="absolute w-[2px] h-4 bg-sonar-cyan animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.7)]" />
                </div>
                <ChevronDown className="w-4 h-4 text-sonar-cyan/60 animate-indicator-bounce mt-0.5" />
              </div>
            </div>
          </motion.footer>

        </div>

      </div>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* TELEMETRY HUD (Sticky dashboard on right margin) */}
      <DepthHUD />

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* CINEMATIC ZONE CROSSING OVERLAYS (Rate-limited, non-blocking) */}
      <ZoneTransitionOverlay />

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
          <div
            className={`rounded-full transition-all duration-300 ${
              isHoveringCTA
                ? "w-2.5 h-2.5 bg-white shadow-[0_0_12px_rgba(255,255,255,1)]"
                : "w-1.5 h-1.5 bg-sonar-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]"
            }`}
          />
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
    </div>
  );
}
