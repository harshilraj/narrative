"use client";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

let scrollY = 0;
let targetScrollY = 0;
let cameraTargetY = 0;
let currentScrollProgress = 0;

type ScrollRef = MutableRefObject<number>;

const DISTANT_STAR_COUNT = 5000;
const MID_STAR_COUNT = 2500;
const NEAR_STAR_COUNT = 600;
const HERO_STAR_COUNT = 40;
const CLUSTER_COUNT = 6;
const DUST_PER_CLUSTER = 800;
const GALAXY_CLUSTER_COUNT = 8;
const GALAXY_PARTICLES_PER_CLUSTER = 60;

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
  const palette = useMemo(() => ["#ffffff", "#ffe4b5", "#b8d4ff", "#8B7FFF"].map((color) => new THREE.Color(color)), []);

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
    () => ["#120d35", "#181045", "#111a3f", "#1a1040", "#0b1230"].map((color) => new THREE.Color(color)),
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
      const center = new THREE.Vector3((noise(cluster, 20) - 0.5) * 60, (noise(cluster, 21) - 0.5) * 260, -9 - noise(cluster, 22) * 8);
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

function GalaxyClusters({ scrollRef }: { scrollRef: ScrollRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRefs = useRef<Array<THREE.Points | null>>([]);
  const materialRefs = useRef<Array<THREE.ShaderMaterial | null>>([]);
  const palette = useMemo(() => [new THREE.Color("#8B7FFF"), new THREE.Color("#4040a0"), new THREE.Color("#ffffff")], []);

  const clusters = useMemo(() => {
    return Array.from({ length: GALAXY_CLUSTER_COUNT }, (_, cluster) => {
      const positions = new Float32Array(GALAXY_PARTICLES_PER_CLUSTER * 3);
      const colors = new Float32Array(GALAXY_PARTICLES_PER_CLUSTER * 3);
      const sizes = new Float32Array(GALAXY_PARTICLES_PER_CLUSTER);
      const alphas = new Float32Array(GALAXY_PARTICLES_PER_CLUSTER);
      const twinkles = new Float32Array(GALAXY_PARTICLES_PER_CLUSTER);

      for (let i = 0; i < GALAXY_PARTICLES_PER_CLUSTER; i++) {
        const index = cluster * 1000 + i;
        positions[i * 3] = gaussian(index, 140) * 3;
        positions[i * 3 + 1] = gaussian(index, 141) * 3;
        positions[i * 3 + 2] = gaussian(index, 142) * 1.5;
        const pick = noise(index, 143);
        const color = palette[pick < 0.3 ? 0 : pick < 0.7 ? 1 : 2];
        colors.set([color.r, color.g, color.b], i * 3);
        sizes[i] = 0.8 + noise(index, 144) * 1.7;
        alphas[i] = 0.3 + noise(index, 145) * 0.3;
        twinkles[i] = 0.4 + noise(index, 146) * 0.7;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
      geometry.setAttribute("aTwinkle", new THREE.BufferAttribute(twinkles, 1));

      return {
        geometry,
        center: new THREE.Vector3((noise(cluster, 150) - 0.5) * 64, (noise(cluster, 151) - 0.5) * 250, -4 - noise(cluster, 152) * 16),
        offset: noise(cluster, 153) * Math.PI * 2,
      };
    });
  }, [palette]);

  useFrame(() => {
    const time = performance.now() * 0.001;
    clusters.forEach((cluster, index) => {
      const points = pointsRefs.current[index];
      const material = materialRefs.current[index];
      if (!points || !material) return;
      points.position.x = cluster.center.x + Math.sin(time * 0.05 + cluster.offset) * 1.2;
      points.position.y = cluster.center.y + Math.cos(time * 0.04 + cluster.offset) * 0.8 + scrollRef.current * 0.00028;
      points.position.z = cluster.center.z;
      points.rotation.z = time * 0.015 + cluster.offset;
      material.uniforms.uTime.value = time;
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.5);
    });
  });

  return (
    <group ref={groupRef}>
      {clusters.map((cluster, index) => (
        <points key={index} geometry={cluster.geometry} ref={(points) => { pointsRefs.current[index] = points; }}>
          <primitive object={createPointMaterial(0.35)} ref={(material: THREE.ShaderMaterial | null) => { materialRefs.current[index] = material; }} attach="material" />
        </points>
      ))}
    </group>
  );
}

function FogPlanes() {
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  const positions = useMemo(
    () => [
      new THREE.Vector3(-12, 42, -8),
      new THREE.Vector3(16, -34, -15),
      new THREE.Vector3(-6, -92, -25),
    ],
    []
  );

  useFrame(() => {
    const time = performance.now() * 0.001;
    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      mesh.position.x = positions[index].x + Math.sin(time * 0.02 + index) * 1.8;
      mesh.position.y = positions[index].y + Math.cos(time * 0.018 + index) * 1.1;
      mesh.rotation.z = Math.sin(time * 0.01 + index) * 0.08;
    });
  });

  return (
    <>
      {positions.map((position, index) => (
        <mesh key={index} position={position} ref={(mesh) => { refs.current[index] = mesh; }}>
          <planeGeometry args={[80, 40, 1, 1]} />
          <meshBasicMaterial color="#1a1040" transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </>
  );
}

function CameraScrollRig({ scrollRef }: { scrollRef: ScrollRef }) {
  const { camera } = useThree();

  useFrame(() => {
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    targetScrollY = scrollY / maxScroll;
    currentScrollProgress += (targetScrollY - currentScrollProgress) * 0.04;
    cameraTargetY = -currentScrollProgress * 120;
    camera.position.y += (cameraTargetY - camera.position.y) * 0.06;
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
      targetScrollY = scrollY / maxScroll;
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
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#02010f]">
      {mounted && (
        <div className="absolute inset-0 opacity-[0.72] pointer-events-none">
          <Canvas
            camera={{ position: [0, 0, 13], fov: 60 }}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#02010f", pointerEvents: "none" }}
          >
            <color attach="background" args={["#02010f"]} />
            <ambientLight intensity={0.6} />
            <pointLight position={[0, 0, 10]} intensity={1.1} color="#8B7FFF" />
            <FogPlanes />
            <ParticleLayer config={distantConfig} scrollRef={scrollRef} />
            <ParticleLayer config={midConfig} scrollRef={scrollRef} />
            <NebulaDust scrollRef={scrollRef} />
            <ParticleLayer config={nearConfig} scrollRef={scrollRef} />
            <HeroStars scrollRef={scrollRef} />
            <GalaxyClusters scrollRef={scrollRef} />
            <CameraScrollRig scrollRef={scrollRef} />
          </Canvas>
        </div>
      )}

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(2,1,15,0.05) 0%, rgba(2,1,15,0.2) 48%, rgba(2,1,15,0.78) 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 44% 50% at 50% 50%, rgba(2,1,15,0.46) 0%, rgba(2,1,15,0.16) 52%, transparent 100%)",
        }}
      />
    </div>
  );
}
