import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

const CONFIG = {
  PARTICLE_COUNT:
    typeof window !== "undefined" && window.innerWidth < 768 ? 1500 : 3500,
  PARTICLE_SIZE: 0.25,
  SPREAD: 120,
  DEPTH: 80,
  MOUSE_PARALLAX_STRENGTH: 0.0004,
  ROTATION_SPEED_X: 0.00015,
  ROTATION_SPEED_Y: 0.0002,
  CAMERA_Z: 40,
  FOG_NEAR: 50,
  FOG_FAR: 200,
  COLOR_CYAN: new THREE.Color(0x00e5ff),
  COLOR_VIOLET: new THREE.Color(0x9b00ff),
  COLOR_WHITE: new THREE.Color(0xaabbcc),
  CYAN_RATIO: 0.45,
  VIOLET_RATIO: 0.45,
};

export default function ParticleCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameIdRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const clockRef = useRef(new THREE.Clock());

  const handleResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current || !mountRef.current) return;
    const { clientWidth: w, clientHeight: h } = mountRef.current;
    cameraRef.current.aspect = w / h;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(w, h);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    const { clientWidth: w, clientHeight: h } = mount;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, CONFIG.FOG_NEAR, CONFIG.FOG_FAR);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.set(0, 0, CONFIG.CAMERA_Z);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Geometry
    const geometry = new THREE.BufferGeometry();
    const count = CONFIG.PARTICLE_COUNT;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * CONFIG.SPREAD;

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = (Math.random() - 0.5) * CONFIG.DEPTH;

      const rand = Math.random();
      let color: THREE.Color;
      if (rand < CONFIG.CYAN_RATIO) {
        color = CONFIG.COLOR_CYAN.clone().lerp(
          CONFIG.COLOR_WHITE,
          Math.random() * 0.2,
        );
      } else if (rand < CONFIG.CYAN_RATIO + CONFIG.VIOLET_RATIO) {
        color = CONFIG.COLOR_VIOLET.clone().lerp(
          CONFIG.COLOR_WHITE,
          Math.random() * 0.15,
        );
      } else {
        color = CONFIG.COLOR_WHITE.clone().multiplyScalar(
          0.3 + Math.random() * 0.4,
        );
      }
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = CONFIG.PARTICLE_SIZE * (0.4 + Math.random() * 1.2);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Shader Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vDistance;
        uniform float uTime;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vDistance = -mvPosition.z;
          float wave = sin(uTime * 0.5 + position.x * 0.05) * 0.3 + cos(uTime * 0.3 + position.y * 0.05) * 0.3;
          mvPosition.y += wave;
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vDistance;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          float fogFactor = smoothstep(30.0, 80.0, vDistance);
          alpha *= 1.0 - fogFactor;
          float glow = 1.0 - smoothstep(0.0, 0.4, dist);
          vec3 glowColor = vColor * 2.0 * glow;
          gl_FragColor = vec4(vColor + glowColor * 0.3, alpha * 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Render Loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clockRef.current.getElapsedTime();
      (material.uniforms.uTime as { value: number }).value = elapsed;

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.03;
      mouse.y += (mouse.targetY - mouse.y) * 0.03;

      particles.rotation.x =
        elapsed * CONFIG.ROTATION_SPEED_X +
        mouse.y * CONFIG.MOUSE_PARALLAX_STRENGTH * 10;
      particles.rotation.y =
        elapsed * CONFIG.ROTATION_SPEED_Y +
        mouse.x * CONFIG.MOUSE_PARALLAX_STRENGTH * 10;

      camera.position.x = Math.sin(elapsed * 0.1) * 2;
      camera.position.y = Math.cos(elapsed * 0.08) * 1;

      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frameIdRef.current);
      } else {
        animate();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [handleResize, handleMouseMove]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    />
  );
}
