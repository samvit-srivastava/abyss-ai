"use client";

import React, { useEffect, useRef } from "react";
import {
  calculateDepthFromProgress,
  calculatePressureFromDepth,
  calculateTemperatureFromDepth,
  getZoneFromDepth,
} from "@/lib/oceanUtils";

export default function DepthHUD() {
  const depthRef = useRef<HTMLSpanElement | null>(null);
  const pressureRef = useRef<HTMLSpanElement | null>(null);
  const tempRef = useRef<HTMLSpanElement | null>(null);
  const zoneRef = useRef<HTMLSpanElement | null>(null);
  const gaugeFillRef = useRef<HTMLDivElement | null>(null);
  const gaugeCursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

      const depth = calculateDepthFromProgress(progress);
      const pressure = calculatePressureFromDepth(depth);
      const temp = calculateTemperatureFromDepth(depth);
      const zoneName = getZoneFromDepth(depth);

      if (depthRef.current) depthRef.current.innerText = `${depth.toLocaleString()}m`;
      if (pressureRef.current) pressureRef.current.innerText = `${pressure.toLocaleString()} ATM`;
      if (tempRef.current) tempRef.current.innerText = `${temp.toFixed(1)}°C`;
      if (zoneRef.current) zoneRef.current.innerText = zoneName.toUpperCase();
      
      const fillPercentage = `${(progress * 100).toFixed(1)}%`;
      if (gaugeFillRef.current) {
        gaugeFillRef.current.style.height = fillPercentage;
      }
      if (gaugeCursorRef.current) {
        gaugeCursorRef.current.style.top = fillPercentage;
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-16 md:top-20 right-4 md:right-8 z-30 w-40 md:w-48 pointer-events-none flex flex-col gap-3 font-mono select-none">
      <div className="border border-white/10 bg-black/40 backdrop-blur-xl p-3.5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <span className="text-[9px] tracking-[0.25em] text-white/40 uppercase font-medium">
            TELEMETRY
          </span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sonar-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sonar-cyan"></span>
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="text-[7.5px] tracking-[0.2em] text-white/30 uppercase">DEPTH</span>
            <span ref={depthRef} className="text-sm md:text-base font-semibold text-white tracking-wider">
              0m
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[7.5px] tracking-[0.2em] text-white/30 uppercase">PRESSURE</span>
            <span ref={pressureRef} className="text-xs font-medium text-sonar-cyan/90">
              1 ATM
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[7.5px] tracking-[0.2em] text-white/30 uppercase">WATER TEMP</span>
            <span ref={tempRef} className="text-xs font-medium text-white/70">
              20.0°C
            </span>
          </div>

          <div className="flex flex-col border-t border-white/10 pt-2 mt-1">
            <span className="text-[7.5px] tracking-[0.2em] text-white/30 uppercase">ZONE</span>
            <span ref={zoneRef} className="text-[11px] font-semibold text-sonar-cyan tracking-wider mt-0.5">
              SURFACE
            </span>
          </div>
        </div>
      </div>

      <div className="self-end mr-1 flex items-center gap-2 h-28 md:h-32">
        <div className="flex flex-col justify-between h-full text-[7.5px] font-mono text-white/20 text-right select-none tracking-widest">
          <span>0m</span>
          <span>200m</span>
          <span>1k</span>
          <span>4k</span>
          <span>6k</span>
          <span>11k</span>
        </div>
        
        <div className="relative w-[2px] h-full bg-white/10 overflow-visible">
          {/* Fill */}
          <div
            ref={gaugeFillRef}
            className="absolute top-0 left-0 w-full bg-sonar-cyan/50 transition-all duration-75"
            style={{ height: "0%" }}
          />
          
          {/* Indicator */}
          <div
            ref={gaugeCursorRef}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sonar-cyan shadow-[0_0_10px_rgba(0,240,255,1)] transition-all duration-75"
            style={{ top: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
