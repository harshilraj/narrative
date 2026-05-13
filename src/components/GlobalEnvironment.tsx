"use client";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type ScrollRef = MutableRefObject<number>;

const STAR_COUNT = 800;
const CLUSTER_COUNT = 5;
const DUST_PER_CLUSTER = 120;
const CONSTELLATION_COUNT = 45;
const SHAPE_DURATION = 12;

const pointVertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aTwinkle;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uTwinkleStrength;

  void main() {
    vColor = color;
    float twinkle = 0.5 + 0.5 * sin(uTime * aTwinkle + aTwinkle * 4.7);
    vAlpha = aAlpha * mix(1.0, twinkle, uTwinkleStrength);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const pointFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function noise(index: number, salt: number) {
  return Math.abs(Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453) % 1;
}

function gaussian(index: number, salt: number) {
  const u = Math.max(0.0001, noise(index, salt));
  const v = Math.max(0.0001, noise(index, salt + 11));
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function createPointMaterial(twinkleStrength: number) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uTwinkleStrength: { value: twinkleStrength },
    },
    vertexShader: pointVertexShader,
    fragmentShader: pointFragmentShader,
  });
}

function StarField({ scrollRef }: { scrollRef: ScrollRef }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const alphas = new Float32Array(STAR_COUNT);
    const twinkles = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3] = (noise(i, 1) - 0.5) * 70;
      positions[i * 3 + 1] = (noise(i, 2) - 0.5) * 50;
      positions[i * 3 + 2] = -5 - noise(i, 3) * 10;
      colors.set([1, 1, 1], i * 3);
      sizes[i] = 0.012 + noise(i, 4) * 0.013;
      alphas[i] = 0.3 + noise(i, 5) * 0.4;
      twinkles[i] = 0.5 + noise(i, 6);
    }

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    bufferGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    bufferGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    bufferGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    bufferGeometry.setAttribute("aTwinkle", new THREE.BufferAttribute(twinkles, 1));
    return bufferGeometry;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.5);
    pointsRef.current.position.y = scrollRef.current * 0.00008;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <primitive object={createPointMaterial(0.45)} ref={materialRef} attach="material" />
    </points>
  );
}

function NebulaDust({ scrollRef }: { scrollRef: ScrollRef }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const nebulaColors = useMemo(
    () => ["#0a2a4a", "#0d1f3c", "#071a2e", "#0f2535", "#061520"].map((color) => new THREE.Color(color)),
    []
  );

  const { geometry, basePositions, clusterMeta } = useMemo(() => {
    const count = CLUSTER_COUNT * DUST_PER_CLUSTER;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    const twinkles = new Float32Array(count);
    const base = new Float32Array(count * 3);
    const meta: Array<{ center: THREE.Vector3; speed: number }> = [];

    for (let cluster = 0; cluster < CLUSTER_COUNT; cluster++) {
      const center = new THREE.Vector3(
        (noise(cluster, 20) - 0.5) * 46,
        (noise(cluster, 21) - 0.5) * 30,
        -7 - noise(cluster, 22) * 8
      );
      meta.push({
        center,
        speed: 0.0001 + noise(cluster, 23) * 0.0002,
      });

      const color = nebulaColors[cluster % nebulaColors.length];
      for (let i = 0; i < DUST_PER_CLUSTER; i++) {
        const index = cluster * DUST_PER_CLUSTER + i;
        const x = gaussian(index, 30) * 3;
        const y = gaussian(index, 31) * 3;
        const z = gaussian(index, 32) * 1.6;
        const px = center.x + x;
        const py = center.y + y;
        const pz = center.z + z;

        base.set([px, py, pz], index * 3);
        positions.set([px, py, pz], index * 3);
        colors.set([color.r, color.g, color.b], index * 3);
        sizes[index] = 0.04 + noise(index, 33) * 0.06;
        alphas[index] = 0.08 + noise(index, 34) * 0.1;
        twinkles[index] = 0.25 + noise(index, 35) * 0.35;
      }
    }

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    bufferGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    bufferGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    bufferGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    bufferGeometry.setAttribute("aTwinkle", new THREE.BufferAttribute(twinkles, 1));
    return { geometry: bufferGeometry, basePositions: base, clusterMeta: meta };
  }, [nebulaColors]);

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;
    const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = positions.array as Float32Array;

    for (let cluster = 0; cluster < CLUSTER_COUNT; cluster++) {
      const meta = clusterMeta[cluster];
      const angle = state.clock.elapsedTime * 60 * meta.speed;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      for (let i = 0; i < DUST_PER_CLUSTER; i++) {
        const index = cluster * DUST_PER_CLUSTER + i;
        const x = basePositions[index * 3] - meta.center.x;
        const z = basePositions[index * 3 + 2] - meta.center.z;
        arr[index * 3] = meta.center.x + x * cos - z * sin;
        arr[index * 3 + 1] = basePositions[index * 3 + 1];
        arr[index * 3 + 2] = meta.center.z + x * sin + z * cos;
      }
    }

    positions.needsUpdate = true;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.5);
    pointsRef.current.position.y = scrollRef.current * 0.00018;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <primitive object={createPointMaterial(0.1)} ref={materialRef} attach="material" />
    </points>
  );
}

