"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

type ScrollState = {
  progress: number;
  velocity: number;
};

const flowVertexShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform float uVelocity;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float waveA = sin(pos.x * 0.16 + uTime * 0.45 + uScroll * 5.0);
    float waveB = cos(pos.y * 0.12 - uTime * 0.32 + uScroll * 3.0);
    float scrollLift = sin(uScroll * 3.14159 + pos.x * 0.035) * 1.8;

    pos.z += waveA * 1.4 + waveB * 0.9;
    pos.y += scrollLift + uVelocity * 2.0;
    pos.x += sin(uTime * 0.18 + pos.y * 0.08) * 0.8;

    vDepth = pos.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const flowFragmentShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    float laneA = smoothstep(0.035, 0.0, abs(sin((vUv.y + uScroll * 0.25) * 14.0 + uTime * 0.18) - 0.55));
    float laneB = smoothstep(0.03, 0.0, abs(sin((vUv.y - uScroll * 0.18) * 9.0 - uTime * 0.14) + 0.25));
    float breath = 0.55 + sin(uTime * 0.55 + vUv.x * 4.0) * 0.18;
    float edgeFade = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.72, vUv.x);
    float verticalFade = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.12, vUv.y);
    float alpha = (laneA * 0.22 + laneB * 0.12) * breath * edgeFade * verticalFade;

    vec3 color = mix(uColorA, uColorB, vUv.x + sin(vUv.y * 4.0 + uTime * 0.2) * 0.08);
    gl_FragColor = vec4(color, alpha);
  }
`;

function deterministicNoise(index: number, salt: number) {
  return (Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1;
}

function SignalMist({ scroll }: { scroll: ScrollState }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 420;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const colorA = new THREE.Color("#5B8EF0");
    const colorB = new THREE.Color("#34D399");

    for (let i = 0; i < count; i++) {
      const x = (deterministicNoise(i, 1) - 0.5) * 70;
      const y = (deterministicNoise(i, 2) - 0.5) * 42;
      const z = -24 + deterministicNoise(i, 3) * 18;
      const color = colorA.clone().lerp(colorB, deterministicNoise(i, 4));

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors, base };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const scrollPush = scroll.progress * 18;
    const speed = 0.22 + Math.abs(scroll.velocity) * 1.2;

    for (let i = 0; i < count; i++) {
      const bx = particles.base[i * 3];
      const by = particles.base[i * 3 + 1];
      const bz = particles.base[i * 3 + 2];
      const lane = deterministicNoise(i, 6) > 0.5 ? 1 : -1;

      positions[i * 3] = bx + Math.sin(elapsed * 0.18 + by * 0.12) * 2.2 + scroll.progress * lane * 4;
      positions[i * 3 + 1] = by + ((elapsed * speed + scrollPush + i * 0.13) % 10) - 5;
      positions[i * 3 + 2] = bz + Math.cos(elapsed * 0.12 + bx * 0.08) * 1.2;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.13}
        transparent
        opacity={0.38}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function FlowPlane({ scroll }: { scroll: ScrollState }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uColorA: { value: new THREE.Color("#5B8EF0") },
      uColorB: { value: new THREE.Color("#34D399") },
    }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current || !materialRef.current) return;

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uScroll.value = THREE.MathUtils.lerp(uniforms.uScroll.value, scroll.progress, 0.045);
    uniforms.uVelocity.value = THREE.MathUtils.lerp(uniforms.uVelocity.value, scroll.velocity, 0.08);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.55 + scroll.progress * 0.24, 0.04);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -0.18 + scroll.progress * 0.36, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -3 + scroll.progress * 5, 0.04);
  });

  return (
    <group ref={groupRef} position={[0, -3, -16]} rotation={[-0.55, -0.18, 0]}>
      <mesh>
        <planeGeometry args={[92, 54, 128, 64]} />
        <shaderMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={flowVertexShader}
          fragmentShader={flowFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </group>
  );
}

function NaturalFlow({ scroll }: { scroll: ScrollState }) {
  const rigRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!rigRef.current) return;
    const elapsed = state.clock.elapsedTime;
    rigRef.current.rotation.z = Math.sin(elapsed * 0.08) * 0.025;
    rigRef.current.position.x = Math.sin(elapsed * 0.06 + scroll.progress * 3) * 1.2;
  });

  return (
    <group ref={rigRef}>
      <FlowPlane scroll={scroll} />
      <SignalMist scroll={scroll} />
    </group>
  );
}

export default function GlobalEnvironment() {
  const [scroll, setScroll] = useState<ScrollState>({ progress: 0, velocity: 0 });

  useEffect(() => {
    let lastScroll = window.scrollY;
    let lastTime = performance.now();

    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const now = performance.now();
      const elapsed = Math.max(16, now - lastTime);
      const velocity = THREE.MathUtils.clamp((currentScroll - lastScroll) / elapsed, -2, 2);

      setScroll({
        progress: Math.max(0, Math.min(1, currentScroll / (maxScroll || 1))),
        velocity,
      });

      lastScroll = currentScroll;
      lastTime = now;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020408]">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 28], fov: 50 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
          <fog attach="fog" args={["#020408", 18, 54]} />
          <NaturalFlow scroll={scroll} />
        </Canvas>
      </div>

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(2,4,8,0.12) 0%, rgba(2,4,8,0.72) 58%, rgba(2,4,8,0.98) 100%)",
        }}
      />

      <div
        className="absolute inset-0 z-20 pointer-events-none opacity-35"
        style={{
          background:
            "radial-gradient(circle at 24% 22%, rgba(91,142,240,0.12), transparent 34%), radial-gradient(circle at 76% 74%, rgba(52,211,153,0.1), transparent 36%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.022] pointer-events-none mix-blend-overlay z-30"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />
    </div>
  );
}
