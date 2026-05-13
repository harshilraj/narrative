"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

// ── CUSTOM SHADER: DIGITAL TOPOLOGY GRID ──────────────────────────────────
// This represents the "Meaningful Infrastructure" of Narrative AI.
// A structured, adaptive grid with traveling intelligence pulses.
const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  varying float vOpacity;
  varying vec3 vPos;

  void main() {
    vPos = position;
    vec3 pos = position;

    // Create a subtle "wave of intelligence" that travels across the infrastructure
    float wave = sin(pos.x * 0.1 + pos.y * 0.1 + uTime * 0.5) * 0.5;
    pos.z += wave * (1.0 + uProgress * 2.0);

    // Apply scroll-based vertical drift to simulate "moving through the system"
    pos.y += uProgress * 15.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Fade out particles that are too close to the camera for readability
    float dist = length(mvPosition.xyz);
    vOpacity = smoothstep(5.0, 15.0, dist) * 0.4;
    
    // Large points for pulses, small for grid
    gl_PointSize = (1.5 + sin(uTime + pos.x * 10.0) * 0.5) * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vOpacity;
  uniform vec3 uColor;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft, focused signals
    float glow = exp(-dist * 4.0);
    gl_FragColor = vec4(uColor, glow * vOpacity);
  }
`;

function InfrastructureGrid({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create a structured grid of points
  const { positions, count } = useMemo(() => {
    const size = 60;
    const step = 1.2;
    const pos = [];
    for (float x = -size; x <= size; x += step) {
      for (float y = -size; y <= size; y += step) {
        pos.push(x, y, 0);
      }
    }
    return { 
      positions: new Float32Array(pos), 
      count: pos.length / 3 
    };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColor: { value: new THREE.Color("#4F46E5") } // Deep tech blue/purple
  }), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uProgress.value = THREE.MathUtils.lerp(uniforms.uProgress.value, progress, 0.05);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3} 
        />
      </bufferGeometry>
      <shaderMaterial 
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </points>
  );
}

export default function GlobalEnvironment() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setProgress(Math.max(0, Math.min(1, currentScroll / (maxScroll || 1))));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020408]">
      
      {/* 1. Infrastructure Layer - Structured & Recessed */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Canvas camera={{ position: [0, -10, 25], fov: 45, rotation: [0.4, 0, 0] }}>
          <fog attach="fog" args={["#020408", 10, 40]} />
          <InfrastructureGrid progress={progress} />
        </Canvas>
      </div>

      {/* 2. Readability Shield - Radial Vignette that darkens content areas */}
      <div className="absolute inset-0 z-10 pointer-events-none" 
        style={{ 
          background: "radial-gradient(circle at center, rgba(2,4,8,0.2) 0%, rgba(2,4,8,0.9) 100%)",
          mixBlendMode: "multiply"
        }} 
      />

      {/* 3. Atmospheric Fog - Softening the digital lines */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(79,70,229,0.05)_0%,transparent_60%)]" />

      {/* 4. Film Grain for Premium Feel */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-30"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
    </div>
  );
}