function makeShapes() {
  const tree = Array.from({ length: CONSTELLATION_COUNT }, (_, i) => {
    const level = Math.floor(Math.log2(i + 1));
    const indexInLevel = i - (2 ** level - 1);
    const nodesInLevel = Math.max(1, 2 ** level);
    return new THREE.Vector3(
      ((indexInLevel + 0.5) / nodesInLevel - 0.5) * Math.min(16, nodesInLevel * 2.2),
      6 - level * 2.1,
      (noise(i, 70) - 0.5) * 2.4
    );
  });

  const flow = Array.from({ length: CONSTELLATION_COUNT }, (_, i) => {
    const column = i % 9;
    const row = Math.floor(i / 9);
    return new THREE.Vector3(
      -8 + column * 2,
      Math.sin(column * 0.85) * 1.6 + (row - 2) * 1.25,
      (noise(i, 71) - 0.5) * 2
    );
  });

  const hub = Array.from({ length: CONSTELLATION_COUNT }, (_, i) => {
    if (i === 0) return new THREE.Vector3(0, 0, 0);
    const spoke = (i - 1) % 8;
    const ring = Math.floor((i - 1) / 8) + 1;
    const angle = (spoke / 8) * Math.PI * 2;
    const radius = 1.8 + ring * 1.4;
    return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.72, (noise(i, 72) - 0.5) * 2.6);
  });

  return [tree, flow, hub];
}

function shapeEdges(shapeIndex: number) {
  const edges: Array<[number, number]> = [];
  if (shapeIndex === 0) {
    for (let i = 1; i < CONSTELLATION_COUNT; i++) edges.push([Math.floor((i - 1) / 2), i]);
  } else if (shapeIndex === 1) {
    for (let i = 0; i < CONSTELLATION_COUNT - 1; i++) {
      if ((i + 1) % 9 !== 0) edges.push([i, i + 1]);
      if (i + 9 < CONSTELLATION_COUNT && i % 3 === 0) edges.push([i, i + 9]);
    }
  } else {
    for (let i = 1; i < CONSTELLATION_COUNT; i++) {
      edges.push([0, i]);
      if (i > 1 && (i - 1) % 8 !== 0) edges.push([i - 1, i]);
    }
  }
  return edges.slice(0, 56);
}

