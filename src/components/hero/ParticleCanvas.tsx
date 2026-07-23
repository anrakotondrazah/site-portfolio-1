// ✅ FIX ParticleCanvas.tsx — supprime AdditiveBlending (cause du shader warning)
import { useEffect, useRef, useCallback } from "react";

export default function ParticleCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX / window.innerWidth - 0.5;
    mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (!mountRef.current) return;
      const mount = mountRef.current;
      const W = mount.clientWidth;
      const H = mount.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
      camera.position.z = 40;

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const COUNT = window.innerWidth < 768 ? 1200 : 3000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(COUNT * 3);
      const colors = new Float32Array(COUNT * 3);

      const cyan   = new THREE.Color(0x00e5ff);
      const violet = new THREE.Color(0x9b00ff);
      const grey   = new THREE.Color(0x8899aa);

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.pow(Math.random(), 0.5) * 80;

        positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = (Math.random() - 0.5) * 60;

        const rand = Math.random();
        const col  = rand < 0.45 ? cyan : rand < 0.90 ? violet : grey;
        colors[i3]     = col.r;
        colors[i3 + 1] = col.g;
        colors[i3 + 2] = col.b;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

      // ✅ FIX : suppression de AdditiveBlending + depthWrite
      // Ces deux options causent le VALIDATE_STATUS false sur certains GPU
      const material = new THREE.PointsMaterial({
        size: 0.30,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const clock = new THREE.Clock();

      const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        particles.rotation.x = t * 0.00015 + mouseRef.current.y * 0.003;
        particles.rotation.y = t * 0.00020 + mouseRef.current.x * 0.003;
        camera.position.x = Math.sin(t * 0.1) * 1.5;
        camera.position.y = Math.cos(t * 0.08) * 1;
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      const onVisibility = () => {
        document.hidden
          ? cancelAnimationFrame(frameIdRef.current)
          : animate();
      };

      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVisibility);

      cleanup = () => {
        cancelAnimationFrame(frameIdRef.current);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      };
    });

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      cleanup();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    />
  );
}
