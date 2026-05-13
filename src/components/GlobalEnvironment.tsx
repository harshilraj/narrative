"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type GraphNode = {
  id: number;
  position: THREE.Vector3;
  offset: number;
};

type GraphEdge = {
  from: number;
  to: number;
};

type Pulse = {
  from: number;
  to: number;
  start: number;
  duration: number;
};

const NODE_COUNT = 70;
const ACTIVE_COUNT = 18;
const EDGE_DISTANCE = 4;
const ACTIVE_COLOR = new THREE.Color("#00FFB2");
const DIM_COLOR = new THREE.Color("#c7d0cf");
const LINE_COLOR = new THREE.Color("#7fffe0");

function noise(index: number, salt: number) {
  return Math.abs(Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1;
}

function makeGraph() {
  const nodes: GraphNode[] = Array.from({ length: NODE_COUNT }, (_, id) => {
    const lane = id % 7;
    const depthBand = Math.floor(id / 10);

    return {
      id,
      position: new THREE.Vector3(
        (noise(id, 1) - 0.5) * 40,
        (noise(id, 2) - 0.5) * 24 + Math.sin(lane) * 1.4,
        (noise(id, 3) - 0.5) * 8 + (depthBand - 3) * 0.25
      ),
      offset: noise(id, 4) * Math.PI * 2,
    };
  });

  const edges: GraphEdge[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].position.distanceTo(nodes[j].position) < EDGE_DISTANCE) {
        edges.push({ from: i, to: j });
      }
    }
  }

  return { nodes, edges };
}

function getActiveSet(time: number) {
  const activeStart = Math.floor(time / 2.6) % NODE_COUNT;
  const active = new Set<number>();

  for (let i = 0; i < ACTIVE_COUNT; i++) {
    active.add((activeStart + i * 4) % NODE_COUNT);
  }

  return active;
}

function CameraDrift() {
  const { camera, scene } = useThree();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    camera.position.x = Math.sin(time * 0.05) * 3;
    camera.position.y = Math.cos(time * 0.07) * 1.5;
    camera.position.z = 24;
    camera.lookAt(scene.position);
  });

  return null;
}

