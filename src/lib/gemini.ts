// ═══════════════════════════════════════════════════════════════
// GEMINI API CLIENT — NEURAL.VISION
// Modèle : gemini-2.0-flash-preview-image-generation
// Appels : 100% client-side
// ═══════════════════════════════════════════════════════════════

import type { GenerationOutput, GenerationResult } from "../types";

interface GeminiImagePart {
  inlineData: {
    mimeType: "image/png" | "image/jpeg" | "image/webp";
    data: string; // base64 encoded
  };
}

interface GeminiTextPart {
  text: string;
}

interface GeminiCandidate {
  content: {
    parts: Array<GeminiImagePart | GeminiTextPart>;
    role: "model";
  };
  finishReason: "STOP" | "MAX_TOKENS" | "SAFETY";
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
  usageMetadata: {
    promptTokenCount: number;
    totalTokenCount: number;
  };
}

class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number; // tokens per ms
  private lastRefill: number;

  constructor(maxRequestsPerMinute: number = 4) {
    this.maxTokens = maxRequestsPerMinute;
    this.tokens = maxRequestsPerMinute;
    this.refillRate = maxRequestsPerMinute / 60000;
    this.lastRefill = Date.now();
  }

  canMakeRequest(): boolean {
    this.refill();
    return this.tokens >= 1;
  }

  consume(): void {
    this.refill();
    this.tokens = Math.max(0, this.tokens - 1);
  }

  timeUntilNextToken(): number {
    this.refill();
    if (this.tokens >= 1) return 0;
    const needed = 1 - this.tokens;
    return Math.ceil(needed / this.refillRate);
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const newTokens = elapsed * this.refillRate;
    this.tokens = Math.min(this.maxTokens, this.tokens + newTokens);
    this.lastRefill = now;
  }
}

const rateLimiter = new RateLimiter(4); // 4 req/min max

const CACHE_KEY = "nv_generation_cache";
const MAX_CACHE_SIZE = 5;

function getCachedResult(prompt: string): GenerationResult | null {
  try {
    const cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "[]");
    const hit = cache.find(
      (entry: { prompt: string; result: GenerationResult }) =>
        entry.prompt === prompt,
    );
    return hit?.result || null;
  } catch {
    return null;
  }
}

function setCachedResult(prompt: string, result: GenerationResult): void {
  try {
    const cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "[]");
    cache.unshift({ prompt, result, ts: Date.now() });
    const trimmed = cache.slice(0, MAX_CACHE_SIZE);
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
  } catch {
    // SessionStorage full ou indisponible — silently fail
  }
}

const SYSTEM_PROMPT_PREFIX = `Create a high-quality, artistic, professional image. 
Style: cinematic, detailed, 8K quality. 
Subject: `;

function sanitizePrompt(userPrompt: string): string {
  return userPrompt
    .trim()
    .slice(0, 280) // Max 280 chars
    .replace(/[<>\"']/g, ""); // Remove HTML/injection chars
}

export async function generateImage(
  userPrompt: string,
  signal?: AbortSignal,
): Promise<GenerationOutput> {
  const apiKey = import.meta.env.PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return {
      success: false,
      code: "INVALID_KEY",
      message: "Clé API manquante ou invalide. Mode démo activé.",
    };
  }

  // Vérification cache
  const cached = getCachedResult(userPrompt);
  if (cached) return cached;

  // Vérification rate limit
  if (!rateLimiter.canMakeRequest()) {
    const waitMs = rateLimiter.timeUntilNextToken();
    return {
      success: false,
      code: "RATE_LIMITED",
      message: `Limite de requêtes atteinte. Veuillez patienter ${Math.ceil(waitMs / 1000)} secondes.`,
      retryAfterMs: waitMs,
    };
  }

  const sanitized = sanitizePrompt(userPrompt);
  const fullPrompt = SYSTEM_PROMPT_PREFIX + sanitized;

  // Consomme un token
  rateLimiter.consume();

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: fullPrompt }],
          role: "user",
        },
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal,
    });

    if (response.status === 429) {
      return {
        success: false,
        code: "QUOTA_EXCEEDED",
        message: "Quota API dépassé. La démo repasse en mode hors ligne.",
        retryAfterMs: 60000,
      };
    }

    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        code: "API_ERROR",
        message: errorData?.error?.message || "Requête invalide.",
      };
    }

    if (!response.ok) {
      return {
        success: false,
        code: "API_ERROR",
        message: `Erreur serveur ${response.status}`,
      };
    }

    const data: GeminiResponse = await response.json();

    const candidate = data.candidates?.[0];
    if (!candidate) {
      return {
        success: false,
        code: "SAFETY_BLOCK",
        message:
          "Contenu bloqué par les filtres de sécurité. Veuillez essayer un autre prompt.",
      };
    }

    if (candidate.finishReason === "SAFETY") {
      return {
        success: false,
        code: "SAFETY_BLOCK",
        message: "Ce prompt a été bloqué par les filtres de sécurité.",
      };
    }

    const imagePart = candidate.content.parts.find(
      (p): p is GeminiImagePart => "inlineData" in p,
    );

    if (!imagePart) {
      return {
        success: false,
        code: "API_ERROR",
        message: "Aucune image dans la réponse de l'IA. Réessayez.",
      };
    }

    const textPart = candidate.content.parts.find(
      (p): p is GeminiTextPart => "text" in p,
    );

    const result: GenerationResult = {
      success: true,
      imageDataUrl: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
      mimeType: imagePart.inlineData.mimeType,
      textResponse: textPart?.text,
    };

    setCachedResult(userPrompt, result);

    return result;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        code: "NETWORK_ERROR",
        message: "Génération annulée.",
      };
    }

    return {
      success: false,
      code: "NETWORK_ERROR",
      message: "Erreur réseau. Vérifiez votre connexion internet.",
    };
  }
}

export function downloadGeneratedImage(dataUrl: string, prompt: string): void {
  const filename = `neural-vision-${prompt.slice(0, 30).replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.png`;
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export const DEMO_PROMPTS = [
  "A luxury perfume bottle on volcanic black rock, studio lighting, water droplets, 8K",
  "A professional CEO portrait, dark blue background, sharp suit, photorealistic",
  "A modern minimalist restaurant interior, candlelight, golden hour, 8K",
  "A high-end sneaker floating in void, neon cyan and purple rim lighting, 8K",
  "A gourmet burger on black slate, steam rising, macro shot, 8K",
] as const;

export const FALLBACK_IMAGES = [
  "/images/fallback/demo-fallback-01.webp",
  "/images/fallback/demo-fallback-02.webp",
  "/images/fallback/demo-fallback-03.webp",
  "/images/fallback/demo-fallback-04.webp",
] as const;

export function getRandomFallbackImage(): string {
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
}

export function isApiAvailable(): boolean {
  const apiKey = import.meta.env.PUBLIC_GEMINI_API_KEY;
  return (
    Boolean(apiKey && apiKey !== "your_gemini_api_key_here") &&
    typeof navigator !== "undefined" &&
    navigator.onLine
  );
}
