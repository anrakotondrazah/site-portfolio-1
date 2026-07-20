import type { Service } from "~/types";

export const servicesData: Service[] = [
  {
    id: "product-photography",
    icon: "camera",
    title: "AI Product Photography",
    description:
      "10 studio-quality images of your product. Multiple backgrounds, angles, and lighting setups — generated in 24 hours. No physical studio required.",
    includes: [
      "10 final images",
      "3 background variants each",
      "High-res PNG/WebP",
      "Commercial license",
    ],
    price: "From $49",
    badge: "Most Popular",
    cta: "Order Now →",
  },
  {
    id: "portraits",
    icon: "user",
    title: "AI Professional Portraits",
    description:
      "5 consistent, polished professional portraits. Perfect for LinkedIn, team pages, press kits — without a photographer, a makeup artist, or a studio session.",
    includes: [
      "5 final portraits",
      "Consistent style & lighting",
      "High-res PNG",
      "3 retouching rounds",
    ],
    price: "From $29",
    cta: "Order Now →",
  },
  {
    id: "video-pack",
    icon: "play",
    title: "AI Cinematic Video",
    description:
      "3 short videos (15–30 seconds each) powered by Google VEO. Product presentations, brand ambiance, social media reels — cinematic quality without a film crew.",
    includes: [
      "3 videos 15–30s",
      "MP4 1080p minimum",
      "Commercial license",
      "1 revision per video",
    ],
    price: "From $99",
    badge: "Powered by Google VEO",
    cta: "Order Now →",
  },
  {
    id: "brand-identity",
    icon: "diamond",
    title: "AI Brand Visual Identity",
    description:
      "A complete visual identity package generated and crafted by AI. Logo concepts, brand colors, typography system, and 20 brand visuals ready to deploy everywhere.",
    includes: [
      "Logo concepts (3 directions)",
      "Color palette",
      "20 brand visuals",
      "Usage guidelines",
      "All source files",
    ],
    price: "From $179",
    cta: "Order Now →",
  },
  {
    id: "social-motion",
    icon: "zap",
    title: "AI Motion & Reels",
    description:
      "5 animated posts optimized for Instagram Reels, TikTok, and LinkedIn — short-form video content powered by AI, designed to stop the scroll.",
    includes: [
      "5 animated videos",
      "Vertical 9:16 format",
      "Optimized for each platform",
      "Music-ready (no copyright)",
    ],
    price: "From $69",
    cta: "Order Now →",
  },
  {
    id: "consulting",
    icon: "brain",
    title: "AI Strategy Session",
    description:
      "2-hour private consultation to understand how AI tools can reduce your content production costs and accelerate your visual output. Recorded + action plan included.",
    includes: [
      "2h video call",
      "Recorded session",
      "Custom action plan",
      "Tool recommendations",
      "30-day follow-up email",
    ],
    price: "$79 / session",
    cta: "Book a Session →",
  },
];