function OrchestrationGraph() {
  const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const pulseRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const nextPulseAt = useRef(0);
  const currentPulse = useRef<Pulse | null>(null);

  const { nodes, edges } = useMemo(makeGraph, []);

  const edgeMap = useMemo(() => {
    const map = new Map<number, GraphEdge[]>();
    edges.forEach((edge) => {
      map.set(edge.from, [...(map.get(edge.from) ?? []), edge]);
      map.set(edge.to, [...(map.get(edge.to) ?? []), edge]);
    });
    return map;
  }, [edges]);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.08, 1), []);

  const lineGeometry = useMemo(() => {
    const positions = new Float32Array(edges.length * 2 * 3);
    const colors = new Float32Array(edges.length * 2 * 3);

    edges.forEach((edge, index) => {
      const from = nodes[edge.from].position;
      const to = nodes[edge.to].position;
      const positionIndex = index * 6;
      const colorIndex = index * 6;

      positions.set([from.x, from.y, from.z, to.x, to.y, to.z], positionIndex);
      colors.set([LINE_COLOR.r, LINE_COLOR.g, LINE_COLOR.b, LINE_COLOR.r, LINE_COLOR.g, LINE_COLOR.b], colorIndex);
    });

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    bufferGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return bufferGeometry;
  }, [edges, nodes]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const activeNodes = getActiveSet(time);

    nodes.forEach((node, index) => {
      const mesh = nodeRefs.current[index];
      if (!mesh) return;

      const material = mesh.material as THREE.MeshStandardMaterial;
      const pulse = 0.5 + Math.sin(time * 1.6 + node.offset) * 0.5;
      const active = activeNodes.has(index);
      const scale = active ? 1.2 + pulse * 0.75 : 0.85 + pulse * 0.28;

      mesh.scale.setScalar(scale);
      material.opacity = active ? 0.72 + pulse * 0.28 : 0.22 + pulse * 0.22;
      material.color.copy(active ? ACTIVE_COLOR : DIM_COLOR);
      material.emissive.copy(active ? ACTIVE_COLOR : DIM_COLOR);
      material.emissiveIntensity = active ? 1.8 + pulse * 1.3 : 0.12 + pulse * 0.18;
    });

    const colorAttr = lineGeometry.getAttribute("color") as THREE.BufferAttribute;
    edges.forEach((edge, index) => {
      const fromPulse = 0.5 + Math.sin(time * 1.6 + nodes[edge.from].offset) * 0.5;
      const toPulse = 0.5 + Math.sin(time * 1.6 + nodes[edge.to].offset) * 0.5;
      const activeBoost = activeNodes.has(edge.from) || activeNodes.has(edge.to) ? 0.85 : 0.22;
      const brightness = (0.24 + ((fromPulse + toPulse) / 2) * 0.76) * activeBoost;
      const colorIndex = index * 6;

      for (let i = 0; i < 2; i++) {
        colorAttr.setXYZ(
          colorIndex / 3 + i,
          LINE_COLOR.r * brightness,
          LINE_COLOR.g * brightness,
          LINE_COLOR.b * brightness
        );
      }
    });
    colorAttr.needsUpdate = true;

    if (time >= nextPulseAt.current) {
      const activeList = Array.from(activeNodes);
      const from = activeList[Math.floor(noise(Math.floor(time * 10), 8) * activeList.length)];
      const candidates = edgeMap.get(from) ?? [];

      if (candidates.length > 0) {
        const edge = candidates[Math.floor(noise(Math.floor(time * 10), 9) * candidates.length)];
        currentPulse.current = {
          from,
          to: edge.from === from ? edge.to : edge.from,
          start: time,
          duration: 1.2,
        };
      }

      nextPulseAt.current = time + 2.1 + noise(Math.floor(time * 10), 10) * 0.9;
    }

    if (pulseRef.current && currentPulse.current) {
      const pulse = currentPulse.current;
      const progress = THREE.MathUtils.clamp((time - pulse.start) / pulse.duration, 0, 1);
      const eased = progress * progress * (3 - 2 * progress);
      const from = nodes[pulse.from].position;
      const to = nodes[pulse.to].position;

      pulseRef.current.visible = progress < 1;
      pulseRef.current.position.lerpVectors(from, to, eased);
      pulseRef.current.scale.setScalar(1.4 + Math.sin(progress * Math.PI) * 1.1);

      if (progress >= 1) currentPulse.current = null;
    }
  });

  return (
    <group>
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial transparent opacity={0.62} vertexColors blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>

      {nodes.map((node, index) => (
        <mesh
          key={node.id}
          ref={(mesh) => {
            nodeRefs.current[index] = mesh;
          }}
          geometry={geometry}
          position={node.position}
        >
          <meshStandardMaterial
            transparent
            depthWrite={false}
            color="#c7d0cf"
            emissive="#c7d0cf"
            emissiveIntensity={0.2}
            opacity={0.35}
            roughness={0.35}
          />
        </mesh>
      ))}

      <mesh ref={pulseRef} visible={false}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial
          transparent
          depthWrite={false}
          color="#00FFB2"
          emissive="#00FFB2"
          emissiveIntensity={3.2}
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}

export default function GlobalEnvironment() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050a0a]">
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 24], fov: 50 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#050a0a" }}
        >
          <color attach="background" args={["#050a0a"]} />
          <ambientLight intensity={0.9} />
          <pointLight position={[0, 0, 12]} intensity={1.6} color="#00FFB2" />
          <pointLight position={[-10, 8, 8]} intensity={0.8} color="#7dd3fc" />
          <OrchestrationGraph />
          <CameraDrift />
          <OrbitControls autoRotate autoRotateSpeed={0.15} enableZoom={false} enablePan={false} enableDamping dampingFactor={0.05} />
        </Canvas>
      )}

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,10,10,0.85) 100%)",
        }}
      />

      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,10,10,0.12) 0%, rgba(5,10,10,0.02) 28%, rgba(5,10,10,0.18) 100%)",
        }}
      />
    </div>
  );
}