function ConstellationLayer({ scrollRef }: { scrollRef: ScrollRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const lineRef = useRef<THREE.LineSegments>(null);
  const positionsRef = useRef<THREE.Vector3[]>([]);
  const velocitiesRef = useRef<THREE.Vector3[]>([]);
  const currentShapeRef = useRef(-1);
  const scatterTargetsRef = useRef<THREE.Vector3[]>([]);
  const shapes = useMemo(makeShapes, []);
  const colors = useMemo(() => [new THREE.Color("#00FFB2"), new THREE.Color("#4488ff"), new THREE.Color("#ffffff")], []);
  const nodeGeometry = useMemo(() => new THREE.IcosahedronGeometry(0.04, 1), []);

  const lineGeometry = useMemo(() => {
    const maxEdges = 64;
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(maxEdges * 2 * 3), 3));
    return bufferGeometry;
  }, []);

  useMemo(() => {
    positionsRef.current = Array.from({ length: CONSTELLATION_COUNT }, (_, i) => {
      const pos = new THREE.Vector3((noise(i, 80) - 0.5) * 28, (noise(i, 81) - 0.5) * 18, -2 + (noise(i, 82) - 0.5) * 6);
      return pos;
    });
    velocitiesRef.current = Array.from(
      { length: CONSTELLATION_COUNT },
      (_, i) => new THREE.Vector3((noise(i, 83) - 0.5) * 0.016, (noise(i, 84) - 0.5) * 0.016, (noise(i, 85) - 0.5) * 0.012)
    );
    scatterTargetsRef.current = positionsRef.current.map((pos) => pos.clone());
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !lineRef.current) return;
    const time = state.clock.elapsedTime;
    const loop = time % SHAPE_DURATION;
    const shapeIndex = Math.floor(time / SHAPE_DURATION) % shapes.length;

    if (shapeIndex !== currentShapeRef.current) {
      currentShapeRef.current = shapeIndex;
      scatterTargetsRef.current = Array.from(
        { length: CONSTELLATION_COUNT },
        (_, i) => new THREE.Vector3((noise(i, 90 + shapeIndex) - 0.5) * 30, (noise(i, 94 + shapeIndex) - 0.5) * 18, -2 + (noise(i, 98 + shapeIndex) - 0.5) * 6)
      );
    }

    positionsRef.current.forEach((position, index) => {
      const mesh = nodeRefs.current[index];
      if (!mesh) return;

      if (loop < 4) {
        position.lerp(scatterTargetsRef.current[index], 0.01);
        position.add(velocitiesRef.current[index]);
      } else if (loop < 8) {
        position.lerp(shapes[shapeIndex][index], 0.012);
      } else {
        position.addScaledVector(velocitiesRef.current[index], 0.4);
        position.lerp(scatterTargetsRef.current[index], 0.004);
      }

      mesh.position.copy(position);
      const material = mesh.material as THREE.MeshStandardMaterial;
      const twinkle = 0.5 + Math.sin(time * 0.8 + index) * 0.5;
      material.opacity = 0.4 + twinkle * 0.4;
      material.emissiveIntensity = 0.25 + twinkle * 0.35;
    });

    const edges = shapeEdges(shapeIndex);
    const positionAttr = lineGeometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = positionAttr.array as Float32Array;
    arr.fill(0);

    let lineOpacity = 0;
    if (loop >= 4 && loop < 8) lineOpacity = Math.min(0.25, ((loop - 4) / 2) * 0.25);
    if (loop >= 8 && loop < 9) lineOpacity = Math.max(0, (1 - (loop - 8)) * 0.25);

    edges.forEach(([a, b], index) => {
      const aPos = positionsRef.current[a];
      const bPos = positionsRef.current[b];
      const close = aPos.distanceTo(shapes[shapeIndex][a]) < 0.5 && bPos.distanceTo(shapes[shapeIndex][b]) < 0.5;
      if (!close && loop < 8) return;
      arr.set([aPos.x, aPos.y, aPos.z, bPos.x, bPos.y, bPos.z], index * 6);
    });

    (lineRef.current.material as THREE.LineBasicMaterial).opacity = lineOpacity * 0.6;
    positionAttr.needsUpdate = true;
    groupRef.current.position.y = scrollRef.current * 0.00035;
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#00FFB2" transparent opacity={0} depthWrite={false} />
      </lineSegments>
      {Array.from({ length: CONSTELLATION_COUNT }, (_, index) => {
        const color = colors[index % 10 < 3 ? 0 : index % 10 < 7 ? 1 : 2];
        return (
          <mesh
            key={index}
            ref={(mesh) => {
              nodeRefs.current[index] = mesh;
            }}
            geometry={nodeGeometry}
          >
            <meshStandardMaterial
              transparent
              depthWrite={false}
              color={color}
              emissive={color}
              emissiveIntensity={0.35}
              opacity={0.55}
              roughness={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function CameraDrift({ scrollRef }: { scrollRef: ScrollRef }) {
  const { camera } = useThree();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    camera.position.x = Math.sin(time * 0.04) * 1.5;
    camera.position.y = Math.cos(time * 0.03) * 0.8 + scrollRef.current * 0.0001;
    camera.position.z = 24;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function GlobalEnvironment() {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#02040a]">
      {mounted && (
        <div className="absolute inset-0 opacity-[0.72]">
          <Canvas
            camera={{ position: [0, 0, 24], fov: 50 }}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#02040a" }}
          >
            <color attach="background" args={["#02040a"]} />
            <ambientLight intensity={0.6} />
            <pointLight position={[0, 0, 10]} intensity={1.1} color="#4488ff" />
            <StarField scrollRef={scrollRef} />
            <NebulaDust scrollRef={scrollRef} />
            <ConstellationLayer scrollRef={scrollRef} />
            <CameraDrift scrollRef={scrollRef} />
          </Canvas>
        </div>
      )}

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(2,4,10,0.08) 0%, rgba(2,4,10,0.24) 48%, rgba(2,4,10,0.82) 100%)",
        }}
      />

      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 44% 50% at 50% 50%, rgba(2,4,10,0.58) 0%, rgba(2,4,10,0.2) 52%, transparent 100%)",
        }}
      />
    </div>
  );
}
