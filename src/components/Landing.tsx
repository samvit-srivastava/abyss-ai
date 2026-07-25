"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { Compass, ChevronDown, Volume2, VolumeX, Terminal, ShieldAlert } from "lucide-react";
import SonarCanvas from "./SonarCanvas";
import DepthHUD from "./DepthHUD";
import ZoneTransitionOverlay from "./ZoneTransitionOverlay";
import DiscoveryNode from "./DiscoveryNode";
import DiscoveryPanel from "./DiscoveryPanel";
import PoseidonConsole from "./PoseidonConsole";
import { DISCOVERIES, Discovery } from "@/data/discoveries";
import { 
  playClickSound, 
  playConsoleBeep, 
  playSonarPing, 
  startAmbientHum, 
  toggleMute, 
  isMuted 
} from "@/utils/audio";

const INTRO_LINES = [
  "ABYSS AI // MULTISPHERE EXPLORATION MAIN GRID",
  "ESTABLISHING SECURE PROTOCOLS... ✓",
  "SONAR RADIAL TRANSMITTERS... ONLINE ✓",
  "TELEMETRY DEPENSORS... ONLINE ✓",
  "POSEIDON COGNITIVE ARRAY MODULE... ONLINE ✓",
];

interface RippleClick {
  id: number;
  x: number;
  y: number;
}

