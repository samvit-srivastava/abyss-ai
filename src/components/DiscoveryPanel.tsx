"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Cpu, Anchor } from "lucide-react";
import { Discovery } from "@/data/discoveries";

interface DiscoveryPanelProps {
  discovery: Discovery;
  onClose: () => void;
}

export default function DiscoveryPanel({ discovery, onClose }: DiscoveryPanelProps) {
  // Piecewise telemetry calculation helpers based on depth
  const depth = discovery.targetDepth;
  const pressure = Math.round(1 + depth / 10);
  
  let temp = 20.0;
  if (depth < 200) {
    temp = 20.0 - (depth / 200) * 4.0;
  } else if (depth < 1000) {
    temp = 16.0 - ((depth - 200) / 800) * 11.0;
  } else if (depth < 4000) {
    temp = 5.0 - ((depth - 1000) / 3000) * 2.5;
  } else if (depth < 6000) {
    temp = 2.5 - ((depth - 4000) / 2000) * 1.1;
  } else {
    temp = 1.4 - ((depth - 6000) / 5000) * 0.3;
  }

  // Rarity styling maps
  const rarityColors = {
    Common: "border-slate-500/20 text-slate-400 bg-slate-500/5 shadow-[0_0_10px_rgba(148,163,184,0.05)]",
    Rare: "border-yellow-500/25 text-yellow-400 bg-yellow-500/5 shadow-[0_0_15px_rgba(234,179,8,0.1)]",
    Epic: "border-purple-500/30 text-purple-400 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    Legendary: "border-orange-500/35 text-orange-400 bg-orange-500/5 shadow-[0_0_25px_rgba(249,115,22,0.25)] animate-pulse",
  };

  // Render unified vector illustrations inside scanning display
  const renderIllustration = () => {
    const symbol = discovery.symbol;
    
    // Core drawing paths
    switch (symbol) {
      case "amphora":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-28 h-28 text-sonar-cyan">
            <path d="M40,25 C40,18 43,15 50,15 C57,15 60,18 60,25 Z" />
            <path d="M35,25 L65,25" />
            <path d="M42,25 L38,35 C33,48 30,55 30,68 C30,82 38,88 50,88 C62,88 70,82 70,68 C70,55 67,48 62,35 L58,25" />
            <path d="M38,35 C38,35 44,45 42,52" />
            <path d="M62,35 C62,35 56,45 58,52" />
          </svg>
        );
      case "coral":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-28 h-28 text-sonar-cyan">
            <path d="M50,90 L50,60" />
            <path d="M50,70 C40,65 38,55 35,50 C32,45 35,40 38,38" />
            <path d="M35,50 C38,50 40,45 45,45" />
            <path d="M50,60 C60,55 62,45 65,40 C68,35 65,30 60,30" />
            <path d="M65,40 C62,40 58,35 55,35" />
            <path d="M50,80 C40,78 30,70 30,62 L30,55" />
            <path d="M50,75 C60,72 70,68 70,58 L70,48" />
          </svg>
        );
      case "anchor":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-28 h-28 text-sonar-cyan">
            <circle cx="50" cy="22" r="6" />
            <path d="M50,28 L50,72" />
            <path d="M35,38 L65,38" />
            <path d="M25,58 C30,75 70,75 75,58" />
            <path d="M22,58 L28,58 M72,58 L78,58" />
            <path d="M25,58 L20,53 M75,58 L80,53" />
          </svg>
        );
      case "drone":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-28 h-28 text-sonar-cyan animate-pulse">
            <rect x="25" y="35" width="50" height="30" rx="15" />
            <circle cx="40" cy="50" r="4" fill="currentColor" />
            <circle cx="60" cy="50" r="2.5" />
            <path d="M15,50 L25,50 M75,50 L85,50" />
            <path d="M15,42 L15,58 M85,42 L85,58" />
            <path d="M50,35 L50,22" />
            <circle cx="50" cy="20" r="2" fill="currentColor" className="text-yellow-500 animate-ping" />
          </svg>
        );
      case "squid":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-28 h-28 text-sonar-cyan">
            <path d="M50,15 C40,25 35,45 42,60 C42,62 45,64 48,65 C52,65 58,62 58,60 C65,45 60,25 50,15 Z" />
            <circle cx="45" cy="52" r="2" fill="currentColor" />
            <circle cx="55" cy="52" r="2" fill="currentColor" />
            <path d="M42,65 Q35,80 40,92" />
            <path d="M46,65 Q45,82 48,94" />
            <path d="M54,65 Q55,82 52,94" />
            <path d="M58,65 Q65,80 60,92" />
            <path d="M38,63 Q25,75 32,88" />
            <path d="M62,63 Q75,75 68,88" />
          </svg>
        );
      case "angler":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-28 h-28 text-sonar-cyan">
            <path d="M15,50 C15,25 70,20 82,45 C85,48 80,62 75,66 C60,75 20,70 15,50 Z" />
            <path d="M45,50 L48,54 L52,50 L56,56 L60,50 L64,56 L68,52 L70,60 M45,60 L50,56 L55,60 L60,55 L65,60 Z" />
            <path d="M82,45 C88,38 92,35 88,50 C92,65 88,60 82,53 Z" />
            <path d="M45,34 C40,20 25,20 28,32" />
            <circle cx="28" cy="32" r="3.5" fill="currentColor" className="text-sonar-cyan animate-ping" />
          </svg>
        );
      case "skeleton":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-28 h-28 text-sonar-cyan">
            <path d="M15,50 L85,50" strokeWidth="2.5" />
            <path d="M25,50 Q25,25 35,25 M25,50 Q25,75 35,75" />
            <path d="M37,50 Q37,22 47,22 M37,50 Q37,78 47,78" />
            <path d="M49,50 Q49,20 59,20 M49,50 Q49,80 59,80" />
            <path d="M61,50 Q61,22 71,22 M61,50 Q61,78 71,78" />
            <path d="M73,50 Q73,25 81,25 M73,50 Q73,75 81,75" />
            <path d="M85,45 C88,40 92,40 90,50 C92,60 88,60 85,55 Z" />
          </svg>
        );
      case "titanic":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-28 h-28 text-sonar-cyan">
            <rect x="15" y="20" width="70" height="60" rx="8" />
            <circle cx="50" cy="50" r="16" strokeWidth="2" />
            <circle cx="50" cy="50" r="10" />
            {/* Rivets */}
            <circle cx="25" cy="30" r="1.5" fill="currentColor" />
            <circle cx="75" cy="30" r="1.5" fill="currentColor" />
            <circle cx="25" cy="70" r="1.5" fill="currentColor" />
            <circle cx="75" cy="70" r="1.5" fill="currentColor" />
            {/* Hanging rusticles */}
            <path d="M22,78 L22,86 M28,78 L28,82 M40,78 L40,84 M65,78 L65,88 M78,78 L78,83" />
          </svg>
        );
      case "smoker":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-28 h-28 text-sonar-cyan">
            <path d="M25,90 L38,40 L48,40 L42,90 Z" />
            <path d="M50,90 L56,55 L62,55 L58,90 Z" />
            <path d="M60,90 L70,30 L80,30 L72,90 Z" />
            {/* Vent smoke */}
            <path d="M68,30 Q63,15 70,0 Q78,10 76,30 Z" opacity="0.25" fill="currentColor" className="animate-pulse" />
            <path d="M38,40 Q33,25 40,5 Q48,20 46,40 Z" opacity="0.25" fill="currentColor" className="animate-pulse" />
          </svg>
        );
      case "probe":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-28 h-28 text-sonar-cyan">
            <path d="M30,70 L70,70 L60,45 L40,45 Z" />
            <circle cx="50" cy="58" r="8" />
            {/* Landing legs */}
            <path d="M35,70 L25,88 M65,70 L75,88" strokeWidth="2" />
            <path d="M20,88 L30,88 M70,88 L80,88" strokeWidth="3" />
            {/* Sensor array */}
            <path d="M50,45 L50,25 M45,35 L55,35" />
            <circle cx="50" cy="22" r="3" fill="currentColor" />
          </svg>
        );
      case "egg":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-28 h-28 text-sonar-cyan">
            <ellipse cx="50" cy="50" rx="25" ry="32" strokeDasharray="3 3" />
            {/* Inner nucleus */}
            <ellipse cx="50" cy="50" rx="16" ry="22" className="text-sonar-cyan/40" />
            <circle cx="50" cy="50" r="7" fill="currentColor" className="text-sonar-cyan animate-pulse" />
          </svg>
        );
      case "fossil":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-28 h-28 text-sonar-cyan">
            <path d="M50,50 C50,50 48,38 35,42 C22,46 25,62 38,68 C51,74 72,62 75,45 C78,28 62,15 45,15 C28,15 15,32 18,52 C21,72 40,85 60,85 C80,85 90,65 88,48" />
            <path d="M42,50 C40,44 46,40 50,42" />
          </svg>
        );
      default:
        return <Anchor className="w-16 h-16 text-sonar-cyan" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.72)_100%)] select-none font-mono pointer-events-auto">
      
      {/* Cinematic spring scale modal box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 180 }}
        className="relative w-full max-w-lg bg-[#010910]/85 border border-white/10 p-6 md:p-8 flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.85)]"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-sonar-cyan hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 pointer-events-auto cursor-none"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* HOLOGRAPHIC SCANNER DISPLAY BOX */}
        <div className="relative w-full h-44 bg-black/50 border border-white/5 overflow-hidden flex items-center justify-center mb-6 mt-2">
          {/* Scanner Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:14px_14px]" />
          
          {/* Circular Hologram Ring */}
          <div className="absolute w-36 h-36 border border-sonar-cyan/5 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-32 h-32 border border-dashed border-sonar-cyan/10 rounded-full animate-[spin_10s_linear_infinite_reverse]" />

          {/* Scanner Line Overlay */}
          <div className="absolute inset-x-0 h-[1.5px] bg-sonar-cyan/35 shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-line-scan z-10 pointer-events-none" />

          {/* Vector Illustration */}
          <div className="relative z-10 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(0,240,255,0.35)] animate-float-tilt">
            {renderIllustration()}
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* ANOMALY HEADER INFO */}
        <div className="text-center w-full flex flex-col items-center">
          {/* Rarity Status Badge */}
          <span className={`text-[9px] font-bold tracking-[0.25em] px-3.5 py-1 uppercase border rounded-none mb-2.5 ${rarityColors[discovery.rarity]}`}>
            {discovery.rarity}
          </span>
          
          <h2 className="font-display font-medium text-2xl text-white tracking-wider uppercase mt-1">
            {discovery.name}
          </h2>
          
          <span className="text-[10px] italic text-sonar-cyan/60 tracking-wider font-sans mt-0.5">
            {discovery.scientificName}
          </span>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* TELEMETRY MATRIX GRID */}
        <div className="grid grid-cols-3 w-full border-t border-b border-white/5 py-4 my-5 text-center gap-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] text-white/30 uppercase tracking-wider">Depth</span>
            <span className="text-sm font-semibold text-white">
              {depth}m
            </span>
          </div>
          <div className="flex flex-col gap-0.5 border-l border-r border-white/5">
            <span className="text-[8px] text-white/30 uppercase tracking-wider">Pressure</span>
            <span className="text-sm font-semibold text-sonar-cyan">
              {pressure} ATM
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] text-white/30 uppercase tracking-wider">Temp</span>
            <span className="text-sm font-semibold text-white">
              {temp.toFixed(1)}°C
            </span>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SCIENTIFIC DESCRIPTION */}
        <p className="text-[10px] md:text-[11px] font-light text-slate-300/80 tracking-widest leading-relaxed text-center font-sans max-w-sm uppercase">
          {discovery.description}
        </p>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* DISABLED POSEIDON BUTTON */}
        <button
          disabled
          className="w-full mt-6 py-4 border border-white/10 bg-white/5 text-white/50 cursor-not-allowed relative group overflow-hidden select-none font-display tracking-[0.2em] text-xs font-semibold transform-gpu focus:outline-none"
        >
          {/* Border focus flash */}
          <div className="absolute inset-0 border border-sonar-cyan/0 group-hover:border-sonar-cyan/35 transition-all duration-300 pointer-events-none" />
          
          {/* Reflective light sweep shine */}
          <div className="absolute inset-y-0 left-[-100%] w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-800 ease-in-out pointer-events-none" />

          <div className="flex flex-col items-center gap-0.5 relative z-10">
            <div className="flex items-center gap-1.5 justify-center">
              <Cpu className="w-3.5 h-3.5 text-white/30 group-hover:text-sonar-cyan/70 transition-colors duration-300" />
              <span className="text-[11px] font-bold tracking-[0.25em] text-white/40 group-hover:text-sonar-cyan/80 transition-colors duration-300">
                POSEIDON AI
              </span>
            </div>
            <span className="text-[7.5px] font-mono text-white/20 tracking-widest uppercase">
              Available in Phase 4
            </span>
          </div>
        </button>

      </motion.div>
    </div>
  );
}
