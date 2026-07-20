import { useState, useRef, useCallback, useEffect } from "react";
import {
  generateImage,
  downloadGeneratedImage,
  DEMO_PROMPTS,
  isApiAvailable,
  getRandomFallbackImage,
} from "../../lib/gemini";
import PromptInput from "./PromptInput";
import ScanAnimation from "./ScanAnimation";
import ResultDisplay from "./ResultDisplay";
import OfflineFallback from "./OfflineFallback";

type DemoStatus = "idle" | "loading" | "success" | "error" | "offline";

interface GeneratedResult {
  imageDataUrl: string;
  prompt: string;
  generatedAt: Date;
}

export default function DemoLive() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<DemoStatus>("idle");
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryAfterMs, setRetryAfterMs] = useState<number | null>(null);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [apiAvailable, setApiAvailable] = useState(true);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setApiAvailable(isApiAvailable());

    const handleOnline = () => setApiAvailable(isApiAvailable());
    const handleOffline = () => setApiAvailable(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!retryAfterMs) return;

    let remaining = Math.ceil(retryAfterMs / 1000);
    setRetryCountdown(remaining);

    retryTimerRef.current = setInterval(() => {
      remaining -= 1;
      setRetryCountdown(remaining);

      if (remaining <= 0) {
        if (retryTimerRef.current) clearInterval(retryTimerRef.current);
        setRetryAfterMs(null);
        setRetryCountdown(0);
        setStatus("idle");
        setErrorMessage("");
      }
    }, 1000);

    return () => {
      if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    };
  }, [retryAfterMs]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || status === "loading") return;

    if (!apiAvailable) {
      setStatus("offline");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setStatus("loading");
    setResult(null);
    setErrorMessage("");

    const output = await generateImage(
      prompt,
      abortControllerRef.current.signal,
    );

    if (output.success) {
      setResult({
        imageDataUrl: output.imageDataUrl,
        prompt,
        generatedAt: new Date(),
      });
      setStatus("success");
    } else {
      setErrorMessage(output.message);

      if (output.code === "RATE_LIMITED" || output.code === "QUOTA_EXCEEDED") {
        setRetryAfterMs(output.retryAfterMs || 60000);
        setStatus("error");
      } else if (
        output.code === "NETWORK_ERROR" &&
        output.message.includes("annulée")
      ) {
        setStatus("idle");
      } else {
        setStatus("error");
      }
    }
  }, [prompt, status, apiAvailable]);

  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus("idle");
    setResult(null);
    setErrorMessage("");
    setPrompt("");
  }, []);

  const handleDownload = useCallback(() => {
    if (!result) return;
    downloadGeneratedImage(result.imageDataUrl, result.prompt);
  }, [result]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setPrompt(suggestion);
  }, []);

  const renderCentralZone = () => {
    switch (status) {
      case "loading":
        return (
          <ScanAnimation isVisible={true} message="GÉNÉRATION EN COURS..." />
        );

      case "success":
        return result ? (
          <ResultDisplay
            imageUrl={result.imageDataUrl}
            prompt={result.prompt}
            generatedAt={result.generatedAt}
            onReset={handleReset}
            onDownload={handleDownload}
          />
        ) : null;

      case "offline":
        return (
          <OfflineFallback
            onDismiss={() => {
              setApiAvailable(isApiAvailable());
              setStatus("idle");
            }}
          />
        );

      case "idle":
      case "error":
      default:
        return (
          <div className="w-full max-w-lg mx-auto aspect-square flex items-center justify-center border border-cyber-cyan/10 relative">
            <div className="text-center px-4">
              <div className="text-6xl mb-4 opacity-20 text-cyber-cyan">◈</div>
              <p className="font-mono text-xs text-cyber-text-secondary opacity-60">
                {status === "error" && retryCountdown > 0
                  ? `RATE_LIMITED :: RETRY_IN_${retryCountdown}s`
                  : "AWAITING_PROMPT :: Describe your vision below"}
              </p>
            </div>
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
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Central View Area */}
      <div
        className="w-full max-w-lg mx-auto transition-all duration-500"
        role="region"
        aria-label="Zone de génération d'image IA"
        aria-live="polite"
      >
        {renderCentralZone()}
      </div>

      {/* Error Message */}
      {status === "error" && errorMessage && !retryAfterMs && (
        <div
          role="alert"
          className="font-mono text-xs text-red-400/80 border border-red-500/20 bg-red-950/20 px-4 py-3 max-w-lg w-full text-center"
        >
          <span className="text-red-500/60 font-bold">ERROR ::</span>{" "}
          {errorMessage}
        </div>
      )}

      {/* Prompt input */}
      <div className="w-full max-w-2xl">
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          onSubmit={handleGenerate}
          isLoading={status === "loading"}
          disabled={
            status === "loading" || (status === "error" && !!retryAfterMs)
          }
          maxLength={280}
        />
      </div>

      {/* Preset Suggestions */}
      {status === "idle" && (
        <div className="flex flex-wrap gap-2 justify-center max-w-2xl px-4">
          {DEMO_PROMPTS.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(suggestion)}
              className="font-mono text-mono-xs px-3 py-1.5 border border-cyber-cyan/20 text-cyber-cyan/60 hover:border-cyber-cyan/50 hover:text-cyber-cyan hover:bg-cyber-cyan/5 transition-all duration-200 cursor-none"
            >
              {suggestion.slice(0, 45)}...
            </button>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="font-mono text-mono-xs text-cyber-text-dim/40 text-center max-w-lg px-4">
        Powered by Google Gemini AI &mdash; Generation time: 3–8 seconds.
        Results may vary. Commercial use requires a paid order.
      </p>
    </div>
  );
}
