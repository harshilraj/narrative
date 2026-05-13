"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

// ── CONCEPT: THE INVISIBLE LOOM ──────────────────────────────────────────
// Represents Narrative AI as a vast, ethereal tapestry of intelligence.
// Instead of hard grids or particles, we use fine "Data Threads" and 
// volumetric "Intelligence Shards" that drift in a digital void.

// 1. DATA THREADS SHADER
const threadVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  attribute float aSize;
  varying float vOpacity;

  void main() {
    vec3 pos = position;

    // Slow, drifting woven motion
    pos.x += sin(uTime * 0.2 + pos.y * 0.1) * 2.0;
    pos.z += cos(uTime * 0.1 + pos.x * 0.1) * 1.5;

    // Vertical drift based on scroll
    pos.y += uProgress * 25.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Threads are very fine and fade into the distance
    vOpacity = smoothstep(-50.0, -5.0, mvPosition.z) * 0.2;
    
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const threadFragmentShader = `
  varying float vOpacity;
  uniform vec3 uColor;

  void main() {
    // Sharp, line-like particles
    float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
    if (dist > 0.45) discard;
    
    gl_FragColor = vec4(uColor, vOpacity);
  }
`;

// 2. INTELLIGENCE SHARDS (Volumetric Light)
const shardVertexShader = `
  varying vec2 vUv;
  uniform float uProgress;
  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.y += uProgress * 10.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const shardFragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;

  void main() {
    float strength = distance(vUv, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 4.0);

    // Flickering, ethereal light
    float flicker = sin(uTime * 0.5) * 0.1 + 0.9;
    
    gl_FragColor = vec4(uColor, strength * flicker * 0.15);
  }
`;

function InvisibleLoom({ progress }: { progress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const shardsRef = useRef<THREE.Group>(null);
  const count = 12000;
  
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
      sz[i] = Math.random() * 0.8 + 0.1; // Extremely fine
    }
    return { positions: pos, sizes: sz };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColor: { value: new THREE.Color("#EEF2F8") },
    uShardColor: { value: new THREE.Color("#4F46E5") }
  }), []);

  useFrame((state) => {
    if (!pointsRef.current || !shardsRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uProgress.value = THREE.MathUtils.lerp(uniforms.uProgress.value, progress, 0.05);

    shardsRef.current.rotation.z = state.clock.elapsedTime * 0.05;
  });

  return (
    <group>
      {/* 1. Fine Data Threads */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial 
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
          vertexShader={threadVertexShader} fragmentShader={threadFragmentShader} uniforms={uniforms}
        />
      </points>

      {/* 2. Intelligence Shards */}
      <group ref={shardsRef}>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[(i - 2) * 15, 0, -15]} rotation={[0, 0, i * 0.5]}>
            <planeGeometry args={[10, 40]} />
            <shaderMaterial 
              transparent depthWrite={false} blending={THREE.AdditiveBlending}
              vertexShader={shardVertexShader} fragmentShader={shardFragmentShader}
              uniforms={{ uTime: uniforms.uTime, uProgress: uniforms.uProgress, uColor: uniforms.uShardColor }}
            />
          </mesh>
        ))}
      </group>
    </group>
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
      
      {/* 3D Invisible Loom Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 30], fov: 45 }}>
          <fog attach="fog" args={["#020408", 15, 50]} />
          <InvisibleLoom progress={progress} />
        </Canvas>
      </div>

      {/* 2. Deep Atmospheric Shield */}
      <div className="absolute inset-0 z-10 pointer-events-none" 
        style={{ 
          background: `radial-gradient(circle at 50% 50%, rgba(2,4,8,0.1) 0%, rgba(2,4,8,0.98) 100%)`,
        }} 
      />

      {/* 3. Subtle Lens Flare / Signal Bursts */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-20"
        style={{ 
          background: `radial-gradient(circle at 20% 30%, rgba(79,70,229,0.15) 0%, transparent 40%),
                       radial-gradient(circle at 80% 70%, rgba(139,108,240,0.1) 0%, transparent 40%)` 
        }} 
      />

      {/* 4. Infrastructure Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-30"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
    </div>
  );
}
