interface Props {
  imageUrl: string | null;
  prompt: string;
  generatedAt: Date | null;
  onReset: () => void;
  onDownload: () => void;
}

export default function ResultDisplay({
  imageUrl,
  prompt,
  generatedAt,
  onReset,
  onDownload,
}: Props) {
  if (!imageUrl) return null;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center border border-cyber-cyan/30 bg-cyber-dark-3/80 relative p-6">
      {/* Corners brackets */}
      <span className="corner-bracket corner-bracket--tl" aria-hidden="true" />
      <span className="corner-bracket corner-bracket--tr" aria-hidden="true" />
      <span className="corner-bracket corner-bracket--bl" aria-hidden="true" />
      <span className="corner-bracket corner-bracket--br" aria-hidden="true" />

      {/* Image frame */}
      <div className="relative w-full aspect-square border border-cyber-border/20 overflow-hidden mb-4">
        <img
          src={imageUrl}
          alt={prompt}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-cyber-dark/80 border border-cyber-cyan/30 px-2 py-1 font-mono text-[9px] text-cyber-cyan">
          ✦ LIVE GENERATED
        </div>
      </div>

      {/* Info & Prompt */}
      <div className="w-full text-left font-mono mb-6">
        <p className="text-[10px] text-cyber-text-secondary uppercase tracking-wider mb-1">
          Prompt:
        </p>
        <p className="text-xs text-cyber-text-primary bg-cyber-dark/50 p-2 border border-cyber-border/10 max-h-16 overflow-y-auto">
          {prompt}
        </p>
        {generatedAt && (
          <p className="text-[9px] text-cyber-text-dim/60 mt-2 text-right">
            Generated: {generatedAt.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 w-full justify-between">
        <button
          onClick={onDownload}
          className="flex-1 font-mono text-xs tracking-wider px-4 py-2 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 transition-all duration-300 cursor-none"
        >
          Download
        </button>
        <button
          onClick={onReset}
          className="flex-1 font-mono text-xs tracking-wider px-4 py-2 border border-cyber-text-dim/20 text-cyber-text-secondary hover:text-cyber-text-primary hover:border-cyber-text-secondary/40 transition-all duration-300 cursor-none"
        >
          Generate Another
        </button>
      </div>
    </div>
  );
}
