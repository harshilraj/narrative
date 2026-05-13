"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

type Node = {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
};

type Edge = {
  from: string;
  to: string;
  color: string;
};

const NODES: Node[] = [
  { id: "crm", label: "CRM", position: [-28, 12, -10], color: "#5B8EF0" },
  { id: "docs", label: "DOCS", position: [-28, 2, -7], color: "#5B8EF0" },
  { id: "erp", label: "ERP", position: [-28, -8, -11], color: "#5B8EF0" },
  { id: "intake", label: "INTAKE", position: [-10, 5, -3], color: "#8B6CF0" },
  { id: "policy", label: "POLICY", position: [2, 12, -6], color: "#8B6CF0" },
  { id: "rag", label: "RAG", position: [2, 0, -2], color: "#3DB8F5" },
  { id: "review", label: "REVIEW", position: [2, -12, -6], color: "#F59E0B" },
  { id: "action", label: "ACTION", position: [18, 5, -5], color: "#34D399" },
  { id: "monitor", label: "MONITOR", position: [18, -8, -9], color: "#34D399" },
  { id: "archive", label: "AUDIT", position: [30, -1, -13], color: "#3DB8F5" },
];

const EDGES: Edge[] = [
  { from: "crm", to: "intake", color: "#5B8EF0" },
  { from: "docs", to: "intake", color: "#5B8EF0" },
  { from: "erp", to: "intake", color: "#5B8EF0" },
  { from: "intake", to: "policy", color: "#8B6CF0" },
  { from: "intake", to: "rag", color: "#3DB8F5" },
  { from: "intake", to: "review", color: "#F59E0B" },
  { from: "policy", to: "action", color: "#34D399" },
  { from: "rag", to: "action", color: "#34D399" },
  { from: "review", to: "monitor", color: "#F59E0B" },
  { from: "action", to: "monitor", color: "#34D399" },
  { from: "monitor", to: "archive", color: "#3DB8F5" },
  { from: "action", to: "archive", color: "#3DB8F5" },
];

function buildNodeMap() {
  return new Map(NODES.map((node) => [node.id, new THREE.Vector3(...node.position)]));
}

function OperationsTopology({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const packetRef = useRef<THREE.Points>(null);

  const nodeMap = useMemo(buildNodeMap, []);

  const lineObject = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    EDGES.forEach((edge) => {
      const from = nodeMap.get(edge.from);
      const to = nodeMap.get(edge.to);
      if (!from || !to) return;

      const color = new THREE.Color(edge.color);
      positions.push(from.x, from.y, from.z, to.x, to.y, to.z);
      colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.LineSegments(geometry, material);
  }, [nodeMap]);

  const nodeObject = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    NODES.forEach((node) => {
      const color = new THREE.Color(node.color);
      positions.push(...node.position);
      colors.push(color.r, color.g, color.b);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.55,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    return new THREE.Points(geometry, material);
  }, []);

  const packets = useMemo(() => {
    const count = EDGES.length * 4;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const config = Array.from({ length: count }, (_, index) => {
      const edgeIndex = index % EDGES.length;
      const offset = Math.floor(index / EDGES.length) / 4;
      const color = new THREE.Color(EDGES[edgeIndex].color);
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
      return { edgeIndex, offset };
    });

    return { positions, colors, config };
  }, []);

  useFrame((state) => {
    if (!packetRef.current || !groupRef.current) return;

    const elapsed = state.clock.elapsedTime;
    const positions = packetRef.current.geometry.attributes.position.array as Float32Array;

    packets.config.forEach((packet, index) => {
      const edge = EDGES[packet.edgeIndex];
      const from = nodeMap.get(edge.from);
      const to = nodeMap.get(edge.to);
      if (!from || !to) return;

      const phase = (elapsed * 0.16 + packet.offset + packet.edgeIndex * 0.035) % 1;
      const eased = phase * phase * (3 - 2 * phase);
      const x = THREE.MathUtils.lerp(from.x, to.x, eased);
      const y = THREE.MathUtils.lerp(from.y, to.y, eased);
      const z = THREE.MathUtils.lerp(from.z, to.z, eased);

      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = z;
    });

    packetRef.current.geometry.attributes.position.needsUpdate = true;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -0.28 + progress * 0.5, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.08 - progress * 0.12, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, progress * 5 - 2, 0.04);
  });

  return (
    <group ref={groupRef}>
      <primitive object={lineObject} />
      <primitive object={nodeObject} />
      <points ref={packetRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={packets.positions.length / 3} array={packets.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={packets.colors.length / 3} array={packets.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          transparent
          opacity={0.75}
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
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
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 34], fov: 48 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
          <fog attach="fog" args={["#020408", 18, 58]} />
          <OperationsTopology progress={progress} />
        </Canvas>
      </div>

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(2,4,8,0.22) 0%, rgba(2,4,8,0.82) 58%, rgba(2,4,8,0.98) 100%)",
        }}
      />

      <div
        className="absolute inset-0 z-20 pointer-events-none opacity-30"
        style={{
          background:
            "linear-gradient(90deg, rgba(91,142,240,0.08), transparent 26%, transparent 72%, rgba(52,211,153,0.08)), radial-gradient(circle at 55% 35%, rgba(61,184,245,0.08), transparent 38%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay z-30"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />
    </div>
  );
}
