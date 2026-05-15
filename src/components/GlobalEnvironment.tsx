"use client";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

let scrollY = 0;
let targetScrollY = 0;
let cameraTargetY = 0;
let cameraCurrentY = 0;
let currentScrollProgress = 0;

type ScrollRef = MutableRefObject<number>;

const DISTANT_STAR_COUNT = 5000;
const MID_STAR_COUNT = 2500;
const NEAR_STAR_COUNT = 600;
const HERO_STAR_COUNT = 40;
const CLUSTER_COUNT = 6;
const DUST_PER_CLUSTER = 800;
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
    gl_PointSize = aSize * uPixelRatio * (50.0 / max(1.0, -mvPosition.z));
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

type StarLayerConfig = {
  count: number;
  xRange: number;
  zMin: number;
  zMax: number;
  sizeMin: number;
  sizeMax: number;
  alphaMin: number;
  alphaMax: number;
  scrollSpeed: number;
  twinkle: number;
  salt: number;
};

function ParticleLayer({ config, scrollRef }: { config: StarLayerConfig; scrollRef: ScrollRef }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(config.count * 3);
    const colors = new Float32Array(config.count * 3);
    const sizes = new Float32Array(config.count);
    const alphas = new Float32Array(config.count);
    const twinkles = new Float32Array(config.count);

    for (let i = 0; i < config.count; i++) {
      positions[i * 3] = (noise(i, config.salt) - 0.5) * config.xRange * 2;
      positions[i * 3 + 1] = (noise(i, config.salt + 1) - 0.5) * 300;
      positions[i * 3 + 2] = config.zMin + noise(i, config.salt + 2) * (config.zMax - config.zMin);
      colors.set([1, 1, 1], i * 3);
      sizes[i] = config.sizeMin + noise(i, config.salt + 3) * (config.sizeMax - config.sizeMin);
      alphas[i] = config.alphaMin + noise(i, config.salt + 4) * (config.alphaMax - config.alphaMin);
      twinkles[i] = 0.5 + noise(i, config.salt + 5);
    }

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    bufferGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    bufferGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    bufferGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    bufferGeometry.setAttribute("aTwinkle", new THREE.BufferAttribute(twinkles, 1));
    return bufferGeometry;
  }, [config]);

  useFrame(() => {
    if (!pointsRef.current || !materialRef.current) return;
    const time = performance.now() * 0.001;
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.5);
    pointsRef.current.position.y = scrollRef.current * config.scrollSpeed;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <primitive object={createPointMaterial(config.twinkle)} ref={materialRef} attach="material" />
    </points>
  );
}

