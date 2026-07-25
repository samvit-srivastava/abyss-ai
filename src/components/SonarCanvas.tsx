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
  
  // Track mouse coordinates and click events
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    lastActive: 0,
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

    // --- OBJECT POOLING SETUP ---
    const MAX_PLANKTON = 70;
    const MAX_BUBBLES = 35;
    const MAX_RIPPLES = 40;

    const planktonPool: Plankton[] = [];
    const bubblePool: Bubble[] = [];
    const ripplePool: SonarRipple[] = [];

    // Initialize Plankton Pool
    for (let i = 0; i < MAX_PLANKTON; i++) {
      planktonPool.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.2, // Drifts upwards and sideways
        radius: 0.6 + Math.random() * 1.4,
        alpha: Math.random(),
        targetAlpha: 0.15 + Math.random() * 0.55,
        fadeSpeed: 0.005 + Math.random() * 0.01,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
        wobbleRange: 0.2 + Math.random() * 0.8,
        wobbleAngle: Math.random() * Math.PI * 2,
      });
    }

    // Initialize Bubble Pool (All starting at various vertical offsets to stream continuously)
    for (let i = 0; i < MAX_BUBBLES; i++) {
      bubblePool.push({
        x: Math.random() * width,
        y: height + Math.random() * 200, // Spawn below viewport
        radius: 0.8 + Math.random() * 3.2,
        vy: -0.6 - Math.random() * 1.4, // Speed proportional to size roughly
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleRange: 0.5 + Math.random() * 1.5,
        wobbleAngle: Math.random() * Math.PI * 2,
        alpha: 0.1 + Math.random() * 0.4,
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
      // Find first inactive ripple in pool
      const ripple = ripplePool.find((r) => !r.active);
      if (!ripple) return; // Pool full, drop request for performance

      ripple.x = x;
      ripple.y = y;
      ripple.radius = type === "click" ? 5 : 2;
      ripple.maxRadius = type === "click" ? 180 : 70;
      ripple.growthRate = type === "click" ? 2.8 : 1.2;
      ripple.alpha = type === "click" ? 0.75 : 0.35;
      ripple.type = type;
      ripple.active = true;
    };

    // Track mouse move to update cursor coordinates & spawn minor move ripples
    let lastMoveTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.lastActive = Date.now();

      const now = Date.now();
      // Rate limit move ripples to prevent canvas clogging (every 180ms)
      if (now - lastMoveTime > 180) {
        spawnRipple(e.clientX, e.clientY, "move");
        lastMoveTime = now;
      }
    };

    // Handle mouse click to spawn intense sonar ripples
    const handleMouseDown = (e: MouseEvent) => {
      spawnRipple(e.clientX, e.clientY, "click");
    };

    // Keyboard accessibility trigger for sonar (Space/Enter key when focused anywhere sends sonar)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        // Spawn ping from center of viewport or mouse if active
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

      // 1. UPDATE AND DRAW PLANKTON
      for (let i = 0; i < MAX_PLANKTON; i++) {
        const p = planktonPool[i];

        // Basic drift movement
        p.wobbleAngle += p.wobbleSpeed;
        const wobbleX = Math.sin(p.wobbleAngle) * p.wobbleRange * 0.15;
        p.x += p.vx + wobbleX;
        p.y += p.vy;

        // Mouse avoidance physics
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 130;

        if (distance < repelRadius) {
          const force = (repelRadius - distance) / repelRadius;
          const angle = Math.atan2(dy, dx);
          // Push away from mouse
          p.x += Math.cos(angle) * force * 1.5;
          p.y += Math.sin(angle) * force * 1.5;
        }

        // Screen boundary wrapping
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        // Breathing opacity effect
        if (Math.abs(p.alpha - p.targetAlpha) < 0.01) {
          p.targetAlpha = 0.15 + Math.random() * 0.55;
        }
        p.alpha += (p.targetAlpha - p.alpha) * p.fadeSpeed;

        // Draw soft glowing point
        ctx.beginPath();
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        radGrad.addColorStop(0, `rgba(0, 240, 255, ${p.alpha})`);
        radGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
        ctx.fillStyle = radGrad;
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. UPDATE AND DRAW BUBBLES
      for (let i = 0; i < MAX_BUBBLES; i++) {
        const b = bubblePool[i];

        // Rise up and sway
        b.wobbleAngle += b.wobbleSpeed;
        b.x += Math.sin(b.wobbleAngle) * 0.35;
        b.y += b.vy;

        // Wrap around bottom when bubble rises past top
        if (b.y < -20) {
          b.y = height + Math.random() * 150;
          b.x = Math.random() * width;
          b.alpha = 0.08 + Math.random() * 0.38;
        }

        // Draw bubble outline
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 240, 255, ${b.alpha * 0.6})`;
        ctx.lineWidth = 0.7;
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Subtle highlight reflection inside the bubble
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.3})`;
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. UPDATE AND DRAW SONAR RIPPLES
      for (let i = 0; i < MAX_RIPPLES; i++) {
        const r = ripplePool[i];
        if (!r.active) continue;

        r.radius += r.growthRate;
        
        // Decay alpha as it expands
        const progress = r.radius / r.maxRadius;
        r.alpha = (r.type === "click" ? 0.75 : 0.35) * (1 - progress);

        if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
          r.active = false;
          continue;
        }

        // Draw thin concentric rings
        ctx.beginPath();
        ctx.strokeStyle = r.type === "click" 
          ? `rgba(0, 240, 255, ${r.alpha})` 
          : `rgba(0, 240, 255, ${r.alpha * 0.55})`;
        ctx.lineWidth = r.type === "click" ? 1.5 : 0.8;
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        // For click ripples, draw an secondary inner ring lagging slightly behind
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

    // CLEANUP TO PREVENT MEMORY LEAKS
    return () => {
      window.removeEventListener("resize", resizeCanvas);
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
