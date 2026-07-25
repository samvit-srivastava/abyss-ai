"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Anchor, Compass, Cpu } from "lucide-react";
import { Discovery } from "@/data/discoveries";

interface DiscoveryNodeProps {
  discovery: Discovery;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

export default function DiscoveryNode({ discovery, onHoverStart, onHoverEnd, onClick }: DiscoveryNodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Map symbols to unique high-performance CSS animations (configured in globals.css)
  const getAnimationClass = () => {
    switch (discovery.symbol) {
      case "squid":
        return "animate-swim-squid";
      case "coral":
      case "smoker":
        return "animate-sway-vent";
      case "drone":
      case "probe":
      case "egg":
        return "animate-float-drone";
      case "amphora":
      case "anchor":
      case "skeleton":
      case "titanic":
      case "fossil":
      default:
        return "animate-float-tilt";
    }
  };

  // Simplified custom inline vector icon outlines for the anomalies hotspots
  const renderIcon = () => {
    const symbol = discovery.symbol;
    switch (symbol) {
      case "amphora":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
            <path d="M40,25 C40,20 42,18 50,18 C58,18 60,20 60,25" />
            <path d="M30,30 L70,30 M42,30 L38,42 Q30,65 30,78 Q30,88 50,88 Q70,88 70,78 Q70,65 62,42 L58,30" />
          </svg>
        );
      case "coral":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
            <path d="M50,85 L50,60 M50,68 C40,63 38,55 35,50 M50,60 C60,55 62,45 65,40 M65,40 C62,40 58,35 55,35 M50,75 C40,73 30,65 30,58" />
          </svg>
        );
      case "anchor":
        return <Anchor className="w-10 h-10" />;
      case "drone":
        return <Cpu className="w-10 h-10" />;
      case "squid":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
            <path d="M50,18 C40,28 35,45 42,60 Q50,68 58,60 C65,45 60,28 50,18 Z" />
            <path d="M42,60 Q35,78 38,90 M46,62 Q45,80 48,92 M54,62 Q55,80 52,92 M58,60 Q65,78 62,90" />
          </svg>
        );
      case "angler":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
            <path d="M15,50 C15,28 68,22 80,45 C82,48 78,58 72,62 C55,70 20,68 15,50 Z" />
            <path d="M45,50 L48,54 L52,50 L56,56 L60,50" />
            <path d="M35,22 C30,10 15,10 18,22" />
            <circle cx="18" cy="22" r="2.5" fill="currentColor" className="text-sonar-cyan" />
          </svg>
        );
      case "skeleton":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
            <path d="M20,50 L80,50" strokeWidth="3" />
            <path d="M30,50 Q30,30 40,30 M30,50 Q30,70 40,70 M45,50 Q45,28 55,28 M45,50 Q45,72 55,72" />
          </svg>
        );
      case "titanic":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
            <rect x="20" y="25" width="60" height="50" rx="4" />
            <circle cx="50" cy="50" r="12" />
            <path d="M25,75 L25,82 M75,75 L75,82" />
          </svg>
        );
      case "smoker":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
            <path d="M30,85 L40,45 L48,45 L42,85 Z M55,85 L65,35 L75,35 L67,85 Z" />
          </svg>
        );
      case "probe":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
            <path d="M30,68 L70,68 L60,45 L40,45 Z M50,45 L50,22" />
            <circle cx="50" cy="20" r="2" fill="currentColor" />
          </svg>
        );
      case "egg":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
            <ellipse cx="50" cy="50" rx="20" ry="28" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="6" fill="currentColor" className="text-sonar-cyan" />
          </svg>
        );
      case "fossil":
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
            <path d="M50,50 C50,50 48,38 35,42 C22,46 25,62 38,68 C51,74 72,62 75,45 C78,28 62,15 45,15" />
          </svg>
        );
      default:
        return <Compass className="w-10 h-10" />;
    }
  };

  // Convert depth to scroll container positioning (total height is 1200vh)
  const verticalOffsetPercent = (discovery.targetDepth / 11000) * 100;

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.5,
        filter: "blur(24px) brightness(0.1)",
        rotate: -12,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px) brightness(1)",
        rotate: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.7,
        filter: "blur(12px) brightness(0.2)",
        rotate: 6,
      }}
      transition={{
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1], // smooth custom easing
      }}
      style={{
        top: `${verticalOffsetPercent}%`,
        left: `${discovery.xPercent}%`,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="absolute z-20 pointer-events-auto cursor-none group"
    >
      <motion.div
        onHoverStart={() => {
          setIsHovered(true);
          onHoverStart();
        }}
        onHoverEnd={() => {
          setIsHovered(false);
          onHoverEnd();
        }}
        onClick={onClick}
        whileHover={{
          y: -10,
          scale: 1.06,
          transition: { type: "spring", stiffness: 220, damping: 15 }
        }}
        className={`relative flex items-center justify-center p-6 border border-sonar-cyan/25 bg-black/60 hover:bg-black/90 hover:border-sonar-cyan text-sonar-cyan/70 hover:text-sonar-cyan rounded-none transition-colors duration-350 shadow-[0_0_22px_rgba(0,240,255,0.12)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] ${getAnimationClass()}`}
      >
        
        {/* Floating Bubble micro-particles (Always present in soft state, bursts on hover!) */}
        <div className="absolute inset-0 overflow-visible pointer-events-none">
          <span className={`absolute bottom-full left-1/4 w-1 h-1 bg-sonar-cyan/40 rounded-full animate-[ping_1.2s_ease-out_infinite] transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-25"}`} />
          <span className={`absolute bottom-full left-1/2 w-1.5 h-1.5 bg-sonar-cyan/30 rounded-full animate-[ping_1.6s_ease-out_infinite] delay-200 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-20"}`} />
          <span className={`absolute bottom-full right-1/4 w-1.5 h-1.5 bg-sonar-cyan/50 rounded-full animate-[ping_1.0s_ease-out_infinite] delay-500 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-25"}`} />
          {isHovered && (
            <>
              <span className="absolute bottom-full left-1/3 w-2 h-2 bg-sonar-cyan/40 rounded-full animate-[ping_1.4s_ease-out_infinite] delay-300" />
              <span className="absolute bottom-full right-1/3 w-1 h-1 bg-sonar-cyan/65 rounded-full animate-[ping_0.9s_ease-out_infinite] delay-100" />
            </>
          )}
        </div>

        {/* Dynamic Sonar hotspot expanding concentric rings */}
        <span className="absolute inset-0 border border-sonar-cyan/35 rounded-none animate-[ping_2.5s_ease-out_infinite] pointer-events-none" />
        <span className="absolute inset-0 border border-sonar-cyan/15 rounded-none animate-[ping_3.8s_ease-out_infinite_delay-1000] pointer-events-none" />
        {isHovered && (
          <span className="absolute inset-[-8px] border border-sonar-cyan/35 rounded-none animate-[ping_1.5s_ease-out_infinite_reverse] pointer-events-none" />
        )}

        {/* Vector SVG Icon */}
        <div className="relative z-10 select-none">
          {renderIcon()}
        </div>

        {/* Small Depth Tag overlay */}
        <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none font-mono text-[8px] bg-black/85 px-1.5 py-0.5 border border-sonar-cyan/25 text-sonar-cyan whitespace-nowrap tracking-widest uppercase shadow-[0_0_10px_rgba(0,240,255,0.2)]">
          {discovery.targetDepth}m
        </div>
      </motion.div>
    </motion.div>
  );
}
