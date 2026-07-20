import { useEffect, useRef } from "react";

const TRAIL_COUNT = 12;

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      document.documentElement.classList.remove("js-loaded");
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("[data-cursor-hover]")
      ) {
        document.body.classList.add("cursor-hovering");
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("[data-cursor-hover]")
      ) {
        document.body.classList.remove("cursor-hovering");
      }
    };

    const animate = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      let rx = ringPosRef.current.x;
      let ry = ringPosRef.current.y;

      // Lerp ring toward mouse
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ringPosRef.current.x = rx;
      ringPosRef.current.y = ry;

      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`;
        dotRef.current.style.top = `${my}px`;
      }

      // Trail
      trailRefs.current.forEach((point, i) => {
        if (!point) return;
        const t = (i + 1) / TRAIL_COUNT;
        const tx = mx + (rx - mx) * t;
        const ty = my + (ry - my) * t;
        point.style.left = `${tx}px`;
        point.style.top = `${ty}px`;
        point.style.opacity = `${1 - t * 0.9}`;
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailRefs.current[i] = el;
          }}
          className="cursor-trail-point"
          style={{
            background:
              i < TRAIL_COUNT / 2 ? "var(--color-cyan)" : "var(--color-violet)",
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
