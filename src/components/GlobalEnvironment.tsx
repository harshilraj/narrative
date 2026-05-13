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
  slot: number;
};

const NODE_COUNT = 55;
const ACTIVE_COUNT = 18;
const EDGE_MIN_DISTANCE = 5;
const EDGE_MAX_DISTANCE = 9;
const MAX_PULSES = 6;
const ACTIVE_COLOR = new THREE.Color("#00FFB2");
const DIM_COLOR = new THREE.Color("#c7d0cf");
const LINE_COLOR = new THREE.Color("#ffffff");

function noise(index: number, salt: number) {
  return Math.abs(Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1;
}

function makeGraph() {
  const nodes: GraphNode[] = Array.from({ length: NODE_COUNT }, (_, id) => {
    const angle = noise(id, 1) * Math.PI * 2;
    const radius = 8 + noise(id, 2) * 10;
    const x = Math.cos(angle) * radius + (noise(id, 3) - 0.5) * 4;
    const y = Math.sin(angle) * radius * 0.6 + (noise(id, 4) - 0.5) * 3;
    const z = (noise(id, 5) - 0.5) * 6;

    return {
      id,
      position: new THREE.Vector3(x, y, z),
      offset: noise(id, 6) * Math.PI * 2,
    };
  });

  const edges: GraphEdge[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const from = nodes[i].position;
      const to = nodes[j].position;
      const distance = from.distanceTo(to);
      const bothInTextZone = Math.abs(from.x) < 6 && Math.abs(from.y) < 3 && Math.abs(to.x) < 6 && Math.abs(to.y) < 3;

      if (distance > EDGE_MIN_DISTANCE && distance < EDGE_MAX_DISTANCE && !bothInTextZone) {
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
    camera.position.x = Math.sin(time * 0.08) * 5;
    camera.position.y = Math.cos(time * 0.06) * 2.5;
    camera.position.z = 24;
    camera.lookAt(scene.position);
  });

  return null;
}

function OrchestrationGraph() {
  const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const pulseRefs = useRef<Array<THREE.Mesh | null>>([]);
  const lineRef = useRef<THREE.LineSegments>(null);
  const nextPulseAt = useRef(0);
  const pulses = useRef<Pulse[]>([]);

  const { nodes, edges } = useMemo(makeGraph, []);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.035, 1), []);
  const pulseGeometry = useMemo(() => new THREE.SphereGeometry(0.07, 16, 16), []);

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
    const positionAttr = lineGeometry.getAttribute("position") as THREE.BufferAttribute;

    nodes.forEach((node, index) => {
      const mesh = nodeRefs.current[index];
      if (!mesh) return;

      const material = mesh.material as THREE.MeshStandardMaterial;
      const pulse = 0.5 + Math.sin(time * 1.6 + node.offset) * 0.5;
      const active = activeNodes.has(index);
      const depthMultiplier = mesh.position.z < -2 ? 0.4 : mesh.position.z > 1 ? 1 : 0.72;
      const opacity = active
        ? (0.28 + pulse * 0.22) * depthMultiplier
        : (0.15 + pulse * 0.2) * depthMultiplier;

      mesh.position.x += Math.sin(time * 0.3 + node.offset) * 0.003;
      mesh.position.y += Math.cos(time * 0.2 + node.offset * 1.3) * 0.002;
      mesh.position.z += Math.sin(time * 0.15 + node.offset * 0.7) * 0.001;

      mesh.scale.setScalar(active ? 1.2 : 1);
      material.opacity = Math.min(active ? 0.5 : 0.35, opacity);
      material.color.copy(active ? ACTIVE_COLOR : DIM_COLOR);
      material.emissive.copy(active ? ACTIVE_COLOR : DIM_COLOR);
      material.emissiveIntensity = active ? 0.25 + pulse * 0.25 : 0.03 + pulse * 0.05;
    });

    const colorAttr = lineGeometry.getAttribute("color") as THREE.BufferAttribute;
    edges.forEach((edge, index) => {
      const fromMesh = nodeRefs.current[edge.from];
      const toMesh = nodeRefs.current[edge.to];
      if (!fromMesh || !toMesh) return;

      const positionIndex = index * 6;
      const colorIndex = index * 6;
      const fromPulse = 0.5 + Math.sin(time * 1.6 + nodes[edge.from].offset) * 0.5;
      const toPulse = 0.5 + Math.sin(time * 1.6 + nodes[edge.to].offset) * 0.5;
      const brightness = 0.55 + ((fromPulse + toPulse) / 2) * 0.45;

      positionAttr.setXYZ(positionIndex / 3, fromMesh.position.x, fromMesh.position.y, fromMesh.position.z);
      positionAttr.setXYZ(positionIndex / 3 + 1, toMesh.position.x, toMesh.position.y, toMesh.position.z);

      for (let i = 0; i < 2; i++) {
        colorAttr.setXYZ(
          colorIndex / 3 + i,
          LINE_COLOR.r * brightness,
          LINE_COLOR.g * brightness,
          LINE_COLOR.b * brightness
        );
      }
    });
    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

    if (time >= nextPulseAt.current) {
      const slot = Array.from({ length: MAX_PULSES }, (_, index) => index).find(
        (index) => !pulses.current.some((pulse) => pulse.slot === index)
      );

      if (slot !== undefined && edges.length > 0) {
        const edge = edges[Math.floor(noise(Math.floor(time * 10), 8) * edges.length)];
        const direction = noise(Math.floor(time * 10), 9) > 0.5;
        pulses.current.push({
          from: direction ? edge.from : edge.to,
          to: direction ? edge.to : edge.from,
          start: time,
          duration: 2,
          slot,
        });
      }

      nextPulseAt.current = time + 1.5;
    }

    pulses.current = pulses.current.filter((pulse) => {
      const mesh = pulseRefs.current[pulse.slot];
      if (!mesh) return time - pulse.start < pulse.duration + 0.3;

      const progress = (time - pulse.start) / pulse.duration;
      const fadeProgress = (time - pulse.start - pulse.duration) / 0.3;
      const from = nodeRefs.current[pulse.from]?.position ?? nodes[pulse.from].position;
      const to = nodeRefs.current[pulse.to]?.position ?? nodes[pulse.to].position;
      const material = mesh.material as THREE.MeshStandardMaterial;

      if (progress <= 1) {
        const eased = progress * progress * (3 - 2 * progress);
        mesh.visible = true;
        mesh.position.lerpVectors(from, to, eased);
        mesh.scale.setScalar(1);
        material.opacity = 1;
        return true;
      }

      if (fadeProgress <= 1) {
        mesh.visible = true;
        mesh.position.copy(to);
        material.opacity = 1 - fadeProgress;
        return true;
      }

      mesh.visible = false;
      return false;
    });
  });

  return (
    <group>
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial transparent opacity={0.1} vertexColors depthWrite={false} />
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

      {Array.from({ length: MAX_PULSES }, (_, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            pulseRefs.current[index] = mesh;
          }}
          geometry={pulseGeometry}
          visible={false}
        >
          <meshStandardMaterial
            transparent
            depthWrite={false}
            color="#00FFB2"
            emissive="#00FFB2"
            emissiveIntensity={3.5}
            opacity={1}
          />
        </mesh>
      ))}
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
          <OrbitControls autoRotate autoRotateSpeed={0.4} enableZoom={false} enablePan={false} enableDamping dampingFactor={0.05} />
        </Canvas>
      )}

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(5,10,10,0.5) 55%, rgba(5,10,10,0.92) 100%)",
        }}
      />

      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 45% 55% at 50% 52%, rgba(5,10,10,0.45) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
