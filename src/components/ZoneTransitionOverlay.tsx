"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Zone {
  id: string;
  name: string;
  min: number;
  max: number;
  desc: string;
  tagline: string;
}

const ZONES: Zone[] = [
  {
    id: "surface",
    name: "Surface",
    min: 0,
    max: 0,
    desc: "SYS_CALIBRATION: COMPLETE",
    tagline: "Atmospheric pressure equalized. Expedition launch confirmed."
  },
  {
    id: "sunlight",
    name: "Sunlight Zone",
    min: 1,
    max: 200,
    desc: "EPIPELAGIC ZONE // 0m - 200m",
    tagline: "Warm waters, sunlit depths. The final boundary of solar warmth."
  },
  {
    id: "twilight",
    name: "Twilight Zone",
    min: 201,
    max: 1000,
    desc: "MESOPELAGIC ZONE // 200m - 1000m",
    tagline: "Light fades rapidly. Pressure mounts. The shadow world begins."
  },
  {
    id: "midnight",
    name: "Midnight Zone",
    min: 1001,
    max: 4000,
    desc: "BATHYPELAGIC ZONE // 1000m - 4000m",
    tagline: "Perpetual darkness. Only bioluminescence remains."
  },
  {
    id: "abyssal",
    name: "Abyssal Zone",
    min: 4001,
    max: 6000,
    desc: "ABYSSOPELAGIC ZONE // 4000m - 6000m",
    tagline: "Near-freezing temperatures. Tremendous hydrostatic pressure."
  },
  {
    id: "hadal",
    name: "Hadal Zone",
    min: 6001,
    max: 11000,
    desc: "HADOPELAGIC ZONE // 6000m - 11000m",
    tagline: "The absolute deep. Silent trenches. The boundary of the unexplored."
  }
];

const getZone = (depth: number): Zone => {
  if (depth === 0) return ZONES[0];
  if (depth <= 200) return ZONES[1];
  if (depth <= 1000) return ZONES[2];
  if (depth <= 4000) return ZONES[3];
  if (depth <= 6000) return ZONES[4];
  return ZONES[5];
};

export default function ZoneTransitionOverlay() {
  const [activeOverlayZone, setActiveOverlayZone] = useState<Zone | null>(null);
  
  const currentZoneIdRef = useRef<string>("surface");
  const isFirstMountRef = useRef<boolean>(true);
  const triggerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTriggerTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
      const depth = Math.round(progress * 11000);
      const currentZone = getZone(depth);

      // Initialize on first mount without popping overlay
      if (isFirstMountRef.current) {
        currentZoneIdRef.current = currentZone.id;
        isFirstMountRef.current = false;
        return;
      }

      // Check if we crossed a zone boundary
      if (currentZone.id !== currentZoneIdRef.current) {
        const now = Date.now();
        // Rate-limit transitions (min 4.5 seconds between new overlays to prevent border scroll-spamming)
        if (now - lastTriggerTimeRef.current > 4500) {
          currentZoneIdRef.current = currentZone.id;
          lastTriggerTimeRef.current = now;
          
          // Clear any pending fade-out timeout
          if (triggerTimeoutRef.current) {
            clearTimeout(triggerTimeoutRef.current);
          }

          // Trigger overlay display
          setActiveOverlayZone(currentZone);

          // Auto fade-out after 1.8 seconds (Overlay duration: 1.5 - 2.0 seconds)
          triggerTimeoutRef.current = setTimeout(() => {
            setActiveOverlayZone(null);
          }, 1800);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (triggerTimeoutRef.current) clearTimeout(triggerTimeoutRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none select-none">
      <AnimatePresence>
        {activeOverlayZone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} // smooth cinematic easing
            className="flex flex-col items-center justify-center p-8 bg-black/20 backdrop-blur-[3px] border border-white/5 rounded-none max-w-xl text-center pointer-events-none"
          >
            {/* Telemetry descriptor code */}
            <span className="text-[9px] font-mono tracking-[0.25em] text-sonar-cyan opacity-80 uppercase font-semibold">
              {activeOverlayZone.desc}
            </span>

            {/* Glowing Main Zone Name */}
            <h2 className="font-display font-medium text-3xl md:text-4xl text-white tracking-[0.18em] uppercase mt-2 drop-shadow-[0_0_15px_rgba(0,240,255,0.35)]">
              {activeOverlayZone.name}
            </h2>

            {/* Shimmer separator bar */}
            <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-sonar-cyan/40 to-transparent my-4" />

            {/* Cinematic tagline description */}
            <p className="font-sans text-[11px] font-light text-slate-300/90 tracking-widest leading-relaxed uppercase max-w-sm">
              {activeOverlayZone.tagline}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
