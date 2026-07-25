"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getZoneFromDepth, calculateDepthFromProgress, OCEAN_ZONES, OceanZoneName } from "@/lib/oceanUtils";

export default function ZoneTransitionOverlay() {
  const [activeZone, setActiveZone] = useState<OceanZoneName>("Surface");
  const [announcementZone, setAnnouncementZone] = useState<{
    name: OceanZoneName;
    range: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

      const depth = calculateDepthFromProgress(progress);
      const newZone = getZoneFromDepth(depth);

      if (newZone !== activeZone) {
        setActiveZone(newZone);
        
        const zoneInfo = OCEAN_ZONES.find((z) => z.name === newZone);
        if (zoneInfo) {
          setAnnouncementZone({
            name: zoneInfo.name,
            range: zoneInfo.depthRange,
            description: zoneInfo.description,
          });

          const timer = setTimeout(() => {
            setAnnouncementZone(null);
          }, 3500);

          return () => clearTimeout(timer);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeZone]);

  return (
    <AnimatePresence>
      {announcementZone && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="fixed top-0 left-0 right-0 z-40 pointer-events-none flex flex-col items-center select-none"
        >
          {/* Subtle Glowing Scanline Divider Line */}
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-sonar-cyan to-transparent shadow-[0_0_15px_rgba(0,240,255,0.9)] animate-pulse" />

          {/* Top Banner Tag */}
          <div className="mt-3 px-6 py-2 bg-black/90 border border-sonar-cyan/40 backdrop-blur-xl text-center flex items-center gap-3 shadow-[0_0_30px_rgba(0,240,255,0.25)]">
            <span className="w-2 h-2 rounded-full bg-sonar-cyan animate-ping" />
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-white/50 text-[10px] tracking-widest uppercase">ZONE_BOUNDARY:</span>
              <span className="text-sonar-cyan font-bold tracking-wider uppercase">{announcementZone.name}</span>
              <span className="text-white/30">•</span>
              <span className="text-white/80 font-semibold">{announcementZone.range}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