function HeroStars({ scrollRef }: { scrollRef: ScrollRef }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const palette = useMemo(() => ["#ffffff", "#ffe4b5", "#b8d4ff", "#00FFB2"].map((color) => new THREE.Color(color)), []);

  const geometry = useMemo(() => {
    const positions = new Float32Array(HERO_STAR_COUNT * 3);
    const colors = new Float32Array(HERO_STAR_COUNT * 3);
    const sizes = new Float32Array(HERO_STAR_COUNT);
    const alphas = new Float32Array(HERO_STAR_COUNT);
    const twinkles = new Float32Array(HERO_STAR_COUNT);

    for (let i = 0; i < HERO_STAR_COUNT; i++) {
      positions[i * 3] = (noise(i, 120) - 0.5) * 80;
      positions[i * 3 + 1] = (noise(i, 121) - 0.5) * 300;
      positions[i * 3 + 2] = -2 + noise(i, 122) * 4;
      const color = palette[i % palette.length];
      colors.set([color.r, color.g, color.b], i * 3);
      sizes[i] = 4 + noise(i, 123) * 5;
      alphas[i] = 0.9 + noise(i, 124) * 0.1;
      twinkles[i] = 2 + noise(i, 125);
    }

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    bufferGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    bufferGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    bufferGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    bufferGeometry.setAttribute("aTwinkle", new THREE.BufferAttribute(twinkles, 1));
    return bufferGeometry;
  }, [palette]);

  useFrame(() => {
    if (!pointsRef.current || !materialRef.current) return;
    const time = performance.now() * 0.001;
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.5);
    pointsRef.current.position.y = scrollRef.current * 0.00035;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <primitive object={createPointMaterial(0.9)} ref={materialRef} attach="material" />
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
        (noise(cluster, 20) - 0.5) * 60,
        (noise(cluster, 21) - 0.5) * 260,
        -9 - noise(cluster, 22) * 8
      );
      meta.push({ center, speed: 0.0001 + noise(cluster, 23) * 0.0002 });

      const color = nebulaColors[cluster % nebulaColors.length];
      for (let i = 0; i < DUST_PER_CLUSTER; i++) {
        const index = cluster * DUST_PER_CLUSTER + i;
        const px = center.x + gaussian(index, 30) * 3;
        const py = center.y + gaussian(index, 31) * 3;
        const pz = center.z + gaussian(index, 32) * 1.6;
        base.set([px, py, pz], index * 3);
        positions.set([px, py, pz], index * 3);
        colors.set([color.r, color.g, color.b], index * 3);
        sizes[index] = 0.8 + noise(index, 33) * 1.6;
        alphas[index] = 0.08 + noise(index, 34) * 0.08;
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

  useFrame(() => {
    if (!pointsRef.current || !materialRef.current) return;
    const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = positions.array as Float32Array;
    const time = performance.now() * 0.001;

    for (let cluster = 0; cluster < CLUSTER_COUNT; cluster++) {
      const meta = clusterMeta[cluster];
      const angle = time * 60 * meta.speed;
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
    materialRef.current.uniforms.uTime.value = time;
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
    return new THREE.Vector3(((indexInLevel + 0.5) / nodesInLevel - 0.5) * Math.min(16, nodesInLevel * 2.2), 6 - level * 2.1, (noise(i, 70) - 0.5) * 2.4);
  });

  const flow = Array.from({ length: CONSTELLATION_COUNT }, (_, i) => {
    const column = i % 9;
    const row = Math.floor(i / 9);
    return new THREE.Vector3(-8 + column * 2, Math.sin(column * 0.85) * 1.6 + (row - 2) * 1.25, (noise(i, 71) - 0.5) * 2);
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
  const positionsRef = useRef<THREE.Vector3[]>(
    Array.from({ length: CONSTELLATION_COUNT }, (_, i) => new THREE.Vector3((noise(i, 80) - 0.5) * 28, (noise(i, 81) - 0.5) * 260, -2 + (noise(i, 82) - 0.5) * 6))
  );
  const velocitiesRef = useRef<THREE.Vector3[]>(
    Array.from({ length: CONSTELLATION_COUNT }, (_, i) => new THREE.Vector3((noise(i, 83) - 0.5) * 0.016, (noise(i, 84) - 0.5) * 0.016, (noise(i, 85) - 0.5) * 0.012))
  );
  const currentShapeRef = useRef(-1);
  const scatterTargetsRef = useRef<THREE.Vector3[]>(positionsRef.current.map((pos) => pos.clone()));
  const shapes = useMemo(makeShapes, []);
  const colors = useMemo(() => [new THREE.Color("#00FFB2"), new THREE.Color("#4488ff"), new THREE.Color("#ffffff")], []);
  const nodeGeometry = useMemo(() => new THREE.IcosahedronGeometry(0.04, 1), []);

  const lineGeometry = useMemo(() => {
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(64 * 2 * 3), 3));
    return bufferGeometry;
  }, []);

  useFrame(() => {
    if (!groupRef.current || !lineRef.current) return;
    const time = performance.now() * 0.001;
    const loop = time % SHAPE_DURATION;
    const shapeIndex = Math.floor(time / SHAPE_DURATION) % shapes.length;

    if (shapeIndex !== currentShapeRef.current) {
      currentShapeRef.current = shapeIndex;
      scatterTargetsRef.current = Array.from({ length: CONSTELLATION_COUNT }, (_, i) => new THREE.Vector3((noise(i, 90 + shapeIndex) - 0.5) * 30, (noise(i, 94 + shapeIndex) - 0.5) * 260, -2 + (noise(i, 98 + shapeIndex) - 0.5) * 6));
    }

    positionsRef.current.forEach((position, index) => {
      const mesh = nodeRefs.current[index];
      if (!mesh) return;
      const target = shapes[shapeIndex][index].clone().setY(shapes[shapeIndex][index].y + cameraCurrentY);

      if (loop < 4) {
        position.lerp(scatterTargetsRef.current[index], 0.01);
        position.add(velocitiesRef.current[index]);
      } else if (loop < 8) {
        position.lerp(target, 0.012);
      } else {
        position.addScaledVector(velocitiesRef.current[index], 0.4);
        position.lerp(scatterTargetsRef.current[index], 0.004);
      }

      mesh.position.copy(position);
      const material = mesh.material as THREE.MeshStandardMaterial;
      const twinkle = 0.5 + Math.sin(time * 0.8 + index) * 0.5;
      material.opacity = 0.45 + twinkle * 0.35;
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
          <mesh key={index} ref={(mesh) => { nodeRefs.current[index] = mesh; }} geometry={nodeGeometry}>
            <meshStandardMaterial transparent depthWrite={false} color={color} emissive={color} emissiveIntensity={0.35} opacity={0.55} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

type ShootingStar = {
  line: THREE.Line;
  frames: number;
  velocity: THREE.Vector3;
};

function ShootingStars() {
  const groupRef = useRef<THREE.Group>(null);
  const starsRef = useRef<ShootingStar[]>([]);
  const nextSpawnRef = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    if (time > nextSpawnRef.current && starsRef.current.length < 2) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 280 + cameraCurrentY;
      const z = -2 + Math.random() * 4;
      const length = 3 + Math.random() * 3;
      const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, y, z), new THREE.Vector3(x - length, y + length * 0.38, z)]);
      const material = new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 1, depthWrite: false });
      const line = new THREE.Line(geometry, material);
      groupRef.current.add(line);
      starsRef.current.push({ line, frames: 0, velocity: new THREE.Vector3(0.8, -0.3, 0) });
      nextSpawnRef.current = time + 4 + Math.random() * 3;
    }

    starsRef.current = starsRef.current.filter((star) => {
      star.frames += 1;
      star.line.position.add(star.velocity);
      if (star.frames > 40) {
        (star.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, 1 - (star.frames - 40) / 20);
      }
      if (star.frames >= 60) {
        groupRef.current?.remove(star.line);
        star.line.geometry.dispose();
        (star.line.material as THREE.LineBasicMaterial).dispose();
        return false;
      }
      return true;
    });
  });

  return <group ref={groupRef} />;
}