export default function Landing() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  
  // Phase 5 States: Cinematic Intro, Audio & Autopilot Driving
  const [showIntro, setShowIntro] = useState(true);
  const [introTextIndex, setIntroTextIndex] = useState(0);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [muted, setMuted] = useState(false);
  const [isStartingExpedition, setIsStartingExpedition] = useState(false);

  // Hackathon Autopilot Demo State
  const [demoActive, setDemoActive] = useState(false);
  const [demoBanner, setDemoBanner] = useState<string | null>(null);
  const demoIntervalRef = useRef<number | null>(null);
  const demoTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Phase 3 & 4 States: Discovery & POSEIDON HUD
  const [currentDepth, setCurrentDepth] = useState(0);
  const [hoveredDiscovery, setHoveredDiscovery] = useState<Discovery | null>(null);
  const [selectedDiscovery, setSelectedDiscovery] = useState<Discovery | null>(null);
  const [activePoseidonDiscovery, setActivePoseidonDiscovery] = useState<Discovery | null>(null);

  // Cursor & Touch Detection States
  const [isTouch, setIsTouch] = useState(false);
  const [hasMovedMouse, setHasMovedMouse] = useState(false);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const [ripples, setRipples] = useState<RippleClick[]>([]);

  const shouldReduceMotion = useReducedMotion();

  // Scroll Progress calculations for continuous dive mapping
  const { scrollYProgress } = useScroll();

  // --- BACKGROUND GRADIENT LAYER CROSS-FADES (GPU accelerated) ---
  const bg1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.16], [1, 1, 0]); // Surface/Sunlight
  const bg2Opacity = useTransform(scrollYProgress, [0.08, 0.16, 0.28, 0.36], [0, 1, 1, 0]); // Twilight
  const bg3Opacity = useTransform(scrollYProgress, [0.28, 0.36, 0.54, 0.64], [0, 1, 1, 0]); // Midnight
  const bg4Opacity = useTransform(scrollYProgress, [0.54, 0.64, 0.82, 0.90], [0, 1, 1, 0]); // Abyssal
  const bg5Opacity = useTransform(scrollYProgress, [0.82, 0.90], [0, 1]); // Hadal

  // --- ATMOSPHERIC TELEMETRY SCALING ---
  const cameraScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const cameraX = useTransform(scrollYProgress, [0, 0.2, 0.45, 0.7, 0.9, 1], [0, 18, -12, 22, -15, 0]);
  const cameraRotate = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.85, 1], [0, 0.6, -0.4, 0.5, 0]);
  const cameraJitter = useTransform(scrollYProgress, (progress) => {
    if (progress < 0.54) return 0;
    const amplitude = progress > 0.82 ? 1.6 : 0.7;
    return Math.sin(progress * 2500) * amplitude;
  });
  const raysOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12], [1, 0.65, 0]); 
  const fogOpacity = useTransform(scrollYProgress, [0, 0.1, 0.4, 0.8, 1], [0.15, 0.35, 0.55, 0.72, 0.85]);

  // --- HERO PORTION TRANSITIONS (Smooth fade-blur-slide precisely from 150m to 500m depth) ---
  const landingY = useTransform(scrollYProgress, [0, 0.0136, 0.0454], [0, 0, -180]);
  const landingOpacity = useTransform(scrollYProgress, [0, 0.0136, 0.0454], [1, 1, 0]);
  const landingBlur = useTransform(scrollYProgress, [0, 0.0136, 0.0454], ["blur(0px)", "blur(0px)", "blur(18px)"]);

  const headerOpacity = useTransform(scrollYProgress, [0, 0.0136, 0.036], [0.8, 0.8, 0]);
  const footerOpacity = useTransform(scrollYProgress, [0, 0.0136, 0.036], [1, 1, 0]);

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
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setTimeout(() => setIsTouch(isTouchDevice), 0);

    if (!isTouchDevice) {
      document.body.classList.add("hide-cursor");
    }

    return () => {
      document.body.classList.remove("hide-cursor");
    };
  }, []);

  // Cleanup autopilot resources on unmount
  useEffect(() => {
    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
      demoTimeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Synchronize storage seen intro status & audio volume levels
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("abyss-intro-seen");
      if (seen === "true") {
        setTimeout(() => setShowIntro(false), 0);
      }
      setTimeout(() => setMuted(isMuted()), 0);
    }
  }, []);

  useEffect(() => {
    if (!showIntro) return;
    if (introTextIndex < INTRO_LINES.length) {
      const delay = introTextIndex === 0 ? 100 : introTextIndex === 1 ? 550 : 350;
      const timer = setTimeout(() => {
        setBootLines((prev) => [...prev, INTRO_LINES[introTextIndex]]);
        setIntroTextIndex((prev) => prev + 1);
        playConsoleBeep();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [introTextIndex, showIntro]);

  const handleBeginExpedition = () => {
    playClickSound();
    playSonarPing();
    startAmbientHum();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("abyss-intro-seen", "true");
    }
    setShowIntro(false);
  };

  // Periodic ambient sonar sweeps
  useEffect(() => {
    if (showIntro || muted) return;
    const interval = setInterval(() => {
      if (window.scrollY > 150) {
        playSonarPing();
      }
    }, 14000);
    return () => clearInterval(interval);
  }, [showIntro, muted]);

  // Autopilot autopilot drivers
  const stopDemo = () => {
    setDemoActive(false);
    setDemoBanner(null);
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
    demoTimeoutsRef.current.forEach((t) => clearTimeout(t));
    demoTimeoutsRef.current = [];
    setHoveredDiscovery(null);
    setSelectedDiscovery(null);
    setActivePoseidonDiscovery(null);
    playClickSound();
  };

  const startDemo = () => {
    stopDemo(); // resets previous states
    setDemoActive(true);
    playConsoleBeep();

    // Reset modals
    setSelectedDiscovery(null);
    setActivePoseidonDiscovery(null);
    window.scrollTo({ top: 0, behavior: "instant" });

    const timeouts: NodeJS.Timeout[] = [];
    setDemoBanner("HACKATHON DEMO: AUTOMATING SUBMARINE CONTROLS...");

    // T5: Start scrolling descent
    const t1 = setTimeout(() => {
      setDemoBanner("DESCENDING WATER COLUMN (SUNLIGHT → TWILIGHT)...");
      
      const duration = 15000;
      const startTime = Date.now();
      const startScroll = window.scrollY;
      const maxScroll = (document.documentElement.scrollHeight || (12 * window.innerHeight)) - window.innerHeight;
      const targetScroll = (3780 / 11000) * maxScroll; // Target Titanic at 3780m

      demoIntervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(elapsed / duration, 1);
        const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        window.scrollTo(0, startScroll + (targetScroll - startScroll) * ease);

        if (p >= 1) {
          if (demoIntervalRef.current) {
            clearInterval(demoIntervalRef.current);
            demoIntervalRef.current = null;
          }
        }
      }, 16);
    }, 5000);
    timeouts.push(t1);

    // T20: Mid-dive zone transition banner
    const t2 = setTimeout(() => {
      setDemoBanner("CROSSING MESOPELAGIC BOUNDARY. telemetry ONLINE.");
    }, 20000);
    timeouts.push(t2);

    // T35: Target acquisition
    const t3 = setTimeout(() => {
      setDemoBanner("ANOMALY RADAR SIGNATURE LOCATED. SCANNING HULL...");
      const titanic = DISCOVERIES.find((d) => d.id === "titanic");
      if (titanic) {
        setHoveredDiscovery(titanic);
        playSonarPing();
      }
    }, 35000);
    timeouts.push(t3);

    // T45: Open details panel
    const t4 = setTimeout(() => {
      setDemoBanner("SPECIMEN MATRIX CORRELATION STABILIZED.");
      const titanic = DISCOVERIES.find((d) => d.id === "titanic");
      if (titanic) {
        setHoveredDiscovery(null);
        setSelectedDiscovery(titanic);
        playClickSound();
      }
    }, 45000);
    timeouts.push(t4);

    // T55: Launch POSEIDON
    const t5 = setTimeout(() => {
      setDemoBanner("SYNCHRONIZING WITH POSEIDON COMPANION FRAME...");
      const titanic = DISCOVERIES.find((d) => d.id === "titanic");
      if (titanic) {
        setSelectedDiscovery(null);
        setActivePoseidonDiscovery(titanic);
      }
    }, 55000);
    timeouts.push(t5);

    // T60: Send Predefined Question
    const t6 = setTimeout(() => {
      setDemoBanner("QUERY SUBMITTED: 'What makes this organism survive here?'");
      window.dispatchEvent(
        new CustomEvent("abyss-poseidon-demo-question", {
          detail: { question: "What makes this organism survive here?" }
        })
      );
    }, 60000);
    timeouts.push(t6);

    // T75: Relinquish control
    const t7 = setTimeout(() => {
      setDemoBanner("AUTO-PILOT EXPLORATION COMPLETED. SYSTEM CONTROL RETURNED.");
      const finishTimer = setTimeout(() => {
        setDemoActive(false);
        setDemoBanner(null);
      }, 3000);
      timeouts.push(finishTimer);
    }, 75000);
    timeouts.push(t7);

    demoTimeoutsRef.current = timeouts;
  };

  const handleDemoToggle = () => {
    if (demoActive) {
      stopDemo();
    } else {
      startDemo();
    }
  };

  // Autopilot manual overrides
  useEffect(() => {
    if (!demoActive) return;

    const handleUserInterrupt = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.closest(".demo-toggle-btn") || target?.closest(".poseidon-console-container")) return;
      stopDemo();
    };

    window.addEventListener("wheel", handleUserInterrupt, { passive: true });
    window.addEventListener("touchmove", handleUserInterrupt, { passive: true });
    window.addEventListener("mousedown", handleUserInterrupt);
    window.addEventListener("keydown", handleUserInterrupt);

    return () => {
      window.removeEventListener("wheel", handleUserInterrupt);
      window.removeEventListener("touchmove", handleUserInterrupt);
      window.removeEventListener("mousedown", handleUserInterrupt);
      window.removeEventListener("keydown", handleUserInterrupt);
    };
  }, [demoActive]);

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

  // Performance Optimization scroll listener: updates currentDepth state only when
  // depth shifts by > 15m, avoiding hundreds of layout calls and locking 60 FPS.
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
      const depth = Math.round(progress * 11000);

      setCurrentDepth((prev) => {
        if (Math.abs(prev - depth) > 15) {
          return depth;
        }
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Spawn local click ripple and run camera-shake bubble burst expedition descent triggers
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isStartingExpedition) return;

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

    // Click trigger: Sound effects & dim & vibrate
    playClickSound();
    setTimeout(() => {
      playSonarPing();
    }, 120);

    setIsStartingExpedition(true);
    window.dispatchEvent(new Event("abyss-bubble-burst"));

    // Scroll descent drive trigger
    setTimeout(() => {
      const start = window.scrollY;
      const target = window.innerHeight * 0.45;
      const startTime = Date.now();
      const duration = 2400;

      const scrollStep = () => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(elapsed / duration, 1);
        const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        
        window.scrollTo(0, start + (target - start) * ease);

        if (p < 1) {
          requestAnimationFrame(scrollStep);
        } else {
          setIsStartingExpedition(false);
        }
      };

      requestAnimationFrame(scrollStep);
    }, 900);
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

  // Cursor scale configuration states
  const getOuterRingProps = () => {
    if (hoveredDiscovery) {
      return {
        width: 48,
        height: 48,
        borderColor: "rgba(0, 240, 255, 0.95)",
        borderStyle: "solid",
      };
    }
    if (isHoveringCTA) {
      return {
        width: 58,
        height: 58,
        borderColor: "rgba(0, 240, 255, 0.8)",
        borderStyle: "dashed",
      };
    }
    return {
      width: 30,
      height: 30,
      borderColor: "rgba(0, 240, 255, 0.35)",
      borderStyle: "solid",
    };
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

        {/* Camera Floating Container (Slow continuous floating sway) */}
        <motion.div
          animate={{
            x: [0, 8, -6, 10, -5, 0],
            y: [0, -5, 8, -4, 6, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Camera Zoom Container (Applies subtle scale, drift, tilt, and Hadal pressure vibration) */}
          <motion.div style={{ scale: cameraScale, x: cameraX, y: cameraJitter, rotate: cameraRotate }} className={`absolute inset-0 w-full h-full ${isStartingExpedition ? "camera-shake-active" : ""}`}>
          
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

          {/* Distant Whale Silhouette (Slow horizontal drift across Midnight/Abyss boundaries) */}
          <motion.div 
            style={{ 
              y: useTransform(scrollYProgress, [0.22, 0.58], [350, -350]),
              x: useTransform(scrollYProgress, [0.22, 0.58], [-350, 1500]),
              opacity: useTransform(scrollYProgress, [0.22, 0.28, 0.52, 0.58], [0, 0.15, 0.15, 0])
            }} 
            className="absolute top-[32%] pointer-events-none text-black select-none z-[1]"
          >
            <svg viewBox="0 0 200 80" className="w-[360px] h-[140px] opacity-55">
              <path fill="currentColor" d="M10,35 C25,25 50,15 100,18 C155,22 178,14 185,25 C190,16 195,8 200,18 C195,25 185,32 175,36 C148,45 118,48 88,44 C58,40 25,38 10,35 Z" />
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

          {/* Hadal: Left & Right Trench Rocky Walls Silhouettes */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.75, 0.88], [0, 0.72]),
              y: useTransform(scrollYProgress, [0.75, 1], [150, -100]),
            }}
            className="absolute top-[82%] left-0 w-64 h-[110vh] text-black pointer-events-none"
          >
            <svg viewBox="0 0 100 300" fill="currentColor" className="w-full h-full opacity-65">
              <path d="M0,0 Q35,50 15,100 T40,200 Q20,250 45,300 L0,300 Z" />
            </svg>
          </motion.div>
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.75, 0.88], [0, 0.72]),
              y: useTransform(scrollYProgress, [0.75, 1], [180, -120]),
            }}
            className="absolute top-[82%] right-0 w-64 h-[110vh] text-black pointer-events-none"
          >
            <svg viewBox="0 0 100 300" fill="currentColor" className="w-full h-full opacity-65">
              <path d="M100,0 Q65,50 85,100 T60,200 Q80,250 55,300 L100,300 Z" />
            </svg>
          </motion.div>

        </motion.div>
        
        {/* Close of camera slow floating sway parent */}
        </motion.div>

        {/* Layer 6: Atmospheric Underwater Fog */}
        <motion.div style={{ opacity: fogOpacity }} className="absolute inset-0 underwater-fog z-10" />

        {/* ──────────────────────────────────────────────────────────── */}
        {/* FIXED POSITION LANDING SCREEN PORTION (Unmounts past 500m to preserve FPS) */}
        <AnimatePresence>
          {currentDepth <= 500 && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ filter: landingBlur }}
              className="absolute inset-0 flex flex-col justify-between items-center h-full w-full z-20"
            >
          
          {/* Branding Header */}
          <motion.header
            style={{ opacity: headerOpacity }}
            className="w-full max-w-7xl mx-auto px-8 py-6 flex items-center justify-between pointer-events-auto relative z-30"
          >
            <div className="flex items-center gap-2.5 opacity-80 select-none">
              <Compass className="w-6 h-6 text-sonar-cyan animate-spin-[spin_12s_linear_infinite]" />
              <span className="font-display tracking-[0.3em] text-xs font-semibold text-white">
                ABYSS AI
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] font-mono pointer-events-auto select-none">
              {/* Hackathon Autopilot Demo Button */}
              <button
                onClick={handleDemoToggle}
                className="demo-toggle-btn px-3 py-1.5 border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-semibold tracking-wider transition-colors cursor-none flex items-center gap-1.5 uppercase shadow-[0_0_10px_rgba(234,179,8,0.1)] focus:outline-none"
              >
                <Terminal className="w-3.5 h-3.5 animate-pulse text-yellow-500" />
                {demoActive ? "STOP DEMO" : "HACKATHON DEMO"}
              </button>

              {/* Programmatic Mute Toggle */}
              <button
                onClick={() => {
                  playClickSound();
                  const newMute = toggleMute();
                  setMuted(newMute);
                }}
                className="p-2 border border-white/10 hover:border-sonar-cyan/50 text-white/60 hover:text-sonar-cyan bg-black/40 transition-colors cursor-none focus:outline-none"
                aria-label={muted ? "Unmute audio" : "Mute audio"}
              >
                {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              
              <span className="text-sonar-cyan/40 hidden md:inline">
                SYS_STATUS: READY
              </span>
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
      </motion.div>
    )}
  </AnimatePresence>

      </div>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE ANOMALIES NODES */}
      <AnimatePresence>
        {DISCOVERIES.map((d) => {
          // Anomaly active visibility check (Depth-Aware Visibility system is source of truth)
          const isWithinRange = currentDepth >= d.minimumDepth && currentDepth <= d.maximumDepth;
          return (
            isWithinRange && (
              <DiscoveryNode
                key={d.id}
                discovery={d}
                onHoverStart={() => setHoveredDiscovery(d)}
                onHoverEnd={() => setHoveredDiscovery(null)}
                onClick={() => setSelectedDiscovery(d)}
              />
            )
          );
        })}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* TELEMETRY HUD (Sticky dashboard on right margin) */}
      <DepthHUD />

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* CINEMATIC ZONE CROSSING OVERLAYS (Rate-limited, non-blocking) */}
      <ZoneTransitionOverlay />

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* ANOMALY TELEMETRY DETAIL MODAL PANEL */}
      <AnimatePresence>
        {selectedDiscovery && (
          <DiscoveryPanel
            discovery={selectedDiscovery}
            onClose={() => setSelectedDiscovery(null)}
            onTalkToPoseidon={() => setActivePoseidonDiscovery(selectedDiscovery)}
          />
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* POSEIDON COMPANION CONSOLE */}
      <AnimatePresence>
        {activePoseidonDiscovery && (
          <PoseidonConsole
            discovery={activePoseidonDiscovery}
            depth={currentDepth}
            onClose={() => setActivePoseidonDiscovery(null)}
          />
        )}
      </AnimatePresence>

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
          className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-screen flex items-center justify-center transform-gpu"
        >
          {/* Inner core dot */}
          <div
            className={`rounded-full transition-all duration-300 ${
              hoveredDiscovery
                ? "w-1 h-1 bg-sonar-cyan shadow-[0_0_6px_rgba(0,240,255,1)]"
                : isHoveringCTA
                ? "w-2.5 h-2.5 bg-white shadow-[0_0_12px_rgba(255,255,255,1)]"
                : "w-1.5 h-1.5 bg-sonar-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]"
            }`}
          />
          
          {/* Concentric outer ring */}
          <motion.div
            animate={getOuterRingProps()}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
            }}
            className="absolute rounded-full border"
          />

          {/* Anomaly Precision Crosshair & Target Tag overlay */}
          <AnimatePresence>
            {hoveredDiscovery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none w-12 h-12"
              >
                {/* Targeting hair lines */}
                <div className="absolute w-[1px] h-1.5 bg-sonar-cyan top-[-6px]" />
                <div className="absolute w-[1px] h-1.5 bg-sonar-cyan bottom-[-6px]" />
                <div className="absolute w-1.5 h-[1px] bg-sonar-cyan left-[-6px]" />
                <div className="absolute w-1.5 h-[1px] bg-sonar-cyan right-[-6px]" />

                {/* Pulsing Sonar target warning */}
                <span className="absolute inset-[-4px] border border-sonar-cyan/15 rounded-full animate-ping pointer-events-none" />

                {/* Target warning display banner */}
                <span className="absolute left-8 text-[7px] tracking-[0.2em] text-sonar-cyan bg-[#010910]/85 px-1.5 py-0.5 border border-sonar-cyan/30 uppercase whitespace-nowrap animate-pulse font-mono font-bold shadow-[0_0_10px_rgba(0,240,255,0.15)]">
                  DISCOVERY SCAN
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Cinematic Screen Dimming Overlay */}
      <AnimatePresence>
        {isStartingExpedition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.94 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-[#000408]/95 z-30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Autopilot Demo Status Alert Overlay */}
      <AnimatePresence>
        {demoBanner && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 border border-yellow-500/40 bg-[#010910]/95 px-5 py-3 shadow-[0_0_30px_rgba(234,179,8,0.25)] font-mono text-[9px] md:text-[10px] text-yellow-400 tracking-[0.2em] uppercase select-none rounded-none"
          >
            <ShieldAlert className="w-4 h-4 text-yellow-500 animate-pulse shrink-0" />
            <span className="leading-none">{demoBanner}</span>
            <button
              onClick={stopDemo}
              className="ml-3 px-2 py-1 border border-yellow-500/35 hover:bg-yellow-500/20 text-yellow-400 font-bold tracking-widest text-[8px] cursor-none"
            >
              ABORT
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Entrance Diagnostic Cinematic (Unmounts permanently once dismissed) */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#000204] z-[1000] flex flex-col items-center justify-center font-mono pointer-events-auto cursor-none"
          >
            {/* Holographic background vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_0.5px,transparent_0.5px)] bg-[size:100%_4px] opacity-40 pointer-events-none" />
            
            <div className="max-w-md w-full px-6 flex flex-col items-start gap-4 z-10 select-none">
              <div className="flex items-center gap-3 text-sonar-cyan text-xs font-semibold tracking-[0.3em] uppercase">
                <Compass className="w-5 h-5 animate-spin-[spin_10s_linear_infinite] shrink-0" />
                <span>EXPEDITION PROTOCOLS</span>
              </div>
              
              <div className="w-full h-[1px] bg-sonar-cyan/15 my-1" />

              {/* Typewriter boot output console */}
              <div className="flex flex-col gap-2 min-h-36 font-mono text-[9px] md:text-[10px] text-white/50 tracking-wider">
                {bootLines.map((line, idx) => (
                  <div key={idx} className={idx === 0 ? "text-sonar-cyan font-bold tracking-widest text-xs" : ""}>
                    &gt; {line}
                  </div>
                ))}
                {introTextIndex < INTRO_LINES.length && (
                  <div className="text-sonar-cyan animate-pulse">&gt; _</div>
                )}
              </div>

              {/* Finalized diagnostic CTA */}
              <AnimatePresence>
                {introTextIndex >= INTRO_LINES.length && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 12 }}
                    onClick={handleBeginExpedition}
                    className="w-full mt-4 py-3.5 bg-sonar-cyan/10 hover:bg-sonar-cyan/20 border border-sonar-cyan/35 hover:border-sonar-cyan/80 text-sonar-cyan hover:text-white rounded-none tracking-[0.25em] text-xs font-semibold shadow-[0_0_15px_rgba(0,240,255,0.12)] hover:shadow-[0_0_25px_rgba(0,240,255,0.35)] transition-all duration-300 cursor-none focus:outline-none"
                  >
                    ESTABLISH LINK & BEGIN
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
