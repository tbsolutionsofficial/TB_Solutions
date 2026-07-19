"use client";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useDeviceTier, type DeviceTier } from "@/hooks/useDeviceTier";

interface FlameProps {
  count: number;
  color: string;
  speed: number;
  spread: number;
  yBase: number;
  yTop: number;
  size: number;
}

function FlameParticles({ count, color, speed, spread, yBase, yTop, size }: FlameProps) {
  const pointsRef = useRef<THREE.Points>(null!);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * spread;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = yBase + Math.random() * (yTop - yBase);
      pos[i * 3 + 2] = Math.sin(angle) * r;
      vel[i] = 0.004 + Math.random() * 0.006;
    }
    return { positions: pos, velocities: vel };
  }, [count, spread, yBase, yTop]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame(() => {
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += velocities[i] * speed;
      arr[i * 3] *= 0.9985;
      arr[i * 3 + 2] *= 0.9985;
      if (arr[i * 3 + 1] > yTop) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * spread * 0.6;
        arr[i * 3] = Math.cos(angle) * r;
        arr[i * 3 + 1] = yBase;
        arr[i * 3 + 2] = Math.sin(angle) * r;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.8}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function TorchMesh({ tier }: { tier: DeviceTier }) {
  const groupRef = useRef<THREE.Group>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (tier !== "high") return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [tier]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.current.x,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.current.y,
      0.04
    );
  });

  const innerCount = tier === "high" ? 200 : tier === "mid" ? 80 : 30;
  const outerCount = tier === "high" ? 120 : tier === "mid" ? 40 : 15;

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.04} floatIntensity={0.18}>
        {/* Handle */}
        <mesh position={[0, -1.0, 0]}>
          <cylinderGeometry args={[0.055, 0.09, 2.2, 12]} />
          <meshStandardMaterial color="#1a1510" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* Grip rings */}
        {([-0.4, -0.8, -1.2] as number[]).map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <torusGeometry args={[0.07, 0.015, 6, 16]} />
            <meshStandardMaterial
              color="#cc785c"
              metalness={0.9}
              roughness={0.2}
              emissive="#cc785c"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}

        {/* Cup bracket */}
        <mesh position={[0, 0.08, 0]}>
          <torusGeometry args={[0.18, 0.04, 8, 24]} />
          <meshStandardMaterial
            color="#cc785c"
            metalness={0.9}
            roughness={0.2}
            emissive="#cc785c"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Flame base glow */}
        <mesh position={[0, 0.28, 0]}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial
            color="#ff9966"
            emissive="#cc785c"
            emissiveIntensity={3.5}
            transparent
            opacity={0.65}
          />
        </mesh>

        {/* Hot white core */}
        <FlameParticles
          count={innerCount}
          color="#fff8e0"
          speed={1.0}
          spread={0.12}
          yBase={0.2}
          yTop={2.3}
          size={0.032}
        />
        {/* Coral mid-flame */}
        <FlameParticles
          count={Math.round(innerCount * 0.65)}
          color="#cc785c"
          speed={0.8}
          spread={0.22}
          yBase={0.1}
          yTop={1.7}
          size={0.048}
        />
        {/* Amber outer smoke */}
        <FlameParticles
          count={outerCount}
          color="#e8a55a"
          speed={0.5}
          spread={0.35}
          yBase={0.08}
          yTop={1.2}
          size={0.07}
        />

        {/* Flame light */}
        <pointLight
          position={[0, 0.6, 0.3]}
          color="#cc785c"
          intensity={tier === "high" ? 4.5 : 2.0}
          distance={8}
          decay={2}
        />
      </Float>

      <Sparkles
        count={tier === "high" ? 60 : tier === "mid" ? 28 : 10}
        scale={7}
        size={0.7}
        speed={0.22}
        color="#e8a55a"
        opacity={0.3}
      />
    </group>
  );
}

function Scene({ tier }: { tier: DeviceTier }) {
  return (
    <>
      <ambientLight color="#fff3d0" intensity={0.2} />
      <TorchMesh tier={tier} />
      {tier === "high" && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.35} luminanceSmoothing={0.9} intensity={1.6} />
        </EffectComposer>
      )}
    </>
  );
}

export default function TorchScene() {
  const { tier } = useDeviceTier();

  return (
    <Canvas
      camera={{ position: [0, 0.3, 4.5], fov: 45 }}
      gl={{ alpha: true, antialias: tier !== "low" }}
      dpr={tier === "high" ? [1, 2] : 1}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <Scene tier={tier} />
    </Canvas>
  );
}
