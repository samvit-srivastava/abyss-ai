"use client";

import React, { useEffect, useRef } from "react";

export default function DepthHUD() {
  const depthRef = useRef<HTMLSpanElement | null>(null);
  const pressureRef = useRef<HTMLSpanElement | null>(null);
  const tempRef = useRef<HTMLSpanElement | null>(null);
  const zoneRef = useRef<HTMLSpanElement | null>(null);
  const gaugeCursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

      // Calculate depth (0m to 11000m)
      const depth = Math.round(progress * 11000);

      // Calculate pressure (1 ATM + 1 ATM per 10m of depth)
      const pressure = Math.round(1 + depth / 10);

      // Calculate temperature piecewise linear interpolation
      let temp = 20.0;
      if (depth < 200) {
        temp = 20.0 - (depth / 200) * 4.0; // 20C to 16C
      } else if (depth < 1000) {
        temp = 16.0 - ((depth - 200) / 800) * 11.0; // 16C to 5C
      } else if (depth < 4000) {
        temp = 5.0 - ((depth - 1000) / 3000) * 2.5; // 5C to 2.5C
      } else if (depth < 6000) {
        temp = 2.5 - ((depth - 4000) / 2000) * 1.1; // 2.5C to 1.4C
      } else {
        temp = 1.4 - ((depth - 6000) / 5000) * 0.3; // 1.4C to 1.1C
      }

      // Determine active zone
      let zoneName = "Surface";
      if (depth === 0) {
        zoneName = "Surface";
      } else if (depth <= 200) {
        zoneName = "Sunlight Zone";
      } else if (depth <= 1000) {
        zoneName = "Twilight Zone";
      } else if (depth <= 4000) {
        zoneName = "Midnight Zone";
      } else if (depth <= 6000) {
        zoneName = "Abyssal Zone";
      } else {
        zoneName = "Hadal Zone";
      }

      // Update DOM values directly (bypassing React re-render cycle for 60 FPS)
      if (depthRef.current) depthRef.current.innerText = `${depth.toLocaleString()}m`;
      if (pressureRef.current) pressureRef.current.innerText = `${pressure.toLocaleString()} ATM`;
      if (tempRef.current) tempRef.current.innerText = `${temp.toFixed(1)}°C`;
      if (zoneRef.current) zoneRef.current.innerText = zoneName.toUpperCase();
      
      // Update vertical progress gauge indicator cursor (top offset 0% to 100%)
      if (gaugeCursorRef.current) {
        gaugeCursorRef.current.style.top = `${progress * 100}%`;
      }
    };

    // Run once on load to initialize HUD metrics
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-24 right-8 z-30 w-52 pointer-events-none flex flex-col gap-4 font-mono select-none">
      {/* HUD Panel Box */}
      <div className="border border-sonar-cyan/15 bg-black/45 backdrop-blur-md p-4 text-left shadow-[0_0_20px_rgba(0,3,5,0.6)]">
        
        {/* Header scan line */}
        <div className="flex items-center justify-between border-b border-sonar-cyan/15 pb-2 mb-3">
          <span className="text-[9px] tracking-[0.2em] text-sonar-cyan/50 uppercase font-semibold">
            Sub_Telemetry
          </span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sonar-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sonar-cyan"></span>
          </span>
        </div>

        {/* HUD Data rows */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-[8px] tracking-wider text-white/35 uppercase">Depth</span>
            <span ref={depthRef} className="text-lg font-bold text-white tracking-wide">
              0m
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] tracking-wider text-white/35 uppercase">Pressure</span>
            <span ref={pressureRef} className="text-sm font-semibold text-sonar-cyan/90">
              1 ATM
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] tracking-wider text-white/35 uppercase">Water_Temp</span>
            <span ref={tempRef} className="text-sm font-semibold text-white/90">
              20.0°C
            </span>
          </div>

          <div className="flex flex-col border-t border-white/5 pt-2 mt-1">
            <span className="text-[8px] tracking-wider text-white/35 uppercase">Current_Zone</span>
            <span ref={zoneRef} className="text-xs font-bold text-sonar-cyan tracking-wider mt-0.5">
              SURFACE
            </span>
          </div>
        </div>
      </div>

      {/* Vertical Depth Scale Gauge (Minimap Scrollbar) */}
      <div className="self-end mr-2 flex items-center gap-2.5 h-36">
        {/* Gauge Ticks */}
        <div className="flex flex-col justify-between h-full text-[8px] text-white/20 text-right pr-1 select-none">
          <span>0m</span>
          <span>4k</span>
          <span>8k</span>
          <span>11k</span>
        </div>
        
        {/* Gauge Track */}
        <div className="relative w-[3px] h-full bg-white/10 rounded-full overflow-visible">
          {/* Vertical progress highlight */}
          <div className="absolute top-0 left-0 w-full bg-sonar-cyan/20 rounded-full" style={{ height: "100%" }} />
          
          {/* Floating Indicator cursor */}
          <div
            ref={gaugeCursorRef}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sonar-cyan shadow-[0_0_8px_rgba(0,240,255,1)] transition-all duration-75"
            style={{ top: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
