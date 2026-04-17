"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getScrollProgress } from "@/lib/smoothScroll";

const CRYSTAL_COUNT = 7;

interface CrystalData {
  angle: number;
  radius: number;
  yOffset: number;
  size: number;
  rotSpeed: THREE.Vector3;
}

function generateCrystals(): CrystalData[] {
  const crystals: CrystalData[] = [];
  for (let i = 0; i < CRYSTAL_COUNT; i++) {
    crystals.push({
      angle: (i / CRYSTAL_COUNT) * Math.PI * 2,
      radius: 3 + Math.random() * 2,
      yOffset: (Math.random() - 0.5) * 2,
      size: 0.4 + Math.random() * 0.4,
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.2
      ),
    });
  }
  return crystals;
}

function Crystal({ data, index }: { data: CrystalData; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const progress = getScrollProgress();
    const time = state.clock.elapsedTime;

    // Visible 0.70 → 0.88
    const fadeIn = progress < 0.70 ? 0 : Math.min(1, (progress - 0.70) / 0.03);
    const fadeOut = progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) / 0.03) : 1;
    const visibility = fadeIn * fadeOut;

    meshRef.current.visible = visibility > 0;
    meshRef.current.scale.setScalar(data.size * visibility);

    // Position in ring around camera path at z=-50
    const baseZ = -50;
    meshRef.current.position.set(
      Math.cos(data.angle + time * 0.1) * data.radius,
      data.yOffset + Math.sin(time * 0.3 + index) * 0.3,
      baseZ + Math.sin(data.angle) * 2
    );

    // Independent rotation
    meshRef.current.rotation.x += data.rotSpeed.x * 0.01;
    meshRef.current.rotation.y += data.rotSpeed.y * 0.01;
    meshRef.current.rotation.z += data.rotSpeed.z * 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#4A6FA5"
        metalness={0.6}
        roughness={0.3}
        emissive="#C9A84C"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

export default function ArenaCrystals() {
  const crystals = useMemo(() => generateCrystals(), []);

  return (
    <group>
      {crystals.map((crystal, i) => (
        <Crystal key={i} data={crystal} index={i} />
      ))}
    </group>
  );
}
