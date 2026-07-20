import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initGSAP(): void {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.defaults({
    toggleActions: "play none none none",
    once: true,
  });

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) {
    gsap.globalTimeline.timeScale(10);
  }

  initHeroAnimations();
  initScrollProgress();
}

function initHeroAnimations(): void {
  const tl = gsap.timeline({ delay: 0.3 });

  tl.from('[data-gsap="hero-label"]', {
    opacity: 0,
    letterSpacing: "0.5em",
    duration: 0.8,
    ease: "power2.out",
  });

  tl.from(
    '[data-gsap="hero-title"]',
    {
      opacity: 0,
      y: 80,
      duration: 0.8,
      ease: "back.out(2)",
    },
    "-=0.4",
  );

  tl.from(
    '[data-gsap="hero-subtitle"]',
    {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
    },
    "-=0.4",
  );

  tl.from(
    '[data-gsap="hero-desc"]',
    {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.out",
    },
    "-=0.3",
  );

  tl.from(
    '[data-gsap="hero-cta"]',
    {
      opacity: 0,
      y: 30,
      duration: 0.5,
      stagger: 0.15,
      ease: "power3.out",
    },
    "-=0.3",
  );

  tl.from(
    '[data-gsap="hero-scroll"]',
    {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.out",
    },
    "-=0.2",
  );

  // Parallax on scroll
  gsap.to('[data-gsap="hero-content"]', {
    y: -80,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "40% top",
      scrub: 1,
    },
  });
}

function initScrollProgress(): void {
  const bar = document.querySelector("[data-scroll-progress]");
  if (!bar) return;

  gsap.to(bar, {
    scaleX: 1,
    transformOrigin: "left center",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });
}
