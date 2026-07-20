import type { ProcessStep } from "~/types";

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    icon: "◈",
    title: "Tell Us What You See",
    description:
      "Fill out a quick brief — what you need, your style preferences, and how you'll use the visuals. It takes less than 5 minutes. No meetings, no lengthy calls (unless you want one).",
    time: "⏱ 5 minutes",
  },
  {
    number: "02",
    icon: "◉",
    title: "AI Does The Heavy Lifting",
    description:
      "Our AI pipeline — powered by Google Gemini Imagen 3 and VEO — generates your visuals based on your brief. We review every output for quality before sending anything your way.",
    time: "⏱ 24–48 hours",
  },
  {
    number: "03",
    icon: "◎",
    title: "Yours, Ready To Use",
    description:
      "You receive high-resolution files (PNG, WebP, MP4) with full commercial license. Need a revision? One round is always included, and we don't stop until you're satisfied.",
    time: "⏱ Same day as approval",
  },
];
