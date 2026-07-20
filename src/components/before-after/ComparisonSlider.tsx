import { useState, useRef, MouseEvent, TouchEvent } from "react";
import type { ComparisonPair } from "~/types";

interface Props {
  pairs: ComparisonPair[];
}

export default function ComparisonSlider({ pairs }: Props) {
  const [currentIndex, setCurrentPairIndex] = useState(0);
  const [position, setPosition] = useState(50); // 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePair = pairs[currentIndex];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* 5 Tabs selector */}
      <div className="flex flex-wrap gap-2 justify-center" data-gsap="ba-tabs">
        {pairs.map((pair, idx) => (
          <button
            key={pair.id}
            onClick={() => {
              setCurrentPairIndex(idx);
              setPosition(50);
            }}
            className={`font-mono text-mono-xs px-3 py-2 border transition-all duration-300 cursor-none ${
              currentIndex === idx
                ? "border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan shadow-cyan-sm"
                : "border-cyber-border/20 text-cyber-text-secondary hover:border-cyber-cyan/40 hover:text-cyber-cyan"
            }`}
          >
            {pair.beforeLabel} vs {pair.afterLabel}
          </button>
        ))}
      </div>

      {/* Main Slider Display Area */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[16/10] border border-cyber-border/40 select-none overflow-hidden rounded-sm"
        data-cursor-hover="true"
      >
        {/* Placeholder background colored block instead of real image if missing */}
        <div className="absolute inset-0 bg-cyber-dark-2 flex items-center justify-center text-cyber-text-dim text-xs select-none">
          NV // {activePair.afterLabel} Comparison
        </div>

        {/* IMAGE BEFORE (Left / Full behind) */}
        <div className="absolute inset-0 w-full h-full bg-cyber-dark-2">
          <img
            src={activePair.beforeSrc}
            alt={activePair.beforeLabel}
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          {/* Label Before */}
          <span className="absolute bottom-4 left-4 bg-cyber-dark/80 border border-cyber-border/30 px-3 py-1 font-mono text-[10px] text-cyber-text-secondary z-20">
            {activePair.beforeLabel}
          </span>
        </div>

        {/* IMAGE AFTER (Right / Overlay clipped) */}
        <div
          className="absolute inset-y-0 left-0 h-full overflow-hidden pointer-events-none bg-cyber-dark-3"
          style={{ width: `${position}%` }}
        >
          <div
            className="absolute inset-y-0 left-0 w-[896px] max-w-4xl h-full aspect-[16/10]"
            style={{ width: containerRef.current?.clientWidth }}
          >
            <img
              src={activePair.afterSrc}
              alt={activePair.afterLabel}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          {/* Label After */}
          <span className="absolute bottom-4 right-4 bg-cyber-cyan/15 border border-cyber-cyan/30 px-3 py-1 font-mono text-[10px] text-cyber-cyan z-20 pointer-events-auto">
            {activePair.afterLabel}
          </span>
        </div>

        {/* Slider line separator */}
        <div
          className="absolute inset-y-0 w-0.5 bg-cyber-cyan shadow-cyan-sm cursor-none z-30"
          style={{ left: `${position}%` }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-cyber-cyan bg-cyber-dark-2/90 flex items-center justify-center text-cyber-cyan shadow-cyan-sm">
            ↔
          </div>
        </div>
      </div>

      {/* Comparison Explanations */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 font-mono text-xs leading-relaxed"
        data-gsap="ba-info"
      >
        <div className="bg-cyber-dark-3/40 border border-cyber-border/10 p-4">
          <p className="text-cyber-text-secondary font-bold mb-1 uppercase tracking-wider">
            &mdash; Before: {activePair.beforeLabel}
          </p>
          <p className="text-cyber-text-dim">{activePair.beforeDescription}</p>
        </div>
        <div className="bg-cyber-cyan/5 border border-cyber-cyan/10 p-4">
          <p className="text-cyber-cyan font-bold mb-1 uppercase tracking-wider">
            &mdash; After: {activePair.afterLabel}
          </p>
          <p className="text-cyber-text-secondary">
            {activePair.afterDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