function CameraScrollRig({ scrollRef }: { scrollRef: ScrollRef }) {
  const { camera } = useThree();

  useFrame(() => {
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    targetScrollY = scrollY / maxScroll;
    currentScrollProgress += (targetScrollY - currentScrollProgress) * 0.04;
    cameraTargetY = -currentScrollProgress * 120;
    camera.position.y += (cameraTargetY - camera.position.y) * 0.06;
    cameraCurrentY = camera.position.y;
    camera.position.x = Math.sin(currentScrollProgress * Math.PI * 3) * 6;
    camera.position.z = 10 + Math.cos(currentScrollProgress * Math.PI * 2) * 3;
    camera.rotation.z = currentScrollProgress * 0.15;
    camera.lookAt(0, camera.position.y - 2, 0);
    scrollRef.current = scrollY;
  });

  return null;
}

export default function GlobalEnvironment() {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const progress = scrollY / maxScroll;
      targetScrollY = progress;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const distantConfig = useMemo<StarLayerConfig>(() => ({
    count: DISTANT_STAR_COUNT, xRange: 42, zMin: -18, zMax: -10, sizeMin: 0.6, sizeMax: 1.2, alphaMin: 0.55, alphaMax: 0.75, scrollSpeed: 0.00008, twinkle: 0.35, salt: 1,
  }), []);
  const midConfig = useMemo<StarLayerConfig>(() => ({
    count: MID_STAR_COUNT, xRange: 44, zMin: -12, zMax: -5, sizeMin: 1.2, sizeMax: 2.2, alphaMin: 0.65, alphaMax: 0.85, scrollSpeed: 0.00018, twinkle: 0.45, salt: 40,
  }), []);
  const nearConfig = useMemo<StarLayerConfig>(() => ({
    count: NEAR_STAR_COUNT, xRange: 40, zMin: -4, zMax: 2, sizeMin: 2.5, sizeMax: 5, alphaMin: 0.8, alphaMax: 1, scrollSpeed: 0.00035, twinkle: 0.6, salt: 80,
  }), []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#02040a]">
      {mounted && (
        <div className="absolute inset-0 opacity-[0.72] pointer-events-none">
          <Canvas
            camera={{ position: [0, 0, 13], fov: 60 }}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#02040a", pointerEvents: "none" }}
          >
            <color attach="background" args={["#02040a"]} />
            <ambientLight intensity={0.6} />
            <pointLight position={[0, 0, 10]} intensity={1.1} color="#4488ff" />
            <ParticleLayer config={distantConfig} scrollRef={scrollRef} />
            <ParticleLayer config={midConfig} scrollRef={scrollRef} />
            <NebulaDust scrollRef={scrollRef} />
            <ParticleLayer config={nearConfig} scrollRef={scrollRef} />
            <HeroStars scrollRef={scrollRef} />
            <ConstellationLayer scrollRef={scrollRef} />
            <ShootingStars />
            <CameraScrollRig scrollRef={scrollRef} />
          </Canvas>
        </div>
      )}

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(2,4,10,0.05) 0%, rgba(2,4,10,0.18) 48%, rgba(2,4,10,0.75) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 44% 50% at 50% 50%, rgba(2,4,10,0.5) 0%, rgba(2,4,10,0.18) 52%, transparent 100%)",
        }}
      />
    </div>
  );
}
