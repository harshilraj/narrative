"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function AdaptiveTopology() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 4000;
  
  const { positions, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    
    // Create an intricate, organic sphere topology
    for (let i = 0; i < count; i++) {
      const r = 15 + Math.random() * 5; // sphere with shell thickness
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      rand[i] = Math.random();
    }
    return { positions: pos, randoms: rand };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Slow ambient rotation
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.003;
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.001;

    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const currentPositions = positionsAttr.array as Float32Array;
    
    // Subtle breathing animation for vertices
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = state.clock.elapsedTime + randoms[i] * 10;
      
      // Calculate a very slight wave offset
      const offset = Math.sin(t * 0.05) * 0.002;
      
      currentPositions[i3] += currentPositions[i3] * offset * 0.01;
      currentPositions[i3+1] += currentPositions[i3+1] * offset * 0.01;
      currentPositions[i3+2] += currentPositions[i3+2] * offset * 0.01;
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    // Positioned to the right of the screen
    <group position={[15, 0, -10]}>
      <Points ref={pointsRef} positions={positions}>
        <PointMaterial 
          transparent 
          color="#A78BFA" // Soft purple/blue glow
          size={0.05} 
          sizeAttenuation={true} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
          opacity={0.4}
        />
      </Points>
    </group>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SystemCanvas({ progress }: { progress?: number }) {
  return (
    <div className="absolute inset-0 z-0 bg-[#070B14]">
      {/* 
        To optimize, we limit pixel ratio to a max of 1.5 
        and restrict the canvas to only render the hero object.
      */}
      <Canvas camera={{ position: [0, 0, 30], fov: 45 }} dpr={[1, 1.5]} gl={{ powerPreference: "high-performance", antialias: false }}>
        <fog attach="fog" args={["#070B14", 15, 50]} />
        <AdaptiveTopology />
      </Canvas>
      {/* Volumetric lighting gradients */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_rgba(125,211,252,0.05)_0%,_transparent_70%)] z-10" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[rgba(7,11,20,0.5)] to-[#070B14] z-10" />
    </div>
  );
}
