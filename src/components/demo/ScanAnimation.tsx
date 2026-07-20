import { useEffect, useState } from "react";

interface Props {
  isVisible: boolean;
  message?: string;
}

export default function ScanAnimation({
  isVisible,
  message = "GÉNÉRATION EN COURS...",
}: Props) {
  const [fakeProgress, setFakeProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setFakeProgress((prev) => {
        if (prev >= 98) return prev;
        const randStep = Math.floor(Math.random() * 8) + 2;
        return Math.min(prev + randStep, 98);
      });
    }, 400);

    return () => clearInterval(timer);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-lg mx-auto aspect-square flex flex-col items-center justify-center bg-cyber-dark-2 border border-cyber-cyan/20 relative overflow-hidden">
      {/* Scanline */}
      <div className="absolute inset-x-0 h-1 bg-cyber-cyan/50 shadow-cyan-sm animate-scan-line" />

      {/* Hex grid pattern placeholder in CSS */}
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-10" />

      {/* Corners brackets */}
      <span className="corner-bracket corner-bracket--tl" aria-hidden="true" />
      <span className="corner-bracket corner-bracket--tr" aria-hidden="true" />
      <span className="corner-bracket corner-bracket--bl" aria-hidden="true" />
      <span className="corner-bracket corner-bracket--br" aria-hidden="true" />

      <div className="z-10 text-center px-4">
        <div className="text-4xl mb-4 text-cyber-cyan animate-pulse">✦</div>
        <p className="font-mono text-xs tracking-widest text-cyber-cyan mb-2">
          {message}
        </p>
        <p className="font-mono text-mono-xs text-cyber-text-secondary">
          Rendering: {fakeProgress}%
        </p>

        {/* Loading progress bar */}
        <div className="w-48 h-1 bg-cyber-dark-3 border border-cyber-cyan/10 mt-4 mx-auto overflow-hidden">
          <div
            className="h-full bg-cyber-cyan shadow-cyan-sm transition-all duration-300"
            style={{ width: `${fakeProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
