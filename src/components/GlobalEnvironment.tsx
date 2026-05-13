"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

// ── CUSTOM SHADER: CONTEXTUAL INFRASTRUCTURE ───────────────────────────────
// This shader evolves its visual logic based on the scroll progress (uProgress).
// 0.0 - 0.2: (Hero) Scattered, calm grid.
// 0.2 - 0.5: (Architecture) Grid organizes and becomes more 3D.
// 0.5 - 0.8: (Process/LiveOps) Intelligence pulses accelerate and brighten.
// 0.8 - 1.0: (Case Studies) Stable, complex data topology.
const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  varying float vOpacity;
  varying float vPulse;

  void main() {
    vec3 pos = position;

    // 1. Contextual Distortion Logic
    float distToCenter = length(pos.xy);
    
    // Wave height increases as we move into architecture/process sections
    float waveIntensity = 0.5 + uProgress * 2.5;
    float wave = sin(pos.x * 0.15 + pos.y * 0.1 + uTime * 0.4) * waveIntensity;
    
    // In the "Process" section (around 0.6), create a "Routing Vortex" effect
    float vortexProgress = smoothstep(0.4, 0.7, uProgress) * (1.0 - smoothstep(0.7, 0.9, uProgress));
    float angle = vortexProgress * 2.0 * atan(pos.y, pos.x);
    pos.z += wave + sin(angle + uTime) * vortexProgress * 5.0;

    // 2. Pulse logic for signals
    float pulse = sin(uTime * 2.0 + pos.x * 0.5 + pos.y * 0.5) * 0.5 + 0.5;
    vPulse = pulse * uProgress;

    // 3. Perspective & Scroll Drift
    pos.y += uProgress * 18.0; // Vertical drift
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Fade out based on distance and scroll (more focus in early sections)
    float distanceFade = smoothstep(5.0, 30.0, length(mvPosition.xyz));
    vOpacity = distanceFade * (0.3 + uProgress * 0.4);
    
    // Size evolution: signals get bigger as system "activates"
    float sizeBase = 1.0 + pulse * uProgress * 2.0;
    gl_PointSize = sizeBase * (300.0 / -mvPosition.z);
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vOpacity;
  varying float vPulse;
  uniform vec3 uColor;
  uniform vec3 uPulseColor;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Blend base color with pulse color based on uProgress
    vec3 color = mix(uColor, uPulseColor, vPulse * 0.5);
    
    float alpha = smoothstep(0.5, 0.2, dist) * vOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`;

function ContextualGrid({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, count } = useMemo(() => {
    const size = 70;
    const step = 1.4;
    const pos = [];
    for (let x = -size; x <= size; x += step) {
      for (let y = -size; y <= size; y += step) {
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
    uColor: { value: new THREE.Color("#4F46E5") },
    uPulseColor: { value: new THREE.Color("#8B6CF0") }
  }), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uProgress.value = THREE.MathUtils.lerp(uniforms.uProgress.value, progress, 0.04);
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
      
      {/* 1. Contextual Intelligence Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, -12, 28], fov: 40, rotation: [0.5, 0, 0] }}>
          <fog attach="fog" args={["#020408", 15, 45]} />
          <ContextualGrid progress={progress} />
        </Canvas>
      </div>

      {/* 2. Intelligent Fog Overlay - subtle color shift based on scroll */}
      <div className="absolute inset-0 z-10 pointer-events-none transition-colors duration-1000"
        style={{ 
          background: `radial-gradient(circle at center, rgba(2,4,8,${0.2 + progress * 0.2}) 0%, rgba(2,4,8,0.95) 100%)`,
          mixBlendMode: "multiply"
        }} 
      />

      {/* 3. Operational Glow - bottom-up lighting that intensifies with scroll */}
      <div className="absolute inset-0 z-20 pointer-events-none"
        style={{ 
          background: `radial-gradient(ellipse at bottom, rgba(139,108,240,${0.02 + progress * 0.08}) 0%, transparent 70%)` 
        }} 
      />

      {/* 4. Infrastructure Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-30"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
    </div>
  );
}
