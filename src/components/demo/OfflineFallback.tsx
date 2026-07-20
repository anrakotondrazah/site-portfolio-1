interface Props {
  onDismiss: () => void;
}

export default function OfflineFallback({ onDismiss }: Props) {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center border border-red-500/20 bg-cyber-dark-3/80 relative p-6 text-center">
      {/* Corners brackets */}
      <span
        className="corner-bracket border-red-500/30 corner-bracket--tl"
        aria-hidden="true"
      />
      <span
        className="corner-bracket border-red-500/30 corner-bracket--tr"
        aria-hidden="true"
      />
      <span
        className="corner-bracket border-red-500/30 corner-bracket--bl"
        aria-hidden="true"
      />
      <span
        className="corner-bracket border-red-500/30 corner-bracket--br"
        aria-hidden="true"
      />

      <div className="text-4xl mb-4 text-red-500/80">⚠️</div>
      <h3 className="font-mono text-sm tracking-widest text-red-500/80 mb-2">
        API_UNAVAILABLE :: MODE DÉGRADÉ
      </h3>
      <p className="font-mono text-xs text-cyber-text-secondary max-w-sm mb-6">
        La connexion à l'API Gemini n'a pas pu être établie. Vous naviguez sans
        clé d'API valide ou hors ligne.
      </p>

      <button
        onClick={onDismiss}
        className="font-mono text-xs tracking-wider px-4 py-2 border border-red-500/30 text-red-500/80 hover:bg-red-500/10 transition-all duration-300 cursor-none"
      >
        Réessayer la connexion
      </button>
    </div>
  );
}
