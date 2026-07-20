import type { KeyboardEvent } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
  maxLength?: number;
}

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  disabled,
  maxLength = 280,
}: Props) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative border border-cyber-border/30 bg-cyber-dark-3/60 focus-within:border-cyber-cyan/50 focus-within:shadow-cyan-sm transition-all duration-300 p-4">
        {/* Corners brackets */}
        <span
          className="corner-bracket corner-bracket--tl"
          aria-hidden="true"
        />
        <span
          className="corner-bracket corner-bracket--tr"
          aria-hidden="true"
        />
        <span
          className="corner-bracket corner-bracket--bl"
          aria-hidden="true"
        />
        <span
          className="corner-bracket corner-bracket--br"
          aria-hidden="true"
        />

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="A luxury perfume bottle on volcanic black rock, studio lighting..."
          className="w-full h-24 bg-transparent outline-none border-none resize-none font-mono text-sm text-cyber-text-primary placeholder:text-cyber-text-dim/50 cursor-none scrollbar-cyber"
          maxLength={maxLength}
          disabled={disabled}
        />

        <div className="flex justify-between items-center mt-2 border-t border-cyber-border/10 pt-2">
          <span className="font-mono text-mono-xs text-cyber-text-dim/50">
            {value.length} / {maxLength}
          </span>
          <button
            onClick={onSubmit}
            disabled={disabled || !value.trim()}
            className="font-mono text-xs tracking-wider px-4 py-2 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 disabled:border-cyber-border/10 disabled:text-cyber-text-dim/40 disabled:hover:bg-transparent transition-all duration-300 cursor-none"
          >
            {isLoading ? "GÉNÉRATION..." : "GENERATE →"}
          </button>
        </div>
      </div>
    </div>
  );
}
