"use client";

import React, { useEffect, useRef } from "react";

interface Plankton {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
  fadeSpeed: number;
  wobbleSpeed: number;
  wobbleRange: number;
  wobbleAngle: number;
  isSnow?: boolean; // Differentiation flag for marine snow flakes
}

interface Bubble {
  x: number;
  y: number;
  radius: number;
  vy: number;
  wobbleSpeed: number;
  wobbleRange: number;
  wobbleAngle: number;
  alpha: number;
}

interface SonarRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  growthRate: number;
  alpha: number;
  active: boolean;
  type: "move" | "click";
}

export default function SonarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Track mouse coordinates, click events, and scroll telemetry
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    lastActive: 0,
  });

  const scrollRef = useRef({
    progress: 0,
    velocity: 0,
    lastScrollY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    // Set canvas sizes
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track scroll positioning & calculate scroll velocity (for descent camera illusion)
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      const scroll = scrollRef.current;
      scroll.progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
      scroll.velocity = currentScrollY - scroll.lastScrollY;
      scroll.lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // --- OBJECT POOLING SETUP ---
    const MAX_PLANKTON = 100; // Increased to density populate space
    const MAX_BUBBLES = 40;
    const MAX_RIPPLES = 40;

    const planktonPool: Plankton[] = [];
    const bubblePool: Bubble[] = [];
    const ripplePool: SonarRipple[] = [];

    // Initialize Plankton & Marine Snow Pool (Split 60% Plankton / 40% Marine Snow Flakes)
    for (let i = 0; i < MAX_PLANKTON; i++) {
      const isSnow = i % 2 === 0;
      planktonPool.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isSnow ? 0.08 : 0.28),
        vy: isSnow ? (-0.1 - Math.random() * 0.12) : (-0.15 - Math.random() * 0.25), 
        radius: isSnow ? (1.5 + Math.random() * 2.5) : (0.5 + Math.random() * 1.1),
        alpha: Math.random(),
        targetAlpha: isSnow ? (0.1 + Math.random() * 0.32) : (0.18 + Math.random() * 0.62),
        fadeSpeed: 0.004 + Math.random() * 0.012,
        wobbleSpeed: isSnow ? (0.005 + Math.random() * 0.01) : (0.015 + Math.random() * 0.025),
        wobbleRange: isSnow ? (0.5 + Math.random() * 1.2) : (0.2 + Math.random() * 0.8),
        wobbleAngle: Math.random() * Math.PI * 2,
        isSnow: isSnow,
      });
    }

    // Initialize Bubble Pool
    for (let i = 0; i < MAX_BUBBLES; i++) {
      bubblePool.push({
        x: Math.random() * width,
        y: Math.random() * height + height, 
        radius: 0.8 + Math.random() * 3.0,
        vy: -0.6 - Math.random() * 1.2, 
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleRange: 0.5 + Math.random() * 1.2,
        wobbleAngle: Math.random() * Math.PI * 2,
        alpha: 0.1 + Math.random() * 0.38,
      });
    }

    // Initialize Ripple Pool (all inactive initially)
    for (let i = 0; i < MAX_RIPPLES; i++) {
      ripplePool.push({
        x: 0,
        y: 0,
        radius: 0,
        maxRadius: 0,
        growthRate: 0,
        alpha: 0,
        active: false,
        type: "move",
      });
    }

    // Trigger Sonar Ripple helper
    const spawnRipple = (x: number, y: number, type: "move" | "click") => {
      const ripple = ripplePool.find((r) => !r.active);
      if (!ripple) return;

      ripple.x = x;
      ripple.y = y;
      ripple.radius = type === "click" ? 5 : 2;
      ripple.maxRadius = type === "click" ? 185 : 75;
      ripple.growthRate = type === "click" ? 3.0 : 1.3;
      ripple.alpha = type === "click" ? 0.8 : 0.38;
      ripple.type = type;
      ripple.active = true;
    };

    let lastMoveTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.lastActive = Date.now();

      const now = Date.now();
      if (now - lastMoveTime > 180) {
        spawnRipple(e.clientX, e.clientY, "move");
        lastMoveTime = now;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      spawnRipple(e.clientX, e.clientY, "click");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        const x = mouseRef.current.x > 0 ? mouseRef.current.x : width / 2;
        const y = mouseRef.current.y > 0 ? mouseRef.current.y : height / 2;
        spawnRipple(x, y, "click");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);

    // --- RENDER LOOP ---
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const scroll = scrollRef.current;

      // Decay scroll velocity over frames
      scroll.velocity *= 0.94;

      // Telemetry environmental reactivity:
      // Bubbles are completely crushed under extreme Hadal pressure (vanish at progress > 0.8)
      const isExtremePressure = scroll.progress > 0.8;
      const activeBubblesCount = isExtremePressure 
        ? 0 
        : Math.max(2, Math.round(MAX_BUBBLES * (1 - scroll.progress * 1.15)));
      
      // Plankton horizontal motion slows down at deep depths to represent stillness,
      // but vertical currents offset them
      const planktonDriftScale = 1 - scroll.progress * 0.72;

      // 1. UPDATE AND DRAW PLANKTON / MARINE SNOW FLAKES
      for (let i = 0; i < MAX_PLANKTON; i++) {
        const p = planktonPool[i];

        // Apply drift scaled by depth (quieter flow down deep)
        p.wobbleAngle += p.wobbleSpeed;
        const wobbleX = Math.sin(p.wobbleAngle) * p.wobbleRange * (p.isSnow ? 0.25 : 0.15);
        p.x += (p.vx + wobbleX) * planktonDriftScale;
        
        // Add scroll displacement: when camera moves down (positive scroll velocity),
        // particles appear to rise faster relative to the submarine
        const scrollOffset = scroll.velocity * (p.isSnow ? 0.08 : 0.15);
        p.y += p.vy - scrollOffset;

        // Mouse avoidance physics
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = p.isSnow ? 60 : 120; // snow is heavier, repelled less

        if (distance < repelRadius) {
          const force = (repelRadius - distance) / repelRadius;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * (p.isSnow ? 0.8 : 1.6);
          p.y += Math.sin(angle) * force * (p.isSnow ? 0.8 : 1.6);
        }

        // Screen boundary wrapping
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        // Breathing opacity
        if (Math.abs(p.alpha - p.targetAlpha) < 0.01) {
          p.targetAlpha = p.isSnow 
            ? (0.05 + Math.random() * 0.28) 
            : (0.15 + Math.random() * 0.58);
        }
        p.alpha += (p.targetAlpha - p.alpha) * p.fadeSpeed;

        // Draw particle based on type (Snow vs Plankton)
        const finalAlpha = Math.max(0.02, p.alpha * (0.4 + 0.6 * Math.sin(Date.now() * 0.001 * (1 + scroll.progress * 0.5))));
        
        ctx.beginPath();
        if (p.isSnow) {
          // Marine Snow: fluffy white/soft cyan organic aggregations
          const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.8);
          const colorString = scroll.progress > 0.6 
            ? `rgba(0, 245, 235, ${finalAlpha * 0.55})` 
            : `rgba(225, 245, 255, ${finalAlpha * 0.45})`;
          radGrad.addColorStop(0, colorString);
          radGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = radGrad;
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        } else {
          // Bioluminescent Plankton: electric cyan/green dots
          const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.2);
          const colorString = scroll.progress > 0.65 
            ? `rgba(0, 255, 200, ${finalAlpha * 0.95})` 
            : `rgba(0, 240, 255, ${finalAlpha})`;
          radGrad.addColorStop(0, colorString);
          radGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
          ctx.fillStyle = radGrad;
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // 2. UPDATE AND DRAW BUBBLES (Limited by active pool size to match depth dynamics)
      if (activeBubblesCount > 0) {
        for (let i = 0; i < activeBubblesCount; i++) {
          const b = bubblePool[i];

          // Bubble vertical velocity is augmented by the scroll speed of descent
          const speedMultiplier = 1 + Math.max(0, scroll.velocity * 0.05);
          const currentVy = b.vy * speedMultiplier - scroll.velocity * 0.25;

          b.wobbleAngle += b.wobbleSpeed;
          b.x += Math.sin(b.wobbleAngle) * 0.32;
          b.y += currentVy;

          // Wrap around bottom
          if (b.y < -20) {
            b.y = height + Math.random() * 150;
            b.x = Math.random() * width;
            b.alpha = 0.08 + Math.random() * 0.38;
          }
          if (b.y > height + 200) {
            b.y = -20 - Math.random() * 50;
            b.x = Math.random() * width;
          }

          // Deep bubbles appear under pressure (much smaller and fainter, eventually vanishing)
          const sizeScale = Math.max(0.15, 1 - scroll.progress * 0.85);
          const currentRadius = b.radius * sizeScale;
          const bubbleFade = 1 - scroll.progress * 0.95;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${b.alpha * 0.55 * bubbleFade})`;
          ctx.lineWidth = 0.65;
          ctx.arc(b.x, b.y, currentRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.25 * bubbleFade})`;
          ctx.arc(b.x - currentRadius * 0.3, b.y - currentRadius * 0.3, currentRadius * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. UPDATE AND DRAW SONAR RIPPLES
      for (let i = 0; i < MAX_RIPPLES; i++) {
        const r = ripplePool[i];
        if (!r.active) continue;

        r.radius += r.growthRate;
        const progress = r.radius / r.maxRadius;
        r.alpha = (r.type === "click" ? 0.75 : 0.35) * (1 - progress);

        if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
          r.active = false;
          continue;
        }

        ctx.beginPath();
        ctx.strokeStyle = r.type === "click" 
          ? `rgba(0, 240, 255, ${r.alpha})` 
          : `rgba(0, 240, 255, ${r.alpha * 0.55})`;
        ctx.lineWidth = r.type === "click" ? 1.5 : 0.8;
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (r.type === "click" && r.radius > 30) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${r.alpha * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.arc(r.x, r.y, r.radius - 20, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // CLEANUP
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block pointer-events-none z-10"
    />
  );
}
