export type Url = `http://${string}` | `https://${string}`;
type Path = `/${string}`;

export interface Site {
  website: Url;
  base: Path;
  title: string;
  description: string;
  author: string;
  lang: string;
  ogLocale: string;
  imageDomains: string[];
}

// ── Gallery Types ──────────────────────────────────────
export interface GalleryItem {
  id: string;
  src: string;
  thumbSrc: string;
  width: number;
  height: number;
  prompt: string;
  tool: string;
  category: "PRODUCTS" | "PORTRAITS" | "SPACES" | "FOOD" | "FASHION";
  aspectRatio: number;
  displayTitle: string;
  hoverText: string;
}

// ── Service Types ──────────────────────────────────────
export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  includes: string[];
  price: string;
  badge?: string;
  cta: string;
}

// ── Before/After Types ─────────────────────────────────
export interface ComparisonPair {
  id: string;
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  beforeDescription: string;
  afterDescription: string;
}

// ── Process Types ──────────────────────────────────────
export interface ProcessStep {
  number: string;
  icon: string;
  title: string;
  description: string;
  time: string;
}

// ── Gemini Types ───────────────────────────────────────
export interface GenerationResult {
  success: true;
  imageDataUrl: string;
  mimeType: string;
  textResponse?: string;
}

export interface GenerationError {
  success: false;
  code:
    | "RATE_LIMITED"
    | "QUOTA_EXCEEDED"
    | "API_ERROR"
    | "SAFETY_BLOCK"
    | "NETWORK_ERROR"
    | "INVALID_KEY";
  message: string;
  retryAfterMs?: number;
}

export type GenerationOutput = GenerationResult | GenerationError;
