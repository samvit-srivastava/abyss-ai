"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, ShieldCheck, Zap } from "lucide-react";

interface DiveLaunchOverlayProps {
  onComplete: () => void;
}

export default function DiveLaunchOverlay({ onComplete }: DiveLaunchOverlayProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1700);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center overflow-hidden bg-black/85 backdrop-blur-xl select-none"
    >
      {/* 1. Expanding Hydro-Shockwave Ring */}
      <motion.div
        initial={{ scale: 0.1, opacity: 1 }}
        animate={{ scale: 4.0, opacity: 0 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
        className="absolute w-[450px] h-[450px] rounded-full border-2 border-sonar-cyan shadow-[0_0_80px_rgba(0,240,255,0.8)]"
      />

      {/* 2. Tactical Viewport Reticle Lock */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
        <motion.div
          initial={{ rotate: 0, scale: 0.8 }}
          animate={{ rotate: 360, scale: [0.8, 1.15, 1] }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="relative p-6 rounded-full border border-sonar-cyan/60 bg-sonar-cyan/10 shadow-[0_0_50px_rgba(0,240,255,0.4)] flex items-center justify-center"
        >
          <Compass className="w-12 h-12 text-sonar-cyan animate-pulse" />
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="absolute inset-0 rounded-full border border-sonar-cyan/40"
          />
        </motion.div>

        {/* 3. Pulsing Neon Badge & Engine Ignition Status */}
        <div className="flex flex-col items-center gap-1 font-mono">
          <div className="flex items-center gap-2 text-sonar-cyan text-xs tracking-[0.4em] uppercase font-bold">
            <Zap className="w-4 h-4 text-sonar-cyan animate-bounce" />
            <span>SUBMERSIBLE ENGINE IGNITION</span>
          </div>

          <h2 className="font-display font-light text-2xl md:text-4xl text-white tracking-widest uppercase mt-1">
            PLUNGING INTO THE ABYSS
          </h2>

          <div className="flex items-center gap-4 mt-3 text-[10px] text-white/80 tracking-widest font-mono">
            <span className="flex items-center gap-1.5 text-sonar-cyan">
              <ShieldCheck className="w-3.5 h-3.5" />
              HULL SEALED: 100%
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-sonar-cyan animate-ping" />
            <span className="text-white/90">THRUST: MAXIMUM</span>
          </div>
        </div>

        {/* 4. Glowing Progress Bar */}
        <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden border border-sonar-cyan/40 mt-4">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-sonar-cyan via-white to-sonar-cyan shadow-[0_0_15px_rgba(0,240,255,1)]"
          />
        </div>
      </div>

      {/* 5. Upward Bubble Rush Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: "100vh",
              x: `${(i / 20) * 100}vw`,
              scale: (i % 3) * 0.4 + 0.5,
              opacity: 0.8,
            }}
            animate={{
              y: "-10vh",
              opacity: 0,
            }}
            transition={{
              duration: 1.0 + (i % 4) * 0.2,
              repeat: Infinity,
              ease: "easeOut",
              delay: (i % 5) * 0.1,
            }}
            className="absolute w-3 h-3 rounded-full bg-sonar-cyan/70 blur-[1px] shadow-[0_0_12px_rgba(0,240,255,0.9)]"
          />
        ))}
      </div>
    </motion.div>
  );
}
