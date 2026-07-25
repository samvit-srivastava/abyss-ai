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

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      const scroll = scrollRef.current;
      scroll.progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
      scroll.velocity = currentScrollY - scroll.lastScrollY;
      scroll.lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // DENSE PARTICLE POOL SIZES FOR MAXIMUM ATMOSPHERE
    const MAX_PLANKTON = 150;
    const MAX_BUBBLES = 70;
    const MAX_RIPPLES = 40;

    const planktonPool: Plankton[] = [];
    const bubblePool: Bubble[] = [];
    const ripplePool: SonarRipple[] = [];

    for (let i = 0; i < MAX_PLANKTON; i++) {
      planktonPool.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.3, 
        radius: 0.8 + Math.random() * 2.2,
        alpha: Math.random(),
        targetAlpha: 0.25 + Math.random() * 0.7,
        fadeSpeed: 0.008 + Math.random() * 0.015,
        wobbleSpeed: 0.015 + Math.random() * 0.035,
        wobbleRange: 0.4 + Math.random() * 1.2,
        wobbleAngle: Math.random() * Math.PI * 2,
      });
    }

    for (let i = 0; i < MAX_BUBBLES; i++) {
      bubblePool.push({
        x: Math.random() * width,
        y: Math.random() * height + height, 
        radius: 1.0 + Math.random() * 3.8,
        vy: -0.8 - Math.random() * 1.6, 
        wobbleSpeed: 0.02 + Math.random() * 0.04,
        wobbleRange: 0.6 + Math.random() * 1.5,
        wobbleAngle: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.45,
      });
    }

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

    const spawnRipple = (x: number, y: number, type: "move" | "click") => {
      const ripple = ripplePool.find((r) => !r.active);
      if (!ripple) return;

      ripple.x = x;
      ripple.y = y;
      ripple.radius = type === "click" ? 6 : 3;
      ripple.maxRadius = type === "click" ? 220 : 90;
      ripple.growthRate = type === "click" ? 3.5 : 1.5;
      ripple.alpha = type === "click" ? 0.9 : 0.45;
      ripple.type = type;
      ripple.active = true;
    };

    let lastMoveTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.lastActive = Date.now();

      const now = Date.now();
      if (now - lastMoveTime > 150) {
        spawnRipple(e.clientX, e.clientY, "move");
        lastMoveTime = now;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.closest('button') || target.closest('aside')) {
        return;
      }
      spawnRipple(e.clientX, e.clientY, "click");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const scroll = scrollRef.current;

      scroll.velocity *= 0.94;

      const activeBubblesCount = Math.max(10, Math.round(MAX_BUBBLES * (1 - scroll.progress * 0.7)));
      const planktonDriftScale = 1 - scroll.progress * 0.5;

      for (let i = 0; i < MAX_PLANKTON; i++) {
        const p = planktonPool[i];

        p.wobbleAngle += p.wobbleSpeed;
        const wobbleX = Math.sin(p.wobbleAngle) * p.wobbleRange * 0.2;
        p.x += (p.vx + wobbleX) * planktonDriftScale;
        
        const scrollOffset = scroll.velocity * 0.15;
        p.y += p.vy - scrollOffset;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 140;

        if (distance < repelRadius) {
          const force = (repelRadius - distance) / repelRadius;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 2.2;
          p.y += Math.sin(angle) * force * 2.2;
        }

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        if (Math.abs(p.alpha - p.targetAlpha) < 0.01) {
          p.targetAlpha = 0.2 + Math.random() * 0.75;
        }
        p.alpha += (p.targetAlpha - p.alpha) * p.fadeSpeed;

        const pulseRate = 1 + scroll.progress * 0.8;
        const finalAlpha = Math.max(0.1, p.alpha * (0.5 + 0.5 * Math.sin(Date.now() * 0.0015 * pulseRate)));
        
        ctx.beginPath();
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.8);
        
        let colorString = `rgba(0, 240, 255, ${finalAlpha})`;
        if (scroll.progress > 0.4 && scroll.progress <= 0.75) {
          colorString = `rgba(180, 80, 255, ${finalAlpha * 0.9})`;
        } else if (scroll.progress > 0.75) {
          colorString = `rgba(0, 255, 180, ${finalAlpha * 0.95})`;
        }
          
        radGrad.addColorStop(0, colorString);
        radGrad.addColorStop(1, "rgba(0, 240, 255, 0)");
        ctx.fillStyle = radGrad;
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < activeBubblesCount; i++) {
        const b = bubblePool[i];

        const speedMultiplier = 1 + Math.max(0, scroll.velocity * 0.06);
        const currentVy = b.vy * speedMultiplier - scroll.velocity * 0.3;

        b.wobbleAngle += b.wobbleSpeed;
        b.x += Math.sin(b.wobbleAngle) * 0.45;
        b.y += currentVy;

        if (b.y < -20) {
          b.y = height + Math.random() * 150;
          b.x = Math.random() * width;
          b.alpha = 0.15 + Math.random() * 0.45;
        }
        if (b.y > height + 200) {
          b.y = -20 - Math.random() * 50;
          b.x = Math.random() * width;
        }

        const currentRadius = b.radius;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 240, 255, ${b.alpha * 0.65})`;
        ctx.lineWidth = 0.85;
        ctx.arc(b.x, b.y, currentRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.35})`;
        ctx.arc(b.x - currentRadius * 0.3, b.y - currentRadius * 0.3, currentRadius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < MAX_RIPPLES; i++) {
        const r = ripplePool[i];
        if (!r.active) continue;

        r.radius += r.growthRate;
        const progress = r.radius / r.maxRadius;
        r.alpha = (r.type === "click" ? 0.85 : 0.45) * (1 - progress);

        if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
          r.active = false;
          continue;
        }

        ctx.beginPath();
        ctx.strokeStyle = r.type === "click" 
          ? `rgba(0, 240, 255, ${r.alpha})` 
          : `rgba(0, 240, 255, ${r.alpha * 0.6})`;
        ctx.lineWidth = r.type === "click" ? 1.8 : 1.0;
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
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
