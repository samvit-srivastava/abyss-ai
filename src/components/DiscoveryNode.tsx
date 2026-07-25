"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Anchor, Compass, Cpu, Radio, Sparkles } from "lucide-react";
import { Discovery } from "@/data/discoveries";

interface DiscoveryNodeProps {
  discovery: Discovery;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

export default function DiscoveryNode({ discovery, onHoverStart, onHoverEnd, onClick }: DiscoveryNodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const renderIcon = () => {
    const symbol = discovery.symbol;
    switch (symbol) {
      case "amphora":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 md:w-6 md:h-6">
            <path d="M40,25 C40,20 42,18 50,18 C58,18 60,20 60,25" />
            <path d="M30,30 L70,30 M42,30 L38,42 Q30,65 30,78 Q30,88 50,88 Q70,88 70,78 Q70,65 62,42 L58,30" />
          </svg>
        );
      case "coral":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 md:w-6 md:h-6">
            <path d="M50,85 L50,60 M50,68 C40,63 38,55 35,50 M50,60 C60,55 62,45 65,40 M65,40 C62,40 58,35 55,35 M50,75 C40,73 30,65 30,58" />
          </svg>
        );
      case "anchor":
        return <Anchor className="w-5 h-5 md:w-6 md:h-6" />;
      case "drone":
        return <Cpu className="w-5 h-5 md:w-6 md:h-6" />;
      case "squid":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 md:w-6 md:h-6">
            <path d="M50,18 C40,28 35,45 42,60 Q50,68 58,60 C65,45 60,28 50,18 Z" />
            <path d="M42,60 Q35,78 38,90 M46,62 Q45,80 48,92 M54,62 Q55,80 52,92 M58,60 Q65,78 62,90" />
          </svg>
        );
      case "angler":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 md:w-6 md:h-6">
            <path d="M15,50 C15,28 68,22 80,45 C82,48 78,58 72,62 C55,70 20,68 15,50 Z" />
            <path d="M45,50 L48,54 L52,50 L56,56 L60,50" />
            <circle cx="18" cy="22" r="3.5" className="fill-sonar-cyan animate-pulse" />
          </svg>
        );
      case "smoker":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 md:w-6 md:h-6">
            <path d="M35,90 L40,40 L60,40 L65,90 Z" />
            <path d="M40,40 C35,25 45,10 50,5 C55,10 65,25 60,40" strokeDasharray="3 3" />
          </svg>
        );
      case "fossil":
        return <Sparkles className="w-5 h-5 md:w-6 md:h-6" />;
      case "probe":
        return <Radio className="w-5 h-5 md:w-6 md:h-6" />;
      default:
        return <Compass className="w-5 h-5 md:w-6 md:h-6" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        left: `${discovery.xPercent}%`,
        top: `${discovery.yPercent}%`,
      }}
      className="fixed z-30 -translate-x-1/2 -translate-y-1/2 transform-gpu"
      onMouseEnter={() => {
        setIsHovered(true);
        onHoverStart();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverEnd();
      }}
      onClick={onClick}
    >
      <button
        type="button"
        className="group relative flex items-center justify-center focus:outline-none cursor-none"
        aria-label={`Inspect discovery: ${discovery.name}`}
      >
        {/* Sonar Ping Rings */}
        <span className="absolute -inset-3 rounded-full border border-sonar-cyan/40 animate-sonar-ping pointer-events-none" />
        <span className="absolute -inset-6 rounded-full border border-sonar-cyan/20 animate-sonar-ping pointer-events-none" style={{ animationDelay: "1s" }} />

        {/* Node Beacon */}
        <div className={`relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full border transition-all duration-300 backdrop-blur-md ${
          isHovered
            ? "border-sonar-cyan bg-sonar-cyan/25 text-sonar-cyan shadow-[0_0_25px_rgba(0,240,255,0.8)] scale-110"
            : "border-white/20 bg-black/60 text-sonar-cyan/80 shadow-[0_0_12px_rgba(0,240,255,0.2)] hover:border-sonar-cyan/60"
        }`}>
          {renderIcon()}

          {/* Reticle Corner Brackets */}
          <span className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-sonar-cyan/60" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t border-r border-sonar-cyan/60" />
          <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b border-l border-sonar-cyan/60" />
          <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-sonar-cyan/60" />
        </div>

        {/* Tooltip Tag */}
        <div className={`absolute left-full ml-3 px-3 py-1.5 bg-black/80 border backdrop-blur-md whitespace-nowrap transition-all duration-300 pointer-events-none shadow-[0_4px_20px_rgba(0,0,0,0.8)] ${
          isHovered
            ? "border-sonar-cyan opacity-100 translate-x-0"
            : "border-white/10 opacity-75 translate-x-0"
        }`}>
          <div className="flex flex-col text-left font-mono">
            <span className="text-[7px] tracking-[0.25em] text-sonar-cyan/80 uppercase">
              [{discovery.rarity}] // {discovery.targetDepth}M
            </span>
            <span className="text-xs font-display font-medium tracking-wide text-white">
              {discovery.name}
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
