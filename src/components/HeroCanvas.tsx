"use client";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LAYER_COUNT = 3;
const PARTICLES_PER_LAYER = [1500, 1000, 500]; // BG, MID, FG
const SIZES = [0.03, 0.05, 0.08];
const OPACITIES = [0.2, 0.4, 0.7];

function FlowLayer({ layerIndex }: { layerIndex: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = PARTICLES_PER_LAYER[layerIndex];
  
  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    const colorA = new THREE.Color("#3DB8F5"); // cyan
    const colorB = new THREE.Color("#8B6CF0"); // purple
    const colorC = new THREE.Color("#A78BFA"); // light purple/pink
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Widespread field, background is deeper, foreground is closer
      const zRange = layerIndex === 0 ? [-25, -10] : layerIndex === 1 ? [-10, 2] : [2, 10];
      
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = zRange[0] + Math.random() * (zRange[1] - zRange[0]);
      
      vel[i * 3] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;
      
      const rand = Math.random();
      if (rand < 0.33) tempColor.lerpColors(colorA, colorB, Math.random());
      else if (rand < 0.66) tempColor.lerpColors(colorB, colorC, Math.random());
      else tempColor.copy(colorA);
      
      // Foreground particles are brighter
      if (layerIndex === 2) tempColor.lerp(new THREE.Color(0xffffff), 0.3);

      col[i * 3] = tempColor.r;
      col[i * 3 + 1] = tempColor.g;
      col[i * 3 + 2] = tempColor.b;
    }
    return { positions: pos, velocities: vel, colors: col };
  }, [layerIndex, count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  const material = useMemo(() => new THREE.PointsMaterial({
    size: SIZES[layerIndex],
    transparent: true,
    opacity: OPACITIES[layerIndex],
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  }), [layerIndex]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime() * 0.05;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Different flow speeds per layer for parallax
    const speed = 0.5 + (layerIndex * 0.2);

    for (let i = 0; i < count; i++) {
      const x = pos[i * 3];
      const y = pos[i * 3 + 1];
      const z = pos[i * 3 + 2];

      // Smooth, flowing intelligence field using sine waves
      const nx = Math.sin(y * 0.15 + time * speed) * Math.cos(z * 0.15) * 0.01;
      const ny = Math.sin(z * 0.15 + time * speed) * Math.cos(x * 0.15) * 0.01;
      const nz = Math.sin(x * 0.15 + time * speed) * Math.cos(y * 0.15) * 0.01;

      // Routing tendency: move right and up
      velocities[i * 3] += (nx + 0.003 - velocities[i * 3]) * 0.05;
      velocities[i * 3 + 1] += (ny + 0.002 - velocities[i * 3 + 1]) * 0.05;
      velocities[i * 3 + 2] += (nz - velocities[i * 3 + 2]) * 0.05;

      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      const zRange = layerIndex === 0 ? [-25, -10] : layerIndex === 1 ? [-10, 2] : [2, 10];

      // Soft boundary reset
      if (pos[i * 3] > 25) pos[i * 3] = -25;
      if (pos[i * 3] < -25) pos[i * 3] = 25;
      if (pos[i * 3 + 1] > 15) pos[i * 3 + 1] = -15;
      if (pos[i * 3 + 1] < -15) pos[i * 3 + 1] = 15;
      if (pos[i * 3 + 2] > zRange[1]) pos[i * 3 + 2] = zRange[0];
      if (pos[i * 3 + 2] < zRange[0]) pos[i * 3 + 2] = zRange[1];
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

function Scene({ mouseRef }: { mouseRef: React.MutableRefObject<[number, number]> }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      const [mx, my] = mouseRef.current;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mx * 0.08, 0.015);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -my * 0.08, 0.015);
    }
  });

  return (
    <group ref={groupRef}>
      <fog attach="fog" args={["#030408", 5, 25]} />
      {/* 3 depth layers of flow field */}
      <FlowLayer layerIndex={0} />
      <FlowLayer layerIndex={1} />
      <FlowLayer layerIndex={2} />
      
      {/* Subtle depth lines indicating routing infrastructure */}
      <gridHelper args={[100, 100, 0x1A2A4A, 0x1A2A4A]} position={[0, -12, 0]} material-opacity={0.15} material-transparent />
      <gridHelper args={[100, 100, 0x1A2A4A, 0x1A2A4A]} position={[0, 12, 0]} material-opacity={0.08} material-transparent />
    </group>
  );
}

export default function HeroCanvas() {
  const mouseRef = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = [
        (e.clientX / window.innerWidth - 0.5) * 2,
        (e.clientY / window.innerHeight - 0.5) * 2,
      ];
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#030408" }}
    >
      <Scene mouseRef={mouseRef} />
    </Canvas>
  );
}
